import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  FileText,
  Briefcase,
  Target,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Database,
  GraduationCap,
  FolderGit2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import OverviewCards from './OverviewCards';
import AnalysisCharts from './AnalysisCharts';
import ReportGenerator from './ReportGenerator';
import ReportPreview from './ReportPreview';
import './DashboardReport.css';

/**
 * SAMPLE BENCHMARK DATA
 * Clearly labelled fallback data used when the user has not completed modules 2-6,
 * fulfilling the requirement: "If data is unavailable, display a clear empty state or clearly labelled sample data."
 */
const SAMPLE_ANALYSIS_DATA = {
  candidate: {
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan'
  },
  summary:
    'Results-driven Software Engineer with 4+ years of full-stack experience architecting scalable React frontends and cloud microservices. Adept in performance optimization and CI/CD pipelines.',
  atsScore: 84,
  atsScoreBreakdown: {
    formatting: 88,
    keywordRelevance: 82,
    impactAndMetrics: 80,
    sectionsCompleteness: 86
  },
  skills: {
    technical: ['React.js', 'JavaScript (ES6+)', 'Node.js', 'TypeScript', 'REST APIs', 'PostgreSQL', 'Docker'],
    toolsAndFrameworks: ['Git', 'Vite', 'Webpack', 'Jest', 'AWS EC2', 'Tailwind CSS'],
    soft: ['Agile Collaboration', 'Technical Mentorship', 'Problem Solving', 'System Design']
  },
  experience: [
    {
      company: 'TechFlow Solutions',
      role: 'Full Stack Engineer',
      duration: '2022 - Present',
      highlights: [
        'Built modern React dashboard handling 50k+ daily queries with 40% reduced latency.',
        'Engineered Node.js backend services and automated Docker deployment workflows.'
      ]
    },
    {
      company: 'NextGen Apps',
      role: 'Associate Developer',
      duration: '2020 - 2022',
      highlights: [
        'Implemented state-driven frontend components using React and Redux Toolkit.'
      ]
    }
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      year: '2020'
    }
  ],
  projects: [
    {
      name: 'Cloud-Native Analytics Dashboard',
      description: 'Real-time telemetry monitoring UI built with React and Recharts.'
    },
    {
      name: 'Distributed Task Queue Engine',
      description: 'High-throughput Node.js microservice processing asynchronous payloads.'
    }
  ],
  keyStrengths: [
    'Strong full-stack technical competencies with modern React and cloud architectures.',
    'Clear work history structure with quantifiable metrics and achievement statements.',
    'Consistent and ATS-compliant heading hierarchy and font sizing.'
  ],
  criticalWeaknesses: [
    'Limited cloud infrastructure certification details (e.g. AWS or GCP credentials).',
    'Some early bullet points lack measurable percentages or business revenue impact.'
  ]
};

const SAMPLE_MATCHING_DATA = {
  matchPercentage: 78,
  verdict: 'Moderate to Strong Fit',
  matchingKeywords: ['React.js', 'JavaScript', 'Node.js', 'Docker', 'REST APIs', 'Git', 'Agile'],
  missingKeywords: ['Kubernetes', 'GraphQL', 'Terraform', 'Next.js'],
  keyRoleRequirements: ['Full Stack Software Engineer'],
  compatibilitySummary:
    'Candidate exhibits strong alignment with core frontend and microservice requirements, but lacks container orchestration (Kubernetes) and infrastructure-as-code (Terraform) experience.'
};

