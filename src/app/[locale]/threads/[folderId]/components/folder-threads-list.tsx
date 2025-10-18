"use client";

/**
 * Folder Threads List Component
 * Shows the sidebar in fullscreen mode - this is the main threads overview page
 */

import { ArrowLeft, Moon, Settings, Sun, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import { Logo } from "@/app/[locale]/_components/nav/logo";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
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
} from "@/packages/next-vibe-ui/web/ui";

import { LocaleSelectorContent } from "../../../chat/components/locale-selector-content";
import { ChatSidebar } from "../../../chat/components/sidebar/chat-sidebar";
import { useChatContext } from "../../../chat/features/chat/context";
import { useTheme } from "../../../chat/hooks/use-theme";

interface FolderThreadsListProps {
  locale: CountryLanguage;
  folderId: string;
}

export function FolderThreadsList({
  locale,
  folderId,
}: FolderThreadsListProps): JSX.Element {
  const router = useRouter();
  const { t } = simpleT(locale);
  const [theme, toggleTheme] = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ttsAutoplay, setTTSAutoplay] = useState(false);

  const {
    state,
    createNewThread,
    deleteThread,
    moveThread,
    createNewFolder,
    updateFolder,
    deleteFolder,
    toggleFolderExpanded,
    reorderFolder,
    moveFolderToParent,
    updateThread,
    searchThreads,
  } = useChatContext();

  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  // Find folder by ID
  const activeFolder = useMemo(() => {
    return state.folders[folderId];
  }, [state.folders, folderId]);

  // Get current country for locale selector
  const currentCountry = useMemo(() => {
    const countryCode = locale.split("-")[1] || "GLOBAL";
    /* eslint-disable i18next/no-literal-string */
    const countryFlags: Record<string, string> = {
      GLOBAL: "🌍",
      DE: "🇩🇪",
      PL: "🇵🇱",
      US: "🇺🇸",
      GB: "🇬🇧",
    };
    /* eslint-enable i18next/no-literal-string */
    return {
      // eslint-disable-next-line i18next/no-literal-string
      flag: countryFlags[countryCode] || "🌍",
      name: countryCode,
    };
  }, [locale]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Top Bar - Back, Settings, Logo */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-51 flex gap-1 items-center">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${locale}`)}
          className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9"
          title={t("app.chat.common.backToChat")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {/* Theme Toggle */}
            <DropdownMenuItem onClick={toggleTheme}>
              {mounted && theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  {t("app.chat.common.lightMode")}
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  {t("app.chat.common.darkMode")}
                </>
              )}
            </DropdownMenuItem>

            {/* TTS Autoplay Toggle */}
            <DropdownMenuItem onClick={() => setTTSAutoplay(!ttsAutoplay)}>
              {ttsAutoplay ? (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  {t("app.chat.common.disableTTSAutoplay")}
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  {t("app.chat.common.enableTTSAutoplay")}
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Language Selector */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="mr-2">{currentCountry.flag}</span>
                {t("app.chat.common.language")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <LocaleSelectorContent />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo */}
        <div className="ml-2">
          <Logo locale={locale} pathName="" className="w-30 h-auto" />
        </div>
      </div>

      {/* Fullscreen Sidebar */}
      <div className="w-full">
        <ChatSidebar
          state={state}
          activeThreadId={null}
          locale={locale}
          logger={logger}
          onCreateThread={(folderId): void => {
            const newThreadId = createNewThread(folderId);
            // Navigate to the new thread
            const folder =
              folderId && state.folders[folderId]
                ? state.folders[folderId]
                : activeFolder;
            if (folder && newThreadId) {
              router.push(`/${locale}/threads/${folder.id}/${newThreadId}`);
            }
          }}
          onSelectThread={(threadId): void => {
            // Find which folder this thread belongs to
            const thread = state.threads[threadId];
            if (thread?.folderId) {
              router.push(`/${locale}/threads/${thread.folderId}/${threadId}`);
            }
          }}
          onDeleteThread={deleteThread}
          onMoveThread={moveThread}
          onCreateFolder={createNewFolder}
          onUpdateFolder={updateFolder}
          onDeleteFolder={deleteFolder}
          onToggleFolderExpanded={toggleFolderExpanded}
          onReorderFolder={reorderFolder}
          onMoveFolderToParent={moveFolderToParent}
          onUpdateThreadTitle={(threadId, title): void => {
            updateThread(threadId, { title, updatedAt: Date.now() });
          }}
          searchThreads={searchThreads}
          autoFocusSearch={true}
        />
      </div>
    </div>
  );
}
