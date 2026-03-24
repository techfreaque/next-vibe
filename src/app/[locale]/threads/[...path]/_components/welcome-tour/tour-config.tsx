import { Div } from "next-vibe-ui/ui/div";
import { Li } from "next-vibe-ui/ui/li";
import { Span } from "next-vibe-ui/ui/span";
import { Strong } from "next-vibe-ui/ui/strong";
import { H2, H3, P } from "next-vibe-ui/ui/typography";
import { Ul } from "next-vibe-ui/ui/ul";
import type { Step } from "react-joyride";

import { DEFAULT_FOLDER_CONFIGS } from "@/app/api/[locale]/agent/chat/config";
import type { ThreadsWidgetT } from "@/app/api/[locale]/agent/chat/threads/widget/i18n";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatCurrency } from "@/i18n/core/localization-utils";
import { getTourSelector, TOUR_DATA_ATTRS } from "./tour-attrs";
export {
  getFolderTourAttr,
  getTourSelector,
  TOUR_DATA_ATTRS,
} from "./tour-attrs";
export type { TourDataAttr } from "./tour-attrs";

export interface TourStepConfig extends Step {
  requiresAuth?: boolean;
  hideBeforeAuth?: boolean;
}

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
  t: ThreadsWidgetT,
): {
  back: string;
  close: string;
  last: string;
  next: string;
  skip: string;
} => ({
  back: t("components.welcomeTour.buttons.back"),
  close: t("components.welcomeTour.buttons.close"),
  last: t("components.welcomeTour.buttons.last"),
  next: t("components.welcomeTour.buttons.next"),
  skip: t("components.welcomeTour.buttons.skip"),
});

function getCssVar(token: string): string {
  if (typeof window === "undefined") {
    return "";
  }
  return getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
}

// Wrap a raw CSS var value in hsl() if it looks like bare HSL numbers,
// otherwise return as-is (already a hex or other valid color).
function toColor(value: string): string {
  return /^\d/.test(value) ? `hsl(${value})` : value;
}

export const getTourColors = (): {
  PRIMARY: string;
  PRIMARY_FOREGROUND: string;
  BACKGROUND: string;
  OVERLAY: string;
  TEXT: string;
  MUTED: string;
} => ({
  PRIMARY: toColor(getCssVar("--primary")),
  PRIMARY_FOREGROUND: toColor(getCssVar("--primary-foreground")),
  BACKGROUND: toColor(getCssVar("--popover")),
  OVERLAY: `color-mix(in srgb, ${toColor(getCssVar("--background"))} 60%, transparent)`,
  TEXT: toColor(getCssVar("--popover-foreground")),
  MUTED: toColor(getCssVar("--muted-foreground")),
});

export const TOUR_SPACING = {
  TOOLTIP_BORDER_RADIUS: 8,
  TOOLTIP_PADDING: 20,
  BUTTON_BORDER_RADIUS: 6,
  BUTTON_PADDING: "8px 16px",
  BUTTON_MARGIN_RIGHT: 8,
  BUTTON_FONT_SIZE: 14,
  BUTTON_FONT_WEIGHT: 600,
  Z_INDEX: 300,
} as const;

export const TOUR_TEXT_ALIGN = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
} as const;

