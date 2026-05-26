import type { MaterialIconName } from './iconNames';

type Props = {
  name: MaterialIconName | string;
  size?: number;
  className?: string;
  filled?: boolean;
};

export function MaterialIcon({ name, size = 20, className, filled }: Props) {
  return (
    <span
      className={`material-symbols-outlined${filled ? ' material-symbols-filled' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      style={{ fontSize: size, width: size, height: size }}
    >
      {name}
    </span>
  );
}
