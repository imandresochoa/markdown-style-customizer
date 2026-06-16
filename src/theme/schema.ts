import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { ThemeVariables } from './defaults';
import { cloneDefaultTheme } from './defaults';

export const SCHEMA_VERSION = 1 as const;

export type MarkdownBlock = {
  id: string;
  label: string;
  markdown: string;
};

export type SharedPayload = {
  version: typeof SCHEMA_VERSION;
  name: string;
  theme: ThemeVariables;
  blocks?: MarkdownBlock[];
};

export type SavedThemePreset = {
  id: string;
  name: string;
  theme: ThemeVariables;
  blocks: MarkdownBlock[];
  savedAt: string;
};

export type SpecPayload = {
  version: typeof SCHEMA_VERSION;
  name: string;
  theme: ThemeVariables;
  generatedAt: string;
};

export function createSpecPayload(name: string, theme: ThemeVariables): SpecPayload {
  return {
    version: SCHEMA_VERSION,
    name,
    theme,
    generatedAt: new Date().toISOString(),
  };
}

export function validateSpecPayload(data: unknown): SpecPayload | null {
  if (!data || typeof data !== 'object') return null;
  const payload = data as Partial<SpecPayload>;
  if (payload.version !== SCHEMA_VERSION) return null;
  if (typeof payload.name !== 'string') return null;
  if (typeof payload.generatedAt !== 'string') return null;
  if (!payload.theme || typeof payload.theme !== 'object') return null;

  const theme: ThemeVariables = {};
  for (const [key, value] of Object.entries(payload.theme)) {
    if (typeof value === 'string') theme[key] = value;
  }

  return {
    version: SCHEMA_VERSION,
    name: payload.name,
    theme,
    generatedAt: payload.generatedAt,
  };
}

export function encodeSpecShareUrl(payload: SpecPayload): string {
  const json = JSON.stringify(payload);
  const compressed = compressToEncodedURIComponent(json);
  const base = window.location.href.split('#')[0];
  return `${base}#spec=${compressed}`;
}

export function decodeSpecShareUrl(hash: string): SpecPayload | null {
  const match = hash.match(/^#spec=(.+)$/);
  if (!match) return null;
  try {
    const json = decompressFromEncodedURIComponent(match[1]);
    if (!json) return null;
    return validateSpecPayload(JSON.parse(json));
  } catch {
    return null;
  }
}

const STORAGE_KEY = 'md-style-customizer-session';
const PRESETS_KEY = 'md-style-customizer-presets';
/** Bump when default article content changes so saved sessions pick up new blocks */
export const CONTENT_VERSION = 4;

export function createSharedPayload(
  name: string,
  theme: ThemeVariables,
  blocks?: MarkdownBlock[],
): SharedPayload {
  return {
    version: SCHEMA_VERSION,
    name,
    theme,
    ...(blocks ? { blocks } : {}),
  };
}

export function validateSharedPayload(data: unknown): SharedPayload | null {
  if (!data || typeof data !== 'object') return null;
  const payload = data as Partial<SharedPayload>;
  if (payload.version !== SCHEMA_VERSION) return null;
  if (typeof payload.name !== 'string') return null;
  if (!payload.theme || typeof payload.theme !== 'object') return null;

  const theme: ThemeVariables = {};
  for (const [key, value] of Object.entries(payload.theme)) {
    if (typeof value === 'string') theme[key] = value;
  }

  let blocks: MarkdownBlock[] | undefined;
  if (payload.blocks) {
    if (!Array.isArray(payload.blocks)) return null;
    blocks = payload.blocks.filter(
      (b): b is MarkdownBlock =>
        typeof b === 'object' &&
        b !== null &&
        typeof (b as MarkdownBlock).id === 'string' &&
        typeof (b as MarkdownBlock).label === 'string' &&
        typeof (b as MarkdownBlock).markdown === 'string',
    );
  }

  return { version: SCHEMA_VERSION, name: payload.name, theme, blocks };
}

export function encodeShareUrl(payload: SharedPayload): string {
  const json = JSON.stringify(payload);
  const compressed = compressToEncodedURIComponent(json);
  const base = window.location.href.split('#')[0];
  return `${base}#t=${compressed}`;
}

export function decodeShareUrl(hash: string): SharedPayload | null {
  const match = hash.match(/^#t=(.+)$/);
  if (!match) return null;
  try {
    const json = decompressFromEncodedURIComponent(match[1]);
    if (!json) return null;
    return validateSharedPayload(JSON.parse(json));
  } catch {
    return null;
  }
}

export function downloadJson(payload: SharedPayload, filename: string): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function readJsonFile(file: File): Promise<SharedPayload | null> {
  try {
    const text = await file.text();
    return validateSharedPayload(JSON.parse(text));
  } catch {
    return null;
  }
}

export type SessionState = {
  contentVersion: number;
  themeName: string;
  theme: ThemeVariables;
  blocks: MarkdownBlock[];
};

export function saveSession(state: SessionState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<SessionState>;
    if (!data.theme || !data.blocks || typeof data.themeName !== 'string') return null;
    if (data.contentVersion !== CONTENT_VERSION) return null;
    return {
      contentVersion: CONTENT_VERSION,
      themeName: data.themeName,
      theme: { ...cloneDefaultTheme(), ...data.theme },
      blocks: data.blocks,
    };
  } catch {
    return null;
  }
}

export function loadPresets(): SavedThemePreset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.map((preset: SavedThemePreset) => ({
      ...preset,
      blocks: Array.isArray(preset.blocks) ? preset.blocks : [],
    }));
  } catch {
    return [];
  }
}

export function savePresets(presets: SavedThemePreset[]): void {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function themeToCssBlock(theme: ThemeVariables, selector = '.md-preview'): string {
  const vars = Object.entries(theme)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${vars}\n}`;
}
