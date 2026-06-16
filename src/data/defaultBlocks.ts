import type { MarkdownBlock } from '../theme/schema';

function block(id: string, label: string, markdown: string): MarkdownBlock {
  return { id, label, markdown };
}

const LOREM_P1 =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.';

const LOREM_P2 =
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus, sed gravida urna facilisis at. Nullam quis risus eget urna mollis ornare vel eu leo, cum sociis natoque penatibus et magnis dis parturient montes.';

const SAMPLE_IMAGE = 'https://picsum.photos/seed/stylesheet/600/240';

/** Default preview blocks — one sample per markdown element, like a style sheet. */
export const DEFAULT_BLOCKS: MarkdownBlock[] = [
  block('title', 'Título (H1)', '# This is an Headline 1'),
  block('h2', 'Heading 2', '## This is an Headline 2'),
  block('h3', 'Heading 3', '### This is an Headline 3'),
  block('h4', 'Heading 4', '#### This is an Headline 4'),
  block('h5', 'Heading 5', '##### This is an Headline 5'),
  block('h6', 'Heading 6', '###### This is an Headline 6'),
  block('intro', 'Párrafo 1', LOREM_P1),
  block('p-second', 'Párrafo 2', LOREM_P2),
  block(
    'p-emphasis',
    'Énfasis',
    'Texto con **negrita**, *cursiva* y ~~tachado~~ para previsualizar los estilos de énfasis.',
  ),
  block(
    'p-links',
    'Enlace',
    'Párrafo con un [enlace de ejemplo](https://example.com) para ver los estilos de links.',
  ),
  block(
    'p-inline-code',
    'Código inline',
    'Usa el comando `npm install` dentro de una frase para previsualizar el código inline.',
  ),
  block(
    'ul',
    'Lista desordenada',
    '- Primer elemento\n- Segundo elemento\n- Tercer elemento',
  ),
  block(
    'ol',
    'Lista ordenada',
    '1. Primer paso\n2. Segundo paso\n3. Tercer paso',
  ),
  block(
    'tasks',
    'Lista de tareas',
    '- [x] Tarea completada\n- [ ] Tarea pendiente',
  ),
  block(
    'blockquote',
    'Cita',
    '> Esta es una cita de ejemplo para previsualizar el estilo del blockquote.\n> — Autor de ejemplo',
  ),
  block(
    'code',
    'Bloque de código',
    '```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```',
  ),
  block(
    'table',
    'Tabla',
    '| Columna A | Columna B |\n| --- | --- |\n| Celda 1 | Celda 2 |\n| Celda 3 | Celda 4 |',
  ),
  block('hr', 'Separador', '---'),
  block('img', 'Imagen', `![Imagen de ejemplo](${SAMPLE_IMAGE})`),
];

export function cloneDefaultBlocks(): MarkdownBlock[] {
  return DEFAULT_BLOCKS.map((b) => ({ ...b }));
}

export function findDefaultBlock(id: string): MarkdownBlock | undefined {
  return DEFAULT_BLOCKS.find((b) => b.id === id);
}

/** Maps section id to style control group id for sidebar highlight */
export const SECTION_STYLE_GROUP: Record<string, string> = {
  title: 'h1',
  intro: 'paragraph',
  'p-second': 'paragraph',
  'p-emphasis': 'emphasis',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'p-links': 'links',
  'p-inline-code': 'inline-code',
  ul: 'lists',
  ol: 'lists',
  tasks: 'task-list',
  blockquote: 'blockquote',
  code: 'code-block',
  table: 'table',
  hr: 'hr-image',
  img: 'hr-image',
};
