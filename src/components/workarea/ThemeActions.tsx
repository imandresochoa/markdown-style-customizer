import { useState, useRef } from 'react';
import { useAppState } from '../../store/appState';
import {
  createSharedPayload,
  createSpecPayload,
  downloadJson,
  encodeShareUrl,
  encodeSpecShareUrl,
  readJsonFile,
  themeToCssBlock,
} from '../../theme/schema';

export function ThemeActions() {
  const { state, dispatch } = useAppState();
  const [includeBlocks, setIncludeBlocks] = useState(false);
  const [presetName, setPresetName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = (withBlocks: boolean) => {
    const payload = createSharedPayload(
      state.themeName,
      state.theme,
      withBlocks ? state.blocks : undefined,
    );
    const slug = state.themeName.toLowerCase().replace(/\s+/g, '-');
    downloadJson(payload, `${slug || 'theme'}.json`);
    dispatch({ type: 'SET_TOAST', message: 'Theme exported' });
  };

  const handleImport = async (file: File) => {
    const payload = await readJsonFile(file);
    if (!payload) {
      dispatch({ type: 'SET_TOAST', message: 'Invalid theme file' });
      return;
    }
    dispatch({
      type: 'APPLY_PAYLOAD',
      themeName: payload.name,
      theme: payload.theme,
      blocks: payload.blocks,
    });
  };

  const handleCopyLink = async () => {
    const payload = createSharedPayload(
      state.themeName,
      state.theme,
      includeBlocks ? state.blocks : undefined,
    );
    const url = encodeShareUrl(payload);
    try {
      await navigator.clipboard.writeText(url);
      dispatch({ type: 'SET_TOAST', message: 'Share link copied' });
    } catch {
      dispatch({ type: 'SET_TOAST', message: 'Could not copy link' });
    }
  };

  const handleCopyCss = async () => {
    const css = themeToCssBlock(state.theme);
    try {
      await navigator.clipboard.writeText(css);
      dispatch({ type: 'SET_TOAST', message: 'CSS copied to clipboard' });
    } catch {
      dispatch({ type: 'SET_TOAST', message: 'Could not copy CSS' });
    }
  };

  const handleSavePreset = () => {
    const name = presetName.trim() || state.themeName;
    dispatch({ type: 'SAVE_PRESET', name });
    setPresetName('');
  };

  const buildSpecPayload = () => createSpecPayload(state.themeName, state.theme);

  const handleCopySpecLink = async () => {
    const url = encodeSpecShareUrl(buildSpecPayload());
    try {
      await navigator.clipboard.writeText(url);
      dispatch({ type: 'SET_TOAST', message: 'Spec link copied' });
    } catch {
      dispatch({ type: 'SET_TOAST', message: 'Could not copy spec link' });
    }
  };

  const handleOpenSpec = () => {
    const url = encodeSpecShareUrl(buildSpecPayload());
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="sidebar-header">
      <h1>Markdown Style Customizer</h1>
      <p>Edit styles here. Click blocks in the preview to edit content.</p>
      <input
        className="theme-name-input"
        value={state.themeName}
        onChange={(e) => dispatch({ type: 'SET_THEME_NAME', name: e.target.value })}
        placeholder="Theme name"
        aria-label="Theme name"
      />

      <div className="share-panel" style={{ marginTop: 12 }}>
        <div className="share-panel-row">
          <button type="button" className="btn btn-sm" onClick={() => handleExport(false)}>
            Export JSON
          </button>
          <button type="button" className="btn btn-sm" onClick={() => handleExport(true)}>
            Export + blocks
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = '';
            }}
          />
        </div>

        <label className="share-checkbox">
          <input
            type="checkbox"
            checked={includeBlocks}
            onChange={(e) => setIncludeBlocks(e.target.checked)}
          />
          Include block content &amp; order in share link
        </label>

        <div className="share-panel-row">
          <button type="button" className="btn btn-sm btn-primary" onClick={handleCopyLink}>
            Copy share link
          </button>
          <button type="button" className="btn btn-sm" onClick={handleCopyCss}>
            Copy CSS
          </button>
        </div>

        <div className="share-panel-row">
          <button type="button" className="btn btn-sm btn-primary" onClick={handleCopySpecLink}>
            Copy spec link
          </button>
          <button type="button" className="btn btn-sm" onClick={handleOpenSpec}>
            Open spec
          </button>
        </div>

        <div className="share-panel-row">
          <input
            type="text"
            className="theme-name-input"
            style={{ marginTop: 0, flex: 1 }}
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset name"
            aria-label="Preset name"
          />
          <button type="button" className="btn btn-sm" onClick={handleSavePreset}>
            Save preset
          </button>
        </div>

        {state.presets.length > 0 && (
          <div className="presets-list">
            {state.presets.map((preset) => (
              <div key={preset.id} className="preset-item">
                <span title={preset.name}>{preset.name}</span>
                <div className="preset-actions">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => dispatch({ type: 'LOAD_PRESET', id: preset.id })}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => dispatch({ type: 'DELETE_PRESET', id: preset.id })}
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
