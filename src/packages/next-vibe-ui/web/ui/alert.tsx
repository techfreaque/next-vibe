import { cva } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default:
          "bg-blue-50 text-blue-900 border-blue-200 [&>svg]:text-blue-600 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-800 dark:[&>svg]:text-blue-400",
        destructive:
          "border-red-500/50 text-red-600 dark:text-red-400 dark:border-red-500 [&>svg]:text-red-600 dark:[&>svg]:text-red-400 bg-red-50 dark:bg-red-950/50",
        success:
          "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-700 dark:[&>svg]:text-green-400 bg-green-50 dark:bg-green-950/50",
        warning:
          "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-700 dark:[&>svg]:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Cross-platform types for native import
export type AlertVariant = "default" | "destructive" | "success" | "warning";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: AlertVariant;
  children?: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ComponentType<{ size?: number; color?: string }>; // Support both SVG and Lucide icons
  iconSize?: number;
  iconClassName?: string;
}

export interface AlertTitleProps {
  className?: string;
  children: React.ReactNode;
}

export interface AlertDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon: Icon, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {Icon && <Icon />}
      {children}
    </div>
  ),
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h5>
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle, alertVariants };
