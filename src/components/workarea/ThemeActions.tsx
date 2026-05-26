import { useState, useRef, useEffect } from 'react';
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
import { MaterialIcon } from '../icons/MaterialIcon';
import { MATERIAL_ICONS } from '../icons/iconNames';

export function ThemeActions() {
  const { state, dispatch } = useAppState();
  const [includeBlocks, setIncludeBlocks] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleExport = (withBlocks: boolean) => {
    const payload = createSharedPayload(
      state.themeName,
      state.theme,
      withBlocks ? state.blocks : undefined,
    );
    const slug = state.themeName.toLowerCase().replace(/\s+/g, '-');
    downloadJson(payload, `${slug || 'theme'}.json`);
    dispatch({ type: 'SET_TOAST', message: 'Theme exported' });
    closeMenu();
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
    closeMenu();
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
    closeMenu();
  };

  const handleCopyCss = async () => {
    const css = themeToCssBlock(state.theme);
    try {
      await navigator.clipboard.writeText(css);
      dispatch({ type: 'SET_TOAST', message: 'CSS copied to clipboard' });
    } catch {
      dispatch({ type: 'SET_TOAST', message: 'Could not copy CSS' });
    }
    closeMenu();
  };

  const handleSavePreset = () => {
    const name = state.themeName.trim();
    if (!name) {
      dispatch({ type: 'SET_TOAST', message: 'Enter a name before saving' });
      return;
    }
    dispatch({ type: 'SAVE_PRESET', name });
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
    closeMenu();
  };

  const handleOpenSpec = () => {
    const url = encodeSpecShareUrl(buildSpecPayload());
    window.open(url, '_blank', 'noopener,noreferrer');
    closeMenu();
  };

  return (
    <div className="sidebar-header">
      <h1>Markdown Style Customizer</h1>
      <p className="sidebar-lead">Edit styles here. Click blocks in the preview to edit content.</p>

      <section className="sidebar-section">
        <h2 className="sidebar-section-label">Theme</h2>
        <div className="sidebar-name-row">
          <input
            className="theme-name-input"
            value={state.themeName}
            onChange={(e) => dispatch({ type: 'SET_THEME_NAME', name: e.target.value })}
            placeholder="Theme name"
            aria-label="Theme name"
          />
          <button type="button" className="btn btn-sm btn-primary" onClick={handleSavePreset}>
            Save
          </button>
        </div>

        {state.presets.length > 0 && (
          <ul className="presets-list">
            {state.presets.map((preset) => (
              <li key={preset.id} className="preset-item">
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
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="sidebar-section">
        <div className="actions-menu-wrap" ref={menuRef}>
          <button
            type="button"
            className="btn actions-menu-trigger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <MaterialIcon name={MATERIAL_ICONS.share} size={18} />
            Share & export
            <MaterialIcon
              name={MATERIAL_ICONS.expandMore}
              size={18}
              className="actions-menu-trigger-chevron"
            />
          </button>

          {menuOpen && (
            <div className="actions-menu" role="menu">
              <div className="actions-menu-group">
                <div className="actions-menu-label">Share</div>
                <label
                  className="actions-menu-checkbox"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={includeBlocks}
                    onChange={(e) => setIncludeBlocks(e.target.checked)}
                  />
                  Include article content in link
                </label>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleCopyLink}
                >
                  Copy share link
                </button>
              </div>

              <div className="actions-menu-divider" role="separator" />

              <div className="actions-menu-group">
                <div className="actions-menu-label">Design handoff</div>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleCopyCss}
                >
                  Copy CSS
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleCopySpecLink}
                >
                  Copy spec link
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleOpenSpec}
                >
                  Open handoff
                </button>
              </div>

              <div className="actions-menu-divider" role="separator" />

              <div className="actions-menu-group">
                <div className="actions-menu-label">Backup</div>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={() => handleExport(false)}
                >
                  Export JSON
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={() => handleExport(true)}
                >
                  Export + content
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Import JSON
                </button>
              </div>
            </div>
          )}

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
      </section>
    </div>
  );
}
