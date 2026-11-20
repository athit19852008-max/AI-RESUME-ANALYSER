import { jsPDF } from 'jspdf';

/**
 * RESUMATE AI - Professional Multi-Page PDF Report Generator
 * Generates an executive career dossier using jsPDF from real AppContext data.
 *
 * @param {object} params
 * @param {object} params.resumeFile
 * @param {string} params.resumeText
 * @param {object} params.analysisResults
 * @param {object} params.matchingResults
 * @param {object} params.skillAnalysisResults
 * @param {object} params.improvementSuggestions
 * @param {string} params.targetJobRole
 * @param {object} params.currentUser
 * @returns {jsPDF} The generated jsPDF document
 */
export const generateResumePdfReport = ({
  resumeFile,
  resumeText,
  analysisResults,
  matchingResults,
  skillAnalysisResults,
  improvementSuggestions,
  targetJobRole,
  currentUser
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Color Palette
  const COLOR_PRIMARY = [99, 102, 241];      // Indigo #6366F1
  const COLOR_SECONDARY = [139, 92, 246];   // Violet #8B5CF6
  const COLOR_DARK = [23, 32, 51];           // Slate #172033
  const COLOR_MUTED = [100, 116, 139];       // Slate #64748B
  const COLOR_LIGHT_BG = [248, 250, 252];    // Slate-50 #F8FAFC
  const COLOR_BORDER = [226, 232, 240];      // Slate-200 #E2E8F0
  const COLOR_SUCCESS = [16, 185, 129];      // Emerald #10B981
  const COLOR_DANGER = [239, 68, 68];        // Red #EF4444

  const candidate = analysisResults?.candidate || {};
  const candidateName = candidate.name || currentUser?.displayName || 'Candidate';
  const roleName = targetJobRole || skillAnalysisResults?.targetRole || 'Professional Profile';
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  /**
   * Page Break Helper
   * Checks if requested height exceeds printable area; if so, inserts a new page.
   */
  const checkPageBreak = (neededHeight = 15) => {
    if (currentY + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      currentY = margin + 12; // Leave room for running header
      drawRunningHeader();
    }
  };

  /**
   * Running Header for subsequent pages
   */
  const drawRunningHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_MUTED);
    doc.text('RESUMATE AI - Comprehensive Resume & Career Dossier', margin, margin);
    doc.text(candidateName, pageWidth - margin, margin, { align: 'right' });
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 3, pageWidth - margin, margin + 3);
  };

  /**
   * Section Header with accent bar
   */
  const printSectionHeader = (title) => {
    checkPageBreak(16);
    currentY += 4;
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(margin, currentY, 3, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_DARK);
    doc.text(title.toUpperCase(), margin + 6, currentY + 5.5);

    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY + 8, pageWidth - margin, currentY + 8);
    currentY += 12;
  };

  // =========================================================================
  // PAGE 1: TITLE, BRANDING & CANDIDATE HEADER
  // =========================================================================

  // Top Accent Banner
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text('RESUMATE AI', margin, currentY + 6);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_MUTED);
  doc.text('AI-Powered Resume Analysis & Career Dossier', margin, currentY + 11);

  // Date and Certificate Stamp
  doc.setFontSize(8);
  doc.text(`Generated: ${reportDate}`, pageWidth - margin, currentY + 6, { align: 'right' });
  doc.setTextColor(...COLOR_SUCCESS);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFIED AUDIT REPORT', pageWidth - margin, currentY + 11, { align: 'right' });

  currentY += 18;
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(0.6);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // Candidate Information Box
  checkPageBreak(26);
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_DARK);
  doc.text(candidateName, margin + 5, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(`Target Career Role: ${roleName}`, margin + 5, currentY + 13);

  const contactPieces = [];
  if (candidate.email) contactPieces.push(`Email: ${candidate.email}`);
  if (candidate.phone) contactPieces.push(`Phone: ${candidate.phone}`);
  if (candidate.location) contactPieces.push(`Location: ${candidate.location}`);
  const contactLine = contactPieces.length > 0 ? contactPieces.join('  •  ') : 'Contact info extracted from resume';
  doc.setFontSize(8);
  doc.text(contactLine, margin + 5, currentY + 19);

  // Right side of candidate box: Document info
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  const fileName = resumeFile?.name || (resumeText ? 'Pasted Text Resume' : 'No Document');
  const wordCount = resumeText ? resumeText.trim().split(/\s+/).length : 0;
  doc.text(`Document: ${fileName}`, pageWidth - margin - 5, currentY + 7, { align: 'right' });
  doc.text(`Length: ~${wordCount} words`, pageWidth - margin - 5, currentY + 13, { align: 'right' });

  currentY += 30;

  // =========================================================================
  // SECTION 1: OVERALL RESUME PERFORMANCE SCORES
  // =========================================================================
  printSectionHeader('1. Executive Performance Scores');

  const cardWidth = (contentWidth - 6) / 3;
  const cardHeight = 22;

  // ATS Score Card
  const atsScore = analysisResults?.atsScore;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, 'F');
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('RESUME ATS SCORE', margin + 4, currentY + 6);

  doc.setFontSize(16);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(atsScore != null ? `${atsScore} / 100` : 'Pending', margin + 4, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_MUTED);
  const atsCategory = atsScore >= 80 ? 'High Compliance' : atsScore >= 60 ? 'Moderate Fit' : 'Needs Optimization';
  doc.text(atsScore != null ? atsCategory : 'Module 3 Pending', margin + 4, currentY + 19);

  // Job Match Score Card
  const matchScore = matchingResults?.matchPercentage;
  const col2X = margin + cardWidth + 3;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.roundedRect(col2X, currentY, cardWidth, cardHeight, 2, 2, 'F');
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(col2X, currentY, cardWidth, cardHeight, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('JOB MATCH FIT', col2X + 4, currentY + 6);

  doc.setFontSize(16);
  doc.setTextColor(...COLOR_SECONDARY);
  doc.text(matchScore != null ? `${matchScore}%` : 'Pending', col2X + 4, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(matchingResults?.verdict || 'Module 4 Pending', col2X + 4, currentY + 19);

  // Skill Readiness Card
  const readiness = skillAnalysisResults?.readinessScore;
  const col3X = margin + (cardWidth + 3) * 2;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.roundedRect(col3X, currentY, cardWidth, cardHeight, 2, 2, 'F');
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(col3X, currentY, cardWidth, cardHeight, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text('SKILL READINESS', col3X + 4, currentY + 6);

  doc.setFontSize(16);
  doc.setTextColor(...COLOR_SUCCESS);
  doc.text(readiness != null ? `${readiness}%` : 'Pending', col3X + 4, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(skillAnalysisResults ? 'Role Preparedness' : 'Module 5 Pending', col3X + 4, currentY + 19);

  currentY += cardHeight + 8;

  // =========================================================================
  // SECTION 2: SECTION-WISE ATS SCORE BREAKDOWN
  // =========================================================================
  if (analysisResults?.atsScoreBreakdown) {
    printSectionHeader('2. Section-Wise ATS Breakdown');

    const breakdown = [
      { name: 'Formatting & Layout Compliance', score: analysisResults.atsScoreBreakdown.formatting || 0 },
      { name: 'Keyword Density & Relevance', score: analysisResults.atsScoreBreakdown.keywordRelevance || 0 },
      { name: 'Impact & Measurable Metrics', score: analysisResults.atsScoreBreakdown.impactAndMetrics || 0 },
      { name: 'Section Completeness & Hierarchy', score: analysisResults.atsScoreBreakdown.sectionsCompleteness || 0 }
    ];

    breakdown.forEach((item) => {
      checkPageBreak(8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR_DARK);
      doc.text(item.name, margin + 2, currentY + 4);

      // Score text
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.score}/100`, pageWidth - margin - 2, currentY + 4, { align: 'right' });

      // Progress bar background
      const barY = currentY + 5.5;
      const barWidth = contentWidth - 4;
      doc.setFillColor(...COLOR_BORDER);
      doc.roundedRect(margin + 2, barY, barWidth, 2, 1, 1, 'F');

      // Filled progress bar
      const fillW = Math.max(2, (item.score / 100) * barWidth);
      const barColor = item.score >= 75 ? COLOR_SUCCESS : item.score >= 50 ? COLOR_PRIMARY : COLOR_DANGER;
      doc.setFillColor(...barColor);
      doc.roundedRect(margin + 2, barY, fillW, 2, 1, 1, 'F');

      currentY += 10;
    });

    currentY += 2;
  }

  // =========================================================================
  // SECTION 3: CANDIDATE SUMMARY
  // =========================================================================
  if (analysisResults?.summary) {
    printSectionHeader('3. Executive Candidate Profile');
    checkPageBreak(20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_DARK);
    const splitSummary = doc.splitTextToSize(analysisResults.summary, contentWidth);
    doc.text(splitSummary, margin, currentY);
    currentY += splitSummary.length * 4.2 + 4;
  }

  // =========================================================================
  // SECTION 4: SKILLS INVENTORY (Technical & Soft Skills)
  // =========================================================================
  if (analysisResults?.skills) {
    printSectionHeader('4. Identified Skills Inventory');

    const { technical = [], soft = [], toolsAndFrameworks = [] } = analysisResults.skills;

    if (technical.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text('Technical Skills:', margin, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_DARK);
      const techText = doc.splitTextToSize(technical.join('  •  '), contentWidth);
      doc.text(techText, margin, currentY);
      currentY += techText.length * 3.8 + 3;
    }

    if (toolsAndFrameworks.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR_SECONDARY);
      doc.text('Tools & Frameworks:', margin, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_DARK);
      const toolsText = doc.splitTextToSize(toolsAndFrameworks.join('  •  '), contentWidth);
      doc.text(toolsText, margin, currentY);
      currentY += toolsText.length * 3.8 + 3;
    }

    if (soft.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR_SUCCESS);
      doc.text('Soft & Leadership Skills:', margin, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_DARK);
      const softText = doc.splitTextToSize(soft.join('  •  '), contentWidth);
      doc.text(softText, margin, currentY);
      currentY += softText.length * 3.8 + 4;
    }
  }

  // =========================================================================
  // SECTION 5: STRENGTHS & WEAKNESSES
  // =========================================================================
  if (analysisResults?.keyStrengths || analysisResults?.criticalWeaknesses) {
    printSectionHeader('5. Resume Strengths & Critical Weaknesses');

    if (analysisResults.keyStrengths && analysisResults.keyStrengths.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR_SUCCESS);
      doc.text('Key Strengths:', margin, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_DARK);

      analysisResults.keyStrengths.forEach((str) => {
        checkPageBreak(8);
        const split = doc.splitTextToSize(`[+] ${str}`, contentWidth - 4);
        doc.text(split, margin + 2, currentY);
        currentY += split.length * 3.8 + 1;
      });
      currentY += 3;
    }

    if (analysisResults.criticalWeaknesses && analysisResults.criticalWeaknesses.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR_DANGER);
      doc.text('Critical Weaknesses & Missing Information:', margin, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_DARK);

      analysisResults.criticalWeaknesses.forEach((w) => {
        checkPageBreak(8);
        const split = doc.splitTextToSize(`[-] ${w}`, contentWidth - 4);
        doc.text(split, margin + 2, currentY);
        currentY += split.length * 3.8 + 1;
      });
      currentY += 4;
    }
  }

  // =========================================================================
  // SECTION 6: JOB MATCHING ANALYSIS
  // =========================================================================
  if (matchingResults) {
    printSectionHeader('6. Job Description Matching & Compatibility');

    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_DARK);
    doc.text(`Match Verdict: ${matchingResults.verdict || 'Evaluation Complete'} (${matchingResults.matchPercentage || 0}%)`, margin, currentY);
    currentY += 5;

    if (matchingResults.compatibilitySummary) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_MUTED);
      const splitComp = doc.splitTextToSize(matchingResults.compatibilitySummary, contentWidth);
      doc.text(splitComp, margin, currentY);
      currentY += splitComp.length * 3.8 + 4;
    }

    if (matchingResults.matchingKeywords && matchingResults.matchingKeywords.length > 0) {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_SUCCESS);
      doc.text('Matching Keywords Found:', margin, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLOR_DARK);
      const splitKw = doc.splitTextToSize(matchingResults.matchingKeywords.join(', '), contentWidth);
      doc.text(splitKw, margin, currentY);
      currentY += splitKw.length * 3.8 + 3;
    }

    if (matchingResults.missingKeywords && matchingResults.missingKeywords.length > 0) {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_DANGER);
      doc.text('Missing Role Keywords:', margin, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLOR_DARK);
      const splitMiss = doc.splitTextToSize(matchingResults.missingKeywords.join(', '), contentWidth);
      doc.text(splitMiss, margin, currentY);
      currentY += splitMiss.length * 3.8 + 4;
    }
  }

  // =========================================================================
  // SECTION 7: SKILL GAP & LEARNING ROADMAP
  // =========================================================================
  if (skillAnalysisResults) {
    printSectionHeader('7. Skill Gap Diagnosis & Actionable Roadmap');

    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_DARK);
    doc.text(`Target Role: ${skillAnalysisResults.targetRole || roleName} • Readiness: ${skillAnalysisResults.readinessScore || 0}%`, margin, currentY);
    currentY += 5;

    if (skillAnalysisResults.missingCriticalSkills && skillAnalysisResults.missingCriticalSkills.length > 0) {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_DANGER);
      doc.text('Missing Critical Proficiencies:', margin, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLOR_DARK);
      const splitCrit = doc.splitTextToSize(skillAnalysisResults.missingCriticalSkills.join(', '), contentWidth);
      doc.text(splitCrit, margin, currentY);
      currentY += splitCrit.length * 3.8 + 3;
    }

    if (skillAnalysisResults.learningRoadmap && skillAnalysisResults.learningRoadmap.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text('Prioritized Upskilling Steps:', margin, currentY);
      currentY += 4.5;

      skillAnalysisResults.learningRoadmap.forEach((item) => {
        checkPageBreak(9);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...COLOR_DARK);
        doc.text(`• ${item.skill} [${item.importance || 'Medium'} Priority]:`, margin + 2, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLOR_MUTED);
        const resText = doc.splitTextToSize(`Resource: ${item.learningResource}`, contentWidth - 8);
        doc.text(resText, margin + 6, currentY + 3.8);
        currentY += resText.length * 3.8 + 4;
      });
      currentY += 2;
    }

    if (skillAnalysisResults.recommendedCertifications && skillAnalysisResults.recommendedCertifications.length > 0) {
      checkPageBreak(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_SECONDARY);
      doc.text('Recommended Certifications:', margin, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLOR_DARK);
      const splitCerts = doc.splitTextToSize(skillAnalysisResults.recommendedCertifications.join('  •  '), contentWidth);
      doc.text(splitCerts, margin, currentY);
      currentY += splitCerts.length * 3.8 + 4;
    }
  }

  // =========================================================================
  // SECTION 8: IMPROVEMENT SUGGESTIONS & REWRITES
  // =========================================================================
  if (improvementSuggestions) {
    printSectionHeader('8. AI Bullet Rewrites & ATS Optimization');

    if (improvementSuggestions.executiveSummarySuggestion) {
      checkPageBreak(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text('Proposed Executive Summary Rewrite:', margin, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(...COLOR_DARK);
      const splitExec = doc.splitTextToSize(`"${improvementSuggestions.executiveSummarySuggestion}"`, contentWidth - 4);
      doc.text(splitExec, margin + 2, currentY);
      currentY += splitExec.length * 3.8 + 4;
    }

    if (improvementSuggestions.actionVerbEnhancements && improvementSuggestions.actionVerbEnhancements.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text('Action-Verb Phrasing Enhancements (Before vs After):', margin, currentY);
      currentY += 4.5;

      improvementSuggestions.actionVerbEnhancements.slice(0, 5).forEach((enh) => {
        checkPageBreak(14);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLOR_DANGER);
        doc.text(`[BEFORE] ${enh.originalPhrase}`, margin + 2, currentY);
        currentY += 3.8;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLOR_SUCCESS);
        const splitAfter = doc.splitTextToSize(`[AFTER] ${enh.suggestedRewrite}`, contentWidth - 4);
        doc.text(splitAfter, margin + 2, currentY);
        currentY += splitAfter.length * 3.8;

        if (enh.reason) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...COLOR_MUTED);
          doc.text(`Why: ${enh.reason}`, margin + 4, currentY);
          currentY += 3.8;
        }
        currentY += 2;
      });
    }

    if (improvementSuggestions.atsOptimizationTips && improvementSuggestions.atsOptimizationTips.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_DARK);
      doc.text('ATS Optimization Best Practices:', margin, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLOR_MUTED);
      improvementSuggestions.atsOptimizationTips.slice(0, 4).forEach((tip) => {
        checkPageBreak(6);
        const splitTip = doc.splitTextToSize(`• ${tip}`, contentWidth);
        doc.text(splitTip, margin, currentY);
        currentY += splitTip.length * 3.5 + 1;
      });
      currentY += 3;
    }
  }

  // =========================================================================
  // FOOTER & PAGE NUMBERING PASS
  // =========================================================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Footer line
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - margin + 2, pageWidth - margin, pageHeight - margin + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text('RESUMATE AI • Confidential Career Intelligence Dossier', margin, pageHeight - margin + 6);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - margin + 6, { align: 'right' });
  }

  // Trigger download with sanitized filename
  const cleanName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `RESUMATE_AI_Resume_Report_${cleanName}.pdf`;
  doc.save(filename);

  return doc;
};
