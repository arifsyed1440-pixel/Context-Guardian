import React, { useState } from 'react';
import { 
  FileCheck, 
  Calendar, 
  Clock, 
  Check, 
  Download, 
  Share2, 
  Quote, 
  Archive, 
  FileText, 
  Code, 
  Sparkles,
  Network
} from 'lucide-react';
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
  const [copiedDigest, setCopiedDigest] = useState<boolean>(false);
  const [simulatedDownload, setSimulatedDownload] = useState<string | null>(null);

  if (!context) {
    return (
      <div className="screen-container empty-state">
        <FileCheck size={36} className="empty-icon" />
        <h3>No Active Context Dossier</h3>
        <p>Select or extract a context to view its reconstructed executive dossier.</p>
        <button className="cta-primary-btn" onClick={() => onNavigate('home')}>
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
      : 'follow up on the conversation';
    
    let narrative = `${actor} asked you to ${actionList}`;
    
    if (context.temporal.eventTiming) {
      narrative += ` for ${context.temporal.eventTiming.toLowerCase()}`;
    }
    if (context.temporal.taskDeadline) {
      narrative += ` (${context.temporal.taskDeadline.toLowerCase()})`;
    }
    
    narrative += '. Here are the related files and original context.';
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
    const digest = `CONTEXT GUARDIAN RECOVERY DIGEST
Originator: ${context.actor}
Purpose: ${context.purpose}
Event: ${context.temporal.eventTiming || 'N/A'}
Deadline: ${context.temporal.taskDeadline || 'N/A'}

Action Items:
${context.actions.map((a, i) => `${i + 1}. [${context.completedActions.includes(a) ? 'X' : ' '}] ${a}`).join('\n')}

Artifact Concepts:
${context.artifacts.join(', ')}

Original Snippet:
"${context.rawText}"
`;

    navigator.clipboard.writeText(digest);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2000);
  };

  const handleDownloadFile = (fileName: string) => {
    setSimulatedDownload(fileName);
    setTimeout(() => setSimulatedDownload(null), 1800);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'archive': return <Archive size={16} className="file-icon-archive" />;
      case 'presentation': return <FileText size={16} className="file-icon-pres" />;
      case 'design': return <FileText size={16} className="file-icon-design" />;
      case 'code': return <Code size={16} className="file-icon-code" />;
      default: return <FileText size={16} className="file-icon-doc" />;
    }
  };

  const totalActions = context.actions.length;
  const completedCount = context.completedActions.length;
  const isAllDone = totalActions > 0 && completedCount === totalActions;

  return (
    <div className="screen-container dossier-screen">
      {/* Dossier Header */}
      <div className="dossier-header-bar">
        <div className="dossier-badge">
          <FileCheck size={14} />
          <span>Context Dossier</span>
        </div>
        <div className="dossier-meta-chips">
          <span className="meta-tag category">{context.category}</span>
          <span className="meta-tag status">{context.status}</span>
        </div>
      </div>

      {/* Signature Narrative Box */}
      <div className="dossier-narrative-card">
        <div className="narrative-label">
          <Sparkles size={14} />
          <span>Reconstructed Context Synthesis</span>
        </div>
        <p className="narrative-text">"{generateNarrative()}"</p>
        <div className="narrative-subtext">
          Synthesized on-device by Context Guardian from raw fragmented communication.
        </div>
      </div>

      {/* Action Checklist */}
      <div className="dossier-card checklist-card">
        <div className="card-heading-row">
          <div className="heading-with-icon">
            <Check size={16} className="icon-badge-green" />
            <h4 className="card-title">Actionable Deliverables</h4>
          </div>
          <span className="checklist-counter">
            {completedCount} of {totalActions} done
          </span>
        </div>

        <div className="dossier-progress-bar">
          <div 
            className={`dossier-progress-fill ${isAllDone ? 'complete' : ''}`}
            style={{ width: `${totalActions > 0 ? (completedCount / totalActions) * 100 : 0}%` }}
          />
        </div>

        <div className="dossier-actions-checklist">
          {context.actions.map((action, idx) => {
            const isDone = context.completedActions.includes(action);
            return (
              <div 
                key={idx} 
                className={`checklist-item ${isDone ? 'checked' : ''}`}
                onClick={() => handleToggleAction(action)}
              >
                <div className={`checkbox-square ${isDone ? 'checked' : ''}`}>
                  {isDone && <Check size={13} />}
                </div>
                <div className="checklist-text-wrap">
                  <span className="checklist-action-name">{action}</span>
                  <span className="checklist-actor-hint">Requested by {context.actor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Temporal Timeline Breakdown */}
      <div className="dossier-card temporal-dossier-card">
        <h4 className="card-title">Temporal Constraints</h4>
        <div className="temporal-dossier-grid">
          <div className="temporal-dossier-cell event-cell">
            <div className="cell-header">
              <Calendar size={14} />
              <span>Event Timing</span>
            </div>
            <div className="cell-value">
              {context.temporal.eventTiming || 'Flexible / Unspecified'}
            </div>
            <span className="cell-desc">Contextual milestone</span>
          </div>

          <div className="temporal-dossier-cell deadline-cell">
            <div className="cell-header">
              <Clock size={14} />
              <span>Task Deadline</span>
            </div>
            <div className="cell-value highlight-deadline">
              {context.temporal.taskDeadline || 'None specified'}
            </div>
            <span className="cell-desc">Hard submission cutoff</span>
          </div>
        </div>
      </div>

      {/* Associated Artifacts Vault */}
      <div className="dossier-card artifacts-vault-card">
        <div className="card-heading-row">
          <h4 className="card-title">Referenced Artifacts Vault</h4>
          <span className="artifacts-count">
            {context.linkedArtifacts?.length || context.artifacts.length} assets
          </span>
        </div>

        <p className="vault-subtext">
          Extracted conceptual requirements mapped to demo-linked project files:
        </p>

        <div className="vault-files-grid">
          {context.linkedArtifacts && context.linkedArtifacts.length > 0 ? (
            context.linkedArtifacts.map((file) => (
              <div key={file.id} className="vault-file-card">
                <div className="file-icon-box">{getFileIcon(file.fileType)}</div>
                <div className="file-details">
                  <div className="file-name-title">{file.name}</div>
                  <div className="file-concept-tag">
                    Tied to: <strong>{file.conceptRef}</strong>
                  </div>
                  {file.size && <span className="file-size-badge">{file.size}</span>}
                </div>
                <button
                  className="file-action-btn"
                  onClick={() => handleDownloadFile(file.name)}
                  title="Simulate open/download file"
                >
                  {simulatedDownload === file.name ? (
                    <Check size={14} className="download-done" />
                  ) : (
                    <Download size={14} />
                  )}
                </button>
              </div>
            ))
          ) : (
            context.artifacts.map((art, idx) => (
              <div key={idx} className="vault-file-card fallback">
                <div className="file-details">
                  <div className="file-name-title">{art}</div>
                  <div className="file-concept-tag">Extracted conversation asset</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Original Fragment Quote */}
      <div className="dossier-card original-quote-card">
        <div className="card-heading-row">
          <div className="heading-with-icon">
            <Quote size={15} />
            <h4 className="card-title">Original Conversation Source</h4>
          </div>
          <span className="source-label">Source: {context.sourceType}</span>
        </div>
        <blockquote className="quote-content">
          "{context.rawText}"
        </blockquote>
      </div>

      {/* Footer Controls & Share */}
      <div className="dossier-footer-actions">
        <button
          className="dossier-cta-btn secondary"
          onClick={() => onNavigate('graph')}
        >
          <Network size={16} />
          <span>View Relationship Graph</span>
        </button>

        <button
          className="dossier-cta-btn primary"
          onClick={handleCopyDigest}
        >
          {copiedDigest ? (
            <>
              <Check size={16} />
              <span>Digest Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={16} />
              <span>Copy Context Digest</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
