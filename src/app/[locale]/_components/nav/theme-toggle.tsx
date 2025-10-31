"use client";

import { useTheme } from "next-themes";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { Button } from "next-vibe-ui/ui/button";
import { Moon, Sun } from "next-vibe-ui/ui/icons";
import { type JSX, useEffect, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export function ThemeToggle({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = simpleT(locale);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="my-auto transition-colors hover:text-blue-600 dark:hover:text-blue-400"
      suppressHydrationWarning
      aria-label={
        resolvedTheme === "dark" || !isMounted
          ? t("app.common.accessibility.srOnly.enableLightMode")
          : t("app.common.accessibility.srOnly.enableDarkMode")
      }
    >
      {resolvedTheme === "dark" || !isMounted ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

export function ThemeToggleMobile({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = simpleT(locale);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Div
      className="flex space-x-2 pb-7 border-b text-base font-medium hover:text-primary transition-colors py-2 cursor-pointer"
      onClick={() =>
        setTheme(resolvedTheme === "dark" || !isMounted ? "light" : "dark")
      }
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 my-auto" />
      ) : (
        <Moon className="h-5 w-5 my-auto" />
      )}
      <Span className="text-base font-medium my-auto">
        {resolvedTheme === "dark" || !isMounted
          ? t("app.nav.enableLightMode")
          : t("app.nav.enableDarkMode")}
      </Span>
    </Div>
  );
}
