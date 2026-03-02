/**
 * Vibe Frame Mount — Repository
 *
 * Loads the target endpoint definition, validates access, and returns
 * an isolated HTML shell that can be rendered inside an iframe.
 * The HTML includes a hydration script that bootstraps the React app.
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { DefinitionLoader } from "../../shared/endpoints/definition/loader";
import { generateFrameId } from "../types";
import type {
  VibeFrameMountRequestOutput,
  VibeFrameMountResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MountParams {
  data: VibeFrameMountRequestOutput;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

// ─── Repository ──────────────────────────────────────────────────────────────

export const VibeFrameMountRepository = {
  async mount({
    data,
    user,
    locale,
    logger,
  }: MountParams): Promise<ResponseType<VibeFrameMountResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const {
        endpoint: endpointId,
        frameId: requestedFrameId,
        theme,
        authToken,
      } = data;

      // Parse optional JSON fields
      let urlPathParams: Record<string, string> = {};
      let prefillData: Record<string, string> = {};

      if (data.urlPathParams) {
        try {
          urlPathParams = JSON.parse(data.urlPathParams) as Record<
            string,
            string
          >;
        } catch {
          return fail({
            message: t("get.repository.invalidUrlPathParams"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      if (data.data) {
        try {
          prefillData = JSON.parse(data.data) as Record<string, string>;
        } catch {
          return fail({
            message: t("get.repository.invalidData"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      // Load target endpoint definition
      const loader = new DefinitionLoader();
      const endpointResult = await loader.load({
        identifier: endpointId,
        platform: Platform.NEXT_API,
        user,
        logger,
        locale,
        skipAccessValidation: true, // We validate ourselves for public embed access
      });

      if (!endpointResult.success) {
        return fail({
          message: t("get.repository.endpointNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const frameId = requestedFrameId || generateFrameId();
      const serverUrl = envClient.NEXT_PUBLIC_APP_URL;

      // Build the isolated HTML document
      const html = buildFrameHtml({
        endpointId,
        frameId,
        locale,
        urlPathParams,
        prefillData,
        theme: theme ?? "system",
        serverUrl,
        authToken,
      });

      return success({ html });
    } catch (error) {
      logger.error("VibeFrame mount failed", parseError(error));
      return fail({
        message: t("get.repository.mountFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },
};

// ─── HTML Builder ────────────────────────────────────────────────────────────

interface FrameHtmlOptions {
  endpointId: string;
  frameId: string;
  locale: CountryLanguage;
  urlPathParams: Record<string, string>;
  prefillData: Record<string, string>;
  theme: string;
  serverUrl: string;
  authToken?: string;
}

function buildFrameHtml(options: FrameHtmlOptions): string {
  const {
    endpointId,
    frameId,
    locale,
    urlPathParams,
    prefillData,
    theme,
    serverUrl,
    authToken,
  } = options;

  const hydrationData = JSON.stringify({
    endpoint: endpointId,
    locale,
    urlPathParams,
    data: prefillData,
    theme,
    serverUrl,
    requiresAuth: !!authToken,
    frameId,
  });

  // Escape for safe embedding in HTML
  const escapedHydration = hydrationData
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html lang="${locale.split("-")[0]}" data-theme="${theme}" style="color-scheme: ${theme === "system" ? "light dark" : theme}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vibe Frame</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { font-family: system-ui, -apple-system, sans-serif; background: transparent; overflow: hidden; }
    body { padding: 16px; }
    #vibe-frame-root { min-height: 50px; }
    .vf-loading { display: flex; align-items: center; justify-content: center; padding: 32px; color: #666; }
    .vf-error { padding: 16px; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; }
  </style>
  <link rel="stylesheet" href="${serverUrl}/vibe-frame.css" onerror="this.remove()">
</head>
<body>
  <div id="vibe-frame-root">
    <div class="vf-loading">Loading...</div>
  </div>
  <script>window.__VIBE_FRAME__ = ${escapedHydration};</script>
  ${authToken ? `<script>window.__VIBE_FRAME_TOKEN__ = ${JSON.stringify(authToken)};</script>` : ""}
  <script src="${serverUrl}/vibe-frame-hydrate.js" defer></script>
  <script>
    // Auto-resize: notify parent of content height changes
    (function() {
      var frameId = ${JSON.stringify(frameId)};
      var lastHeight = 0;
      function sendHeight() {
        var h = document.documentElement.scrollHeight;
        if (h !== lastHeight) {
          lastHeight = h;
          window.parent.postMessage({ type: "vf:resize", frameId: frameId, height: h }, "*");
        }
      }
      // Poll until hydration script takes over with ResizeObserver
      var interval = setInterval(sendHeight, 200);
      window.__VF_STOP_RESIZE_POLL__ = function() { clearInterval(interval); };
      sendHeight();
    })();
  </script>
</body>
</html>`;
}
