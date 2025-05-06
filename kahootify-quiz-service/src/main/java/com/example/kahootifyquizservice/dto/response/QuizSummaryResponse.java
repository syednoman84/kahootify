package com.example.kahootifyquizservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizSummaryResponse {
    private String username;
    private String quizTitle;
    private int totalQuestions;
    private int correctAnswers;
    private int totalScore;
    private int rank;
}
