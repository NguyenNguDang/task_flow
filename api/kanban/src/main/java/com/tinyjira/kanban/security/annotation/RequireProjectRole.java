package com.tinyjira.kanban.security.annotation;

import com.tinyjira.kanban.utils.ProjectRole;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireProjectRole {
    ProjectRole[] value();
    String projectIdParam() default "projectId";
    String boardIdParam() default "";
    String taskIdParam() default "";
    String columnIdParam() default "";
    String sprintIdParam() default "";
}
