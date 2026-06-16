export type Rgb = { r: number; g: number; b: number };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampChannel(value: number): number {
  return clamp(Math.round(value), 0, 255);
}

/** Parse a #rgb or #rrggbb string into RGB channels. Falls back to black. */
export function parseHex(hex: string): Rgb {
  const value = hex.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    const r = parseInt(value[0] + value[0], 16);
    const g = parseInt(value[1] + value[1], 16);
    const b = parseInt(value[2] + value[2], 16);
    return { r, g, b };
  }
  if (/^[0-9a-fA-F]{6}$/.test(value)) {
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
    };
  }
  return { r: 0, g: 0, b: 0 };
}

export function toHex({ r, g, b }: Rgb): string {
  const hex = (n: number) => clampChannel(n).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Linear mix of two colors in sRGB space.
 * weight is how much of color `b` to blend in (0 -> a, 1 -> b).
 */
export function mix(a: string, b: string, weight: number): string {
  const w = clamp(weight, 0, 1);
  const ca = parseHex(a);
  const cb = parseHex(b);
  return toHex({
    r: ca.r + (cb.r - ca.r) * w,
    g: ca.g + (cb.g - ca.g) * w,
    b: ca.b + (cb.b - ca.b) * w,
  });
}

export function mixWithWhite(hex: string, weight: number): string {
  return mix('#ffffff', hex, weight);
}

export function darken(hex: string, amount: number): string {
  return mix(hex, '#000000', amount);
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Returns an ink color based on the accent that stays legible on a light
 * background: if the accent is too light, it is darkened toward black until
 * it crosses a luminance threshold.
 */
export function readableInk(hex: string, maxLuminance = 0.35): string {
  let result = hex;
  let amount = 0;
  while (relativeLuminance(result) > maxLuminance && amount < 0.9) {
    amount += 0.1;
    result = darken(hex, amount);
  }
  return result;
}

/**
 * Replace the first hex color found inside a CSS shorthand (e.g.
 * "2px solid #e5e7eb"), preserving the rest. If no hex is present
 * (e.g. "none"), the value is returned unchanged.
 */
export function replaceColorInShorthand(value: string, newColor: string): string {
  if (!/#[0-9a-fA-F]{3,6}\b/.test(value)) return value;
  return value.replace(/#[0-9a-fA-F]{3,6}\b/, newColor);
}
