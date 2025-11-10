import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils";
import React from "react";

export interface TextareaChangeEvent {
  target: {
    value: string;
    name?: string;
    id?: string;
  };
  currentTarget?: {
    value?: string;
  };
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export interface TextareaFocusEvent {
  target?: {
    focus?: () => void;
    blur?: () => void;
    value?: string;
  };
  currentTarget?: {
    focus?: () => void;
    blur?: () => void;
  };
}

// Cross-platform props interface
export interface TextareaBaseProps {
  className?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  rows?: number;
  name?: string;
  id?: string;
  maxLength?: number;
  onChangeText?: (text: string) => void;
  onChange?: (e: TextareaChangeEvent) => void;
  onBlur?: (e: TextareaFocusEvent) => void;
  onFocus?: (e: TextareaFocusEvent) => void;
  minRows?: number;
  maxRows?: number;
  placeholderClassName?: string;
  editable?: boolean;
  numberOfLines?: number;
  multiline?: boolean;
  ref?: (node: { focus?: () => void; blur?: () => void; select?: () => void; value?: string } | null) => void;
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

function Textarea({
  className,
  variant,
  minRows = 2,
  maxRows = 10,
  onChange,
  onChangeText,
  ref: _ref,
  ...props
}: TextareaProps): React.JSX.Element {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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
  }, [minRows, maxRows]);

  React.useEffect(() => {
    adjustHeight();
  }, [adjustHeight, props.value, props.defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    adjustHeight();
    onChange?.({ target: { value: e.target.value, name: e.target.name } });
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
}

export { Textarea };
