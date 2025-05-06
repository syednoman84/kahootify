package com.example.kahootifyquizservice.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateQuizRequest {
    private String title;
    private List<Long> questionIds;
}
