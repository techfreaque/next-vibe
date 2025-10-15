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
import React from "react";

import { useTranslation } from "@/i18n/core/client";
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
} from "@/packages/next-vibe-ui/web/ui";

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
}: TopBarProps): JSX.Element {
  const { t } = useTranslation("chat");

  return (
    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-51 flex gap-1">
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9"
        title={t("common.toggleSidebar")}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Settings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9"
            title={t("common.settings")}
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
                {t("common.lightMode")}
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                {t("common.darkMode")}
              </>
            )}
          </DropdownMenuItem>

          {/* TTS Autoplay Toggle */}
          <DropdownMenuItem onClick={onToggleTTSAutoplay}>
            {ttsAutoplay ? (
              <>
                <VolumeX className="h-4 w-4 mr-2" />
                {t("common.disableTTSAutoplay")}
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                {t("common.enableTTSAutoplay")}
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

      {sidebarCollapsed && (
        <>
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSearch}
            className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9"
            title={t("common.search")}
          >
            <Search className="h-5 w-5" />
          </Button>
          {/* New Chat Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9"
            title={t("common.newChat")}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
}
