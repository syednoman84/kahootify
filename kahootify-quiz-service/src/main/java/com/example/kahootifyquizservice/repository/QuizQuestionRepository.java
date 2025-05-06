package com.example.kahootifyquizservice.repository;

import com.example.kahootifyquizservice.entity.Quiz;
import com.example.kahootifyquizservice.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    int countByQuiz(Quiz quiz);

    Optional<QuizQuestion> findByQuizAndSequenceOrder(Quiz quiz, int sequenceOrder);

}
