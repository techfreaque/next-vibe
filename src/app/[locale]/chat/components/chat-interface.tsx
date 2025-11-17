/* eslint-disable react-compiler/react-compiler */
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
import React, { useEffect, useMemo } from "react";

import {
  DEFAULT_FOLDER_IDS,
} from "@/app/api/[locale]/v1/core/agent/chat/config";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { useTranslation } from "@/i18n/core/client";
import { envClient } from "@/config/env-client";

import { ChatArea } from "./chat-area/chat-area";
import { SidebarWrapper } from "./sidebar/sidebar-wrapper";
import { TopBar } from "./sidebar/top-area/top-bar";
import { useChatContext } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";

interface ChatInterfaceProps {
  /** URL path segments from /threads/[...path] route (for logging/debugging only) */
  urlPath?: string[];
  user: JwtPayloadType | undefined;
}

export function ChatInterface({
  urlPath: _urlPath,
  user,
}: ChatInterfaceProps): JSX.Element {
  const chat = useChatContext();

  // Destructure what we need from the chat context
  const {
    currentRootFolderId,
    // Message actions
    deleteDialogOpen,
    handleConfirmDelete,
    handleCancelDelete,
  } = chat;

  const { t, locale, currentCountry } = useTranslation();
  // Create logger once - memoize to prevent recreating on every render
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  // Use server-provided user prop to determine authentication status immediately
  // This prevents hydration mismatch - no client-side delay
  const isAuthenticated = user !== undefined && !user.isPublic;

  // Redirect public users to incognito if they try to access PRIVATE or SHARED folders
  // PUBLIC users can access PUBLIC and INCOGNITO folders
  // This runs immediately with server-provided auth state - no hydration delay
  useEffect(() => {
    // If user is not authenticated and tries to access PRIVATE or SHARED folder, redirect to incognito
    if (
      !isAuthenticated &&
      currentRootFolderId !== DEFAULT_FOLDER_IDS.INCOGNITO &&
      currentRootFolderId !== DEFAULT_FOLDER_IDS.PUBLIC
    ) {
      logger.info(
        "Non-authenticated user attempted to access restricted folder, redirecting to incognito",
        {
          attemptedFolder: currentRootFolderId,
        },
      );
      window.location.href = `/${locale}/threads/${DEFAULT_FOLDER_IDS.INCOGNITO}/new`;
    }
  }, [isAuthenticated, currentRootFolderId, locale, logger]);

  return (
    <>
      <Div
        className={
          envClient.platform.isReactNative
            ? "flex flex-1 overflow-hidden bg-background"
            : "flex h-dvh overflow-hidden bg-background"
        }
      >
        {/* Top Bar - Menu, Search, Settings */}
        <TopBar
          currentCountry={currentCountry}
          locale={locale}
        />

        {/* Sidebar and Main Chat Area */}
        <SidebarWrapper
          user={user}
          locale={locale}
          logger={logger}
        >
          {/* Main Chat Area */}
          <ChatArea
            locale={locale}
            logger={logger}
            currentUserId={user?.id}
          />
        </SidebarWrapper>
      </Div>

      {/* Delete Message Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("app.admin.common.actions.delete")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("app.chat.confirmations.deleteMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              {t("app.admin.common.actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("app.admin.common.actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
