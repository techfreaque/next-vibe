"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { DropdownMenuItem } from "next-vibe-ui/ui/dropdown-menu";
import { Moon, Sun } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { useThemeToggle } from "next-vibe-ui/ui/theme-provider";
import { type JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export { useThemeToggle } from "next-vibe-ui/ui/theme-provider";

export function ThemeToggle({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { onToggleTheme, theme, isMounted } = useThemeToggle();
  const { t } = simpleT(locale);
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleTheme}
      className="my-auto transition-colors hover:text-blue-600 dark:hover:text-blue-400"
      suppressHydrationWarning
      aria-label={
        theme === "dark" || !isMounted
          ? t("app.common.accessibility.srOnly.enableLightMode")
          : t("app.common.accessibility.srOnly.enableDarkMode")
      }
    >
      {theme === "dark" || !isMounted ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export function ThemeToggleMobile({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { onToggleTheme, theme, isMounted } = useThemeToggle();
  const { t } = simpleT(locale);
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
          ? t("app.story._components.nav.enableLightMode")
          : t("app.story._components.nav.enableDarkMode")}
      </Span>
    </Div>
  );
}

export function ThemeToggleDropdown({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { onToggleTheme, theme } = useThemeToggle();
  const { t } = simpleT(locale);
  return (
    <DropdownMenuItem onClick={onToggleTheme} className="cursor-pointer">
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4 mr-2" />
          {t("app.chat.common.lightMode")}
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 mr-2" />
          {t("app.chat.common.darkMode")}
        </>
      )}
    </DropdownMenuItem>
  );
}
