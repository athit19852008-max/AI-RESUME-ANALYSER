import React from 'react';
import {
  Sparkles,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

/**
 * OverviewCards Component - Module 7
 * Displays 5 primary KPI cards:
 * 1. Resume Analysis Status
 * 2. Job Match Score
 * 3. Skills Matched
 * 4. Skills Missing
 * 5. Resume Improvement Score
 */
export const OverviewCards = ({
  analysisResults,
  matchingResults,
  skillGapResults,
  improvementResults,
  resumeText
}) => {
  // 1. Resume Analysis Status
  const analysisStatus = analysisResults?.atsScore != null
    ? `${analysisResults.atsScore}/100`
    : resumeText
    ? 'Ready for Audit'
    : 'No Resume';

  const analysisSubtitle = analysisResults
    ? analysisResults.atsScore >= 80
      ? 'High ATS Compliance'
      : analysisResults.atsScore >= 60
      ? 'Moderate Compliance'
      : 'Optimization Needed'
    : resumeText
    ? 'Document loaded'
    : 'Upload required';

  // 2. Job Match Score
  const jobMatchScore = matchingResults?.matchPercentage != null
    ? `${matchingResults.matchPercentage}%`
    : 'Not Matched';

  const jobMatchSubtitle = matchingResults?.verdict || 'Awaiting job posting';

  // 3. Skills Matched Count
  const skillsMatchedCount = matchingResults?.matchingKeywords?.length != null
    ? matchingResults.matchingKeywords.length
    : skillGapResults?.acquiredSkills?.length != null
    ? skillGapResults.acquiredSkills.length
    : 0;

  // 4. Skills Missing Count
  const skillsMissingCount = matchingResults?.missingKeywords?.length != null
    ? matchingResults.missingKeywords.length
    : skillGapResults?.missingCriticalSkills?.length != null
    ? skillGapResults.missingCriticalSkills.length
    : 0;

  // 5. Resume Improvement Score / Potential
  const improvementScore = improvementResults
    ? `${Math.min(98, (analysisResults?.atsScore || 70) + 18)}%`
    : analysisResults
    ? `${Math.min(95, analysisResults.atsScore + 15)}%`
    : 'Pending';

  const improvementSubtitle = improvementResults?.actionVerbEnhancements?.length
    ? `${improvementResults.actionVerbEnhancements.length} rewrites ready`
    : 'Awaiting recommendations';

  const cards = [
    {
      title: 'Analysis Status',
      value: analysisStatus,
      subtitle: analysisSubtitle,
      icon: Sparkles,
      color: '#6366F1',
      bg: '#EEF2FF'
    },
    {
      title: 'Job Match Score',
      value: jobMatchScore,
      subtitle: jobMatchSubtitle,
      icon: Briefcase,
      color: '#8B5CF6',
      bg: '#F5F3FF'
    },
    {
      title: 'Skills Matched',
      value: skillsMatchedCount,
      subtitle: `${skillsMatchedCount} competencies verified`,
      icon: CheckCircle2,
      color: '#10B981',
      bg: '#ECFDF5'
    },
    {
      title: 'Skills Missing',
      value: skillsMissingCount,
      subtitle: `${skillsMissingCount} gaps identified`,
      icon: AlertTriangle,
      color: '#EF4444',
      bg: '#FEF2F2'
    },
    {
      title: 'Improvement Score',
      value: improvementScore,
      subtitle: improvementSubtitle,
      icon: TrendingUp,
      color: '#F59E0B',
      bg: '#FFFBEB'
    }
  ];

  return (
    <div className="mod7-grid-5">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="mod7-kpi-card">
            <div className="mod7-kpi-top">
              <span className="mod7-kpi-label">{c.title}</span>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: c.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.color
                }}
              >
                <Icon size={16} />
              </div>
            </div>

            <div className="mod7-kpi-value" style={{ color: c.color }}>
              {c.value}
            </div>

            <div className="mod7-kpi-subtitle">{c.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;