export const getTourSteps = (
  t: ThreadsWidgetT,
  isAuthenticated = false,
  locale: CountryLanguage,
): TourStepConfig[] => {
  const appName = t("config.appName");
  const sub = productsRepository.getProduct(ProductIds.SUBSCRIPTION, locale);
  const free = productsRepository.getProduct(ProductIds.FREE_TIER, locale);

  return [
    // Step 1: Welcome
    {
      target: "body",
      content: (
        <Div className="space-y-3">
          <H2 className="text-2xl font-bold">
            {t("components.welcomeTour.welcome.title", { appName })}
          </H2>
          <P className="text-base">
            {t("components.welcomeTour.welcome.description")}
          </P>
          <P className="text-sm text-muted-foreground">
            {t("components.welcomeTour.welcome.subtitle")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.CENTER,
      skipBeacon: true,
    },
    // Step 2: AI Companion Selector - clicking opens the selector with its own onboarding
    {
      target: getTourSelector(TOUR_DATA_ATTRS.MODEL_SELECTOR),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("components.welcomeTour.aiCompanion.title")}
          </H3>
          <P className="text-sm">
            {t("components.welcomeTour.aiCompanion.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("components.welcomeTour.aiCompanion.tip")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.TOP,
      // Allow user to click the selector to open it
      blockTargetInteraction: false,
    },
    // NOTE: Selector internal steps removed - the unified selector now has its own
    // built-in onboarding ("Meet Your AI Companion") that handles companion selection.
    // When selector closes after user picks a companion, tour continues to sidebar steps.
    {
      target: getTourSelector(TOUR_DATA_ATTRS.ROOT_FOLDERS),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("components.welcomeTour.rootFolders.title")}
          </H3>
          <P className="text-sm">
            {t("components.welcomeTour.rootFolders.description")}
          </P>
          <Ul className="text-xs space-y-1 ml-4 list-disc">
            <Li>
              <Strong className="text-sky-400">
                {t("components.welcomeTour.rootFolders.private.name")}
              </Strong>{" "}
              - {t("components.welcomeTour.rootFolders.private.suffix")}
            </Li>
            <Li>
              <Strong className="text-purple-400">
                {t("components.welcomeTour.rootFolders.incognito.name")}
              </Strong>{" "}
              - {t("components.welcomeTour.rootFolders.incognito.suffix")}
            </Li>
            <Li>
              <Strong className="text-teal-400">
                {t("components.welcomeTour.rootFolders.shared.name")}
              </Strong>{" "}
              - {t("components.welcomeTour.rootFolders.shared.suffix")}
            </Li>
            <Li>
              <Strong className="text-amber-400">
                {t("components.welcomeTour.rootFolders.public.name")}
              </Strong>{" "}
              - {t("components.welcomeTour.rootFolders.public.suffix")}
            </Li>
          </Ul>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.RIGHT,
      skipBeacon: true,
    },
    // Private Folder - Only show if authenticated
    ...(isAuthenticated
      ? [
          {
            target: getTourSelector(TOUR_DATA_ATTRS.PRIVATE_FOLDER),
            content: (
              <Div className="space-y-3">
                <H3 className="text-lg font-semibold flex items-center gap-2">
                  <Icon
                    icon={DEFAULT_FOLDER_CONFIGS.private.icon}
                    className="h-5 w-5"
                  />
                  <Span className="text-sky-400">
                    {t("components.welcomeTour.privateFolder.name")}
                  </Span>
                  {t("components.welcomeTour.privateFolder.suffix")}
                </H3>
                <P className="text-sm">
                  {t("components.welcomeTour.privateFolder.description")}
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
            <Icon
              icon={DEFAULT_FOLDER_CONFIGS.incognito.icon}
              className="h-5 w-5"
            />
            <Span className="text-purple-400">
              {t("components.welcomeTour.incognitoFolder.name")}
            </Span>
            {t("components.welcomeTour.incognitoFolder.suffix")}
          </H3>
          <P className="text-sm">
            {t("components.welcomeTour.incognitoFolder.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("components.welcomeTour.incognitoFolder.note")}
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
                  <Icon
                    icon={DEFAULT_FOLDER_CONFIGS.shared.icon}
                    className="h-5 w-5"
                  />
                  <Span className="text-teal-400">
                    {t("components.welcomeTour.sharedFolder.name")}
                  </Span>
                  {t("components.welcomeTour.sharedFolder.suffix")}
                </H3>
                <P className="text-sm">
                  {t("components.welcomeTour.sharedFolder.description")}
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
            <Icon
              icon={DEFAULT_FOLDER_CONFIGS.public.icon}
              className="h-5 w-5"
            />
            <Span className="text-amber-400">
              {t("components.welcomeTour.publicFolder.name")}
            </Span>
            {t("components.welcomeTour.publicFolder.suffix")}
          </H3>
          <P className="text-sm">
            {t("components.welcomeTour.publicFolder.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("components.welcomeTour.publicFolder.note")}
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
            {t("components.welcomeTour.newChatButton.title")}
          </H3>
          <P className="text-sm">
            {t("components.welcomeTour.newChatButton.description")}
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
                  {t("components.welcomeTour.sidebarLogin.title")}
                </H3>
                <P className="text-sm">
                  {t("components.welcomeTour.sidebarLogin.description")}
                </P>
                <P className="text-xs text-muted-foreground">
                  {t("components.welcomeTour.sidebarLogin.tip")}
                </P>
              </Div>
            ),
            placement: TOUR_PLACEMENTS.RIGHT,
            skipBeacon: true,
          },
        ]
      : []),
    {
      target: getTourSelector(TOUR_DATA_ATTRS.SUBSCRIPTION_BUTTON),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold">
            {t("components.welcomeTour.subscriptionButton.title")}
          </H3>
          <P className="text-sm">
            {t("components.welcomeTour.subscriptionButton.description", {
              credits: String(sub.credits),
              price: formatCurrency(sub.price, sub.currency, locale),
              freeCredits: String(free.credits),
            })}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.RIGHT,
      skipBeacon: true,
    },
    // Step: Text Input
    {
      target: getTourSelector(TOUR_DATA_ATTRS.CHAT_INPUT),
      content: (
        <Div className="space-y-2">
          <H3 className="text-lg font-semibold flex items-center gap-2">
            <Icon icon="keyboard" className="h-5 w-5" />
            {t("components.welcomeTour.chatInput.title")}
          </H3>
          <P className="text-sm">
            {t("components.welcomeTour.chatInput.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("components.welcomeTour.chatInput.tip")}
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
            <Icon icon="mic" className="h-5 w-5" />
            {t("components.welcomeTour.voiceInput.title")}
          </H3>
          <P className="text-sm">
            {t("components.welcomeTour.voiceInput.description")}
          </P>
          <Ul className="text-xs space-y-1 ml-4 list-disc text-muted-foreground">
            <Li>{t("components.welcomeTour.voiceInput.options.transcribe")}</Li>
            <Li>{t("components.welcomeTour.voiceInput.options.sendAudio")}</Li>
            <Li>
              {t("components.welcomeTour.voiceInput.options.pauseResume")}
            </Li>
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
            <Icon icon="phone" className="h-5 w-5 text-green-500" />
            {t("components.welcomeTour.callMode.title")}
          </H3>
          <P className="text-sm">
            {t("components.welcomeTour.callMode.description")}
          </P>
          <P className="text-xs text-muted-foreground">
            {t("components.welcomeTour.callMode.tip")}
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
            {t("components.welcomeTour.complete.title")}
          </H2>
          <P className="text-base">
            {t("components.welcomeTour.complete.description")}
          </P>
          <P className="text-sm text-muted-foreground">
            {t("components.welcomeTour.complete.help")}
          </P>
        </Div>
      ),
      placement: TOUR_PLACEMENTS.CENTER,
    },
  ];
};

// Steps specifically for authenticated users (shown after login during tour)
export const getAuthContinuationSteps = (
  t: ThreadsWidgetT,
): TourStepConfig[] => [
  {
    target: getTourSelector(TOUR_DATA_ATTRS.PRIVATE_FOLDER),
    content: (
      <Div className="space-y-2">
        <H3 className="text-lg font-semibold">
          ✅{" "}
          <Span className="text-sky-400">
            {t("components.welcomeTour.privateFolder.name")}
          </Span>{" "}
          {t("components.welcomeTour.authUnlocked.unlocked")}
        </H3>
        <P className="text-sm">
          {t("components.welcomeTour.authUnlocked.privateDescription")}
        </P>
        <P className="text-xs text-muted-foreground">
          {t("components.welcomeTour.authUnlocked.privateNote")}
        </P>
      </Div>
    ),
    placement: TOUR_PLACEMENTS.RIGHT,
    skipBeacon: true,
  },
  {
    target: getTourSelector(TOUR_DATA_ATTRS.SHARED_FOLDER),
    content: (
      <Div className="space-y-2">
        <H3 className="text-lg font-semibold">
          ✅{" "}
          <Span className="text-teal-400">
            {t("components.welcomeTour.sharedFolder.name")}
          </Span>{" "}
          {t("components.welcomeTour.authUnlocked.unlocked")}
        </H3>
        <P className="text-sm">
          {t("components.welcomeTour.authUnlocked.sharedDescription")}
        </P>
        <P className="text-xs text-muted-foreground">
          {t("components.welcomeTour.authUnlocked.sharedNote")}
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
