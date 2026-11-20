import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  BarChart3,
  Briefcase,
  Target,
  TrendingUp,
  Layers
} from 'lucide-react';

/**
 * AnalysisCharts Component - Module 7
 * Renders 4 dedicated Recharts visualizations:
 * 1. Job Match Score Chart
 * 2. Skill Coverage Chart
 * 3. Resume Improvement Score Chart
 * 4. Skills Comparison Chart
 */
export const AnalysisCharts = ({
  analysisResults,
  matchingResults,
  skillGapResults
}) => {
  // Chart 1: Job Match Score
  const jobMatchData = useMemo(() => {
    if (matchingResults?.matchPercentage == null) return null;
    return [
      { name: 'Current Match', score: matchingResults.matchPercentage, fill: '#8B5CF6' },
      { name: 'Benchmark Target', score: 100, fill: '#E2E8F0' }
    ];
  }, [matchingResults]);

  // Chart 2: Skill Coverage
  const skillCoverageData = useMemo(() => {
    const readiness = skillGapResults?.readinessScore;
    if (readiness == null) return null;
    return [
      { name: 'Role Readiness', percentage: readiness, fill: '#10B981' },
      { name: 'Target 100%', percentage: 100, fill: '#E2E8F0' }
    ];
  }, [skillGapResults]);

  // Chart 3: Resume Improvement Score (Current vs Potential)
  const improvementScoreData = useMemo(() => {
    if (!analysisResults?.atsScore) return null;
    const currentScore = analysisResults.atsScore;
    const potentialScore = Math.min(98, currentScore + 18);
    return [
      { metric: 'Current Score', score: currentScore, fill: '#6366F1' },
      { metric: 'With AI Rewrites', score: potentialScore, fill: '#10B981' }
    ];
  }, [analysisResults]);

  // Chart 4: Skills Comparison (Matched vs Missing)
  const skillsComparisonData = useMemo(() => {
    const matched = matchingResults?.matchingKeywords?.length || skillGapResults?.acquiredSkills?.length || 0;
    const missing = matchingResults?.missingKeywords?.length || skillGapResults?.missingCriticalSkills?.length || 0;

    if (matched === 0 && missing === 0) return null;

    return [
      { type: 'Matched Skills', count: matched, fill: '#10B981' },
      { type: 'Missing Skills', count: missing, fill: '#EF4444' }
    ];
  }, [matchingResults, skillGapResults]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart3 size={20} color="#6366F1" />
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#172033' }}>
          Analysis Visualizations & Performance Metrics
        </h2>
      </div>

      <div className="mod7-grid-4">
        {/* Chart 1: Job Match Score */}
        <div className="mod7-card">
          <div className="mod7-card-header">
            <h3 className="mod7-card-title" style={{ fontSize: '13px' }}>
              <Briefcase size={15} color="#8B5CF6" /> Job Match Fit
            </h3>
            {matchingResults && (
              <span className="mod7-tag mod7-tag-primary">
                {matchingResults.matchPercentage}%
              </span>
            )}
          </div>

          {jobMatchData ? (
            <div style={{ width: '100%', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobMatchData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Score']} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {jobMatchData.map((e, idx) => (
                      <Cell key={idx} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mod7-empty-box">
              <span className="mod7-empty-title">Job Match Data Pending</span>
              <span className="mod7-empty-desc">Chart populates when job description is matched.</span>
            </div>
          )}
        </div>

        {/* Chart 2: Skill Coverage */}
        <div className="mod7-card">
          <div className="mod7-card-header">
            <h3 className="mod7-card-title" style={{ fontSize: '13px' }}>
              <Target size={15} color="#10B981" /> Skill Coverage
            </h3>
            {skillGapResults && (
              <span className="mod7-tag mod7-tag-success">
                {skillGapResults.readinessScore}%
              </span>
            )}
          </div>

          {skillCoverageData ? (
            <div style={{ width: '100%', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillCoverageData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Coverage']} />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                    {skillCoverageData.map((e, idx) => (
                      <Cell key={idx} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mod7-empty-box">
              <span className="mod7-empty-title">Skill Gap Data Pending</span>
              <span className="mod7-empty-desc">Chart populates when skill gap is audited.</span>
            </div>
          )}
        </div>

        {/* Chart 3: Resume Improvement Score */}
        <div className="mod7-card">
          <div className="mod7-card-header">
            <h3 className="mod7-card-title" style={{ fontSize: '13px' }}>
              <TrendingUp size={15} color="#F59E0B" /> Score Potential
            </h3>
            {analysisResults && (
              <span className="mod7-tag mod7-tag-warning">
                +18% Potential
              </span>
            )}
          </div>

          {improvementScoreData ? (
            <div style={{ width: '100%', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={improvementScoreData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="metric" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val) => [`${val}/100`, 'Score']} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {improvementScoreData.map((e, idx) => (
                      <Cell key={idx} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mod7-empty-box">
              <span className="mod7-empty-title">Improvement Data Pending</span>
              <span className="mod7-empty-desc">Chart populates when resume analysis is run.</span>
            </div>
          )}
        </div>

        {/* Chart 4: Skills Comparison */}
        <div className="mod7-card">
          <div className="mod7-card-header">
            <h3 className="mod7-card-title" style={{ fontSize: '13px' }}>
              <Layers size={15} color="#6366F1" /> Skills Comparison
            </h3>
            {skillsComparisonData && (
              <span className="mod7-tag mod7-tag-primary">
                Matched vs Missing
              </span>
            )}
          </div>

          {skillsComparisonData ? (
            <div style={{ width: '100%', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsComparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip formatter={(val) => [`${val} skills`, 'Count']} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {skillsComparisonData.map((e, idx) => (
                      <Cell key={idx} fill={e.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mod7-empty-box">
              <span className="mod7-empty-title">Skills Data Pending</span>
              <span className="mod7-empty-desc">Chart populates when competencies are parsed.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisCharts;
