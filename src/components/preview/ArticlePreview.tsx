import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppState, themeToStyle } from '../../store/appState';
import { ArticleSection } from './ArticleSection';
import { PreviewToolbar } from './PreviewToolbar';
import { blocksToMarkdown } from '../../theme/schema';
import { detectMarkdownBlocks } from '../../utils/markdownBlocks';

export function ArticlePreview() {
  const { state, dispatch } = useAppState();
  const [freeEditMode, setFreeEditMode] = useState(false);
  const fullMarkdown = useMemo(() => blocksToMarkdown(state.blocks), [state.blocks]);
  const [freeMarkdown, setFreeMarkdown] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = state.blocks.findIndex((b) => b.id === active.id);
    const toIndex = state.blocks.findIndex((b) => b.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    dispatch({ type: 'REORDER_BLOCKS', fromIndex, toIndex });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (freeEditMode) return;
    if ((e.target as HTMLElement).closest('.article-section')) return;
    dispatch({ type: 'SELECT_SECTION', id: null });
  };

  const handleToggleFreeEditMode = () => {
    if (freeEditMode) {
      setFreeEditMode(false);
      setFreeMarkdown(fullMarkdown);
      return;
    }
    setFreeMarkdown(fullMarkdown);
    setFreeEditMode(true);
    dispatch({ type: 'SELECT_SECTION', id: null });
  };

  const handleApplyFreeEditMode = () => {
    const blocks = detectMarkdownBlocks(freeMarkdown);
    dispatch({ type: 'SET_BLOCKS', blocks });
    dispatch({ type: 'SELECT_SECTION', id: null });
    dispatch({ type: 'SET_TOAST', message: `${blocks.length} bloques detectados` });
    setFreeEditMode(false);
  };

  const handleCancelFreeEditMode = () => {
    setFreeMarkdown(fullMarkdown);
    setFreeEditMode(false);
  };

  const freeEditDirty = freeMarkdown.trim() !== fullMarkdown.trim();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (freeEditMode) {
        setFreeMarkdown(fullMarkdown);
        setFreeEditMode(false);
        return;
      }
      if (!state.selectedSectionId) return;
      dispatch({ type: 'SELECT_SECTION', id: null });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, state.selectedSectionId, freeEditMode, fullMarkdown]);

  return (
    <main className="article-zone">
      <PreviewToolbar
        freeEditMode={freeEditMode}
        freeEditDirty={freeEditDirty}
        onToggleFreeEditMode={handleToggleFreeEditMode}
        onApplyFreeEditMode={handleApplyFreeEditMode}
        onCancelFreeEditMode={handleCancelFreeEditMode}
      />
      <div
        className="article-viewport md-preview"
        style={themeToStyle(state.theme)}
        onClick={handleCanvasClick}
      >
        <div className="article-viewport-inner" onClick={handleCanvasClick}>
          {freeEditMode ? (
            <textarea
              className="free-canvas-editor"
              value={freeMarkdown}
              onChange={(e) => setFreeMarkdown(e.target.value)}
              placeholder="Pega o escribe Markdown completo aquí..."
              aria-label="Editor libre de markdown"
              spellCheck={false}
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={state.blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {state.blocks.map((block) => (
                  <ArticleSection key={block.id} block={block} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </main>
  );
}