const SAMPLE_SKILL_GAP_DATA = {
  targetRole: 'Senior Full Stack Engineer',
  readinessScore: 76,
  acquiredSkills: ['React.js', 'Node.js', 'Docker', 'PostgreSQL', 'RESTful Design', 'CI/CD Pipelines'],
  missingCriticalSkills: ['Kubernetes Orchestration', 'GraphQL Schema Architecture', 'Terraform IaC'],
  missingOptionalSkills: ['Kafka Event Streaming', 'Redis Cache Tiering'],
  recommendedCertifications: ['AWS Certified Solutions Architect', 'CKA: Certified Kubernetes Administrator'],
  learningRoadmap: [
    {
      skill: 'Kubernetes Orchestration',
      importance: 'High',
      learningResource: 'Official Kubernetes Documentation & CKA Hands-on Lab'
    },
    {
      skill: 'GraphQL Schema Architecture',
      importance: 'Medium',
      learningResource: 'Apollo GraphQL Fullstack Tutorial'
    },
    {
      skill: 'Terraform IaC',
      importance: 'Medium',
      learningResource: 'HashiCorp Terraform Associate Certification Track'
    }
  ]
};

const SAMPLE_IMPROVEMENT_DATA = {
  executiveSummarySuggestion:
    'Strategic Full Stack Engineer with 4+ years spearheading scalable React applications and cloud microservices. Delivered 40% query latency improvements across 50k+ daily enterprise users.',
  actionVerbEnhancements: [
    {
      originalPhrase: 'Worked on React frontend components and updated state logic.',
      suggestedRewrite: 'Architected modular React component architecture reducing rendering overhead by 35%.',
      reason: 'Replaces passive verb "worked on" with proactive action verb "architected" and adds quantifiable metrics.'
    },
    {
      originalPhrase: 'Helped deploy backend code with Docker.',
      suggestedRewrite: 'Containerized microservices via Docker, cutting onboarding time and CI/CD build cycles by 50%.',
      reason: 'Eliminates vague phrasing and highlights concrete productivity benefits.'
    }
  ],
  atsOptimizationTips: [
    'Place critical technical keywords in both the Skills section and bullet points for double ATS indexation.',
    'Use standard section headings (Professional Experience, Education, Technical Skills) for zero-loss parser parsing.'
  ],
  formattingAndStructureTips: [
    'Maintain single-column flow throughout to ensure flawless document segmentation.',
    'Ensure all bullet statements begin with strong past-tense action verbs.'
  ]
};

/**
 * DashboardReportPage Component - Module 7
 * Standalone, isolated Analysis Dashboard and Report Generation page.
 */
