import { useState, useRef, useEffect } from 'react';
import { BLOCK_TEMPLATES } from '../../data/blockTemplates';
import { findDefaultBlock } from '../../data/defaultBlocks';
import { useAppState } from '../../store/appState';

export function PreviewToolbar() {
  const { state, dispatch } = useAppState();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = state.blocks.find((b) => b.id === state.selectedSectionId);
  const selectedIndex = selected
    ? state.blocks.findIndex((b) => b.id === selected.id)
    : -1;

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
    if (!selected) return;
    dispatch({ type: 'DELETE_BLOCK', id: selected.id });
  };

  const handleReset = () => {
    if (!selected) return;
    const defaultBlock = findDefaultBlock(selected.id);
    if (defaultBlock) {
      dispatch({ type: 'RESET_BLOCK', id: selected.id, markdown: defaultBlock.markdown });
      dispatch({ type: 'SET_TOAST', message: 'Block reset' });
    } else {
      dispatch({ type: 'SET_TOAST', message: 'No default for this block' });
    }
  };

  return (
    <div className="preview-toolbar">
      <div className="preview-toolbar-inner">
        <div className="preview-toolbar-group" ref={menuRef}>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            + Add block
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

        <div className="preview-toolbar-divider" />

        <button
          type="button"
          className="btn btn-sm btn-danger"
          disabled={!selected || state.blocks.length <= 1}
          onClick={handleDelete}
        >
          Delete
        </button>

        <button
          type="button"
          className="btn btn-sm"
          disabled={!selected}
          onClick={handleReset}
        >
          Reset
        </button>

        <span className="preview-toolbar-status">
          {selected
            ? `${selectedIndex + 1} / ${state.blocks.length} · ${selected.label}`
            : 'Click a block in the preview to edit'}
        </span>
      </div>
    </div>
  );
}
