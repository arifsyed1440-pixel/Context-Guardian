import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Calendar, 
  Clock, 
  ListTodo, 
  Package, 
  Sparkles, 
  CheckCircle, 
  Network, 
  FileCheck, 
  Edit3, 
  Check, 
  Plus, 
  Trash
} from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newActionInput, setNewActionInput] = useState<string>('');

  if (!context) {
    return (
      <div className="screen-container empty-state">
        <Sparkles size={36} className="empty-icon" />
        <h3>No Active Context to Analyze</h3>
        <p>Input a conversation or scan a screenshot to extract context.</p>
        <button className="cta-primary-btn" onClick={() => onNavigate('input')}>
          Go to Input
        </button>
      </div>
    );
  }

  const handleToggleActionDone = (actionText: string) => {
    const isCompleted = context.completedActions.includes(actionText);
    const updatedCompleted = isCompleted
      ? context.completedActions.filter((a) => a !== actionText)
      : [...context.completedActions, actionText];

    onUpdateContext({
      ...context,
      completedActions: updatedCompleted,
    });
  };

  const handleAddAction = () => {
    if (!newActionInput.trim()) return;
    onUpdateContext({
      ...context,
      actions: [...context.actions, newActionInput.trim()],
    });
    setNewActionInput('');
  };

  const handleRemoveAction = (index: number) => {
    const updatedActions = context.actions.filter((_, idx) => idx !== index);
    onUpdateContext({
      ...context,
      actions: updatedActions,
    });
  };

  return (
    <div className="screen-container analysis-screen">
      {/* Header Bar */}
      <div className="analysis-header-card">
        <div className="analysis-status-row">
          <div className="status-pill success">
            <CheckCircle size={13} />
            <span>Context Extracted Successfully</span>
          </div>
          <div className="confidence-pill" title="Local rule-based heuristic confidence">
            <Sparkles size={12} />
            <span>{(context.confidenceScore * 100).toFixed(0)}% Confidence</span>
          </div>
        </div>

        <h2 className="analysis-title">Extracted Semantic Entities</h2>
        <p className="analysis-subtitle">
          Recovered personal context parsed by the Local Context Extraction Engine.
        </p>

        <div className="analysis-edit-toggle">
          <button 
            className={`toggle-edit-btn ${isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
            <span>{isEditing ? 'Done Editing' : 'Adjust Entities'}</span>
          </button>
        </div>
      </div>

      {/* Raw Original Quote */}
      <div className="raw-quote-card">
        <div className="quote-label">Original Fragmented Input</div>
        <blockquote className="quote-body">"{context.rawText}"</blockquote>
      </div>

      {/* Primary Entities Grid */}
      <div className="entities-grid">
        {/* Actor Card */}
        <div className="entity-card">
          <div className="entity-header">
            <User size={16} className="entity-icon actor-icon" />
            <span className="entity-type">Actor / Originator</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              className="entity-edit-input"
              value={context.actor}
              onChange={(e) => onUpdateContext({ ...context, actor: e.target.value })}
            />
          ) : (
            <div className="entity-value highlight-actor">{context.actor}</div>
          )}
          <span className="entity-subtext">Communicator requesting the actions</span>
        </div>

        {/* Purpose Card */}
        <div className="entity-card">
          <div className="entity-header">
            <Target size={16} className="entity-icon purpose-icon" />
            <span className="entity-type">Purpose / Intent</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              className="entity-edit-input"
              value={context.purpose}
              onChange={(e) => onUpdateContext({ ...context, purpose: e.target.value })}
            />
          ) : (
            <div className="entity-value highlight-purpose">{context.purpose}</div>
          )}
          <span className="entity-subtext">Core initiative or meeting theme</span>
        </div>
      </div>

      {/* Distinct Temporal Information */}
      <div className="temporal-section-card">
        <div className="temporal-section-header">
          <h4 className="temporal-title">Temporal Information (Disambiguated)</h4>
          <span className="temporal-badge">Distinct Models</span>
        </div>

        <div className="temporal-split-grid">
          {/* Event Timing */}
          <div className="temporal-box event-box">
            <div className="temporal-box-label">
              <Calendar size={14} />
              <span>Event Timing</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                className="entity-edit-input"
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
              <div className="temporal-box-value">
                {context.temporal.eventTiming || 'Not specified in conversation'}
              </div>
            )}
            <span className="temporal-box-hint">When the overarching event takes place</span>
          </div>

          {/* Task Deadline */}
          <div className="temporal-box deadline-box">
            <div className="temporal-box-label">
              <Clock size={14} />
              <span>Task Deadline</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                className="entity-edit-input"
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
              <div className="temporal-box-value">
                {context.temporal.taskDeadline || 'Not specified in conversation'}
              </div>
            )}
            <span className="temporal-box-hint">Cutoff time for required deliverables</span>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="actions-section-card">
        <div className="actions-section-header">
          <div className="actions-title-wrap">
            <ListTodo size={16} className="entity-icon" />
            <h4 className="actions-title">Extracted Actions ({context.actions.length})</h4>
          </div>
          <span className="actions-subtext">Imperative statements parsed from text</span>
        </div>

        <div className="actions-list">
          {context.actions.map((action, idx) => {
            const isDone = context.completedActions.includes(action);
            return (
              <div key={idx} className={`action-item-row ${isDone ? 'done' : ''}`}>
                <button
                  className={`action-check-btn ${isDone ? 'checked' : ''}`}
                  onClick={() => handleToggleActionDone(action)}
                >
                  {isDone && <Check size={13} />}
                </button>
                <span className="action-item-text">{action}</span>
                {isEditing && (
                  <button
                    className="action-delete-btn"
                    onClick={() => handleRemoveAction(idx)}
                    title="Remove action"
                  >
                    <Trash size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {isEditing && (
          <div className="add-action-bar">
            <input
              type="text"
              placeholder="Add another action item..."
              value={newActionInput}
              onChange={(e) => setNewActionInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
            />
            <button className="add-action-btn" onClick={handleAddAction}>
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>
        )}
      </div>

      {/* Extracted Artifact Concepts */}
      <div className="artifacts-section-card">
        <div className="artifacts-header">
          <Package size={16} className="entity-icon" />
          <h4 className="artifacts-title">Referenced Artifact Concepts</h4>
        </div>
        <p className="artifacts-hint">
          Directly parsed from sentence terms (no fake filenames created):
        </p>

        <div className="artifact-concepts-tags">
          {context.artifacts.map((art, idx) => (
            <div key={idx} className="artifact-concept-badge">
              <span className="concept-bullet">●</span>
              <span>{art}</span>
            </div>
          ))}
        </div>

        {/* Demo-Linked Concrete Files */}
        {context.linkedArtifacts && context.linkedArtifacts.length > 0 && (
          <div className="linked-files-preview">
            <div className="linked-files-header">
              <span>Demo-Associated Files Linked to Concepts:</span>
            </div>
            <div className="linked-files-list">
              {context.linkedArtifacts.map((file) => (
                <div key={file.id} className="linked-file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-meta">
                    ({file.size}) ➔ tied to <em>{file.conceptRef}</em>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary Transition CTAs */}
      <div className="analysis-navigation-footer">
        <button 
          className="nav-cta-btn secondary"
          onClick={() => onNavigate('graph')}
        >
          <Network size={16} />
          <span>Inspect Context Graph</span>
        </button>
        <button 
          className="nav-cta-btn primary"
          onClick={() => onNavigate('dossier')}
        >
          <FileCheck size={16} />
          <span>Open Context Dossier</span>
        </button>
      </div>
    </div>
  );
};