export const DashboardReportPage = () => {
  const {
    resumeFile,
    resumeText,
    analysisResults: contextAnalysisResults,
    matchingResults: contextMatchingResults,
    skillAnalysisResults: contextSkillGapResults,
    improvementSuggestions: contextImprovementResults,
    targetJobRole: contextTargetJobRole,
    resetAnalysis
  } = useApp();

  // Mode: Toggle between Live Context Data vs Sample Evaluation Data
  const [useSampleData, setUseSampleData] = useState(!contextAnalysisResults && !resumeText);
  const [showReportPreview, setShowReportPreview] = useState(false);

  // Active data sources
  const analysisResults = useSampleData ? SAMPLE_ANALYSIS_DATA : contextAnalysisResults;
  const matchingResults = useSampleData ? SAMPLE_MATCHING_DATA : contextMatchingResults;
  const skillGapResults = useSampleData ? SAMPLE_SKILL_GAP_DATA : contextSkillGapResults;
  const improvementResults = useSampleData ? SAMPLE_IMPROVEMENT_DATA : contextImprovementResults;
  const targetJobRole = useSampleData ? 'Senior Full Stack Engineer' : contextTargetJobRole || 'Software Engineer';

  // Improvement Recommendations count
  const completedRecsCount = useMemo(() => {
    return (analysisResults?.keyStrengths?.length || 0);
  }, [analysisResults]);

  const pendingRecsCount = useMemo(() => {
    const rewrites = improvementResults?.actionVerbEnhancements?.length || 0;
    const weaknesses = analysisResults?.criticalWeaknesses?.length || 0;
    return rewrites + weaknesses;
  }, [improvementResults, analysisResults]);

  return (
    <div className="mod7-isolated-container">
      <div className="mod7-content-wrapper">
        {/* =========================================================================
            HEADER SECTION
            ========================================================================= */}
        <header className="mod7-header-card">
          <div className="mod7-title-area">
            <span className="mod7-badge">
              <Sparkles size={12} /> Module 7: Dashboard & Report Generation
            </span>
            <h1 className="mod7-page-title">
              RESUMATE AI – Analysis Dashboard
            </h1>
            <p className="mod7-page-subtitle">
              View your resume analysis results and generate a professional report.
            </p>
          </div>

          <div className="mod7-header-actions no-print">
            {/* Sample Data Toggle to facilitate immediate testing */}
            <button
              type="button"
              className={`mod7-btn ${useSampleData ? 'mod7-btn-primary' : 'mod7-btn-outline'}`}
              onClick={() => setUseSampleData((prev) => !prev)}
              title="Toggle between live context data and benchmark sample analysis data"
            >
              <Database size={15} />
              {useSampleData ? 'Using Sample Data' : 'Using Live Data'}
            </button>

            {resumeText && !useSampleData && (
              <button
                type="button"
                className="mod7-btn mod7-btn-outline"
                onClick={() => {
                  if (window.confirm('Reset current analysis data?')) {
                    resetAnalysis();
                  }
                }}
                title="Reset active analysis session"
              >
                <RotateCcw size={15} />
                Reset Session
              </button>
            )}

            <button
              type="button"
              className="mod7-btn mod7-btn-secondary"
              onClick={() => setShowReportPreview((prev) => !prev)}
            >
              <FileText size={15} />
              {showReportPreview ? 'Hide Report Preview' : 'Show Report Preview'}
            </button>
          </div>
        </header>

        {/* Data Origin Alert Notice */}
        {useSampleData && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#1E40AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <span>
              <strong>Sample Benchmark Mode Active:</strong> Displaying representative analysis data so all
              scorecards, charts, and PDF generation can be previewed immediately.
            </span>
            <button
              type="button"
              onClick={() => setUseSampleData(false)}
              style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#1D4ED8', cursor: 'pointer', fontWeight: 600 }}
            >
              Switch to Live Context
            </button>
          </div>
        )}

        {/* =========================================================================
            A. OVERVIEW CARDS
            ========================================================================= */}
        <section>
          <OverviewCards
            analysisResults={analysisResults}
            matchingResults={matchingResults}
            skillGapResults={skillGapResults}
            improvementResults={improvementResults}
            resumeText={resumeText || (useSampleData ? 'Sample Text' : '')}
          />
        </section>

        {/* =========================================================================
            F. CHARTS SECTION
            ========================================================================= */}
        <section>
          <AnalysisCharts
            analysisResults={analysisResults}
            matchingResults={matchingResults}
            skillGapResults={skillGapResults}
            improvementResults={improvementResults}
          />
        </section>

        {/* =========================================================================
            B. RESUME ANALYSIS SUMMARY
            ========================================================================= */}
        <section className="mod7-card">
          <div className="mod7-card-header">
            <h2 className="mod7-card-title">
              <FileText size={18} color="#6366F1" /> Resume Analysis Summary
            </h2>
            {analysisResults && (
              <span className="mod7-tag mod7-tag-primary">
                ATS Score: {analysisResults.atsScore}/100
              </span>
            )}
          </div>

          {analysisResults ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Professional Summary */}
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Professional Summary
                </span>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#172033', margin: 0 }}>
                  {analysisResults.summary || 'Summary not provided in resume.'}
                </p>
              </div>

              {/* Technical Skills */}
              {analysisResults.skills && (
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Technical Skills & Tools
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      ...(analysisResults.skills.technical || []),
                      ...(analysisResults.skills.toolsAndFrameworks || [])
                    ].map((sk, idx) => (
                      <span key={idx} className="mod7-tag mod7-tag-primary">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience & Education & Projects */}
              <div className="mod7-grid-2">
                {/* Work Experience */}
                <div style={{ padding: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Briefcase size={14} color="#6366F1" /> Work Experience
                  </span>
                  {(analysisResults.experience || []).map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: '8px', fontSize: '12px' }}>
                      <strong style={{ color: '#172033' }}>{exp.role || 'Role'}</strong> • {exp.company || 'Company'} ({exp.duration || 'Period'})
                    </div>
                  ))}
                  {(!analysisResults.experience || analysisResults.experience.length === 0) && (
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>No work experience recorded.</span>
                  )}
                </div>

                {/* Education & Projects */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Education */}
                  <div style={{ padding: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <GraduationCap size={14} color="#10B981" /> Education
                    </span>
                    {(analysisResults.education || []).map((edu, idx) => (
                      <div key={idx} style={{ fontSize: '12px' }}>
                        <strong>{edu.degree || 'Degree'}</strong> – {edu.institution || 'Institution'} ({edu.year || 'Year'})
                      </div>
                    ))}
                    {(!analysisResults.education || analysisResults.education.length === 0) && (
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>No education items listed.</span>
                    )}
                  </div>

                  {/* Projects */}
                  {analysisResults.projects && analysisResults.projects.length > 0 && (
                    <div style={{ padding: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <FolderGit2 size={14} color="#8B5CF6" /> Projects
                      </span>
                      {analysisResults.projects.map((proj, idx) => (
                        <div key={idx} style={{ fontSize: '12px', marginBottom: '4px' }}>
                          <strong>{proj.name}</strong>: {proj.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mod7-empty-box">
              <span className="mod7-empty-title">Resume Analysis Pending</span>
              <span className="mod7-empty-desc">
                No analysis results found in AppContext. Run AI Parsing or toggle Sample Data above.
              </span>
            </div>
          )}
        </section>

        {/* =========================================================================
            C & D. JOB MATCHING & SKILL GAP OVERVIEW
            ========================================================================= */}
        <div className="mod7-grid-2">
          {/* C. Job Matching Overview */}
          <section className="mod7-card">
            <div className="mod7-card-header">
              <h2 className="mod7-card-title">
                <Briefcase size={18} color="#8B5CF6" /> Job Matching Overview
              </h2>
              {matchingResults && (
                <span className="mod7-tag mod7-tag-primary">
                  {matchingResults.matchPercentage}% Match
                </span>
              )}
            </div>

            {matchingResults ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Match Percentage</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#8B5CF6' }}>
                    {matchingResults.matchPercentage}%
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#059669', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Matching Skills ({matchingResults.matchingKeywords?.length || 0})
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(matchingResults.matchingKeywords || []).map((kw, i) => (
                      <span key={i} className="mod7-tag mod7-tag-success">
                        <CheckCircle2 size={11} /> {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#DC2626', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Missing Skills ({matchingResults.missingKeywords?.length || 0})
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(matchingResults.missingKeywords || []).map((kw, i) => (
                      <span key={i} className="mod7-tag mod7-tag-danger">
                        <AlertTriangle size={11} /> {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mod7-empty-box">
                <span className="mod7-empty-title">Job Matching Not Completed</span>
                <span className="mod7-empty-desc">
                  Match against a job posting in Module 4 to compare required keywords.
                </span>
              </div>
            )}
          </section>

          {/* D. Skill Gap Overview */}
          <section className="mod7-card">
            <div className="mod7-card-header">
              <h2 className="mod7-card-title">
                <Target size={18} color="#10B981" /> Skill Gap Overview
              </h2>
              {skillGapResults && (
                <span className="mod7-tag mod7-tag-success">
                  {skillGapResults.readinessScore}% Coverage
                </span>
              )}
            </div>

            {skillGapResults ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Skill Coverage</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>
                    {skillGapResults.readinessScore}%
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#059669', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Matched Skills ({skillGapResults.acquiredSkills?.length || 0})
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(skillGapResults.acquiredSkills || []).map((sk, i) => (
                      <span key={i} className="mod7-tag mod7-tag-success">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#DC2626', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Missing Skills ({skillGapResults.missingCriticalSkills?.length || 0})
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(skillGapResults.missingCriticalSkills || []).map((sk, i) => (
                      <span key={i} className="mod7-tag mod7-tag-danger">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {skillGapResults.learningRoadmap && skillGapResults.learningRoadmap.length > 0 && (
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#6366F1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      Priority Skills ({skillGapResults.learningRoadmap.length})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {skillGapResults.learningRoadmap.slice(0, 2).map((item, i) => (
                        <div key={i} style={{ fontSize: '11px', color: '#334155' }}>
                          • <strong>{item.skill}</strong> [{item.importance} Priority]
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mod7-empty-box">
                <span className="mod7-empty-title">Skill Gap Not Audited</span>
                <span className="mod7-empty-desc">
                  Audit competencies in Module 5 to identify missing skills and readiness.
                </span>
              </div>
            )}
          </section>
        </div>

        {/* =========================================================================
            E. RESUME IMPROVEMENT OVERVIEW
            ========================================================================= */}
        <section className="mod7-card">
          <div className="mod7-card-header">
            <h2 className="mod7-card-title">
              <Lightbulb size={18} color="#F59E0B" /> Resume Improvement Overview
            </h2>
            <span className="mod7-tag mod7-tag-warning">
              {pendingRecsCount} Pending Recommendations
            </span>
          </div>

          <div className="mod7-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Improvement Score</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>
                {analysisResults?.atsScore ? `${Math.min(98, analysisResults.atsScore + 18)}%` : 'Pending'}
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#059669', textTransform: 'uppercase', fontWeight: 600 }}>Completed Recommendations</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                {completedRecsCount}
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#DC2626', textTransform: 'uppercase', fontWeight: 600 }}>Pending Recommendations</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', marginTop: '2px' }}>
                {pendingRecsCount}
              </div>
            </div>
          </div>

          {improvementResults?.actionVerbEnhancements && (
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Key Phrasing Improvements
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {improvementResults.actionVerbEnhancements.slice(0, 2).map((enh, i) => (
                  <div key={i} style={{ padding: '10px 14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '12px' }}>
                    <div style={{ color: '#DC2626', textDecoration: 'line-through', marginBottom: '2px' }}>
                      [Before] {enh.originalPhrase}
                    </div>
                    <div style={{ color: '#059669', fontWeight: 600 }}>
                      [Suggested] {enh.suggestedRewrite}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            G. REPORT GENERATION BUTTONS & ACTIONS
            ========================================================================= */}
        <section>
          <ReportGenerator
            analysisResults={analysisResults}
            matchingResults={matchingResults}
            skillGapResults={skillGapResults}
            improvementResults={improvementResults}
            resumeText={resumeText || (useSampleData ? 'Sample Text' : '')}
            resumeFile={resumeFile}
            targetJobRole={targetJobRole}
            onGenerateReport={() => setShowReportPreview(true)}
          />
        </section>

        {/* =========================================================================
            REPORT PREVIEW (COLLAPSIBLE / TOGGLEABLE)
            ========================================================================= */}
        {showReportPreview && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#172033' }}>
                Dossier Report Preview (Print & PDF Output)
              </h2>
              <button
                type="button"
                className="mod7-btn mod7-btn-outline"
                onClick={() => setShowReportPreview(false)}
              >
                Close Preview
              </button>
            </div>

            <ReportPreview
              analysisResults={analysisResults}
              matchingResults={matchingResults}
              skillGapResults={skillGapResults}
              improvementResults={improvementResults}
              resumeFile={resumeFile}
              resumeText={resumeText || (useSampleData ? 'Sample Text' : '')}
              targetJobRole={targetJobRole}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default DashboardReportPage;
