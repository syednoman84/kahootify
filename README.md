🚀 **Kahootify – Real-Time Multiplayer Quiz Platform**

Tech Stack: React, Spring Boot, WebSockets (STOMP), PostgreSQL, JWT, Material UI

Overview:
Kahootify is a full-stack, real-time educational quiz platform inspired by Kahoot!, designed to facilitate interactive classroom and team learning experiences. The platform supports both players and administrators with role-based access and a vibrant, mobile-responsive dark UI.

🔧 **Key Features:**

    🧑‍🏫 Admin Module

        Create quizzes with MCQs and True/False questions

        Manage question bank with CRUD operations

        View quiz history, participant scores, and leaderboard

        Stop quiz anytime and view real-time results

    🧑‍🎓 Player Module

        Join live quizzes, answer timed questions

        Real-time updates using WebSockets

        Animated countdown timers and answer buttons

        Score summary with ranking at quiz end

    🌐 System Design

        Frontend: React with Material UI, responsive dark theme, protected routing

        Backend: Spring Boot REST APIs, WebSocket (STOMP), PostgreSQL

        Security: JWT-based authentication, role-based authorization

        Real-Time: Live leaderboard and quiz status broadcasting via WebSocket

📈 **Highlights:**

    Achieved a single-page quiz flow with no page reloads and real-time updates

    Implemented live countdown timers and dynamic quiz transitions

    Designed with separation of concerns, scalable data models, and clean architecture

    Polished UI with custom fonts, vibrant dark theme, and responsive layout
