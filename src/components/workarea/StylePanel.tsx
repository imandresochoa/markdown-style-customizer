import { useState } from 'react';
import { CONTROL_GROUPS } from '../../theme/controlGroups';
import { useAppState } from '../../store/appState';
import { StyleControl } from '../sidebar/StyleControl';
import { GlobalColors } from '../sidebar/GlobalColors';
import { StyleElementNav } from '../sidebar/StyleElementNav';
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

  const [prevLinkedGroupId, setPrevLinkedGroupId] = useState(linkedGroupId);
  if (linkedGroupId && linkedGroupId !== prevLinkedGroupId) {
    setPrevLinkedGroupId(linkedGroupId);
    setActiveTabId(linkedGroupId);
  }

  const activeGroup =
    CONTROL_GROUPS.find((group) => group.id === activeTabId) ?? CONTROL_GROUPS[0];

  return (
    <div className="work-panel work-panel--styles">
      <GlobalColors />

      <div className="style-panel-split">
        <StyleElementNav
          activeId={activeTabId}
          linkedId={linkedGroupId}
          onSelect={setActiveTabId}
        />

        <div className="style-tab-scroll">
          {activeGroup && (
            <div
              className="style-tab-panel"
              role="tabpanel"
              id={`style-panel-${activeGroup.id}`}
              aria-labelledby={`style-nav-${activeGroup.id}`}
            >
              <div className="style-tab-toolbar">
                <span className="style-tab-toolbar-title">{activeGroup.label}</span>
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
    </div>
  );
}
