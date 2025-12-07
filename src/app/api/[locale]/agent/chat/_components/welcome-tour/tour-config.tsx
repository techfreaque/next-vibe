import type { Step } from "react-joyride";
import type { TFunction } from "@/i18n/core/static-types";
import { Div } from "next-vibe-ui/ui/div";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import { Span } from "next-vibe-ui/ui/span";
import { Link } from "next-vibe-ui/ui/link";
import { Ul } from "next-vibe-ui/ui/ul";
import { Li } from "next-vibe-ui/ui/li";
import { Strong } from "next-vibe-ui/ui/strong";

export interface TourStepConfig extends Step {
  requiresAuth?: boolean;
  hideBeforeAuth?: boolean;
}

// Data-tour attribute constants
export const TOUR_DATA_ATTRS = {
  MODEL_SELECTOR: "model-selector",
  MODEL_SELECTOR_SEARCH: "model-selector-search",
  MODEL_SELECTOR_GROUP: "model-selector-group",
  MODEL_SELECTOR_FAVORITES: "model-selector-favorites",
  PERSONA_SELECTOR: "persona-selector",
  PERSONA_SELECTOR_SEARCH: "persona-selector-search",
  PERSONA_SELECTOR_GROUP: "persona-selector-group",
  PERSONA_SELECTOR_FAVORITES: "persona-selector-favorites",
  ROOT_FOLDERS: "root-folders",
  INCOGNITO_FOLDER: "incognito-folder",
  PUBLIC_FOLDER: "public-folder",
  PRIVATE_FOLDER: "private-folder",
  SHARED_FOLDER: "shared-folder",
  NEW_CHAT_BUTTON: "new-chat-button",
  SIDEBAR_LOGIN: "sidebar-login",
  CHAT_INPUT: "chat-input",
  SPEECH_INPUT: "speech-input",
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
  locale: string,
  isAuthenticated = false,
): TourStepConfig[] => {
  const appName = t("config.appName");

  return [
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
    {
      target: getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.modelSelector.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.modelSelector.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.modelSelector.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.TOP,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_FAVORITES),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.modelSelectorFavorites.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.modelSelectorFavorites.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.modelSelectorFavorites.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.BOTTOM,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_SEARCH),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.modelSelectorSearch.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.modelSelectorSearch.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.modelSelectorSearch.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.BOTTOM,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR_GROUP),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.modelSelectorGroup.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.modelSelectorGroup.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.modelSelectorGroup.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.BOTTOM,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.personaSelector.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.personaSelector.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.personaSelector.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.TOP,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_FAVORITES),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.personaSelectorFavorites.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.personaSelectorFavorites.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.personaSelectorFavorites.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.BOTTOM,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_SEARCH),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.personaSelectorSearch.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.personaSelectorSearch.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.personaSelectorSearch.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.BOTTOM,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.PERSONA_SELECTOR_GROUP),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.personaSelectorGroup.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.personaSelectorGroup.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("app.chat.welcomeTour.personaSelectorGroup.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.BOTTOM,
    },
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
              <Strong className="text-purple-400">
                {t("app.chat.welcomeTour.rootFolders.incognito.name")}
              </Strong>{" "}
              - {t("app.chat.welcomeTour.rootFolders.incognito.suffix")}
            </Li>
            <Li>
              <Strong className="text-amber-400">
                {t("app.chat.welcomeTour.rootFolders.public.name")}
              </Strong>{" "}
              - {t("app.chat.welcomeTour.rootFolders.public.suffix")}
            </Li>
            <Li>
              <Strong className="text-sky-400">
                {t("app.chat.welcomeTour.rootFolders.private.name")}
              </Strong>{" "}
              - {t("app.chat.welcomeTour.rootFolders.private.suffix")}
            </Li>
            <Li>
              <Strong className="text-teal-400">
                {t("app.chat.welcomeTour.rootFolders.shared.name")}
              </Strong>{" "}
              - {t("app.chat.welcomeTour.rootFolders.shared.suffix")}
            </Li>
          </Ul>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.RIGHT,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.INCOGNITO_FOLDER),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            🛡️{" "}
            <Span className="text-purple-400">
              {t("app.chat.welcomeTour.incognitoFolder.name")}
            </Span>{" "}
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
    {
      target: getTourSelector(TOUR_DATA_ATTRS.PUBLIC_FOLDER),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            🌍{" "}
            <Span className="text-amber-400">
              {t("app.chat.welcomeTour.publicFolder.name")}
            </Span>{" "}
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
      target: getTourSelector(TOUR_DATA_ATTRS.PRIVATE_FOLDER),
      content: (
        <Div className="space-y-3">
          <H3 className="text-lg font-semibold">
            🔒{" "}
            <Span className="text-sky-400">
              {t("app.chat.welcomeTour.privateFolder.name")}
            </Span>{" "}
            {t("app.chat.welcomeTour.privateFolder.suffix")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.privateFolder.description")}
          </P>
          {!isAuthenticated && (
            <Div className="space-y-2">
              <P className="text-xs font-medium text-amber-400">
                {t("app.chat.welcomeTour.privateFolder.authPrompt")}
              </P>
              <Div className="flex gap-2">
                <Link
                  href={getTourRoute(locale, TOUR_ROUTES.LOGIN)}
                  className="flex-1 h-8 px-3 rounded-md text-center text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
                >
                  {t("app.chat.welcomeTour.privateFolder.login")}
                </Link>
                <Link
                  href={getTourRoute(locale, TOUR_ROUTES.SIGNUP)}
                  className="flex-1 h-8 px-3 rounded-md text-center text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
                >
                  {t("app.chat.welcomeTour.privateFolder.signUp")}
                </Link>
              </Div>
            </Div>
          )}
        </Div>
      ),
      placement: TOUR_PLACEMENTS.RIGHT,
    },
    {
      target: getTourSelector(TOUR_DATA_ATTRS.SHARED_FOLDER),
      content: (
        <Div className="space-y-3">
          <H3 className="text-lg font-semibold">
            👥{" "}
            <Span className="text-teal-400">
              {t("app.chat.welcomeTour.sharedFolder.name")}
            </Span>{" "}
            {t("app.chat.welcomeTour.sharedFolder.suffix")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.sharedFolder.description")}
          </P>
          {!isAuthenticated && (
            <Div className="space-y-2">
              <P className="text-xs font-medium text-amber-400">
                {t("app.chat.welcomeTour.sharedFolder.authPrompt")}
              </P>
              <Div className="flex gap-2">
                <Link
                  href={getTourRoute(locale, TOUR_ROUTES.LOGIN)}
                  className="flex-1 h-8 px-3 rounded-md text-center text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
                >
                  {t("app.chat.welcomeTour.sharedFolder.login")}
                </Link>
                <Link
                  href={getTourRoute(locale, TOUR_ROUTES.SIGNUP)}
                  className="flex-1 h-8 px-3 rounded-md text-center text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
                >
                  {t("app.chat.welcomeTour.sharedFolder.signUp")}
                </Link>
              </Div>
            </Div>
          )}
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
    {
      target: getTourSelector(TOUR_DATA_ATTRS.CHAT_INPUT),
      content: (
        <Div className="space-y-3">
          <H3 className="text-lg font-semibold">
            {t("app.chat.welcomeTour.chatInput.title")}
          </H3>
          <P className="text-sm">
            {t("app.chat.welcomeTour.chatInput.description")}
          </P>
          <Div className="space-y-2">
            <Div className="flex items-start gap-2">
              <Span className="text-lg">⌨️</Span>
              <Div>
                <P className="text-sm font-medium">
                  {t("app.chat.welcomeTour.chatInput.typing.title")}
                </P>
                <P className="text-xs text-muted-foreground">
                  {t("app.chat.welcomeTour.chatInput.typing.description")}
                </P>
              </Div>
            </Div>
            <Div className="flex items-start gap-2">
              <Span className="text-lg">🎤</Span>
              <Div>
                <P className="text-sm font-medium">
                  {t("app.chat.welcomeTour.chatInput.voice.title")}
                </P>
                <P className="text-xs text-muted-foreground">
                  {t("app.chat.welcomeTour.chatInput.voice.description")}
                </P>
              </Div>
            </Div>
          </Div>
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
