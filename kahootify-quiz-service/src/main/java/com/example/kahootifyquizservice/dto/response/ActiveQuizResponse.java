package com.example.kahootifyquizservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActiveQuizResponse {
    private Long quizId;
    private String title;
    private int totalQuestions;
    private boolean active;
}
