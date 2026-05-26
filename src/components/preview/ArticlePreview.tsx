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

export function ArticlePreview() {
  const { state, dispatch } = useAppState();

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
    if (e.target === e.currentTarget) {
      dispatch({ type: 'SELECT_SECTION', id: null });
    }
  };

  return (
    <main className="article-zone">
      <div className="article-canvas" onClick={handleCanvasClick}>
        <div className="article-page">
          <div className="md-preview" style={themeToStyle(state.theme)}>
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
          </div>
        </div>
      </div>
      <PreviewToolbar />
    </main>
  );
}
