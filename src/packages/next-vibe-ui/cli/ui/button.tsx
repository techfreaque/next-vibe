/* eslint-disable oxlint-plugin-i18n/no-literal-string */
/**
 * CLI Button
 *
 * Focusable button with Enter/Space to activate onClick.
 * Uses Ink's useFocus for Tab navigation.
 */
import { cva } from "class-variance-authority";
import { Text, useFocus, useInput, useStdin } from "ink";
import { useIsMcp } from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX, ReactNode } from "react";
import { Children, isValidElement, useEffect, useRef } from "react";

import type { ButtonProps } from "../../web/ui/button";
import { isOverlayOpen, useFocusScopeRegister, useShouldFocus } from "./dialog";
import { useDropdownTrigger } from "./dropdown-menu";
import { usePopoverTrigger } from "./popover";

// Stub variants for CLI - CSS classes are unused in terminal rendering
export const buttonVariants = cva("");
export const buttonTextVariants = cva("");
export type { ButtonSize, ButtonVariant } from "../../web/ui/button";

/**
 * True if a string is a meaningful label (more than just an icon/emoji).
 * Single emoji codepoints or 1-2 char strings are treated as icons.
 */
function isLabelText(s: string): boolean {
  const trimmed = s.trim();
  if (trimmed.length === 0) {
    return false;
  }
  // A single grapheme cluster (emoji or 1-char symbol) is not a label.
  // Use spread to count codepoints, not UTF-16 code units.
  return [...trimmed].length > 2;
}

/**
 * Check if React children contain any visible label text (not just icons).
 */
function hasText(node: ReactNode): boolean {
  if (typeof node === "string") {
    return isLabelText(node);
  }
  if (typeof node === "number") {
    return true;
  }
  if (!isValidElement(node)) {
    return false;
  }
  const props = node.props as Record<string, ReactNode>;
  if (props.children) {
    return childrenHaveText(props.children);
  }
  return false;
}

function childrenHaveText(c: ReactNode): boolean {
  if (typeof c === "string") {
    return isLabelText(c);
  }
  if (typeof c === "number") {
    return true;
  }
  if (Array.isArray(c)) {
    return c.some(hasText);
  }
  if (isValidElement(c)) {
    return hasText(c);
  }
  return false;
}

/**
 * Build button label for CLI:
 * - No children → title alone
 * - Children with text → children alone (already labeled)
 * - Icon-only + focused → icon + title (acts like tooltip on hover)
 * - Icon-only + unfocused → icon only (compact)
 */
function buildLabel(
  children: ReactNode,
  title: string | undefined,
  isFocused: boolean,
): ReactNode {
  if (!children) {
    return title;
  }
  const arr = Children.toArray(children);
  if (arr.length === 0) {
    return title;
  }
  if (title && isFocused && !arr.some(hasText)) {
    return (
      <>
        {children} {title}
      </>
    );
  }
  return children;
}

let buttonIdCounter = 0;

export function Button({
  variant,
  children,
  onClick,
  disabled,
  title,
}: ButtonProps): JSX.Element | null {
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();
  const idRef = useRef(`btn-${(buttonIdCounter++).toString()}`);
  const dropdownTrigger = useDropdownTrigger();
  const popoverTrigger = usePopoverTrigger();

  // Register this button's focus ID with parent trigger context for focus restoration
  useEffect(() => {
    if (dropdownTrigger) {
      dropdownTrigger.registerFocusId(idRef.current);
    }
    if (popoverTrigger) {
      popoverTrigger.registerFocusId(idRef.current);
    }
  }, [dropdownTrigger, popoverTrigger]);

  const shouldFocus = useShouldFocus();
  const { isFocused } = useFocus({
    id: idRef.current,
    autoFocus: false,
    isActive: !disabled && shouldFocus,
  });

  // Register with parent Dialog/Popover focus scope (if any) so the
  // container can auto-focus the first item when it opens.
  useFocusScopeRegister(idRef.current);

  if (isFocused) {
    // eslint-disable-next-line no-console
    console.error(`[F] ${idRef.current} ${title ?? "?"}`);
  }

  useInput(
    (input, key) => {
      if (key.return || input === " ") {
        // Double-check focus: useEffectEvent reads the latest isFocused
        // from the render, catching cases where the subscription cleanup
        // hasn't run yet after focus moved away.
        if (!isFocused) {
          return;
        }
        // Suppress button activation while a dialog or popover is open —
        // prevents the wrong handler from firing on Enter/Space.
        if (isOverlayOpen()) {
          return;
        }
        // If inside asChild trigger contexts, toggle the overlay
        if (dropdownTrigger) {
          dropdownTrigger.toggle();
        }
        if (popoverTrigger) {
          popoverTrigger.toggle();
        }
        if (onClick) {
          onClick({ stopPropagation: () => undefined });
        }
      }
    },
    { isActive: isRawModeSupported && !isMcp && isFocused && !disabled },
  );

  if (isMcp) {
    return null;
  }

  // CLI label: show children, append title only when focused (tooltip-like).
  // Skip title when children already has text to avoid duplication.
  const label = buildLabel(children, title, isFocused);

  // Focus indicator: «label» when focused, [label] when not.
  // Text-based so it survives ANSI stripping in agent frame capture.
  const open = isFocused ? "«" : "[";
  const close = isFocused ? "»" : "]";

  if (variant === "destructive") {
    return (
      <Text color={isFocused ? "red" : undefined} dimColor={!isFocused}>
        {open}
        {label}
        {close}
      </Text>
    );
  }

  if (variant === "success") {
    return (
      <Text color={isFocused ? "green" : undefined} dimColor={!isFocused}>
        {open}
        {label}
        {close}
      </Text>
    );
  }

  if (variant === "link") {
    return (
      <Text color="cyan" underline={isFocused}>
        {open}
        {label}
        {close}
      </Text>
    );
  }

  return (
    <Text color={isFocused ? "cyan" : undefined} dimColor={!isFocused}>
      {open}
      {label}
      {close}
    </Text>
  );
}
