"use client";

/**
 * Markdown Editor - WYSIWYG rich text editor backed by Tiptap.
 * Stores and emits **markdown** strings (not HTML).
 *
 * Web implementation: full Tiptap + tiptap-markdown.
 * Native implementation lives in native/ui/markdown-editor.tsx.
 */

import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
} from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useEffect, useRef } from "react";

import { Extension } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Markdown as TiptapMarkdown,
  type MarkdownStorage,
} from "tiptap-markdown";

import type { Editor } from "@tiptap/core";

import type { StyleType } from "../utils/style-type";

/**
 * Type-safe accessor for tiptap-markdown's storage.
 * tiptap-markdown v0.9 sets the real storage in onBeforeCreate() on
 * editor.storage.markdown – ext.storage from addStorage() is an empty
 * placeholder {}.  Tiptap types editor.storage as DOM Storage (a known
 * typing gap); the runtime value is Record<extensionName, storageObj>.
 */
function getMarkdownFromEditor(editor: Editor): string {
  // editor.storage is typed as DOM Storage but is actually a plain object
  // keyed by extension name – this cast is safe and matches the runtime shape.
  const runtimeStorage = editor.storage as { markdown?: MarkdownStorage };
  if (!runtimeStorage.markdown?.getMarkdown) {
    return "";
  }
  return runtimeStorage.markdown.getMarkdown();
}

/**
 * Custom extension that overrides Enter behaviour:
 * - Enter at the end of a heading creates a new paragraph (not another heading)
 * - Enter in the middle of a heading splits normally
 * - Shift+Enter always inserts a hard break
 */
const SmartEnter = Extension.create({
  name: "smartEnter",
  addKeyboardShortcuts() {
    return {
      Enter: (): boolean => {
        const { state, commands } = this.editor;
        const { selection, doc } = state;
        const { $anchor } = selection;
        const node = $anchor.parent;

        // In a heading: at end of node → new paragraph; otherwise split normally
        if (node.type.name === "heading") {
          const isAtEnd = $anchor.parentOffset === node.content.size;
          if (isAtEnd) {
            return commands.setNode("paragraph");
          }
          // mid-heading: split into a new paragraph
          return this.editor.chain().splitBlock().setNode("paragraph").run();
        }

        // In a blockquote: empty line exits the blockquote
        if (node.type.name === "paragraph" && node.content.size === 0) {
          const depth = $anchor.depth;
          if (
            depth > 1 &&
            doc.resolve($anchor.before()).parent.type.name === "blockquote"
          ) {
            return this.editor.chain().liftEmptyBlock().run();
          }
        }

        return false; // fall through to default Enter
      },
      "Shift-Enter": (): boolean => {
        return this.editor.commands.setHardBreak();
      },
    };
  },
});

// ─── Toolbar button type ────────────────────────────────────────────
export type ToolbarAction =
  | "bold"
  | "italic"
  | "strike"
  | "link"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "orderedList"
  | "blockquote"
  | "code"
  | "horizontalRule";

const DEFAULT_TOOLBAR: ToolbarAction[] = [
  "bold",
  "italic",
  "strike",
  "link",
  "heading1",
  "heading2",
  "heading3",
  "bulletList",
  "orderedList",
  "blockquote",
  "code",
  "horizontalRule",
];

// ─── Props ──────────────────────────────────────────────────────────
export type MarkdownEditorProps = {
  /** Current markdown value */
  value: string;
  /** Called with the new markdown string on every change */
  onChange: (markdown: string) => void;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Maximum character count (applied to plain-text length) */
  maxLength?: number;
  /** Disable editing */
  disabled?: boolean;
  /** Minimum editor height in rows (approximated via min-height) */
  minRows?: number;
  /** Which toolbar buttons to show */
  toolbar?: ToolbarAction[];
  /** Toolbar button tooltip labels – keyed by action name */
  toolbarLabels?: Partial<Record<ToolbarAction | "linkPrompt", string>>;
} & StyleType;

