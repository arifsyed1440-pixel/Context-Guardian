import React from 'react';
import { ContextObject, ScreenType } from '../types/context';

interface HeaderProps {
  currentScreen: ScreenType;
  contexts: ContextObject[];
  activeContextId: string | null;
  onSelectContext: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  contexts,
  activeContextId,
  onSelectContext,
  onNavigate,
}) => {
  return (
    <header className="fixed-app-header">
      <div className="header-inner">
        {/* Brand Lockup */}
        <div className="brand-group" onClick={() => onNavigate('home')}>
          <img 
            src="/logo.svg" 
            alt="Context Guardian Logo" 
            className="brand-logo-img"
            onError={(e) => {
              // Fallback if SVG isn't loaded
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="brand-text-col">
            <div className="brand-title-row">
              <span className="brand-name">Context Guardian</span>
              <span className="live-pulse-container">
                <span className="live-pulse-ping"></span>
                <span className="live-pulse-dot"></span>
              </span>
            </div>
            <span className="brand-subtitle">
              {currentScreen === 'home' && 'Guardian Home'}
              {currentScreen === 'input' && 'Conversation Ingestion'}
              {currentScreen === 'capture' && 'Neural Capture'}
              {currentScreen === 'analysis' && 'Neural Decomposition'}
              {currentScreen === 'graph' && 'Semantic Map'}
              {currentScreen === 'dossier' && 'Dossier Detail'}
            </span>
          </div>
        </div>

        {/* Profile / Context Switcher */}
        <div className="header-right-actions">
          {contexts.length > 0 && currentScreen !== 'home' && (
            <select
              className="context-quick-select"
              value={activeContextId || ''}
              onChange={(e) => onSelectContext(e.target.value)}
            >
              {contexts.map((ctx) => (
                <option key={ctx.id} value={ctx.id}>
                  {ctx.actor}: {ctx.purpose}
                </option>
              ))}
            </select>
          )}

          <div 
            className="profile-avatar-wrapper"
            onClick={() => onNavigate('dossier')}
            title="Active Contact Profile"
          >
            <img
              src="/avatar-rahul.png"
              alt="Rahul Profile"
              className="profile-avatar-img"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
