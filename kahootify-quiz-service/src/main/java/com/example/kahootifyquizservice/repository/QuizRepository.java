package com.example.kahootifyquizservice.repository;

import com.example.kahootifyquizservice.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    Optional<Quiz> findFirstByActiveTrueOrderByStartedAtDesc();

}