// ─── Component ──────────────────────────────────────────────────────
export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  maxLength,
  disabled = false,
  minRows = 4,
  toolbar = DEFAULT_TOOLBAR,
  toolbarLabels,
  className,
  style,
}: MarkdownEditorProps): JSX.Element {
  // Track whether the latest change originated from the editor itself
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // We handle hard-break via SmartEnter; disable the default Shift+Enter
        // binding from StarterKit's hardBreak so SmartEnter owns it cleanly.
        hardBreak: {
          keepMarks: true,
          HTMLAttributes: {},
        },
        // Keep codeBlock disabled (inline code only)
        codeBlock: false,
      }),
      SmartEnter,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "",
      }),
      TiptapMarkdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      isInternalUpdate.current = true;
      const md = getMarkdownFromEditor(ed);
      if (maxLength !== undefined) {
        const plainLen = ed.state.doc.textContent.length;
        if (plainLen > maxLength) {
          // Reject the change by not calling onChange
          return;
        }
      }
      onChange(md);
    },
  });

  // Sync external value changes (e.g. form reset) into the editor
  useEffect(() => {
    if (!editor) {
      return;
    }
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const currentMd = getMarkdownFromEditor(editor);
    if (currentMd !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  // Keep editable in sync
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  const toggleLink = useCallback(() => {
    if (!editor) {
      return;
    }

    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const promptText = toolbarLabels?.linkPrompt ?? "URL:";
    const url = window.prompt(promptText);
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor, toolbarLabels?.linkPrompt]);

  if (!editor) {
    return (
      <div
        className={cn("min-h-24 rounded-md border bg-muted/30", className)}
        style={style}
      />
    );
  }

  const minHeight = `${minRows * 1.5}rem`;

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring transition-[box-shadow]",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      style={style}
    >
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input px-1.5 py-1">
        {toolbar.map((action) => (
          <ToolbarButton
            key={action}
            action={action}
            editor={editor}
            onToggleLink={toggleLink}
            label={toolbarLabels?.[action]}
            disabled={disabled}
          />
        ))}
      </div>

      {/* ── Editor area ── */}
      <EditorContent
        editor={editor}
        className={cn(
          // prose base
          "prose prose-sm dark:prose-invert max-w-none px-3 py-2 text-sm",
          // tiptap focus
          "[&_.tiptap]:outline-none [&_.tiptap]:min-h-[var(--editor-min-h)]",
          // placeholder
          "[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
          // headings
          "[&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:mt-4 [&_.tiptap_h1]:mb-2",
          "[&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-bold [&_.tiptap_h2]:mt-3 [&_.tiptap_h2]:mb-1.5",
          "[&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:mt-3 [&_.tiptap_h3]:mb-1",
          // paragraph spacing
          "[&_.tiptap_p]:my-1",
          // blockquote
          "[&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-muted-foreground/30 [&_.tiptap_blockquote]:pl-3 [&_.tiptap_blockquote]:text-muted-foreground [&_.tiptap_blockquote]:italic",
          // inline code
          "[&_.tiptap_code]:bg-muted [&_.tiptap_code]:rounded [&_.tiptap_code]:px-1 [&_.tiptap_code]:py-0.5 [&_.tiptap_code]:font-mono [&_.tiptap_code]:text-xs",
          // lists
          "[&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-4",
          "[&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-4",
          "[&_.tiptap_li_p]:my-0",
          // hr
          "[&_.tiptap_hr]:border-muted-foreground/20 [&_.tiptap_hr]:my-3",
          // links
          "[&_.tiptap_a]:text-primary [&_.tiptap_a]:underline [&_.tiptap_a]:underline-offset-2",
        )}
        style={{ "--editor-min-h": minHeight } as React.CSSProperties}
      />

      {/* ── Character count ── */}
      {maxLength !== undefined && (
        <div className="flex justify-end px-3 pb-1.5">
          <span
            className={cn(
              "text-xs tabular-nums",
              editor.state.doc.textContent.length > maxLength * 0.9
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {editor.state.doc.textContent.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Toolbar button ─────────────────────────────────────────────────

type EditorInstance = NonNullable<ReturnType<typeof useEditor>>;

function ToolbarButton({
  action,
  editor,
  onToggleLink,
  label,
  disabled,
}: {
  action: ToolbarAction;
  editor: EditorInstance;
  onToggleLink: () => void;
  label?: string;
  disabled: boolean;
}): JSX.Element {
  const cfg = TOOLBAR_CONFIG[action];

  const isActive = cfg.isActive(editor);

  const handleClick = (): void => {
    if (disabled) {
      return;
    }
    if (action === "link") {
      onToggleLink();
    } else {
      cfg.command(editor);
    }
  };

  return (
    <button
      type="button"
      onMouseDown={(e): void => {
        // Prevent the editor from losing focus when clicking toolbar buttons
        e.preventDefault();
      }}
      onClick={handleClick}
      disabled={disabled}
      title={label ?? cfg.fallbackLabel}
      className={cn(
        "inline-flex items-center justify-center rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-accent text-accent-foreground",
      )}
    >
      <cfg.Icon className="h-4 w-4" />
    </button>
  );
}

// ─── Toolbar config ─────────────────────────────────────────────────
interface ToolbarItemConfig {
  Icon: React.FC<{ className?: string }>;
  fallbackLabel: string;
  isActive: (editor: EditorInstance) => boolean;
  command: (editor: EditorInstance) => void;
}

const TOOLBAR_CONFIG: Record<ToolbarAction, ToolbarItemConfig> = {
  bold: {
    Icon: Bold,
    fallbackLabel: "Bold (Ctrl+B)",
    isActive: (e) => e.isActive("bold"),
    command: (e) => {
      e.chain().focus().toggleBold().run();
    },
  },
  italic: {
    Icon: Italic,
    fallbackLabel: "Italic (Ctrl+I)",
    isActive: (e) => e.isActive("italic"),
    command: (e) => {
      e.chain().focus().toggleItalic().run();
    },
  },
  strike: {
    Icon: Strikethrough,
    fallbackLabel: "Strikethrough",
    isActive: (e) => e.isActive("strike"),
    command: (e) => {
      e.chain().focus().toggleStrike().run();
    },
  },
  link: {
    Icon: LinkIcon,
    fallbackLabel: "Link",
    isActive: (e) => e.isActive("link"),
    command: () => {
      /* handled by onToggleLink */
    },
  },
  heading1: {
    Icon: Heading1,
    fallbackLabel: "Heading 1 (Ctrl+Alt+1)",
    isActive: (e) => e.isActive("heading", { level: 1 }),
    command: (e) => {
      e.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },
  heading2: {
    Icon: Heading2,
    fallbackLabel: "Heading 2 (Ctrl+Alt+2)",
    isActive: (e) => e.isActive("heading", { level: 2 }),
    command: (e) => {
      e.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },
  heading3: {
    Icon: Heading3,
    fallbackLabel: "Heading 3 (Ctrl+Alt+3)",
    isActive: (e) => e.isActive("heading", { level: 3 }),
    command: (e) => {
      e.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },
  bulletList: {
    Icon: List,
    fallbackLabel: "Bullet List",
    isActive: (e) => e.isActive("bulletList"),
    command: (e) => {
      e.chain().focus().toggleBulletList().run();
    },
  },
  orderedList: {
    Icon: ListOrdered,
    fallbackLabel: "Ordered List",
    isActive: (e) => e.isActive("orderedList"),
    command: (e) => {
      e.chain().focus().toggleOrderedList().run();
    },
  },
  blockquote: {
    Icon: Quote,
    fallbackLabel: "Quote",
    isActive: (e) => e.isActive("blockquote"),
    command: (e) => {
      e.chain().focus().toggleBlockquote().run();
    },
  },
  code: {
    Icon: Code,
    fallbackLabel: "Inline Code",
    isActive: (e) => e.isActive("code"),
    command: (e) => {
      e.chain().focus().toggleCode().run();
    },
  },
  horizontalRule: {
    Icon: Minus,
    fallbackLabel: "Horizontal Rule",
    isActive: () => false,
    command: (e) => {
      e.chain().focus().setHorizontalRule().run();
    },
  },
};

export default MarkdownEditor;
