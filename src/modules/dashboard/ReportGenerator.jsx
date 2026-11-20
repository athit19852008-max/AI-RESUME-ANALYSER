import React, { useState } from 'react';
import {
  Download,
  Printer,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { generateResumePdfReport } from './pdfReportService';
import Button from '../../components/Button';

/**
 * ReportGenerator Component
 * Allows users to preview report readiness and download a multi-page jsPDF document.
 */
export const ReportGenerator = ({
  resumeFile,
  resumeText,
  analysisResults,
  matchingResults,
  skillAnalysisResults,
  improvementSuggestions,
  targetJobRole,
  currentUser
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasReportableData = Boolean(resumeText);

  // Trigger jsPDF report generation and download
  const handleDownloadPdf = async () => {
    if (!hasReportableData) {
      setErrorMessage('No active resume data exists to generate a report.');
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);
    setGenSuccess(false);

    try {
      // Allow UI tick to update loader state
      await new Promise((resolve) => setTimeout(resolve, 150));

      generateResumePdfReport({
        resumeFile,
        resumeText,
        analysisResults,
        matchingResults,
        skillAnalysisResults,
        improvementSuggestions,
        targetJobRole,
        currentUser
      });

      setGenSuccess(true);
      setTimeout(() => setGenSuccess(false), 4000);
    } catch (err) {
      console.error('jsPDF Generation Error:', err);
      setErrorMessage(`Failed to generate PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="resumate-card report-gen-card">
      <div style={{ flex: 1, minWidth: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-primary">
            <ShieldCheck size={12} /> Certified Dossier Generator
          </span>
          {hasReportableData ? (
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> Ready to Export
            </span>
          ) : (
            <span className="badge badge-warning">
              <Lock size={12} /> Locked (Upload Required)
            </span>
          )}
        </div>

        <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--color-text-main)' }}>
          Generate & Download Resume Analysis Dossier
        </h3>
        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '640px', lineHeight: '1.6' }}>
          Compiles all verified results from AppContext into a multi-page, formatted PDF powered by jsPDF.
          Includes ATS compliance scores, keyword alignment, skill gap roadmap, and AI phrasing rewrites.
        </p>

        {errorMessage && (
          <div className="alert alert-danger" style={{ marginTop: '12px', padding: '8px 12px', fontSize: 'var(--font-xs)' }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {genSuccess && (
          <div className="alert alert-success" style={{ marginTop: '12px', padding: '8px 12px', fontSize: 'var(--font-xs)' }}>
            <CheckCircle2 size={16} />
            <span>Report generated and download initiated successfully!</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="outline"
          icon={Printer}
          onClick={handleBrowserPrint}
          disabled={!hasReportableData}
          title="Print using browser dialog"
        >
          Browser Print
        </Button>

        <Button
          variant="primary"
          icon={Download}
          isLoading={isGenerating}
          disabled={!hasReportableData}
          onClick={handleDownloadPdf}
        >
          {isGenerating ? 'Generating PDF...' : 'Download jsPDF Report'}
        </Button>
      </div>
    </div>
  );
};

export default ReportGenerator;
