package com.tinyjira.kanban.security.aspect;

import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.*;
import com.tinyjira.kanban.repository.*;
import com.tinyjira.kanban.security.annotation.RequireProjectRole;
import com.tinyjira.kanban.utils.ProjectRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class ProjectSecurityAspect {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final BoardRepository boardRepository;
    private final TaskRepository taskRepository;
    private final BoardColumnRepository columnRepository;
    private final SprintRepository sprintRepository;

    @Before("@annotation(com.tinyjira.kanban.security.annotation.RequireProjectRole)")
    public void checkProjectPermission(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RequireProjectRole annotation = method.getAnnotation(RequireProjectRole.class);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email;
        
        if (authentication == null || !authentication.isAuthenticated()) {
             throw new AccessDeniedException("User is not authenticated");
        }

        if (authentication.getPrincipal() instanceof Jwt jwt) {
            email = jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof User user) {
            email = user.getEmail();
        } else if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User userDetails) {
             email = userDetails.getUsername();
        } else {
            email = authentication.getName();
        }
        
        log.info("Checking permission for user email: {}", email);

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        Long projectId = resolveProjectId(joinPoint, signature, annotation);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        ProjectRole userRole = project.getRole(currentUser);
        
        if (userRole == null) {
             throw new AccessDeniedException("You are not a member of this project.");
        }
        
        List<ProjectRole> allowedRoles = Arrays.asList(annotation.value());
        
        if (userRole == ProjectRole.PROJECT_MANAGER) {
            return;
        }
        
        if (!allowedRoles.contains(userRole)) {
            throw new AccessDeniedException("Access Denied: You do not have the required role " + allowedRoles + ". Your role is: " + userRole);
        }
    }

    private Long resolveProjectId(JoinPoint joinPoint, MethodSignature signature, RequireProjectRole annotation) {
        Object[] args = joinPoint.getArgs();
        String[] paramNames = signature.getParameterNames();
        
        Long projectId = getParamValue(args, paramNames, annotation.projectIdParam());
        if (projectId != null) return projectId;
        
        Long boardId = getParamValue(args, paramNames, annotation.boardIdParam());
        if (boardId != null) {
            return boardRepository.findById(boardId)
                    .map(b -> b.getProject().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        }
        
        Long taskId = getParamValue(args, paramNames, annotation.taskIdParam());
        if (taskId != null) {
            return taskRepository.findById(taskId)
                    .map(t -> t.getBoard().getProject().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        }
        
        Long columnId = getParamValue(args, paramNames, annotation.columnIdParam());
        if (columnId != null) {
            return columnRepository.findById(columnId)
                    .map(c -> c.getBoard().getProject().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Column not found"));
        }
        
        Long sprintId = getParamValue(args, paramNames, annotation.sprintIdParam());
        if (sprintId != null) {
            return sprintRepository.findById(sprintId)
                    .map(s -> s.getBoard().getProject().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        }
        
       
        if (args.length > 0 && args[0] != null) {
             try {
                 Method getProjectId = args[0].getClass().getMethod("getProjectId");
                 Object id = getProjectId.invoke(args[0]);
                 if (id instanceof Long) return (Long) id;
             } catch (Exception ignored) {
                 // Ignore if method not found
             }
             
             try {
                 Method getBoardId = args[0].getClass().getMethod("getBoardId");
                 Object id = getBoardId.invoke(args[0]);
                 if (id instanceof Long) {
                      return boardRepository.findById((Long) id)
                        .map(b -> b.getProject().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
                 }
             } catch (Exception ignored) {}
        }

        throw new IllegalArgumentException("Could not resolve Project ID from method arguments. Please check annotation configuration.");
    }

    private Long getParamValue(Object[] args, String[] paramNames, String targetParamName) {
        if (targetParamName == null || targetParamName.isEmpty()) return null;
        
        for (int i = 0; i < paramNames.length; i++) {
            if (paramNames[i].equals(targetParamName)) {
                if (args[i] instanceof Long) {
                    return (Long) args[i];
                }
            }
        }
        return null;
    }
}
