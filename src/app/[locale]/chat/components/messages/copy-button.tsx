"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/packages/next-vibe-ui/web/ui";

interface CopyButtonProps {
  content: string;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "sm" | "default" | "lg";
  className?: string;
}

export function CopyButton({
  content,
  variant = "ghost",
  size = "icon",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className || "h-8 w-8 md:h-7 md:w-7"}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="h-4 w-4 md:h-3.5 md:w-3.5 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 md:h-3.5 md:w-3.5" />
      )}
    </Button>
  );
}
