import { useState, useRef, useEffect } from 'react';
import { BLOCK_TEMPLATES } from '../../data/blockTemplates';
import { findDefaultBlock } from '../../data/defaultBlocks';
import { useAppState } from '../../store/appState';

function IconAdd() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconRemoveBlock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.75 4.25h10.5M6 4.25V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.25M5.25 4.25l.55 8.25a.75.75 0 0 0 .75.7h3.1a.75.75 0 0 0 .75-.7l.55-8.25"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M6.75 7v4.25M9.25 7v4.25" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function IconRestoreContent() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4.25 3.5v3h3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M7.25 3.75A5 5 0 1 0 12 8"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M5.5 8.75h4.25a1.75 1.75 0 0 0 0-3.5H7.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function PreviewToolbar() {
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
            <IconAdd />
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

        {hasSelectionActions && (
          <div className="preview-toolbar-selection">
            {canRemove && (
              <button
                type="button"
                className="preview-toolbar-icon preview-toolbar-icon--danger"
                onClick={handleDelete}
                aria-label="Remove selected block"
                title="Remove selected block"
              >
                <IconRemoveBlock />
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
                <IconRestoreContent />
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
