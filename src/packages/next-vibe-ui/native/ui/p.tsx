import { cn } from "next-vibe/shared/utils/utils";

// Import all public types from web version (web is source of truth)
import type { PProps } from "../../web/ui/typography";

export function P({
  className,
  children,
  ...props
}: PProps): React.JSX.Element {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </p>
  );
}
