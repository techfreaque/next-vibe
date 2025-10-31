"use client";

import { cn } from "next-vibe/shared/utils";
import React from "react";

export interface TitleProps {
  children: React.ReactNode;
  className?: string;
  customSizeClassName?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Title({
  children,
  className = "",
  customSizeClassName,
  level,
}: TitleProps): React.JSX.Element {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  return (
    <Tag
      className={cn(
        "leading-tight transition-all duration-300",
        customSizeClassName || sizeClasses[level],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const sizeClasses = {
  1: "text-4xl sm:text-5xl lg:text-6xl font-bold",
  2: "text-3xl sm:text-4xl lg:text-4xl font-bold",
  3: "text-xl sm:text-2xl lg:text-3xl font-semibold",
  4: "text-lg sm:text-xl lg:text-2xl font-semibold",
  5: "text-base sm:text-lg lg:text-xl font-medium",
  6: "text-sm sm:text-base lg:text-lg font-medium",
};
/* eslint-enable i18next/no-literal-string */
