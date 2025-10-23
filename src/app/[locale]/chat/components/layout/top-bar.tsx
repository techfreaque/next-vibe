"use client";

import {
  Menu,
  MessageSquarePlus,
  Moon,
  Search,
  Settings,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import { Logo } from "@/app/[locale]/_components/nav/logo";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui";

import type { ChatMessage } from "../../types";
import { LocaleSelectorContent } from "../locale-selector-content";

interface TopBarProps {
  theme: "light" | "dark";
  currentCountry: { flag: string; name: string };
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  onToggleTTSAutoplay: () => void;
  ttsAutoplay: boolean;
  onOpenSearch: () => void;
  sidebarCollapsed: boolean;
  onNewChat: () => void;
  locale: CountryLanguage;
  onNavigateToThreads?: () => void;
  messages: Record<string, ChatMessage>;
}

export function TopBar({
  theme,
  currentCountry,
  onToggleSidebar,
  onToggleTheme,
  onToggleTTSAutoplay,
  ttsAutoplay,
  onOpenSearch,
  sidebarCollapsed,
  onNewChat,
  locale,
  onNavigateToThreads,
  messages,
}: TopBarProps): JSX.Element {
  const { t } = simpleT(locale);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering conditional UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute top-4 left-4 z-51 flex gap-1">
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-9 w-9"
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
            className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-9 w-9"
            title={t("app.chat.common.settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {/* Theme Toggle */}
          <DropdownMenuItem onClick={onToggleTheme}>
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

          {/* TTS Autoplay Toggle */}
          <DropdownMenuItem onClick={onToggleTTSAutoplay}>
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
            <DropdownMenuSubTrigger>
              <span className="mr-2">{currentCountry.flag}</span>
              <span>{currentCountry.name}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <LocaleSelectorContent />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      {mounted && sidebarCollapsed && (
        <>
          {/* Search Button - Navigate to threads page when sidebar collapsed */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateToThreads || onOpenSearch}
            className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-9 w-9"
            title={t("app.chat.common.search")}
          >
            <Search className="h-5 w-5" />
          </Button>
          {/* New Chat Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-9 w-9"
            title={t("app.chat.common.newChat")}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </>
      )}
      {(!sidebarCollapsed || Object.keys(messages).length === 0) && (
        <div className="flex-1 flex justify-center">
          <Logo
            locale={locale}
            pathName=""
            className="w-[150px] h-auto"
            linkClassName="my-auto flex"
          />
        </div>
      )}
    </div>
  );
}
