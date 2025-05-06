package com.example.kahootifyquizservice.repository;

import com.example.kahootifyquizservice.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
    boolean existsByUserIdAndQuizIdAndQuestionId(Long userId, Long quizId, Long questionId);
    List<UserAnswer> findByQuizId(Long quizId);

}
