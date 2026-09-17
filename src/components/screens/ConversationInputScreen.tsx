import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Cpu, 
  Layers, 
  Check, 
  FileText
} from 'lucide-react';
import { extractContext } from '../../services/localExtractionEngine';
import { ContextObject, ScreenType } from '../../types/context';

interface ConversationInputScreenProps {
  onContextExtracted: (context: ContextObject) => void;
  onNavigate: (screen: ScreenType) => void;
}

const SAMPLE_CONVERSATIONS = [
  {
    title: 'Rahul (Canonical Demo)',
    desc: 'Project review with prototype & slides',
    text: "Rahul: Hey, for tomorrow's project review, please bring the latest prototype. Also update the architecture slides before 5 PM."
  },
  {
    title: 'Priya (Design Handover)',
    desc: 'Figma components & SVG icon kit',
    text: "Priya: For the mobile design handover, please verify the onboarding Figma components and export the SVG icon kit by Friday."
  },
  {
    title: 'Alex (Incident Response)',
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
  const [copiedSample, setCopiedSample] = useState<number | null>(null);

  const handleProcess = () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    // Simulate brief deterministic on-device analysis frame
    setTimeout(() => {
      const extracted = extractContext(inputText, 'text');
      onContextExtracted(extracted);
      setIsProcessing(false);
      onNavigate('analysis');
    }, 280);
  };

  const handleSelectSample = (idx: number) => {
    setInputText(SAMPLE_CONVERSATIONS[idx].text);
    setCopiedSample(idx);
    setTimeout(() => setCopiedSample(null), 1500);
  };

  return (
    <div className="screen-container input-screen">
      {/* Engine Banner */}
      <div className="engine-info-banner">
        <Cpu size={16} className="engine-banner-icon" />
        <div className="engine-banner-text">
          <strong>Local Context Extraction Engine</strong>
          <span>Deterministic client-side parsing. Zero external APIs, zero telemetry.</span>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="sample-picker-section">
        <div className="sample-label-row">
          <Layers size={13} />
          <span>Quick Demo Presets:</span>
        </div>
        <div className="sample-chips-row">
          {SAMPLE_CONVERSATIONS.map((sample, idx) => (
            <button
              key={idx}
              className={`sample-chip-btn ${inputText === sample.text ? 'selected' : ''}`}
              onClick={() => handleSelectSample(idx)}
            >
              {copiedSample === idx ? <Check size={12} /> : <FileText size={12} />}
              <span>{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Input Box */}
      <div className="input-box-card">
        <div className="input-box-header">
          <label htmlFor="convo-input" className="input-label">
            Fragmented Conversation Snippet
          </label>
          <button
            className="clear-btn"
            onClick={() => setInputText('')}
            title="Clear text"
          >
            <RotateCcw size={12} />
            <span>Clear</span>
          </button>
        </div>

        <textarea
          id="convo-input"
          className="convo-textarea"
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type a chat message, email snippet, or meeting request here..."
        />

        <div className="input-meta-bar">
          <span className="char-count">{inputText.length} characters</span>
          <span className="parsing-mode-badge">
            <Sparkles size={11} />
            Rule-Based Parser Ready
          </span>
        </div>
      </div>

      {/* Extraction Execution Button */}
      <div className="execution-cta-wrapper">
        <button
          className="extract-primary-btn"
          onClick={handleProcess}
          disabled={!inputText.trim() || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="btn-spinner"></span>
              <span>Extracting Context on Device...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Extract & Recover Context</span>
            </>
          )}
        </button>
      </div>

      {/* Extraction Explainer Box */}
      <div className="explainer-card">
        <h4 className="explainer-title">How the Recovery Pipeline Works</h4>
        <ul className="explainer-steps">
          <li>
            <span className="step-badge">1</span>
            <div>
              <strong>Actor & Intent Isolation:</strong> Identifies the communicator and detects imperative task statements.
            </div>
          </li>
          <li>
            <span className="step-badge">2</span>
            <div>
              <strong>Temporal Disambiguation:</strong> Strictly bifurcates broad event timings from specific task deadlines.
            </div>
          </li>
          <li>
            <span className="step-badge">3</span>
            <div>
              <strong>Artifact Concept Mapping:</strong> Detects physical or digital assets mentioned directly in the conversation.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
