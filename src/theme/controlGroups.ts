import type { ThemeVariables } from './defaults';

export type ControlType = 'color' | 'text' | 'select' | 'size';

export type StyleControlDef = {
  key: keyof ThemeVariables | string;
  label: string;
  type: ControlType;
  options?: string[];
};

export type ControlGroup = {
  id: string;
  label: string;
  controls: StyleControlDef[];
};

const headingControls = (level: number): StyleControlDef[] => [
  { key: `--md-h${level}-color`, label: 'Color', type: 'color' },
  { key: `--md-h${level}-font-size`, label: 'Font size', type: 'size' },
  { key: `--md-h${level}-font-weight`, label: 'Font weight', type: 'select', options: ['400', '500', '600', '700', '800'] },
  { key: `--md-h${level}-margin-top`, label: 'Margin top', type: 'size' },
  { key: `--md-h${level}-margin-bottom`, label: 'Margin bottom', type: 'size' },
  { key: `--md-h${level}-border-bottom`, label: 'Border bottom', type: 'text' },
];

export const CONTROL_GROUPS: ControlGroup[] = [
  {
    id: 'base',
    label: 'Base',
    controls: [
      { key: '--md-font-family', label: 'Font family', type: 'text' },
      { key: '--md-font-size', label: 'Font size', type: 'size' },
      { key: '--md-line-height', label: 'Line height', type: 'text' },
      { key: '--md-text-color', label: 'Text color', type: 'color' },
      { key: '--md-bg-color', label: 'Background', type: 'color' },
      { key: '--md-content-max-width', label: 'Max width', type: 'size' },
      { key: '--md-content-padding', label: 'Padding', type: 'size' },
    ],
  },
  ...([1, 2, 3, 4, 5, 6] as const).map((n) => ({
    id: `h${n}`,
    label: `Heading ${n}`,
    controls: headingControls(n),
  })),
  {
    id: 'paragraph',
    label: 'Paragraph',
    controls: [
      { key: '--md-p-color', label: 'Color', type: 'color' },
      { key: '--md-p-margin', label: 'Margin', type: 'text' },
      { key: '--md-p-line-height', label: 'Line height', type: 'text' },
    ],
  },
  {
    id: 'links',
    label: 'Links',
    controls: [
      { key: '--md-a-color', label: 'Color', type: 'color' },
      { key: '--md-a-hover-color', label: 'Hover color', type: 'color' },
      { key: '--md-a-decoration', label: 'Text decoration', type: 'select', options: ['none', 'underline', 'line-through'] },
    ],
  },
  {
    id: 'emphasis',
    label: 'Emphasis',
    controls: [
      { key: '--md-strong-color', label: 'Bold color', type: 'color' },
      { key: '--md-strong-weight', label: 'Bold weight', type: 'select', options: ['600', '700', '800'] },
      { key: '--md-em-color', label: 'Italic color', type: 'color' },
      { key: '--md-em-style', label: 'Italic style', type: 'select', options: ['italic', 'normal'] },
      { key: '--md-del-color', label: 'Strikethrough color', type: 'color' },
    ],
  },
  {
    id: 'inline-code',
    label: 'Inline code',
    controls: [
      { key: '--md-code-color', label: 'Color', type: 'color' },
      { key: '--md-code-bg', label: 'Background', type: 'color' },
      { key: '--md-code-padding', label: 'Padding', type: 'text' },
      { key: '--md-code-radius', label: 'Border radius', type: 'size' },
      { key: '--md-code-font-family', label: 'Font family', type: 'text' },
    ],
  },
  {
    id: 'code-block',
    label: 'Code block',
    controls: [
      { key: '--md-pre-bg', label: 'Background', type: 'color' },
      { key: '--md-pre-color', label: 'Text color', type: 'color' },
      { key: '--md-pre-padding', label: 'Padding', type: 'size' },
      { key: '--md-pre-radius', label: 'Border radius', type: 'size' },
      { key: '--md-pre-border', label: 'Border', type: 'text' },
    ],
  },
  {
    id: 'blockquote',
    label: 'Blockquote',
    controls: [
      { key: '--md-blockquote-color', label: 'Text color', type: 'color' },
      { key: '--md-blockquote-border-color', label: 'Border color', type: 'color' },
      { key: '--md-blockquote-bg', label: 'Background', type: 'color' },
      { key: '--md-blockquote-padding', label: 'Padding', type: 'text' },
    ],
  },
  {
    id: 'lists',
    label: 'Lists',
    controls: [
      { key: '--md-ul-list-style', label: 'Unordered style', type: 'select', options: ['disc', 'circle', 'square', 'none'] },
      { key: '--md-ol-list-style', label: 'Ordered style', type: 'select', options: ['decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman'] },
      { key: '--md-li-margin', label: 'Item margin', type: 'text' },
      { key: '--md-li-line-height', label: 'Item line height', type: 'text' },
      { key: '--md-li-marker-color', label: 'Marker color', type: 'color' },
      { key: '--md-list-padding-left', label: 'Padding left', type: 'size' },
      { key: '--md-list-margin', label: 'List margin', type: 'text' },
    ],
  },
  {
    id: 'task-list',
    label: 'Task list',
    controls: [
      { key: '--md-task-gap', label: 'Checkbox gap', type: 'size' },
      { key: '--md-task-checkbox-accent', label: 'Checkbox accent', type: 'color' },
    ],
  },
  {
    id: 'table',
    label: 'Table',
    controls: [
      { key: '--md-table-border-color', label: 'Border color', type: 'color' },
      { key: '--md-th-bg', label: 'Header background', type: 'color' },
      { key: '--md-td-padding', label: 'Cell padding', type: 'text' },
      { key: '--md-tr-stripe-bg', label: 'Stripe background', type: 'color' },
      { key: '--md-table-margin', label: 'Table margin', type: 'text' },
    ],
  },
  {
    id: 'hr-image',
    label: 'HR & Image',
    controls: [
      { key: '--md-hr-color', label: 'HR color', type: 'color' },
      { key: '--md-hr-height', label: 'HR height', type: 'size' },
      { key: '--md-hr-margin', label: 'HR margin', type: 'text' },
      { key: '--md-img-radius', label: 'Image radius', type: 'size' },
      { key: '--md-img-max-width', label: 'Image max width', type: 'text' },
    ],
  },
];

export function getGroupVariableKeys(groupId: string): string[] {
  const group = CONTROL_GROUPS.find((g) => g.id === groupId);
  return group?.controls.map((c) => c.key) ?? [];
}
