export type SizeUnit = 'px' | 'rem' | 'em' | '%';

const SIZE_UNIT_PATTERN = /^([\d.]+)\s*(px|rem|em|%)?$/;

export function parseSizeValue(value: string): { num: number; unit: SizeUnit } | null {
  const match = value.trim().match(SIZE_UNIT_PATTERN);
  if (!match) return null;
  const unit = (match[2] || 'px') as SizeUnit;
  const num = parseFloat(match[1]);
  if (Number.isNaN(num)) return null;
  return { num, unit };
}

export function parseSize(value: string): { num: string; unit: SizeUnit } {
  const parsed = parseSizeValue(value);
  if (!parsed) return { num: value, unit: 'px' };
  const numStr = Number.isInteger(parsed.num) ? String(parsed.num) : String(parsed.num);
  return { num: numStr, unit: parsed.unit };
}

/** Resolve --md-font-size (or any font size token) to pixels */
export function resolveFontSizePx(value: string, rootPx = 16): number {
  const parsed = parseSizeValue(value);
  if (!parsed) return rootPx;
  return toPx(parsed.num, parsed.unit, rootPx, rootPx);
}

function toPx(num: number, unit: SizeUnit, basePx: number, rootPx: number): number {
  switch (unit) {
    case 'px':
      return num;
    case 'rem':
      return num * rootPx;
    case 'em':
      return num * basePx;
    case '%':
      return (num / 100) * basePx;
    default:
      return num;
  }
}

function fromPx(px: number, unit: SizeUnit, basePx: number, rootPx: number): number {
  switch (unit) {
    case 'px':
      return px;
    case 'rem':
      return px / rootPx;
    case 'em':
      return px / basePx;
    case '%':
      return (px / basePx) * 100;
    default:
      return px;
  }
}

function formatSize(num: number, unit: SizeUnit): string {
  if (unit === 'px') {
    return `${Math.round(num)}px`;
  }
  const rounded = Math.round(num * 1000) / 1000;
  const str = Number.isInteger(rounded) ? String(Math.round(rounded)) : String(rounded);
  return `${str}${unit}`;
}

export function convertSizeUnit(
  value: string,
  fromUnit: SizeUnit,
  toUnit: SizeUnit,
  options: { basePx: number; rootPx?: number; isRootFontSize?: boolean },
): string {
  if (fromUnit === toUnit) return value;

  const parsed = parseSizeValue(value);
  const num = parsed?.num ?? (parseFloat(value) || 0);
  const rootPx = options.rootPx ?? 16;
  const basePx = options.isRootFontSize ? rootPx : options.basePx;

  const px = toPx(num, fromUnit, basePx, rootPx);
  const converted = fromPx(px, toUnit, basePx, rootPx);
  return formatSize(converted, toUnit);
}
