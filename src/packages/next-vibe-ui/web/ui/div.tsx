import type { JSX } from "react";

export interface DivMouseEvent {
  currentTarget?: {
    blur?: () => void;
    focus?: () => void;
  };
  target?: {
    blur?: () => void;
    focus?: () => void;
  };
  preventDefault?: () => void;
  stopPropagation?: () => void;
  button?: number;
  clientX?: number;
  clientY?: number;
}

export interface DivDragEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
  dataTransfer?: {
    files?: FileList;
    getData?: (format: string) => string;
    setData?: (format: string, data: string) => void;
  };
  currentTarget?: {
    blur?: () => void;
    focus?: () => void;
  };
}

export interface DivKeyboardEvent {
  key: string;
  code?: string;
  preventDefault?: () => void;
  stopPropagation?: () => void;
  currentTarget?: {
    blur?: () => void;
    focus?: () => void;
  };
}

export interface DivProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  ref?: (node: { focus?: () => void; blur?: () => void; scrollTo?: (x: number, y: number) => void } | null) => void;
  role?: string;
  "aria-label"?: string;
  id?: string;
  title?: string;
  onClick?: (e: DivMouseEvent) => void;
  onMouseEnter?: (e: DivMouseEvent) => void;
  onMouseLeave?: (e: DivMouseEvent) => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  onDrop?: (e: DivDragEvent) => void;
  onDragOver?: (e: DivDragEvent) => void;
  onDragLeave?: () => void;
  suppressHydrationWarning?: boolean;
  dangerouslySetInnerHTML?: { __html: string };
  tabIndex?: number;
  onKeyDown?: (e: DivKeyboardEvent) => void;
}

/**
 * Platform-agnostic Div component for web
 * On web, this is a div element
 * Alias for View to provide more traditional web naming
 */
export function Div({
  ref,
  className,
  children,
  style,
  role,
  "aria-label": ariaLabel,
  id,
  title,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onDrop,
  onDragOver,
  onDragLeave,
  suppressHydrationWarning,
  dangerouslySetInnerHTML,
  tabIndex,
  onKeyDown
}: DivProps): JSX.Element {
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      role={role}
      aria-label={ariaLabel}
      id={id}
      title={title}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      suppressHydrationWarning={suppressHydrationWarning}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
