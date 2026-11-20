import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Printer,
  Download,
  Sparkles,
  Award,
  AlertTriangle,
  Briefcase,
  Target,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Copy,
  Check,
  Eye,
  Layout,
  FileSearch,
  UploadCloud,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { generateResumePdfReport } from '../dashboard/pdfReportService';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

export const ReportsPage = () => {
  const {
    resumeFile,
    resumeText,
    analysisResults,
    matchingResults,
    skillAnalysisResults,
    improvementSuggestions,
    targetJobRole,
    resetAnalysis
  } = useApp();

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copiedRewriteIndex, setCopiedRewriteIndex] = useState(null);
  const [viewMode, setViewMode] = useState('document'); // 'document' (Print Preview) | 'interactive'
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Trigger jsPDF report generation and download
  const handleDownloadJsPdf = async () => {
    setIsPdfGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      generateResumePdfReport({
        resumeFile,
        resumeText,
        analysisResults,
        matchingResults,
        skillAnalysisResults,
        improvementSuggestions,
        targetJobRole,
        currentUser
      });
    } catch (err) {
      console.error('jsPDF Error:', err);
      alert('Failed to generate PDF report: ' + err.message);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Trigger browser print dialog for Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Reset analysis handler with confirmation
  const handleStartNewAnalysis = () => {
    if (
      window.confirm(
        'Start a completely new analysis? This will clear active resume data and all generated report metrics.'
      )
    ) {
      resetAnalysis();
      navigate('/upload-resume');
    }
  };

  // Copy individual suggested rewrite to clipboard
  const handleCopyRewrite = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRewriteIndex(idx);
      setTimeout(() => setCopiedRewriteIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy rewrite:', err);
    }
  };

  // Copy plain text summary to clipboard
  const handleCopySummary = async () => {
    const candidateName = analysisResults?.candidate?.name || 'Candidate';
    const atsScore = analysisResults?.atsScore != null ? `${analysisResults.atsScore}/100` : 'Pending';
    const jobMatch = matchingResults?.matchPercentage != null ? `${matchingResults.matchPercentage}%` : 'Pending';
    const skillReadiness = skillAnalysisResults?.readinessScore != null ? `${skillAnalysisResults.readinessScore}%` : 'Pending';

    const textSummary = `
RESUMATE AI - Comprehensive Resume Dossier
Candidate: ${candidateName}
Document: ${resumeFile?.name || 'Pasted Text Resume'}
Target Role: ${targetJobRole || skillAnalysisResults?.targetRole || 'General'}
Generated: ${new Date().toLocaleDateString()}

KEY SCORES:
- ATS Compatibility: ${atsScore}
- Job Match Fit: ${jobMatch}
- Skill Readiness: ${skillReadiness}

EXECUTIVE SUMMARY:
${analysisResults?.summary || 'Pending AI analysis.'}

KEY STRENGTHS:
${(analysisResults?.keyStrengths || []).map((s) => `• ${s}`).join('\n') || 'None recorded'}

AREAS FOR IMPROVEMENT:
${(analysisResults?.criticalWeaknesses || []).map((w) => `• ${w}`).join('\n') || 'None recorded'}

MISSING SKILLS:
${(skillAnalysisResults?.missingCriticalSkills || []).map((sk) => `• ${sk}`).join('\n') || 'None recorded'}
`.trim();

    try {
      await navigator.clipboard.writeText(textSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  const candidate = analysisResults?.candidate || {};
  const [reportDate] = useState(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // If no resume is active at all, show helpful empty state
  if (!resumeText) {
    return (
      <div>
        <PageHeader
          title="Consolidated Career & Resume Dossier"
          description="Exportable dossier aggregating ATS compliance, job compatibility, skill gap diagnosis, and phrasing rewrites."
          badge="Module 7: Reports"
          icon={FileText}
        />
        <EmptyState
          icon={FileSearch}
          title="No Active Resume Available for Reporting"
          description="Upload or paste candidate resume text in Module 2 to generate an executive-ready dossier and printable PDF."
          actionLabel="Upload Candidate Resume"
          actionIcon={UploadCloud}
          onAction={() => navigate('/upload-resume')}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Top Page Header (Hidden in Print View) */}
      <div className="no-print">
        <PageHeader
          title="Consolidated Analysis Report & Preview"
          description="Full-spectrum career dossier ready for candidate review, team presentation, or browser Print-to-PDF export."
          badge="Module 7: Reports"
          icon={FileText}
          actions={
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* View Switcher Toggle */}
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode('document')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: 'var(--font-xs)',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'document' ? 'var(--color-primary)' : 'transparent',
                    color: viewMode === 'document' ? '#ffffff' : 'var(--color-text-secondary)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Eye size={14} /> Document Preview (A4)
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('interactive')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: 'var(--font-xs)',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'interactive' ? 'var(--color-primary)' : 'transparent',
                    color: viewMode === 'interactive' ? '#ffffff' : 'var(--color-text-secondary)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Layout size={14} /> Interactive Dossier
                </button>
              </div>

              <Button
                variant="outline"
                icon={copied ? Check : Copy}
                onClick={handleCopySummary}
                title="Copy plain-text summary"
              >
                {copied ? 'Copied!' : 'Copy Summary'}
              </Button>

              <Button
                variant="outline"
                icon={RotateCcw}
                onClick={handleStartNewAnalysis}
                title="Start a new analysis session"
              >
                New Analysis
              </Button>

              <Button
                variant="primary"
                icon={Download}
                isLoading={isPdfGenerating}
                onClick={handleDownloadJsPdf}
                title="Download multi-page PDF generated via jsPDF"
              >
                {isPdfGenerating ? 'Generating PDF...' : 'Download jsPDF'}
              </Button>

              <Button
                variant="outline"
                icon={Printer}
                onClick={handlePrint}
                title="Print or Save as PDF via browser"
              >
                Browser Print
              </Button>
            </div>
          }
        />

        {/* Informational Banner if some modules have not yet been completed */}
        {(!analysisResults || !matchingResults || !skillAnalysisResults || !improvementSuggestions) && (
          <div className="alert alert-warning" style={{ marginBottom: '24px' }}>
            <Sparkles size={18} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 'var(--font-xs)' }}>
              <strong>Partial Analysis Detected:</strong> Some modules have not been executed yet. You can
              print the current dossier now, or run the pending modules to complete all sections:
              <span style={{ display: 'inline-flex', gap: '8px', marginLeft: '8px', flexWrap: 'wrap' }}>
                {!analysisResults && (
                  <button
                    type="button"
                    onClick={() => navigate('/ai-analysis')}
                    style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 600 }}
                  >
                    Run AI Audit
                  </button>
                )}
                {!matchingResults && (
                  <button
                    type="button"
                    onClick={() => navigate('/job-matching')}
                    style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 600 }}
                  >
                    Match Job
                  </button>
                )}
                {!skillAnalysisResults && (
                  <button
                    type="button"
                    onClick={() => navigate('/skill-gap')}
                    style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 600 }}
                  >
                    Skill Gap Audit
                  </button>
                )}
                {!improvementSuggestions && (
                  <button
                    type="button"
                    onClick={() => navigate('/improvements')}
                    style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 600 }}
                  >
                    Get Rewrites
                  </button>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          INTERACTIVE DOSSIER VIEW (Shown on Screen when viewMode === 'interactive')
          ========================================================================= */}
      {viewMode === 'interactive' && (
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          {/* Executive Overview Banner */}
          <div className="resumate-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <UserCheck size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, margin: 0 }}>
                  {candidate.name || 'Candidate Dossier'}
                </h2>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                  Document: {resumeFile?.name || 'Raw Text Resume'} • Target Role: {targetJobRole || skillAnalysisResults?.targetRole || 'General'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
                Print Dossier
              </Button>
              <Button variant="primary" size="sm" icon={Eye} onClick={() => setViewMode('document')}>
                A4 Sheet Preview
              </Button>
            </div>
          </div>

          {/* Interactive KPIs */}
          <div className="grid-3">
            <div className="resumate-card" style={{ textAlign: 'center', padding: '24px' }}>
              <span className="badge badge-primary">ATS Score</span>
              <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-primary)', margin: '8px 0' }}>
                {analysisResults?.atsScore != null ? `${analysisResults.atsScore}/100` : 'Pending'}
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {analysisResults ? 'Applicant Tracking System Score' : 'Module 3 not executed'}
              </p>
            </div>

            <div className="resumate-card" style={{ textAlign: 'center', padding: '24px' }}>
              <span className="badge badge-secondary">Job Match Fit</span>
              <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-secondary)', margin: '8px 0' }}>
                {matchingResults?.matchPercentage != null ? `${matchingResults.matchPercentage}%` : 'Pending'}
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {matchingResults?.verdict || 'Module 4 not executed'}
              </p>
            </div>

            <div className="resumate-card" style={{ textAlign: 'center', padding: '24px' }}>
              <span className="badge badge-success">Skill Readiness</span>
              <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-success)', margin: '8px 0' }}>
                {skillAnalysisResults?.readinessScore != null ? `${skillAnalysisResults.readinessScore}%` : 'Pending'}
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                {skillAnalysisResults ? 'Target Role Competency Index' : 'Module 5 not executed'}
              </p>
            </div>
          </div>

          {/* Candidate Profile Summary */}
          {analysisResults?.summary && (
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title">
                  <FileText size={18} color="var(--color-primary)" />
                  Executive Profile Summary
                </h3>
              </div>
              <p style={{ fontSize: 'var(--font-sm)', lineHeight: '1.7', color: 'var(--color-text-main)' }}>
                {analysisResults.summary}
              </p>
            </div>
          )}

          {/* Strengths & Weaknesses Grid */}
          {analysisResults && (
            <div className="grid-2">
              <div className="resumate-card">
                <div className="card-header">
                  <h3 className="card-title" style={{ fontSize: 'var(--font-sm)', color: 'var(--color-success)' }}>
                    <CheckCircle2 size={16} /> Key Strengths Identified
                  </h3>
                </div>
                <div className="strengths-list">
                  {(analysisResults.keyStrengths || []).map((str, idx) => (
                    <div key={idx} className="strength-item-card">
                      <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="resumate-card">
                <div className="card-header">
                  <h3 className="card-title" style={{ fontSize: 'var(--font-sm)', color: 'var(--color-danger)' }}>
                    <AlertTriangle size={16} /> Critical Areas for Improvement
                  </h3>
                </div>
                <div className="priorities-list">
                  {(analysisResults.criticalWeaknesses || []).map((w, idx) => (
                    <div key={idx} className="priority-item-card high">
                      <span>{w}</span>
                      <span className="badge badge-danger">Critical</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Job Matching Keywords */}
          {matchingResults && (
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Briefcase size={18} color="var(--color-secondary)" />
                  Job Fit & Keyword Coverage
                </h3>
                <span className="badge badge-secondary">{matchingResults.verdict}</span>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                {matchingResults.compatibilitySummary}
              </p>

              <div className="grid-2">
                <div>
                  <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-success)', marginBottom: '8px' }}>
                    Matching Keywords ({matchingResults.matchingKeywords?.length || 0})
                  </h4>
                  <div className="skill-tags-group">
                    {(matchingResults.matchingKeywords || []).map((kw, i) => (
                      <span key={i} className="skill-tag skill-tag-acquired">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-danger)', marginBottom: '8px' }}>
                    Missing Keywords ({matchingResults.missingKeywords?.length || 0})
                  </h4>
                  <div className="skill-tags-group">
                    {(matchingResults.missingKeywords || []).map((kw, i) => (
                      <span key={i} className="skill-tag skill-tag-missing">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skill Gap & Roadmap */}
          {skillAnalysisResults && (
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Target size={18} color="var(--color-primary)" />
                  Skill Gap & Upskilling Roadmap
                </h3>
                <span className="badge badge-primary">Target: {skillAnalysisResults.targetRole}</span>
              </div>

              {skillAnalysisResults.learningRoadmap && skillAnalysisResults.learningRoadmap.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {skillAnalysisResults.learningRoadmap.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: 'var(--font-sm)' }}>{item.skill}</strong>
                        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                          Resource: {item.learningResource}
                        </p>
                      </div>
                      <span
                        className={`badge ${
                          item.importance === 'High'
                            ? 'badge-danger'
                            : item.importance === 'Medium'
                            ? 'badge-warning'
                            : 'badge-primary'
                        }`}
                      >
                        {item.importance} Priority
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bullet Point Rewrites with Copy Action */}
          {improvementSuggestions?.actionVerbEnhancements && (
            <div className="resumate-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Lightbulb size={18} color="var(--color-primary)" />
                  Interactive Bullet Point Rewrites
                </h3>
                <span className="badge badge-primary">
                  {improvementSuggestions.actionVerbEnhancements.length} Rewrites
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {improvementSuggestions.actionVerbEnhancements.map((enh, idx) => (
                  <div key={idx} className="bullet-diff-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <div className="bullet-diff-row" style={{ marginBottom: '6px' }}>
                          <span className="bullet-label-before">Before (Passive Phrase)</span>
                          <span className="bullet-text-before">{enh.originalPhrase}</span>
                        </div>
                        <div className="bullet-diff-row">
                          <span className="bullet-label-after">Suggested High-Impact Rewrite</span>
                          <span className="bullet-text-after">{enh.suggestedRewrite}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={copiedRewriteIndex === idx ? Check : Copy}
                        onClick={() => handleCopyRewrite(enh.suggestedRewrite, idx)}
                        title="Copy suggested rewrite"
                      >
                        {copiedRewriteIndex === idx ? 'Copied' : 'Copy'}
                      </Button>
                    </div>

                    {enh.reason && (
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        <strong>Why:</strong> {enh.reason}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          PRINT-READY FORMAL DOCUMENT SHEET (A4 Styling)
          Always active for browser printing, and rendered on screen in 'document' mode
          ========================================================================= */}
      <div className={`report-document-sheet ${viewMode === 'interactive' ? 'hide-on-screen' : ''}`}>
        {/* Document Header Letterhead */}
        <div className="report-doc-header">
          <div className="report-doc-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Sparkles size={16} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-primary)' }}>
                RESUMATE <span>AI</span>
              </span>
            </div>
            <h1 className="report-doc-title">
              {candidate.name || 'Candidate Career Dossier'}
            </h1>
            <p className="report-doc-subtitle">
              Comprehensive Resume Audit, ATS Optimization & Career Compatibility Assessment
            </p>

            {/* Candidate Metadata Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px', fontSize: '12px', color: '#475569' }}>
              {candidate.email && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={12} /> {candidate.email}
                </span>
              )}
              {candidate.phone && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={12} /> {candidate.phone}
                </span>
              )}
              {candidate.location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {candidate.location}
                </span>
              )}
              {candidate.linkedin && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={12} /> {candidate.linkedin}
                </span>
              )}
            </div>
          </div>

          <div className="report-doc-meta">
            <span className="certified-stamp">
              <ShieldCheck size={14} /> Certified Audit
            </span>
            <span style={{ marginTop: '8px' }}>
              <strong>Date:</strong> {reportDate}
            </span>
            <span>
              <strong>File:</strong> {resumeFile?.name || 'Raw Text Resume'}
            </span>
            <span>
              <strong>Target Role:</strong> {targetJobRole || skillAnalysisResults?.targetRole || 'General'}
            </span>
          </div>
        </div>

        {/* SECTION 1: Performance Scorecards Banner */}
        <div className="report-section">
          <h2 className="report-section-title">
            <Award size={18} color="var(--color-primary)" />
            Core Evaluation Metrics
          </h2>

          <div className="report-kpi-banner">
            <div className="report-kpi-box">
              <div className="report-kpi-label">ATS Compatibility Score</div>
              <div className="report-kpi-val" style={{ color: 'var(--color-primary)' }}>
                {analysisResults?.atsScore != null ? `${analysisResults.atsScore}/100` : 'Pending'}
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                {analysisResults ? 'Gemini ATS Compliance' : 'Module 3 not executed'}
              </span>
            </div>

            <div className="report-kpi-box">
              <div className="report-kpi-label">Job Match Fit</div>
              <div className="report-kpi-val" style={{ color: 'var(--color-secondary)' }}>
                {matchingResults?.matchPercentage != null ? `${matchingResults.matchPercentage}%` : 'Pending'}
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                {matchingResults?.verdict || 'Module 4 not executed'}
              </span>
            </div>

            <div className="report-kpi-box">
              <div className="report-kpi-label">Skill Readiness Index</div>
              <div className="report-kpi-val" style={{ color: 'var(--color-success)' }}>
                {skillAnalysisResults?.readinessScore != null ? `${skillAnalysisResults.readinessScore}%` : 'Pending'}
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                {skillAnalysisResults ? 'Role Readiness Index' : 'Module 5 not executed'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: ATS Breakdown Dimension Table */}
        {analysisResults?.atsScoreBreakdown && (
          <div className="report-section">
            <h2 className="report-section-title">
              <Sparkles size={18} color="var(--color-primary)" />
              ATS Scoring Breakdown
            </h2>

            <table className="report-table">
              <thead>
                <tr>
                  <th>Audit Dimension</th>
                  <th>Score (0-100)</th>
                  <th>Standard Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Formatting & Layout Compliance</td>
                  <td><strong>{analysisResults.atsScoreBreakdown.formatting || 0} / 100</strong></td>
                  <td>
                    <span className={`badge ${analysisResults.atsScoreBreakdown.formatting >= 75 ? 'badge-success' : 'badge-warning'}`}>
                      {analysisResults.atsScoreBreakdown.formatting >= 75 ? 'ATS Compliant' : 'Needs Clean-up'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Keyword Density & Relevance</td>
                  <td><strong>{analysisResults.atsScoreBreakdown.keywordRelevance || 0} / 100</strong></td>
                  <td>
                    <span className={`badge ${analysisResults.atsScoreBreakdown.keywordRelevance >= 75 ? 'badge-success' : 'badge-warning'}`}>
                      {analysisResults.atsScoreBreakdown.keywordRelevance >= 75 ? 'Strong Keywords' : 'Keyword Gaps'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Impact & Measurable Metrics</td>
                  <td><strong>{analysisResults.atsScoreBreakdown.impactAndMetrics || 0} / 100</strong></td>
                  <td>
                    <span className={`badge ${analysisResults.atsScoreBreakdown.impactAndMetrics >= 75 ? 'badge-success' : 'badge-warning'}`}>
                      {analysisResults.atsScoreBreakdown.impactAndMetrics >= 75 ? 'Metric Driven' : 'Qualify Achievements'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Section Completeness & Order</td>
                  <td><strong>{analysisResults.atsScoreBreakdown.sectionsCompleteness || 0} / 100</strong></td>
                  <td>
                    <span className={`badge ${analysisResults.atsScoreBreakdown.sectionsCompleteness >= 75 ? 'badge-success' : 'badge-warning'}`}>
                      {analysisResults.atsScoreBreakdown.sectionsCompleteness >= 75 ? 'Complete' : 'Missing Sections'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* SECTION 3: Executive Summary & Proposed Upgrade */}
        {(analysisResults?.summary || improvementSuggestions?.executiveSummarySuggestion) && (
          <div className="report-section">
            <h2 className="report-section-title">
              <FileText size={18} color="var(--color-primary)" />
              Executive Profile & Summary
            </h2>

            {analysisResults?.summary && (
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 600 }}>
                  Current Profile Summary:
                </span>
                <p style={{ fontSize: '13px', lineHeight: '1.7', marginTop: '4px', color: '#1E293B' }}>
                  {analysisResults.summary}
                </p>
              </div>
            )}

            {improvementSuggestions?.executiveSummarySuggestion && (
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#EEF2FF',
                  border: '1px solid #E0E7FF'
                }}
              >
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700 }}>
                  ResuMate AI Recommended Upgrade:
                </span>
                <p style={{ fontSize: '13px', lineHeight: '1.7', marginTop: '4px', fontStyle: 'italic', color: '#0F172A' }}>
                  "{improvementSuggestions.executiveSummarySuggestion}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: Strengths & Critical Areas for Improvement */}
        {analysisResults && (
          <div className="report-section">
            <h2 className="report-section-title">
              <Award size={18} color="var(--color-success)" />
              Candidate Strengths & Audit Priorities
            </h2>

            <div className="grid-2">
              <div>
                <h3 style={{ fontSize: '13px', color: '#059669', marginBottom: '8px', fontWeight: 700 }}>
                  Identified Strengths
                </h3>
                <ul style={{ paddingLeft: '18px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#1E293B' }}>
                  {(analysisResults.keyStrengths || []).map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                  {(!analysisResults.keyStrengths || analysisResults.keyStrengths.length === 0) && (
                    <li style={{ color: '#94A3B8' }}>No explicit strengths recorded.</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '13px', color: '#DC2626', marginBottom: '8px', fontWeight: 700 }}>
                  Critical Improvement Areas
                </h3>
                <ul style={{ paddingLeft: '18px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#1E293B' }}>
                  {(analysisResults.criticalWeaknesses || []).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                  {(!analysisResults.criticalWeaknesses || analysisResults.criticalWeaknesses.length === 0) && (
                    <li style={{ color: '#94A3B8' }}>No critical weaknesses identified.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: Job Match Analysis & Keywords */}
        {matchingResults && (
          <div className="report-section">
            <h2 className="report-section-title">
              <Briefcase size={18} color="var(--color-secondary)" />
              Job Compatibility & ATS Keyword Alignment
            </h2>

            {matchingResults.compatibilitySummary && (
              <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '14px', color: '#334155' }}>
                {matchingResults.compatibilitySummary}
              </p>
            )}

            <div className="grid-2">
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#059669', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Matching Keywords Found ({matchingResults.matchingKeywords?.length || 0})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(matchingResults.matchingKeywords || []).map((kw, idx) => (
                    <span key={idx} className="badge badge-success" style={{ fontSize: '11px' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#DC2626', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Missing Role Keywords ({matchingResults.missingKeywords?.length || 0})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(matchingResults.missingKeywords || []).map((kw, idx) => (
                    <span key={idx} className="badge badge-danger" style={{ fontSize: '11px' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: Skill Gap & Learning Roadmap */}
        {skillAnalysisResults && (
          <div className="report-section">
            <h2 className="report-section-title">
              <Target size={18} color="var(--color-primary)" />
              Skill Gap & Prioritized Upskilling Roadmap
            </h2>

            {/* Missing Critical Skills */}
            {skillAnalysisResults.missingCriticalSkills && skillAnalysisResults.missingCriticalSkills.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#DC2626', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Missing Critical Competencies
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skillAnalysisResults.missingCriticalSkills.map((sk, idx) => (
                    <span key={idx} className="badge badge-danger" style={{ fontSize: '11px' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Learning Roadmap Table */}
            {skillAnalysisResults.learningRoadmap && skillAnalysisResults.learningRoadmap.length > 0 && (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Target Skill</th>
                    <th>Priority Level</th>
                    <th>Recommended Learning Resource</th>
                  </tr>
                </thead>
                <tbody>
                  {skillAnalysisResults.learningRoadmap.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.skill}</strong></td>
                      <td>
                        <span
                          className={`badge ${
                            item.importance === 'High'
                              ? 'badge-danger'
                              : item.importance === 'Medium'
                              ? 'badge-warning'
                              : 'badge-primary'
                          }`}
                        >
                          {item.importance}
                        </span>
                      </td>
                      <td>{item.learningResource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* SECTION 7: Bullet Point Rewrites (High-Impact Phrasing) */}
        {improvementSuggestions?.actionVerbEnhancements && improvementSuggestions.actionVerbEnhancements.length > 0 && (
          <div className="report-section">
            <h2 className="report-section-title">
              <Lightbulb size={18} color="var(--color-primary)" />
              Resume Action-Verb Phrasing Enhancements
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {improvementSuggestions.actionVerbEnhancements.map((enh, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ color: '#DC2626', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>
                      Original:
                    </span>{' '}
                    <span style={{ textDecoration: 'line-through', color: '#64748B' }}>
                      {enh.originalPhrase}
                    </span>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ color: '#059669', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>
                      Suggested Rewrite:
                    </span>{' '}
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>
                      {enh.suggestedRewrite}
                    </span>
                  </div>
                  {enh.reason && (
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      <strong>Why:</strong> {enh.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 8: ATS Formatting & Optimization Tips */}
        {improvementSuggestions?.atsOptimizationTips && (
          <div className="report-section">
            <h2 className="report-section-title">
              <ShieldCheck size={18} color="var(--color-primary)" />
              ATS Optimization Best Practices
            </h2>
            <ul style={{ paddingLeft: '18px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', color: '#334155' }}>
              {improvementSuggestions.atsOptimizationTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Official Certified Footer Stamp */}
        <div className="report-certified-footer">
          <div>
            <strong>RESUMATE AI</strong> • Autonomous Resume Audit & Career Intelligence System
            <div style={{ fontSize: '10px', marginTop: '2px' }}>
              Generated via Google Gemini Semantic Models • Strictly Confidential
            </div>
          </div>
          <div className="certified-stamp">
            <ShieldCheck size={14} /> Certified Dossier
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
