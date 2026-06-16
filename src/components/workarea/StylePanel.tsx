import { useEffect, useState } from 'react';
import { CONTROL_GROUPS } from '../../theme/controlGroups';
import { useAppState } from '../../store/appState';
import { StyleControl } from '../sidebar/StyleControl';
import { AccentControl } from '../sidebar/AccentControl';
import { SECTION_STYLE_GROUP } from '../../data/defaultBlocks';
import { resolveFontSizePx } from '../../utils/sizeUnits';

const DEFAULT_TAB_ID = CONTROL_GROUPS[0]?.id ?? 'base';

export function StylePanel() {
  const { state, dispatch } = useAppState();
  const [activeTabId, setActiveTabId] = useState(DEFAULT_TAB_ID);

  const baseFontSizePx = resolveFontSizePx(state.theme['--md-font-size'] ?? '16px');

  const linkedGroupId = state.selectedSectionId
    ? SECTION_STYLE_GROUP[state.selectedSectionId]
    : null;

  useEffect(() => {
    if (linkedGroupId) {
      setActiveTabId(linkedGroupId);
    }
  }, [linkedGroupId]);

  const activeGroup =
    CONTROL_GROUPS.find((group) => group.id === activeTabId) ?? CONTROL_GROUPS[0];

  return (
    <div className="work-panel work-panel--styles">
      <AccentControl />

      <div className="style-tabs" role="tablist" aria-label="Style groups">
        {CONTROL_GROUPS.map((group) => {
          const isActive = group.id === activeTabId;
          const isLinked = linkedGroupId === group.id;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              id={`style-tab-${group.id}`}
              aria-selected={isActive}
              aria-controls={`style-panel-${group.id}`}
              className={`style-tab-pill${isActive ? ' style-tab-pill--active' : ''}${isLinked && !isActive ? ' style-tab-pill--linked' : ''}`}
              onClick={() => setActiveTabId(group.id)}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      <div className="style-tab-scroll">
        {activeGroup && (
          <div
            className="style-tab-panel"
            role="tabpanel"
            id={`style-panel-${activeGroup.id}`}
            aria-labelledby={`style-tab-${activeGroup.id}`}
          >
            <div className="style-tab-panel-header">
              <h2 className="style-tab-panel-title">{activeGroup.label}</h2>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => dispatch({ type: 'RESET_GROUP', groupId: activeGroup.id })}
              >
                Reset
              </button>
            </div>

            <div className="style-tab-panel-body">
              {activeGroup.controls.map((ctrl) => (
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
          </div>
        )}

        <div className="style-reset-all">
          <button type="button" className="btn" onClick={() => dispatch({ type: 'RESET_ALL' })}>
            Reset all styles
          </button>
        </div>
      </div>
    </div>
  );
}
