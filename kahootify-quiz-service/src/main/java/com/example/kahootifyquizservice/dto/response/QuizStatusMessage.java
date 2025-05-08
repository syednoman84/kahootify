package com.example.kahootifyquizservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class QuizStatusMessage {
    private String status; // e.g., "QUIZ_STARTED", "QUIZ_ENDED"
    private Long quizId;
    private String title;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

}

