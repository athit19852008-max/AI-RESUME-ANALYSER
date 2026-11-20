import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TrendingUp,
  PieChart as PieIcon,
  Briefcase,
  BarChart3
} from 'lucide-react';
import Button from '../../components/Button';

/**
 * ChartsSection Component
 * Visualizes actual application results using Recharts:
 * 1. Section-wise ATS Score Breakdown
 * 2. Skills Distribution by Category (Technical, Soft, Tools)
 * 3. Job Match Keyword Comparison (Matching vs Missing)
 *
 * Strictly adheres to rule: If data is unavailable, show clean empty state instead of fake charts.
 */
export const ChartsSection = ({
  analysisResults,
  matchingResults,
  resumeText
}) => {
  const navigate = useNavigate();

  // Chart 1 Data: Section-wise ATS Scores
  const atsScoreData = useMemo(() => {
    if (!analysisResults?.atsScoreBreakdown) return null;
    const { formatting, keywordRelevance, impactAndMetrics, sectionsCompleteness } =
      analysisResults.atsScoreBreakdown;
    return [
      { category: 'Formatting', score: formatting || 0 },
      { category: 'Keywords', score: keywordRelevance || 0 },
      { category: 'Impact', score: impactAndMetrics || 0 },
      { category: 'Sections', score: sectionsCompleteness || 0 }
    ];
  }, [analysisResults]);

  // Chart 2 Data: Skills Distribution
  const skillsDistributionData = useMemo(() => {
    if (!analysisResults?.skills) return null;
    const techCount = analysisResults.skills.technical?.length || 0;
    const softCount = analysisResults.skills.soft?.length || 0;
    const toolsCount = analysisResults.skills.toolsAndFrameworks?.length || 0;

    if (techCount === 0 && softCount === 0 && toolsCount === 0) return null;

    return [
      { name: 'Technical Skills', count: techCount, fill: '#6366F1' },
      { name: 'Tools & Frameworks', count: toolsCount, fill: '#8B5CF6' },
      { name: 'Soft & Leadership', count: softCount, fill: '#10B981' }
    ].filter((item) => item.count > 0);
  }, [analysisResults]);

  // Chart 3 Data: Job Matching Keyword Comparison
  const jobKeywordData = useMemo(() => {
    if (!matchingResults) return null;
    const matchingCount = matchingResults.matchingKeywords?.length || 0;
    const missingCount = matchingResults.missingKeywords?.length || 0;

    if (matchingCount === 0 && missingCount === 0) return null;

    return [
      { type: 'Matched Keywords', count: matchingCount, fill: '#10B981' },
      { type: 'Missing Keywords', count: missingCount, fill: '#EF4444' }
    ];
  }, [matchingResults]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <BarChart3 size={20} color="var(--color-primary)" />
        <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, margin: 0 }}>
          Visual Analytics & Performance Charts
        </h2>
      </div>

      <div className="grid-2">
        {/* CHART 1: Section-Wise ATS Performance */}
        <div className="resumate-card">
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: 'var(--font-sm)' }}>
              <TrendingUp size={16} color="var(--color-primary)" />
              Section-Wise ATS Performance Breakdown
            </h3>
            {atsScoreData && <span className="badge badge-primary">Actual Audit</span>}
          </div>

          {atsScoreData ? (
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={atsScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                  <Tooltip
                    formatter={(val) => [`${val} / 100`, 'Score']}
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {atsScoreData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.score >= 75
                            ? 'var(--color-success)'
                            : entry.score >= 50
                            ? 'var(--color-primary)'
                            : 'var(--color-warning)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mini-empty-state" style={{ padding: '28px 14px' }}>
              <TrendingUp size={24} className="mini-empty-icon" />
              <span className="mini-empty-title">ATS Breakdown Chart Unavailable</span>
              <p className="mini-empty-desc">
                Execute Module 3 (AI Analysis) to calculate section-by-section ATS performance.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(resumeText ? '/ai-analysis' : '/upload-resume')}
              >
                {resumeText ? 'Run AI Analysis' : 'Upload Resume First'}
              </Button>
            </div>
          )}
        </div>

        {/* CHART 2: Skills Distribution Chart */}
        <div className="resumate-card">
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: 'var(--font-sm)' }}>
              <PieIcon size={16} color="var(--color-secondary)" />
              Skills Distribution by Domain
            </h3>
            {skillsDistributionData && <span className="badge badge-secondary">Actual Inventory</span>}
          </div>

          {skillsDistributionData ? (
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} allowDecimals={false} />
                  <Tooltip
                    formatter={(val) => [`${val} skills`, 'Count']}
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {skillsDistributionData.map((entry, index) => (
                      <Cell key={`skill-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mini-empty-state" style={{ padding: '28px 14px' }}>
              <PieIcon size={24} className="mini-empty-icon" />
              <span className="mini-empty-title">Skills Chart Unavailable</span>
              <p className="mini-empty-desc">
                Skills distribution chart renders once resume competencies are parsed by AI.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(resumeText ? '/ai-analysis' : '/upload-resume')}
              >
                {resumeText ? 'Run AI Parsing' : 'Upload Resume First'}
              </Button>
            </div>
          )}
        </div>

        {/* CHART 3: Job Matching Keyword Comparison */}
        <div className="resumate-card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: 'var(--font-sm)' }}>
              <Briefcase size={16} color="var(--color-primary)" />
              Job Match Keyword Alignment (Matched vs Missing)
            </h3>
            {jobKeywordData && <span className="badge badge-success">{matchingResults.verdict}</span>}
          </div>

          {jobKeywordData ? (
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobKeywordData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                  <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} width={120} />
                  <Tooltip
                    formatter={(val) => [`${val} keywords`, 'Count']}
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {jobKeywordData.map((entry, index) => (
                      <Cell key={`kw-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mini-empty-state" style={{ padding: '24px 14px' }}>
              <Briefcase size={24} className="mini-empty-icon" />
              <span className="mini-empty-title">Job Alignment Chart Unavailable</span>
              <p className="mini-empty-desc">
                Match your resume against a target job description in Module 4 to visualize keyword alignment.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(resumeText ? '/job-matching' : '/upload-resume')}
              >
                {resumeText ? 'Match With Job' : 'Upload Resume First'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
