"use client";

import type { JSX } from "react";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

export interface SpanGenericTarget {
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

// Base types for cross-platform compatibility
export interface SpanMouseEvent {
  currentTarget: SpanGenericTarget;
  target: SpanGenericTarget;
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

export interface SpanDragEvent {
  currentTarget: SpanGenericTarget;
  target: SpanGenericTarget;
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

export interface SpanKeyboardEvent {
  currentTarget: SpanGenericTarget;
  target: SpanGenericTarget;
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

export type SpanRefObject = Element & {
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

export type SpanProps = {
  children?: React.ReactNode;
  role?: string;
  ariaLabel?: string;
  id?: string;
  title?: string;
  onClick?: (e: SpanMouseEvent) => void;
  onMouseEnter?: (e: SpanMouseEvent) => void;
  onMouseLeave?: (e: SpanMouseEvent) => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  onDrop?: (e: SpanDragEvent) => void;
  onDragOver?: (e: SpanDragEvent) => void;
  onDragLeave?: () => void;
  suppressHydrationWarning?: boolean;
  dangerouslySetInnerHTML?: { __html: string };
  tabIndex?: number;
  onKeyDown?: (e: SpanKeyboardEvent) => void;
} & StyleType;

/**
 * Platform-agnostic Span component for web
 * On web, this is a span element
 * Alias for View to provide more traditional web naming
 */
export const Span = React.forwardRef<SpanRefObject, SpanProps>(
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
    const spanRef = React.useRef<HTMLSpanElement>(null);

    React.useImperativeHandle(ref, (): SpanRefObject => {
      const element = spanRef.current;
      if (!element) {
        return {
          ...document.createElement("span"),
          focus: (): void => undefined,
          blur: (): void => undefined,
          scrollIntoView: (): void => undefined,
          scrollTop: 0,
          scrollHeight: 0,
          clientHeight: 0,
          addEventListener: (): void => undefined,
          removeEventListener: (): void => undefined,
        } as SpanRefObject;
      }
      return {
        ...element,
        focus: (): void => element.focus(),
        blur: (): void => element.blur(),
        scrollIntoView: (options?: {
          behavior?: "auto" | "smooth";
          block?: "start" | "center" | "end" | "nearest";
          inline?: "start" | "center" | "end" | "nearest";
        }): void => element.scrollIntoView(options),
        scrollTop: element.scrollTop,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        addEventListener: (
          type: string,
          listener: (event: Event) => void,
          options?: boolean | AddEventListenerOptions,
        ): void => element.addEventListener(type, listener, options),
        removeEventListener: (
          type: string,
          listener: (event: Event) => void,
          options?: boolean | EventListenerOptions,
        ): void => element.removeEventListener(type, listener, options),
      } as SpanRefObject;
    }, []);

    return (
      <span
        ref={spanRef}
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
      </span>
    );
  },
);

Span.displayName = "Span";
