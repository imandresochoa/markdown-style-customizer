import type { StyleControlDef } from '../../theme/controlGroups';
import { convertSizeUnit, parseSize, type SizeUnit } from '../../utils/sizeUnits';
import { FontPicker } from './FontPicker';

type Props = {
  def: StyleControlDef;
  value: string;
  baseFontSizePx: number;
  onChange: (value: string) => void;
};

const SIZE_UNITS: SizeUnit[] = ['px', 'rem', 'em', '%'];

const BORDER_STYLES = ['none', 'solid', 'dashed', 'dotted', 'double'];

function toHex6(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    const [, r, g, b] = color.match(/^#(.)(.)(.)$/)!;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return '#000000';
}

type Border = { width: string; style: string; color: string };

function parseBorder(value: string): Border {
  const v = (value ?? '').trim();
  if (v === '' || v === 'none') {
    return { width: '1px', style: 'none', color: '#e5e7eb' };
  }
  const colorMatch = v.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)/i);
  const color = colorMatch ? colorMatch[0] : '#e5e7eb';
  const rest = (colorMatch ? v.replace(colorMatch[0], '') : v).trim();
  let width = '';
  let style = '';
  for (const token of rest.split(/\s+/).filter(Boolean)) {
    if (BORDER_STYLES.includes(token)) style = token;
    else width = token;
  }
  return { width: width || '1px', style: style || 'solid', color };
}

function composeBorder(b: Border): string {
  return b.style === 'none' ? 'none' : `${b.width} ${b.style} ${b.color}`;
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

  if (def.type === 'font') {
    return (
      <div className="control-row">
        <label>{def.label}</label>
        <FontPicker
          value={value}
          categories={def.fontCategories}
          onChange={onChange}
          ariaLabel={def.label}
        />
      </div>
    );
  }

  if (def.type === 'border') {
    const border = parseBorder(value);
    const isNone = border.style === 'none';
    const { num: widthNum, unit: widthUnit } = parseSize(border.width);

    return (
      <div className="control-row">
        <label>{def.label}</label>
        <div className="control-input-row">
          <select
            value={border.style}
            onChange={(e) => onChange(composeBorder({ ...border, style: e.target.value }))}
            aria-label={`${def.label} style`}
          >
            {BORDER_STYLES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        {!isNone && (
          <div className="control-input-row">
            <input
              type="number"
              value={widthNum}
              step="any"
              min="0"
              onChange={(e) =>
                onChange(composeBorder({ ...border, width: `${e.target.value}${widthUnit}` }))
              }
              aria-label={`${def.label} width`}
            />
            <input
              type="color"
              value={toHex6(border.color.startsWith('#') ? border.color : '#000000')}
              onChange={(e) => onChange(composeBorder({ ...border, color: e.target.value }))}
              aria-label={`${def.label} color`}
            />
            <input
              type="text"
              value={border.color}
              onChange={(e) => onChange(composeBorder({ ...border, color: e.target.value }))}
              aria-label={`${def.label} color value`}
            />
          </div>
        )}
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
