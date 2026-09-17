import React from 'react';
import { Home, MessageSquarePlus, Image as ImageIcon, Cpu, Network, FileCheck } from 'lucide-react';
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
    { id: 'home' as ScreenType, label: 'Home', icon: Home, enabled: true },
    { id: 'input' as ScreenType, label: 'Input', icon: MessageSquarePlus, enabled: true },
    { id: 'capture' as ScreenType, label: 'Capture', icon: ImageIcon, enabled: true },
    { id: 'analysis' as ScreenType, label: 'Analysis', icon: Cpu, enabled: hasActiveContext },
    { id: 'graph' as ScreenType, label: 'Graph', icon: Network, enabled: hasActiveContext },
    { id: 'dossier' as ScreenType, label: 'Dossier', icon: FileCheck, enabled: hasActiveContext },
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-items-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              className={`nav-btn ${isActive ? 'active' : ''} ${!item.enabled ? 'disabled' : ''}`}
              onClick={() => item.enabled && onNavigate(item.id)}
              disabled={!item.enabled}
              title={item.enabled ? item.label : 'Select or extract a context first'}
            >
              <div className="nav-icon-wrapper">
                <Icon size={19} />
              </div>
              <span className="nav-label">{item.label}</span>
              {isActive && <span className="nav-indicator"></span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
