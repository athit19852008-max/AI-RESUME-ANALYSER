import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LogOut,
  User,
  UploadCloud,
  Briefcase,
  Target,
  Lightbulb,
  FileText,
  ArrowRight,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import OverviewCards from './OverviewCards';
import ResumeOverview from './ResumeOverview';
import AnalysisOverview from './AnalysisOverview';
import JobMatchingOverview from './JobMatchingOverview';
import SkillGapOverview from './SkillGapOverview';
import ImprovementSuggestions from './ImprovementSuggestions';
import ChartsSection from './ChartsSection';
import ReportGenerator from './ReportGenerator';
import './Dashboard.css';

/**
 * Master Dashboard Component
 * Module 7: Dashboard and Report Generation
 */
export const Dashboard = () => {
  const {
    resumeFile,
    resumeText,
    analysisResults,
    matchingResults,
    skillAnalysisResults,
    improvementSuggestions,
    targetJobRole,
    jobDescription,
    resetAnalysis
  } = useApp();

  const { currentUser, logout, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Get user display name or email initials
  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Candidate';
  const userInitials = (currentUser?.displayName || currentUser?.email || 'U')
    .slice(0, 2)
    .toUpperCase();

  // Navigation cards for all 7 modules
  const moduleNavItems = [
    {
      id: 1,
      num: 'Module 1',
      title: 'Authentication & Profile',
      route: currentUser ? '/dashboard' : '/login',
      icon: User,
      desc: 'Secure identity management and access control.',
      status: currentUser ? 'Authenticated' : 'Guest / Dev',
      badgeClass: currentUser ? 'badge-success' : 'badge-warning',
      action: currentUser ? 'Active' : 'Sign In'
    },
    {
      id: 2,
      num: 'Module 2',
      title: 'Resume Upload & Extraction',
      route: '/upload-resume',
      icon: UploadCloud,
      desc: 'PDF/DOCX extraction via PDF.js and Mammoth.',
      status: resumeText ? 'Completed' : 'Pending',
      badgeClass: resumeText ? 'badge-success' : 'badge-warning',
      action: resumeText ? 'Update' : 'Upload'
    },
    {
      id: 3,
      num: 'Module 3',
      title: 'AI Resume Parsing & Scoring',
      route: '/ai-analysis',
      icon: Sparkles,
      desc: 'Google Gemini ATS scoring & section breakdown.',
      status: analysisResults ? `Score: ${analysisResults.atsScore}/100` : 'Not Analyzed',
      badgeClass: analysisResults ? 'badge-success' : 'badge-primary',
      action: analysisResults ? 'View Audit' : 'Run Audit'
    },
    {
      id: 4,
      num: 'Module 4',
      title: 'Job Description Matching',
      route: '/job-matching',
      icon: Briefcase,
      desc: 'Target job comparison and keyword alignment.',
      status: matchingResults ? `Match: ${matchingResults.matchPercentage}%` : 'Not Matched',
      badgeClass: matchingResults ? 'badge-success' : 'badge-primary',
      action: matchingResults ? 'View Match' : 'Match Job'
    },
    {
      id: 5,
      num: 'Module 5',
      title: 'Skill Gap & Roadmap',
      route: '/skill-gap',
      icon: Target,
      desc: 'Missing competency audit and learning steps.',
      status: skillAnalysisResults ? `Readiness: ${skillAnalysisResults.readinessScore}%` : 'Not Audited',
      badgeClass: skillAnalysisResults ? 'badge-success' : 'badge-primary',
      action: skillAnalysisResults ? 'View Gap' : 'Run Audit'
    },
    {
      id: 6,
      num: 'Module 6',
      title: 'Improvement Suggestions',
      route: '/improvements',
      icon: Lightbulb,
      desc: 'Action-verb rewrites and ATS optimization.',
      status: improvementSuggestions ? 'Rewrites Ready' : 'Pending',
      badgeClass: improvementSuggestions ? 'badge-success' : 'badge-primary',
      action: improvementSuggestions ? 'View Tips' : 'Get Rewrites'
    },
    {
      id: 7,
      num: 'Module 7',
      title: 'Dossier & Report Generation',
      route: '/reports',
      icon: FileText,
      desc: 'Comprehensive multi-page PDF & printable dossier.',
      status: resumeText ? 'Ready to Export' : 'Awaiting Resume',
      badgeClass: resumeText ? 'badge-success' : 'badge-secondary',
      action: 'Open Dossier'
    }
  ];

  return (
    <div className="resumate-dashboard">
      {/* =========================================================================
          A. WELCOME SECTION
          ========================================================================= */}
      <section className="dash-welcome-card">
        <div className="welcome-info">
          <div className="welcome-avatar-box">
            {userInitials}
          </div>

          <div className="welcome-texts">
            <div className="welcome-badge-row">
              <span className="badge badge-primary">
                <Cpu size={12} /> RESUMATE AI Platform
              </span>
              {!isConfigured && (
                <span className="badge badge-warning" title="Running in Local Development Mode">
                  Dev Mode
                </span>
              )}
            </div>

            <h1 className="welcome-heading">
              Welcome back, {userName}!
            </h1>
            <p className="welcome-desc">
              Your centralized AI resume analytics command center. Monitor ATS compatibility, benchmark
              qualifications against job descriptions, and generate executive PDF reports.
            </p>
          </div>
        </div>

        <div className="welcome-actions">
          {currentUser ? (
            <Button
              variant="outline"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
              title="Sign out of your account"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={User}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={UploadCloud}
            onClick={() => navigate('/upload-resume')}
          >
            {resumeText ? 'Change Resume' : 'Upload Resume'}
          </Button>
        </div>
      </section>

      {/* =========================================================================
          B. OVERVIEW CARDS (4 KPI Cards)
          ========================================================================= */}
      <OverviewCards
        resumeText={resumeText}
        analysisResults={analysisResults}
        matchingResults={matchingResults}
        skillAnalysisResults={skillAnalysisResults}
        improvementSuggestions={improvementSuggestions}
      />

      {/* =========================================================================
          C. RESUME OVERVIEW
          ========================================================================= */}
      <ResumeOverview
        resumeFile={resumeFile}
        resumeText={resumeText}
        analysisResults={analysisResults}
        targetJobRole={targetJobRole}
        resetAnalysis={resetAnalysis}
      />

      {/* =========================================================================
          D. RESUME ANALYSIS OVERVIEW & CIRCULAR METER
          ========================================================================= */}
      <AnalysisOverview
        analysisResults={analysisResults}
        resumeText={resumeText}
      />

      {/* =========================================================================
          DATA VISUALIZATION CHARTS SECTION
          ========================================================================= */}
      <ChartsSection
        analysisResults={analysisResults}
        matchingResults={matchingResults}
        skillAnalysisResults={skillAnalysisResults}
        resumeText={resumeText}
      />

      {/* =========================================================================
          E & F. JOB MATCHING & SKILL GAP OVERVIEW
          ========================================================================= */}
      <div className="grid-2">
        <JobMatchingOverview
          matchingResults={matchingResults}
          targetJobRole={targetJobRole}
          jobDescription={jobDescription}
          resumeText={resumeText}
        />

        <SkillGapOverview
          skillAnalysisResults={skillAnalysisResults}
          resumeText={resumeText}
        />
      </div>

      {/* =========================================================================
          G. IMPROVEMENT SUGGESTIONS
          ========================================================================= */}
      <ImprovementSuggestions
        improvementSuggestions={improvementSuggestions}
        resumeText={resumeText}
      />

      {/* =========================================================================
          REPORT GENERATION & PDF DOWNLOAD SECTION
          ========================================================================= */}
      <ReportGenerator
        resumeFile={resumeFile}
        resumeText={resumeText}
        analysisResults={analysisResults}
        matchingResults={matchingResults}
        skillAnalysisResults={skillAnalysisResults}
        improvementSuggestions={improvementSuggestions}
        targetJobRole={targetJobRole}
        currentUser={currentUser}
      />

      {/* =========================================================================
          NAVIGATION LINKS TO ALL 7 MODULES
          ========================================================================= */}
      <section style={{ marginTop: '8px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, margin: '0 0 4px 0' }}>
            Integrated Seven-Module Architecture Pipeline
          </h2>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Real-time module status from shared AppContext state
          </p>
        </div>

        <div className="dash-overview-grid">
          {moduleNavItems.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} className="kpi-card" style={{ padding: '18px' }}>
                <div className="kpi-header">
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    {mod.num}
                  </span>
                  <span className={`badge ${mod.badgeClass}`}>
                    {mod.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                  <div className="kpi-icon-wrap primary" style={{ width: '28px', height: '28px' }}>
                    <Icon size={16} />
                  </div>
                  <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, margin: 0 }}>
                    {mod.title}
                  </h3>
                </div>

                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: '0 0 14px 0', lineHeight: 1.4, flex: 1 }}>
                  {mod.desc}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => navigate(mod.route)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {mod.action}
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
