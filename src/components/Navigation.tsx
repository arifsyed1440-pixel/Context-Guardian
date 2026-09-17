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
  const navItems = [
    { id: 'home' as ScreenType, label: 'Home', icon: 'home', enabled: true },
    { id: 'capture' as ScreenType, label: 'Capture', icon: 'document_scanner', enabled: true },
    { id: 'input' as ScreenType, label: 'Text', icon: 'chat_bubble', enabled: true },
    { id: 'analysis' as ScreenType, label: 'Analysis', icon: 'psychology', enabled: hasActiveContext },
    { id: 'graph' as ScreenType, label: 'Graph', icon: 'hub', enabled: hasActiveContext },
    { id: 'dossier' as ScreenType, label: 'Dossier', icon: 'verified', enabled: hasActiveContext },
  ];

  return (
    <nav className="stitch-bottom-nav">
      <div className="nav-bar-dock">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              className={`stitch-nav-item ${isActive ? 'active' : ''} ${!item.enabled ? 'disabled' : ''}`}
              onClick={() => item.enabled && onNavigate(item.id)}
              disabled={!item.enabled}
              title={item.enabled ? item.label : 'Select or extract a context first'}
            >
              <div className="icon-halo">
                <span className="material-symbols-outlined nav-icon">{item.icon}</span>
              </div>
              <span className="nav-label">{item.label}</span>
              {isActive && <span className="active-dot"></span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
