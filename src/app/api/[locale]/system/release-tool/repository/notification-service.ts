/**
 * Notification Service
 * Send notifications via webhooks (Slack, Discord, Teams, Mattermost, Google Chat, etc.)
 */

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type {
  NotificationConfig,
  NotificationData,
  NotificationResult,
} from "../definition";
import { MESSAGES, RETRY_DEFAULTS, TIMEOUTS } from "./constants";
import { formatDuration, sleep } from "./utils";

// ============================================================================
// Types
// ============================================================================

/**
 * Extended notification config with additional options
 */
export interface ExtendedNotificationConfig extends NotificationConfig {
  /** Retry configuration for failed notifications */
  retry?: {
    maxAttempts: number;
    delayMs: number;
    backoffMultiplier: number;
  };
  /** Request timeout in ms */
  timeout?: number;
  /** Custom HTTP headers */
  headers?: Record<string, string>;
  /** Whether to throw on notification failure */
  throwOnFailure?: boolean;
}

// Payload type definitions for webhook services
interface SlackAttachmentField {
  title: string;
  value: string;
  short: boolean;
}
interface SlackAttachment {
  color: string;
  title: string;
  fields: SlackAttachmentField[];
  footer: string;
  ts: number;
}
interface SlackPayload {
  text: string;
  username: string;
  icon_emoji: string;
  attachments?: SlackAttachment[];
}

interface DiscordEmbedField {
  name: string;
  value: string;
  inline: boolean;
}
interface DiscordEmbed {
  title: string;
  color: number;
  fields: DiscordEmbedField[];
  timestamp: string;
  footer: { text: string };
}
interface DiscordPayload {
  content: string;
  username: string;
  embeds?: DiscordEmbed[];
}

interface TeamsFact {
  name: string;
  value: string;
}
interface TeamsSection {
  activityTitle: string;
  activitySubtitle?: string;
  facts?: TeamsFact[];
  markdown: boolean;
}
interface TeamsAction {
  "@type": string;
  name: string;
  targets: { os: string; uri: string }[];
}
interface TeamsPayload {
  "@type": string;
  "@context": string;
  themeColor: string;
  summary: string;
  sections: TeamsSection[];
  potentialAction?: TeamsAction[];
}

interface MattermostField {
  title: string;
  value: string;
  short: boolean;
}
interface MattermostAttachment {
  color: string;
  title: string;
  fields: MattermostField[];
}
interface MattermostPayload {
  text: string;
  username: string;
  icon_emoji: string;
  attachments?: MattermostAttachment[];
}

interface GoogleChatKeyValue {
  topLabel: string;
  content: string;
}
interface GoogleChatWidget {
  textParagraph?: { text: string };
  keyValue?: GoogleChatKeyValue;
}
interface GoogleChatSection {
  widgets: GoogleChatWidget[];
}
interface GoogleChatCard {
  header: { title: string; subtitle: string; imageUrl: string };
  sections: GoogleChatSection[];
}
interface GoogleChatPayload {
  cards: GoogleChatCard[];
}

interface TelegramPayload {
  text: string;
  parse_mode: string;
  disable_notification: boolean;
}

interface CustomPayload {
  event: string;
  message: string;
  success: boolean;
  package?: string;
  version?: string;
  duration?: number;
  durationFormatted?: string;
  timings?: NotificationData["timings"];
  error?: string;
  releaseUrl?: string;
  registryUrls?: string[];
  commitSha?: string;
  branch?: string;
  timestamp: string;
}

type WebhookPayload =
  | SlackPayload
  | DiscordPayload
  | TeamsPayload
  | MattermostPayload
  | GoogleChatPayload
  | TelegramPayload
  | CustomPayload;

// ============================================================================
// Interface
// ============================================================================

export interface INotificationService {
  /**
   * Send a notification via webhook
   */
  sendNotification(
    config: NotificationConfig | ExtendedNotificationConfig,
    data: NotificationData,
    logger: EndpointLogger,
  ): Promise<NotificationResult>;

  /**
   * Send multiple notifications in parallel
   */
  sendMultiple(
    configs: Array<NotificationConfig | ExtendedNotificationConfig>,
    data: NotificationData,
    logger: EndpointLogger,
  ): Promise<NotificationResult[]>;

  /**
   * Validate a webhook URL
   */
  validateWebhookUrl(url: string): boolean;
}

// ============================================================================
// Payload Builders
// ============================================================================

const payloadBuilders: Record<
  string,
  (
    message: string,
    data: NotificationData,
    config: NotificationConfig,
  ) => WebhookPayload
