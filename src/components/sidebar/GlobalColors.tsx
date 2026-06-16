import { useAppState } from '../../store/appState';
import { ColorControl } from './ColorControl';

const INK_FALLBACK = '#1a202c';
const ACCENT_FALLBACK = '#2563eb';

const INK_SWATCHES = [
  '#1a202c',
  '#111827',
  '#000000',
  '#334155',
  '#3f3f46',
  '#44403c',
  '#1e3a5f',
  '#3b2f2f',
];

const ACCENT_SWATCHES = [
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#dc2626',
  '#ea580c',
  '#16a34a',
  '#0d9488',
  '#0f172a',
];

export function GlobalColors() {
  const { state, dispatch } = useAppState();
  const ink = state.theme['--md-ink'] ?? INK_FALLBACK;
  const accent = state.theme['--md-accent'] ?? ACCENT_FALLBACK;

  return (
    <section className="global-colors" aria-label="Colores globales">
      <div className="global-colors-grid">
        <ColorControl
          label="Texto"
          value={ink}
          fallback={INK_FALLBACK}
          swatches={INK_SWATCHES}
          onChange={(color) => dispatch({ type: 'SET_INK', color })}
        />
        <ColorControl
          label="Acento"
          value={accent}
          fallback={ACCENT_FALLBACK}
          swatches={ACCENT_SWATCHES}
          onChange={(color) => dispatch({ type: 'SET_ACCENT', color })}
        />
      </div>
      <p className="global-colors-help">
        El texto se aplica a párrafos, títulos y listas; el acento a enlaces,
        código, tablas y citas. Puedes ajustar cualquier elemento por separado después.
      </p>
    </section>
  );
}
