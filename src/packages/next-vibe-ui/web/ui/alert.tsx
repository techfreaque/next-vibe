import { cva } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

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

export type AlertVariant = "default" | "destructive" | "success" | "warning";

export type AlertProps = {
  variant?: AlertVariant;
  children?: React.ReactNode;
  icon?:
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | React.ComponentType<{ size?: number; color?: string }>;
  iconSize?: number;
  iconClassName?: string;
} & StyleType;

export type AlertTitleProps = {
  children: React.ReactNode;
} & StyleType;

export type AlertDescriptionProps = {
  children?: React.ReactNode;
} & StyleType;

const Alert = ({
  className,
  style,
  variant,
  icon: Icon,
  children,
}: AlertProps): React.JSX.Element => (
  <div
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    style={style}
  >
    {Icon && <Icon />}
    {children}
  </div>
);

const AlertTitle = ({
  className,
  style,
  children,
}: AlertTitleProps): React.JSX.Element => (
  <h5
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    style={style}
  >
    {children}
  </h5>
);

const AlertDescription = ({
  className,
  style,
  children,
}: AlertDescriptionProps): React.JSX.Element => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)} style={style}>
    {children}
  </div>
);

export { Alert, AlertDescription, AlertTitle, alertVariants };
