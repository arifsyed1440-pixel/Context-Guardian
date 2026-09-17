import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquarePlus, 
  Network, 
  FileCheck, 
  Package, 
  User,
  Trash2
} from 'lucide-react';
import { ContextObject, ScreenType } from '../../types/context';

interface HomeScreenProps {
  contexts: ContextObject[];
  activeContextId: string | null;
  onSelectContext: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onDeleteContext: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  contexts,
  activeContextId,
  onSelectContext,
  onNavigate,
  onDeleteContext,
}) => {
  // Aggregate stats from the single source of truth
  const totalContexts = contexts.length;
  const totalActions = contexts.reduce((sum, c) => sum + c.actions.length, 0);
  const completedActions = contexts.reduce((sum, c) => sum + c.completedActions.length, 0);
  const pendingActions = totalActions - completedActions;

  return (
    <div className="screen-container home-screen">
      {/* Hero Mission Card */}
      <div className="mission-card">
        <div className="mission-badge">
          <Sparkles size={14} />
          <span>Context Recovery</span>
        </div>
        <h2 className="mission-title">
          Never lose the <em>why</em> behind your tasks.
        </h2>
        <p className="mission-desc">
          Instead of flat reminders, Context Guardian reconstructs the originator, purpose, event timing, and referenced artifacts from fragmented conversations.
        </p>

        <div className="quick-actions-row">
          <button 
            className="cta-primary-btn" 
            onClick={() => onNavigate('input')}
          >
            <MessageSquarePlus size={16} />
            <span>Process New Message</span>
          </button>
          <button 
            className="cta-secondary-btn" 
            onClick={() => onNavigate('capture')}
          >
            <span>Scan Screenshot</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-num">{totalContexts}</span>
          <span className="stat-label">Active Contexts</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{pendingActions}</span>
          <span className="stat-label">Pending Actions</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{completedActions}</span>
          <span className="stat-label">Resolved Items</span>
        </div>
      </div>

      {/* Context List Header */}
      <div className="section-header">
        <h3 className="section-title">Recovered Contexts ({contexts.length})</h3>
        <span className="section-meta">Single Source of Truth</span>
      </div>

      {/* Context Cards */}
      <div className="context-card-list">
        {contexts.map((ctx) => {
          const isActive = ctx.id === activeContextId;
          const isFinished = ctx.actions.length > 0 && ctx.completedActions.length === ctx.actions.length;

          return (
            <div 
              key={ctx.id} 
              className={`context-card ${isActive ? 'active-selection' : ''}`}
            >
              <div className="card-top-row">
                <div className="actor-badge">
                  <User size={13} />
                  <span>{ctx.actor}</span>
                </div>
                <div className="category-pill">{ctx.category}</div>
                <button
                  className="card-delete-btn"
                  title="Remove context"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteContext(ctx.id);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h4 className="context-purpose-title">{ctx.purpose}</h4>

              {/* Distinct Temporal Information */}
              <div className="temporal-chips-wrap">
                {ctx.temporal.eventTiming && (
                  <div className="temporal-chip event">
                    <Calendar size={12} />
                    <span>Event: {ctx.temporal.eventTiming}</span>
                  </div>
                )}
                {ctx.temporal.taskDeadline && (
                  <div className="temporal-chip deadline">
                    <Clock size={12} />
                    <span>Due: {ctx.temporal.taskDeadline}</span>
                  </div>
                )}
              </div>

              {/* Action Progress Summary */}
              <div className="action-progress-bar-wrap">
                <div className="progress-info">
                  <span className="progress-label">
                    <CheckCircle2 size={12} />
                    {ctx.completedActions.length} of {ctx.actions.length} actions complete
                  </span>
                  <span className="progress-percent">
                    {ctx.actions.length > 0
                      ? Math.round((ctx.completedActions.length / ctx.actions.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="progress-track">
                  <div 
                    className={`progress-fill ${isFinished ? 'complete' : ''}`}
                    style={{
                      width: `${ctx.actions.length > 0 ? (ctx.completedActions.length / ctx.actions.length) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              {/* Artifact Concepts */}
              {ctx.artifacts.length > 0 && (
                <div className="artifact-concepts-row">
                  <Package size={12} className="artifact-icon" />
                  <div className="artifact-tags">
                    {ctx.artifacts.map((art, idx) => (
                      <span key={idx} className="artifact-tag">{art}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Action CTAs */}
              <div className="card-actions-footer">
                <button
                  className="card-btn secondary"
                  onClick={() => {
                    onSelectContext(ctx.id);
                    onNavigate('graph');
                  }}
                >
                  <Network size={14} />
                  <span>Graph</span>
                </button>
                <button
                  className="card-btn primary"
                  onClick={() => {
                    onSelectContext(ctx.id);
                    onNavigate('dossier');
                  }}
                >
                  <FileCheck size={14} />
                  <span>Dossier</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
