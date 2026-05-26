import { useState, useRef, useEffect } from 'react';
import { BLOCK_TEMPLATES } from '../../data/blockTemplates';
import { findDefaultBlock } from '../../data/defaultBlocks';
import { useAppState } from '../../store/appState';

const TOOLBAR_VISIBLE_KEY = 'preview-toolbar-visible';

function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

function shortcutLabel(): string {
  return isMac() ? '⌘.' : 'Ctrl+.';
}

function loadVisible(): boolean {
  try {
    const raw = localStorage.getItem(TOOLBAR_VISIBLE_KEY);
    return raw === null ? true : raw === 'true';
  } catch {
    return true;
  }
}

function IconAdd() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.5 5h9M6 5V3.5h4V5M5.5 5l.5 8h4l.5-8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconReset() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 4.5A5 5 0 1 1 4 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M4 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function IconHide() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconToolbar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PreviewToolbar() {
  const { state, dispatch } = useAppState();
  const [visible, setVisible] = useState(loadVisible);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = state.blocks.find((b) => b.id === state.selectedSectionId);
  const selectedIndex = selected
    ? state.blocks.findIndex((b) => b.id === selected.id)
    : -1;

  const toggleVisible = () => {
    setVisible((v) => {
      const next = !v;
      localStorage.setItem(TOOLBAR_VISIBLE_KEY, String(next));
      if (!next) setMenuOpen(false);
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key !== '.') return;
      e.preventDefault();
      setVisible((v) => {
        const next = !v;
        localStorage.setItem(TOOLBAR_VISIBLE_KEY, String(next));
        return next;
      });
      setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  if (!visible) {
    return (
      <button
        type="button"
        className="preview-toolbar-fab"
        onClick={toggleVisible}
        aria-label="Show toolbar"
        title={`Show toolbar (${shortcutLabel()})`}
      >
        <IconToolbar />
      </button>
    );
  }

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
            title="Add block"
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

        <button
          type="button"
          className="preview-toolbar-icon preview-toolbar-icon--danger"
          disabled={!selected || state.blocks.length <= 1}
          onClick={handleDelete}
          aria-label="Delete block"
          title="Delete block"
        >
          <IconTrash />
        </button>

        <button
          type="button"
          className="preview-toolbar-icon"
          disabled={!selected}
          onClick={handleReset}
          aria-label="Reset block"
          title="Reset block"
        >
          <IconReset />
        </button>

        <span
          className="preview-toolbar-badge"
          title={selected ? selected.label : 'No block selected'}
        >
          {selected ? `${selectedIndex + 1}/${state.blocks.length}` : '—'}
        </span>

        <button
          type="button"
          className="preview-toolbar-icon preview-toolbar-icon--ghost"
          onClick={toggleVisible}
          aria-label="Hide toolbar"
          title={`Hide toolbar (${shortcutLabel()})`}
        >
          <IconHide />
        </button>
      </div>
    </div>
  );
}
