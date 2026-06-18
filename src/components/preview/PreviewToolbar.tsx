import { useState, useRef, useEffect } from 'react';
import { BLOCK_TEMPLATES } from '../../data/blockTemplates';
import { findDefaultBlock } from '../../data/defaultBlocks';
import { useAppState } from '../../store/appState';
import { MaterialIcon } from '../icons/MaterialIcon';
import { MATERIAL_ICONS } from '../icons/iconNames';

type Props = {
  freeEditMode: boolean;
  freeEditDirty: boolean;
  onToggleFreeEditMode: () => void;
  onApplyFreeEditMode: () => void;
  onCancelFreeEditMode: () => void;
};

export function PreviewToolbar({
  freeEditMode,
  freeEditDirty,
  onToggleFreeEditMode,
  onApplyFreeEditMode,
  onCancelFreeEditMode,
}: Props) {
  const { state, dispatch } = useAppState();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = state.blocks.find((b) => b.id === state.selectedSectionId);
  const selectedIndex = selected
    ? state.blocks.findIndex((b) => b.id === selected.id)
    : -1;
  const canRemove = Boolean(selected && state.blocks.length > 1);
  const canRestore = Boolean(selected && findDefaultBlock(selected.id));
  const hasSelectionActions = canRemove || canRestore;

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

  const handleAdd = (templateId: string) => {
    dispatch({
      type: 'ADD_BLOCK',
      templateId,
      afterId: state.selectedSectionId,
    });
    setMenuOpen(false);
  };

  const handleDelete = () => {
    if (!selected || !canRemove) return;
    dispatch({ type: 'DELETE_BLOCK', id: selected.id });
  };

  const handleReset = () => {
    if (!selected || !canRestore) return;
    const defaultBlock = findDefaultBlock(selected.id);
    if (defaultBlock) {
      dispatch({ type: 'RESET_BLOCK', id: selected.id, markdown: defaultBlock.markdown });
      dispatch({ type: 'SET_TOAST', message: 'Block reset' });
    }
  };

  return (
    <div className="preview-toolbar-float" role="toolbar" aria-label="Block actions">
      <div className="preview-toolbar-inner">
        <button
          type="button"
          className={`preview-toolbar-icon${freeEditMode ? ' preview-toolbar-icon--active' : ''}`}
          onClick={onToggleFreeEditMode}
          aria-label={freeEditMode ? 'Volver al modo por bloques' : 'Activar edición libre'}
          title={freeEditMode ? 'Volver al modo por bloques' : 'Activar edición libre'}
        >
          <MaterialIcon name="edit_note" size={18} />
        </button>

        {freeEditMode && (
          <div className="preview-toolbar-selection">
            <button
              type="button"
              className="preview-toolbar-icon preview-toolbar-icon--primary"
              onClick={onApplyFreeEditMode}
              aria-label="Aplicar markdown y detectar bloques"
              title="Aplicar markdown y detectar bloques"
            >
              <MaterialIcon name="done" size={18} />
            </button>
            {freeEditDirty && (
              <button
                type="button"
                className="preview-toolbar-icon preview-toolbar-icon--danger"
                onClick={onCancelFreeEditMode}
                aria-label="Cancelar edición libre"
                title="Cancelar edición libre"
              >
                <MaterialIcon name="close" size={18} />
              </button>
            )}
          </div>
        )}

        {!freeEditMode && (
        <div className="preview-toolbar-group" ref={menuRef}>
          <button
            type="button"
            className="preview-toolbar-icon preview-toolbar-icon--primary"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Add block"
            title="Add block below selection…"
          >
            <MaterialIcon name={MATERIAL_ICONS.add} size={18} filled />
          </button>
          {menuOpen && (
            <div className="preview-toolbar-menu" role="menu">
              {BLOCK_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  role="menuitem"
                  className="preview-toolbar-menu-item"
                  onClick={() => handleAdd(template.id)}
                >
                  {template.label}
                </button>
              ))}
            </div>
          )}
        </div>
        )}

        {!freeEditMode && hasSelectionActions && (
          <div className="preview-toolbar-selection">
            {canRemove && (
              <button
                type="button"
                className="preview-toolbar-icon preview-toolbar-icon--danger"
                onClick={handleDelete}
                aria-label="Remove selected block"
                title="Remove selected block"
              >
                <MaterialIcon name={MATERIAL_ICONS.delete} size={18} />
              </button>
            )}

            {canRestore && (
              <button
                type="button"
                className="preview-toolbar-icon"
                onClick={handleReset}
                aria-label="Restore original content"
                title="Restore original content"
              >
                <MaterialIcon name={MATERIAL_ICONS.restore} size={18} />
              </button>
            )}

            {selected && (
              <span
                className="preview-toolbar-badge"
                title={selected.label}
              >
                {selectedIndex + 1}/{state.blocks.length}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
