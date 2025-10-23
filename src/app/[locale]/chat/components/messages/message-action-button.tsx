/**
 * Shared message action button component
 * Provides consistent styling and behavior for all message action buttons
 */

"use client";

import type { LucideIcon } from "lucide-react";
import type { JSX } from "react";

import { Button } from "next-vibe-ui/ui";

interface MessageActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  variant?: "default" | "destructive";
  className?: string;
}

export function MessageActionButton({
  icon: Icon,
  onClick,
  title,
  variant = "default",
  className,
}: MessageActionButtonProps): JSX.Element {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`h-8 w-8 md:h-7 md:w-7 ${variant === "destructive" ? "hover:text-red-500" : ""} ${className || ""}`}
      title={title}
    >
      <Icon className="h-4 w-4 md:h-3.5 md:w-3.5" />
    </Button>
  );
}
