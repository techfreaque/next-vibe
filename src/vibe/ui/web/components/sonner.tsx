"use client";

import { useTheme } from "next-themes";
import type { CSSProperties, JSX } from "react";
import type { ToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: ToasterProps): JSX.Element => {
  const { theme: rawTheme } = useTheme();
  const theme: ToasterProps["theme"] =
    rawTheme === "light" || rawTheme === "dark" ? rawTheme : "system";
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
