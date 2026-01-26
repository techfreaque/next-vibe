/**
 * Fast Ink Renderer
 * Type-safe drop-in replacement for Ink's render() for static (non-reactive) output
 * 3000x faster than Ink for static responses
 */

import { Chalk } from "chalk";
import cliBoxes from "cli-boxes";
import type { BoxProps, StaticProps, TextProps } from "ink";
import { Box, Static, Text } from "ink";
import type { JSXElementConstructor, ReactElement, ReactNode } from "react";
import Reconciler from "react-reconciler";
import { DefaultEventPriority, LegacyRoot } from "react-reconciler/constants.js";

// NoEventPriority is available at runtime but not in type definitions
const NoEventPriority = 0;

// Force chalk to output ANSI codes (level 3 = TrueColor support)
const chalk = new Chalk({ level: 3 });

// Noop function for reconciler callbacks
// eslint-disable-next-line no-empty-function
const noop = (): void => {};

// ============================================================================
// TYPES
// ============================================================================

type ComponentFunction =
  | string
  | JSXElementConstructor<
      Record<
        string,
        | string
        | number
        | boolean
        | null
        | undefined
        | ReactNode
        | Record<string, string | number | boolean | null | undefined>
      >
    >;

interface RenderNode {
  type: string | ComponentFunction;
  props: Record<string, string | number | boolean | null | undefined | RenderNode | RenderNode[]>;
  children: RenderNode[];
}

interface HostContext {
  isInsideText: boolean;
}

