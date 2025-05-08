package com.example.kahootifyquizservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class QuizAdminResponse {
    private Long id;
    private String title;
    private boolean active;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private int totalQuestions;
}
