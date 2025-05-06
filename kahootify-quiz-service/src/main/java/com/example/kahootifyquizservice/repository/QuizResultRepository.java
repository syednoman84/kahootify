package com.example.kahootifyquizservice.repository;

import com.example.kahootifyquizservice.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByQuizIdOrderByScoreDescTotalTimeMsAsc(Long quizId);
    List<QuizResult> findByUserId(Long userId);

}
