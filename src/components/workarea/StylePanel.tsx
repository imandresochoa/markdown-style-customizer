import { useState } from 'react';
import { CONTROL_GROUPS } from '../../theme/controlGroups';
import { useAppState } from '../../store/appState';
import { StyleControl } from '../sidebar/StyleControl';
import { GlobalColors } from '../sidebar/GlobalColors';
import { StyleElementNav } from '../sidebar/StyleElementNav';
import { SECTION_STYLE_GROUP } from '../../data/defaultBlocks';
import { resolveFontSizePx } from '../../utils/sizeUnits';

const COLORS_TAB_ID = 'colors';
const DEFAULT_TAB_ID = COLORS_TAB_ID;

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

  const isColorsTab = activeTabId === COLORS_TAB_ID;
  const activeGroup =
    CONTROL_GROUPS.find((group) => group.id === activeTabId) ?? CONTROL_GROUPS[0];

  return (
    <div className="work-panel work-panel--styles">
      <div className="style-panel-split">
        <StyleElementNav
          activeId={activeTabId}
          linkedId={linkedGroupId}
          onSelect={setActiveTabId}
        />

        <div className="style-tab-scroll">
          {isColorsTab ? (
            <div className="style-tab-panel" role="tabpanel">
              <div className="style-tab-toolbar">
                <span className="style-tab-toolbar-title">Colores</span>
              </div>
              <GlobalColors />
            </div>
          ) : (
            activeGroup && (
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
            )
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
