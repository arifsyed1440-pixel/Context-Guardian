import React, { useState } from 'react';
import { ContextObject, ScreenType } from '../../types/context';

interface ContextDossierScreenProps {
  context: ContextObject | null;
  onUpdateContext: (updated: ContextObject) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ContextDossierScreen: React.FC<ContextDossierScreenProps> = ({
  context,
  onUpdateContext,
  onNavigate,
}) => {
  const [copiedDigest, setCopiedDigest] = useState(false);
  const [simulatedDownload, setSimulatedDownload] = useState<string | null>(null);

  if (!context) {
    return (
      <div className="screen-inner-container empty-state">
        <span className="material-symbols-outlined empty-icon">verified</span>
        <h3>No Active Context Dossier</h3>
        <p>Select or extract a context to view its executive recovery dossier.</p>
        <button className="stitch-btn primary" onClick={() => onNavigate('home')}>
          Return to Home
        </button>
      </div>
    );
  }

  // Generate the signature narrative summary
  const generateNarrative = (): string => {
    const actor = context.actor || 'The sender';
    const actionList = context.actions.length > 0
      ? context.actions.map(a => a.charAt(0).toLowerCase() + a.slice(1)).join(' and ')
      : 'follow up on deliverables';
    
    let narrative = `${actor} asked you to ${actionList}`;
    
    if (context.temporal.eventTiming) {
      narrative += ` for ${context.temporal.eventTiming.toLowerCase()}`;
    }
    if (context.temporal.taskDeadline) {
      narrative += ` (${context.temporal.taskDeadline.toLowerCase()})`;
    }
    
    narrative += ', with links to related files and the original conversation.';
    return narrative;
  };

  const handleToggleAction = (actionText: string) => {
    const isCompleted = context.completedActions.includes(actionText);
    const updatedCompleted = isCompleted
      ? context.completedActions.filter((a) => a !== actionText)
      : [...context.completedActions, actionText];

    onUpdateContext({
      ...context,
      completedActions: updatedCompleted,
    });
  };

  const handleCopyDigest = () => {
    const digest = `CONTEXT GUARDIAN DOSSIER
Originator: ${context.actor}
Purpose: ${context.purpose}
Event: ${context.temporal.eventTiming || 'N/A'}
Deadline: ${context.temporal.taskDeadline || 'N/A'}

Action Items:
${context.actions.map((a, i) => `${i + 1}. [${context.completedActions.includes(a) ? 'X' : ' '}] ${a}`).join('\n')}

Artifact Concepts:
${context.artifacts.join(', ')}

Reconstructed Context:
"${generateNarrative()}"

Raw Snippet:
"${context.rawText}"
`;

    navigator.clipboard.writeText(digest);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2200);
  };

  const handleDownloadFile = (fileName: string) => {
    setSimulatedDownload(fileName);
    setTimeout(() => setSimulatedDownload(null), 1800);
  };

  const completedCount = context.completedActions.length;
  const totalActions = context.actions.length;
  const isAllDone = totalActions > 0 && completedCount === totalActions;

