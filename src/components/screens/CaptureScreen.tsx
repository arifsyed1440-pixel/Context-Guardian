import React, { useState, useEffect, useRef } from 'react';
import { ContextObject, ScreenType } from '../../types/context';
import { extractContext } from '../../services/localExtractionEngine';
import { recognizeScreenshotText, OcrProgress } from '../../services/ocrService';
import { DEMO_PRESETS, SampleChatPreset, generateScreenshotDataUrl } from '../../utils/sampleImageGenerator';

interface CaptureScreenProps {
  onContextExtracted: (context: ContextObject) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  onContextExtracted,
  onNavigate,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedRawText, setExtractedRawText] = useState<string>('');
  const [isOcrRunning, setIsOcrRunning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress>({ progress: 0, statusText: '' });
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard Paste Support (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleProcessImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Process an uploaded or pasted image file with OCR
  const handleProcessImageFile = async (file: File) => {
    setOcrError(null);
    setSelectedPresetId(null);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    await executeOcr(file);
  };

  // Run OCR on either a File or data URL
  const executeOcr = async (target: File | string, fallbackText?: string) => {
    setIsOcrRunning(true);
    setOcrError(null);
    setOcrProgress({ progress: 5, statusText: 'Initializing client-side OCR engine...' });

    try {
      const recognized = await recognizeScreenshotText(target, (p) => {
        setOcrProgress(p);
      });

      setExtractedRawText(recognized);
      setIsOcrRunning(false);
    } catch (err: unknown) {
      setIsOcrRunning(false);
      const errMsg = err instanceof Error ? err.message : 'OCR encountered difficulty parsing text.';
      setOcrError(`${errMsg} You can review or edit the conversation text below to proceed.`);

      // Resilient fallback: ensure user is never blocked
      if (!extractedRawText) {
        setExtractedRawText(
          fallbackText ||
          "Rahul: Hey, for tomorrow's project review, please bring the latest prototype. Also update the architecture slides before 5 PM."
        );
      }
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessImageFile(e.dataTransfer.files[0]);
    }
  };

  // Handle selecting a sample demo screenshot preset
  const handleSelectPreset = (preset: SampleChatPreset) => {
    setSelectedPresetId(preset.id);
    setOcrError(null);

    // Generate real visual canvas screenshot
    const dataUrl = generateScreenshotDataUrl(preset);
    setImagePreview(dataUrl);

    // Pre-populate raw text immediately for resilient demonstration
    setExtractedRawText(preset.text);

    // Execute OCR on the generated canvas image for live verification
    executeOcr(dataUrl, preset.text);
  };

  // Clear / Reset
  const handleReset = () => {
    setImagePreview(null);
    setExtractedRawText('');
    setOcrError(null);
    setSelectedPresetId(null);
    setOcrProgress({ progress: 0, statusText: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Execute extraction through EXISTING Local Context Extraction Engine
  const handleRunExtraction = () => {
    if (!extractedRawText.trim()) return;

    // Single source of truth: extract with sourceType 'screenshot'
    const extracted = extractContext(extractedRawText, 'screenshot');
    onContextExtracted(extracted);
    onNavigate('analysis');
  };

  return (
    <div className="screen-inner-container capture-stitch-screen">
      {/* Ambient Radial Highlights */}
      <div className="ambient-glows-wrap">
        <div className="ambient-glow top-left"></div>
        <div className="ambient-glow top-right"></div>
      </div>

      {/* Submode Ingestion Switcher Tabs */}
      <div className="ingest-switch-tabs">
        <button 
          className="ingest-tab-btn" 
          onClick={() => onNavigate('input')}
        >
          <span className="material-symbols-outlined text-[15px]">chat_bubble</span>
          <span>Text Snippet</span>
        </button>
        <button 
          className="ingest-tab-btn active" 
          disabled
        >
          <span className="material-symbols-outlined text-[15px]">document_scanner</span>
          <span>Screenshot OCR (Active)</span>
        </button>
      </div>

      {/* Screen Title & Atmosphere Block (Stitch Screen 03) */}
      <div className="capture-header-card">
        <div className="capture-tag-row">
          <div className="capture-node-pill">
            <span className="material-symbols-outlined text-[13px] text-tertiary">document_scanner</span>
            <span className="node-label">Neural Vision Node</span>
          </div>
          <span className="epoch-tag">CLIENT-SIDE TESSERACT</span>
        </div>
        <h2 className="capture-title">Recover Context from Screenshots</h2>
        <p className="capture-desc">
          Drop or upload a chat screenshot, photo, or snippet. Antigravity's on-device OCR extracts the conversation text and grounds it in the semantic engine.
        </p>
      </div>

      {/* Hackathon Demo Presets */}
      <div className="demo-presets-card">
        <div className="demo-presets-header">
          <span className="material-symbols-outlined text-[15px] text-secondary">burst_mode</span>
          <span className="demo-presets-label">Hackathon Sample Screenshots:</span>
        </div>
        <div className="presets-grid">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={`preset-card ${selectedPresetId === preset.id ? 'selected' : ''}`}
              onClick={() => handleSelectPreset(preset)}
              type="button"
            >
              <div className="preset-header">
                <span className="material-symbols-outlined text-[14px] text-primary">image</span>
                <span className="preset-title">{preset.sender} ({preset.tag})</span>
              </div>
              <p className="preset-snippet">"{preset.text}"</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Dropzone / Upload Area */}
      <div 
        className={`upload-dropzone-box ${isDragging ? 'drag-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          id="screenshot-upload" 
          accept="image/*" 
          onChange={(e) => e.target.files?.[0] && handleProcessImageFile(e.target.files[0])} 
          className="file-input-hidden" 
        />
        <div className="dropzone-inner-content">
          <div className="dropzone-icon-orb">
            <span className="material-symbols-outlined dropzone-icon">cloud_upload</span>
          </div>
          <span className="dropzone-primary-text">Upload Chat Screenshot</span>
          <span className="dropzone-secondary-text">
            Drag & drop, browse files, or press <kbd className="shortcut-kbd">Ctrl+V</kbd> to paste
          </span>
          <span className="dropzone-meta-pill">PNG, JPG, WebP • 100% Client-Side</span>
        </div>
      </div>

      {/* Image Preview & Scanner Status */}
      {imagePreview && (
        <div className="preview-media-card">
          <div className="preview-media-header">
            <div className="preview-media-label-group">
              <span className="material-symbols-outlined text-[15px] text-secondary">image</span>
              <span className="preview-media-title">Screenshot Source</span>
            </div>
            <button 
              className="change-image-btn" 
              onClick={handleReset} 
              title="Remove or change image"
              type="button"
            >
              <span className="material-symbols-outlined text-[13px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>

          <div className="preview-image-container">
            <img 
              src={imagePreview} 
              alt="Screenshot source preview" 
              className="preview-image-element" 
            />
          </div>

          {/* OCR Scanning Progress Bar */}
          {isOcrRunning && (
            <div className="ocr-progress-container">
              <div className="ocr-progress-top">
                <div className="ocr-status-group">
                  <div className="spin-indicator small"></div>
                  <span className="ocr-status-text">{ocrProgress.statusText}</span>
                </div>
                <span className="ocr-percent-badge">{ocrProgress.progress}%</span>
              </div>
              <div className="ocr-progress-track">
                <div 
                  className="ocr-progress-fill" 
                  style={{ width: `${ocrProgress.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resilient Error / Fallback Notice */}
      {ocrError && (
        <div className="ocr-error-banner">
          <span className="material-symbols-outlined error-icon">info</span>
          <div className="error-text-col">
            <span className="error-heading">Notice</span>
            <span className="error-body">{ocrError}</span>
          </div>
        </div>
      )}

      {/* Extracted / Editable Conversation Text Box */}
      {extractedRawText && (
        <div className="convo-input-card">
          <div className="convo-input-header">
            <div className="preview-title-row">
              <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
              <span className="convo-label">Recognized Conversation Text</span>
            </div>
            <span className="mode-status">
              <span className="sparkle-symbol">✦</span>
              <span>Editable before extraction</span>
            </span>
          </div>

          <textarea
            className="convo-textarea-field"
            rows={4}
            value={extractedRawText}
            onChange={(e) => setExtractedRawText(e.target.value)}
            placeholder="Review or edit recognized text before context recovery..."
          />

          <div className="convo-meta-footer">
            <span>{extractedRawText.length} characters • UTF-8</span>
            <button
              className="clear-text-btn"
              onClick={() => setExtractedRawText('')}
              type="button"
            >
              <span className="material-symbols-outlined text-[13px]">backspace</span>
              <span>Clear</span>
            </button>
          </div>

          {/* Action Button to run existing Local Context Extraction Engine */}
          <button
            className="extract-execute-btn"
            onClick={handleRunExtraction}
            disabled={isOcrRunning || !extractedRawText.trim()}
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Proceed to Context Analysis</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Resilient Privacy & Architecture Guarantee Banner */}
      <div className="privacy-guarantee-card">
        <div className="privacy-card-inner">
          <span className="material-symbols-outlined text-[18px] text-tertiary">verified_user</span>
          <p className="privacy-card-text">
            <strong>Client-Side Guarantee:</strong> OCR runs locally via Tesseract WebAssembly. Images and text never leave this browser tab.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptureScreen;
