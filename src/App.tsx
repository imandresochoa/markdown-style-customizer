import { decodeSpecShareUrl } from './theme/schema';
import { SpecPage } from './components/spec/SpecPage';
import { WorkArea } from './components/workarea/WorkArea';
import { ArticlePreview } from './components/preview/ArticlePreview';
import { AppProvider, useAppState } from './store/appState';
import './styles/app.css';
import './styles/markdown-theme.css';

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
  const specPayload = decodeSpecShareUrl(window.location.hash);
  if (specPayload) {
    return <SpecPage payload={specPayload} />;
  }
  return <EditorApp />;
}
