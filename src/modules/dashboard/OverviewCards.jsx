import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Target,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import Button from '../../components/Button';

/**
 * OverviewCards Component
 * Displays 4 core KPI cards populated strictly with actual AppContext data:
 * 1. Resume Analysis Score
 * 2. Job Match Score
 * 3. Skills Identified
 * 4. Improvement Suggestions
 */
export const OverviewCards = ({
  resumeText,
  analysisResults,
  matchingResults,
  skillAnalysisResults,
  improvementSuggestions
}) => {
  const navigate = useNavigate();

  // Skills identified calculation
  const totalSkillsCount = React.useMemo(() => {
    if (analysisResults?.skills) {
      const tech = analysisResults.skills.technical?.length || 0;
      const soft = analysisResults.skills.soft?.length || 0;
      const tools = analysisResults.skills.toolsAndFrameworks?.length || 0;
      return tech + soft + tools;
    }
    if (skillAnalysisResults?.acquiredSkills) {
      return skillAnalysisResults.acquiredSkills.length;
    }
    return null;
  }, [analysisResults, skillAnalysisResults]);

  // Suggestions count calculation
  const totalSuggestionsCount = React.useMemo(() => {
    if (!improvementSuggestions) return null;
    const rewrites = improvementSuggestions.actionVerbEnhancements?.length || 0;
    const atsTips = improvementSuggestions.atsOptimizationTips?.length || 0;
    const formatTips = improvementSuggestions.formattingAndStructureTips?.length || 0;
    return rewrites + atsTips + formatTips;
  }, [improvementSuggestions]);

  return (
    <div className="dash-overview-grid">
      {/* 1. Resume Analysis Score */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">ATS Audit Score</span>
          <div className="kpi-icon-wrap primary">
            <Sparkles size={18} />
          </div>
        </div>

        {analysisResults?.atsScore != null ? (
          <div>
            <div className="kpi-value-row">
              <span className="kpi-value primary">{analysisResults.atsScore}</span>
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
                / 100
              </span>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
              {analysisResults.atsScore >= 80
                ? 'High ATS Compliance'
                : analysisResults.atsScore >= 60
                ? 'Moderate ATS Fit'
                : 'Needs Optimization'}
            </p>
          </div>
        ) : (
          <div className="mini-empty-state">
            <Sparkles size={18} className="mini-empty-icon" />
            <span className="mini-empty-title">Not Analyzed</span>
            <p className="mini-empty-desc">Run Gemini AI audit to calculate ATS score</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(resumeText ? '/ai-analysis' : '/upload-resume')}
            >
              {resumeText ? 'Run AI Audit' : 'Upload Resume'}
            </Button>
          </div>
        )}

        <div className="kpi-footer">
          <span style={{ color: 'var(--color-text-muted)' }}>Module 3</span>
          <Link to="/ai-analysis" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            Open <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* 2. Job Match Score */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Job Match Fit</span>
          <div className="kpi-icon-wrap secondary">
            <Briefcase size={18} />
          </div>
        </div>

        {matchingResults?.matchPercentage != null ? (
          <div>
            <div className="kpi-value-row">
              <span className="kpi-value secondary">{matchingResults.matchPercentage}%</span>
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
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
              {matchingResults.matchingKeywords?.length || 0} matching keywords found
            </p>
          </div>
        ) : (
          <div className="mini-empty-state">
            <Briefcase size={18} className="mini-empty-icon" />
            <span className="mini-empty-title">Not Matched</span>
            <p className="mini-empty-desc">Compare resume against a target job posting</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(resumeText ? '/job-matching' : '/upload-resume')}
            >
              {resumeText ? 'Match Job' : 'Upload Resume'}
            </Button>
          </div>
        )}

        <div className="kpi-footer">
          <span style={{ color: 'var(--color-text-muted)' }}>Module 4</span>
          <Link to="/job-matching" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            Open <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* 3. Skills Identified */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Skills Identified</span>
          <div className="kpi-icon-wrap success">
            <Target size={18} />
          </div>
        </div>

        {totalSkillsCount != null ? (
          <div>
            <div className="kpi-value-row">
              <span className="kpi-value success">{totalSkillsCount}</span>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                competencies
              </span>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
              {skillAnalysisResults?.readinessScore != null
                ? `${skillAnalysisResults.readinessScore}% role readiness`
                : 'Extracted from resume'}
            </p>
          </div>
        ) : (
          <div className="mini-empty-state">
            <Target size={18} className="mini-empty-icon" />
            <span className="mini-empty-title">Not Audited</span>
            <p className="mini-empty-desc">Audit skill matrix and missing competencies</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(resumeText ? '/skill-gap' : '/upload-resume')}
            >
              {resumeText ? 'Run Skill Audit' : 'Upload Resume'}
            </Button>
          </div>
        )}

        <div className="kpi-footer">
          <span style={{ color: 'var(--color-text-muted)' }}>Module 5</span>
          <Link to="/skill-gap" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            Open <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {/* 4. Improvement Suggestions */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">AI Rewrites & Tips</span>
          <div className="kpi-icon-wrap warning">
            <Lightbulb size={18} />
          </div>
        </div>

        {totalSuggestionsCount != null ? (
          <div>
            <div className="kpi-value-row">
              <span className="kpi-value warning">{totalSuggestionsCount}</span>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                action items
              </span>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
              {improvementSuggestions?.actionVerbEnhancements?.length || 0} bullet rewrites ready
            </p>
          </div>
        ) : (
          <div className="mini-empty-state">
            <Lightbulb size={18} className="mini-empty-icon" />
            <span className="mini-empty-title">Not Generated</span>
            <p className="mini-empty-desc">Generate AI phrasing enhancements & rewrites</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(resumeText ? '/improvements' : '/upload-resume')}
            >
              {resumeText ? 'Get Rewrites' : 'Upload Resume'}
            </Button>
          </div>
        )}

        <div className="kpi-footer">
          <span style={{ color: 'var(--color-text-muted)' }}>Module 6</span>
          <Link to="/improvements" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            Open <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;
