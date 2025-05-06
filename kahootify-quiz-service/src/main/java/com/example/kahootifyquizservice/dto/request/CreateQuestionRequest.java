package com.example.kahootifyquizservice.dto.request;

import com.example.kahootifyquizservice.enums.QuestionType;
import lombok.Data;

@Data
public class CreateQuestionRequest {
    private String text;
    private QuestionType type;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;
}
