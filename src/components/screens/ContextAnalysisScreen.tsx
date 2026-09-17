import React, { useState } from 'react';
import { ContextObject, ScreenType } from '../../types/context';

interface ContextAnalysisScreenProps {
  context: ContextObject | null;
  onUpdateContext: (updated: ContextObject) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ContextAnalysisScreen: React.FC<ContextAnalysisScreenProps> = ({
  context,
  onUpdateContext,
  onNavigate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newActionText, setNewActionText] = useState('');

  if (!context) {
    return (
      <div className="screen-inner-container empty-state">
        <span className="material-symbols-outlined empty-icon">psychology</span>
        <h3>No Active Context to Analyze</h3>
        <p>Input a conversation to inspect its neural decomposition.</p>
        <button className="stitch-btn primary" onClick={() => onNavigate('input')}>
          Go to Input
        </button>
      </div>
    );
  }

  const handleToggleAction = (actionText: string) => {
    const isCompleted = context.completedActions.includes(actionText);
    const updated = isCompleted
      ? context.completedActions.filter(a => a !== actionText)
      : [...context.completedActions, actionText];

    onUpdateContext({
      ...context,
      completedActions: updated,
    });
  };

  const handleAddAction = () => {
    if (!newActionText.trim()) return;
    onUpdateContext({
      ...context,
      actions: [...context.actions, newActionText.trim()],
    });
    setNewActionText('');
  };

  const handleRemoveAction = (index: number) => {
    onUpdateContext({
      ...context,
      actions: context.actions.filter((_, idx) => idx !== index),
    });
  };

  return (
    <div className="screen-inner-container analysis-stitch-screen">
      {/* Realtime Diagnostic Synthesis Orb Card (Stitch Screen 02) */}
      <div className="diagnostic-card">
        <div className="diagnostic-top-line"></div>
        <div className="diagnostic-header-row">
          <div className="diagnostic-badge-group">
            <div className="diagnostic-icon-circle">
              <span className="material-symbols-outlined text-primary text-[18px] rotating-orb">
                psychology
              </span>
            </div>
            <div className="diagnostic-titles">
              <div className="diagnostic-title-row">
                <span className="diagnostic-title">Neural Decomposition</span>
                <span className="live-tag">
                  <span className="live-dot"></span> LIVE
                </span>
              </div>
              <span className="epoch-label">PIPELINE EPOCH: #{context.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>

          {/* Compact Circular Progress Meter */}
          <div className="circular-meter-box">
            <svg className="circular-meter-svg" viewBox="0 0 48 48">
              <circle className="meter-bg-track" cx="24" cy="24" fill="none" r="19" strokeWidth="3" />
              <circle
                className="meter-bar"
                cx="24"
                cy="24"
                fill="none"
                r="19"
                strokeDasharray="119.38"
                strokeDashoffset={119.38 * (1 - context.confidenceScore)}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="meter-percent">{(context.confidenceScore * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Interactive Radar Visual Core (Stitch Screen 02) */}
        <div className="radar-core-module">
          <div className="radar-orbit-stage">
            {/* Orbit 1: Outer dashed scanner */}
            <div className="radar-orbit-outer"></div>
            {/* Orbit 2: Cyan counter-rotation */}
            <div className="radar-orbit-mid">
              <div className="radar-satellite-cyan"></div>
            </div>
            {/* Orbit 3: Deep violet boundary */}
            <div className="radar-orbit-inner">
              <div className="radar-satellite-violet"></div>
            </div>
            {/* Center Nucleus */}
            <div className="radar-center-nucleus">
              <span className="material-symbols-outlined text-[16px] text-on-primary-container">
                scatter_plot
              </span>
            </div>
          </div>
          <div className="radar-core-caption">
            <span className="caption-title">Cross-Entropy Disambiguation</span>
            <span className="caption-subtitle">Grounding implicit multi-actor intent locally</span>
          </div>
        </div>
      </div>

      {/* Semantic Transformation Card (Stitch Screen 02) */}
      <div className="transformation-card">
        <div className="transformation-header">
          <span className="transformation-title">Semantic Transformation</span>
          <span className="engine-version-pill">Local Engine v1.0</span>
        </div>

        {/* Raw Human Signal */}
        <div className="signal-box raw-signal">
          <span className="material-symbols-outlined signal-icon">input</span>
          <div className="signal-content">
            <span className="signal-type">Raw Human Signal</span>
            <span className="signal-value">"{context.rawText}"</span>
          </div>
        </div>

        {/* Grounded Persona Synthesis */}
        <div className="signal-box grounded-signal">
          <span className="material-symbols-outlined signal-icon text-secondary">verified_user</span>
          <div className="signal-content">
            <span className="signal-type text-secondary">Grounded Persona & Scope</span>
            <span className="signal-value text-on-surface">
              {context.actor} requests deliverables for <strong>{context.purpose}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Adjust / Edit Toggle Bar */}
      <div className="adjust-entities-bar">
        <span className="adjust-label">Extracted Entities & Metadata</span>
        <button
          className={`adjust-toggle-btn ${isEditing ? 'active' : ''}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          <span className="material-symbols-outlined text-[14px]">
            {isEditing ? 'check' : 'edit'}
          </span>
          <span>{isEditing ? 'Save Changes' : 'Adjust Entities'}</span>
        </button>
      </div>

      {/* Core Entity Bento Matrix */}
      <div className="bento-grid">
        {/* Actor Card */}
        <div className="bento-card">
          <div className="bento-card-header">
            <span className="material-symbols-outlined text-primary text-[16px]">person</span>
            <span className="bento-card-type">Actor / Communicator</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              className="bento-edit-input"
              value={context.actor}
              onChange={(e) => onUpdateContext({ ...context, actor: e.target.value })}
            />
          ) : (
            <div className="bento-value text-primary">{context.actor}</div>
          )}
          <span className="bento-subtext">Originator requesting tasks</span>
        </div>

        {/* Purpose Card */}
        <div className="bento-card">
          <div className="bento-card-header">
            <span className="material-symbols-outlined text-secondary text-[16px]">target</span>
            <span className="bento-card-type">Purpose / Goal</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              className="bento-edit-input"
              value={context.purpose}
              onChange={(e) => onUpdateContext({ ...context, purpose: e.target.value })}
            />
          ) : (
            <div className="bento-value text-secondary">{context.purpose}</div>
          )}
          <span className="bento-subtext">{context.category} Domain</span>
        </div>
      </div>

      {/* Distinct Temporal Disambiguation */}
      <div className="temporal-matrix-card">
        <div className="temporal-matrix-header">
          <span className="temporal-matrix-title">Temporal Disambiguation</span>
          <span className="distinct-tag">Separated Models</span>
        </div>

        <div className="temporal-boxes-grid">
          {/* Event Timing */}
          <div className="temporal-box event-cell">
            <div className="cell-top">
              <span className="material-symbols-outlined text-tertiary text-[14px]">calendar_month</span>
              <span className="cell-label text-tertiary">Event Timing</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                className="bento-edit-input"
                placeholder="e.g. Tomorrow's project review"
                value={context.temporal.eventTiming || ''}
                onChange={(e) =>
                  onUpdateContext({
                    ...context,
                    temporal: { ...context.temporal, eventTiming: e.target.value },
                  })
                }
              />
            ) : (
              <div className="cell-value">{context.temporal.eventTiming || 'Unspecified'}</div>
            )}
            <span className="cell-caption">When the overarching milestone occurs</span>
          </div>

          {/* Task Deadline */}
          <div className="temporal-box deadline-cell">
            <div className="cell-top">
              <span className="material-symbols-outlined text-error text-[14px]">alarm</span>
              <span className="cell-label text-error">Task Deadline</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                className="bento-edit-input"
                placeholder="e.g. Before 5 PM"
                value={context.temporal.taskDeadline || ''}
                onChange={(e) =>
                  onUpdateContext({
                    ...context,
                    temporal: { ...context.temporal, taskDeadline: e.target.value },
                  })
                }
              />
            ) : (
              <div className="cell-value text-error">{context.temporal.taskDeadline || 'Unspecified'}</div>
            )}
            <span className="cell-caption">Hard cutoff for deliverables</span>
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="actions-matrix-card">
        <div className="actions-matrix-header">
          <div className="actions-title-wrap">
            <span className="material-symbols-outlined text-[16px] text-tertiary">checklist</span>
            <span className="actions-title">Extracted Action Deliverables ({context.actions.length})</span>
          </div>
          <span className="actions-hint">Imperative clauses parsed on-device</span>
        </div>

        <div className="actions-items-container">
          {context.actions.map((action, idx) => {
            const isDone = context.completedActions.includes(action);
            return (
              <div key={idx} className={`action-row-item ${isDone ? 'done' : ''}`}>
                <button
                  className={`action-checkbox ${isDone ? 'checked' : ''}`}
                  onClick={() => handleToggleAction(action)}
                >
                  {isDone && <span className="material-symbols-outlined text-[14px]">check</span>}
                </button>
                <span className="action-text">{action}</span>
                {isEditing && (
                  <button 
                    className="delete-action-btn" 
                    onClick={() => handleRemoveAction(idx)}
                    title="Remove action"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {isEditing && (
          <div className="add-action-inline">
            <input
              type="text"
              placeholder="Add another action item..."
              value={newActionText}
              onChange={(e) => setNewActionText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
            />
            <button className="add-action-btn" onClick={handleAddAction}>
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Add</span>
            </button>
          </div>
        )}
      </div>

      {/* Artifact Concepts */}
      <div className="artifacts-matrix-card">
        <div className="artifacts-header">
          <span className="material-symbols-outlined text-[16px] text-secondary">inventory_2</span>
          <span className="artifacts-title">Extracted Artifact Concepts</span>
        </div>
        <p className="artifacts-subtitle">Concepts directly parsed from conversation text:</p>

        <div className="artifact-pills-row">
          {context.artifacts.map((art, idx) => (
            <div key={idx} className="artifact-capsule">
              <span className="capsule-dot">●</span>
              <span>{art}</span>
            </div>
          ))}
        </div>

        {context.linkedArtifacts && context.linkedArtifacts.length > 0 && (
          <div className="linked-files-drawer">
            <span className="linked-drawer-title">Demo-Associated Concrete Files:</span>
            <div className="linked-drawer-list">
              {context.linkedArtifacts.map((file) => (
                <div key={file.id} className="linked-drawer-item">
                  <span className="file-code-name">{file.name}</span>
                  <span className="file-code-meta">({file.size}) ➔ fulfills <em>{file.conceptRef}</em></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Transitions */}
      <div className="analysis-actions-grid">
        <button
          className="stitch-btn secondary"
          onClick={() => onNavigate('graph')}
        >
          <span className="material-symbols-outlined text-[16px]">hub</span>
          <span>Inspect Semantic Graph</span>
        </button>
        <button
          className="stitch-btn primary"
          onClick={() => onNavigate('dossier')}
        >
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>Open Context Dossier</span>
        </button>
      </div>
    </div>
  );
};
