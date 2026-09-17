import React, { useState } from 'react';
import { ContextObject, ScreenType } from '../../types/context';
import { INITIAL_DEMO_CONTEXTS } from '../../services/storageService';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showComparison, setShowComparison] = useState(true);

  // Active spotlight context (defaults to Rahul's review, or first available, or seeded demo context)
  const spotlightContext =
    contexts.find((c) => c.id === 'demo-rahul-review') ||
    contexts[0] ||
    INITIAL_DEMO_CONTEXTS[0];

  const filteredContexts = searchQuery.trim()
    ? contexts.filter(
        (c) =>
          (c.actor || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.purpose || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.actions || []).some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : contexts;

  const totalActions = contexts.reduce((sum, c) => sum + (c.actions?.length || 0), 0);
  const completedActions = contexts.reduce((sum, c) => sum + (c.completedActions?.length || 0), 0);

  return (
    <div className="screen-inner-container home-stitch-screen">
      {/* Ambient Radial Highlights */}
      <div className="ambient-glows-wrap">
        <div className="ambient-glow top-left"></div>
        <div className="ambient-glow top-right"></div>
      </div>

      {/* Greeting & Time Context Section */}
      <div className="greeting-section">
        <div className="greeting-text-col">
          <div className="greeting-title-row">
            <span className="greeting-heading">Good evening, Alex</span>
            <span className="sparkle-symbol">✦</span>
          </div>
          <div className="greeting-subtitle-row">
            <span className="material-symbols-outlined text-tertiary">check_circle</span>
            <p className="greeting-subtext">
              Reconstructed <span className="highlight-tertiary">{contexts.length} active context threads</span> ({completedActions}/{totalActions} deliverables resolved)
            </p>
          </div>
        </div>

        {/* Quick Neural Radar Status */}
        <div className="radar-status-orb" title="Continuous local semantic surveillance">
          <svg className="radar-circular-svg" viewBox="0 0 36 36">
            <circle className="radar-track" cx="18" cy="18" fill="none" r="14" strokeWidth="2.5" />
            <circle
              className="radar-indicator"
              cx="18"
              cy="18"
              fill="none"
              r="14"
              strokeDasharray="88"
              strokeDashoffset="18"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
          </svg>
          <span className="material-symbols-outlined radar-icon">radar</span>
        </div>
      </div>

      {/* Search / Query Bar */}
      <div className="search-pill-container">
        <div className="search-pill-glow"></div>
        <div className="search-pill-inner">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="search-input"
            placeholder="Ask anything across your conversations or files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-adornments">
            <kbd className="shortcut-kbd">⌘K</kbd>
            <button 
              className="mic-btn" 
              type="button" 
              onClick={() => onNavigate('input')}
              title="Enter new conversation"
            >
              <span className="material-symbols-outlined">mic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ambient Micro-Action: Silent Context Vigilance */}
      <div className="vigilance-banner">
        <div className="vigilance-status-row">
          <span className="live-pulse-container">
            <span className="live-pulse-ping"></span>
            <span className="live-pulse-dot"></span>
          </span>
          <span className="vigilance-text">Silent Context Vigilance: Active</span>
        </div>
        <div className="vigilance-actions-row">
          <button 
            className="instant-scan-btn secondary" 
            onClick={() => onNavigate('input')}
            title="Type or paste conversation text"
          >
            <span className="material-symbols-outlined text-[14px]">chat</span>
            <span>Text</span>
          </button>
          <button 
            className="instant-scan-btn primary" 
            onClick={() => onNavigate('capture')}
            title="Upload or scan chat screenshot"
          >
            <span className="material-symbols-outlined text-[14px]">document_scanner</span>
            <span>OCR</span>
          </button>
        </div>
      </div>

      {/* Live Hero Card / Spotlight Protocol */}
      {spotlightContext && (
        <div className="spotlight-card">
          {/* Decorative Radar Rings */}
          <div className="spotlight-radar-decor">
            <div className="radar-outer-ring">
              <div className="radar-inner-ring">
                <div className="radar-pulse-core"></div>
              </div>
            </div>
          </div>

          <div className="spotlight-content-wrap">
            {/* Spotlight Header */}
            <div className="spotlight-tag-row">
              <div className="spotlight-protocol-pill">
                <span className="material-symbols-outlined text-[13px]">sensors</span>
                <span className="protocol-label">Spotlight Protocol</span>
              </div>
              <span className="spotlight-time-tag">
                {spotlightContext.temporal?.taskDeadline || 'Tomorrow, 5:00 PM'}
              </span>
            </div>

            {/* Spotlight Title & Description */}
            <div className="spotlight-title-group">
              <h3 className="spotlight-title">Upcoming Review with {spotlightContext.actor || 'Rahul'}</h3>
              <p className="spotlight-desc">
                High-fidelity context reconstructed from conversation snippet. {(spotlightContext.actions || []).length} action items and {(spotlightContext.artifacts || []).length} referenced artifacts indexed.
              </p>
            </div>

            {/* Key Insights Sub-Pill */}
            <div className="spotlight-readiness-pill">
              <div className="readiness-icon-box">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div className="readiness-text-col">
                <span className="readiness-title">Context Readiness</span>
                <span className="readiness-coherence">
                  {((spotlightContext.confidenceScore ?? 0.96) * 100).toFixed(0)}% Coherence Verified
                </span>
              </div>
              <div className="readiness-counter">
                {(spotlightContext.completedActions || []).length}/{(spotlightContext.actions || []).length} Tasks
              </div>
            </div>

            {/* Action Buttons */}
            <div className="spotlight-cta-grid">
              <button
                className="spotlight-btn secondary"
                onClick={() => {
                  onSelectContext(spotlightContext.id);
                  onNavigate('graph');
                }}
              >
                <span className="material-symbols-outlined text-[16px]">hub</span>
                <span>Inspect Graph</span>
              </button>
              <button
                className="spotlight-btn primary"
                onClick={() => {
                  onSelectContext(spotlightContext.id);
                  onNavigate('dossier');
                }}
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Open Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Traditional vs Context Guardian Contrast Card (Stitch Screen 07) */}
      <div className="contrast-module-card">
        <div 
          className="contrast-header-toggle"
          onClick={() => setShowComparison(!showComparison)}
        >
          <div className="contrast-header-left">
            <span className="material-symbols-outlined text-secondary">compare_arrows</span>
            <span className="contrast-heading">Traditional Reminder vs Context Guardian</span>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px]">
            {showComparison ? 'expand_less' : 'expand_more'}
          </span>
        </div>

        {showComparison && (
          <div className="contrast-body">
            {/* The Dull Item */}
            <div className="status-quo-box">
              <div className="status-quo-header">
                <span className="status-quo-tag">Flat Reminder App</span>
                <span className="blind-spots-badge">5 Blind Spots</span>
              </div>
              <div className="status-quo-quote">
                <span className="material-symbols-outlined text-outline">check_box_outline_blank</span>
                <span className="flat-text">"Bring prototype" (Tomorrow 5:00 PM)</span>
              </div>
              <ul className="blind-spots-list">
                <li><span className="cross">✕</span> Who explicitly asked for this?</li>
                <li><span className="cross">✕</span> Which iteration (Figma, Web, or Expo)?</li>
                <li><span className="cross">✕</span> Which meeting does this feed into?</li>
                <li><span className="cross">✕</span> Where are the referenced files stored?</li>
              </ul>
              <div className="penalty-tag">
                <span className="material-symbols-outlined text-[13px]">timer</span>
                <span>+18-25 min wasted searching chat threads</span>
              </div>
            </div>

            {/* The Guardian Solution */}
            <div className="guardian-solution-box">
              <div className="guardian-solution-header">
                <span className="guardian-solution-tag">Context Guardian</span>
                <span className="coherence-badge">Synthesized Memory</span>
              </div>
              <div className="guardian-quote-body">
                {spotlightContext ? (
                  `"${spotlightContext.actor} asked you to ${(spotlightContext.actions || []).join(' and ').toLowerCase()} for ${spotlightContext.temporal?.eventTiming?.toLowerCase() || 'review'} (${spotlightContext.temporal?.taskDeadline?.toLowerCase() || 'before 5 PM'})."`
                ) : (
                  '"Rahul asked you to bring latest prototype and update architecture slides for tomorrow\'s project review (before 5 PM)."'
                )}
              </div>
              <div className="guardian-features-row">
                <span className="feature-chip">✓ Actor Grounded</span>
                <span className="feature-chip">✓ Files Linked</span>
                <span className="feature-chip">✓ Semantic Graph</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recovered Context Threads List */}
      <div className="threads-section">
        <div className="threads-header-row">
          <h3 className="threads-title">Active Context Threads ({filteredContexts.length})</h3>
          <span className="threads-subtitle">Single Source of Truth</span>
        </div>

        <div className="threads-list">
          {filteredContexts.length === 0 ? (
            <div className="no-threads-box" style={{ padding: '32px 16px', textAlign: 'center', color: '#a0a5ad' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#68727d', marginBottom: '8px', display: 'block' }}>inventory_2</span>
              <p style={{ margin: 0, fontSize: '13px' }}>No context threads found.</p>
            </div>
          ) : (
            filteredContexts.map((ctx) => {
              const isSelected = ctx.id === activeContextId;
              const actionsCount = ctx.actions?.length || 0;
              const completedCount = ctx.completedActions?.length || 0;
              const progress = actionsCount > 0 
                ? Math.round((completedCount / actionsCount) * 100) 
                : 0;

              return (
                <div 
                  key={ctx.id} 
                  className={`thread-card ${isSelected ? 'selected-glow' : ''}`}
                  onClick={() => onSelectContext(ctx.id)}
                >
                  <div className="thread-top-line">
                    <div className="actor-profile-tag">
                      <span className="actor-avatar-circle">
                        {(ctx.actor || '?').charAt(0)}
                      </span>
                      <span className="actor-name">{ctx.actor || 'Unknown'}</span>
                    </div>

                    <div className="thread-badges-right">
                      <span className="category-pill-tag">{ctx.category || 'General'}</span>
                      <button 
                        className="delete-thread-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteContext(ctx.id);
                        }}
                        title="Delete thread"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="thread-purpose">{ctx.purpose}</h4>

                  {/* Distinct Temporal Information */}
                  <div className="temporal-chips-container">
                    {ctx.temporal?.eventTiming && (
                      <div className="temporal-chip event">
                        <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                        <span>{ctx.temporal.eventTiming}</span>
                      </div>
                    )}
                    {ctx.temporal?.taskDeadline && (
                      <div className="temporal-chip deadline">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        <span>Due: {ctx.temporal.taskDeadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Progress */}
                  <div className="thread-progress-wrapper">
                    <div className="thread-progress-labels">
                      <span className="progress-task-count">
                        {completedCount} of {actionsCount} deliverables resolved
                      </span>
                      <span className="progress-percentage">{progress}%</span>
                    </div>
                    <div className="thread-progress-track">
                      <div 
                        className="thread-progress-bar"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Controls */}
                  <div className="thread-footer-actions">
                    <button
                      className="thread-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectContext(ctx.id);
                        onNavigate('graph');
                      }}
                    >
                      <span className="material-symbols-outlined text-[14px]">hub</span>
                      <span>Graph</span>
                    </button>
                    <button
                      className="thread-action-btn primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectContext(ctx.id);
                        onNavigate('dossier');
                      }}
                    >
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>Dossier</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
