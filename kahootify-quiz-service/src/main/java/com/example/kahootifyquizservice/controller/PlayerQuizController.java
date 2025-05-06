package com.example.kahootifyquizservice.controller;

import com.example.kahootifyquizservice.dto.request.AnswerRequest;
import com.example.kahootifyquizservice.dto.response.ActiveQuizResponse;
import com.example.kahootifyquizservice.dto.response.LeaderboardEntryResponse;
import com.example.kahootifyquizservice.dto.response.QuestionViewResponse;
import com.example.kahootifyquizservice.dto.response.QuizSummaryResponse;
import com.example.kahootifyquizservice.entity.QuizResult;
import com.example.kahootifyquizservice.service.QuizService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/player/quiz")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
public class PlayerQuizController {

    private final QuizService quizService;

    @GetMapping("/waiting")
    public ResponseEntity<ActiveQuizResponse> getWaitingQuiz() {
        return ResponseEntity.ok(quizService.getActiveQuiz());
    }

    @GetMapping("/{quizId}/question/{sequenceNumber}")
    public ResponseEntity<QuestionViewResponse> getQuestion(
            @PathVariable Long quizId,
            @PathVariable int sequenceNumber) {
        return ResponseEntity.ok(quizService.getQuestion(quizId, sequenceNumber));
    }

    @PostMapping("/answer/submit")
    public ResponseEntity<?> submitAnswer(
            @RequestBody AnswerRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        quizService.submitAnswer(request, token);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/results")
    public List<QuizResult> getMyResults(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        return quizService.getResultsForUser(token);
    }

    @GetMapping("/{quizId}/summary")
    public QuizSummaryResponse getQuizSummary(@PathVariable Long quizId,
                                              @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        return quizService.getQuizSummaryForUser(quizId, token);
    }

    @GetMapping("/{quizId}/leaderboard")
    public ResponseEntity<List<LeaderboardEntryResponse>> getLeaderboard(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getLeaderboard(quizId));
    }

}
