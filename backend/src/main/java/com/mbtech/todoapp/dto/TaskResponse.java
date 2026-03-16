package com.mbtech.todoapp.dto;

import com.mbtech.todoapp.model.Task;

import java.time.LocalDateTime;

public record TaskResponse(
    Long id,
    String title,
    String description,
    boolean completed,
    LocalDateTime createdAt
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.isCompleted(),
            task.getCreatedAt()
        );
    }
}
