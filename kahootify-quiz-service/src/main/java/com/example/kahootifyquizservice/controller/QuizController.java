package com.example.kahootifyquizservice.controller;

import com.example.kahootifyquizservice.dto.request.CreateQuizRequest;
import com.example.kahootifyquizservice.entity.Quiz;
import com.example.kahootifyquizservice.service.QuizService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/admin/quizzes")
//@RequiredArgsConstructor
//@SecurityRequirement(name = "BearerAuth")
//public class QuizController {
//
//    private final QuizService quizService;
//
//    @PostMapping("/create")
//    public ResponseEntity<Quiz> createQuiz(@RequestBody CreateQuizRequest request) {
//        return ResponseEntity.ok(quizService.createQuiz(request));
//    }
//
//}

