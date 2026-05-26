import { ThemeActions } from './ThemeActions';
import { StylePanel } from './StylePanel';

export function WorkArea() {
  return (
    <aside className="work-area">
      <ThemeActions />
      <StylePanel />
    </aside>
  );
}
