import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

/**
 * ReportGenerator Component - Module 7
 * Generates an actual downloadable multi-page PDF using jsPDF and provides:
 * - Generate Full Report button
 * - Download PDF Report button
 * - Print Report button
 */
export const ReportGenerator = ({
  analysisResults,
  matchingResults,
  skillGapResults,
  improvementResults,
  resumeText,
  resumeFile,
  targetJobRole,
  onGenerateReport
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Generates and downloads real multi-page PDF via jsPDF
   */
  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    setErrorMessage('');
    setDownloadSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const COLOR_PRIMARY = [99, 102, 241];
      const COLOR_DARK = [23, 32, 51];
      const COLOR_MUTED = [100, 116, 139];
      const COLOR_BORDER = [226, 232, 240];
      const COLOR_SUCCESS = [16, 185, 129];
      const COLOR_DANGER = [239, 68, 68];

      const candidateName = analysisResults?.candidate?.name || 'Candidate';
      const roleName = targetJobRole || skillGapResults?.targetRole || 'Professional Profile';
      const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const checkPageBreak = (needed = 15) => {
        if (y + needed > pageHeight - margin - 12) {
          doc.addPage();
          y = margin + 12;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(...COLOR_MUTED);
          doc.text('RESUMATE AI – Analysis Report & Career Dossier', margin, margin);
          doc.text(candidateName, pageWidth - margin, margin, { align: 'right' });
          doc.setDrawColor(...COLOR_BORDER);
          doc.setLineWidth(0.3);
          doc.line(margin, margin + 3, pageWidth - margin, margin + 3);
        }
      };

      const printSectionHeader = (title) => {
        checkPageBreak(16);
        y += 4;
        doc.setFillColor(...COLOR_PRIMARY);
        doc.rect(margin, y, 3, 6, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...COLOR_DARK);
        doc.text(title.toUpperCase(), margin + 5, y + 5);

        doc.setDrawColor(...COLOR_BORDER);
        doc.setLineWidth(0.3);
        doc.line(margin, y + 7.5, pageWidth - margin, y + 7.5);
        y += 12;
      };

      // Header Banner
      doc.setFillColor(...COLOR_PRIMARY);
      doc.rect(0, 0, pageWidth, 4, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text('RESUMATE AI – Analysis Report', margin, y + 6);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLOR_MUTED);
      doc.text('Autonomous Resume Audit & Career Intelligence System', margin, y + 11);

      doc.text(`Generated: ${reportDate}`, pageWidth - margin, y + 6, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLOR_SUCCESS);
      doc.text('CERTIFIED ANALYSIS', pageWidth - margin, y + 11, { align: 'right' });

      y += 18;
      doc.setDrawColor(...COLOR_PRIMARY);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      // Candidate Metadata Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
      doc.setDrawColor(...COLOR_BORDER);
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...COLOR_DARK);
      doc.text(candidateName, margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLOR_MUTED);
      doc.text(`Target Role: ${roleName}`, margin + 4, y + 11);

      const fileName = resumeFile?.name || (resumeText ? 'Pasted Text Resume' : 'Document');
      doc.text(`Document: ${fileName}`, margin + 4, y + 16);

      y += 26;

      // 1. Overall Scores
      printSectionHeader('1. Overall Performance Scores');
      const boxW = (contentWidth - 6) / 3;
      const boxH = 18;

      // ATS Score
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, boxW, boxH, 2, 2, 'F');
      doc.setDrawColor(...COLOR_BORDER);
      doc.roundedRect(margin, y, boxW, boxH, 2, 2, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_MUTED);
      doc.text('ATS AUDIT SCORE', margin + 3, y + 5);
      doc.setFontSize(14);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text(analysisResults?.atsScore != null ? `${analysisResults.atsScore}/100` : 'Pending', margin + 3, y + 13);

      // Job Match Fit
      const col2X = margin + boxW + 3;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(col2X, y, boxW, boxH, 2, 2, 'F');
      doc.setDrawColor(...COLOR_BORDER);
      doc.roundedRect(col2X, y, boxW, boxH, 2, 2, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_MUTED);
      doc.text('JOB MATCH FIT', col2X + 3, y + 5);
      doc.setFontSize(14);
      doc.setTextColor(139, 92, 246);
      doc.text(matchingResults?.matchPercentage != null ? `${matchingResults.matchPercentage}%` : 'Pending', col2X + 3, y + 13);

      // Skill Readiness
      const col3X = margin + (boxW + 3) * 2;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(col3X, y, boxW, boxH, 2, 2, 'F');
      doc.setDrawColor(...COLOR_BORDER);
      doc.roundedRect(col3X, y, boxW, boxH, 2, 2, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_MUTED);
      doc.text('SKILL READINESS', col3X + 3, y + 5);
      doc.setFontSize(14);
      doc.setTextColor(...COLOR_SUCCESS);
      doc.text(skillGapResults?.readinessScore != null ? `${skillGapResults.readinessScore}%` : 'Pending', col3X + 3, y + 13);

      y += boxH + 8;

      // 2. Resume Analysis Summary
      printSectionHeader('2. Resume Analysis Summary');
      if (analysisResults?.summary) {
        checkPageBreak(16);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLOR_DARK);
        doc.text('Professional Summary:', margin, y);
        y += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...COLOR_DARK);
        const splitSum = doc.splitTextToSize(analysisResults.summary, contentWidth);
        doc.text(splitSum, margin, y);
        y += splitSum.length * 3.8 + 4;
      }

      if (analysisResults?.skills) {
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLOR_PRIMARY);
        doc.text('Technical & Tool Proficiencies:', margin, y);
        y += 4;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.8);
        const techSkills = [
          ...(analysisResults.skills.technical || []),
          ...(analysisResults.skills.toolsAndFrameworks || [])
        ];
        const splitTech = doc.splitTextToSize(techSkills.join('  •  ') || 'None recorded', contentWidth);
        doc.text(splitTech, margin, y);
        y += splitTech.length * 3.6 + 4;
      }

      if (analysisResults?.keyStrengths && analysisResults.keyStrengths.length > 0) {
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLOR_SUCCESS);
        doc.text('Identified Resume Strengths:', margin, y);
        y += 4;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.8);
        doc.setTextColor(...COLOR_DARK);
        analysisResults.keyStrengths.forEach((str) => {
          checkPageBreak(6);
          const split = doc.splitTextToSize(`[+] ${str}`, contentWidth - 4);
          doc.text(split, margin + 2, y);
          y += split.length * 3.5 + 1;
        });
        y += 3;
      }

      // 3. Job Matching Results
      if (matchingResults) {
        printSectionHeader('3. Job Description Matching Results');
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLOR_DARK);
        doc.text(`Match Compatibility: ${matchingResults.matchPercentage}% (${matchingResults.verdict || 'Evaluated'})`, margin, y);
        y += 5;

        if (matchingResults.matchingKeywords && matchingResults.matchingKeywords.length > 0) {
          checkPageBreak(10);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...COLOR_SUCCESS);
          doc.text('Matching Keywords Found:', margin, y);
          y += 4;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...COLOR_DARK);
          const splitKw = doc.splitTextToSize(matchingResults.matchingKeywords.join(', '), contentWidth);
          doc.text(splitKw, margin, y);
          y += splitKw.length * 3.6 + 4;
        }

        if (matchingResults.missingKeywords && matchingResults.missingKeywords.length > 0) {
          checkPageBreak(10);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...COLOR_DANGER);
          doc.text('Missing Keywords from Job Posting:', margin, y);
          y += 4;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...COLOR_DARK);
          const splitMiss = doc.splitTextToSize(matchingResults.missingKeywords.join(', '), contentWidth);
          doc.text(splitMiss, margin, y);
          y += splitMiss.length * 3.6 + 4;
        }
      }

      // 4. Skill Gap Analysis
      if (skillGapResults) {
        printSectionHeader('4. Skill Gap & Priority Roadmap');
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLOR_DARK);
        doc.text(`Role Readiness: ${skillGapResults.readinessScore || 0}% for ${skillGapResults.targetRole || 'Target Role'}`, margin, y);
        y += 5;

        if (skillGapResults.missingCriticalSkills && skillGapResults.missingCriticalSkills.length > 0) {
          checkPageBreak(10);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...COLOR_DANGER);
          doc.text('Missing Critical Proficiencies:', margin, y);
          y += 4;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...COLOR_DARK);
          const splitCrit = doc.splitTextToSize(skillGapResults.missingCriticalSkills.join(', '), contentWidth);
          doc.text(splitCrit, margin, y);
          y += splitCrit.length * 3.6 + 4;
        }

        if (skillGapResults.learningRoadmap && skillGapResults.learningRoadmap.length > 0) {
          checkPageBreak(12);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...COLOR_PRIMARY);
          doc.text('Priority Action Steps:', margin, y);
          y += 4;

          skillGapResults.learningRoadmap.slice(0, 3).forEach((item) => {
            checkPageBreak(8);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.8);
            doc.setTextColor(...COLOR_DARK);
            doc.text(`• ${item.skill} (${item.importance} Priority):`, margin + 2, y);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...COLOR_MUTED);
            const rText = doc.splitTextToSize(item.learningResource, contentWidth - 6);
            doc.text(rText, margin + 6, y + 3.6);
            y += rText.length * 3.6 + 3.5;
          });
        }
      }

      // 5. Resume Improvement Suggestions
      if (improvementResults) {
        printSectionHeader('5. Resume Improvement Suggestions');

        if (improvementResults.executiveSummarySuggestion) {
          checkPageBreak(14);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...COLOR_PRIMARY);
          doc.text('Suggested Executive Summary Upgrade:', margin, y);
          y += 4;

          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.8);
          doc.setTextColor(...COLOR_DARK);
          const splitExec = doc.splitTextToSize(`"${improvementResults.executiveSummarySuggestion}"`, contentWidth);
          doc.text(splitExec, margin, y);
          y += splitExec.length * 3.6 + 4;
        }

        if (improvementResults.actionVerbEnhancements && improvementResults.actionVerbEnhancements.length > 0) {
          checkPageBreak(12);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...COLOR_PRIMARY);
          doc.text('High-Impact Phrasing Rewrites:', margin, y);
          y += 4;

          improvementResults.actionVerbEnhancements.slice(0, 4).forEach((enh) => {
            checkPageBreak(12);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(...COLOR_DANGER);
            doc.text(`[Before] ${enh.originalPhrase}`, margin + 2, y);
            y += 3.6;

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...COLOR_SUCCESS);
            const splitA = doc.splitTextToSize(`[Rewrite] ${enh.suggestedRewrite}`, contentWidth - 4);
            doc.text(splitA, margin + 2, y);
            y += splitA.length * 3.6 + 2;
          });
        }
      }

      // Footer pass on all pages
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(...COLOR_BORDER);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - margin + 2, pageWidth - margin, pageHeight - margin + 2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLOR_MUTED);
        doc.text('RESUMATE AI • Confidential Career Intelligence Dossier', margin, pageHeight - margin + 6);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - margin + 6, { align: 'right' });
      }

      const cleanName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_');
      doc.save(`RESUMATE_AI_Resume_Report_${cleanName}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setErrorMessage(`Failed to generate PDF: ${err.message || 'Error occurred'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mod7-card" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%)', borderColor: '#E0E7FF' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="mod7-tag mod7-tag-primary">
              <Sparkles size={12} /> Official Report Engine
            </span>
            <span className="mod7-tag mod7-tag-success">jsPDF Export</span>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: '#172033' }}>
            Report Generation & Export
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
            Generate a full analysis dossier containing ATS audit scores, job description matching,
            skill gap diagnosis, and actionable phrasing rewrites.
          </p>

          {errorMessage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontSize: '12px', marginTop: '8px' }}>
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}

          {downloadSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '12px', marginTop: '8px' }}>
              <CheckCircle2 size={14} />
              <span>PDF generated and downloaded successfully!</span>
            </div>
          )}
        </div>

        {/* 3 Mandated Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="mod7-btn mod7-btn-secondary"
            onClick={onGenerateReport}
            title="Compile full report preview"
          >
            <FileText size={16} />
            Generate Full Report
          </button>

          <button
            type="button"
            className="mod7-btn mod7-btn-primary"
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            title="Download multi-page PDF"
          >
            <Download size={16} />
            {isGenerating ? 'Generating PDF...' : 'Download PDF Report'}
          </button>

          <button
            type="button"
            className="mod7-btn mod7-btn-outline"
            onClick={handlePrint}
            title="Print report using browser print dialog"
          >
            <Printer size={16} />
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
