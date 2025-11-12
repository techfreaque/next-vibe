import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

export interface InputEventTarget<T extends string = string> {
  value: T extends "number" ? number : string;
  name?: string;
  id?: string;
  files?: FileList | null;
}

export interface InputGenericTarget<T = string> {
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
  value?: T;
}

export interface InputChangeEvent<T extends string = string> {
  target: InputEventTarget<T>;
  currentTarget: InputGenericTarget<
    T extends "number" ? number : string
  >;
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

export interface InputFocusEvent<T = string> {
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

export interface InputKeyboardEvent<T = string> {
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

export interface InputMouseEvent<T = string> {
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

export interface InputProps<T extends string = string> {
  className?: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "password"
    | "number"
    | "date"
    | "time"
    | "file"
    | "hidden";
  value?: T extends "number" ? number : string;
  defaultValue?: T extends "number" ? number : string;
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
  onBlur?: ((e: InputFocusEvent) => void) | (() => void);
  onFocus?: ((e: InputFocusEvent) => void) | (() => void);
  onClick?: (e: InputMouseEvent) => void;
  onKeyPress?: (e: InputKeyboardEvent) => void;
  onKeyDown?: (e: InputKeyboardEvent) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  editable?: boolean;
  name?: string;
  id?: string;
  "aria-label"?: string;
  ref?: React.RefObject<InputRefObject | null>;
}

function Input<T extends string = string>({
  className,
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
}: InputProps<T>): React.JSX.Element {
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
      onChange={(e) => {
        const rawValue = e.target.value;
        const typedValue:
          | string
          | number =
          type === "number" && rawValue !== "" ? Number(rawValue) : rawValue;

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
            addEventListener:
              elem?.addEventListener.bind(elem) ?? ((): void => {}),
            removeEventListener:
              elem?.removeEventListener.bind(elem) ?? ((): void => {}),
            dispatchEvent:
              elem?.dispatchEvent.bind(elem) ?? ((): boolean => false),
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
        onChange?.(changeEvent);
        onChangeText?.(e.target.value);
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
              const customEvent: InputMouseEvent = {
                currentTarget: {
                  addEventListener:
                    elem?.addEventListener.bind(elem) ?? ((): void => {}),
                  removeEventListener:
                    elem?.removeEventListener.bind(elem) ?? ((): void => {}),
                  dispatchEvent:
                    elem?.dispatchEvent.bind(elem) ?? ((): boolean => false),
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
                    targetElem?.addEventListener.bind(targetElem) ??
                    ((): void => {}),
                  removeEventListener:
                    targetElem?.removeEventListener.bind(targetElem) ??
                    ((): void => {}),
                  dispatchEvent:
                    targetElem?.dispatchEvent.bind(targetElem) ??
                    ((): boolean => false),
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
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyPress={
        onKeyPress
          ? (e): void => {
              const elem =
                e.currentTarget instanceof HTMLInputElement
                  ? e.currentTarget
                  : null;
              const targetElem =
                e.target instanceof HTMLInputElement ? e.target : null;
              const customEvent: InputKeyboardEvent = {
                key: e.key,
                code: e.code,
                preventDefault: (): void => e.preventDefault(),
                stopPropagation: (): void => e.stopPropagation(),
                currentTarget: {
                  addEventListener:
                    elem?.addEventListener.bind(elem) ?? ((): void => {}),
                  removeEventListener:
                    elem?.removeEventListener.bind(elem) ?? ((): void => {}),
                  dispatchEvent:
                    elem?.dispatchEvent.bind(elem) ?? ((): boolean => false),
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
                    targetElem?.addEventListener.bind(targetElem) ??
                    ((): void => {}),
                  removeEventListener:
                    targetElem?.removeEventListener.bind(targetElem) ??
                    ((): void => {}),
                  dispatchEvent:
                    targetElem?.dispatchEvent.bind(targetElem) ??
                    ((): boolean => false),
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
              const customEvent: InputKeyboardEvent = {
                key: e.key,
                code: e.code,
                preventDefault: (): void => e.preventDefault(),
                stopPropagation: (): void => e.stopPropagation(),
                currentTarget: {
                  addEventListener:
                    elem?.addEventListener.bind(elem) ?? ((): void => {}),
                  removeEventListener:
                    elem?.removeEventListener.bind(elem) ?? ((): void => {}),
                  dispatchEvent:
                    elem?.dispatchEvent.bind(elem) ?? ((): boolean => false),
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
                    targetElem?.addEventListener.bind(targetElem) ??
                    ((): void => {}),
                  removeEventListener:
                    targetElem?.removeEventListener.bind(targetElem) ??
                    ((): void => {}),
                  dispatchEvent:
                    targetElem?.dispatchEvent.bind(targetElem) ??
                    ((): boolean => false),
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
}

export { Input };
