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

    @Column(columnDefinition = "TEXT")
    private String text;

    @Enumerated(EnumType.STRING)
    private QuestionType type; // MCQ or TRUE_FALSE

    @Column(columnDefinition = "TEXT")
    private String optionA;

    @Column(columnDefinition = "TEXT")
    private String optionB;

    @Column(columnDefinition = "TEXT")
    private String optionC;

    @Column(columnDefinition = "TEXT")// optional for TRUE_FALSE
    private String optionD; // optional for TRUE_FALSE

    private String correctAnswer; // e.g., "A", "True", etc.
}
