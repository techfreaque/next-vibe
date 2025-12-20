import { Div } from "next-vibe-ui/ui/div";
import { Li } from "next-vibe-ui/ui/li";
import { Span } from "next-vibe-ui/ui/span";
import { Strong } from "next-vibe-ui/ui/strong";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import { Ul } from "next-vibe-ui/ui/ul";
import type { Step } from "react-joyride";

import { DEFAULT_FOLDER_CONFIGS } from "@/app/api/[locale]/agent/chat/config";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { TFunction } from "@/i18n/core/static-types";

export interface TourStepConfig extends Step {
  requiresAuth?: boolean;
  hideBeforeAuth?: boolean;
}

// Data-tour attribute constants
export const TOUR_DATA_ATTRS = {
  MODEL_SELECTOR: "model-selector",
  MODEL_SELECTOR_FAVORITES: "model-selector-favorites",
  MODEL_SELECTOR_SHOW_ALL: "model-selector-show-all",
  MODEL_SELECTOR_SEARCH: "model-selector-search",
  MODEL_SELECTOR_GROUP: "model-selector-group",
  PERSONA_SELECTOR: "persona-selector",
  PERSONA_SELECTOR_FAVORITES: "persona-selector-favorites",
  PERSONA_SELECTOR_SHOW_ALL: "persona-selector-show-all",
  PERSONA_SELECTOR_SEARCH: "persona-selector-search",
  PERSONA_SELECTOR_GROUP: "persona-selector-group",
  SIDEBAR_TOGGLE: "sidebar-toggle",
  ROOT_FOLDERS: "root-folders",
  INCOGNITO_FOLDER: "incognito-folder",
  PUBLIC_FOLDER: "public-folder",
  PRIVATE_FOLDER: "private-folder",
  SHARED_FOLDER: "shared-folder",
  NEW_CHAT_BUTTON: "new-chat-button",
  SIDEBAR_LOGIN: "sidebar-login",
  SUBSCRIPTION_BUTTON: "subscription-button",
  CHAT_INPUT: "chat-input",
  SPEECH_INPUT: "speech-input",
  CALL_MODE_BUTTON: "call-mode-button",
} as const;

// Type for tour data attribute keys
export type TourDataAttr =
  (typeof TOUR_DATA_ATTRS)[keyof typeof TOUR_DATA_ATTRS];

// Helper function to generate type-safe CSS selector for tour targets
export const getTourSelector = (attr: TourDataAttr): string => {
  return `[data-tour="${attr}"]`;
};

// Helper function to map folder IDs to tour data attributes (type-safe)
export const getFolderTourAttr = (
  folderId: string,
): TourDataAttr | undefined => {
  const folderMap: Record<string, TourDataAttr> = {
    private: TOUR_DATA_ATTRS.PRIVATE_FOLDER,
    shared: TOUR_DATA_ATTRS.SHARED_FOLDER,
    public: TOUR_DATA_ATTRS.PUBLIC_FOLDER,
    incognito: TOUR_DATA_ATTRS.INCOGNITO_FOLDER,
  };
  return folderMap[folderId];
};

// Tour route constants
export const TOUR_ROUTES = {
  LOGIN: "/user/login",
  SIGNUP: "/user/signup",
  NEW_CHAT: "/threads",
} as const;

// Tour path segments
export const TOUR_PATH_SEGMENTS = {
  NEW: "new",
} as const;

// Helper to build localized route
export const getTourRoute = (
  locale: string,
  route: (typeof TOUR_ROUTES)[keyof typeof TOUR_ROUTES],
): string => {
  return `/${locale}${route}`;
};

// Helper to build new chat URL
export const getNewChatUrl = (locale: string, folderId: string): string => {
  return `/${locale}${TOUR_ROUTES.NEW_CHAT}/${folderId}/${TOUR_PATH_SEGMENTS.NEW}`;
};

// Tour step placement constants
export const TOUR_PLACEMENTS = {
  TOP: "top",
  BOTTOM: "bottom",
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
} as const;

export type TourPlacement =
  (typeof TOUR_PLACEMENTS)[keyof typeof TOUR_PLACEMENTS];

