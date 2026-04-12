"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { DropdownMenuItem } from "next-vibe-ui/ui/dropdown-menu";
import { Moon } from "next-vibe-ui/ui/icons/Moon";
import { Sun } from "next-vibe-ui/ui/icons/Sun";
import { Span } from "next-vibe-ui/ui/span";
import { useThemeToggle } from "next-vibe-ui/ui/theme-provider";
import { type JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as pageT } from "./i18n";

export { useThemeToggle } from "next-vibe-ui/ui/theme-provider";

export function ThemeToggle({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { onToggleTheme, theme, isMounted } = useThemeToggle();
  const { t } = pageT.scopedT(locale);
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleTheme}
      className="my-auto transition-colors hover:text-primary"
      suppressHydrationWarning
      aria-label={
        theme === "dark" || !isMounted
          ? t("themeToggle.enableLightMode")
          : t("themeToggle.enableDarkMode")
      }
    >
      {theme === "dark" || !isMounted ? (
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
  const { onToggleTheme, theme, isMounted } = useThemeToggle();
  const { t } = pageT.scopedT(locale);
  return (
    <Div
      className="flex flex-row gap-2 pb-7 border-b text-base font-medium hover:text-primary transition-colors py-2 cursor-pointer"
      onClick={onToggleTheme}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 my-auto" />
      ) : (
        <Moon className="h-5 w-5 my-auto" />
      )}
      <Span className="text-base font-medium my-auto">
        {theme === "dark" || !isMounted
          ? t("themeToggle.enableLightMode")
          : t("themeToggle.enableDarkMode")}
      </Span>
    </Div>
  );
}

export function ThemeToggleDropdown({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  const { onToggleTheme, theme } = useThemeToggle();
  const { t } = pageT.scopedT(locale);
  return (
    <DropdownMenuItem onClick={onToggleTheme} className="cursor-pointer">
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4 mr-2" />
          {t("themeToggle.lightMode")}
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 mr-2" />
          {t("themeToggle.darkMode")}
        </>
      )}
    </DropdownMenuItem>
  );
}
