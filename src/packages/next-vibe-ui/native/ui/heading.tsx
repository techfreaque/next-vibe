import { cn } from "next-vibe/shared/utils/utils";

// Import all public types from web version (web is source of truth)
import type { H1Props, H2Props, H3Props, H4Props } from "../../web/ui/typography";

export function H1({ className, children, ...props }: H1Props): React.JSX.Element {
  return (
    <h1
      className={cn("text-4xl font-bold text-foreground", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: H2Props): React.JSX.Element {
  return (
    <h2
      className={cn("text-3xl font-bold text-foreground", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children, ...props }: H3Props): React.JSX.Element {
  return (
    <h3
      className={cn("text-2xl font-bold text-foreground", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({ className, children, ...props }: H4Props): React.JSX.Element {
  return (
    <h4
      className={cn("text-xl font-bold text-foreground", className)}
      {...props}
    >
      {children}
    </h4>
  );
}