  return (
    <div className="screen-inner-container dossier-stitch-screen">
      {/* Ambient Atmospheric Backdrop Glows */}
      <div className="ambient-glows-wrap">
        <div className="ambient-glow top-right"></div>
        <div className="ambient-glow mid-left"></div>
      </div>

      {/* Meta Header Bar (Stitch Screen 08) */}
      <div className="dossier-meta-bar">
        <div className="dossier-meta-left">
          <div className="dossier-id-capsule">
            <span className="live-pulse-container">
              <span className="live-pulse-ping"></span>
              <span className="live-pulse-dot"></span>
            </span>
            <span className="dossier-id-text">DOSSIER #CG-{context.id.slice(-4).toUpperCase()}</span>
          </div>
          <span className="critical-badge">P1 Critical</span>
        </div>

        <div className="dossier-meta-right">
          <button 
            className="round-icon-btn" 
            onClick={handleCopyDigest}
            title="Share / Copy Digest"
          >
            <span className="material-symbols-outlined text-[17px]">share</span>
          </button>
        </div>
      </div>

      {/* Executive Synthesis Hero Card (Stitch Screen 08) */}
      <div className="executive-synthesis-card">
        {/* Background Radar Rings SVG */}
        <div className="synthesis-radar-decor">
          <svg className="synthesis-svg-spin" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="85" stroke="#c0c1ff" strokeDasharray="6 8" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="55" stroke="#4cd7f6" strokeDasharray="80 120" strokeLinecap="round" strokeWidth="2" />
            <circle cx="100" cy="100" r="30" stroke="#8083ff" strokeWidth="1.5" />
            <circle cx="140" cy="100" fill="#4cd7f6" r="6" />
            <circle cx="75" cy="65" fill="#c0c1ff" r="4.5" />
          </svg>
        </div>

        {/* Precision Context Badge */}
        <div className="synthesis-badges-row">
          <div className="precision-pill">
            <span className="material-symbols-outlined text-tertiary text-[15px]">verified</span>
            <span className="precision-label">{(context.confidenceScore * 100).toFixed(0)}% PRECISION</span>
          </div>
          <div className="streams-synced-pill">
            <span className="material-symbols-outlined text-secondary text-[14px]">sync_saved_locally</span>
            <span>3 STREAMS SYNCED</span>
          </div>
        </div>

        {/* Executive Synthesis Callout */}
        <div className="synthesis-body">
          <span className="synthesis-subheading">Executive Synthesis</span>
          <h2 className="synthesis-narrative-text">
            “{generateNarrative()}”
          </h2>
        </div>

        {/* Visual Spark Divider */}
        <div className="synthesis-footer-bar">
          <span className="synthesis-status-chip">
            <span className="status-spark-dot"></span>
            <span>Neural extraction active</span>
          </span>
          <span className="t-minus-tag">T-MINUS 21h 14m</span>
        </div>
      </div>

      {/* Core Metadata Matrix Bento (Stitch Screen 08) */}
      <div className="metadata-bento-column">
        {/* Actor Profile Card */}
        <div className="actor-profile-card">
          <div className="actor-profile-info">
            <div className="actor-avatar-frame">
              <img
                src="/avatar-rahul.png"
                alt="Rahul"
                className="actor-img"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <span className="actor-online-indicator">
                <span className="online-green-dot"></span>
              </span>
            </div>
            <div className="actor-details">
              <div className="actor-name-row">
                <h3 className="actor-full-name">{context.actor} S.</h3>
                <span className="role-tag">Design Lead</span>
              </div>
              <p className="actor-status-text">
                <span className="material-symbols-outlined text-[13px] text-tertiary">headphones</span>
                <span>Slack status: “In deep work”</span>
              </p>
            </div>
          </div>
          <button 
            className="actor-chat-btn" 
            onClick={() => onNavigate('input')}
            title="Inspect conversation"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
          </button>
        </div>

        {/* Dual Metric Cards: Purpose & Task Deadline */}
        <div className="dual-metrics-grid">
          {/* Milestone / Purpose */}
          <div className="metric-box">
            <div className="metric-header">
              <span className="material-symbols-outlined text-secondary text-[14px]">event_note</span>
              <span className="metric-label text-secondary">Milestone Context</span>
            </div>
            <div className="metric-val">{context.purpose}</div>
            <span className="metric-sub">{context.temporal.eventTiming || 'Synced with Room C'}</span>
          </div>

          {/* Task Deadline */}
          <div className="metric-box">
            <div className="metric-header">
              <span className="material-symbols-outlined text-error text-[14px]">timer</span>
              <span className="metric-label text-error">Task Deadline</span>
            </div>
            <div className="metric-val text-error">
              {context.temporal.taskDeadline || 'Tomorrow, 5:00 PM'}
            </div>
            <span className="metric-sub">Firm submission cutoff</span>
          </div>
        </div>
      </div>

      {/* Actionable Deliverables Checklist */}
      <div className="deliverables-checklist-card">
        <div className="checklist-heading-row">
          <div className="checklist-title-group">
            <span className="material-symbols-outlined text-tertiary text-[18px]">checklist_rtl</span>
            <h4 className="checklist-heading">Actionable Deliverables</h4>
          </div>
          <span className="checklist-progress-pill">
            {completedCount} of {totalActions} done
          </span>
        </div>

        <div className="checklist-track">
          <div 
            className={`checklist-fill ${isAllDone ? 'complete' : ''}`}
            style={{ width: `${totalActions > 0 ? (completedCount / totalActions) * 100 : 0}%` }}
          />
        </div>

        <div className="checklist-items-stack">
          {context.actions.map((action, idx) => {
            const isDone = context.completedActions.includes(action);
            return (
              <div 
                key={idx} 
                className={`checklist-entry ${isDone ? 'checked' : ''}`}
                onClick={() => handleToggleAction(action)}
              >
                <div className={`entry-checkbox ${isDone ? 'checked' : ''}`}>
                  {isDone && <span className="material-symbols-outlined text-[14px]">check</span>}
                </div>
                <div className="entry-text-col">
                  <span className="entry-action-name">{action}</span>
                  <span className="entry-actor-sub">Requested by {context.actor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referenced Artifacts Vault (Stitch Screen 08) */}
      <div className="artifacts-vault-card">
        <div className="vault-heading-row">
          <div className="vault-title-group">
            <span className="material-symbols-outlined text-secondary text-[18px]">folder_open</span>
            <h4 className="vault-heading">Referenced Artifacts Vault</h4>
          </div>
          <span className="vault-assets-count">
            {context.linkedArtifacts?.length || context.artifacts.length} Assets
          </span>
        </div>

        <p className="vault-desc">
          Extracted conceptual requirements mapped to demo project files:
        </p>

        <div className="vault-files-stack">
          {context.linkedArtifacts && context.linkedArtifacts.length > 0 ? (
            context.linkedArtifacts.map((file) => (
              <div key={file.id} className="vault-file-entry">
                <div className="file-icon-box">
                  <span className="material-symbols-outlined text-[18px]">
                    {file.fileType === 'archive' && 'inventory'}
                    {file.fileType === 'presentation' && 'slideshow'}
                    {file.fileType === 'design' && 'draw'}
                    {file.fileType === 'code' && 'code'}
                    {file.fileType === 'document' && 'description'}
                  </span>
                </div>
                <div className="file-info-col">
                  <span className="file-title">{file.name}</span>
                  <span className="file-relation">
                    Tied to: <strong>{file.conceptRef}</strong> {file.size && `• ${file.size}`}
                  </span>
                </div>
                <button
                  className="file-download-btn"
                  onClick={() => handleDownloadFile(file.name)}
                  title="Simulate open/download file"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {simulatedDownload === file.name ? 'check_circle' : 'download'}
                  </span>
                </button>
              </div>
            ))
          ) : (
            context.artifacts.map((art, idx) => (
              <div key={idx} className="vault-file-entry">
                <div className="file-info-col">
                  <span className="file-title">{art}</span>
                  <span className="file-relation">Extracted conversation concept</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Original Conversation Snippet Card */}
      <div className="original-signal-card">
        <div className="signal-card-header">
          <span className="material-symbols-outlined text-outline text-[16px]">format_quote</span>
          <span className="signal-card-title">Original Conversation Signal</span>
        </div>
        <blockquote className="signal-quote-text">
          "{context.rawText}"
        </blockquote>
      </div>

      {/* Bottom Footer Actions */}
      <div className="dossier-actions-grid">
        <button
          className="stitch-btn secondary"
          onClick={() => onNavigate('graph')}
        >
          <span className="material-symbols-outlined text-[16px]">hub</span>
          <span>View Context Graph</span>
        </button>

        <button
          className="stitch-btn primary"
          onClick={handleCopyDigest}
        >
          <span className="material-symbols-outlined text-[16px]">
            {copiedDigest ? 'check_circle' : 'share'}
          </span>
          <span>{copiedDigest ? 'Digest Copied!' : 'Copy Context Digest'}</span>
        </button>
      </div>
    </div>
  );
};
