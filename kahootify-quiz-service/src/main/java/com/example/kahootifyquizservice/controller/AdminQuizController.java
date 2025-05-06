package com.example.kahootifyquizservice.controller;

import com.example.kahootifyquizservice.dto.response.QuizSummaryResponse;
import com.example.kahootifyquizservice.entity.QuizResult;
import com.example.kahootifyquizservice.service.QuizService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/quizzes")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
public class AdminQuizController {

    private final QuizService quizService;

    // Finalize quiz and calculate results
    @PostMapping("/{quizId}/finalize")
    public String finalizeQuiz(@PathVariable Long quizId) {
        quizService.calculateAndStoreResults(quizId);
        return "Quiz finalized and results stored.";
    }

    // View results/leaderboard
    @GetMapping("/{quizId}/results")
    public List<QuizResult> getQuizResults(@PathVariable Long quizId) {
        return quizService.getResultsForQuiz(quizId);
    }

    @GetMapping("/{quizId}/results/detail")
    public List<QuizSummaryResponse> getQuizResultsForAdmin(@PathVariable Long quizId) {
        return quizService.getQuizResultsForAdmin(quizId);
    }
}
