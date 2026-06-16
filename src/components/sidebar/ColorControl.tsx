type Props = {
  label: string;
  value: string;
  fallback: string;
  swatches: string[];
  onChange: (color: string) => void;
};

function toHex6(color: string, fallback: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    const [, r, g, b] = color.match(/^#(.)(.)(.)$/)!;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return fallback;
}

export function ColorControl({ label, value, fallback, swatches, onChange }: Props) {
  const hex = toHex6(value, fallback);

  return (
    <div className="color-control">
      <span className="color-control-name">{label}</span>
      <div className="color-control-input">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label}: selector de color`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label}: valor`}
        />
      </div>
      <div className="color-control-swatches">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className={`color-swatch${hex.toLowerCase() === swatch.toLowerCase() ? ' color-swatch--active' : ''}`}
            style={{ backgroundColor: swatch }}
            onClick={() => onChange(swatch)}
            aria-label={`${label}: usar ${swatch}`}
            title={swatch}
          />
        ))}
      </div>
    </div>
  );
}
