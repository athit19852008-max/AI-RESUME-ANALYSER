import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import Button from '../../components/Button';

/**
 * SkillGapOverview Component
 * Displays:
 * - Total skills identified
 * - Matching skills (acquiredSkills)
 * - Missing skills (missingCriticalSkills, missingOptionalSkills)
 * - Skills requiring improvement (learningRoadmap)
 * - Skill gap summary / readiness score
 */
export const SkillGapOverview = ({ skillAnalysisResults, resumeText }) => {
  const navigate = useNavigate();

  if (!skillAnalysisResults) {
    return (
      <div className="resumate-card">
        <div className="card-header">
          <h2 className="card-title">
            <Target size={20} color="var(--color-primary)" />
            Skill Gap & Competency Diagnosis
          </h2>
          <span className="badge badge-warning">Not Audited</span>
        </div>

        <div className="mini-empty-state" style={{ padding: '32px 16px' }}>
          <Target size={28} className="mini-empty-icon" />
          <h3 className="mini-empty-title">Skill Gap Not Diagnosed</h3>
          <p className="mini-empty-desc">
            Benchmark your resume against industry role standards in Module 5 to identify missing competencies and generate a tailored roadmap.
          </p>
          <Button
            variant="primary"
            icon={Target}
            onClick={() => navigate(resumeText ? '/skill-gap' : '/upload-resume')}
          >
            {resumeText ? 'Run Skill Gap Audit' : 'Upload Resume First'}
          </Button>
        </div>
      </div>
    );
  }

  const acquired = skillAnalysisResults.acquiredSkills || [];
  const missingCritical = skillAnalysisResults.missingCriticalSkills || [];
  const totalIdentified = acquired.length + missingCritical.length;
  const readiness = skillAnalysisResults.readinessScore || 0;
  const roadmap = skillAnalysisResults.learningRoadmap || [];

  return (
    <div className="resumate-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={20} color="var(--color-primary)" />
          <div>
            <h2 className="card-title" style={{ fontSize: 'var(--font-md)', margin: 0 }}>
              Skill Gap & Role Readiness
            </h2>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
              Target Role: <strong>{skillAnalysisResults.targetRole || 'Software Engineer'}</strong>
            </span>
          </div>
        </div>

        <span className="badge badge-primary">{readiness}% Readiness Index</span>
      </div>

      {/* Summary KPI row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        <div style={{ padding: '12px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Skills Evaluated</span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '2px' }}>{totalIdentified}</div>
        </div>

        <div style={{ padding: '12px', backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-success)', textTransform: 'uppercase', fontWeight: 600 }}>Matching Skills</span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-success)', marginTop: '2px' }}>{acquired.length}</div>
        </div>

        <div style={{ padding: '12px', backgroundColor: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-danger)', textTransform: 'uppercase', fontWeight: 600 }}>Missing Critical</span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-danger)', marginTop: '2px' }}>{missingCritical.length}</div>
        </div>

        <div style={{ padding: '12px', backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 600 }}>Roadmap Items</span>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '2px' }}>{roadmap.length}</div>
        </div>
      </div>

      {/* Skills Badges Grid */}
      <div className="grid-2" style={{ marginBottom: '16px' }}>
        {/* Acquired Skills */}
        <div>
          <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-success)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} /> Matching Acquired Skills ({acquired.length})
          </h4>
          <div className="dash-chip-container">
            {acquired.map((sk, idx) => (
              <span key={idx} className="badge badge-success" style={{ fontSize: '11px' }}>
                {sk}
              </span>
            ))}
            {acquired.length === 0 && (
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>None recorded</span>
            )}
          </div>
        </div>

        {/* Missing Critical Skills */}
        <div>
          <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-danger)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} /> Missing Critical Skills ({missingCritical.length})
          </h4>
          <div className="dash-chip-container">
            {missingCritical.map((sk, idx) => (
              <span key={idx} className="badge badge-danger" style={{ fontSize: '11px' }}>
                {sk}
              </span>
            ))}
            {missingCritical.length === 0 && (
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>No critical skill gaps</span>
            )}
          </div>
        </div>
      </div>

      {/* Skills Requiring Improvement (Roadmap List) */}
      {roadmap.length > 0 && (
        <div>
          <h4 style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={14} /> Skills Requiring Targeted Improvement
          </h4>
          <div className="dash-card-list">
            {roadmap.slice(0, 3).map((item, idx) => (
              <div key={idx} className="dash-list-item neutral" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-main)' }}>
                    {item.skill}
                  </strong>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
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
                  style={{ flexShrink: 0 }}
                >
                  {item.importance} Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapOverview;
