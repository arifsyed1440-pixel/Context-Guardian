import React, { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Layers,
  Cpu
} from 'lucide-react';
import { ContextObject, ScreenType } from '../../types/context';
import { extractContext } from '../../services/localExtractionEngine';
import { recognizeScreenshotText, OcrProgress } from '../../services/ocrService';

interface CaptureScreenProps {
  onContextExtracted: (context: ContextObject) => void;
  onNavigate: (screen: ScreenType) => void;
}

const SAMPLE_SCREENSHOTS = [
  {
    id: 'sample-rahul',
    title: 'Slack Chat - Rahul (Review Request)',
    badge: 'Canonical Demo',
    mockText: "Rahul: Hey, for tomorrow's project review, please bring the latest prototype. Also update the architecture slides before 5 PM.",
    accent: '#3b82f6'
  },
  {
    id: 'sample-priya',
    title: 'Teams Sync - Priya (Figma Handover)',
    badge: 'Design Sync',
    mockText: "Priya: For the mobile design handover, please verify the onboarding Figma components and export the SVG icon kit by Friday.",
    accent: '#8b5cf6'
  },
  {
    id: 'sample-alex',
    title: 'Incident Room - Alex (Critical Fix)',
    badge: 'Urgent',
    mockText: "Alex: We need to fix the memory leak in production sync before tonight's 8 PM release. Review the crash logs on Sentry.",
    accent: '#f43f5e'
  }
];

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  onContextExtracted,
  onNavigate,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedRawText, setExtractedRawText] = useState<string>('');
  const [isOcrRunning, setIsOcrRunning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress>({ progress: 0, statusText: '' });
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setOcrError(null);
    setSelectedSampleId(null);

    // Generate local preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setIsOcrRunning(true);
    setOcrProgress({ progress: 10, statusText: 'Starting on-device OCR engine...' });

    try {
      const text = await recognizeScreenshotText(file, (info) => {
        setOcrProgress(info);
      });
      setExtractedRawText(text);
      setIsOcrRunning(false);
    } catch (err: unknown) {
      setIsOcrRunning(false);
      setOcrError('OCR had difficulty parsing text from this image. You can type or adjust the text below.');
      // Resilient fallback: Provide the canonical example text so user can continue seamlessly
      if (!extractedRawText) {
        setExtractedRawText("Rahul: Hey, for tomorrow's project review, please bring the latest prototype. Also update the architecture slides before 5 PM.");
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_SCREENSHOTS[0]) => {
    setSelectedSampleId(sample.id);
    setImagePreview(null);
    setOcrError(null);
    setExtractedRawText(sample.mockText);
  };

  const handleRunExtraction = () => {
    if (!extractedRawText.trim()) return;

    const extracted = extractContext(extractedRawText, 'screenshot');
    onContextExtracted(extracted);
    onNavigate('analysis');
  };

  const handleReset = () => {
    setImagePreview(null);
    setExtractedRawText('');
    setOcrError(null);
    setSelectedSampleId(null);
    setOcrProgress({ progress: 0, statusText: '' });
  };

  return (
    <div className="screen-container capture-screen">
      {/* Top Banner */}
      <div className="capture-header-card">
        <div className="capture-badge">
          <ImageIcon size={14} />
          <span>Screenshot Capture</span>
        </div>
        <h2 className="capture-title">Recover Context from Images</h2>
        <p className="capture-desc">
          Drop a chat screenshot, photo, or cropped snippet to perform client-side OCR and recover key context.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div 
        className="upload-dropzone-card"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="screenshot-upload" 
          accept="image/*" 
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
          className="file-input-hidden" 
        />
        <label htmlFor="screenshot-upload" className="dropzone-label">
          <div className="dropzone-icon-circle">
            <Upload size={24} />
          </div>
          <span className="dropzone-main-text">Upload Chat Screenshot</span>
          <span className="dropzone-sub-text">PNG, JPG, WebP (Drag & Drop or Click to Select)</span>
        </label>
      </div>

      {/* Image Preview / OCR Scanning Progress Bar */}
      {isOcrRunning && (
        <div className="ocr-progress-card">
          <div className="ocr-progress-header">
            <div className="ocr-status-wrap">
              <Cpu size={15} className="pulse-icon" />
              <span className="ocr-status-text">{ocrProgress.statusText}</span>
            </div>
            <span className="ocr-percent">{ocrProgress.progress}%</span>
          </div>
          <div className="ocr-progress-track">
            <div 
              className="ocr-progress-fill" 
              style={{ width: `${ocrProgress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Uploaded Image Thumbnail Preview */}
      {imagePreview && (
        <div className="uploaded-image-preview-card">
          <div className="thumbnail-header">
            <span className="thumbnail-title">Uploaded Screenshot Source</span>
            <button className="reset-thumb-btn" onClick={handleReset} title="Remove image">
              <RotateCcw size={12} />
              <span>Change Image</span>
            </button>
          </div>
          <div className="image-preview-frame">
            <img src={imagePreview} alt="Uploaded screenshot preview" className="screenshot-img" />
          </div>
        </div>
      )}

      {/* Sample Screenshots Fast Pick */}
      <div className="sample-screenshots-section">
        <div className="section-label-row">
          <Layers size={13} />
          <span className="section-label">Or Pick a Sample Conversation Screen:</span>
        </div>
        <div className="sample-screens-grid">
          {SAMPLE_SCREENSHOTS.map((sample) => (
            <div 
              key={sample.id}
              className={`sample-screen-card ${selectedSampleId === sample.id ? 'selected' : ''}`}
              onClick={() => handleSelectSample(sample)}
            >
              <div className="screen-card-header">
                <ImageIcon size={14} style={{ color: sample.accent }} />
                <span className="sample-screen-title">{sample.title}</span>
                <span className="sample-screen-badge">{sample.badge}</span>
              </div>
              <p className="sample-screen-snippet">"{sample.mockText}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resilient Error / Fallback Banner */}
      {ocrError && (
        <div className="resilience-notice warning">
          <AlertCircle size={15} className="notice-icon" />
          <span>{ocrError}</span>
        </div>
      )}

      {/* Recognized / Editable Raw Text Area */}
      {extractedRawText && (
        <div className="ocr-preview-card">
          <div className="preview-header">
            <div className="preview-title-row">
              <FileText size={15} />
              <span>Recognized Conversation Text</span>
            </div>
            <span className="fallback-note">Editable on-device</span>
          </div>

          <textarea
            className="ocr-textarea"
            rows={4}
            value={extractedRawText}
            onChange={(e) => setExtractedRawText(e.target.value)}
            placeholder="Review or edit recognized text before context recovery..."
          />

          <div className="preview-actions-bar">
            <button
              className="cta-primary-btn"
              onClick={handleRunExtraction}
              disabled={isOcrRunning || !extractedRawText.trim()}
            >
              <Sparkles size={16} />
              <span>Proceed to Context Analysis</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Resilient Safeguard Notice */}
      <div className="resilience-notice">
        <CheckCircle2 size={15} className="notice-icon" />
        <span>
          <strong>On-Device Guarantee:</strong> The Local Context Extraction Engine operates purely client-side. Your uploaded screenshots never leave this browser tab.
        </span>
      </div>
    </div>
  );
};
