package com.mbtech.todoapp.service;

import com.mbtech.todoapp.dto.CreateTaskRequest;
import com.mbtech.todoapp.dto.TaskResponse;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request);

    List<TaskResponse> getRecentIncompleteTasks();

    TaskResponse completeTask(Long id);

    long countIncompleteTasks();
}
