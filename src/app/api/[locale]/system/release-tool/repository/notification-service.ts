/**
 * Notification Service
 * Send notifications via webhooks (Slack, Discord, Teams, Mattermost, Google Chat, etc.)
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";

import type { NotificationConfig } from "../definition";
import { MESSAGES, RETRY_DEFAULTS, TIMEOUTS } from "./constants";
import type { NotificationData, NotificationResult } from "./types";
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

/**
 * Payload builder function type
 */
type PayloadBuilder = (
  message: string,
  data: NotificationData,
  config: NotificationConfig,
) => Record<string, unknown>;

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

const payloadBuilders: Record<string, PayloadBuilder> = {
  slack: (message, data, config) => ({
    text: message,
    username: "Release Bot",
    icon_emoji: data.success ? ":rocket:" : ":x:",
    attachments: config.includeTimings && data.timings
      ? [{
          color: data.success ? "good" : "danger",
          title: "Release Details",
          fields: [
            ...(data.version ? [{ title: "Version", value: data.version, short: true }] : []),
            ...(data.duration ? [{ title: "Duration", value: formatDuration(data.duration), short: true }] : []),
            ...Object.entries(data.timings)
              .filter(([key]) => key !== "total" && data.timings?.[key as keyof typeof data.timings])
              .map(([key, value]) => ({
                title: key.charAt(0).toUpperCase() + key.slice(1),
                value: formatDuration(value as number),
                short: true,
              })),
          ],
          footer: "Release Tool",
          ts: Math.floor(Date.now() / 1000),
        }]
      : undefined,
  }),

  discord: (message, data, config) => ({
    content: message,
    username: "Release Bot",
    embeds: config.includeTimings && data.timings
      ? [{
          title: data.success ? "Release Successful" : "Release Failed",
          color: data.success ? 0x00FF00 : 0xFF0000,
          fields: [
            ...(data.version ? [{ name: "Version", value: data.version, inline: true }] : []),
            ...(data.duration ? [{ name: "Duration", value: formatDuration(data.duration), inline: true }] : []),
            ...Object.entries(data.timings)
              .filter(([key]) => key !== "total" && data.timings?.[key as keyof typeof data.timings])
              .map(([key, value]) => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value: formatDuration(value as number),
                inline: true,
              })),
          ],
          timestamp: new Date().toISOString(),
          footer: { text: "Release Tool" },
        }]
      : undefined,
  }),

  teams: (message, data, config) => ({
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    themeColor: data.success ? "00FF00" : "FF0000",
    summary: message,
    sections: [{
      activityTitle: message,
      activitySubtitle: data.version ? `Version ${data.version}` : undefined,
      facts: config.includeTimings && data.timings
        ? [
            ...(data.duration ? [{ name: "Duration", value: formatDuration(data.duration) }] : []),
            ...Object.entries(data.timings)
              .filter(([key]) => key !== "total" && data.timings?.[key as keyof typeof data.timings])
              .map(([key, value]) => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value: formatDuration(value as number),
              })),
          ]
        : undefined,
      markdown: true,
    }],
    potentialAction: data.releaseUrl
      ? [{
          "@type": "OpenUri",
          name: "View Release",
          targets: [{ os: "default", uri: data.releaseUrl }],
        }]
      : undefined,
  }),

  mattermost: (message, data, config) => ({
    text: message,
    username: "Release Bot",
    icon_emoji: data.success ? ":rocket:" : ":x:",
    attachments: config.includeTimings && data.timings
      ? [{
          color: data.success ? "#00FF00" : "#FF0000",
          title: "Release Details",
          fields: Object.entries(data.timings)
            .filter(([key]) => key !== "total" && data.timings?.[key as keyof typeof data.timings])
            .map(([key, value]) => ({
              title: key.charAt(0).toUpperCase() + key.slice(1),
              value: formatDuration(value as number),
              short: true,
            })),
        }]
      : undefined,
  }),

  googlechat: (message, data, config) => ({
    cards: [{
      header: {
        title: data.success ? "Release Successful" : "Release Failed",
        subtitle: data.packageName ?? "Release Tool",
        imageUrl: data.success
          ? "https://ssl.gstatic.com/images/icons/material/system/1x/check_circle_green_48dp.png"
          : "https://ssl.gstatic.com/images/icons/material/system/1x/error_red_48dp.png",
      },
      sections: [{
        widgets: [
          { textParagraph: { text: message } },
          ...(config.includeTimings && data.timings
            ? [{
                keyValue: {
                  topLabel: "Duration",
                  content: data.duration ? formatDuration(data.duration) : "N/A",
                },
              }]
            : []),
        ],
      }],
    }],
  }),

  telegram: (message, data) => ({
    text: `${data.success ? "" : ""} ${message}`,
    parse_mode: "HTML",
    disable_notification: data.success,
  }),

  custom: (message, data, config) => ({
    event: data.success ? "release.success" : "release.failure",
    message,
    success: data.success,
    package: data.packageName,
    version: data.version,
    duration: data.duration,
    durationFormatted: data.duration ? formatDuration(data.duration) : undefined,
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

    logger.info(MESSAGES.NOTIFICATION_SENDING, { type: config.type ?? "custom" });

    const extConfig = config as ExtendedNotificationConfig;
    const maxAttempts = extConfig.retry?.maxAttempts ?? RETRY_DEFAULTS.MAX_ATTEMPTS;
    const initialDelay = extConfig.retry?.delayMs ?? RETRY_DEFAULTS.INITIAL_DELAY;
    const backoff = extConfig.retry?.backoffMultiplier ?? RETRY_DEFAULTS.BACKOFF_MULTIPLIER;
    const timeout = extConfig.timeout ?? TIMEOUTS.NOTIFICATION;

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await this.sendWithTimeout(config, data, timeout, extConfig.headers);

        logger.info(MESSAGES.NOTIFICATION_SENT, { type: config.type ?? "custom" });
        return {
          type: config.type ?? "custom",
          success: true,
          statusCode: result.status,
          retryCount: attempt > 1 ? attempt - 1 : undefined,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxAttempts) {
          const delay = initialDelay * Math.pow(backoff, attempt - 1);
          logger.warn(MESSAGES.NOTIFICATION_RETRYING, {
            attempt,
            maxAttempts,
            delay: formatDuration(delay),
            error: lastError.message,
          });
          await sleep(delay);
        }
      }
    }

    logger.error(MESSAGES.NOTIFICATION_FAILED, parseError(lastError));

    const result: NotificationResult = {
      type: config.type ?? "custom",
      success: false,
      message: lastError?.message ?? "Unknown error",
      retryCount: maxAttempts - 1,
    };

    if (extConfig.throwOnFailure) {
      throw lastError ?? new Error("Notification failed");
    }

    return result;
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
      enabledConfigs.map((config) => this.sendNotification(config, data, logger)),
    );

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    if (failCount > 0) {
      logger.warn(`${failCount} of ${enabledConfigs.length} notifications failed`);
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
  ): Promise<Response> {
    // Build message
    const status = data.success ? "succeeded" : "failed";
    const defaultMessage = data.packageName
      ? `Release of ${data.packageName}${data.version ? `@${data.version}` : ""} ${status}`
      : `Release ${status}`;

    const message = config.messageTemplate
      ?.replace(/\$\{name\}/g, data.packageName ?? "")
      .replace(/\$\{version\}/g, data.version ?? "")
      .replace(/\$\{status\}/g, status)
      .replace(/\$\{duration\}/g, data.duration ? formatDuration(data.duration) : "")
      .replace(/\$\{error\}/g, data.error ?? "")
      .replace(/\$\{branch\}/g, data.branch ?? "")
      .replace(/\$\{commit\}/g, data.commitSha ?? "")
      .replace(/\$\{releaseUrl\}/g, data.releaseUrl ?? "")
      ?? defaultMessage;

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
        throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Singleton instance
export const notificationService = new NotificationService();
