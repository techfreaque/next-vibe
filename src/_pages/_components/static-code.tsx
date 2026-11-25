/// <reference types="react-syntax-highlighter" />
/**
 * Next renders these token spans on the server. TanStack also renders them
 * during hydration, so both environments must use the same Prism grammars.
 */
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";
// Markdown uses this same fully initialized Refractor registry. Registering a
// subset on prism-light would let a later Markdown import change our JS tokens.
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";

/** Block padding per layout, matching `CodeSnippet`. */
const PADDING = {
  bare: "0.75rem 1rem",
  file: "0.9rem 1.25rem",
} as const;

/**
 * Same look as `CodeSnippet`: Night Owl tokens (class-based, see
 * `.vibe-static-code` in globals.css) on a transparent background.
 */
function StaticHighlighter({
  code,
  language,
  size,
  layout,
}: {
  code: string;
  language: string;
  size: "sm" | "md";
  layout: keyof typeof PADDING;
}): JSX.Element {
  return (
    <SyntaxHighlighter
      language={language}
      useInlineStyles={false}
      // Without this the library still inlines its default light theme on
      // <code> (black text, white text-shadow): ghost text on dark blocks.
      codeTagProps={{ className: `language-${language}` }}
      customStyle={{
        margin: 0,
        padding: PADDING[layout],
        fontSize: size === "md" ? "0.9rem" : "0.8rem",
        background: "transparent",
        lineHeight: "1.65",
        border: "unset",
        borderRadius: "",
      }}
      wrapLongLines={false}
    >
      {code}
    </SyntaxHighlighter>
  );
}

/** Bare block: the highlighted `<pre>` in a horizontally scrolling box. */
export function StaticCode({
  code,
  language,
  size = "sm",
}: {
  code: string;
  language: string;
  size?: "sm" | "md";
}): JSX.Element {
  return (
    <Div className="vibe-static-code overflow-x-auto font-mono">
      <StaticHighlighter
        code={code}
        language={language}
        size={size}
        layout="bare"
      />
    </Div>
  );
}

/** File card: filename header over the highlighted block. */
export function StaticCodeFile({
  code,
  language,
  filename,
  header,
}: {
  code: string;
  language: string;
  filename: string;
  /** Right side of the header, e.g. a copy button island. */
  header?: JSX.Element;
}): JSX.Element {
  return (
    <Div className="vibe-static-code overflow-hidden rounded-xl border border-border/60 bg-slate-950">
      <Div className="flex items-center justify-between border-b border-border/40 bg-slate-900/60 px-4 py-1.5">
        <Span className="font-mono text-[11px] text-slate-400">{filename}</Span>
        {header}
      </Div>
      <Div className="overflow-x-auto">
        <StaticHighlighter
          code={code}
          language={language}
          size="sm"
          layout="file"
        />
      </Div>
    </Div>
  );
}
