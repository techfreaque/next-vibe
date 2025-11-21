"use client";

import type { JSX } from "react";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

export interface DivGenericTarget {
  addEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) => void;
  removeEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ) => void;
  dispatchEvent: (event: Event) => boolean;
  closest?: (selector: string) => Element | null;
  getBoundingClientRect?: () => {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    x: number;
    y: number;
  };
}

export interface DivMouseEvent {
  currentTarget: DivGenericTarget;
  target: DivGenericTarget;
  preventDefault: () => void;
  stopPropagation: () => void;
  isDefaultPrevented: () => boolean;
  isPropagationStopped: () => boolean;
  persist: () => void;
  button: number;
  buttons: number;
  clientX: number;
  clientY: number;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  timeStamp: number;
  type: string;
}

export interface DivDragEvent {
  currentTarget: DivGenericTarget;
  target: DivGenericTarget;
  preventDefault: () => void;
  stopPropagation: () => void;
  dataTransfer: {
    files: FileList;
    getData: (format: string) => string;
    setData: (format: string, data: string) => void;
    dropEffect: string;
    effectAllowed: string;
    items: DataTransferItemList;
    types: readonly string[];
  };
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  timeStamp: number;
  type: string;
}

export interface DivKeyboardEvent {
  currentTarget: DivGenericTarget;
  target: DivGenericTarget;
  key: string;
  code: string;
  preventDefault: () => void;
  stopPropagation: () => void;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  repeat: boolean;
  location: number;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  timeStamp: number;
  type: string;
}

export type DivRefObject = Element & {
  focus?: () => void;
  blur?: () => void;
  scrollIntoView: (options?: {
    behavior?: "auto" | "smooth";
    block?: "start" | "center" | "end" | "nearest";
    inline?: "start" | "center" | "end" | "nearest";
  }) => void;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  addEventListener: (
    type: string,
    listener: (event: Event) => void,
    options?: boolean | AddEventListenerOptions,
  ) => void;
  removeEventListener: (
    type: string,
    listener: (event: Event) => void,
    options?: boolean | EventListenerOptions,
  ) => void;
};

export type DivProps = {
  children?: React.ReactNode;
  role?: string;
  ariaLabel?: string;
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
} & StyleType;

export const Div = React.forwardRef<DivRefObject, DivProps>(
  (
    {
      className,
      style,
      children,
      role,
      ariaLabel,
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
      onKeyDown,
    },
    ref,
  ): JSX.Element => {
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
  },
);

Div.displayName = "Div";
