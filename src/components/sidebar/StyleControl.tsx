import type { StyleControlDef } from '../../theme/controlGroups';
import { convertSizeUnit, parseSize, type SizeUnit } from '../../utils/sizeUnits';

type Props = {
  def: StyleControlDef;
  value: string;
  baseFontSizePx: number;
  onChange: (value: string) => void;
};

const SIZE_UNITS: SizeUnit[] = ['px', 'rem', 'em', '%'];

function toHex6(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    const [, r, g, b] = color.match(/^#(.)(.)(.)$/)!;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return '#000000';
}

export function StyleControl({ def, value, baseFontSizePx, onChange }: Props) {
  if (def.type === 'color') {
    const hex = toHex6(value.startsWith('#') ? value : '#000000');
    return (
      <div className="control-row">
        <label>{def.label}</label>
        <div className="control-input-row">
          <input
            type="color"
            value={hex}
            onChange={(e) => onChange(e.target.value)}
            aria-label={def.label}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${def.label} value`}
          />
        </div>
      </div>
    );
  }

  if (def.type === 'select' && def.options) {
    return (
      <div className="control-row">
        <label>{def.label}</label>
        <div className="control-input-row">
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            {def.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  if (def.type === 'size') {
    const { num, unit } = parseSize(value);
    const isRootFontSize = def.key === '--md-font-size';

    const handleUnitChange = (nextUnit: SizeUnit) => {
      const converted = convertSizeUnit(value, unit, nextUnit, {
        basePx: baseFontSizePx,
        isRootFontSize,
      });
      onChange(converted);
    };

    return (
      <div className="control-row">
        <label>{def.label}</label>
        <div className="control-input-row">
          <input
            type="number"
            value={num}
            step="any"
            onChange={(e) => onChange(`${e.target.value}${unit}`)}
            aria-label={def.label}
          />
          <select
            value={unit}
            onChange={(e) => handleUnitChange(e.target.value as SizeUnit)}
            aria-label={`${def.label} unit`}
          >
            {SIZE_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="control-row">
      <label>{def.label}</label>
      <div className="control-input-row">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={def.label}
        />
      </div>
    </div>
  );
}
