import { ThemeActions } from './ThemeActions';
import { StylePanel } from './StylePanel';

export function WorkArea() {
  return (
    <aside className="work-area">
      <ThemeActions />
      <div className="work-area-scroll">
        <StylePanel />
      </div>
    </aside>
  );
}
