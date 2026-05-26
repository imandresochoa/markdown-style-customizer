export const MATERIAL_ICONS = {
  add: 'add',
  delete: 'delete',
  restore: 'restore',
  dragIndicator: 'drag_indicator',
  chevronRight: 'chevron_right',
  expandMore: 'expand_more',
} as const;

export type MaterialIconName = (typeof MATERIAL_ICONS)[keyof typeof MATERIAL_ICONS];
