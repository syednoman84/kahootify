package com.example.kahootifyquizservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionViewResponse {
    private Long id;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC; // can be null for TRUE_FALSE
    private String optionD; // can be null for TRUE_FALSE
    private int totalQuestions;
    private int currentQuestionNumber;
}
