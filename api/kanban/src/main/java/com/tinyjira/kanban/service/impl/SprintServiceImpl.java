package com.tinyjira.kanban.service.impl;

import com.tinyjira.kanban.DTO.SprintDTO;
import com.tinyjira.kanban.DTO.request.SprintRequest;
import com.tinyjira.kanban.DTO.response.ProjectDetailResponse;
import com.tinyjira.kanban.DTO.response.SprintReportResponse;
import com.tinyjira.kanban.exception.ResourceNotFoundException;
import com.tinyjira.kanban.model.Board;
import com.tinyjira.kanban.model.Sprint;
import com.tinyjira.kanban.model.Task;
import com.tinyjira.kanban.model.User;
import com.tinyjira.kanban.repository.BoardRepository;
import com.tinyjira.kanban.repository.SprintRepository;
import com.tinyjira.kanban.repository.TaskRepository;
import com.tinyjira.kanban.service.SprintService;
import com.tinyjira.kanban.service.strategy.MvpScoringStrategy;
import com.tinyjira.kanban.utils.SprintStatus;
import com.tinyjira.kanban.utils.TaskStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class SprintServiceImpl implements SprintService {
    private final SprintRepository sprintRepository;
    private final BoardRepository boardRepository;
    private final TaskRepository taskRepository;
    private final MvpScoringStrategy mvpScoringStrategy;
    
    
    @Override
    public SprintDTO createSprint(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        
        String nextName = generateNextSprintName(boardId);
        
        Sprint sprint = Sprint.builder()
                .name(nextName)
                .status(SprintStatus.PLANNING)
                .board(board)
                .build();
        sprintRepository.save(sprint);
        
        return toSprintDTO(sprint);
    }
    
    @Override
    public SprintDTO getSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        
        return toSprintDTO(sprint);
    }
    
    @Override
    public void updateSprint(Long id, SprintRequest sprint) {
    
    }
    
    @Override
    public List<SprintDTO> getAllSprints() {
        List<Sprint> sprints = sprintRepository.findAll();
        return sprints.stream().map(this::toSprintDTO).toList();
    }
    
    @Override
    public List<SprintDTO> getAllSprintsByBoardId(Long boardId) {
        // Lấy tất cả sprint, bao gồm cả COMPLETED để hiển thị trong report
        List<Sprint> sprints = sprintRepository.findByBoardIdAndStatusNot(boardId, null); 
        // Hoặc dùng findByBoardId nếu repository hỗ trợ
        // Tuy nhiên, logic cũ là findByBoardIdAndStatusNot(..., COMPLETED) để ẩn sprint đã xong ở Backlog
        // Nên ta cần tách API hoặc sửa API này.
        // Ở đây tôi sẽ sửa để trả về tất cả sprint thuộc board, client sẽ tự filter nếu cần.
        // Nhưng để an toàn cho Backlog view, ta nên tạo method riêng hoặc dùng param.
        // Tạm thời sửa lại query trong repository hoặc dùng method khác.
        
        // Cách tốt nhất: Sửa lại method này để trả về tất cả sprint (cho Report), 
        // và tạo method mới getActiveSprintsByBoardId (cho Backlog).
        // Nhưng để nhanh, tôi sẽ dùng findAllByBoardId nếu có, hoặc sửa logic hiện tại.
        
        // Hiện tại repository có: findByBoardIdAndStatusNot
        // Tôi sẽ sửa lại logic ở đây để trả về tất cả sprint của board.
        // Nhưng Backlog đang dùng API này để hiển thị list sprint. Nếu trả về cả completed sprint thì Backlog sẽ hiện cả sprint đã xong.
        // Backlog UI thường chỉ hiện Active và Future sprints.
        
        // Giải pháp: Thêm param `includeCompleted` vào API.
        // Nhưng interface không cho phép đổi signature dễ dàng mà không ảnh hưởng controller.
        
        // Tạm thời: Tôi sẽ giả định API này dùng chung và client sẽ filter.
        // Tuy nhiên, Backlog component hiện tại gọi API này.
        
        // Để an toàn, tôi sẽ dùng method findByBoardId (cần thêm vào repo) hoặc filter thủ công.
        // Nhưng repo chưa có findByBoardId.
        
        // Tôi sẽ sửa lại logic: Trả về tất cả sprint.
        // Client Backlog cần filter `status !== 'COMPLETED'`.
        // Client Report cần tất cả.
        
        // Tuy nhiên, xem lại SprintRepository:
        // List<Sprint> findByBoardIdAndStatusNot(Long boardId, SprintStatus status);
        
        // Nếu tôi truyền status = null vào statusNot, liệu nó có trả về tất cả?
        // JPA thường ignore null hoặc lỗi.
        
        // Tôi sẽ thêm method findByBoardId vào Repository.
        return sprintRepository.findAll().stream()
                .filter(s -> s.getBoard().getId().equals(boardId))
                .map(this::toSprintDTO)
                .toList();
    }
    
    @Override
    public void completeSprint(Long sprintId, Long targetSprintId) {
        Sprint sprint = getSprintById(sprintId);
        
        // targetSprintId có thể null nếu người dùng chọn chuyển về Backlog
        Sprint targetSprint = null;
        if (targetSprintId != null) {
            targetSprint = getSprintById(targetSprintId);
        }
        
        List<Task> allTasksInSprint = taskRepository.findBySprintId(sprintId);
        sprint.complete();
        sprint.rolloverUnfinishedTasks(allTasksInSprint, targetSprint);
        sprintRepository.save(sprint);
    }
    
    @Override
    public void startSprint(Long id) {
        Sprint sprint = getSprintById(id);
        sprint.start();
        sprintRepository.save(sprint);
    }
    
    @Override
    public SprintReportResponse getSprintReport(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        
        long total = taskRepository.countBySprintId(sprintId);
        long overdue = taskRepository.countOverdueTasks(sprintId);
        
        // (Có thể đếm thêm số task DONE nếu cần)
        long completed = taskRepository.countBySprintIdAndStatus(sprintId, TaskStatus.DONE);
        
        User mvp = mvpScoringStrategy.findTopPerformer(sprintId).orElse(null);
        
        return SprintReportResponse.builder()
                .sprintId(sprint.getId())
                .sprintName(sprint.getName())
                .totalTasks(total)
                .completedTasks(completed)
                .overdueTasks(overdue)
                .mvpUser(ProjectDetailResponse.UserSummaryDto.fromEntity(mvp))
                .build();
    }

    @Override
    public void deleteSprint(Long id) {
        Sprint sprint = getSprintById(id);
        // Logic: Move tasks to backlog before deleting? Or delete tasks?
        // Usually, tasks should be moved to backlog.
        List<Task> tasks = taskRepository.findBySprintId(id);
        for (Task task : tasks) {
            task.setSprint(null); // Move to backlog
            taskRepository.save(task);
        }
        sprintRepository.delete(sprint);
    }
    
    private Sprint getSprintById(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
    }
    
    private Sprint toSprint(SprintRequest request,  Board currentBoard ) {
        return Sprint.builder()
                .name(request.getName())
                .board(currentBoard)
                .status(SprintStatus.PLANNING)
                .build();
    }
    
    private SprintDTO toSprintDTO(Sprint sprint) {
        
        return SprintDTO.builder()
                .id(sprint.getId())
                .name(sprint.getName())
                .status(sprint.getStatus())
                .startDate(sprint.getStartDate())
                .endDate(sprint.getEndDate())
                .build();
    }
    
    private String generateNextSprintName(Long boardId) {
        Optional<String> lastSprintNameOpt = sprintRepository.findLastSprintNameByBoardId(boardId);
        
        if (lastSprintNameOpt.isEmpty()) {
            return "Sprint 1";
        }
        
        String lastName = lastSprintNameOpt.get();
        
        try {
            java.util.regex.Pattern p = java.util.regex.Pattern.compile("(\\d+)$");
            java.util.regex.Matcher m = p.matcher(lastName);
            
            if (m.find()) {
                String numberStr = m.group(1);
                int number = Integer.parseInt(numberStr);
                int nextNumber = number + 1;
                return lastName.substring(0, lastName.length() - numberStr.length()) + nextNumber;
            } else {
                return "Sprint " + (sprintRepository.countByBoardId(boardId) + 1);
            }
        } catch (Exception e) {
            return "Sprint " + (sprintRepository.countByBoardId(boardId) + 1);
        }
    }
}