> = {
  slack: (
    message: string,
    data: NotificationData,
    config: NotificationConfig,
  ): SlackPayload => ({
    text: message,
    username: "Release Bot",
    icon_emoji: data.success ? ":rocket:" : ":x:",
    attachments:
      config.includeTimings && data.timings
        ? [
            {
              color: data.success ? "good" : "danger",
              title: "Release Details",
              fields: [
                ...(data.version
                  ? [{ title: "Version", value: data.version, short: true }]
                  : []),
                ...(data.duration
                  ? [
                      {
                        title: "Duration",
                        value: formatDuration(data.duration),
                        short: true,
                      },
                    ]
                  : []),
                ...Object.entries(data.timings)
                  .filter(
                    ([key]) =>
                      key !== "total" &&
                      data.timings?.[key as keyof typeof data.timings],
                  )
                  .map(([key, value]) => ({
                    title: key.charAt(0).toUpperCase() + key.slice(1),
                    value: formatDuration(value as number),
                    short: true,
                  })),
              ],
              footer: "Release Tool",
              ts: Math.floor(Date.now() / 1000),
            },
          ]
        : undefined,
  }),

  discord: (
    message: string,
    data: NotificationData,
    config: NotificationConfig,
  ) => ({
    content: message,
    username: "Release Bot",
    embeds:
      config.includeTimings && data.timings
        ? [
            {
              title: data.success ? "Release Successful" : "Release Failed",
              color: data.success ? 0x00ff00 : 0xff0000,
              fields: [
                ...(data.version
                  ? [{ name: "Version", value: data.version, inline: true }]
                  : []),
                ...(data.duration
                  ? [
                      {
                        name: "Duration",
                        value: formatDuration(data.duration),
                        inline: true,
                      },
                    ]
                  : []),
                ...Object.entries(data.timings)
                  .filter(
                    ([key]) =>
                      key !== "total" &&
                      data.timings?.[key as keyof typeof data.timings],
                  )
                  .map(([key, value]) => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    value: formatDuration(value as number),
                    inline: true,
                  })),
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "Release Tool" },
            },
          ]
        : undefined,
  }),

  teams: (
    message: string,
    data: NotificationData,
    config: NotificationConfig,
  ) => ({
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    themeColor: data.success ? "00FF00" : "FF0000",
    summary: message,
    sections: [
      {
        activityTitle: message,
        activitySubtitle: data.version ? `Version ${data.version}` : undefined,
        facts:
          config.includeTimings && data.timings
            ? [
                ...(data.duration
                  ? [{ name: "Duration", value: formatDuration(data.duration) }]
                  : []),
                ...Object.entries(data.timings)
                  .filter(
                    ([key]) =>
                      key !== "total" &&
                      data.timings?.[key as keyof typeof data.timings],
                  )
                  .map(([key, value]) => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    value: formatDuration(value as number),
                  })),
              ]
            : undefined,
        markdown: true,
      },
    ],
    potentialAction: data.releaseUrl
      ? [
          {
            "@type": "OpenUri",
            name: "View Release",
            targets: [{ os: "default", uri: data.releaseUrl }],
          },
        ]
      : undefined,
  }),

  mattermost: (
    message: string,
    data: NotificationData,
    config: NotificationConfig,
  ) => ({
    text: message,
    username: "Release Bot",
    icon_emoji: data.success ? ":rocket:" : ":x:",
    attachments:
      config.includeTimings && data.timings
        ? [
            {
              color: data.success ? "#00FF00" : "#FF0000",
              title: "Release Details",
              fields: Object.entries(data.timings)
                .filter(
                  ([key]) =>
                    key !== "total" &&
                    data.timings?.[key as keyof typeof data.timings],
                )
                .map(([key, value]) => ({
                  title: key.charAt(0).toUpperCase() + key.slice(1),
                  value: formatDuration(value as number),
                  short: true,
                })),
            },
          ]
        : undefined,
  }),

  googlechat: (
    message: string,
    data: NotificationData,
    config: NotificationConfig,
  ) => ({
    cards: [
      {
        header: {
          title: data.success ? "Release Successful" : "Release Failed",
          subtitle: data.packageName ?? "Release Tool",
          imageUrl: data.success
            ? "https://ssl.gstatic.com/images/icons/material/system/1x/check_circle_green_48dp.png"
            : "https://ssl.gstatic.com/images/icons/material/system/1x/error_red_48dp.png",
        },
        sections: [
          {
            widgets: [
              { textParagraph: { text: message } },
              ...(config.includeTimings && data.timings
                ? [
                    {
                      keyValue: {
                        topLabel: "Duration",
                        content: data.duration
                          ? formatDuration(data.duration)
                          : "N/A",
                      },
                    },
                  ]
                : []),
            ],
          },
        ],
      },
    ],
  }),

  telegram: (message: string, data: NotificationData) => ({
    text: `${data.success ? "" : ""} ${message}`,
    parse_mode: "HTML",
    disable_notification: data.success,
  }),

  custom: (
    message: string,
    data: NotificationData,
    config: NotificationConfig,
  ) => ({
    event: data.success ? "release.success" : "release.failure",
    message,
    success: data.success,
    package: data.packageName,
    version: data.version,
    duration: data.duration,
    durationFormatted: data.duration
      ? formatDuration(data.duration)
      : undefined,
    timings: config.includeTimings ? data.timings : undefined,
    error: data.error,
    releaseUrl: data.releaseUrl,
    registryUrls: data.registryUrls,
    commitSha: data.commitSha,
    branch: data.branch,
    timestamp: new Date().toISOString(),
  }),
};

