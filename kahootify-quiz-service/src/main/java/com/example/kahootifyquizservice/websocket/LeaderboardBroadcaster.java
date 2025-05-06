package com.example.kahootifyquizservice.websocket;

import com.example.kahootifyquizservice.dto.response.LeaderboardEntryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class LeaderboardBroadcaster {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastLeaderboard(Long quizId, List<LeaderboardEntryResponse> leaderboard) {
        messagingTemplate.convertAndSend("/topic/leaderboard/" + quizId, leaderboard);
    }
}
