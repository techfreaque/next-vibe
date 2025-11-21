"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import { Span } from "next-vibe-ui/ui/span";
import {
  Menu,
  MessageSquarePlus,
  Settings,
  Volume2,
  VolumeX,
} from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import { Logo } from "@/app/[locale]/_components/logo";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useChatContext } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";
import { LocaleSelectorContent } from "./locale-selector-content";
import { ThemeToggleDropdown } from "@/app/[locale]/_components/theme-toggle";

interface TopBarProps {
  currentCountry: { flag: string; name: string };
  locale: CountryLanguage;
}

export function TopBar({
  currentCountry,
  locale,
}: TopBarProps): JSX.Element {
  const {
    messages,
    ttsAutoplay,
    setTTSAutoplay,
    sidebarCollapsed,
    setSidebarCollapsed,
    handleCreateThread,
  } = useChatContext();

  const { t } = simpleT(locale);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering conditional UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Div className="absolute top-4 left-4 z-51 flex flex-row gap-1 ">
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
        title={t("app.chat.common.toggleSidebar")}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Settings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
            title={t("app.chat.common.settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {/* Theme Toggle */}
          <ThemeToggleDropdown locale={locale} />

          {/* TTS Autoplay Toggle */}
          <DropdownMenuItem
            onClick={() => setTTSAutoplay(!ttsAutoplay)}
            className="cursor-pointer"
          >
            {ttsAutoplay ? (
              <>
                <VolumeX className="h-4 w-4 mr-2" />
                {t("app.chat.common.disableTTSAutoplay")}
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                {t("app.chat.common.enableTTSAutoplay")}
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Locale Selector */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Span className="mr-2">{currentCountry.flag}</Span>
              <Span>{currentCountry.name}</Span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <LocaleSelectorContent />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      {mounted && sidebarCollapsed && (
        <>
          {/* New Chat Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCreateThread(null)}
            className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
            title={t("app.chat.common.newChat")}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </>
      )}
      {(!sidebarCollapsed || Object.keys(messages).length === 0) && (
        <Div className="flex-1 flex justify-center">
          <Logo locale={locale} pathName="" size="h-8" />
        </Div>
      )}
    </Div>
  );
}