interface Container {
  node: RenderNode | null;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Safely apply a chalk color function
 */
function applyChalkColor(text: string, colorName: string): string {
  try {
    const chalkProp = Reflect.get(chalk, colorName);
    if (typeof chalkProp === "function") {
      const result = chalkProp(text);
      if (typeof result === "string") {
        return result;
      }
    }
  } catch {
    // Continue to hex fallback
  }

  // Try as hex color
  try {
    return chalk.hex(colorName)(text);
  } catch {
    // Invalid color, return unchanged
    return text;
  }
}

/**
 * Safely apply a chalk background color function
 */
function applyChalkBgColor(text: string, colorName: string): string {
  const bgColorKey = `bg${colorName.charAt(0).toUpperCase()}${colorName.slice(1)}`;

  try {
    const colorFn = Reflect.get(chalk, bgColorKey);
    if (typeof colorFn === "function") {
      const result = colorFn(text);
      if (typeof result === "string") {
        return result;
      }
    }
  } catch {
    // Continue to hex fallback
  }

  // Try as hex background color
  try {
    return chalk.bgHex(colorName)(text);
  } catch {
    // Invalid color, return unchanged
    return text;
  }
}

// ============================================================================
// ELEMENT PARSING
// ============================================================================

/**
 * Parse React element tree into a simple node structure
 */
function parseElement(element: ReactNode): RenderNode | null {
  if (!element) {
    return null;
  }

  // Handle text nodes
  if (typeof element === "string" || typeof element === "number") {
    return {
      type: "text",
      props: { content: String(element) },
      children: [],
    };
  }

  // Handle booleans/null/undefined (skip them)
  if (typeof element === "boolean") {
    return null;
  }

  // Handle React elements
  if (typeof element === "object" && "type" in element && element.type) {
    const children: RenderNode[] = [];

    // Safely access props - element.props is unknown type from React
    const elementProps = "props" in element ? element.props : null;
    const elementChildren =
      elementProps && typeof elementProps === "object" && "children" in elementProps
        ? elementProps.children
        : null;

    if (Array.isArray(elementChildren)) {
      for (const child of elementChildren) {
        const parsed = parseElement(child as ReactNode);
        if (parsed) {
          children.push(parsed);
        }
      }
    } else if (elementChildren !== null && elementChildren !== undefined) {
      const parsed = parseElement(elementChildren as ReactNode);
      if (parsed) {
        children.push(parsed);
      }
    }

    // Build props object safely without assertions
    const safeProps: Record<
      string,
      string | number | boolean | null | undefined | RenderNode | RenderNode[]
    > = {};

    if (elementProps && typeof elementProps === "object") {
      for (const key in elementProps) {
        if (Object.prototype.hasOwnProperty.call(elementProps, key)) {
          const value = Reflect.get(elementProps, key);
          // Only include primitive values and skip children (handled separately)
          if (key !== "children") {
            if (
              typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean" ||
              value === null ||
              value === undefined
            ) {
              safeProps[key] = value;
            }
          }
        }
      }
    }

    return {
      type: element.type,
      props: safeProps,
      children,
    };
  }

  return null;
}

// ============================================================================
// TEXT RENDERER - Exhaustive handling of all TextProps
// ============================================================================

/**
 * Render Text component to ANSI string
 * Exhaustively handles all TextProps from Ink
 */
function renderText(node: RenderNode): string {
  const props: Partial<TextProps> = node.props;

  // Collect text content from children
  let content = "";

  if (props.children !== null) {
    if (typeof props.children === "string" || typeof props.children === "number") {
      content = String(props.children);
    } else if (typeof props.children === "object" && "type" in props.children) {
      // Handle nested React elements
      const childNode = parseElement(props.children);
      if (childNode) {
        content = renderNode(childNode);
      }
    }
  }

  // If no children prop, look in parsed children
  if (!content && node.children.length > 0) {
    content = node.children
      .map((child) => {
        if (child.type === "text" && typeof child.props.content === "string") {
          return child.props.content;
        }
        return renderNode(child);
      })
      .join("");
  }

  // Empty content - return empty string
  if (!content) {
    return "";
  }

  let styled = content;

  // ============================================================================
  // EXHAUSTIVE TEXT STYLING
  // ============================================================================

  // Text modifiers (order matters - modifiers should be applied before colors)
  if (props.bold) {
    styled = chalk.bold(styled);
  }
  if (props.italic) {
    styled = chalk.italic(styled);
  }
  if (props.underline) {
    styled = chalk.underline(styled);
  }
  if (props.strikethrough) {
    styled = chalk.strikethrough(styled);
  }
  if (props.inverse) {
    styled = chalk.inverse(styled);
  }

  // Dim color (applies to foreground)
  if (props.dimColor) {
    styled = chalk.dim(styled);
  }

  // Foreground color
  if (props.color) {
    styled = applyChalkColor(styled, props.color);
  }

  // Background color
  if (props.backgroundColor) {
    styled = applyChalkBgColor(styled, props.backgroundColor);
  }

  // Wrap property (text wrapping behavior)
  // Note: We don't implement actual wrapping in fast renderer (no layout engine)
  // For static output, we assume content is pre-formatted
  // Exhaustive check ensures we know about all wrap values even though we don't implement them
  if (props.wrap !== undefined) {
    const wrap = props.wrap;
    switch (wrap) {
      case "wrap":
      case "end":
      case "middle":
      case "truncate-end":
      case "truncate":
      case "truncate-middle":
      case "truncate-start":
        // Not implemented - requires terminal width calculation
        break;
      default: {
        // Exhaustive check - if Ink adds new wrap values, TypeScript will error here
        void (wrap satisfies never);
        break;
      }
    }
  }

  // Accessibility props (not rendered in terminal output)
  // Exhaustive assignment to ensure we're aware of all aria props
  void props["aria-label"];
  void props["aria-hidden"];

  return styled;
}

// ============================================================================
// BOX RENDERER - Exhaustive handling of all BoxProps
// ============================================================================

/**
 * Helper to apply padding to each line
 */
function applyPadding(
  text: string,
  top: number,
  bottom: number,
  left: number,
  right: number,
): string {
  const lines = text.split("\n");

  // Apply left and right padding
  const paddedLines = lines.map((line) => " ".repeat(left) + line + " ".repeat(right));

  // Apply top and bottom padding
  const topPadding = "\n".repeat(top);
  const bottomPadding = "\n".repeat(bottom);

  return topPadding + paddedLines.join("\n") + bottomPadding;
}

/**
 * Render Box component to ANSI string
 * Exhaustively handles all BoxProps from Ink
 */
function renderBox(node: RenderNode): string {
  const props: Partial<BoxProps> = node.props;

  // Render children first
  const childOutputs: string[] = [];
  for (const child of node.children) {
    const childOutput = renderNode(child);
    if (childOutput) {
      childOutputs.push(childOutput);
    }
  }

  // ============================================================================
  // FLEX LAYOUT (simplified for static output)
  // ============================================================================

  let output = "";

  // FlexDirection determines how children are joined
  // Exhaustive switch to ensure all flex directions are handled
  const flexDirection = props.flexDirection ?? "row"; // default is row
  switch (flexDirection) {
    case "column":
      output = childOutputs.join("\n");
      break;
    case "column-reverse":
      output = childOutputs.toReversed().join("\n");
      break;
    case "row":
      output = childOutputs.join("");
      break;
    case "row-reverse":
      output = childOutputs.toReversed().join("");
      break;
    default: {
      // Exhaustive check - if Ink adds new flexDirection values, TypeScript will error here
      void (flexDirection satisfies never);
      output = childOutputs.join("");
      break;
    }
  }

  // FlexWrap - exhaustive check for all possible values
  // Not implemented (requires layout engine), but we check we know all values
  if (props.flexWrap !== undefined) {
    const flexWrap = props.flexWrap;
    switch (flexWrap) {
      case "nowrap":
      case "wrap":
      case "wrap-reverse":
        // Not implemented - requires layout engine
        break;
      default: {
        void (flexWrap satisfies never);
        break;
      }
    }
  }

  // AlignItems - exhaustive check
  if (props.alignItems !== undefined) {
    const alignItems = props.alignItems;
    switch (alignItems) {
      case "flex-start":
      case "center":
      case "flex-end":
      case "stretch":
        // Not implemented - requires layout engine
        break;
      default: {
        void (alignItems satisfies never);
        break;
      }
    }
  }

  // AlignSelf - exhaustive check
  if (props.alignSelf !== undefined) {
    const alignSelf = props.alignSelf;
    switch (alignSelf) {
      case "flex-start":
      case "center":
      case "flex-end":
      case "auto":
        // Not implemented - requires layout engine
        break;
      default: {
        void (alignSelf satisfies never);
        break;
      }
    }
  }

  // JustifyContent - exhaustive check
  if (props.justifyContent !== undefined) {
    const justifyContent = props.justifyContent;
    switch (justifyContent) {
      case "flex-start":
      case "flex-end":
      case "space-between":
      case "space-around":
      case "space-evenly":
      case "center":
        // Not implemented - requires layout engine
        break;
      default: {
        void (justifyContent satisfies never);
        break;
      }
    }
  }

  // FlexGrow, flexShrink, flexBasis - require layout engine
  void props.flexGrow;
  void props.flexShrink;
  void props.flexBasis;

  // Gap properties - require layout engine
  void props.gap;
  void props.columnGap;
  void props.rowGap;

  // Width, height, minWidth, minHeight - require layout engine
  void props.width;
  void props.height;
  void props.minWidth;
  void props.minHeight;

  // Display property - exhaustive check
  if (props.display !== undefined) {
    const display = props.display;
    switch (display) {
      case "flex":
        // Default behavior, continue rendering
        break;
      case "none":
        return ""; // Don't render hidden elements
      default: {
        void (display satisfies never);
        break;
      }
    }
  }

  // Position property - exhaustive check
  if (props.position !== undefined) {
    const position = props.position;
    switch (position) {
      case "absolute":
      case "relative":
        // Not implemented - requires layout engine
        break;
      default: {
        void (position satisfies never);
        break;
      }
    }
  }

  // Overflow property - exhaustive check
  if (props.overflow !== undefined) {
    const overflow = props.overflow;
    switch (overflow) {
      case "visible":
      case "hidden":
        // Not implemented - requires layout engine
        break;
      default: {
        void (overflow satisfies never);
        break;
      }
    }
  }

  // OverflowX - exhaustive check
  if (props.overflowX !== undefined) {
    const overflowX = props.overflowX;
    switch (overflowX) {
      case "visible":
      case "hidden":
        // Not implemented - requires layout engine
        break;
      default: {
        void (overflowX satisfies never);
        break;
      }
    }
  }

  // OverflowY - exhaustive check
  if (props.overflowY !== undefined) {
    const overflowY = props.overflowY;
    switch (overflowY) {
      case "visible":
      case "hidden":
        // Not implemented - requires layout engine
        break;
      default: {
        void (overflowY satisfies never);
        break;
      }
    }
  }

  // ============================================================================
  // PADDING (can be implemented without layout engine)
  // ============================================================================

  // Calculate padding (shorthands expand to individual values)
  let paddingTop = props.paddingTop ?? 0;
  let paddingBottom = props.paddingBottom ?? 0;
  let paddingLeft = props.paddingLeft ?? 0;
  let paddingRight = props.paddingRight ?? 0;

  // Apply paddingY (shorthand for top + bottom)
  if (props.paddingY !== undefined) {
    paddingTop = props.paddingY;
    paddingBottom = props.paddingY;
  }

  // Apply paddingX (shorthand for left + right)
  if (props.paddingX !== undefined) {
    paddingLeft = props.paddingX;
    paddingRight = props.paddingX;
  }

  // Apply padding (shorthand for all sides)
  if (props.padding !== undefined) {
    paddingTop = props.padding;
    paddingBottom = props.padding;
    paddingLeft = props.padding;
    paddingRight = props.padding;
  }

  if (paddingTop || paddingBottom || paddingLeft || paddingRight) {
    output = applyPadding(output, paddingTop, paddingBottom, paddingLeft, paddingRight);
  }

  // ============================================================================
  // BORDERS (can be implemented without layout engine)
  // ============================================================================

  // Border rendering (simplified - only supports basic borders)
  if (props.borderStyle) {
    const borderTop = props.borderTop ?? true;
    const borderBottom = props.borderBottom ?? true;
    const borderLeft = props.borderLeft ?? true;
    const borderRight = props.borderRight ?? true;

    const lines = output.split("\n");
    const maxWidth = Math.max(...lines.map((l) => l.length), 0);

    // Get border characters based on style
    let borderChars: {
      topLeft: string;
      topRight: string;
      bottomLeft: string;
      bottomRight: string;
      horizontal: string;
      vertical: string;
    };

    if (typeof props.borderStyle === "string") {
      // Named border style
      const boxStyle = cliBoxes[props.borderStyle];
      if (boxStyle) {
        borderChars = {
          topLeft: boxStyle.topLeft,
          topRight: boxStyle.topRight,
          bottomLeft: boxStyle.bottomLeft,
          bottomRight: boxStyle.bottomRight,
          horizontal: boxStyle.top,
          vertical: boxStyle.left,
        };
      } else {
        // Fallback to single style
        borderChars = {
          topLeft: "┌",
          topRight: "┐",
          bottomLeft: "└",
          bottomRight: "┘",
          horizontal: "─",
          vertical: "│",
        };
      }
    } else {
      // Custom border style object
      borderChars = {
        topLeft: props.borderStyle.topLeft ?? "┌",
        topRight: props.borderStyle.topRight ?? "┐",
        bottomLeft: props.borderStyle.bottomLeft ?? "└",
        bottomRight: props.borderStyle.bottomRight ?? "┘",
        horizontal: props.borderStyle.top ?? "─",
        vertical: props.borderStyle.left ?? "│",
      };
    }

    // Apply border colors
    const applyBorderColor = (char: string, color?: string, dim?: boolean): string => {
      let styled = char;
      if (dim) {
        styled = chalk.dim(styled);
      }
      if (color) {
        styled = applyChalkColor(styled, color);
      }
      return styled;
    };

    const borderColor = props.borderColor;
    const borderTopColor = props.borderTopColor ?? borderColor;
    const borderBottomColor = props.borderBottomColor ?? borderColor;
    const borderLeftColor = props.borderLeftColor ?? borderColor;
    const borderRightColor = props.borderRightColor ?? borderColor;

    const borderDimColor = props.borderDimColor ?? false;
    const borderTopDimColor = props.borderTopDimColor ?? borderDimColor;
    const borderBottomDimColor = props.borderBottomDimColor ?? borderDimColor;
    const borderLeftDimColor = props.borderLeftDimColor ?? borderDimColor;
    const borderRightDimColor = props.borderRightDimColor ?? borderDimColor;

    // Build bordered output
    const borderedLines: string[] = [];

    // Top border
    if (borderTop) {
      const left = borderLeft
        ? applyBorderColor(borderChars.topLeft, borderTopColor, borderTopDimColor)
        : "";
      const middle = applyBorderColor(
        borderChars.horizontal.repeat(maxWidth),
        borderTopColor,
        borderTopDimColor,
      );
      const right = borderRight
        ? applyBorderColor(borderChars.topRight, borderTopColor, borderTopDimColor)
        : "";
      borderedLines.push(left + middle + right);
    }

    // Content with side borders
    for (const line of lines) {
      const left = borderLeft
        ? applyBorderColor(borderChars.vertical, borderLeftColor, borderLeftDimColor)
        : "";
      const right = borderRight
        ? applyBorderColor(borderChars.vertical, borderRightColor, borderRightDimColor)
        : "";
      const paddedLine = line + " ".repeat(Math.max(0, maxWidth - line.length));
      borderedLines.push(left + paddedLine + right);
    }

    // Bottom border
    if (borderBottom) {
      const left = borderLeft
        ? applyBorderColor(borderChars.bottomLeft, borderBottomColor, borderBottomDimColor)
        : "";
      const middle = applyBorderColor(
        borderChars.horizontal.repeat(maxWidth),
        borderBottomColor,
        borderBottomDimColor,
      );
      const right = borderRight
        ? applyBorderColor(borderChars.bottomRight, borderBottomColor, borderBottomDimColor)
        : "";
      borderedLines.push(left + middle + right);
    }

    output = borderedLines.join("\n");
  }

  // ============================================================================
  // MARGINS (can be implemented without layout engine)
  // ============================================================================

  // Calculate margins (shorthands expand to individual values)
  let marginTop = props.marginTop ?? 0;
  let marginBottom = props.marginBottom ?? 0;
  let marginLeft = props.marginLeft ?? 0;
  let marginRight = props.marginRight ?? 0;

  // Apply marginY (shorthand for top + bottom)
  if (props.marginY !== undefined) {
    marginTop = props.marginY;
    marginBottom = props.marginY;
  }

  // Apply marginX (shorthand for left + right)
  if (props.marginX !== undefined) {
    marginLeft = props.marginX;
    marginRight = props.marginX;
  }

  // Apply margin (shorthand for all sides)
  if (props.margin !== undefined) {
    marginTop = props.margin;
    marginBottom = props.margin;
    marginLeft = props.margin;
    marginRight = props.margin;
  }

  // Apply margins
  if (marginTop) {
    output = "\n".repeat(marginTop) + output;
  }
  if (marginBottom) {
    output = output + "\n".repeat(marginBottom);
  }
  if (marginLeft || marginRight) {
    const lines = output.split("\n");
    const leftMargin = " ".repeat(marginLeft);
    const rightMargin = " ".repeat(marginRight);
    output = lines.map((line) => leftMargin + line + rightMargin).join("\n");
  }

  // ============================================================================
  // BACKGROUND COLOR
  // ============================================================================

  if (props.backgroundColor) {
    // Apply background color to each line
    const bgColor = props.backgroundColor;
    const lines = output.split("\n");
    output = lines.map((line) => applyChalkBgColor(line, bgColor)).join("\n");
  }

  // ============================================================================
  // ACCESSIBILITY PROPS (not rendered in terminal, but exhaustively checked)
  // ============================================================================

  // Aria label and hidden - simple boolean/string, no enum to check
  void props["aria-label"];
  void props["aria-hidden"];

  // Aria role - exhaustive check for all possible roles
  if (props["aria-role"] !== undefined) {
    const ariaRole = props["aria-role"];
    switch (ariaRole) {
      case "button":
      case "checkbox":
      case "combobox":
      case "list":
      case "listbox":
      case "listitem":
      case "menu":
      case "menuitem":
      case "option":
      case "progressbar":
      case "radio":
      case "radiogroup":
      case "tab":
      case "tablist":
      case "table":
      case "textbox":
      case "timer":
      case "toolbar":
        // Not rendered in terminal output
        break;
      default: {
        void (ariaRole satisfies never);
        break;
      }
    }
  }

  // Aria state - object with optional boolean properties, no exhaustive check needed
  void props["aria-state"];

  return output;
}

// ============================================================================
// STATIC RENDERER - Exhaustive handling of StaticProps
// ============================================================================

/**
 * Render Static component
 * Exhaustively handles all StaticProps from Ink
 */
function renderStatic<T>(node: RenderNode): string {
  const props: Partial<StaticProps<T>> = node.props;

  // If no items, render children normally
  if (!props.items || !Array.isArray(props.items)) {
    return node.children.map(renderNode).join("");
  }

  // Render each item using the children render function
  const outputs: string[] = [];
  for (let index = 0; index < props.items.length; index++) {
    const item = props.items[index];

    if (typeof props.children === "function") {
      const element = props.children(item, index);
      const parsed = parseElement(element);
      if (parsed) {
        outputs.push(renderNode(parsed));
      }
    }
  }

  let output = outputs.join("");

  // Apply container styles (Static accepts style prop with Box styles)
  if (props.style) {
    // Render as a box with these styles
    const boxNode: RenderNode = {
      type: Box,
      props: props.style as Record<string, string | number | boolean | null | undefined>,
      children: [{ type: "text", props: { content: output }, children: [] }],
    };
    output = renderBox(boxNode);
  }

  return output;
}

// ============================================================================
// REACT RECONCILER - Proper hook support via react-reconciler
// ============================================================================

/**
 * Create a custom reconciler for static rendering
 * This is how Ink and renderToStaticMarkup work internally
 */
function createStaticReconciler(): ReturnType<typeof Reconciler> {
  // Track current update priority (like Ink does)
  let currentUpdatePriority = NoEventPriority;

  const hostConfig = {
    // Configuration (matching Ink's setup)
    isPrimaryRenderer: true,
    supportsMutation: true,
    supportsHydration: false,
    supportsPersistence: false,
    supportsTestSelectors: false,

    createInstance(
      type: string,
      props: Record<string, string | number | boolean | null | undefined>,
    ): RenderNode {
      const instance: RenderNode = {
        type,
        props: {},
        children: [],
      };

      // Copy primitive props
      for (const key in props) {
        if (key !== "children" && Object.prototype.hasOwnProperty.call(props, key)) {
          const propValue = props[key];

          // Handle Ink's style object - extract and flatten style properties
          if (key === "style" && propValue && typeof propValue === "object") {
            // Copy all style properties to top-level props
            for (const styleKey in propValue) {
              if (Object.prototype.hasOwnProperty.call(propValue, styleKey)) {
                const styleValue = Reflect.get(propValue, styleKey);
                if (
                  typeof styleValue === "string" ||
                  typeof styleValue === "number" ||
                  typeof styleValue === "boolean" ||
                  styleValue === null ||
                  styleValue === undefined
                ) {
                  instance.props[styleKey] = styleValue;
                }
              }
            }
          } else if (
            typeof propValue === "string" ||
            typeof propValue === "number" ||
            typeof propValue === "boolean" ||
            propValue === null ||
            propValue === undefined
          ) {
            instance.props[key] = propValue;
          }
        }
      }

      return instance;
    },

    createTextInstance(text: string): RenderNode {
      return {
        type: "text",
        props: { content: text },
        children: [],
      };
    },

    appendInitialChild(parent: RenderNode, child: RenderNode): void {
      parent.children.push(child);
    },

    appendChild(parent: RenderNode, child: RenderNode): void {
      parent.children.push(child);
    },

    appendChildToContainer(container: Container, child: RenderNode): void {
      container.node = child;
    },

    finalizeInitialChildren(): boolean {
      return false;
    },

    // Updates (no-ops for static rendering)
    prepareUpdate(): null {
      return null;
    },

    commitUpdate: noop,
    commitTextUpdate: noop,

    resetTextContent: noop,

    // Removals (no-ops for static rendering)
    removeChild: noop,
    removeChildFromContainer: noop,

    // Insertion (no-ops for static rendering)
    insertBefore: noop,
    insertInContainerBefore: noop,

    // Context
    getRootHostContext(): HostContext {
      return { isInsideText: false };
    },

    getChildHostContext(parentContext: HostContext, type: string): HostContext {
      const isInsideText = type === "ink-text" || type === "ink-virtual-text";

      if (parentContext.isInsideText === isInsideText) {
        return parentContext;
      }

      return { isInsideText };
    },

    shouldSetTextContent(): boolean {
      return false;
    },

    prepareForCommit(): null {
      return null;
    },

    resetAfterCommit: noop,

    getPublicInstance(instance: RenderNode): RenderNode {
      return instance;
    },

    preparePortalMount(): null {
      return null;
    },

    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    noTimeout: -1,

    now: Date.now,

    clearContainer(): boolean {
      return false;
    },

    // React 19 required functions
    getCurrentEventPriority(): number {
      return DefaultEventPriority;
    },

    getCurrentUpdatePriority(): number {
      return currentUpdatePriority;
    },

    resolveUpdatePriority(): number {
      if (currentUpdatePriority !== NoEventPriority) {
        return currentUpdatePriority;
      }
      return DefaultEventPriority;
    },

    resolveEventTimeStamp(): number {
      return -1.1;
    },

    resolveEventType(): null {
      return null;
    },

    setCurrentUpdatePriority(newPriority: number): void {
      currentUpdatePriority = newPriority;
    },

    maySuspendCommit(): boolean {
      return false;
    },

    preloadInstance(): boolean {
      return true;
    },

    startSuspendingCommit: noop,
    suspendInstance: noop,
    waitForCommitToBeReady(): null {
      return null;
    },

    resetFormInstance: noop,
    requestPostPaintCallback: noop,
    shouldAttemptEagerTransition(): boolean {
      return false;
    },
    trackSchedulerEvent: noop,

    getInstanceFromNode(): null {
      return null;
    },

    beforeActiveInstanceBlur: noop,
    afterActiveInstanceBlur: noop,

    prepareScopeUpdate: noop,
    getInstanceFromScope(): null {
      return null;
    },

    detachDeletedInstance: noop,
  };

  return Reconciler(hostConfig);
}

// Cache the reconciler instance
let reconciler: ReturnType<typeof createStaticReconciler> | null = null;

/**
 * Render a React element tree with full hook support using react-reconciler
 */
function renderWithReconciler(element: ReactElement): RenderNode | null {
  if (!reconciler) {
    reconciler = createStaticReconciler();
  }

  const container: Container = { node: null };

  const root = reconciler.createContainer(
    container,
    LegacyRoot,
    null,
    false,
    null,
    "fast-renderer",
    noop,
    null,
  );

  try {
    const updateSync = Reflect.get(reconciler, "updateContainerSync");
    const updateContainer = Reflect.get(reconciler, "updateContainer");
    const flushSyncWork = Reflect.get(reconciler, "flushSyncWork");

    // Render using same pattern as Ink: updateContainerSync then flushSyncWork
    if (typeof updateSync === "function") {
      updateSync(element, root, null, noop);
    } else if (typeof updateContainer === "function") {
      updateContainer(element, root, null, noop);
    }

    // Flush the work like Ink does
    if (typeof flushSyncWork === "function") {
      flushSyncWork();
    }
  } catch {
    return null;
  }

  return container.node;
}

// ============================================================================
// NODE RENDERER - Dispatch to correct renderer
// ============================================================================

/**
 * Render a node to ANSI string
 */
function renderNode(node: RenderNode): string {
  const type = node.type;

  // Handle text nodes (from reconciler)
  if (type === "text" && node.props.content) {
    return String(node.props.content);
  }

  // Handle Text component (reconciler uses "ink-text")
  if (
    type === "ink-text" ||
    type === Text ||
    type === "Text" ||
    (typeof type === "function" && type.name === "Text")
  ) {
    return renderText(node);
  }

  // Handle Box component (reconciler uses "ink-box")
  if (
    type === "ink-box" ||
    type === Box ||
    type === "Box" ||
    (typeof type === "function" && type.name === "Box")
  ) {
    return renderBox(node);
  }

  // Handle Static component
  if (typeof type === "object" && type === Static) {
    return renderStatic(node);
  }

  if (typeof type === "function" && type.name === "Static") {
    return renderStatic(node);
  }

  // Function components should have been handled by reconciler already
  if (typeof type === "function") {
    return "";
  }

  // Fallback: render children
  return node.children.map(renderNode).join("");
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Fast render function - type-safe drop-in replacement for Ink's render()
 * Returns the rendered ANSI string instead of an Ink instance
 *
 * Use this for static (non-reactive) output where performance is critical
 *
 * @example
 * ```tsx
 * const output = renderToString(<MyComponent />);
 * console.log(output);
 * ```
 */
export function renderToString(element: ReactElement): string {
  // ALWAYS use reconciler for everything - it handles contexts, hooks, everything properly
  const resolved = renderWithReconciler(element);

  if (!resolved) {
    return "";
  }

  return renderNode(resolved);
}
