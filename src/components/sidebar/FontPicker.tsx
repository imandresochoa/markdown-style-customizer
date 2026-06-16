import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FONT_CATEGORY_LABELS,
  FONT_OPTIONS,
  findFontOption,
  type FontCategory,
} from '../../data/fonts';

type Props = {
  value: string;
  categories?: FontCategory[];
  onChange: (value: string) => void;
  ariaLabel?: string;
};

export function FontPicker({ value, categories, onChange, ariaLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () =>
      categories
        ? FONT_OPTIONS.filter((opt) => categories.includes(opt.category))
        : FONT_OPTIONS,
    [categories],
  );

  const grouped = useMemo(() => {
    const map = new Map<FontCategory, typeof options>();
    for (const opt of options) {
      const list = map.get(opt.category) ?? [];
      list.push(opt);
      map.set(opt.category, list);
    }
    return map;
  }, [options]);

  const selected = findFontOption(value);
  const isCustom = !selected && value.trim().length > 0;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setCustomMode(false);
    setOpen(false);
  };

  const triggerLabel = selected?.label ?? (isCustom ? 'Personalizada' : 'Elegir fuente');

  return (
    <div className="font-picker" ref={wrapRef}>
      <button
        type="button"
        className="font-picker-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        style={{ fontFamily: value || undefined }}
      >
        <span className="font-picker-trigger-label">{triggerLabel}</span>
        <span className="font-picker-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="font-picker-menu" role="listbox">
          {[...grouped.entries()].map(([category, opts]) => (
            <div key={category} className="font-picker-group">
              {grouped.size > 1 && (
                <div className="font-picker-group-label">
                  {FONT_CATEGORY_LABELS[category]}
                </div>
              )}
              {opts.map((opt) => {
                const isActive = selected?.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`font-picker-option${isActive ? ' font-picker-option--active' : ''}`}
                    style={{ fontFamily: opt.value }}
                    onClick={() => handleSelect(opt.value)}
                    title={opt.value}
                  >
                    <span className="font-picker-option-name">{opt.label}</span>
                    <span className="font-picker-option-sample">Ag</span>
                  </button>
                );
              })}
            </div>
          ))}

          <div className="font-picker-divider" role="separator" />
          <button
            type="button"
            className={`font-picker-option font-picker-custom${customMode || isCustom ? ' font-picker-option--active' : ''}`}
            onClick={() => setCustomMode(true)}
          >
            Personalizada…
          </button>
        </div>
      )}

      {(customMode || isCustom) && (
        <input
          type="text"
          className="font-picker-custom-input"
          value={value}
          placeholder="p. ej. Georgia, serif"
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${ariaLabel ?? 'Fuente'} personalizada`}
        />
      )}
    </div>
  );
}
