import { useMemo } from 'react';
import { marked } from 'marked';
import type { ControlGroup } from '../../theme/controlGroups';
import type { ThemeVariables } from '../../theme/defaults';
import { getSpecSample } from '../../spec/specSamples';

marked.setOptions({ gfm: true, breaks: true });

type Props = {
  group: ControlGroup;
  theme: ThemeVariables;
};

function toHex6(color: string): string | null {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    const [, r, g, b] = color.match(/^#(.)(.)(.)$/)!;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return null;
}

export function SpecSection({ group, theme }: Props) {
  const markdown = getSpecSample(group.id);

  const html = useMemo(() => {
    try {
      return marked.parse(markdown) as string;
    } catch {
      return '<p>Invalid sample</p>';
    }
  }, [markdown]);

  return (
    <section className="spec-section" id={`spec-${group.id}`}>
      <h2 className="spec-section-title">{group.label}</h2>

      <div className="spec-preview-label">Preview</div>
      <div className="spec-preview-frame">
        <div className="md-preview spec-preview" style={theme as React.CSSProperties}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>

      <div className="spec-table-label">Specifications</div>
      <div className="spec-table-wrap">
        <table className="spec-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Property</th>
              <th>Value</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {group.controls.map((ctrl) => {
              const value = theme[ctrl.key] ?? '';
              const hex = ctrl.type === 'color' ? toHex6(value) : null;
              return (
                <tr key={ctrl.key}>
                  <td>
                    <code>{ctrl.key}</code>
                  </td>
                  <td>{ctrl.label}</td>
                  <td>
                    <span className="spec-value">
                      {hex && (
                        <span
                          className="spec-swatch"
                          style={{ backgroundColor: hex }}
                          aria-hidden="true"
                        />
                      )}
                      {value || '—'}
                    </span>
                  </td>
                  <td>
                    <span className="spec-type">{ctrl.type}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
