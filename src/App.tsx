import { useEffect, useState } from 'react';
import { decodeSpecShareUrl } from './theme/schema';
import { SpecPage } from './components/spec/SpecPage';
import { WorkArea } from './components/workarea/WorkArea';
import { ArticlePreview } from './components/preview/ArticlePreview';
import { AppProvider, useAppState } from './store/appState';
import './styles/app.css';
import './styles/markdown-theme.css';

function useLocationHash(): string {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash;
}

function Toast() {
  const { state } = useAppState();
  if (!state.toast) return null;
  return <div className="toast">{state.toast}</div>;
}

function AppContent() {
  return (
    <div className="app-shell">
      <WorkArea />
      <ArticlePreview />
      <Toast />
    </div>
  );
}

function EditorApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default function App() {
  const hash = useLocationHash();
  const specPayload = decodeSpecShareUrl(hash);
  if (specPayload) {
    return <SpecPage payload={specPayload} />;
  }
  return <EditorApp />;
}
