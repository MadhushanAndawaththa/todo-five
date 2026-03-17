package com.mbtech.todoapp.service;

import com.mbtech.todoapp.dto.CreateTaskRequest;
import com.mbtech.todoapp.dto.TaskResponse;
import com.mbtech.todoapp.exception.TaskNotFoundException;
import com.mbtech.todoapp.model.Task;
import com.mbtech.todoapp.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TaskService Unit Tests")
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task mockTask;

    @BeforeEach
    void setUp() {
        mockTask = new Task("Buy groceries", "Milk, eggs, and bread");
    }

    @Test
    @DisplayName("createTask - should save task and return mapped response")
    void createTask_shouldSaveAndReturnTaskResponse() {
        when(taskRepository.save(any(Task.class))).thenReturn(mockTask);

        CreateTaskRequest request = new CreateTaskRequest("Buy groceries", "Milk, eggs, and bread");
        TaskResponse response = taskService.createTask(request);

        assertThat(response.title()).isEqualTo("Buy groceries");
        assertThat(response.description()).isEqualTo("Milk, eggs, and bread");
        assertThat(response.completed()).isFalse();
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("getRecentIncompleteTasks - should return mapped list from repository")
    void getRecentIncompleteTasks_shouldReturnMappedList() {
        Task secondTask = new Task("Walk the dog", "30 minute walk");
        when(taskRepository.findTop5ByCompletedFalseOrderByCreatedAtDesc())
            .thenReturn(List.of(mockTask, secondTask));

        List<TaskResponse> result = taskService.getRecentIncompleteTasks();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).title()).isEqualTo("Buy groceries");
        assertThat(result.get(1).title()).isEqualTo("Walk the dog");
    }

    @Test
    @DisplayName("getRecentIncompleteTasks - should return empty list when no tasks")
    void getRecentIncompleteTasks_shouldReturnEmptyList() {
        when(taskRepository.findTop5ByCompletedFalseOrderByCreatedAtDesc())
            .thenReturn(Collections.emptyList());

        List<TaskResponse> result = taskService.getRecentIncompleteTasks();

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("completeTask - should mark task as completed and save")
    void completeTask_shouldMarkCompletedAndSave() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(mockTask));
        when(taskRepository.save(mockTask)).thenReturn(mockTask);

        taskService.completeTask(1L);

        assertThat(mockTask.isCompleted()).isTrue();
        verify(taskRepository).save(mockTask);
    }

    @Test
    @DisplayName("completeTask - should throw TaskNotFoundException for non-existent id")
    void completeTask_shouldThrowForUnknownId() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.completeTask(999L))
            .isInstanceOf(TaskNotFoundException.class)
            .hasMessageContaining("999");
    }

    @Test
    @DisplayName("countIncompleteTasks - should return count from repository")
    void countIncompleteTasks_shouldReturnCount() {
        when(taskRepository.countByCompletedFalse()).thenReturn(7L);

        long count = taskService.countIncompleteTasks();

        assertThat(count).isEqualTo(7L);
        verify(taskRepository, times(1)).countByCompletedFalse();
    }

    @Test
    @DisplayName("countIncompleteTasks - should return zero when no incomplete tasks")
    void countIncompleteTasks_shouldReturnZeroWhenEmpty() {
        when(taskRepository.countByCompletedFalse()).thenReturn(0L);

        long count = taskService.countIncompleteTasks();

        assertThat(count).isEqualTo(0L);
    }
}
