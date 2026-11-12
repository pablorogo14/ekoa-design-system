import * as React from 'react';

export type IconName = 'compass' | 'search' | 'pin' | 'person' | 'chevronLeft' | 'chevronRight' | 'more' | 'up' | 'trash' | 'pencil';

/** SF Symbols-style line icon on a 24 pt grid, drawn in currentColor. Pass `title` only when the icon stands alone. */
export function Icon(props: { name: IconName; size?: number; filled?: boolean; title?: string; className?: string }): JSX.Element;

/** Action button. Label names the action; loading keeps the verb ("Generando viaje…"). */
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'destructive' | 'text';
  size?: 'md' | 'sm';
  block?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}): JSX.Element;

/** Filter or preference pill. Pass `selected` for a toggle; `tone="tinted"` for a soft, always-on chip. */
export function Chip(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; tone?: 'default' | 'tinted' }): JSX.Element;

/** Category label inside a pill. */
export function Badge(props: { tone?: 'nature' | 'food' | 'community' | 'neutral'; children: React.ReactNode; className?: string }): JSX.Element;

/** iOS segmented control, 2–4 short options. */
export function SegmentedControl(props: {
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  'aria-label'?: string;
  className?: string;
}): JSX.Element;

/** iOS switch (51 × 31 pt). Give it an accessible name with `aria-label` or place it in a ListRow. */
export function Switch(props: { checked?: boolean; defaultChecked?: boolean; onChange?: (checked: boolean) => void; disabled?: boolean; 'aria-label'?: string; className?: string }): JSX.Element;

/** Text field with a visible label above it and one message line below (hint or error). */
export function TextField(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }): JSX.Element;

/** Inset grouped list container. Children are ListRow elements. */
export function GroupedList(props: { header?: string; footer?: string; children: React.ReactNode; className?: string }): JSX.Element;

/** Row of a GroupedList. Pass `onClick` to make it a tappable row with a chevron. */
export function ListRow(props: {
  title: string;
  subtitle?: string;
  icon?: IconName | React.ReactNode;
  trailing?: React.ReactNode;
  chevron?: boolean;
  onClick?: () => void;
  className?: string;
}): JSX.Element;

/** Translucent navigation bar, 44 pt. `large` moves the title below the bar in Archivo. */
export function NavigationBar(props: {
  title: string;
  large?: boolean;
  back?: string | boolean;
  onBack?: () => void;
  trailing?: React.ReactNode;
  className?: string;
}): JSX.Element;

/** Bottom tab bar, 83 pt with safe area. 3–5 items; the active one is filled. */
export function TabBar(props: {
  items: { id: string; label: string; icon: IconName }[];
  value: string;
  onChange?: (id: string) => void;
  'aria-label'?: string;
  className?: string;
}): JSX.Element;

/** Bottom sheet over a scrim. Its parent must be position: relative and as tall as the screen. Always includes a visible close button. */
export function Sheet(props: { title: string; closeLabel?: string; onClose?: () => void; children?: React.ReactNode; className?: string }): JSX.Element;
