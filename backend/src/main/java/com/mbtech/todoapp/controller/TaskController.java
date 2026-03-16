package com.mbtech.todoapp.controller;

import com.mbtech.todoapp.dto.CreateTaskRequest;
import com.mbtech.todoapp.dto.TaskResponse;
import com.mbtech.todoapp.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "Task management endpoints")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskResponse response = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get 5 most recent incomplete tasks")
    public ResponseEntity<List<TaskResponse>> getRecentTasks() {
        return ResponseEntity.ok(taskService.getRecentIncompleteTasks());
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Mark a task as completed")
    public ResponseEntity<TaskResponse> completeTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.completeTask(id));
    }

    @GetMapping("/count")
    @Operation(summary = "Count total incomplete tasks")
    public ResponseEntity<Map<String, Long>> countIncompleteTasks() {
        return ResponseEntity.ok(Map.of("count", taskService.countIncompleteTasks()));
    }
}
