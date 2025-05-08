package com.example.kahootifyquizservice.websocket;

import com.example.kahootifyquizservice.dto.response.QuizStatusMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class QuizStatusBroadcaster {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastQuizStarted(Long quizId, String title, LocalDateTime startedAt, LocalDateTime endedAt) {
        QuizStatusMessage message = new QuizStatusMessage("QUIZ_STARTED", quizId, title, startedAt, endedAt);
        messagingTemplate.convertAndSend("/topic/quiz-status", message);
    }

    public void broadcastQuizEnded(Long quizId, String title, LocalDateTime startedAt, LocalDateTime endedAt) {
        QuizStatusMessage message = new QuizStatusMessage("QUIZ_ENDED", quizId, title, startedAt, endedAt);
        messagingTemplate.convertAndSend("/topic/quiz-status", message);
    }
}
