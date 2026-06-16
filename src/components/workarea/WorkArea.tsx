import { useState } from 'react';
import { ThemeActions } from './ThemeActions';
import { StylePanel } from './StylePanel';
import { useAppState } from '../../store/appState';

type WorkTab = 'estilos' | 'documento';

export function WorkArea() {
  const { state } = useAppState();
  const [tab, setTab] = useState<WorkTab>('estilos');

  const [prevSelection, setPrevSelection] = useState(state.selectedSectionId);
  if (state.selectedSectionId && state.selectedSectionId !== prevSelection) {
    setPrevSelection(state.selectedSectionId);
    setTab('estilos');
  }

  return (
    <aside className="work-area">
      <div className="work-area-brand">Markdown Style Customizer</div>
      <div className="work-tabs" role="tablist" aria-label="Secciones del panel">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'estilos'}
          className={`work-tab${tab === 'estilos' ? ' work-tab--active' : ''}`}
          onClick={() => setTab('estilos')}
        >
          Estilos
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'documento'}
          className={`work-tab${tab === 'documento' ? ' work-tab--active' : ''}`}
          onClick={() => setTab('documento')}
        >
          Documento
        </button>
      </div>
      {tab === 'estilos' ? <StylePanel /> : <ThemeActions />}
    </aside>
  );
}
