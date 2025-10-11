/**
 * Shared message action button component
 * Provides consistent styling and behavior for all message action buttons
 */

"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/packages/next-vibe-ui/web/ui";

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
}: MessageActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`h-7 w-7 ${variant === "destructive" ? "hover:text-red-500" : ""} ${className || ""}`}
      title={title}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );
}

