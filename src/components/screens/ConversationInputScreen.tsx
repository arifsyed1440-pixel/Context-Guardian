import React, { useState } from 'react';
import { extractContext } from '../../services/localExtractionEngine';
import { ContextObject, ScreenType } from '../../types/context';

interface ConversationInputScreenProps {
  onContextExtracted: (context: ContextObject) => void;
  onNavigate: (screen: ScreenType) => void;
}

const SAMPLE_CONVERSATIONS = [
  {
    title: 'Rahul (Canonical Demo)',
    desc: 'Project review with prototype & architecture slides',
    text: "Rahul: Hey, for tomorrow's project review, please bring the latest prototype. Also update the architecture slides before 5 PM."
  },
  {
    title: 'Priya (Design Handover)',
    desc: 'Figma components & SVG icon kit',
    text: "Priya: For the mobile design handover, please verify the onboarding Figma components and export the SVG icon kit by Friday."
  },
  {
    title: 'Alex (Critical Release)',
    desc: 'Memory leak & crash logs review',
    text: "Alex: We need to fix the memory leak in production sync before tonight's 8 PM release. Review the crash logs on Sentry."
  }
];

export const ConversationInputScreen: React.FC<ConversationInputScreenProps> = ({
  onContextExtracted,
  onNavigate,
}) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_CONVERSATIONS[0].text);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleProcess = () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    // Deterministic local extraction execution
    setTimeout(() => {
      const extracted = extractContext(inputText, 'text');
      onContextExtracted(extracted);
      setIsProcessing(false);
      onNavigate('analysis');
    }, 280);
  };

  return (
    <div className="screen-inner-container input-stitch-screen">
      {/* Submode Ingestion Switcher Tabs */}
      <div className="ingest-switch-tabs">
        <button 
          className="ingest-tab-btn active" 
          disabled
        >
          <span className="material-symbols-outlined text-[15px]">chat_bubble</span>
          <span>Text Snippet (Active)</span>
        </button>
        <button 
          className="ingest-tab-btn" 
          onClick={() => onNavigate('capture')}
        >
          <span className="material-symbols-outlined text-[15px]">document_scanner</span>
          <span>Screenshot OCR</span>
        </button>
      </div>

      {/* Header Info Banner */}
      <div className="ingest-header-card">
        <div className="ingest-tag-row">
          <div className="ingest-badge">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            <span>Local Context Extraction Engine</span>
          </div>
          <span className="epoch-tag">CLIENT-SIDE 100%</span>
        </div>
        <h2 className="ingest-title">Fragmented Conversation Ingestion</h2>
        <p className="ingest-desc">
          Transform messy conversational chat snippets, slack threads, or notes into structured relational intelligence.
        </p>
      </div>

      {/* Preset Pickers */}
      <div className="presets-section">
        <div className="presets-label-row">
          <span className="material-symbols-outlined text-[16px] text-secondary">layers</span>
          <span className="presets-label">Canonical Demo Presets:</span>
        </div>
        <div className="presets-grid">
          {SAMPLE_CONVERSATIONS.map((sample, idx) => (
            <button
              key={idx}
              className={`preset-card ${inputText === sample.text ? 'selected' : ''}`}
              onClick={() => setInputText(sample.text)}
            >
              <div className="preset-header">
                <span className="material-symbols-outlined text-[15px] text-primary">chat</span>
                <span className="preset-title">{sample.title}</span>
              </div>
              <p className="preset-snippet">"{sample.text}"</p>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Input Box */}
      <div className="convo-input-card">
        <div className="convo-input-header">
          <label htmlFor="convo-textarea" className="convo-label">
            Raw Human Signal
          </label>
          <button 
            className="clear-text-btn" 
            onClick={() => setInputText('')}
          >
            <span className="material-symbols-outlined text-[13px]">restart_alt</span>
            <span>Clear</span>
          </button>
        </div>

        <textarea
          id="convo-textarea"
          className="convo-textarea-field"
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type raw message snippet here..."
        />

        <div className="convo-meta-footer">
          <span className="char-count">{inputText.length} characters</span>
          <span className="mode-status">
            <span className="material-symbols-outlined text-[13px] text-tertiary">check_circle</span>
            Deterministic Local Parser
          </span>
        </div>
      </div>

      {/* Extract Button */}
      <button
        className="extract-execute-btn"
        onClick={handleProcess}
        disabled={!inputText.trim() || isProcessing}
      >
        {isProcessing ? (
          <>
            <span className="spin-indicator"></span>
            <span>Running Local Extraction...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Extract & Recover Context</span>
          </>
        )}
      </button>

      {/* Pipeline Explainer Card */}
      <div className="pipeline-steps-card">
        <span className="pipeline-title">Deterministic Recovery Pipeline</span>
        <div className="pipeline-steps-list">
          <div className="pipeline-step-item">
            <div className="step-num">1</div>
            <div className="step-content">
              <strong>Actor & Intent Isolation</strong>
              <span>Detects communicators and imperative task verbs</span>
            </div>
          </div>
          <div className="pipeline-step-item">
            <div className="step-num">2</div>
            <div className="step-content">
              <strong>Temporal Disambiguation</strong>
              <span>Separates broad event timing from strict task deadlines</span>
            </div>
          </div>
          <div className="pipeline-step-item">
            <div className="step-num">3</div>
            <div className="step-content">
              <strong>Artifact Mapping & Semantic Graph</strong>
              <span>Links deliverables to referenced project assets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
