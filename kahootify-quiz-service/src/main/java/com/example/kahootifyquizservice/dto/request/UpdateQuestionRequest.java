package com.example.kahootifyquizservice.dto.request;

import lombok.Data;

@Data
public class UpdateQuestionRequest {
    private String text;
    private String optionA;
    private String optionB;
    private String optionC; // Nullable for true/false
    private String optionD; // Nullable for true/false
    private String correctAnswer;
}
