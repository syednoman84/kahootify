package com.example.kahootifyquizservice.service;

import com.example.kahootifyquizservice.dto.request.AnswerRequest;
import com.example.kahootifyquizservice.dto.request.CreateQuizRequest;
import com.example.kahootifyquizservice.dto.response.ActiveQuizResponse;
import com.example.kahootifyquizservice.dto.response.LeaderboardEntryResponse;
import com.example.kahootifyquizservice.dto.response.QuestionViewResponse;
import com.example.kahootifyquizservice.dto.response.QuizSummaryResponse;
import com.example.kahootifyquizservice.entity.*;
import com.example.kahootifyquizservice.repository.*;
import com.example.kahootifyquizservice.websocket.LeaderboardBroadcaster;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final QuizResultRepository quizResultRepository;
    private final LeaderboardBroadcaster leaderboardBroadcaster;


    private final JwtService jwtService;

    public Quiz createQuiz(CreateQuizRequest request) {
        Long adminId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setAdminId(adminId);
        quiz.setStartedAt(LocalDateTime.now());
        quiz.setActive(true);
        quiz = quizRepository.save(quiz);

        List<Question> questions = questionRepository.findAllById(request.getQuestionIds());
        int sequence = 1;
        for (Question question : questions) {
            QuizQuestion quizQuestion = new QuizQuestion();
            quizQuestion.setQuiz(quiz);
            quizQuestion.setQuestion(question);
            quizQuestion.setSequenceOrder(sequence++);
            quizQuestionRepository.save(quizQuestion);
        }

        return quiz;
    }

    public ActiveQuizResponse getActiveQuiz() {
        Optional<Quiz> optional = quizRepository.findFirstByActiveTrueOrderByStartedAtDesc();
        if (optional.isEmpty()) {
            return new ActiveQuizResponse(null, null, 0, false);
        }

        Quiz quiz = optional.get();
        int questionCount = quizQuestionRepository.countByQuiz(quiz);

        return new ActiveQuizResponse(quiz.getId(), quiz.getTitle(), questionCount, true);
    }

    public QuestionViewResponse getQuestion(Long quizId, int sequenceNumber) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        QuizQuestion quizQuestion = quizQuestionRepository
                .findByQuizAndSequenceOrder(quiz, sequenceNumber)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Question q = quizQuestion.getQuestion();
        int total = quizQuestionRepository.countByQuiz(quiz);

        return new QuestionViewResponse(
                q.getText(),
                q.getOptionA(),
                q.getOptionB(),
                q.getOptionC(),
                q.getOptionD(),
                total,
                sequenceNumber
        );
    }

    public void submitAnswer(AnswerRequest request, String token) {
        Long userId = jwtService.extractUserId(token);
        String username = jwtService.extractUsername(token);

        if (userAnswerRepository.existsByUserIdAndQuizIdAndQuestionId(
                userId, request.getQuizId(), request.getQuestionId())) {
            throw new RuntimeException("Answer already submitted");
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        boolean correct = question.getCorrectAnswer().equalsIgnoreCase(request.getSelectedAnswer());

        UserAnswer answer = new UserAnswer();
        answer.setUserId(userId);
        answer.setUsername(username);
        answer.setQuizId(request.getQuizId());
        answer.setQuestionId(request.getQuestionId());
        answer.setSelectedAnswer(request.getSelectedAnswer());
        answer.setCorrect(correct);
        answer.setTimeTakenMillis(request.getTimeTakenMillis());
        answer.setAnsweredAt(LocalDateTime.now());

        userAnswerRepository.save(answer);
        // Broadcast updated leaderboard
        List<LeaderboardEntryResponse> updatedLeaderboard = getLeaderboard(request.getQuizId());
        leaderboardBroadcaster.broadcastLeaderboard(request.getQuizId(), updatedLeaderboard);
    }


    public void calculateAndStoreResults(Long quizId) {
        // Step 1: Fetch all answers for this quiz
        List<UserAnswer> allAnswers = userAnswerRepository.findByQuizId(quizId);

        // Step 2: Group by user
        Map<Long, List<UserAnswer>> answersByUser = allAnswers.stream()
                .collect(Collectors.groupingBy(UserAnswer::getUserId));

        // Step 3: Calculate score and time per user
        for (Map.Entry<Long, List<UserAnswer>> entry : answersByUser.entrySet()) {
            Long userId = entry.getKey();
            List<UserAnswer> answers = entry.getValue();

            int score = 0;
            long totalTime = 0;

            for (UserAnswer answer : answers) {
                if (answer.isCorrect()) {
                    score += 100; // or some base score
                    totalTime += answer.getTimeTakenMillis();             }
            }

            // Step 4: Save to QuizResult
            QuizResult result = QuizResult.builder()
                    .quizId(quizId)
                    .userId(userId)
                    .score(score)
                    .totalTimeMs(totalTime)
                    .build();

            quizResultRepository.save(result);
        }
    }

    public List<QuizResult> getResultsForQuiz(Long quizId) {
        return quizResultRepository.findByQuizIdOrderByScoreDescTotalTimeMsAsc(quizId);
    }

    public List<QuizResult> getResultsForUser(String token) {
        Long userId = jwtService.extractUserId(token);
        return quizResultRepository.findByUserId(userId);
    }

    public QuizSummaryResponse getQuizSummaryForUser(Long quizId, String token) {
        Long userId = jwtService.extractUserId(token);
        String username = jwtService.extractUsername(token);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<UserAnswer> allAnswers = userAnswerRepository.findByQuizId(quizId);
        List<UserAnswer> userAnswers = allAnswers.stream()
                .filter(ans -> ans.getUserId().equals(userId))
                .toList();

        int totalQuestions = userAnswers.size();
        int correctAnswers = (int) userAnswers.stream().filter(UserAnswer::isCorrect).count();
        int totalScore = userAnswers.stream()
                .mapToInt(ans -> calculateScore(ans.isCorrect(), ans.getTimeTakenMillis()))
                .sum();

        // Rank calculation (higher score first)
        Map<Long, Integer> userScores = new HashMap<>();
        for (UserAnswer ans : allAnswers) {
            userScores.merge(ans.getUserId(),
                    calculateScore(ans.isCorrect(), ans.getTimeTakenMillis()),
                    Integer::sum);
        }

        // Sort by score descending
        List<Map.Entry<Long, Integer>> sorted = userScores.entrySet().stream()
                .sorted((e1, e2) -> Integer.compare(e2.getValue(), e1.getValue()))
                .toList();

        int rank = 1;
        for (Map.Entry<Long, Integer> entry : sorted) {
            if (entry.getKey().equals(userId)) break;
            rank++;
        }

        return new QuizSummaryResponse(
                username,
                quiz.getTitle(),
                totalQuestions,
                correctAnswers,
                totalScore,
                rank
        );
    }

    private int calculateScore(boolean correct, long timeTakenMs) {
        if (!correct) return 0;
        long maxTime = 30000; // 30 seconds
        return (int) (1000 + (maxTime - Math.min(timeTakenMs, maxTime)) / 100); // Example scoring
    }

    public List<QuizSummaryResponse> getQuizResultsForAdmin(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<UserAnswer> allAnswers = userAnswerRepository.findByQuizId(quizId);

        // Group answers by userId
        Map<Long, List<UserAnswer>> groupedByUser = allAnswers.stream()
                .collect(Collectors.groupingBy(UserAnswer::getUserId));

        // Calculate score per user
        List<QuizSummaryResponse> summaries = new ArrayList<>();

        for (Map.Entry<Long, List<UserAnswer>> entry : groupedByUser.entrySet()) {
            Long userId = entry.getKey();
            List<UserAnswer> answers = entry.getValue();

            int totalQuestions = answers.size();
            int correctAnswers = (int) answers.stream().filter(UserAnswer::isCorrect).count();
            int totalScore = answers.stream()
                    .mapToInt(ans -> calculateScore(ans.isCorrect(), ans.getTimeTakenMillis()))
                    .sum();
            String username = answers.get(0).getUsername(); // Assuming username is stored in answer

            summaries.add(new QuizSummaryResponse(
                    username,
                    quiz.getTitle(),
                    totalQuestions,
                    correctAnswers,
                    totalScore,
                    0 // We'll assign rank next
            ));
        }

        // Rank calculation
        summaries.sort((a, b) -> Integer.compare(b.getTotalScore(), a.getTotalScore()));
        for (int i = 0; i < summaries.size(); i++) {
            summaries.get(i).setRank(i + 1);
        }

        return summaries;
    }

    public List<LeaderboardEntryResponse> getLeaderboard(Long quizId) {
        List<UserAnswer> allAnswers = userAnswerRepository.findByQuizId(quizId);

        // Group answers by userId and compute score + time
        Map<Long, LeaderboardEntryResponse> leaderboardMap = new HashMap<>();

        for (UserAnswer answer : allAnswers) {
            LeaderboardEntryResponse entry = leaderboardMap.getOrDefault(
                    answer.getUserId(),
                    new LeaderboardEntryResponse(answer.getUserId(), answer.getUsername(), 0, 0)
            );

            if (answer.isCorrect()) {
                entry.setScore(entry.getScore() + 10); // Each correct answer is 10 pts
            }

            entry.setTotalTimeMillis(entry.getTotalTimeMillis() + answer.getTimeTakenMillis());

            leaderboardMap.put(answer.getUserId(), entry);
        }

        // Sort by score DESC, then time ASC
        return leaderboardMap.values().stream()
                .sorted(Comparator.comparing(LeaderboardEntryResponse::getScore).reversed()
                        .thenComparing(LeaderboardEntryResponse::getTotalTimeMillis))
                .collect(Collectors.toList());
    }

    public void stopQuizAndCalculateResults(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        quiz.setActive(false);
        quizRepository.save(quiz);

        calculateAndStoreResults(quizId); // this is your existing method
    }

    public Quiz stopQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        quiz.setActive(false);
        quiz.setEndedAt(LocalDateTime.now());
        quizRepository.save(quiz);

        // Store results after stopping
        calculateAndStoreResults(quizId);

        return quiz;
    }


}

