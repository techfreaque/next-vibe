"use client";

import { Brain, Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { memo, useEffect, useMemo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { useTranslation } from "@/i18n/core/client";

import type { StyleType } from "../utils/style-type";

// Constants for non-translatable values
const DECORATIVE_QUOTE = String.fromCodePoint(0x201c); // Left double quotation mark
const CODE_BLOCK_BG_COLOR = `rgb(${30} ${41} ${59})`; // Slate-800 background

export type MarkdownProps = {
  content: string;
  messageId?: string;
  hasContentAfter?: boolean;
  collapseState?: {
    isCollapsed: (
      key: {
        messageId: string;
        sectionType: "thinking" | "tool";
        sectionIndex: number;
      },
      autoCollapsed: boolean,
    ) => boolean;
    toggleCollapse: (
      key: {
        messageId: string;
        sectionType: "thinking" | "tool";
        sectionIndex: number;
      },
      currentState: boolean,
    ) => void;
  };
} & StyleType;

/**
 * Extract <think> tags and their content from markdown
 * Returns { thinkingSections: Array<string>, contentWithoutThinking: string, incompleteThinking: string | null }
 */
function extractThinkingSections(content: string): {
  thinkingSections: string[];
  contentWithoutThinking: string;
  incompleteThinking: string | null;
} {
  const thinkingSections: string[] = [];
  let processedContent = content;
  let incompleteThinking: string | null = null;

  // Match complete <think>...</think> tags (case-insensitive, multiline)
  const completeThinkRegex = /<think>([\s\S]*?)<\/think>/gi;
  let match;

  // Extract all complete thinking sections
  while ((match = completeThinkRegex.exec(content)) !== null) {
    thinkingSections.push(match[1].trim());
  }

  // Remove all complete <think>...</think> tags from content
  // Replace with double newline to preserve spacing between text segments
  processedContent = content.replace(completeThinkRegex, "\n\n");

  // Check for incomplete <think> tag (streaming case)
  const incompleteThinkMatch = processedContent.match(/<think>([\s\S]*)$/i);
  if (incompleteThinkMatch) {
    incompleteThinking = incompleteThinkMatch[1].trim();
    // Remove the incomplete <think> tag and its content from processedContent
    processedContent = processedContent.replace(/<think>[\s\S]*$/i, "");
  }

  processedContent = processedContent.trim();

  return {
    thinkingSections,
    contentWithoutThinking: processedContent,
    incompleteThinking,
  };
}

/**
 * Process <Chat> tags - remove the tags but keep the content
 * Chat tags mark content that should only appear in chat (hidden in TTS, exports, etc.)
 * Returns the content with <Chat> tags replaced by their inner content
 */
function processChatTags(content: string): string {
  let processedContent = content;

  // Replace complete <Chat>...</Chat> tags with just their content
  processedContent = processedContent.replace(
    /<Chat>([\s\S]*?)<\/Chat>/gi,
    "$1",
  );

  // Handle incomplete <Chat> tag (streaming case) - keep the content
  processedContent = processedContent.replace(/<Chat>([\s\S]*)$/i, "$1");

  return processedContent;
}

export const Markdown = memo(function Markdown({
  content,
  className,
  style,
  messageId,
  hasContentAfter = false,
  collapseState,
}: MarkdownProps): JSX.Element {
  const { t } = useTranslation();

  // First process Chat tags (just strip the tags, keep content)
  const contentWithChatProcessed = useMemo(
    () => processChatTags(content),
    [content],
  );

  // Then extract thinking sections
  const { thinkingSections, contentWithoutThinking, incompleteThinking } =
    useMemo(
      () => extractThinkingSections(contentWithChatProcessed),
      [contentWithChatProcessed],
    );

  // Combine complete and incomplete thinking sections
  const allThinkingSections = useMemo(
    () => [
      ...thinkingSections,
      ...(incompleteThinking ? [incompleteThinking] : []),
    ],
    [thinkingSections, incompleteThinking],
  );

  // Check if there's content in this message
  const hasContent = contentWithoutThinking.length > 0;

  // Determine if thinking is still streaming (incomplete tag present)
  const isStreaming = Boolean(incompleteThinking);

  // Legacy state management for when collapseState is not provided
  const [expandedThinking, setExpandedThinking] = useState<Set<number>>(() => {
    if (!hasContent && allThinkingSections.length > 0) {
      // If no content yet, expand all thinking sections by default
      // Create a set of indices from 0 to allThinkingSections.length - 1
      return new Set(Array.from({ length: allThinkingSections.length }).keys());
    }
    return new Set();
  });

  // Track if user has manually toggled any thinking section (legacy)
  const [userToggledThinking, setUserToggledThinking] = useState(false);

  // Auto-collapse thinking sections when content arrives (only if user hasn't manually toggled)
  useEffect(() => {
    if (hasContent && !userToggledThinking && allThinkingSections.length > 0) {
      // Content arrived - auto-collapse all thinking sections
      setExpandedThinking(new Set());
    }
  }, [hasContent, userToggledThinking, allThinkingSections.length]);

  const toggleThinking = (index: number): void => {
    if (collapseState && messageId) {
      // Use centralized collapse state management
      const key = {
        messageId,
        sectionType: "thinking" as const,
        sectionIndex: index,
      };
      // Determine current state
      const autoCollapsed = hasContent || hasContentAfter;
      const currentState = collapseState.isCollapsed(key, autoCollapsed);
      collapseState.toggleCollapse(key, currentState);
    } else {
      // Legacy: use local state
      setUserToggledThinking(true);
      setExpandedThinking((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }
  };

  const isThinkingExpanded = (index: number): boolean => {
    if (collapseState && messageId) {
      // Use centralized collapse state management
      const key = {
        messageId,
        sectionType: "thinking" as const,
        sectionIndex: index,
      };
      // Auto-collapse if there's content in this message OR content after in sequence
      // Keep expanded while streaming
      const autoCollapsed = !isStreaming && (hasContent || hasContentAfter);
      return !collapseState.isCollapsed(key, autoCollapsed);
    }
    // Legacy: use local state
    return expandedThinking.has(index);
  };

  // Memoize the thinking ReactMarkdown components
  const thinkingComponents: {
    p: Components["p"];
  } = useMemo(
    () => ({
      p: memo(({ children }: { children: React.ReactNode }) => (
        <div className="mb-2 last:mb-0">{children}</div>
      )),
    }),
    [],
  );

  // Memoize the main ReactMarkdown components
  const mainComponents: Components = useMemo(
    () => ({
      h1: memo(({ children }: { children: React.ReactNode }) => (
        <h1 className="text-3xl font-bold mb-4 mt-8 first:mt-0 leading-tight text-slate-900 dark:text-slate-50 tracking-tight">
          {children}
        </h1>
      )),
      h2: memo(({ children }: { children: React.ReactNode }) => (
        <h2 className="text-2xl font-bold mb-3 mt-6 first:mt-0 leading-tight text-slate-900 dark:text-slate-50 tracking-tight border-b border-slate-200 dark:border-slate-800 pb-2">
          {children}
        </h2>
      )),
      h3: memo(({ children }: { children: React.ReactNode }) => (
        <h3 className="text-xl font-semibold mb-3 mt-5 first:mt-0 leading-tight text-slate-900 dark:text-slate-100">
          {children}
        </h3>
      )),
      h4: memo(({ children }: { children: React.ReactNode }) => (
        <h4 className="text-lg font-semibold mb-2 mt-4 first:mt-0 text-slate-900 dark:text-slate-100">
          {children}
        </h4>
      )),
      h5: memo(({ children }: { children: React.ReactNode }) => (
        <h5 className="text-base font-semibold mb-2 mt-3 first:mt-0 tracking-wide text-slate-800 dark:text-slate-200">
          {children}
        </h5>
      )),
      h6: memo(({ children }: { children: React.ReactNode }) => (
        <h6 className="text-sm font-semibold mb-1 mt-2 first:mt-0 tracking-wide text-slate-700 dark:text-slate-300 uppercase">
          {children}
        </h6>
      )),

      p: memo(({ children }: { children: React.ReactNode }) => (
        <div className="text-base leading-7 mb-4 last:mb-0 text-slate-700 dark:text-slate-300">
          {children}
        </div>
      )),

      ul: memo(({ children }: { children: React.ReactNode }) => (
        <ul className="list-disc list-outside ml-0 pl-6 mb-4 mt-2 space-y-2 text-base marker:text-blue-500 dark:marker:text-blue-400">
          {children}
        </ul>
      )),
      ol: memo(({ children }: { children: React.ReactNode }) => (
        <ol className="list-decimal list-outside ml-0 pl-6 mb-4 mt-2 space-y-2 text-base marker:text-blue-500 dark:marker:text-blue-400 marker:font-semibold">
          {children}
        </ol>
      )),
      li: memo(({ children }: { children: React.ReactNode }) => {
        // Check if this is a task list item (contains a checkbox)
        const isTaskListItem = React.Children.toArray(children).some(
          (child) => {
            if (React.isValidElement(child) && child.type === "input") {
              const props = child.props as { type?: string };
              return props.type === "checkbox";
            }
            return false;
          },
        );

        if (isTaskListItem) {
          return (
            <li className="flex items-start gap-2.5 my-1.5 list-none -ml-6">
              {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child) && child.type === "input") {
                  const props = child.props as {
                    type?: string;
                    checked?: boolean;
                    disabled?: boolean;
                  };
                  if (props.type === "checkbox") {
                    return (
                      <input
                        key={index}
                        type="checkbox"
                        checked={props.checked}
                        disabled={props.disabled}
                        className="mt-1 h-4 w-4 rounded border-2 border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed accent-blue-600 dark:accent-blue-500 transition-colors"
                        readOnly
                      />
                    );
                  }
                }
                return <span key={index}>{child}</span>;
              })}
            </li>
          );
        }

        return (
          <li className="text-base text-slate-700 dark:text-slate-300 leading-7 my-0.5">
            {children}
          </li>
        );
      }),

      strong: memo(({ children }: { children: React.ReactNode }) => (
        <strong className="font-bold text-slate-900 dark:text-slate-50">
          {children}
        </strong>
      )),
      em: memo(({ children }: { children: React.ReactNode }) => (
        <em className="italic text-slate-600 dark:text-slate-400 font-medium">
          {children}
        </em>
      )),

      // Code with copy button and syntax highlighting
      code: memo(
        ({
          children,
          className,
          ...props
        }: {
          children: React.ReactNode;
          className?: string;
        }) => {
          const match = /language-(\w+)/.exec(className || "");
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          const codeString = String(children).replace(/\n$/, "");

          // Check if this is a code block (has newlines or is in a pre tag)
          const isCodeBlock = codeString.includes("\n") || className;

          if (match) {
            return <CodeBlock code={codeString} language={match[1]} />;
          }

          // If it's a code block without language, use "text" as default
          if (isCodeBlock) {
            return <CodeBlock code={codeString} language="text" />;
          }

          // Inline code
          return (
            <code
              className="bg-slate-100 dark:bg-slate-800/80 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-md text-sm font-mono border border-slate-200 dark:border-slate-700/50 font-medium"
              {...props}
            >
              {children}
            </code>
          );
        },
      ),

      pre: memo(({ children }: { children: React.ReactNode }) => {
        // Let the code component handle the pre wrapper
        return <>{children}</>;
      }),

      blockquote: memo(({ children }: { children: React.ReactNode }) => (
        <blockquote className="relative border-l-4 border-blue-500 dark:border-blue-400 pl-6 pr-4 py-4 my-4 bg-linear-to-r from-blue-50 via-indigo-50/50 to-transparent dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-transparent rounded-r-xl text-base text-slate-700 dark:text-slate-300 shadow-sm">
          <div
            className="absolute left-2 top-4 text-blue-500/20 dark:text-blue-400/20 text-6xl leading-none font-serif"
            aria-hidden="true"
          >
            {DECORATIVE_QUOTE}
          </div>
          {children}
        </blockquote>
      )),

      a: memo(
        ({ href, children }: { href?: string; children: React.ReactNode }) => (
          <Link
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 underline underline-offset-2 decoration-2 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-all duration-200 font-medium"
          >
            {children}
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
          </Link>
        ),
      ),

      img: memo(({ src, alt }: { src?: string; alt?: string }) => (
        <MarkdownImage
          src={typeof src === "string" ? src : undefined}
          alt={alt}
        />
      )),

      table: memo(({ children }: { children: React.ReactNode }) => (
        <div className="overflow-x-auto mb-6 mt-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            {children}
          </table>
        </div>
      )),
      thead: memo(({ children }: { children: React.ReactNode }) => (
        <thead className="bg-slate-50 dark:bg-slate-800/50">{children}</thead>
      )),
      th: memo(({ children }: { children: React.ReactNode }) => (
        <th className="border-b-2 border-slate-200 dark:border-slate-700 px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100 uppercase text-xs tracking-wider">
          {children}
        </th>
      )),
      td: memo(({ children }: { children: React.ReactNode }) => (
        <td className="border-b border-slate-200 dark:border-slate-800 px-4 py-3 text-slate-700 dark:text-slate-300">
          {children}
        </td>
      )),

      hr: memo(() => (
        <hr className="border-0 border-t-2 border-slate-200 dark:border-slate-800 my-8" />
      )),
    }),
    [],
  );

  return (
    <div className={cn("leading-relaxed max-w-none", className)} style={style}>
      {/* Render thinking sections if any - NEW ARCHITECTURE: ReasoningDisplay design */}
      {allThinkingSections.length > 0 && (
        <div className="mb-3 space-y-3">
          {allThinkingSections.map((thinking, thinkIndex) => {
            const isExpanded = isThinkingExpanded(thinkIndex);
            const isIncomplete =
              thinkIndex === allThinkingSections.length - 1 &&
              incompleteThinking;
            return (
              <div
                key={thinkIndex}
                className={cn(
                  "rounded-lg border transition-all",
                  isExpanded
                    ? "bg-primary/5 border-primary/30"
                    : "bg-primary/10 border-primary/20 hover:border-primary/40",
                )}
              >
                {/* Header - Always visible */}
                <button
                  onClick={() => toggleThinking(thinkIndex)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary",
                    "hover:bg-primary/5 transition-colors rounded-lg",
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isExpanded ? "" : "-rotate-90",
                    )}
                  />
                  <Brain className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">
                    {t("packages.nextVibeUi.web.ui.markdown.thinking")}
                  </span>
                  {isIncomplete && (
                    <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                </button>

                {/* Content - Collapsible */}
                {isExpanded && (
                  <div className="px-3 pb-2">
                    <div className="px-3 py-2 rounded-md bg-card border border-border text-sm">
                      <div className="text-foreground prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={thinkingComponents}
                        >
                          {thinking}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Render main content */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={mainComponents}
      >
        {contentWithoutThinking}
      </ReactMarkdown>
    </div>
  );
});

// Code block component with copy button
const CodeBlock = memo(function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}): JSX.Element {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail - copying is a nice-to-have feature
      // The UI won't show copied state, which indicates failure to the user
    }
  };

  return (
    <div className="relative my-4 group rounded-xl overflow-hidden shadow-lg border border-slate-800 dark:border-slate-700">
      {/* Language label */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-700">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
            "transition-all duration-200",
            copied
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600",
          )}
          title={
            copied
              ? t("packages.nextVibeUi.web.ui.markdown.copied")
              : t("packages.nextVibeUi.web.ui.markdown.copyCode")
          }
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              {t("packages.nextVibeUi.web.ui.markdown.copied")}
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              {t("packages.nextVibeUi.web.ui.markdown.copy")}
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          fontSize: "0.875rem",
          background: CODE_BLOCK_BG_COLOR,
          lineHeight: "1.6",
          border: "unset",
          borderRadius: "",
        }}
        showLineNumbers
        wrapLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
});

// Helper functions for image modal
function handleImageInModalClick(e: React.MouseEvent<HTMLImageElement>): void {
  e.stopPropagation();
}

function handleImageInModalKeyDown(
  e: React.KeyboardEvent<HTMLImageElement>,
): void {
  e.stopPropagation();
}

// Image component with modal
const MarkdownImage = memo(function MarkdownImage({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) {
    return <></>;
  }

  const handleImageClick = (): void => {
    setIsOpen(true);
  };

  const handleModalClose = (): void => {
    setIsOpen(false);
  };

  const handleModalKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
  ): void => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="my-6 group">
        <button
          type="button"
          onClick={handleImageClick}
          className="block w-full text-left"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          />
        </button>
        {alt && (
          <div className="text-sm text-slate-500 dark:text-slate-400 italic mt-2 text-center">
            {alt}
          </div>
        )}
      </div>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={handleModalClose}
          onKeyDown={handleModalKeyDown}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={handleModalClose}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full rounded-xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={handleImageInModalClick}
            onKeyDown={handleImageInModalKeyDown}
          />
        </button>
      )}
    </>
  );
});
