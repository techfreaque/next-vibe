"use client";

import { AlertDialog } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogAction } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogCancel } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogContent } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogDescription } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogFooter } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogHeader } from "next-vibe-ui/ui/alert-dialog";
import { AlertDialogTitle } from "next-vibe-ui/ui/alert-dialog";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import aiStreamDefinition from "@/app/api/[locale]/agent/ai-stream/stream/definition";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import publicFeedDefinition from "@/app/api/[locale]/agent/chat/public-feed/definition";
import { useDeleteDialogStore } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/hooks/use-delete-dialog-store";
import { scopedTranslation } from "@/app/api/[locale]/agent/chat/threads/widget/i18n";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { platform } from "@/config/env-client";
import { useTranslation } from "@/i18n/core/client";

import { SidebarWrapper } from "./sidebar/sidebar-wrapper";
import { TopBar } from "./top-area/top-bar";
import { WelcomeTour } from "./welcome-tour/welcome-tour";

interface ChatInterfaceProps {
  user: JwtPayloadType;
}

export function ChatInterface({ user }: ChatInterfaceProps): JSX.Element {
  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const { initialPublicFeedData } = useChatBootContext();

  const isPublicFeed =
    currentRootFolderId === DefaultFolderId.PUBLIC && !activeThreadId;

  // Delete dialog state from Zustand store
  const deleteDialogOpen = useDeleteDialogStore((s) => s.deleteDialogOpen);
  const handleConfirmDelete = useDeleteDialogStore((s) => s.confirmDelete);
  const handleCancelDelete = useDeleteDialogStore((s) => s.closeDeleteDialog);

  const { locale, currentCountry } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);
  // Create logger once - memoize to prevent recreating on every render
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  // Use server-provided user prop to determine authentication status immediately
  // This prevents hydration mismatch - no client-side delay
  const isAuthenticated = user !== undefined && !user.isPublic;

  // Welcome tour authentication dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Redirect public users to incognito if they try to access PRIVATE or SHARED folders
  // PUBLIC users can access PUBLIC and INCOGNITO folders
  // This runs immediately with server-provided auth state - no hydration delay
  useEffect(() => {
    // If user is not authenticated and tries to access PRIVATE or SHARED folder, redirect to incognito
    if (
      !isAuthenticated &&
      currentRootFolderId !== DefaultFolderId.INCOGNITO &&
      currentRootFolderId !== DefaultFolderId.PUBLIC
    ) {
      logger.info(
        "Non-authenticated user attempted to access restricted folder, redirecting to incognito",
        {
          attemptedFolder: currentRootFolderId,
        },
      );
      window.location.href = `/${locale}/threads/${DefaultFolderId.INCOGNITO}/new`;
    }
  }, [isAuthenticated, currentRootFolderId, locale, logger]);

  return (
    <>
      <Div
        className={
          platform.isReactNative
            ? "flex flex-1 overflow-hidden bg-background"
            : "flex h-dvh overflow-hidden bg-background"
        }
      >
        {/* Top Bar - Menu, Search, Settings */}
        <ErrorBoundary locale={locale}>
          <TopBar currentCountry={currentCountry} locale={locale} />
        </ErrorBoundary>

        {/* Sidebar and Main Chat Area */}
        <ErrorBoundary locale={locale}>
          <SidebarWrapper locale={locale} user={user} logger={logger}>
            {/* Main Content Area — public feed or chat */}
            <ErrorBoundary locale={locale}>
              {isPublicFeed ? (
                <EndpointsPage
                  key="public-feed"
                  endpoint={publicFeedDefinition}
                  locale={locale}
                  user={user}
                  className="h-screen h-max-screen flex-1"
                  endpointOptions={{
                    read: {
                      initialData: initialPublicFeedData ?? undefined,
                    },
                  }}
                />
              ) : (
                <EndpointsPage
                  key={activeThreadId}
                  endpoint={aiStreamDefinition}
                  locale={locale}
                  user={user}
                  className="h-screen h-max-screen flex-1"
                />
              )}
            </ErrorBoundary>
          </SidebarWrapper>
        </ErrorBoundary>
      </Div>

      {/* Delete Message Confirmation Dialog */}
      <ErrorBoundary locale={locale}>
        <AlertDialog open={deleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("common.delete")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("components.confirmations.deleteMessage")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ErrorBoundary>

      {/* Authentication Dialog for Tour */}
      <ErrorBoundary locale={locale}>
        <AlertDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("components.welcomeTour.authDialog.title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("components.welcomeTour.authDialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAuthDialogOpen(false)}>
                {t("components.welcomeTour.authDialog.continueTour")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // Redirect to login with return URL to come back here
                  window.location.href = `/${locale}/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                }}
              >
                {t("components.welcomeTour.authDialog.signUp")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ErrorBoundary>

      {/* Welcome Tour */}
      <ErrorBoundary locale={locale}>
        <WelcomeTour
          isAuthenticated={isAuthenticated}
          locale={locale}
          autoStart={true}
        />
      </ErrorBoundary>
    </>
  );
}
