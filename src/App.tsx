import React, { useState, useEffect } from 'react';
import { 
  getStoredContexts, 
  saveContext, 
  deleteContext, 
  getActiveContextId, 
  setActiveContextId 
} from './services/storageService';
import { ContextObject, ScreenType } from './types/context';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/screens/HomeScreen';
import { CaptureScreen } from './components/screens/CaptureScreen';
import { ConversationInputScreen } from './components/screens/ConversationInputScreen';
import { ContextAnalysisScreen } from './components/screens/ContextAnalysisScreen';
import { ContextGraphScreen } from './components/screens/ContextGraphScreen';
import { ContextDossierScreen } from './components/screens/ContextDossierScreen';
import './App.css';

export const App: React.FC = () => {
  const [contexts, setContexts] = useState<ContextObject[]>(() => getStoredContexts());
  const [activeContextId, setActiveId] = useState<string | null>(() => {
    const storedActive = getActiveContextId();
    const initial = getStoredContexts();
    if (storedActive && initial.some((c) => c.id === storedActive)) {
      return storedActive;
    }
    return initial.length > 0 ? initial[0].id : null;
  });
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [isMobileWrapper, setIsMobileWrapper] = useState<boolean>(true);

  // Sync activeContextId to localStorage when changed
  useEffect(() => {
    if (activeContextId) {
      setActiveContextId(activeContextId);
    }
  }, [activeContextId]);

  const activeContext = contexts.find((c) => c.id === activeContextId) || contexts[0] || null;

  const handleSelectContext = (id: string) => {
    setActiveId(id);
    setActiveContextId(id);
  };

  const handleContextExtracted = (newContext: ContextObject) => {
    saveContext(newContext);
    setContexts((prev) => [newContext, ...prev.filter((c) => c.id !== newContext.id)]);
    setActiveId(newContext.id);
  };

  const handleUpdateContext = (updated: ContextObject) => {
    saveContext(updated);
    setContexts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteContext = (id: string) => {
    const remaining = deleteContext(id);
    setContexts(remaining);
    if (activeContextId === id) {
      const nextActive = remaining[0] ? remaining[0].id : null;
      setActiveId(nextActive);
      if (nextActive) setActiveContextId(nextActive);
    }
  };

  return (
    <div className={`app-root ${isMobileWrapper ? 'has-device-frame' : 'full-viewport'}`}>
      {/* Top Preview Bar (Mobile Simulator / Responsive Toggle) */}
      <div className="preview-mode-bar">
        <div className="preview-mode-info">
          <span className="prototype-pill">Stitch Lumina</span>
          <span className="mode-text">Context Guardian Mobile Prototype</span>
        </div>
        <button
          className="viewport-toggle-btn"
          onClick={() => setIsMobileWrapper(!isMobileWrapper)}
          title="Toggle Mobile Simulator / Full Layout"
        >
          <span className="material-symbols-outlined text-[15px]">
            {isMobileWrapper ? 'desktop_windows' : 'smartphone'}
          </span>
          <span>{isMobileWrapper ? 'Full View' : 'Mobile Frame'}</span>
        </button>
      </div>

      {/* Main Container / Mobile Device Simulator */}
      <div className="device-viewport-container">
        <div className="mobile-chassis">
          <div className="chassis-speaker"></div>

          {/* Core App View */}
          <div className="screen-viewport">
            <Header
              currentScreen={currentScreen}
              contexts={contexts}
              activeContextId={activeContextId}
              onSelectContext={handleSelectContext}
              onNavigate={setCurrentScreen}
            />

            <main className="main-content-area">
              {currentScreen === 'home' && (
                <HomeScreen
                  contexts={contexts}
                  activeContextId={activeContextId}
                  onSelectContext={handleSelectContext}
                  onNavigate={setCurrentScreen}
                  onDeleteContext={handleDeleteContext}
                />
              )}

              {currentScreen === 'capture' && (
                <CaptureScreen
                  onContextExtracted={handleContextExtracted}
                  onNavigate={setCurrentScreen}
                />
              )}

              {currentScreen === 'input' && (
                <ConversationInputScreen
                  onContextExtracted={handleContextExtracted}
                  onNavigate={setCurrentScreen}
                />
              )}

              {currentScreen === 'analysis' && (
                <ContextAnalysisScreen
                  context={activeContext}
                  onUpdateContext={handleUpdateContext}
                  onNavigate={setCurrentScreen}
                />
              )}

              {currentScreen === 'graph' && (
                <ContextGraphScreen
                  context={activeContext}
                  onNavigate={setCurrentScreen}
                />
              )}

              {currentScreen === 'dossier' && (
                <ContextDossierScreen
                  context={activeContext}
                  onUpdateContext={handleUpdateContext}
                  onNavigate={setCurrentScreen}
                />
              )}
            </main>

            <Navigation
              currentScreen={currentScreen}
              onNavigate={setCurrentScreen}
              hasActiveContext={!!activeContext}
            />
          </div>

          <div className="chassis-home-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
