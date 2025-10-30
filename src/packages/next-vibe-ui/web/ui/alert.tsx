import { cva, type VariantProps } from "class-variance-authority";
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

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