// ============================================================================
// Implementation
// ============================================================================

export class NotificationService implements INotificationService {
  async sendNotification(
    config: NotificationConfig | ExtendedNotificationConfig,
    data: NotificationData,
    logger: EndpointLogger,
  ): Promise<NotificationResult> {
    if (!config.enabled || !config.webhookUrl) {
      return { type: "disabled", success: true };
    }

    // Check if we should send based on success/failure
    if (data.success && !config.onSuccess) {
      return { type: "skipped", success: true, message: "onSuccess disabled" };
    }
    if (!data.success && !config.onFailure) {
      return { type: "skipped", success: true, message: "onFailure disabled" };
    }

    // Validate webhook URL
    if (!this.validateWebhookUrl(config.webhookUrl)) {
      return {
        type: config.type ?? "custom",
        success: false,
        message: "Invalid webhook URL",
      };
    }

    logger.info(MESSAGES.NOTIFICATION_SENDING, {
      type: config.type ?? "custom",
    });

    const extConfig = config as ExtendedNotificationConfig;
    const maxAttempts =
      extConfig.retry?.maxAttempts ?? RETRY_DEFAULTS.MAX_ATTEMPTS;
    const initialDelay =
      extConfig.retry?.delayMs ?? RETRY_DEFAULTS.INITIAL_DELAY;
    const backoff =
      extConfig.retry?.backoffMultiplier ?? RETRY_DEFAULTS.BACKOFF_MULTIPLIER;
    const timeout = extConfig.timeout ?? TIMEOUTS.NOTIFICATION;

    let lastErrorMsg = "Unknown error";

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const result = await this.sendWithTimeout(
        config,
        data,
        timeout,
        extConfig.headers,
      );

      if (result.success) {
        logger.info(MESSAGES.NOTIFICATION_SENT, {
          type: config.type ?? "custom",
        });
        return {
          type: config.type ?? "custom",
          success: true,
        };
      }

      lastErrorMsg = result.error;

      if (attempt < maxAttempts) {
        const delay = initialDelay * Math.pow(backoff, attempt - 1);
        logger.warn(MESSAGES.NOTIFICATION_RETRYING, {
          attempt,
          maxAttempts,
          delay: formatDuration(delay),
          error: lastErrorMsg,
        });
        await sleep(delay);
      }
    }

    logger.error(MESSAGES.NOTIFICATION_FAILED, { error: lastErrorMsg });

    return {
      type: config.type ?? "custom",
      success: false,
      message: lastErrorMsg,
    };
  }

  async sendMultiple(
    configs: Array<NotificationConfig | ExtendedNotificationConfig>,
    data: NotificationData,
    logger: EndpointLogger,
  ): Promise<NotificationResult[]> {
    const enabledConfigs = configs.filter((c) => c.enabled && c.webhookUrl);

    if (enabledConfigs.length === 0) {
      return [];
    }

    logger.info(`Sending ${enabledConfigs.length} notifications in parallel`);

    const results = await Promise.all(
      enabledConfigs.map((config) =>
        this.sendNotification(config, data, logger),
      ),
    );

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    if (failCount > 0) {
      logger.warn(
        `${failCount} of ${enabledConfigs.length} notifications failed`,
      );
    } else {
      logger.info(`All ${successCount} notifications sent successfully`);
    }

    return results;
  }

  validateWebhookUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  }

  private async sendWithTimeout(
    config: NotificationConfig,
    data: NotificationData,
    timeout: number,
    customHeaders?: Record<string, string>,
  ): Promise<{ success: true } | { success: false; error: string }> {
    // Build message
    const status = data.success ? "succeeded" : "failed";
    const defaultMessage = data.packageName
      ? `Release of ${data.packageName}${data.version ? `@${data.version}` : ""} ${status}`
      : `Release ${status}`;

    /* eslint-disable no-template-curly-in-string -- Intentional placeholder syntax for message templates */
    const message =
      config.messageTemplate
        ?.replaceAll("${name}", data.packageName ?? "")
        .replaceAll("${version}", data.version ?? "")
        .replaceAll("${status}", status)
        .replaceAll(
          "${duration}",
          data.duration ? formatDuration(data.duration) : "",
        )
        .replaceAll("${error}", data.error ?? "")
        .replaceAll("${branch}", data.branch ?? "")
        .replaceAll("${commit}", data.commitSha ?? "")
        .replaceAll("${releaseUrl}", data.releaseUrl ?? "") ?? defaultMessage;
    /* eslint-enable no-template-curly-in-string */

    // Get payload builder
    const builderType = config.type ?? "custom";
    const buildPayload = payloadBuilders[builderType] ?? payloadBuilders.custom;
    const payload = buildPayload(message, data, config);

    // Send request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // webhookUrl is guaranteed to exist since we validate it in sendNotification
      const webhookUrl = config.webhookUrl ?? "";
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...customHeaders,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Webhook returned ${response.status}: ${response.statusText}`,
        };
      }

      return { success: true };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMsg };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Singleton instance
export const notificationService = new NotificationService();
