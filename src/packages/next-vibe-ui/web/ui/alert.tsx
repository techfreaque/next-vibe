import { cva } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

const alertVariants = cva(
  "relative rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default:
          "bg-card text-card-foreground border-border [&>svg]:text-foreground",
        destructive:
          "border-destructive/50 text-foreground [&>svg]:text-destructive bg-destructive/5 dark:bg-destructive/10",
        success:
          "border-success/50 text-foreground [&>svg]:text-success bg-success/5 dark:bg-success/10",
        warning:
          "border-warning/50 text-foreground [&>svg]:text-warning bg-warning/5 dark:bg-warning/10",
        info: "border-info/50 text-foreground [&>svg]:text-info bg-info/5 dark:bg-info/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type AlertVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info";

export interface AlertProps {
  variant?: AlertVariant;
  children?: React.ReactNode;
  icon?:
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | React.ComponentType<{ size?: number; color?: string }>;
  iconSize?: number;
  iconClassName?: string;
  className?: string;
}

export interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface AlertDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

const Alert = ({
  className,
  variant,
  icon: Icon,
  children,
}: AlertProps): React.JSX.Element => (
  <div role="alert" className={cn(alertVariants({ variant }), className)}>
    {Icon && <Icon />}
    {children}
  </div>
);

const AlertTitle = ({
  className,
  children,
}: AlertTitleProps): React.JSX.Element => (
  <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)}>
    {children}
  </h5>
);

const AlertDescription = ({
  className,
  children,
}: AlertDescriptionProps): React.JSX.Element => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)}>
    {children}
  </div>
);

export { Alert, AlertDescription, AlertTitle, alertVariants };
