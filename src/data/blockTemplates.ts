import type { MarkdownBlock } from '../theme/schema';

export type BlockTemplate = {
  id: string;
  label: string;
  markdown: string;
};

export const BLOCK_TEMPLATES: BlockTemplate[] = [
  { id: 'paragraph', label: 'Párrafo', markdown: 'Escribe tu párrafo aquí.' },
  { id: 'h1', label: 'Heading 1', markdown: '# Título' },
  { id: 'h2', label: 'Heading 2', markdown: '## Sección' },
  { id: 'h3', label: 'Heading 3', markdown: '### Subsección' },
  { id: 'h4', label: 'Heading 4', markdown: '#### Heading 4' },
  { id: 'h5', label: 'Heading 5', markdown: '##### Heading 5' },
  { id: 'h6', label: 'Heading 6', markdown: '###### Heading 6' },
  {
    id: 'emphasis',
    label: 'Énfasis',
    markdown: 'Texto con **negrita**, *cursiva* y ~~tachado~~.',
  },
  { id: 'link', label: 'Enlace', markdown: 'Texto con un [enlace](https://example.com).' },
  { id: 'inline-code', label: 'Código inline', markdown: 'Usa `código` en una frase.' },
  {
    id: 'ul',
    label: 'Lista desordenada',
    markdown: '- Elemento uno\n- Elemento dos\n- Elemento tres',
  },
  {
    id: 'ol',
    label: 'Lista ordenada',
    markdown: '1. Primer paso\n2. Segundo paso\n3. Tercer paso',
  },
  {
    id: 'task',
    label: 'Lista de tareas',
    markdown: '- [ ] Tarea pendiente\n- [x] Tarea completada',
  },
  {
    id: 'blockquote',
    label: 'Cita',
    markdown: '> Una cita o nota destacada.',
  },
  {
    id: 'code',
    label: 'Bloque de código',
    markdown: '```\n// tu código\n```',
  },
  {
    id: 'table',
    label: 'Tabla',
    markdown: '| Col A | Col B |\n| --- | --- |\n| A1 | B1 |',
  },
  { id: 'hr', label: 'Separador', markdown: '---' },
  {
    id: 'image',
    label: 'Imagen',
    markdown: '![Descripción](https://picsum.photos/seed/new/600/240)',
  },
];

export function createBlockFromTemplate(template: BlockTemplate): MarkdownBlock {
  return {
    id: crypto.randomUUID(),
    label: template.label,
    markdown: template.markdown,
  };
}
