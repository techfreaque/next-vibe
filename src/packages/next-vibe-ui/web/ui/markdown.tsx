"use client";

import { cn } from "@/packages/next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronRight, Brain } from "lucide-react";

interface MarkdownProps {
  content: string;
  className?: string;
  isHover?: boolean;
}

/**
 * Extract <think> tags and their content from markdown
 * Returns { thinkingSections: Array<string>, contentWithoutThinking: string }
 */
function extractThinkingSections(content: string): {
  thinkingSections: string[];
  contentWithoutThinking: string;
} {
  const thinkingSections: string[] = [];
  let processedContent = content;

  // Match <think>...</think> tags (case-insensitive, multiline)
  const thinkRegex = /<think>([\s\S]*?)<\/think>/gi;
  let match;

  while ((match = thinkRegex.exec(content)) !== null) {
    thinkingSections.push(match[1].trim());
  }

  // Remove all <think> tags from content
  processedContent = content.replace(thinkRegex, '').trim();

  return { thinkingSections, contentWithoutThinking: processedContent };
}

export function Markdown({
  content,
  className,
  isHover = false,
}: MarkdownProps): JSX.Element {
  const [expandedThinking, setExpandedThinking] = useState<Set<number>>(new Set());

  const { thinkingSections, contentWithoutThinking } = extractThinkingSections(content);

  const toggleThinking = (index: number) => {
    setExpandedThinking(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  return (
    <div className={cn("leading-relaxed max-w-none", className)}>
      {/* Render thinking sections if any */}
      {thinkingSections.length > 0 && (
        <div className="mb-4 space-y-2">
          {thinkingSections.map((thinking, index) => {
            const isExpanded = expandedThinking.has(index);
            return (
              <div
                key={index}
                className="border border-purple-500/30 rounded-lg overflow-hidden bg-purple-500/5"
              >
                {/* Collapsible header */}
                <button
                  onClick={() => toggleThinking(index)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-colors"
                >
                  <Brain className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">Reasoning Process</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  )}
                </button>

                {/* Collapsible content */}
                {isExpanded && (
                  <div className="px-3 py-2 border-t border-purple-500/20 text-xs text-muted-foreground/80 whitespace-pre-wrap">
                    {thinking}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Render main content */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <span
              className="text-xl font-bold mb-3 mt-4 first:mt-0 leading-tight"
            >
              {children}
            </span>
          ),
          h2: ({ children }) => (
            <span
              className="text-lg font-bold mb-2 mt-3 first:mt-0 leading-tight"
            >
              {children}
            </span>
          ),
          h3: ({ children }) => (
            <span
              className="text-base font-semibold mb-2 mt-3 first:mt-0 leading-tight"
            >
              {children}
            </span>
          ),
          h4: ({ children }) => (
            <span
              className="text-sm font-semibold mb-1 mt-2 first:mt-0"
            >
              {children}
            </span>
          ),
          h5: ({ children }) => (
            <span
              className="text-sm font-medium mb-1 mt-2 first:mt-0 tracking-wide"
            >
              {children}
            </span>
          ),

          p: ({ children }) => (
            <p className="text-sm leading-relaxed mb-3 last:mb-0 text-slate-700 dark:text-slate-300">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="space-y-2 mb-3 text-sm ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-3 text-sm ml-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
              <span className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0">
                •
              </span>
              <span>{children}</span>
            </li>
          ),

          strong: ({ children }) => (
            <strong
              className="font-bold"
            >
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-600 dark:text-slate-400">
              {children}
            </em>
          ),

          // Code with enhanced styling
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-slate-100 dark:bg-slate-800 text-violet-600 dark:text-violet-400 px-2 py-1 rounded-md text-xs font-mono border border-slate-200 dark:border-slate-700">
                  {children}
                </code>
              );
            }
            return (
              <code className={cn("text-xs font-mono", className)}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto mb-3 text-xs border border-slate-200 dark:border-slate-800">
              {children}
            </pre>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-3 bg-gradient-to-r from-blue-50/50 to-violet-50/50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-r-lg mb-3 italic text-sm text-slate-700 dark:text-slate-300 shadow-sm">
              {children}
            </blockquote>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),

          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border-collapse border border-border text-xs">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-2 py-1 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-2 py-1 text-foreground">
              {children}
            </td>
          ),

          hr: () => <hr className="border-border my-3" />,
        }}
      >
        {contentWithoutThinking}
      </ReactMarkdown>
    </div>
  );
}
