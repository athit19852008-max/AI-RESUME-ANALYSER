
import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Module 1: Authentication
import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';
import ForgotPasswordPage from './modules/auth/ForgotPasswordPage';

// Module 2: Resume Upload
import ResumeUploadPage from './modules/resume-upload/ResumeUploadPage';

// Module 3: AI Resume Analysis
import AiAnalysisPage from './modules/ai-analysis/AiAnalysisPage';

// Module 4: Job Matching
import JobMatchingPage from './modules/job-matching/JobMatchingPage';

// Module 5: Skill Gap Analysis
import SkillGapPage from './modules/skill-gap/SkillGapPage';

// Module 6: Resume Improvement
import ResumeImprovementPage from './modules/resume-improvement/ResumeImprovementPage';

// Module 7: Dashboard & Reports
import DashboardPage from './modules/dashboard-reports/DashboardPage';
import ReportsPage from './modules/dashboard-reports/ReportsPage';
import LandingPage from './modules/dashboard-reports/LandingPage';

/*
=========================================================
DEVELOPMENT CONFIGURATION

true  = Run ONLY Module 3 - AI Resume Analysis
false = Run complete integrated application

=========================================================
*/

const ISOLATE_MODULE_3 = false;

function App() {

  // Standalone AI Analysis Development Mode
  if (ISOLATE_MODULE_3) {
    return (
      <AppProvider>
        <AiAnalysisPage />
      </AppProvider>
    );
  }

  // Complete Integrated Team Application
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>

          <Routes>

            {/* Landing Page */}
            <Route
              path="/"
              element={<LandingPage />}
            />

            <Route
              path="/landing"
              element={<LandingPage />}
            />

            {/* Authentication Routes */}
            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={<RegisterPage />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            />

            {/* Protected Application Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >

              {/* Module 7: Dashboard */}
              <Route
                path="/dashboard"
                element={<DashboardPage />}
              />

              {/* Module 2: Resume Upload */}
              <Route
                path="/upload-resume"
                element={<ResumeUploadPage />}
              />

              {/* Module 3: AI Analysis */}
              <Route
                path="/ai-analysis"
                element={<AiAnalysisPage />}
              />

              {/* Module 4: Job Matching */}
              <Route
                path="/job-matching"
                element={<JobMatchingPage />}
              />

              {/* Module 5: Skill Gap Analysis */}
              <Route
                path="/skill-gap"
                element={<SkillGapPage />}
              />

              {/* Module 6: Resume Improvement */}
              <Route
                path="/improvements"
                element={<ResumeImprovementPage />}
              />

              {/* Module 7: Reports */}
              <Route
                path="/reports"
                element={<ReportsPage />}
              />

            </Route>

            {/* Fallback Route */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>

        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
