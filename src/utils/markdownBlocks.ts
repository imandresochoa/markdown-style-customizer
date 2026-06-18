import { marked } from 'marked';
import type { MarkdownBlock } from '../theme/schema';

type MarkedTokenLike = {
  type: string;
  raw?: string;
  depth?: number;
  ordered?: boolean;
};

function labelForToken(token: MarkedTokenLike): string {
  if (token.type === 'heading') return `Heading ${token.depth ?? ''}`.trim();
  if (token.type === 'paragraph') return 'Párrafo';
  if (token.type === 'blockquote') return 'Cita';
  if (token.type === 'code') return 'Bloque de código';
  if (token.type === 'table') return 'Tabla';
  if (token.type === 'hr') return 'Separador';
  if (token.type === 'list') {
    const raw = token.raw ?? '';
    if (/^\s*[-*+]\s+\[[ xX]\]/m.test(raw)) return 'Lista de tareas';
    return token.ordered ? 'Lista ordenada' : 'Lista desordenada';
  }
  return 'Bloque';
}

/**
 * Splits a markdown document into top-level markdown blocks using marked tokens.
 * This keeps markdown structures like lists/tables/code fences together.
 */
export function detectMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const source = markdown.trim();
  if (!source) {
    return [{ id: crypto.randomUUID(), label: 'Párrafo', markdown: '' }];
  }

  const tokens = marked.lexer(source, { gfm: true, breaks: true }) as MarkedTokenLike[];
  const blocks: MarkdownBlock[] = [];

  for (const token of tokens) {
    if (token.type === 'space') continue;
    const raw = token.raw?.trim();
    if (!raw) continue;

    blocks.push({
      id: crypto.randomUUID(),
      label: labelForToken(token),
      markdown: raw,
    });
  }

  if (blocks.length === 0) {
    return [{ id: crypto.randomUUID(), label: 'Párrafo', markdown: source }];
  }

  return blocks;
}
