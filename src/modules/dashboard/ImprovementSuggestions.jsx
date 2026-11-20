import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/Button';

/**
 * ImprovementSuggestions Component
 * Displays AI-generated phrasing upgrades and checklist from AppContext:
 * - Proposed executive summary rewrite
 * - Action-verb before vs after cards with rationale
 * - ATS optimization guidelines
 * - Formatting checklist
 */
export const ImprovementSuggestions = ({ improvementSuggestions, resumeText }) => {
  const navigate = useNavigate();

  if (!improvementSuggestions) {
    return (
      <div className="resumate-card">
        <div className="card-header">
          <h2 className="card-title">
            <Lightbulb size={20} color="var(--color-primary)" />
            AI Resume Improvement Suggestions
          </h2>
          <span className="badge badge-warning">Pending Suggestions</span>
        </div>

        <div className="mini-empty-state" style={{ padding: '32px 16px' }}>
          <Lightbulb size={28} className="mini-empty-icon" />
          <h3 className="mini-empty-title">No AI Suggestions Generated</h3>
          <p className="mini-empty-desc">
            Generate bullet point rewrites, quantifiable achievements, and ATS compliance guidelines in Module 6.
          </p>
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={() => navigate(resumeText ? '/improvements' : '/upload-resume')}
          >
            {resumeText ? 'Generate Improvement Suggestions' : 'Upload Resume First'}
          </Button>
        </div>
      </div>
    );
  }

  const rewrites = improvementSuggestions.actionVerbEnhancements || [];
  const atsTips = improvementSuggestions.atsOptimizationTips || [];
  const formatTips = improvementSuggestions.formattingAndStructureTips || [];

  return (
    <div className="resumate-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lightbulb size={20} color="var(--color-primary)" />
          <div>
            <h2 className="card-title" style={{ fontSize: 'var(--font-md)', margin: 0 }}>
              AI Improvement Suggestions & Rewrites
            </h2>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
              Action-oriented phrasing enhancements and ATS compliance guidelines
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={ArrowRight}
          onClick={() => navigate('/improvements')}
        >
          View All Suggestions
        </Button>
      </div>

      {/* Proposed Executive Summary if present */}
      {improvementSuggestions.executiveSummarySuggestion && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary-light)',
            border: '1px solid var(--color-primary-subtle)',
            marginBottom: '16px'
          }}
        >
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-primary-hover)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            Recommended Executive Summary Upgrade:
          </span>
          <p style={{ fontSize: 'var(--font-xs)', fontStyle: 'italic', margin: 0, color: 'var(--color-text-main)', lineHeight: '1.6' }}>
            "{improvementSuggestions.executiveSummarySuggestion}"
          </p>
        </div>
      )}

      {/* Bullet Rewrites Before/After Cards */}
      {rewrites.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '10px' }}>
            Sample Bullet Point Rewrites ({rewrites.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rewrites.slice(0, 3).map((enh, idx) => (
              <div key={idx} className="dash-diff-box">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-danger)', fontWeight: 700, textTransform: 'uppercase', flexShrink: 0 }}>
                    Before:
                  </span>
                  <span className="dash-diff-before">{enh.originalPhrase}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-success)', fontWeight: 700, textTransform: 'uppercase', flexShrink: 0 }}>
                    Rewrite:
                  </span>
                  <span className="dash-diff-after">{enh.suggestedRewrite}</span>
                </div>
                {enh.reason && (
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    <strong>Why:</strong> {enh.reason}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Tips Checklist */}
      {(atsTips.length > 0 || formatTips.length > 0) && (
        <div>
          <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '10px' }}>
            ATS & Formatting Recommendations Checklist
          </h4>
          <div className="dash-card-list">
            {[...atsTips.slice(0, 2), ...formatTips.slice(0, 2)].map((tip, idx) => (
              <div key={idx} className="dash-list-item neutral">
                <CheckCircle2 size={14} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovementSuggestions;