// Helper to get localized Joyride button labels
export const getJoyrideLabels = (
  t: TFunction,
): {
  back: string;
  close: string;
  last: string;
  next: string;
  skip: string;
} => ({
  back: t("app.chat.welcomeTour.buttons.back"),
  close: t("app.chat.welcomeTour.buttons.close"),
  last: t("app.chat.welcomeTour.buttons.last"),
  next: t("app.chat.welcomeTour.buttons.next"),
  skip: t("app.chat.welcomeTour.buttons.skip"),
});

// Tour style constants
export const TOUR_COLORS = {
  PRIMARY: "#3b82f6",
  BACKGROUND: "#1f2937",
  TEXT: "#f3f4f6",
  MUTED: "#9ca3af",
} as const;

export const TOUR_SPACING = {
  TOOLTIP_BORDER_RADIUS: 8,
  TOOLTIP_PADDING: 20,
  BUTTON_BORDER_RADIUS: 6,
  BUTTON_PADDING: "8px 16px",
  BUTTON_MARGIN_RIGHT: 8,
  BUTTON_FONT_SIZE: 14,
  BUTTON_FONT_WEIGHT: 600,
  Z_INDEX: 10000,
} as const;

export const TOUR_TEXT_ALIGN = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
} as const;

export const getTourSteps = (
  t: TFunction,
  isAuthenticated = false,
): TourStepConfig[] => {
  const appName = t("config.appName");

  // Get icon components from folder configs
  const PrivateFolderIcon = getIconComponent(
    DEFAULT_FOLDER_CONFIGS.private.icon,
  );
  const IncognitoFolderIcon = getIconComponent(
    DEFAULT_FOLDER_CONFIGS.incognito.icon,
  );
  const SharedFolderIcon = getIconComponent(DEFAULT_FOLDER_CONFIGS.shared.icon);
  const PublicFolderIcon = getIconComponent(DEFAULT_FOLDER_CONFIGS.public.icon);
  const KeyboardIcon = getIconComponent("keyboard");
  const MicIcon = getIconComponent("mic");
  const PhoneIcon = getIconComponent("phone");

  return [
    // Step 1: Welcome
    {
      target: "body",
      content: (
        <Div className="space-y-3">
          <H2 className="text-2xl font-bold">
            {t("app.chat.welcomeTour.welcome.title", { appName })}
          </H2>
          <P className="text-base">
            {t("app.chat.welcomeTour.welcome.description")}
          </P>
          <P className="text-sm text-muted-foreground">
            {t("app.chat.welcomeTour.welcome.subtitle")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.CENTER,
      disableBeacon: true,
    },
    // Step 2: AI Companion Selector - clicking opens the selector with its own onboarding
    {
      target: getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.aiCompanion.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.aiCompanion.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.aiCompanion.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.TOP,
      // Allow user to click the selector to open it
      spotlightClicks: true,
    },
    // NOTE: Selector internal steps removed - the unified selector now has its own
    // built-in onboarding ("Meet Your AI Companion") that handles companion selection.
    // When selector closes after user picks a companion, tour continues to sidebar steps.
    {
      target: getTourSelector(TOUR_DATA_ATTRS.ROOT_FOLDERS),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.rootFolders.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.rootFolders.description")}
          </P>
          <Ul className="text-xs space-y-1 ml-4 list-disc">
            <Li>
              <Strong className="text-sky-400">
                {t("app.chat.welcomeTour.rootFolders.private.name")}
              </Strong>{" "}
              - {t("app.chat.welcomeTour.rootFolders.private.suffix")}
            </Li>
            <Li>
              <Strong className="text-purple-400">
                {t("app.chat.welcomeTour.rootFolders.incognito.name")}
              </Strong>{" "}
              - {t("app.chat.welcomeTour.rootFolders.incognito.suffix")}
            </Li>
            <Li>
              <Strong className="text-teal-400">
                {t("app.chat.welcomeTour.rootFolders.shared.name")}
              </Strong>{" "}
              - {t("app.chat.welcomeTour.rootFolders.shared.suffix")}
            </Li>
            <Li>
              <Strong className="text-amber-400">
                {t("app.chat.welcomeTour.rootFolders.public.name")}
              </Strong>{" "}
              - {t("app.chat.welcomeTour.rootFolders.public.suffix")}
            </Li>
          </Ul>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.RIGHT,
    },
    // Private Folder - Only show if authenticated
    ...(isAuthenticated
      ? [
          {
            target: getTourSelector(TOUR_DATA_ATTRS.PRIVATE_FOLDER),
            content: (
              <Div className="space-y-3">
                <H3 className="text-lg font-semibold flex items-center gap-2">
                  <PrivateFolderIcon className="h-5 w-5" />
                  <Span className="text-sky-400">
                    {t("app.chat.welcomeTour.privateFolder.name")}
                  </Span>
                  {t("app.chat.welcomeTour.privateFolder.suffix")}
                </H3>
                <P className="text-sm">
                  {t("app.chat.welcomeTour.privateFolder.description")}
                </P>
              </Div>
            ),
            placement: TOUR_PLACEMENTS.RIGHT,
          },
        ]
      : []),
    {
      target: getTourSelector(TOUR_DATA_ATTRS.INCOGNITO_FOLDER),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold flex items-center gap-2">
            <IncognitoFolderIcon className="h-5 w-5" />
            <Span className="text-purple-400">
              {t("app.chat.welcomeTour.incognitoFolder.name")}
            </Span>
            {t("app.chat.welcomeTour.incognitoFolder.suffix")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.incognitoFolder.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.incognitoFolder.note")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.RIGHT,
    },
    // Shared Folder - Only show if authenticated
    ...(isAuthenticated
      ? [
          {
            target: getTourSelector(TOUR_DATA_ATTRS.SHARED_FOLDER),
            content: (
              <Div className="space-y-3">
                <H3 className="text-lg font-semibold flex items-center gap-2">
                  <SharedFolderIcon className="h-5 w-5" />
                  <Span className="text-teal-400">
                    {t("app.chat.welcomeTour.sharedFolder.name")}
                  </Span>
                  {t("app.chat.welcomeTour.sharedFolder.suffix")}
                </H3>
                <P className="text-sm">
                  {t("app.chat.welcomeTour.sharedFolder.description")}
                </P>
              </Div>
            ),
            placement: TOUR_PLACEMENTS.RIGHT,
          },
        ]
      : []),
    {
      target: getTourSelector(TOUR_DATA_ATTRS.PUBLIC_FOLDER),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold flex items-center gap-2">
            <PublicFolderIcon className="h-5 w-5" />
            <Span className="text-amber-400">
              {t("app.chat.welcomeTour.publicFolder.name")}
            </Span>
            {t("app.chat.welcomeTour.publicFolder.suffix")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.publicFolder.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.publicFolder.note")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.RIGHT,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.NEW_CHAT_BUTTON),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.newChatButton.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.newChatButton.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.newChatButton.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.RIGHT,
    },
    // Sidebar Login - Only show if NOT authenticated (element doesn't exist when logged in)
    ...(!isAuthenticated
      ? [
          {
            target: getTourSelector(TOUR_DATA_ATTRS.SIDEBAR_LOGIN),
            content: (
              <Div className="space-y-2">
                <H3 className="text-lg font-semibold">
                  {t("app.chat.welcomeTour.sidebarLogin.title")}
                </H3>
                <P className="text-sm">
                  {t("app.chat.welcomeTour.sidebarLogin.description")}
                </P>
                <P className="text-xs text-muted-foreground">
                  {t("app.chat.welcomeTour.sidebarLogin.tip")}
                </P>
              </Div>
            ),
            placement: TOUR_PLACEMENTS.RIGHT,
          },
        ]
      : []),
    {
      target: getTourSelector(TOUR_DATA_ATTRS.SUBSCRIPTION_BUTTON),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.subscriptionButton.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.subscriptionButton.description", {
              credits: "800",
              price: t("app.chat.welcomeTour.subscriptionButton.price"),
            })}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.subscriptionButton.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.RIGHT,
    },
    // Step: Text Input
    {
      target: getTourSelector(TOUR_DATA_ATTRS.CHAT_INPUT),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold flex items-center gap-2">
            <KeyboardIcon className="h-5 w-5" />
            {t("app.chat.welcomeTour.chatInput.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.chatInput.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.chatInput.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.TOP,
    },
    // Step: Voice Input (Mic button)
    {
      target: getTourSelector(TOUR_DATA_ATTRS.SPEECH_INPUT),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold flex items-center gap-2">
            <MicIcon className="h-5 w-5" />
            {t("app.chat.welcomeTour.voiceInput.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.voiceInput.description")}
          </P>
          <Ul className="text-xs space-y-1 ml-4 list-disc text-muted-foreground">
            <Li>{t("app.chat.welcomeTour.voiceInput.options.transcribe")}</Li>
            <Li>{t("app.chat.welcomeTour.voiceInput.options.sendAudio")}</Li>
            <Li>{t("app.chat.welcomeTour.voiceInput.options.pauseResume")}</Li>
          </Ul>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.TOP,
    },
    // Step: Call Mode (Phone button)
    {
      target: getTourSelector(TOUR_DATA_ATTRS.CALL_MODE_BUTTON),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold flex items-center gap-2">
            <PhoneIcon className="h-5 w-5 text-green-500" />
            {t("app.chat.welcomeTour.callMode.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.callMode.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.callMode.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.TOP,
    },
    {
      target: "body",
      content: (
        <Div className="space-y-3">
          <H2 className="text-2xl font-bold">
            {t("app.chat.welcomeTour.complete.title")}
          </H2>
          <P className="text-base">
            {t("app.chat.welcomeTour.complete.description")}
          </P>
          <P className="text-sm text-muted-foreground">
            {t("app.chat.welcomeTour.complete.help")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.CENTER,
    },
  ];
};

// Steps specifically for authenticated users (shown after login during tour)
export const getAuthContinuationSteps = (t: TFunction): TourStepConfig[] => [
  {
    target: getTourSelector(TOUR_DATA_ATTRS.PRIVATE_FOLDER),
    content: (
      <Div className="space-y-2">
        <H3 className="text-lg font-semibold">
          ✅{" "}
          <Span className="text-sky-400">
            {t("app.chat.welcomeTour.privateFolder.name")}
          </Span>{" "}
          {t("app.chat.welcomeTour.authUnlocked.unlocked")}
        </H3>
        <P className="text-sm">
          {t("app.chat.welcomeTour.authUnlocked.privateDescription")}
        </P>
        <P className="text-xs text-muted-foreground">
          {t("app.chat.welcomeTour.authUnlocked.privateNote")}
        </P>
      </Div>
    ),
    placement: TOUR_PLACEMENTS.RIGHT,
    disableBeacon: true,
  },
  {
    target: getTourSelector(TOUR_DATA_ATTRS.SHARED_FOLDER),
    content: (
      <Div className="space-y-2">
        <H3 className="text-lg font-semibold">
          ✅{" "}
          <Span className="text-teal-400">
            {t("app.chat.welcomeTour.sharedFolder.name")}
          </Span>{" "}
          {t("app.chat.welcomeTour.authUnlocked.unlocked")}
        </H3>
        <P className="text-sm">
          {t("app.chat.welcomeTour.authUnlocked.sharedDescription")}
        </P>
        <P className="text-xs text-muted-foreground">
          {t("app.chat.welcomeTour.authUnlocked.sharedNote")}
        </P>
      </Div>
    ),
    placement: TOUR_PLACEMENTS.RIGHT,
  },
];

// LocalStorage keys
export const TOUR_STORAGE_KEY = "ai-chat-welcome-tour-completed";
export const TOUR_SKIPPED_KEY = "ai-chat-welcome-tour-skipped";
export const TOUR_AUTH_PENDING_KEY = "ai-chat-welcome-tour-auth-pending";
export const TOUR_LAST_STEP_KEY = "ai-chat-welcome-tour-last-step";
export const TOUR_IN_PROGRESS_KEY = "ai-chat-welcome-tour-in-progress";
