package com.example.kahootifyquizservice.repository;

import com.example.kahootifyquizservice.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    Optional<Quiz> findFirstByActiveTrueOrderByStartedAtDesc();

    @Query("SELECT q FROM Quiz q ORDER BY q.id DESC")
    List<Quiz> findAllOrderByIdDesc();


}

