import { STYLE_NAV_CATEGORIES } from '../../theme/controlGroups';

type Props = {
  activeId: string;
  linkedId: string | null;
  onSelect: (id: string) => void;
};

export function StyleElementNav({ activeId, linkedId, onSelect }: Props) {
  return (
    <nav className="style-element-nav" aria-label="Elementos de estilo">
      {STYLE_NAV_CATEGORIES.map((category) => (
        <div key={category.label} className="style-element-category">
          <div className="style-element-category-label">{category.label}</div>
          {category.items.map((item) => {
            const isActive = item.id === activeId;
            const isLinked = linkedId === item.id && !isActive;
            return (
              <button
                key={item.id}
                type="button"
                className={`style-element-item${isActive ? ' style-element-item--active' : ''}${isLinked ? ' style-element-item--linked' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => onSelect(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
