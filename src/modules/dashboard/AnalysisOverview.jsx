import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/Button';

/**
 * AnalysisOverview Component
 * Displays:
 * - Overall resume score out of 100 with an SVG circular progress meter
 * - Performance category badge
 * - Key resume strengths
 * - Resume weaknesses & missing information
 */
export const AnalysisOverview = ({ analysisResults, resumeText }) => {
  const navigate = useNavigate();

  if (!analysisResults) {
    return (
      <div className="resumate-card">
        <div className="card-header">
          <h2 className="card-title">
            <Sparkles size={20} color="var(--color-primary)" />
            AI Resume Analysis Overview
          </h2>
          <span className="badge badge-warning">Pending Audit</span>
        </div>

        <div className="mini-empty-state" style={{ padding: '32px 16px' }}>
          <Sparkles size={28} className="mini-empty-icon" />
          <h3 className="mini-empty-title">Resume Not Analyzed by AI</h3>
          <p className="mini-empty-desc">
            Run Module 3 to extract sections, evaluate ATS formatting compliance, and detect strengths & weaknesses.
          </p>
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={() => navigate(resumeText ? '/ai-analysis' : '/upload-resume')}
          >
            {resumeText ? 'Run AI Analysis' : 'Upload Resume First'}
          </Button>
        </div>
      </div>
    );
  }

  const atsScore = analysisResults.atsScore || 0;

  // Performance category determination
  let performanceCategory = 'Needs Optimization';
  let categoryBadgeClass = 'badge-danger';
  let strokeColor = 'var(--color-danger)';

  if (atsScore >= 80) {
    performanceCategory = 'High ATS Compliance';
    categoryBadgeClass = 'badge-success';
    strokeColor = 'var(--color-success)';
  } else if (atsScore >= 60) {
    performanceCategory = 'Moderate ATS Fit';
    categoryBadgeClass = 'badge-warning';
    strokeColor = 'var(--color-warning)';
  }

  // Circular gauge calculations (r=40, circumference = 2 * pi * 40 ≈ 251.32)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="resumate-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="var(--color-primary)" />
          <h2 className="card-title" style={{ fontSize: 'var(--font-md)', margin: 0 }}>
            Resume Analysis & Performance Audit
          </h2>
        </div>
        <span className={`badge ${categoryBadgeClass}`}>{performanceCategory}</span>
      </div>

      {/* Circular Score Gauge & Category Card */}
      <div className="score-circular-container">
        <div className="circular-gauge-wrapper">
          <svg className="circular-gauge-svg" viewBox="0 0 100 100">
            {/* Background track circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="var(--color-border)"
              strokeWidth="8"
            />
            {/* Value stroke circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="circular-gauge-text">
            <span className="circular-gauge-number">{atsScore}</span>
            <span className="circular-gauge-label">OUT OF 100</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, margin: '0 0 4px 0' }}>
            Overall ATS Compatibility: {performanceCategory}
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {atsScore >= 80
              ? 'Your resume demonstrates high alignment with typical enterprise Applicant Tracking Systems.'
              : atsScore >= 60
              ? 'Your resume is readable by ATS engines, but could be enhanced by optimizing keywords and quantifiable metrics.'
              : 'ATS parsers may struggle with layout, missing sections, or low industry keyword density.'}
          </p>

          {analysisResults.summary && (
            <div style={{ marginTop: '10px', fontSize: 'var(--font-xs)', color: 'var(--color-text-main)', borderLeft: '3px solid var(--color-primary)', paddingLeft: '10px' }}>
              <strong>Profile Summary:</strong> {analysisResults.summary}
            </div>
          )}
        </div>
      </div>

      {/* Two columns: Strengths & Weaknesses */}
      <div className="grid-2">
        {/* Strengths */}
        <div>
          <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-success)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={14} /> Resume Strengths ({analysisResults.keyStrengths?.length || 0})
          </h4>
          <div className="dash-card-list">
            {(analysisResults.keyStrengths || []).map((str, idx) => (
              <div key={idx} className="dash-list-item success">
                <CheckCircle2 size={14} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{str}</span>
              </div>
            ))}
            {(!analysisResults.keyStrengths || analysisResults.keyStrengths.length === 0) && (
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                No explicit strengths detected.
              </p>
            )}
          </div>
        </div>

        {/* Weaknesses / Missing Info */}
        <div>
          <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-danger)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} /> Critical Weaknesses & Missing Info ({analysisResults.criticalWeaknesses?.length || 0})
          </h4>
          <div className="dash-card-list">
            {(analysisResults.criticalWeaknesses || []).map((w, idx) => (
              <div key={idx} className="dash-list-item danger">
                <AlertCircle size={14} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{w}</span>
              </div>
            ))}
            {(!analysisResults.criticalWeaknesses || analysisResults.criticalWeaknesses.length === 0) && (
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                No critical weaknesses detected.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisOverview;
