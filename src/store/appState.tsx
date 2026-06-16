import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import { cloneDefaultTheme, DEFAULT_THEME, type ThemeVariables } from '../theme/defaults';
import { cloneDefaultBlocks } from '../data/defaultBlocks';
import { BLOCK_TEMPLATES, createBlockFromTemplate } from '../data/blockTemplates';
import type { MarkdownBlock, SavedThemePreset } from '../theme/schema';
import {
  CONTENT_VERSION,
  loadSession,
  saveSession,
  loadPresets,
  savePresets,
} from '../theme/schema';
import { decodeShareUrl } from '../theme/schema';
import { getGroupVariableKeys } from '../theme/controlGroups';

export type AppState = {
  themeName: string;
  theme: ThemeVariables;
  blocks: MarkdownBlock[];
  selectedSectionId: string | null;
  presets: SavedThemePreset[];
  activePresetId: string | null;
  toast: string | null;
};

type Action =
  | { type: 'SET_THEME_VAR'; key: string; value: string }
  | { type: 'SET_THEME_NAME'; name: string }
  | { type: 'RESET_GROUP'; groupId: string }
  | { type: 'RESET_ALL' }
  | { type: 'SET_BLOCKS'; blocks: MarkdownBlock[] }
  | { type: 'UPDATE_BLOCK'; id: string; markdown: string }
  | { type: 'RESET_BLOCK'; id: string; markdown: string }
  | { type: 'REORDER_BLOCKS'; fromIndex: number; toIndex: number }
  | { type: 'ADD_BLOCK'; templateId: string; afterId?: string | null }
  | { type: 'DELETE_BLOCK'; id: string }
  | { type: 'SELECT_SECTION'; id: string | null }
  | { type: 'APPLY_PAYLOAD'; themeName: string; theme: ThemeVariables; blocks?: MarkdownBlock[] }
  | { type: 'SAVE_PRESET'; name: string }
  | { type: 'SAVE_PRESET_AS'; name: string }
  | { type: 'NEW_PRESET' }
  | { type: 'LOAD_PRESET'; id: string }
  | { type: 'DELETE_PRESET'; id: string }
  | { type: 'SET_TOAST'; message: string | null };

function initState(): AppState {
  const hashPayload = decodeShareUrl(window.location.hash);
  const session = loadSession();
  const defaultBlocks = cloneDefaultBlocks();

  if (hashPayload) {
    return {
      themeName: hashPayload.name,
      theme: { ...cloneDefaultTheme(), ...hashPayload.theme },
      blocks: hashPayload.blocks ?? defaultBlocks,
      selectedSectionId: null,
      presets: loadPresets(),
      activePresetId: null,
      toast: 'Tema cargado desde el enlace compartido',
    };
  }

  if (session) {
    return {
      themeName: session.themeName,
      theme: session.theme,
      blocks: session.blocks,
      selectedSectionId: null,
      presets: loadPresets(),
      activePresetId: null,
      toast: null,
    };
  }

  return {
    themeName: 'My Theme',
    theme: cloneDefaultTheme(),
    blocks: defaultBlocks,
    selectedSectionId: null,
    presets: loadPresets(),
    activePresetId: null,
    toast: null,
  };
}

