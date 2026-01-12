"use client";

import type { JSX } from "react";
import React, { useState } from "react";

import type { StyleType } from "../utils/style-type";
import { Button } from "./button";

export type DropdownItemProps = {
  isSelected?: boolean;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  label: string;
  description?: string;
  disabled?: boolean;
} & StyleType;

export function DropdownItem(props: DropdownItemProps): JSX.Element {
  const {
    isSelected = false,
    onClick,
    icon,
    label,
    description,
    disabled = false,
    className,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const shouldShowRainbow = isSelected || isHovered;

  const handleMouseEnter = (): void => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  const handleClick = (): void => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant={shouldShowRainbow ? "default" : "ghost"}
      size="sm"
      className={`w-full justify-start font-medium rounded-md px-3 py-2.5 min-h-fit h-auto ${
        shouldShowRainbow
          ? "border-2 border-blue-500/50 bg-blue-500/10"
          : "border-2 border-transparent hover:bg-accent/50"
      } ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-3 w-full">
        {icon && (
          <span className="text-base w-6 h-6 flex items-center justify-center flex-shrink-0">
            {React.isValidElement(icon)
              ? icon
              : typeof icon === "string"
                ? icon
                : React.createElement(
                    icon as React.ComponentType<{ className?: string }>,
                    {
                      className: "w-6 h-6 size-6",
                    },
                  )}
          </span>
        )}
        <div className="flex flex-col items-start flex-1 min-w-0 text-left">
          <span className="font-medium text-sm w-full">{label}</span>
          {description && (
            <span className="text-xs text-muted-foreground/80 w-full leading-tight mt-0.5 whitespace-normal">
              {description}
            </span>
          )}
        </div>
      </span>
    </Button>
  );
}
