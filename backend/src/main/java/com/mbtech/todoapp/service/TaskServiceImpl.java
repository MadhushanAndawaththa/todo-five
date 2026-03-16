package com.mbtech.todoapp.service;

import com.mbtech.todoapp.dto.CreateTaskRequest;
import com.mbtech.todoapp.dto.TaskResponse;
import com.mbtech.todoapp.exception.TaskNotFoundException;
import com.mbtech.todoapp.model.Task;
import com.mbtech.todoapp.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private static final Logger log = LoggerFactory.getLogger(TaskServiceImpl.class);

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public TaskResponse createTask(CreateTaskRequest request) {
        log.info("Creating task with title: '{}'", request.title());
        Task task = new Task(request.title(), request.description());
        Task saved = taskRepository.save(task);
        log.info("Task created with id: {}", saved.getId());
        return TaskResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getRecentIncompleteTasks() {
        log.debug("Fetching 5 most recent incomplete tasks");
        return taskRepository.findTop5ByCompletedFalseOrderByCreatedAtDesc()
            .stream()
            .map(TaskResponse::from)
            .toList();
    }

    @Override
    public TaskResponse completeTask(Long id) {
        log.info("Marking task {} as completed", id);
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new TaskNotFoundException(id));
        task.markCompleted();
        return TaskResponse.from(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public long countIncompleteTasks() {
        return taskRepository.countByCompletedFalse();
    }
}
