/** Minimal markdown samples per control group for the design spec handoff */
export const SPEC_SAMPLES: Record<string, string> = {
  base: 'Sample paragraph showing base typography, spacing, and default text color for the markdown container.',
  h1: '# Heading Level 1',
  h2: '## Heading Level 2',
  h3: '### Heading Level 3',
  h4: '#### Heading Level 4',
  h5: '##### Heading Level 5',
  h6: '###### Heading Level 6',
  paragraph:
    'This is a standard paragraph. It demonstrates body text color, line height, and vertical spacing between blocks of content.',
  links: 'Visit the [documentation site](https://example.com) for more details about this component.',
  emphasis: 'Text with **bold**, *italic*, and ~~strikethrough~~ emphasis styles applied inline.',
  'inline-code': 'Use the `npm install` command to add dependencies to your project.',
  'code-block': '```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```',
  blockquote:
    '> Design is not just what it looks like and feels like. Design is how it works.\n> — Steve Jobs',
  lists: `- Unordered item one
- Unordered item two

1. Ordered step one
2. Ordered step two`,
  'task-list': '- [x] Completed task\n- [ ] Pending task',
  table: '| Column A | Column B |\n| --- | --- |\n| Cell 1 | Cell 2 |\n| Cell 3 | Cell 4 |',
  'hr-image':
    '---\n\n![Sample image](https://picsum.photos/seed/spec/480/160)',
};

export function getSpecSample(groupId: string): string {
  return SPEC_SAMPLES[groupId] ?? 'Sample content';
}
