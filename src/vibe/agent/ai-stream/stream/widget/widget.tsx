/**
 * AI Stream Widget
 *
 * Owns the entire chat UI: sidebar, topbar, dialogs, welcome tour, and the
 * chat area itself. The threads page provides a full-screen container; this
 * widget adapts to whatever size it receives.
 */

"use client";

import { platform } from "next-vibe/core/env-client";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { Div, type DivRefObject } from "next-vibe/ui/components/div";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Link } from "next-vibe/ui/components/link";
import { H2, P } from "next-vibe/ui/components/typography";
import { ErrorBoundary } from "next-vibe/ui/components/error-boundary";
import { KeyboardAvoidingView } from "next-vibe/ui/components/keyboard-avoiding-view";
import { usePathname, useRouter } from "next-vibe/ui/hooks/use-navigation";
import { useResizeObserver } from "next-vibe/ui/hooks/use-resize-observer";
import { useSafeAreaInsets } from "next-vibe/ui/hooks/use-safe-area-insets";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetPlatform,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { UseEndpointOptions } from "next-vibe/unified-ui/hooks/endpoint-types";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { parseChatUrl } from "@/_pages/chat/lib/url-parser";
import { InputHeightProvider } from "@/_pages/chat/lib/config/constants";

import { DefaultFolderId } from "../../../../core/execution-context";
import { NEW_MESSAGE_ID, ThreadStreamingState } from "../../../chat/enum";
import { useChatBootContext } from "../../../chat/hooks/context";
import { useChatNavigationStore } from "../../../chat/hooks/use-chat-navigation-store";
import publicFeedDefinition from "../../../chat/public-feed/definition";
import messagesDefinition from "../../../chat/threads/[threadId]/messages/definition";
import { useDeleteDialogStore } from "../../../chat/threads/[threadId]/messages/hooks/use-delete-dialog-store";
import { scopedTranslation } from "../../../chat/threads/widget/i18n";
import { useChatSettings } from "../../../chat/settings/hooks";
import { ChatEmptyState } from "../../../chat/threads/widget/new-thread/empty-state";
import { CortexModal } from "../../../cortex/widget/cortex-modal";
import { useProviderAvailability } from "../../../env-availability-store";
import { getAvailableModelCount } from "../../../models/all-models";
import { AIToolsModal } from "../../../tools/widget/ai-tools-modal";
import type definition from "../definition";
import type { AiStreamPostResponseOutput } from "../definition";
import { IncognitoStreamKeeper } from "../hooks/incognito-stream-keeper";
import { SidebarWrapper } from "./chat-ui/sidebar/sidebar-wrapper";
import { TopBar } from "./chat-ui/top-area/top-bar";
import { WelcomeTour } from "./chat-ui/welcome-tour/welcome-tour";
import { ChatInputContainer } from "./input-container";
import { ChatToolbar } from "./toolbar";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useInputHeight(
  inputContainerRef: React.RefObject<DivRefObject | null>,
): number {
  const { height } = useResizeObserver(inputContainerRef, {
    width: 0,
    height: 120,
  });
  return height || 120;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface CustomWidgetProps {
  field: {
    value: AiStreamPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

// ─── Chat area (messages + input + modals) ────────────────────────────────────

function AiStreamChatArea(): JSX.Element {
  const {
    initialMessagesData,
    initialPathData,
    initialThreadId,
    initialSettingsData,
  } = useChatBootContext();

  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const widgetPlatform = useWidgetPlatform();
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);
  const { settings: chatSettings } = useChatSettings(
    user,
    logger,
    initialSettingsData,
  );

  const threadIdToRender =
    activeThreadId && activeThreadId !== NEW_MESSAGE_ID ? activeThreadId : null;

  const messagesInitialData = useMemo(() => {
    if (!threadIdToRender) {
      return null;
    }
    if (threadIdToRender === initialThreadId) {
      if (initialMessagesData) {
        return initialMessagesData;
      }
      if (initialPathData?.messages?.length) {
        return {
          streamingState: ThreadStreamingState.IDLE,
          backgroundTasks: [],
          messages: initialPathData.messages,
        };
      }
    }
    const cached = apiClient.getEndpointData(messagesDefinition.GET, logger, {
      urlPathParams: { threadId: threadIdToRender },
      requestData: { rootFolderId },
    });
    if (cached?.success) {
      return cached.data;
    }
    return null;
  }, [
    threadIdToRender,
    initialThreadId,
    initialMessagesData,
    initialPathData,
    logger,
    rootFolderId,
  ]);

  const inputContainerRef = useRef<DivRefObject>(null);
  const inputHeight = useInputHeight(inputContainerRef);
  const insets = useSafeAreaInsets();

  const messagesReadOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { threadId: threadIdToRender ?? "" },
        initialState: { rootFolderId },
        queryOptions: {
          enabled: !!threadIdToRender,
          staleTime: Infinity,
        },
        ...(messagesInitialData ? { initialData: messagesInitialData } : {}),
      },
      create: {
        urlPathParams: { threadId: threadIdToRender ?? "" },
      },
      subscribeToEvents: !!threadIdToRender,
    }),
    [threadIdToRender, rootFolderId, messagesInitialData],
  );
  const messagesEndpointInstance = useEndpoint(
    messagesDefinition,
    messagesReadOptions,
    logger,
    user,
  );
  interface MessagesGetEndpoint {
    GET: typeof messagesDefinition.GET;
  }
  const messagesEndpointOptions = useMemo(
    (): UseEndpointOptions<MessagesGetEndpoint> => ({
      read: {
        urlPathParams: { threadId: threadIdToRender ?? "" },
        initialState: { rootFolderId },
        queryOptions: { enabled: !!threadIdToRender, staleTime: Infinity },
        ...(messagesInitialData ? { initialData: messagesInitialData } : {}),
      },
    }),
    [threadIdToRender, rootFolderId, messagesInitialData],
  );

  return (
    <KeyboardAvoidingView
      className={
        platform.isReactNative ? "flex-1" : "flex flex-col flex-1 min-h-0"
      }
      keyboardVerticalOffset={0}
    >
      <InputHeightProvider height={inputHeight}>
        {/* Headless: keeps WS subscriptions alive for incognito threads that
            are still streaming while the user views a different thread. */}
        <IncognitoStreamKeeper user={user} logger={logger} />
        {platform.isReactNative && (
          <Div style={{ paddingTop: insets.top + 60 }} />
        )}
        <Div
          className={
            platform.isReactNative
              ? "flex-1 flex flex-col min-w-0 relative w-full"
              : "flex flex-col flex-1 min-w-0 min-h-0 relative"
          }
        >
          {/* Toolbar */}
          {activeThreadId && activeThreadId !== NEW_MESSAGE_ID && (
            <ErrorBoundary locale={locale}>
              <ChatToolbar locale={locale} />
            </ErrorBoundary>
          )}

          {/* Messages area */}
          <ErrorBoundary locale={locale}>
            <Div className="flex flex-col flex-1 min-w-0 min-h-0">
              {threadIdToRender ? (
                <EndpointsPage<MessagesGetEndpoint>
                  key={threadIdToRender}
                  endpoint={{ GET: messagesDefinition.GET }}
                  endpointOptions={messagesEndpointOptions}
                  endpointInstance={messagesEndpointInstance}
                  className="flex flex-col flex-1 min-h-0"
                  locale={locale}
                  user={user}
                  platform={widgetPlatform}
                />
              ) : (
                <ChatEmptyState
                  locale={locale}
                  inputHeight={inputHeight}
                  skillId={chatSettings?.selectedSkill ?? null}
                />
              )}
            </Div>
          </ErrorBoundary>

          {/* Input */}
          <ErrorBoundary locale={locale}>
            <ChatInputContainer inputContainerRef={inputContainerRef} />
          </ErrorBoundary>

          {/* AI Tools Modal */}
          <ErrorBoundary locale={locale}>
            <AIToolsModal
              locale={locale}
              user={user}
              platform={widgetPlatform}
            />
          </ErrorBoundary>

          {/* Cortex Modal */}
          <ErrorBoundary locale={locale}>
            <CortexModal
              locale={locale}
              user={user}
              platform={widgetPlatform}
            />
          </ErrorBoundary>
        </Div>
      </InputHeightProvider>
    </KeyboardAvoidingView>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AiStreamWidget(_props: CustomWidgetProps): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const widgetPlatform = useWidgetPlatform();
  const { currentCountry } = useTranslation();
  const { initialPublicFeedData } = useChatBootContext();

  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);

  const isPublicFeed =
    currentRootFolderId === DefaultFolderId.PUBLIC && !activeThreadId;

  // Delete dialog
  const deleteDialogOpen = useDeleteDialogStore((s) => s.deleteDialogOpen);
  const handleConfirmDelete = useDeleteDialogStore((s) => s.confirmDelete);
  const handleCancelDelete = useDeleteDialogStore((s) => s.closeDeleteDialog);

  const { t } = scopedTranslation.scopedT(locale);

  const isAuthenticated = !user.isPublic;
  const isAdmin = isAuthenticated && user.roles.includes(UserRole.ADMIN);
  const availability = useProviderAvailability();
  const totalModelCount = getAvailableModelCount(isAdmin, availability);

  // Auth dialog for welcome tour
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Navigation hooks
  const router = useRouter();
  const pathname = usePathname();

  // Guests can only use incognito + the public feed. A link to a thread in a
  // private/shared folder gets a sign-in gate (they followed it on purpose);
  // anything else redirects once to a fresh incognito chat.
  // Route-driven: the URL decides, never loose store state (the store folder
  // defaults to a restricted one during normal guest navigation).
  const routeSegments = pathname.split("/").filter(Boolean);
  const threadsIdx = routeSegments.indexOf("threads");
  const routeChat =
    threadsIdx === -1
      ? null
      : parseChatUrl(routeSegments.slice(threadsIdx + 1));
  const isRestrictedFolder =
    !isAuthenticated &&
    routeChat !== null &&
    routeChat.initialRootFolderId !== DefaultFolderId.INCOGNITO &&
    routeChat.initialRootFolderId !== DefaultFolderId.PUBLIC;
  const hasRealRouteThread =
    routeChat !== null &&
    routeChat.initialThreadId !== null &&
    routeChat.initialThreadId !== NEW_MESSAGE_ID;
  // Gate only a genuine link to a thread in a restricted folder.
  const showSignInGate = isRestrictedFolder && hasRealRouteThread;
  // A bare restricted folder (or /threads root, or /new there) -> incognito once.
  const shouldRedirect = isRestrictedFolder && !hasRealRouteThread;
  // useRouter() returns a new object every render - keep it out of the deps,
  // or each render re-fires push() and the navigation never completes.
  const routerRef = useRef(router);
  useLayoutEffect(() => {
    routerRef.current = router;
  });
  const redirectedRef = useRef(false);
  useEffect(() => {
    if (!shouldRedirect) {
      redirectedRef.current = false;
      return;
    }
    if (redirectedRef.current) {
      return;
    }
    redirectedRef.current = true;
    logger.info(
      "Non-authenticated user attempted to access restricted folder, redirecting to incognito",
      { attemptedFolder: routeChat?.initialRootFolderId },
    );
    routerRef.current.push(
      `/${locale}/threads/${DefaultFolderId.INCOGNITO}/new`,
    );
  }, [shouldRedirect, routeChat?.initialRootFolderId, locale, logger]);

  return (
    <>
      <Div
        className={
          platform.isReactNative
            ? "flex flex-1 overflow-hidden bg-background"
            : "flex flex-1 min-h-0 overflow-hidden bg-background"
        }
      >
        {/* Top Bar */}
        <ErrorBoundary locale={locale}>
          <TopBar currentCountry={currentCountry} locale={locale} />
        </ErrorBoundary>

        {/* Sidebar + main content */}
        <ErrorBoundary locale={locale}>
          <SidebarWrapper
            locale={locale}
            user={user}
            logger={logger}
            platform={widgetPlatform}
          >
            <ErrorBoundary locale={locale}>
              {isPublicFeed ? (
                <EndpointsPage
                  key="public-feed"
                  endpoint={publicFeedDefinition}
                  locale={locale}
                  user={user}
                  platform={widgetPlatform}
                  className="h-full flex-1"
                  endpointOptions={{
                    read: {
                      initialData: initialPublicFeedData ?? undefined,
                    },
                  }}
                />
              ) : showSignInGate ? (
                <SignInGate locale={locale} returnPath={pathname} />
              ) : (
                <AiStreamChatArea />
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

      {/* Auth Dialog for Tour */}
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
                  router.push(
                    `/${locale}/user/login?callbackUrl=${encodeURIComponent(pathname)}`,
                  );
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
          autoStart={false}
          totalModelCount={totalModelCount}
        />
      </ErrorBoundary>
    </>
  );
}

/** Shown to guests who open a link to a thread they can't read without an account. */
function SignInGate({
  locale,
  returnPath,
}: {
  locale: CountryLanguage;
  returnPath: string;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="flex h-full flex-1 items-center justify-center p-6">
      <Div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <Div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-5 w-5" />
        </Div>
        <H2 className="border-0 pb-0 text-lg font-semibold text-foreground">
          {t("components.signInGate.title")}
        </H2>
        <P className="text-sm text-muted-foreground">
          {t("components.signInGate.description")}
        </P>
        <Div className="flex w-full flex-col gap-2">
          <Button asChild className="w-full">
            <Link
              href={`/${locale}/user/login?callbackUrl=${encodeURIComponent(returnPath)}`}
            >
              {t("components.signInGate.signIn")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/${locale}/user/signup`}>
              {t("components.signInGate.signUp")}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href={`/${locale}/threads/${DefaultFolderId.INCOGNITO}/new`}>
              {t("components.signInGate.incognito")}
            </Link>
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
