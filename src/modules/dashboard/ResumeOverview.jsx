import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  RotateCcw,
  Clock
} from 'lucide-react';
import Button from '../../components/Button';

/**
 * ResumeOverview Component
 * Displays actual active resume metadata from AppContext:
 * - Filename
 * - File type
 * - File size
 * - Upload status
 * - Analysis status
 */
export const ResumeOverview = ({
  resumeFile,
  resumeText,
  analysisResults,
  resetAnalysis
}) => {
  const navigate = useNavigate();

  const handleReset = () => {
    if (
      window.confirm(
        'Start a completely new analysis? This will clear active resume data and all generated results.'
      )
    ) {
      resetAnalysis();
      navigate('/upload-resume');
    }
  };

  if (!resumeText) {
    return (
      <div className="resumate-card" style={{ textAlign: 'center', padding: '36px 20px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto'
          }}
        >
          <UploadCloud size={28} />
        </div>
        <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, margin: '0 0 6px 0' }}>
          No Resume Active in Session
        </h3>
        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 18px auto', lineHeight: '1.6' }}>
          Upload your resume in PDF, DOCX, or text format to activate the complete RESUMATE AI analysis pipeline.
        </p>
        <Button
          variant="primary"
          icon={UploadCloud}
          onClick={() => navigate('/upload-resume')}
        >
          Upload Resume Now
        </Button>
      </div>
    );
  }

  const wordCount = resumeText ? resumeText.trim().split(/\s+/).length : 0;
  const fileSizeStr = resumeFile?.size ? `${(resumeFile.size / 1024).toFixed(1)} KB` : 'Pasted Text Stream';
  const fileTypeStr = resumeFile?.type || (resumeFile?.name?.endsWith('.pdf') ? 'application/pdf' : 'text/plain');

  return (
    <div className="resumate-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} color="var(--color-primary)" />
          <div>
            <h2 className="card-title" style={{ fontSize: 'var(--font-md)', margin: 0 }}>
              Active Resume & Document Overview
            </h2>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>
              Source document powering downstream AI modules
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={handleReset}
            title="Clear all data and upload a new resume"
          >
            New Analysis
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={UploadCloud}
            onClick={() => navigate('/upload-resume')}
          >
            Change Resume
          </Button>
        </div>
      </div>

      <div className="resume-overview-grid">
        <div className="resume-meta-box">
          <span className="resume-meta-label">File Name</span>
          <span className="resume-meta-val" title={resumeFile?.name || 'Raw Text Input'}>
            {resumeFile?.name || 'Text Resume Stream'}
          </span>
        </div>

        <div className="resume-meta-box">
          <span className="resume-meta-label">File Type</span>
          <span className="resume-meta-val">{fileTypeStr}</span>
        </div>

        <div className="resume-meta-box">
          <span className="resume-meta-label">Document Size</span>
          <span className="resume-meta-val">{fileSizeStr}</span>
        </div>

        <div className="resume-meta-box">
          <span className="resume-meta-label">Word Count</span>
          <span className="resume-meta-val">~{wordCount} words</span>
        </div>

        <div className="resume-meta-box">
          <span className="resume-meta-label">Upload Status</span>
          <span className="resume-meta-val" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-success)' }}>
            <CheckCircle2 size={14} /> Uploaded & Extracted
          </span>
        </div>

        <div className="resume-meta-box">
          <span className="resume-meta-label">Analysis Status</span>
          <span className="resume-meta-val">
            {analysisResults ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-success)' }}>
                <CheckCircle2 size={14} /> AI Audit Complete ({analysisResults.atsScore}/100)
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)' }}>
                <Clock size={14} /> Awaiting AI Analysis
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResumeOverview;
