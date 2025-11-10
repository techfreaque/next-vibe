import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils";
import type { TextareaHTMLAttributes } from "react";
import React from "react";

// Cross-platform props interface
export interface TextareaBaseProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "onChangeText"
  > {
  onChangeText?: (text: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  minRows?: number;
  maxRows?: number;
  // Native-specific props (optional for web)
  placeholderClassName?: string;
  editable?: boolean;
  numberOfLines?: number;
  multiline?: boolean;
}

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

export interface TextareaProps
  extends TextareaBaseProps,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant, minRows = 2, maxRows = 10, onChange, onChangeText, ...props },
    ref,
  ) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaRef =
      (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      // Reset height to get accurate scrollHeight
      textarea.style.height = "auto";

      // Calculate line height
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = parseInt(computedStyle.lineHeight);
      const paddingTop = parseInt(computedStyle.paddingTop);
      const paddingBottom = parseInt(computedStyle.paddingBottom);

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
    }, [minRows, maxRows, textareaRef]);

    React.useEffect(() => {
      adjustHeight();
    }, [adjustHeight, props.value, props.defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      adjustHeight();
      onChange?.(e);
      onChangeText?.(e.target.value);
    };

    const content = (
      <textarea
        className={cn(textareaVariants({ variant }), className)}
        ref={textareaRef}
        onChange={handleChange}
        {...props}
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
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
