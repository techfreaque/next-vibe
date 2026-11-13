"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Dialog, DialogContent } from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { MessageSquarePlus } from "next-vibe/ui/components/icons/MessageSquarePlus";
import { PanelLeft } from "next-vibe/ui/components/icons/PanelLeft";
import { Settings } from "next-vibe/ui/components/icons/Settings";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { Span } from "next-vibe/ui/components/span";
import { useSilentHistory } from "next-vibe/ui/hooks/use-navigation";
import {
  useWidgetLogger,
  useWidgetPlatform,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useCallback, useState, useSyncExternalStore } from "react";

import { Logo } from "@/_pages/_components/logo";
import { ThemeToggleDropdown } from "@/_pages/_components/theme-toggle";

import { isDefaultFolderId } from "../../../../../chat/config";
import { NEW_MESSAGE_ID } from "../../../../../chat/enum";
import { useChatStore } from "../../../../../chat/hooks/store";
import { useChatNavigationStore } from "../../../../../chat/hooks/use-chat-navigation-store";
import { scopedTranslation } from "../../../../../chat/threads/widget/i18n";
import uncensoredConsentEndpoints from "../../../../../models/uncensored-consent/definition";
import { useUncensoredConsent } from "../../../../../models/uncensored-consent/hooks";
import { scopedTranslation as consentScopedTranslation } from "../../../../../models/uncensored-consent/i18n";
import { useSidebarCollapsed } from "../sidebar/use-sidebar-collapsed";
import { LocaleSelectorContent } from "./locale-selector-content";

const noopSubscribe = (): (() => void) => () => undefined;

// false during SSR + hydration, true on the client afterwards
function useIsMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

interface TopBarProps {
  currentCountry: { flag: string; name: string };
  locale: CountryLanguage;
}

export function TopBar({ currentCountry, locale }: TopBarProps): JSX.Element {
  const { pushState } = useSilentHistory();
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const currentSubFolderId = useChatNavigationStore(
    (s) => s.currentSubFolderId,
  );
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);
  const folders = useChatStore((s) => s.folders);
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed();

  // Inline handleCreateThread - navigates to new thread in current or specified folder
  const handleCreateThread = useCallback(
    (folderId?: string | null): void => {
      let rootId = currentRootFolderId;
      let subId = currentSubFolderId;

      if (folderId) {
        if (isDefaultFolderId(folderId)) {
          rootId = folderId;
          subId = null;
        } else {
          const folder = folders[folderId];
          if (folder) {
            rootId = folder.rootFolderId;
            subId = folderId;
          }
        }
      }

      setNavigation({
        activeThreadId: "new",
        currentRootFolderId: rootId,
        currentSubFolderId: subId,
      });
      const url = subId
        ? `/${locale}/threads/${rootId}/${subId}/new`
        : `/${locale}/threads/${rootId}/new`;
      pushState(url);
    },
    [
      currentRootFolderId,
      currentSubFolderId,
      folders,
      setNavigation,
      locale,
      pushState,
    ],
  );

  const { t } = scopedTranslation.scopedT(locale);
  const { t: tConsent } = consentScopedTranslation.scopedT(locale);
  const mounted = useIsMounted();
  const [localeDialogOpen, setLocaleDialogOpen] = useState(false);
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const platform = useWidgetPlatform();
  const consent = useUncensoredConsent(user, logger);

  // Prevent hydration mismatch by only rendering conditional UI after mount

  return (
    <>
      <Dialog open={localeDialogOpen} onOpenChange={setLocaleDialogOpen}>
        <DialogContent className="max-w-md">
          <LocaleSelectorContent />
        </DialogContent>
      </Dialog>

      {/* Uncensored-model consent: status + withdraw / unlock */}
      <Dialog open={consentDialogOpen} onOpenChange={setConsentDialogOpen}>
        <DialogContent className="max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-md overflow-y-auto rounded-2xl p-3 pt-9 sm:p-4 sm:pt-9">
          {consentDialogOpen ? (
            <EndpointsPage
              endpoint={uncensoredConsentEndpoints}
              forceMethod="GET"
              locale={locale}
              user={user}
              logger={logger}
              platform={platform}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Div className="absolute top-4 left-4 z-[310] flex flex-row gap-1 ">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
          title={t("common.toggleSidebar")}
          data-tour="sidebar-toggle"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
              title={t("common.settings")}
              suppressHydrationWarning
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {/* Theme Toggle */}
            <ThemeToggleDropdown locale={locale} />

            {/* Locale Selector - Desktop: Sub-menu, Mobile: Dialog */}
            <Div className="hidden md:block">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Span className="mr-2">{currentCountry.flag}</Span>
                  <Span>{currentCountry.name}</Span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <LocaleSelectorContent />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </Div>
            <DropdownMenuItem
              className="cursor-pointer md:hidden flex items-center justify-between"
              onSelect={(e) => {
                e.preventDefault();
                setLocaleDialogOpen(true);
              }}
            >
              <Div className="flex items-center">
                <Span className="mr-2">{currentCountry.flag}</Span>
                <Span>{currentCountry.name}</Span>
              </Div>
              <ChevronRight className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center justify-between gap-2"
              onSelect={(e) => {
                e.preventDefault();
                setConsentDialogOpen(true);
              }}
            >
              <Div className="flex items-center">
                <ShieldOff className="mr-2 h-4 w-4" />
                <Span>{tConsent("widget.menuLabel")}</Span>
              </Div>
              <Span className="text-xs text-muted-foreground">
                {consent.consented
                  ? tConsent("widget.menuOn")
                  : tConsent("widget.menuOff")}
              </Span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {mounted && sidebarCollapsed && activeThreadId !== NEW_MESSAGE_ID && (
          <>
            {/* New Chat Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCreateThread(null)}
              className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
              title={t("common.newChat")}
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Button>
          </>
        )}
        {(!sidebarCollapsed ||
          !activeThreadId ||
          activeThreadId === NEW_MESSAGE_ID) && (
          <Div className="flex-1 flex justify-center">
            <Logo locale={locale} pathName="/story" size="h-8" />
          </Div>
        )}
      </Div>
    </>
  );
}
