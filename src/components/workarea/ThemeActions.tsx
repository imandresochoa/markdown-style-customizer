import { useState, useRef, useEffect, useMemo } from 'react';
import { useAppState } from '../../store/appState';
import {
  blocksToMarkdown,
  blocksToMarkdownWithHtml,
  createSharedPayload,
  createSpecPayload,
  downloadFile,
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
    dispatch({ type: 'SET_TOAST', message: 'Plantilla exportada' });
    closeMenu();
  };

  const handleExportMarkdown = () => {
    const markdown = blocksToMarkdown(state.blocks);
    const slug = state.themeName.toLowerCase().replace(/\s+/g, '-');
    downloadFile(markdown, `${slug || 'contenido'}.md`, 'text/markdown');
    dispatch({ type: 'SET_TOAST', message: 'Markdown exportado' });
    closeMenu();
  };

  const handleExportMarkdownWithHtml = () => {
    const markdownWithHtml = blocksToMarkdownWithHtml(state.blocks);
    const slug = state.themeName.toLowerCase().replace(/\s+/g, '-');
    downloadFile(markdownWithHtml, `${slug || 'contenido'}-html.md`, 'text/markdown');
    dispatch({ type: 'SET_TOAST', message: 'Markdown con HTML exportado' });
    closeMenu();
  };

  const handleImport = async (file: File) => {
    const payload = await readJsonFile(file);
    if (!payload) {
      dispatch({ type: 'SET_TOAST', message: 'Archivo de plantilla no válido' });
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
      dispatch({ type: 'SET_TOAST', message: 'Enlace para compartir copiado' });
    } catch {
      dispatch({ type: 'SET_TOAST', message: 'No se pudo copiar el enlace' });
    }
    closeMenu();
  };

  const handleCopyCss = async () => {
    const css = themeToCssBlock(state.theme);
    try {
      await navigator.clipboard.writeText(css);
      dispatch({ type: 'SET_TOAST', message: 'CSS copiado al portapapeles' });
    } catch {
      dispatch({ type: 'SET_TOAST', message: 'No se pudo copiar el CSS' });
    }
    closeMenu();
  };

  const activePreset = useMemo(
    () =>
      state.activePresetId
        ? state.presets.find((p) => p.id === state.activePresetId) ?? null
        : null,
    [state.activePresetId, state.presets],
  );

  const isDirty = useMemo(() => {
    if (!activePreset) return false;
    const themeChanged =
      JSON.stringify(state.theme) !== JSON.stringify(activePreset.theme);
    const blocksChanged =
      JSON.stringify(state.blocks) !== JSON.stringify(activePreset.blocks);
    const nameChanged = state.themeName.trim() !== activePreset.name;
    return themeChanged || blocksChanged || nameChanged;
  }, [activePreset, state.theme, state.blocks, state.themeName]);

  const handleSavePreset = () => {
    const name = state.themeName.trim();
    if (!name) {
      dispatch({ type: 'SET_TOAST', message: 'Escribe un nombre antes de guardar' });
      return;
    }
    if (activePreset && !isDirty) {
      dispatch({ type: 'SET_TOAST', message: 'No hay cambios que guardar' });
      return;
    }
    dispatch({ type: 'SAVE_PRESET', name });
  };

  const handleSavePresetAs = () => {
    const name = state.themeName.trim();
    if (!name) {
      dispatch({ type: 'SET_TOAST', message: 'Escribe un nombre antes de guardar' });
      return;
    }
    dispatch({ type: 'SAVE_PRESET_AS', name });
  };

  const handleNewPreset = () => {
    dispatch({ type: 'NEW_PRESET' });
  };

  const buildSpecPayload = () => createSpecPayload(state.themeName, state.theme);

  const handleCopySpecLink = async () => {
    const url = encodeSpecShareUrl(buildSpecPayload());
    try {
      await navigator.clipboard.writeText(url);
      dispatch({ type: 'SET_TOAST', message: 'Enlace de especificación copiado' });
    } catch {
      dispatch({ type: 'SET_TOAST', message: 'No se pudo copiar el enlace de especificación' });
    }
    closeMenu();
  };

  const handleOpenSpec = () => {
    const url = encodeSpecShareUrl(buildSpecPayload());
    window.open(url, '_blank', 'noopener,noreferrer');
    closeMenu();
  };

  return (
    <div className="work-area-scroll document-panel">
      <section className="sidebar-section">
        <h2 className="sidebar-section-label">Plantilla</h2>
        <div className="sidebar-name-row">
          <input
            className="theme-name-input"
            value={state.themeName}
            onChange={(e) => dispatch({ type: 'SET_THEME_NAME', name: e.target.value })}
            placeholder="Nombre de la plantilla"
            aria-label="Nombre de la plantilla"
          />
          {isDirty && (
            <span className="preset-dirty-dot" title="Cambios sin guardar" aria-label="Cambios sin guardar">
              •
            </span>
          )}
        </div>

        <div className="preset-toolbar">
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleSavePreset}
            disabled={Boolean(activePreset) && !isDirty}
            title={activePreset ? 'Guarda los cambios en la plantilla actual' : 'Crea una nueva plantilla con el estado actual'}
          >
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleSavePresetAs}
            title="Guarda el estado actual como una plantilla nueva sin modificar la actual"
          >
            Guardar como copia
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleNewPreset}
            title="Empieza una plantilla nueva en blanco"
          >
            Nueva
          </button>
        </div>

        <p className="preset-help">
          {activePreset
            ? isDirty
              ? `Editando "${activePreset.name}" · cambios sin guardar`
              : `Editando "${activePreset.name}" · todo guardado`
            : 'Borrador nuevo · pulsa Guardar para crear una plantilla'}
        </p>

        {state.presets.length > 0 && (
          <ul className="presets-list">
            {state.presets.map((preset) => (
              <li
                key={preset.id}
                className={`preset-item${preset.id === state.activePresetId ? ' preset-item-active' : ''}`}
              >
                <span title={preset.name}>{preset.name}</span>
                <div className="preset-actions">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => dispatch({ type: 'LOAD_PRESET', id: preset.id })}
                  >
                    Cargar
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => dispatch({ type: 'DELETE_PRESET', id: preset.id })}
                  >
                    Eliminar
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
            Compartir y exportar
            <MaterialIcon
              name={MATERIAL_ICONS.expandMore}
              size={18}
              className="actions-menu-trigger-chevron"
            />
          </button>

          {menuOpen && (
            <div className="actions-menu" role="menu">
              <div className="actions-menu-group">
                <div className="actions-menu-label">Compartir</div>
                <label
                  className="actions-menu-checkbox"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={includeBlocks}
                    onChange={(e) => setIncludeBlocks(e.target.checked)}
                  />
                  Incluir el contenido del artículo en el enlace
                </label>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleCopyLink}
                >
                  Copiar enlace para compartir
                </button>
              </div>

              <div className="actions-menu-divider" role="separator" />

              <div className="actions-menu-group">
                <div className="actions-menu-label">Entrega de diseño</div>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleCopyCss}
                >
                  Copiar CSS
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleCopySpecLink}
                >
                  Copiar enlace de especificación
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleOpenSpec}
                >
                  Abrir entrega
                </button>
              </div>

              <div className="actions-menu-divider" role="separator" />

              <div className="actions-menu-group">
                <div className="actions-menu-label">Copia de seguridad</div>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={() => handleExport(false)}
                >
                  Exportar JSON
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={() => handleExport(true)}
                >
                  Exportar + contenido
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleExportMarkdown}
                >
                  Exportar Markdown (.md)
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={handleExportMarkdownWithHtml}
                >
                  Exportar Markdown + HTML (.md)
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="actions-menu-item"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Importar JSON
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
