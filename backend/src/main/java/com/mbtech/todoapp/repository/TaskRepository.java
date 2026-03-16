package com.mbtech.todoapp.repository;

import com.mbtech.todoapp.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Leverages the composite index (completed, created_at DESC) defined on Task entity
    List<Task> findTop5ByCompletedFalseOrderByCreatedAtDesc();

    long countByCompletedFalse();
}
