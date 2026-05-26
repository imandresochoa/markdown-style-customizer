const TAG_LABELS: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  a: 'link',
  strong: 'strong',
  em: 'em',
  del: 'del',
  code: 'code',
  pre: 'pre',
  blockquote: 'blockquote',
  ul: 'ul',
  ol: 'ol',
  li: 'li',
  table: 'table',
  thead: 'thead',
  tbody: 'tbody',
  tr: 'tr',
  th: 'th',
  td: 'td',
  hr: 'hr',
  img: 'img',
  input: 'checkbox',
};

const SKIP_TAGS = new Set(['html', 'head', 'body', 'script', 'style']);

function labelForElement(el: Element): string | null {
  const tag = el.tagName.toLowerCase();
  if (SKIP_TAGS.has(tag)) return null;

  if (tag === 'li' && el.querySelector(':scope > input[type="checkbox"]')) {
    return 'task';
  }

  if (tag === 'code' && el.closest('pre')) {
    return 'code';
  }

  return TAG_LABELS[tag] ?? tag;
}

function annotateElement(el: Element): void {
  const label = labelForElement(el);
  if (label) {
    el.setAttribute('data-md-tag', label);
    el.classList.add('md-el');
  }

  for (const child of el.children) {
    annotateElement(child);
  }
}

/** Adds data-md-tag attributes for hover labels in the preview */
export function annotateMarkdownHtml(html: string): string {
  if (typeof DOMParser === 'undefined') return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  for (const child of doc.body.children) {
    annotateElement(child);
  }
  return doc.body.innerHTML;
}
