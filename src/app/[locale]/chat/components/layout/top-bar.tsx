"use client";

import type { JSX } from "react";
import React from "react";
import { Search, Sun, Moon, Settings, Menu, MessageSquarePlus } from "lucide-react";

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
  onOpenSearch: () => void;
  sidebarCollapsed: boolean;
  onNewChat: () => void;
}

export function TopBar({
  theme,
  currentCountry,
  onToggleSidebar,
  onToggleTheme,
  onOpenSearch,
  sidebarCollapsed,
  onNewChat,
}: TopBarProps): JSX.Element {
  return (
    <div className="absolute top-4 left-4 z-50 flex gap-1">
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90"
        title="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>


      {/* Settings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90"
            title="Settings"
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
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark Mode
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


      {sidebarCollapsed && (<>
      {/* Search Button */}
     <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSearch}
        className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90"
        title="Search"
        >
        <Search className="h-5 w-5" />
        </Button>
      {/* New Chat Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onNewChat}
        className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90"
        title="New Chat"
      >
        <MessageSquarePlus className="h-5 w-5" />
      </Button>
        </>
    )}
      
    </div>
  );
}

