package com.example.kahootifyquizservice.entity;

import com.example.kahootifyquizservice.enums.QuestionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @Enumerated(EnumType.STRING)
    private QuestionType type; // MCQ or TRUE_FALSE

    private String optionA;
    private String optionB;
    private String optionC; // optional for TRUE_FALSE
    private String optionD; // optional for TRUE_FALSE

    private String correctAnswer; // e.g., "A", "True", etc.
}