function reorderArray<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_THEME_VAR':
      return {
        ...state,
        theme: { ...state.theme, [action.key]: action.value },
      };

    case 'SET_THEME_NAME':
      return { ...state, themeName: action.name };

    case 'RESET_GROUP': {
      const keys = getGroupVariableKeys(action.groupId);
      const theme = { ...state.theme };
      for (const key of keys) {
        if (key in DEFAULT_THEME) theme[key] = DEFAULT_THEME[key];
      }
      return { ...state, theme };
    }

    case 'RESET_ALL':
      return { ...state, theme: cloneDefaultTheme() };

    case 'SET_BLOCKS':
      return { ...state, blocks: action.blocks };

    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map((b) =>
          b.id === action.id ? { ...b, markdown: action.markdown } : b,
        ),
      };

    case 'RESET_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map((b) =>
          b.id === action.id ? { ...b, markdown: action.markdown } : b,
        ),
      };

    case 'REORDER_BLOCKS': {
      const { fromIndex, toIndex } = action;
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.blocks.length ||
        toIndex >= state.blocks.length
      ) {
        return state;
      }
      return { ...state, blocks: reorderArray(state.blocks, fromIndex, toIndex) };
    }

    case 'ADD_BLOCK': {
      const template = BLOCK_TEMPLATES.find((t) => t.id === action.templateId);
      if (!template) return state;
      const newBlock = createBlockFromTemplate(template);
      const blocks = [...state.blocks];
      if (action.afterId) {
        const idx = blocks.findIndex((b) => b.id === action.afterId);
        blocks.splice(idx === -1 ? blocks.length : idx + 1, 0, newBlock);
      } else {
        blocks.push(newBlock);
      }
      return {
        ...state,
        blocks,
        selectedSectionId: newBlock.id,
        toast: `Added ${template.label}`,
      };
    }

    case 'DELETE_BLOCK': {
      if (state.blocks.length <= 1) {
        return { ...state, toast: 'Cannot delete the last block' };
      }
      const idx = state.blocks.findIndex((b) => b.id === action.id);
      if (idx === -1) return state;
      const blocks = state.blocks.filter((b) => b.id !== action.id);
      const nextSelected = blocks[Math.min(idx, blocks.length - 1)]?.id ?? null;
      return {
        ...state,
        blocks,
        selectedSectionId: nextSelected,
        toast: 'Block deleted',
      };
    }

    case 'SELECT_SECTION':
      return { ...state, selectedSectionId: action.id };

    case 'APPLY_PAYLOAD':
      return {
        ...state,
        themeName: action.themeName,
        theme: { ...cloneDefaultTheme(), ...action.theme },
        blocks: action.blocks ?? state.blocks,
        selectedSectionId: null,
        activePresetId: null,
        toast: `"${action.themeName}" cargado`,
      };

    case 'SAVE_PRESET': {
      const activePreset = state.activePresetId
        ? state.presets.find((p) => p.id === state.activePresetId)
        : undefined;

      if (activePreset) {
        const presets = state.presets.map((p) =>
          p.id === activePreset.id
            ? {
                ...p,
                name: action.name,
                theme: { ...state.theme },
                blocks: state.blocks.map((b) => ({ ...b })),
                savedAt: new Date().toISOString(),
              }
            : p,
        );
        savePresets(presets);
        return { ...state, presets, toast: `Plantilla "${action.name}" guardada` };
      }

      const preset: SavedThemePreset = {
        id: crypto.randomUUID(),
        name: action.name,
        theme: { ...state.theme },
        blocks: state.blocks.map((b) => ({ ...b })),
        savedAt: new Date().toISOString(),
      };
      const presets = [...state.presets, preset];
      savePresets(presets);
      return {
        ...state,
        presets,
        activePresetId: preset.id,
        toast: `Plantilla "${action.name}" creada`,
      };
    }

    case 'SAVE_PRESET_AS': {
      const preset: SavedThemePreset = {
        id: crypto.randomUUID(),
        name: action.name,
        theme: { ...state.theme },
        blocks: state.blocks.map((b) => ({ ...b })),
        savedAt: new Date().toISOString(),
      };
      const presets = [...state.presets, preset];
      savePresets(presets);
      return {
        ...state,
        presets,
        activePresetId: preset.id,
        toast: `Plantilla "${action.name}" creada`,
      };
    }

    case 'NEW_PRESET':
      return {
        ...state,
        themeName: 'Mi plantilla',
        theme: cloneDefaultTheme(),
        blocks: cloneDefaultBlocks(),
        selectedSectionId: null,
        activePresetId: null,
        toast: 'Nueva plantilla',
      };

    case 'LOAD_PRESET': {
      const preset = state.presets.find((p) => p.id === action.id);
      if (!preset) return state;
      return {
        ...state,
        themeName: preset.name,
        theme: { ...cloneDefaultTheme(), ...preset.theme },
        blocks: preset.blocks.length
          ? preset.blocks.map((b) => ({ ...b }))
          : state.blocks,
        selectedSectionId: null,
        activePresetId: preset.id,
        toast: `Plantilla "${preset.name}" cargada`,
      };
    }

    case 'DELETE_PRESET': {
      const presets = state.presets.filter((p) => p.id !== action.id);
      savePresets(presets);
      return {
        ...state,
        presets,
        activePresetId: state.activePresetId === action.id ? null : state.activePresetId,
        toast: 'Plantilla eliminada',
      };
    }

    case 'SET_TOAST':
      return { ...state, toast: action.message };

    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  useEffect(() => {
    saveSession({
      contentVersion: CONTENT_VERSION,
      themeName: state.themeName,
      theme: state.theme,
      blocks: state.blocks,
    });
  }, [state.themeName, state.theme, state.blocks]);

  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(() => dispatch({ type: 'SET_TOAST', message: null }), 3000);
    return () => clearTimeout(timer);
  }, [state.toast]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function themeToStyle(theme: ThemeVariables): React.CSSProperties {
  return theme as React.CSSProperties;
}
