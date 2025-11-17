import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

// No-op functions to avoid empty function linting errors
const noop = (): void => {
  return undefined;
};
const noopBool = (): boolean => {
  return false;
};

export type InferValueType<T> = T extends "number" ? number : string;

export interface InputEventTarget<T = undefined> {
  value: InferValueType<T>;
  name?: string;
  id?: string;
  files?: FileList | null;
}

export interface InputGenericTarget<T = undefined> {
  addEventListener: (type: string, listener: (event: Event) => void) => void;
  removeEventListener: (type: string, listener: (event: Event) => void) => void;
  dispatchEvent: (event: Event) => boolean;
  getBoundingClientRect: () => {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    x: number;
    y: number;
  };
  value?: InferValueType<T>;
}

export interface InputChangeEvent<T = undefined> {
  target: InputEventTarget<T>;
  currentTarget: InputGenericTarget<T>;
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

export interface InputFocusEvent<T = undefined> {
  target: InputGenericTarget<T>;
  currentTarget: InputGenericTarget<T>;
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

export interface InputKeyboardEvent<T = undefined> {
  key: string;
  code: string;
  preventDefault: () => void;
  stopPropagation: () => void;
  currentTarget: InputGenericTarget<T>;
  target: InputGenericTarget<T>;
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

export interface InputMouseEvent<T = undefined> {
  currentTarget: InputGenericTarget<T>;
  target: InputGenericTarget<T>;
  preventDefault: () => void;
  stopPropagation: () => void;
  button: number;
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

export interface InputRefObject {
  focus: () => void;
  blur?: () => void;
  select?: () => void;
  value?: string;
}

export type InputProps<
  T extends
    | "text"
    | "email"
    | "tel"
    | "url"
    | "password"
    | "number"
    | "date"
    | "time"
    | "file"
    | "hidden"
    | undefined,
> = {
  type?: T;
  value?: InferValueType<T>;
  defaultValue?: InferValueType<T>;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  autoComplete?: string;
  autoCorrect?: string;
  spellCheck?: boolean;
  accept?: string;
  onChange?: (e: InputChangeEvent<T>) => void;
  onChangeText?: (text: string) => void;
  onBlur?: (e: InputFocusEvent<T>) => void;
  onFocus?: (e: InputFocusEvent<T>) => void;
  onClick?: (e: InputMouseEvent<T>) => void;
  onKeyPress?: (e: InputKeyboardEvent<T>) => void;
  onKeyDown?: (e: InputKeyboardEvent<T>) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  editable?: boolean;
  name?: string;
  id?: string;
  "aria-label"?: string;
  ref?: React.RefObject<InputRefObject | null>;
} & StyleType;

const Input = <
  T extends
    | "text"
    | "email"
    | "tel"
    | "url"
    | "password"
    | "number"
    | "date"
    | "time"
    | "file"
    | "hidden"
    | undefined = undefined,
>({
  className,
  style,
  type,
  value,
  defaultValue,
  placeholder,
  disabled,
  readOnly,
  required,
  min,
  max,
  step,
  maxLength,
  autoComplete,
  autoCorrect: _autoCorrect,
  spellCheck,
  accept,
  onChange,
  onChangeText,
  onBlur,
  onFocus,
  onClick,
  onKeyPress,
  onKeyDown,
  autoCapitalize: _autoCapitalize,
  secureTextEntry: _secureTextEntry,
  keyboardType: _keyboardType,
  editable: _editable,
  name,
  id,
  "aria-label": ariaLabel,
  ref,
}: InputProps<T>): React.JSX.Element => {
  return (
    <input
      ref={ref}
      type={type}
      value={value !== undefined ? String(value) : undefined}
      defaultValue={
        defaultValue !== undefined ? String(defaultValue) : undefined
      }
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      min={min}
      max={max}
      step={step}
      maxLength={maxLength}
      autoComplete={autoComplete}
      spellCheck={spellCheck}
      accept={accept}
      name={name}
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      style={style}
      onChange={(e) => {
        const rawValue = e.target.value;
        const typedValue: InferValueType<T> = (
          type === "number" && rawValue !== "" ? Number(rawValue) : rawValue
        ) as InferValueType<T>;

        const elem =
          e.currentTarget instanceof HTMLInputElement ? e.currentTarget : null;

        const changeEvent: InputChangeEvent<T> = {
          target: {
            value: typedValue,
            name: e.target.name,
            id: e.target.id,
            files: e.target.files,
          },
          currentTarget: {
            addEventListener: elem?.addEventListener.bind(elem) ?? noop,
            removeEventListener: elem?.removeEventListener.bind(elem) ?? noop,
            dispatchEvent: elem?.dispatchEvent.bind(elem) ?? noopBool,
            getBoundingClientRect: (): {
              left: number;
              top: number;
              right: number;
              bottom: number;
              width: number;
              height: number;
              x: number;
              y: number;
            } =>
              elem?.getBoundingClientRect() ?? {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                width: 0,
                height: 0,
                x: 0,
                y: 0,
              },
            value: typedValue,
          },
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
        onChangeText?.(rawValue);
      }}
      onClick={
        onClick
          ? (e): void => {
              const elem =
                e.currentTarget instanceof HTMLInputElement
                  ? e.currentTarget
                  : null;
              const targetElem =
                e.target instanceof HTMLInputElement ? e.target : null;
              const customEvent: InputMouseEvent<T> = {
                currentTarget: {
                  addEventListener: elem?.addEventListener.bind(elem) ?? noop,
                  removeEventListener:
                    elem?.removeEventListener.bind(elem) ?? noop,
                  dispatchEvent: elem?.dispatchEvent.bind(elem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    elem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
                target: {
                  addEventListener:
                    targetElem?.addEventListener.bind(targetElem) ?? noop,
                  removeEventListener:
                    targetElem?.removeEventListener.bind(targetElem) ?? noop,
                  dispatchEvent:
                    targetElem?.dispatchEvent.bind(targetElem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    targetElem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
                preventDefault: (): void => e.preventDefault(),
                stopPropagation: (): void => e.stopPropagation(),
                button: e.button,
                clientX: e.clientX,
                clientY: e.clientY,
                bubbles: e.bubbles,
                cancelable: e.cancelable,
                defaultPrevented: e.defaultPrevented,
                eventPhase: e.eventPhase,
                isTrusted: e.isTrusted,
                timeStamp: e.timeStamp,
                type: e.type,
              };
              onClick(customEvent);
            }
          : undefined
      }
      onBlur={
        onBlur
          ? (e): void => {
              const elem =
                e.currentTarget instanceof HTMLInputElement
                  ? e.currentTarget
                  : null;
              const targetElem =
                e.target instanceof HTMLInputElement ? e.target : null;
              const customEvent: InputFocusEvent<T> = {
                target: {
                  addEventListener:
                    targetElem?.addEventListener.bind(targetElem) ?? noop,
                  removeEventListener:
                    targetElem?.removeEventListener.bind(targetElem) ?? noop,
                  dispatchEvent:
                    targetElem?.dispatchEvent.bind(targetElem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    targetElem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
                currentTarget: {
                  addEventListener: elem?.addEventListener.bind(elem) ?? noop,
                  removeEventListener:
                    elem?.removeEventListener.bind(elem) ?? noop,
                  dispatchEvent: elem?.dispatchEvent.bind(elem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    elem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
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
              onBlur(customEvent);
            }
          : undefined
      }
      onFocus={
        onFocus
          ? (e): void => {
              const elem =
                e.currentTarget instanceof HTMLInputElement
                  ? e.currentTarget
                  : null;
              const targetElem =
                e.target instanceof HTMLInputElement ? e.target : null;
              const customEvent: InputFocusEvent<T> = {
                target: {
                  addEventListener:
                    targetElem?.addEventListener.bind(targetElem) ?? noop,
                  removeEventListener:
                    targetElem?.removeEventListener.bind(targetElem) ?? noop,
                  dispatchEvent:
                    targetElem?.dispatchEvent.bind(targetElem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    targetElem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
                currentTarget: {
                  addEventListener: elem?.addEventListener.bind(elem) ?? noop,
                  removeEventListener:
                    elem?.removeEventListener.bind(elem) ?? noop,
                  dispatchEvent: elem?.dispatchEvent.bind(elem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    elem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
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
              onFocus(customEvent);
            }
          : undefined
      }
      onKeyPress={
        onKeyPress
          ? (e): void => {
              const elem =
                e.currentTarget instanceof HTMLInputElement
                  ? e.currentTarget
                  : null;
              const targetElem =
                e.target instanceof HTMLInputElement ? e.target : null;
              const customEvent: InputKeyboardEvent<T> = {
                key: e.key,
                code: e.code,
                preventDefault: (): void => e.preventDefault(),
                stopPropagation: (): void => e.stopPropagation(),
                currentTarget: {
                  addEventListener: elem?.addEventListener.bind(elem) ?? noop,
                  removeEventListener:
                    elem?.removeEventListener.bind(elem) ?? noop,
                  dispatchEvent: elem?.dispatchEvent.bind(elem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    elem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
                target: {
                  addEventListener:
                    targetElem?.addEventListener.bind(targetElem) ?? noop,
                  removeEventListener:
                    targetElem?.removeEventListener.bind(targetElem) ?? noop,
                  dispatchEvent:
                    targetElem?.dispatchEvent.bind(targetElem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    targetElem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
                repeat: e.repeat,
                location: e.location,
                bubbles: e.bubbles,
                cancelable: e.cancelable,
                defaultPrevented: e.defaultPrevented,
                eventPhase: e.eventPhase,
                isTrusted: e.isTrusted,
                timeStamp: e.timeStamp,
                type: e.type,
              };
              onKeyPress(customEvent);
            }
          : undefined
      }
      onKeyDown={
        onKeyDown
          ? (e): void => {
              const elem =
                e.currentTarget instanceof HTMLInputElement
                  ? e.currentTarget
                  : null;
              const targetElem =
                e.target instanceof HTMLInputElement ? e.target : null;
              const customEvent: InputKeyboardEvent<T> = {
                key: e.key,
                code: e.code,
                preventDefault: (): void => e.preventDefault(),
                stopPropagation: (): void => e.stopPropagation(),
                currentTarget: {
                  addEventListener: elem?.addEventListener.bind(elem) ?? noop,
                  removeEventListener:
                    elem?.removeEventListener.bind(elem) ?? noop,
                  dispatchEvent: elem?.dispatchEvent.bind(elem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    elem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
                target: {
                  addEventListener:
                    targetElem?.addEventListener.bind(targetElem) ?? noop,
                  removeEventListener:
                    targetElem?.removeEventListener.bind(targetElem) ?? noop,
                  dispatchEvent:
                    targetElem?.dispatchEvent.bind(targetElem) ?? noopBool,
                  getBoundingClientRect: (): {
                    left: number;
                    top: number;
                    right: number;
                    bottom: number;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                  } =>
                    targetElem?.getBoundingClientRect() ?? {
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 0,
                      height: 0,
                      x: 0,
                      y: 0,
                    },
                },
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
                repeat: e.repeat,
                location: e.location,
                bubbles: e.bubbles,
                cancelable: e.cancelable,
                defaultPrevented: e.defaultPrevented,
                eventPhase: e.eventPhase,
                isTrusted: e.isTrusted,
                timeStamp: e.timeStamp,
                type: e.type,
              };
              onKeyDown(customEvent);
            }
          : undefined
      }
    />
  );
};

export { Input };
