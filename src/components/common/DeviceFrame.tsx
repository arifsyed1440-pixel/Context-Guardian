import React from 'react';
import { ScreenType } from '../../types/context';

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  currentScreen: ScreenType;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  isMobileFrame,
  onToggleFrame,
  theme,
  onToggleTheme,
  currentScreen,
}) => {
  // Current time representation for realistic mobile status bar
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className={`app-root ${isMobileFrame ? 'has-device-frame' : 'full-viewport'}`} data-theme={theme}>
      {/* Top Preview Controls Bar */}
      <header className="preview-mode-bar" role="banner">
        <div className="preview-mode-info">
          <span className="prototype-pill">Stitch Lumina</span>
          <span className="mode-text">
            Context Guardian Mobile Prototype
            <span className="screen-tag">• {currentScreen.toUpperCase()}</span>
          </span>
        </div>

        <div className="preview-actions-group">
          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            className="viewport-toggle-btn theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Mobile Chassis Simulator / Responsive Full View Toggle */}
          <button
            type="button"
            className="viewport-toggle-btn"
            onClick={onToggleFrame}
            title={isMobileFrame ? 'Switch to Full Viewport' : 'Switch to Mobile Simulator Frame'}
            aria-label={isMobileFrame ? 'Switch to Full Viewport' : 'Switch to Mobile Simulator Frame'}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isMobileFrame ? 'desktop_windows' : 'smartphone'}
            </span>
            <span>{isMobileFrame ? 'Full View' : 'Mobile 390px'}</span>
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Device Simulator Chassis */}
      <div className="device-viewport-container">
        <div className="mobile-chassis">
          {/* Chassis Speaker & Dynamic Island / Camera slot */}
          <div className="chassis-notch-bar">
            <div className="chassis-dynamic-island">
              <div className="island-lens"></div>
              <div className="island-sensor"></div>
            </div>
            <div className="chassis-speaker"></div>
          </div>

          {/* Mobile Status Bar (Carrier, Time, Battery) */}
          {isMobileFrame && (
            <div className="mobile-status-bar" aria-hidden="true">
              <span className="status-time">{currentTime}</span>
              <div className="status-icons">
                <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
                <span className="material-symbols-outlined text-[13px]">wifi</span>
                <span className="material-symbols-outlined text-[14px]">battery_full</span>
              </div>
            </div>
          )}

          {/* Inner Screen Viewport */}
          <div className="screen-viewport">
            {children}
          </div>

          {/* Chassis Home Indicator Bar */}
          <div className="chassis-home-bar" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
};

export default DeviceFrame;
