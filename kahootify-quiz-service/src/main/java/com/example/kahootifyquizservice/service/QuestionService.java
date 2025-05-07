package com.example.kahootifyquizservice.service;

import com.example.kahootifyquizservice.dto.request.CreateQuestionRequest;
import com.example.kahootifyquizservice.dto.request.UpdateQuestionRequest;
import com.example.kahootifyquizservice.entity.Question;
import com.example.kahootifyquizservice.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public Question createQuestion(CreateQuestionRequest request) {
        Question question = new Question();
        question.setText(request.getText());
        question.setType(request.getType());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer());

        return questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question updateQuestion(Long id, UpdateQuestionRequest req) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setText(req.getText());
        question.setOptionA(req.getOptionA());
        question.setOptionB(req.getOptionB());
        question.setOptionC(req.getOptionC());
        question.setOptionD(req.getOptionD());
        question.setCorrectAnswer(req.getCorrectAnswer());

        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

}

