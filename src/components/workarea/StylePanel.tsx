import { useState } from 'react';
import { CONTROL_GROUPS } from '../../theme/controlGroups';
import { useAppState } from '../../store/appState';
import { StyleControl } from '../sidebar/StyleControl';
import { SECTION_STYLE_GROUP } from '../../data/defaultBlocks';
import { resolveFontSizePx } from '../../utils/sizeUnits';

export function StylePanel() {
  const { state, dispatch } = useAppState();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const baseFontSizePx = resolveFontSizePx(state.theme['--md-font-size'] ?? '16px');

  const activeGroupId = state.selectedSectionId
    ? SECTION_STYLE_GROUP[state.selectedSectionId]
    : null;

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
      <div className="work-panel work-panel--styles">
        <div className="work-panel-header">Estilos</div>
        <div className="style-groups">
        {CONTROL_GROUPS.map((group) => {
          const isCollapsed = collapsed[group.id] ?? false;
          const isHighlighted = activeGroupId === group.id;
          return (
            <div
              key={group.id}
              className={`control-group${isHighlighted ? ' control-group--highlight' : ''}`}
              data-group-id={group.id}
            >
              <div
                className="control-group-header"
                onClick={() => toggleGroup(group.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleGroup(group.id)}
              >
                <span>
                  {isCollapsed ? '▸' : '▾'} {group.label}
                </span>
                <div className="control-group-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => dispatch({ type: 'RESET_GROUP', groupId: group.id })}
                  >
                    Reset
                  </button>
                </div>
              </div>
              {!isCollapsed && (
                <div className="control-group-body">
                  {group.controls.map((ctrl) => (
                    <StyleControl
                      key={ctrl.key}
                      def={ctrl}
                      value={state.theme[ctrl.key] ?? ''}
                      baseFontSizePx={baseFontSizePx}
                      onChange={(value) =>
                        dispatch({ type: 'SET_THEME_VAR', key: ctrl.key, value })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="style-reset-all">
          <button type="button" className="btn" onClick={() => dispatch({ type: 'RESET_ALL' })}>
            Reset all styles
          </button>
        </div>
      </div>
    </div>
  );
}
