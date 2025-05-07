package com.example.kahootifyquizservice.controller;

import com.example.kahootifyquizservice.dto.request.CreateQuestionRequest;
import com.example.kahootifyquizservice.dto.request.UpdateQuestionRequest;
import com.example.kahootifyquizservice.entity.Question;
import com.example.kahootifyquizservice.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;


import java.util.List;

@RestController
@RequestMapping("/admin/questions")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<Question> create(@RequestBody CreateQuestionRequest request) {
        return ResponseEntity.ok(questionService.createQuestion(request));
    }

    @GetMapping
    public ResponseEntity<List<Question>> getAll() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> update(@PathVariable Long id, @RequestBody UpdateQuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}

