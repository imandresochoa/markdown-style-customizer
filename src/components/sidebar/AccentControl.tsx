import { useAppState } from '../../store/appState';

const FALLBACK_ACCENT = '#2563eb';

const QUICK_SWATCHES = [
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#dc2626',
  '#ea580c',
  '#16a34a',
  '#0d9488',
  '#0f172a',
];

function toHex6(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    const [, r, g, b] = color.match(/^#(.)(.)(.)$/)!;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return FALLBACK_ACCENT;
}

export function AccentControl() {
  const { state, dispatch } = useAppState();
  const accent = state.theme['--md-accent'] ?? FALLBACK_ACCENT;
  const hex = toHex6(accent);

  const setAccent = (color: string) => dispatch({ type: 'SET_ACCENT', color });

  return (
    <div className="accent-control">
      <div className="accent-control-header">
        <label className="accent-control-label">Color de acento</label>
      </div>
      <div className="control-input-row">
        <input
          type="color"
          value={hex}
          onChange={(e) => setAccent(e.target.value)}
          aria-label="Color de acento"
        />
        <input
          type="text"
          value={accent}
          onChange={(e) => setAccent(e.target.value)}
          aria-label="Valor del color de acento"
        />
      </div>
      <div className="accent-swatches">
        {QUICK_SWATCHES.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className={`accent-swatch${toHex6(accent).toLowerCase() === swatch.toLowerCase() ? ' accent-swatch--active' : ''}`}
            style={{ backgroundColor: swatch }}
            onClick={() => setAccent(swatch)}
            aria-label={`Usar acento ${swatch}`}
            title={swatch}
          />
        ))}
      </div>
      <p className="accent-control-help">
        Aplica este color a enlaces, código, tablas, citas y más. Puedes ajustar
        cualquier color por separado después.
      </p>
    </div>
  );
}
