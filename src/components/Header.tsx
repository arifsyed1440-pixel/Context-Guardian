import React from 'react';
import { Shield, Sparkles, Database } from 'lucide-react';
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
    <header className="app-header">
      <div className="header-top">
        <div className="brand-lockup" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-badge">
            <Shield className="logo-icon" size={20} />
            <Sparkles className="logo-sparkle" size={12} />
          </div>
          <div>
            <h1 className="brand-title">Context Guardian</h1>
            <p className="brand-subtitle">On-Device Context Recovery Engine</p>
          </div>
        </div>

        <div className="engine-badge" title="Running locally via rule-based heuristic extraction">
          <span className="pulse-dot"></span>
          <span>Local Engine</span>
        </div>
      </div>

      {contexts.length > 0 && currentScreen !== 'home' && currentScreen !== 'capture' && (
        <div className="context-selector-bar">
          <div className="selector-label">
            <Database size={13} />
            <span>Active Context:</span>
          </div>
          <select
            className="context-dropdown"
            value={activeContextId || ''}
            onChange={(e) => onSelectContext(e.target.value)}
          >
            {contexts.map((ctx) => (
              <option key={ctx.id} value={ctx.id}>
                {ctx.actor}: {ctx.purpose} ({ctx.category})
              </option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
};
