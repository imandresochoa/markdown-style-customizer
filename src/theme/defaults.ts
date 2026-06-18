export type ThemeVariables = Record<string, string>;

export const DEFAULT_THEME: ThemeVariables = {
  // Global colors (seed values for the pickers; not consumed directly by the preview)
  '--md-ink': '#1a202c',
  '--md-accent': '#2563eb',

  // Base
  '--md-font-family': 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  '--md-font-size': '16px',
  '--md-line-height': '1.65',
  '--md-text-color': '#1a202c',
  '--md-bg-color': '#fafafa',
  '--md-content-max-width': '720px',
  '--md-content-padding': '32px',

  // Headings
  '--md-h1-color': '#111827',
  '--md-h1-font-size': '2.25rem',
  '--md-h1-font-weight': '700',
  '--md-h1-margin-top': '0',
  '--md-h1-margin-bottom': '16px',
  '--md-h1-border-bottom': '2px solid #e5e7eb',
  '--md-h1-bg': 'transparent',
  '--md-h1-padding': '0',
  '--md-h1-border-radius': '0px',

  '--md-h2-color': '#111827',
  '--md-h2-font-size': '1.75rem',
  '--md-h2-font-weight': '700',
  '--md-h2-margin-top': '32px',
  '--md-h2-margin-bottom': '12px',
  '--md-h2-border-bottom': '1px solid #e5e7eb',

  '--md-h3-color': '#1f2937',
  '--md-h3-font-size': '1.375rem',
  '--md-h3-font-weight': '600',
  '--md-h3-margin-top': '24px',
  '--md-h3-margin-bottom': '8px',
  '--md-h3-border-bottom': 'none',

  '--md-h4-color': '#1f2937',
  '--md-h4-font-size': '1.125rem',
  '--md-h4-font-weight': '600',
  '--md-h4-margin-top': '20px',
  '--md-h4-margin-bottom': '8px',
  '--md-h4-border-bottom': 'none',

  '--md-h5-color': '#374151',
  '--md-h5-font-size': '1rem',
  '--md-h5-font-weight': '600',
  '--md-h5-margin-top': '16px',
  '--md-h5-margin-bottom': '6px',
  '--md-h5-border-bottom': 'none',

  '--md-h6-color': '#4b5563',
  '--md-h6-font-size': '0.875rem',
  '--md-h6-font-weight': '600',
  '--md-h6-margin-top': '16px',
  '--md-h6-margin-bottom': '6px',
  '--md-h6-border-bottom': 'none',

  // Paragraph
  '--md-p-color': '#374151',
  '--md-p-margin': '0 0 16px 0',
  '--md-p-line-height': '1.7',

  // Links
  '--md-a-color': '#2563eb',
  '--md-a-hover-color': '#1d4ed8',
  '--md-a-decoration': 'underline',

  // Emphasis
  '--md-strong-color': '#111827',
  '--md-strong-weight': '700',
  '--md-em-color': '#374151',
  '--md-em-style': 'italic',
  '--md-del-color': '#9ca3af',

  // Inline code
  '--md-code-color': '#be185d',
  '--md-code-bg': '#fdf2f8',
  '--md-code-padding': '2px 6px',
  '--md-code-radius': '4px',
  '--md-code-font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',

  // Code block
  '--md-pre-bg': '#1e293b',
  '--md-pre-color': '#e2e8f0',
  '--md-pre-padding': '16px',
  '--md-pre-radius': '8px',
  '--md-pre-border': 'none',

  // Blockquote
  '--md-blockquote-color': '#4b5563',
  '--md-blockquote-border-color': '#6366f1',
  '--md-blockquote-bg': '#f9fafb',
  '--md-blockquote-padding': '12px 16px',

  // Lists
  '--md-ul-list-style': 'disc',
  '--md-ol-list-style': 'decimal',
  '--md-li-margin': '4px 0',
  '--md-li-line-height': '1.6',
  '--md-li-marker-color': '#374151',
  '--md-list-padding-left': '24px',
  '--md-list-margin': '0 0 16px 0',

  // Task list
  '--md-task-gap': '8px',
  '--md-task-checkbox-accent': '#2563eb',

  // Table
  '--md-table-border-color': '#d1d5db',
  '--md-th-bg': '#f3f4f6',
  '--md-td-padding': '10px 12px',
  '--md-tr-stripe-bg': '#f9fafb',
  '--md-table-margin': '0 0 16px 0',

  // HR / Image
  '--md-hr-color': '#e5e7eb',
  '--md-hr-height': '1px',
  '--md-hr-margin': '24px 0',
  '--md-img-radius': '8px',
  '--md-img-max-width': '100%',
};

export function cloneDefaultTheme(): ThemeVariables {
  return { ...DEFAULT_THEME };
}
