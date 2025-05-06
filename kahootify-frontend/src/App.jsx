// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import WaitingScreen from './pages/WaitingScreen';
import LiveQuiz from './pages/LiveQuiz';
import QuizSummary from './pages/QuizSummary';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import CreateQuiz from './pages/CreateQuiz';
import ManageQuestions from './pages/ManageQuestions';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './pages/Logout';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/logout" element={<Logout />} />

        {/* Player-Protected Routes */}
        <Route
          path="/waiting"
          element={
            <ProtectedRoute allowedRoles={['PLAYER']}>
              <WaitingScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute allowedRoles={['PLAYER']}>
              <LiveQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute allowedRoles={['PLAYER']}>
              <QuizSummary />
            </ProtectedRoute>
          }
        />

        {/* Admin-Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-quiz"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CreateQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageQuestions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
