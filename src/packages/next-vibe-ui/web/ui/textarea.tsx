import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils";
import React from "react";

import type { StyleType } from "../utils/style-type";
import type { InputGenericTarget } from "./input";

export interface TextareaChangeEvent {
  target: {
    value: string;
    name?: string;
    id?: string;
  };
  currentTarget: InputGenericTarget;
  preventDefault: () => void;
  stopPropagation: () => void;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  timeStamp: number;
  type: string;
}

export interface TextareaFocusEvent {
  target: InputGenericTarget;
  currentTarget: InputGenericTarget;
  preventDefault: () => void;
  stopPropagation: () => void;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  timeStamp: number;
  type: string;
}

export interface TextareaKeyboardEvent {
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

export interface TextareaRefObject {
  focus: () => void;
  blur?: () => void;
  select: () => void;
  value?: string;
}

export type TextareaProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  rows?: number;
  name?: string;
  id?: string;
  title?: string;
  maxLength?: number;
  onChangeText?: (text: string) => void;
  onChange?: (e: TextareaChangeEvent) => void;
  onBlur?: (e: TextareaFocusEvent) => void;
  onFocus?: (e: TextareaFocusEvent) => void;
  minRows?: number;
  maxRows?: number;
  onKeyDown?: (e: TextareaKeyboardEvent) => void;
  variant?: VariantProps<typeof textareaVariants>["variant"];
} & StyleType;

export const textareaVariants = cva(
  "flex w-full rounded-md text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-[color,box-shadow] outline-none resize-none overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        ghost:
          "border-none bg-transparent rounded-t-md rounded-b-none focus-visible:ring-0 focus-visible:ring-offset-0 px-6 pb-4 border-b py-2 text-base shadow-xs md:text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const TextareaInner = (
  {
    className,
    style,
    variant,
    minRows = 2,
    maxRows = 10,
    onChange,
    onChangeText,
    onBlur,
    onFocus,
    defaultValue,
    disabled,
    id,
    name,
    maxLength,
    onKeyDown,
    placeholder,
    readOnly,
    required,
    rows,
    title,
    value,
  }: TextareaProps,
  ref: React.ForwardedRef<TextareaRefObject>,
): React.JSX.Element => {
  const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useImperativeHandle(
    ref,
    (): TextareaRefObject => {
      const element = internalRef.current;
      if (!element) {
        return {
          focus: (): void => undefined,
          blur: (): void => undefined,
          select: (): void => undefined,
          value: "",
        };
      }
      return {
        focus: (): void => element.focus(),
        blur: (): void => element.blur(),
        select: (): void => element.select(),
        value: element.value,
      };
    },
    [],
  );

  const adjustHeight = React.useCallback(() => {
    const textarea = internalRef.current;
    if (!textarea) {
      return;
    }

    // Reset height to get accurate scrollHeight
    textarea.style.height = "auto";

    // Calculate line height
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight, 10);
    const paddingTop = parseInt(computedStyle.paddingTop, 10);
    const paddingBottom = parseInt(computedStyle.paddingBottom, 10);

    // Calculate min and max heights
    const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;

    // Set new height within bounds
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight,
    );
    textarea.style.height = `${newHeight}px`;

    // Enable scrolling if content exceeds maxHeight
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [minRows, maxRows]);

  React.useEffect(() => {
    adjustHeight();
  }, [adjustHeight, value, defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    adjustHeight();
    const changeEvent: TextareaChangeEvent = {
      target: {
        value: e.target.value,
        name: e.target.name,
        id: e.target.id,
      },
      currentTarget: e.currentTarget,
      preventDefault: (): void => e.preventDefault(),
      stopPropagation: (): void => e.stopPropagation(),
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      defaultPrevented: e.defaultPrevented,
      eventPhase: e.eventPhase,
      isTrusted: e.isTrusted,
      timeStamp: e.timeStamp,
      type: e.type,
    };
    onChange?.(changeEvent);
    onChangeText?.(e.target.value);
  };

  const content = (
    <textarea
      className={cn(textareaVariants({ variant }), className)}
      style={style}
      ref={internalRef}
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={onFocus}
      defaultValue={defaultValue}
      disabled={disabled}
      id={id}
      name={name}
      maxLength={maxLength}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      rows={rows}
      title={title}
      value={value}
    />
  );

  // Ghost variant needs wrapper for border styling
  if (variant === "ghost") {
    return (
      <div className="overflow-hidden rounded-t-md border-transparent">
        {content}
      </div>
    );
  }

  return content;
};

const Textarea = React.forwardRef(TextareaInner);
Textarea.displayName = "Textarea";

export { Textarea };
