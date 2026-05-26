import { useMemo, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { marked } from 'marked';
import type { MarkdownBlock } from '../../theme/schema';
import { useAppState } from '../../store/appState';
import { annotateMarkdownHtml } from '../../utils/annotateMarkdownHtml';

marked.setOptions({ gfm: true, breaks: true });

type Props = {
  block: MarkdownBlock;
  isDragging?: boolean;
};

export function ArticleSection({ block, isDragging }: Props) {
  const { state, dispatch } = useAppState();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSelected = state.selectedSectionId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: block.id });

  const html = useMemo(() => {
    try {
      const raw = marked.parse(block.markdown) as string;
      return annotateMarkdownHtml(raw);
    } catch {
      return '<p>Invalid markdown</p>';
    }
  }, [block.markdown]);

  useEffect(() => {
    if (isSelected && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isSelected, block.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragging = isDragging || isSortableDragging;

  const handleSelect = () => {
    dispatch({ type: 'SELECT_SECTION', id: block.id });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`article-section${dragging ? ' article-section--dragging' : ''}${isSelected ? ' article-section--selected' : ''}`}
      onClick={handleSelect}
    >
      <button
        type="button"
        className="drag-handle"
        aria-label={`Reorder ${block.label}`}
        onClick={(e) => e.stopPropagation()}
        {...attributes}
        {...listeners}
      >
        <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true">
          <circle cx="2.5" cy="2.5" r="1.5" />
          <circle cx="7.5" cy="2.5" r="1.5" />
          <circle cx="2.5" cy="8" r="1.5" />
          <circle cx="7.5" cy="8" r="1.5" />
          <circle cx="2.5" cy="13.5" r="1.5" />
          <circle cx="7.5" cy="13.5" r="1.5" />
        </svg>
      </button>

      {isSelected ? (
        <textarea
          ref={textareaRef}
          className="section-inline-editor"
          value={block.markdown}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_BLOCK', id: block.id, markdown: e.target.value })
          }
          onClick={(e) => e.stopPropagation()}
          aria-label={`Edit ${block.label}`}
          spellCheck={false}
        />
      ) : (
        <div className="article-section-content" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  );
}
