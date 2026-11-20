import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Button from '../../components/Button';

/**
 * JobMatchingOverview Component
 * Displays job alignment information from AppContext matchingResults:
 * - Job title
 * - Company name (if available)
 * - Matching score & verdict
 * - Matching skills & Missing skills
 * - AI-generated summary
 */
export const JobMatchingOverview = ({
  matchingResults,
  targetJobRole,
  resumeText
}) => {
  const navigate = useNavigate();

  if (!matchingResults) {
    return (
      <div className="resumate-card">
        <div className="card-header">
          <h2 className="card-title">
            <Briefcase size={20} color="var(--color-primary)" />
            Job Description Matching Overview
          </h2>
          <span className="badge badge-warning">Not Matched</span>
        </div>

        <div className="mini-empty-state" style={{ padding: '32px 16px' }}>
          <Briefcase size={28} className="mini-empty-icon" />
          <h3 className="mini-empty-title">No Job Posting Matched Yet</h3>
          <p className="mini-empty-desc">
            Paste a target job posting in Module 4 to calculate role alignment, matched keywords, and missing requirements.
          </p>
          <Button
            variant="primary"
            icon={Briefcase}
            onClick={() => navigate(resumeText ? '/job-matching' : '/upload-resume')}
          >
            {resumeText ? 'Match With Job Description' : 'Upload Resume First'}
          </Button>
        </div>
      </div>
    );
  }

  const roleTitle = targetJobRole || matchingResults.keyRoleRequirements?.[0] || 'Target Role';
  const matchPct = matchingResults.matchPercentage || 0;

  return (
    <div className="resumate-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Briefcase size={20} color="var(--color-primary)" />
          <div>
            <h2 className="card-title" style={{ fontSize: 'var(--font-md)', margin: 0 }}>
              Job Matching: {roleTitle}
            </h2>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
              Candidate qualification alignment against job specifications
            </span>
          </div>
        </div>

        {matchingResults.verdict && (
          <span
            className={`badge ${
              matchingResults.verdict.toLowerCase().includes('strong')
                ? 'badge-success'
                : matchingResults.verdict.toLowerCase().includes('moderate')
                ? 'badge-warning'
                : 'badge-danger'
            }`}
          >
            {matchingResults.verdict}
          </span>
        )}
      </div>

      {/* Score and Summary banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '16px',
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ textAlign: 'center', minWidth: '100px' }}>
          <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-secondary)', lineHeight: 1 }}>
            {matchPct}%
          </span>
          <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
            Match Fit
          </span>
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <h4 style={{ fontSize: 'var(--font-xs)', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--color-text-main)' }}>
            AI Compatibility Evaluation:
          </h4>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {matchingResults.compatibilitySummary || 'Candidate qualifications compared against role requirements.'}
          </p>
        </div>
      </div>

      {/* Two columns: Matching skills vs Missing skills */}
      <div className="grid-2">
        <div>
          <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-success)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} /> Matching Skills Found ({matchingResults.matchingKeywords?.length || 0})
          </h4>
          <div className="dash-chip-container">
            {(matchingResults.matchingKeywords || []).map((kw, idx) => (
              <span key={idx} className="badge badge-success" style={{ fontSize: '11px' }}>
                {kw}
              </span>
            ))}
            {(!matchingResults.matchingKeywords || matchingResults.matchingKeywords.length === 0) && (
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                No matching keywords detected.
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-danger)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} /> Missing Role Skills ({matchingResults.missingKeywords?.length || 0})
          </h4>
          <div className="dash-chip-container">
            {(matchingResults.missingKeywords || []).map((kw, idx) => (
              <span key={idx} className="badge badge-danger" style={{ fontSize: '11px' }}>
                {kw}
              </span>
            ))}
            {(!matchingResults.missingKeywords || matchingResults.missingKeywords.length === 0) && (
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                No missing keywords identified.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatchingOverview;
