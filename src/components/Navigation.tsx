import React from 'react';
import { ScreenType } from '../types/context';

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  hasActiveContext: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  hasActiveContext,
}) => {
  // Intuitive streamlined 4-tab mobile navigation matching Goal 9
  const navItems = [
    { id: 'home' as ScreenType, label: 'Home', icon: 'auto_awesome', enabled: true },
    { id: 'capture' as ScreenType, label: 'Capture', icon: 'document_scanner', enabled: true },
    { id: 'graph' as ScreenType, label: 'Graph', icon: 'hub', enabled: hasActiveContext },
    { id: 'dossier' as ScreenType, label: 'Dossier', icon: 'verified', enabled: hasActiveContext },
  ];

  return (
    <nav className="stitch-bottom-nav" role="navigation" aria-label="Main Navigation">
      <div className="nav-bar-dock" role="tablist">
        {navItems.map((item) => {
          // Highlight capture when on capture, input (text ingestion), or analysis
          const isActive =
            currentScreen === item.id ||
            (item.id === 'capture' && (currentScreen === 'input' || currentScreen === 'analysis'));

          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-label={item.label}
              className={`stitch-nav-item ${isActive ? 'active' : ''} ${!item.enabled ? 'disabled' : ''}`}
              onClick={() => item.enabled && onNavigate(item.id)}
              disabled={!item.enabled}
              title={item.enabled ? item.label : 'Select or extract a context first'}
              type="button"
            >
              <div className="icon-halo">
                <span className="material-symbols-outlined nav-icon">{item.icon}</span>
              </div>
              <span className="nav-label">{item.label}</span>
              {isActive && <span className="active-dot" aria-hidden="true"></span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
