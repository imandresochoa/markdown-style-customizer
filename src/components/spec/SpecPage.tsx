import { CONTROL_GROUPS } from '../../theme/controlGroups';
import type { SpecPayload } from '../../theme/schema';
import { encodeSpecShareUrl, themeToCssBlock } from '../../theme/schema';
import { SpecSection } from './SpecSection';
import '../../styles/markdown-theme.css';
import '../../styles/spec.css';

type Props = {
  payload: SpecPayload;
};

export function SpecPage({ payload }: Props) {
  const generatedDate = new Date(payload.generatedAt).toLocaleString();
  const cssBlock = themeToCssBlock(payload.theme);
  const shareUrl = encodeSpecShareUrl(payload);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      /* ignore */
    }
  };

  const handleCopyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssBlock);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="spec-page">
      <header className="spec-header">
        <div className="spec-header-inner">
          <div>
            <p className="spec-eyebrow">Design handoff</p>
            <h1 className="spec-title">{payload.name}</h1>
            <p className="spec-meta">
              Generated {generatedDate} · Selector: <code>.md-preview</code>
            </p>
          </div>
          <div className="spec-header-actions">
            <button type="button" className="btn btn-sm" onClick={handleCopyLink}>
              Copy link
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={handleCopyCss}>
              Copy CSS
            </button>
          </div>
        </div>
        <p className="spec-intro">
          Markdown style specification for development handoff. Each section shows a live preview
          of the element followed by all CSS custom properties and their current values.
        </p>
      </header>

      <main className="spec-main">
        {CONTROL_GROUPS.map((group) => (
          <SpecSection key={group.id} group={group} theme={payload.theme} />
        ))}

        <section className="spec-section spec-section--css">
          <h2 className="spec-section-title">Full CSS export</h2>
          <p className="spec-css-note">
            Apply this block to your markdown container or override individual tokens as needed.
          </p>
          <pre className="spec-css-block">
            <code>{cssBlock}</code>
          </pre>
        </section>
      </main>

      <footer className="spec-footer">
        <p>Markdown Style Customizer · Read-only spec view</p>
      </footer>
    </div>
  );
}
