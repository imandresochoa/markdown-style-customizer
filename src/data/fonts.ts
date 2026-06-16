export type FontCategory = 'sans' | 'serif' | 'mono';

export type FontOption = {
  label: string;
  value: string;
  category: FontCategory;
};

/**
 * Curated font stacks. Each value already includes sensible fallbacks so the
 * resulting CSS font-family is a complete stack, not a single font.
 * Only web-safe / system fonts are used so previews render without loading
 * external font files.
 */
export const FONT_OPTIONS: FontOption[] = [
  // Sans-serif
  {
    label: 'Sistema',
    value: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    category: 'sans',
  },
  {
    label: 'Helvetica / Arial',
    value: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    category: 'sans',
  },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif', category: 'sans' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif', category: 'sans' },
  {
    label: 'Trebuchet MS',
    value: '"Trebuchet MS", Helvetica, sans-serif',
    category: 'sans',
  },
  {
    label: 'Gill Sans',
    value: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif',
    category: 'sans',
  },

  // Serif
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif', category: 'serif' },
  {
    label: 'Times New Roman',
    value: '"Times New Roman", Times, serif',
    category: 'serif',
  },
  {
    label: 'Palatino',
    value: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
    category: 'serif',
  },
  {
    label: 'Garamond',
    value: 'Garamond, "Apple Garamond", "Times New Roman", serif',
    category: 'serif',
  },
  { label: 'Cambria', value: 'Cambria, Georgia, serif', category: 'serif' },

  // Monospace
  {
    label: 'Mono del sistema',
    value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    category: 'mono',
  },
  {
    label: 'Courier New',
    value: '"Courier New", Courier, monospace',
    category: 'mono',
  },
  {
    label: 'Consolas',
    value: 'Consolas, "Liberation Mono", Menlo, monospace',
    category: 'mono',
  },
  {
    label: 'Menlo / Monaco',
    value: 'Menlo, Monaco, "Courier New", monospace',
    category: 'mono',
  },
];

export const FONT_CATEGORY_LABELS: Record<FontCategory, string> = {
  sans: 'Sans-serif',
  serif: 'Serif',
  mono: 'Monoespaciada',
};

/** Normalize a font-family string for loose comparison against option values. */
function normalizeFontValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/\s+/g, '')
    .replace(/,$/, '');
}

export function findFontOption(value: string): FontOption | undefined {
  const target = normalizeFontValue(value);
  return FONT_OPTIONS.find((opt) => normalizeFontValue(opt.value) === target);
}
