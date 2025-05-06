package com.example.kahootifyquizservice.dto.request;

import lombok.Data;

@Data
public class AnswerRequest {
    private Long quizId;
    private Long questionId;
    private String selectedAnswer;
    private long timeTakenMillis;
}

