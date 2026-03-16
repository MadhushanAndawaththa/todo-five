package com.mbtech.todoapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mbtech.todoapp.dto.CreateTaskRequest;
import com.mbtech.todoapp.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("TaskController Integration Tests")
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void cleanDatabase() {
        taskRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/tasks - should create task and return 201")
    void createTask_shouldReturn201WithCreatedTask() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest("Buy groceries", "Milk, eggs, and bread");

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.title").value("Buy groceries"))
            .andExpect(jsonPath("$.description").value("Milk, eggs, and bread"))
            .andExpect(jsonPath("$.completed").value(false))
            .andExpect(jsonPath("$.createdAt").exists());
    }

    @Test
    @DisplayName("POST /api/tasks - should return 400 when title is blank")
    void createTask_shouldReturn400WhenTitleBlank() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest("", "Some description");

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Validation failed"))
            .andExpect(jsonPath("$.fields.title").exists());
    }

    @Test
    @DisplayName("POST /api/tasks - should return 400 when description is blank")
    void createTask_shouldReturn400WhenDescriptionBlank() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest("Valid title", "");

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fields.description").exists());
    }

    @Test
    @DisplayName("GET /api/tasks - should return only incomplete tasks, max 5")
    void getTasks_shouldReturnOnlyIncomplete_max5() throws Exception {
        // Create 7 tasks
        for (int i = 1; i <= 7; i++) {
            createTask("Task " + i, "Description " + i);
        }

        mockMvc.perform(get("/api/tasks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(5)))
            .andExpect(jsonPath("$[*].completed", everyItem(is(false))));
    }

    @Test
    @DisplayName("GET /api/tasks - should return tasks ordered by most recent first")
    void getTasks_shouldReturnMostRecentFirst() throws Exception {
        createTask("First task", "desc");
        Thread.sleep(50); // ensure distinct timestamps
        createTask("Second task", "desc");

        mockMvc.perform(get("/api/tasks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Second task"))
            .andExpect(jsonPath("$[1].title").value("First task"));
    }

    @Test
    @DisplayName("GET /api/tasks - should exclude completed tasks")
    void getTasks_shouldExcludeCompletedTasks() throws Exception {
        // Create and complete a task
        String response = mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateTaskRequest("Completed task", "desc"))))
            .andReturn().getResponse().getContentAsString();

        Long taskId = objectMapper.readTree(response).get("id").asLong();
        mockMvc.perform(patch("/api/tasks/" + taskId + "/complete"));

        // Create an active task
        createTask("Active task", "desc");

        mockMvc.perform(get("/api/tasks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].title").value("Active task"));
    }

    @Test
    @DisplayName("PATCH /api/tasks/{id}/complete - should mark task as completed")
    void completeTask_shouldReturn200WithCompletedTask() throws Exception {
        String response = mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateTaskRequest("Buy milk", "2% milk"))))
            .andReturn().getResponse().getContentAsString();

        Long taskId = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(patch("/api/tasks/" + taskId + "/complete"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.completed").value(true))
            .andExpect(jsonPath("$.id").value(taskId));
    }

    @Test
    @DisplayName("PATCH /api/tasks/{id}/complete - should return 404 for non-existent task")
    void completeTask_shouldReturn404ForUnknownId() throws Exception {
        mockMvc.perform(patch("/api/tasks/999999/complete"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value(containsString("999999")));
    }

    @Test
    @DisplayName("GET /api/tasks - should return empty list when no tasks")
    void getTasks_shouldReturnEmptyListWhenNoTasks() throws Exception {
        mockMvc.perform(get("/api/tasks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(0)));
    }

    private void createTask(String title, String description) throws Exception {
        mockMvc.perform(post("/api/tasks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(new CreateTaskRequest(title, description))));
    }
}
