// Browser E2E test helper — drives the real widget UI via Chrome automation.
// Complements sendTestRequest (in-process) by proving the full browser path:
// navigate → fill fields → submit → poll query cache → return response.

import { randomUUID } from "node:crypto";
import { join } from "node:path";

import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { endpointToUrlSegment } from "../../../core/core-utils/path";
import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import { Methods } from "../../../core/definition/enums";
import { defaultLocale } from "../../../core/i18n/core/config";
import type { ResponseType } from "../../../core/route/response.schema";
import { ErrorResponseTypes, fail } from "../../../core/route/response.schema";
import type { WidgetData } from "../../../core/utils/json";
import { parseError } from "../../../core/utils/parse-error";
import type { JwtPayloadType } from "../../../identity/auth/types";
import { UserPermissionRole } from "../../../identity/roles/enum";
import { ATLAS_PID_FILE, readPidFilePort } from "../../../platforms/web/pid";
import { scopedTranslation } from "../test/i18n";

import {
  cdpNavigatePage,
  getSessionCDPTargetId,
  setCookiesViaCDP,
} from "@/browser/repository";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FlatLeaf = string | number | boolean;

interface BrowserTestOptions {
  /**
   * Override the debounce wait (ms) for auto-submit / GET endpoints.
   * Defaults to 800ms (endpoint default 500ms + buffer).
   */
  autoSubmitWaitMs?: number;
  /** Override the response wait timeout in ms. Defaults to 10_000. */
  responseTimeoutMs?: number;
}

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

/**
 * End-to-end browser test for a widget endpoint.
 *
 * Flow:
 *   1. Open a fresh isolated Chrome session (random sessionId)
 *   2. Navigate to /en-US/tools/<alias>  ← logged so you can click it
 *   3. Fill all request fields by name
 *   4. Submit or wait for auto-submit debounce (GET / autoSubmit endpoints)
 *   5. Poll TanStack query cache until populated
 *   6. Optionally save a screenshot to .tmp/
 */
export async function sendBrowserTestRequest<
  TEndpoint extends CreateApiEndpointAny,
>({
  endpoint,
  data,
  urlPathParams,
  user,
  options = {},
}: {
  endpoint: TEndpoint;
  user?: JwtPayloadType;
  options?: BrowserTestOptions;
} & (TEndpoint["types"]["RequestOutput"] extends never
  ? { data?: never }
  : { data: TEndpoint["types"]["RequestOutput"] }) &
  (TEndpoint["types"]["UrlVariablesOutput"] extends never
    ? { urlPathParams?: never }
    : {
        urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
      })): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  const { autoSubmitWaitMs = 800, responseTimeoutMs = 10_000 } = options;

  // Each call gets a unique session so parallel tests never share a Chrome tab.
  const sessionId = `e2e-${randomUUID()}`;
  const { t } = scopedTranslation.scopedT(defaultLocale);

  try {
    // ── 1. Resolve user ────────────────────────────────────────────────────
    let testUser: JwtPayloadType;
    if (user) {
      testUser = user;
    } else if (endpoint.requiresAuthentication()) {
      const { resolveTestAdminUser } = await import("./resolve-test-user");
      testUser = await resolveTestAdminUser();
    } else {
      const { resolveTestAdminUser } = await import("./resolve-test-user");
      const admin = await resolveTestAdminUser();
      testUser = {
        isPublic: true,
        leadId: admin.leadId,
        roles: [UserPermissionRole.PUBLIC],
      };
    }

    // ── 2. Resolve port & widget URL segment ───────────────────────────────
    const port = readPidFilePort(ATLAS_PID_FILE);
    if (!port) {
      return fail({
        message: t("errors.browser.serverNotRunning"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // First alias when present, otherwise the canonical "path.../METHOD" segment.
    // The /tools/ widget resolves both forms (see resolveEndpoint), so aliasless
    // endpoints are testable too.
    const urlSegment = endpointToUrlSegment(endpoint);

    const urlParams = urlPathParams
      ? new URLSearchParams(
          Object.entries(urlPathParams as Record<string, string>).map(
            ([k, v]) => [k, String(v)],
          ),
        ).toString()
      : "";
    const widgetUrl = `http://localhost:${port}/en-US/tools/${urlSegment}${urlParams ? `?${urlParams}` : ""}`;

    // ── 3. Browser tool runner (delegates to sendTestRequest) ──────────────
    const { sendTestRequest } = await import("./send-test-request");

    const browserRun = async <TDef extends CreateApiEndpointAny>(
      def: TDef,
      input: TDef["types"]["RequestOutput"],
    ): Promise<ResponseType<TDef["types"]["ResponseOutput"]>> => {
      type SendArgs = Parameters<typeof sendTestRequest<TDef>>[0];
      // The conditional intersection type on sendTestRequest can't be narrowed for
      // generic TDef — double-cast is the established pattern (see browser-tools.test.ts)
      const args = {
        endpoint: def,
        data: input,
        user: testUser,
        toolExecutionContext: rootlessToolExecutionContext(),
      };
      return sendTestRequest(
        args as Parameters<typeof sendTestRequest>[0] as SendArgs,
      );
    };

    // ── 4. Lazy-import browser tool definitions ────────────────────────────
    const [newPageDefs, evalDefs, closePageDefs] = await Promise.all([
      import("@/browser/new-page/definition"),
      import("@/browser/evaluate-script/definition"),
      import("@/browser/close-page/definition"),
    ]);

    const newPageEndpoint = newPageDefs.default.POST;
    const evalEndpoint = evalDefs.default.POST;
    const closePageEndpoint = closePageDefs.default.POST;

    const closePage = (): Promise<void> =>
      browserRun(closePageEndpoint, { instanceId: sessionId }).then(
        () => undefined,
      );

    let pageOpened = false;
    try {
      // ── 5. Open about:blank (instant — no load-event hang) ──────────────────
      const blankResult = await browserRun(newPageEndpoint, {
        url: "about:blank",
        replacePage: true,
        timeout: 5000,
        instanceId: sessionId,
      });
      if (!blankResult.success) {
        return fail({
          message: t("errors.browser.openFailed", {
            detail: blankResult.message,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      pageOpened = true;

      // ── 5b. Create a real DB session + inject auth cookie before navigating ──
      if (!testUser.isPublic) {
        const { AuthRepository } =
          await import("../../../identity/auth/repository");
        const { SessionRepository } =
          await import("../../../identity/session/repository");
        const { AUTH_TOKEN_COOKIE_NAME } = await import("@/env/constants");
        const { createEndpointLogger } = await import("../../../logger/server");
        const logger = createEndpointLogger(false, defaultLocale);
        const tokenResult = await AuthRepository.signJwt(
          testUser,
          logger,
          defaultLocale,
        );
        if (tokenResult.success) {
          // Session must exist in DB — the server validates the token against the sessions table
          await SessionRepository.create(
            {
              userId: testUser.id,
              token: tokenResult.data,
              expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            },
            defaultLocale,
          );
          const cdpTargetId = await getSessionCDPTargetId(sessionId);
          if (cdpTargetId) {
            await setCookiesViaCDP(cdpTargetId, [
              {
                name: AUTH_TOKEN_COOKIE_NAME,
                value: tokenResult.data,
                domain: "localhost",
                path: "/",
                httpOnly: true,
                secure: false,
              },
            ]);
          }
        }
      }

      // ── 5c. Navigate to widget via CDP Page.navigate (no load-event hang) ──
      {
        const cdpTargetId = await getSessionCDPTargetId(sessionId);
        if (cdpTargetId) {
          await cdpNavigatePage(cdpTargetId, widgetUrl, 30_000);
        }
      }

      // ── 5d. Wait for form inputs to appear (widget fully rendered) ───────────
      await waitForHydration(async () => {
        const probe = await browserRun(evalEndpoint, {
          function: `() => document.querySelectorAll('input[name]').length`,
          instanceId: sessionId,
        });
        const probeRaw = extractTextFromResponse(
          probe.success ? (probe.data as WidgetData) : null,
        );
        const probeText = stripMarkdownCodeBlock(probeRaw);
        const count = parseInt(probeText, 10);
        return !isNaN(count) && count > 0;
      }, 30_000);

      // ── 6. Fill form fields via evaluate-script ────────────────────────────
      // Use window.__formSetValue (RHF form.setValue) for all fields.
      // This works for both native inputs and custom UI components (Radix Select, etc.)
      // since it directly updates the RHF field state and triggers validation.
      const flatData = flattenObject(data as WidgetData);
      const fieldEntries = Object.entries(flatData).filter(
        (entry): entry is [string, FlatLeaf] =>
          entry[1] !== undefined && entry[1] !== null,
      );

      if (fieldEntries.length > 0) {
        const fieldsJson = JSON.stringify(
          fieldEntries.map(([name, value]) => ({ name, value })),
        );
        const fillScript = `() => {
          const fields = ${fieldsJson};
          const setValue = window.__formSetValue;
          if (!setValue) return 'no-form-set-value';
          let filled = 0;
          for (const { name, value } of fields) {
            setValue(name, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            filled++;
          }
          return filled;
        }`;
        const fillResult = await browserRun(evalEndpoint, {
          function: fillScript,
          instanceId: sessionId,
        });
        if (!fillResult.success) {
          return fail({
            message: t("errors.browser.fillFailed", {
              detail: fillResult.message,
            }),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
      }

      // ── 7. Submit or wait for auto-submit ─────────────────────────────────
      type EndpointWithFormOptions = CreateApiEndpointAny & {
        formOptions?: { autoSubmit?: boolean };
      };
      const formOpts = (endpoint as EndpointWithFormOptions).formOptions;
      const isAutoSubmit =
        endpoint.method === Methods.GET || formOpts?.autoSubmit === true;

      if (isAutoSubmit) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, autoSubmitWaitMs);
        });
      } else {
        // Store pre-submit mutation count in window so poll script can skip old mutations
        await browserRun(evalEndpoint, {
          function: `() => { const qc = window.__queryClient; const all = qc ? qc.getMutationCache().getAll() : []; window.__priorMutationCount = all.length; return all.length; }`,
          instanceId: sessionId,
        });

        // Click submit button via evaluate-script.
        // Use the LAST submit button — stack-layer entries render after the base layer,
        // so the last button belongs to the top (most-specific) widget context.
        const clickScript = `() => {
          const btns = document.querySelectorAll('button[type="submit"]');
          const btn = btns.length > 0 ? btns[btns.length - 1] : null;
          if (btn) { btn.click(); return 'clicked(' + btns.length + ')'; }
          return 'no-submit-button';
        }`;
        const clickResult = await browserRun(evalEndpoint, {
          function: clickScript,
          instanceId: sessionId,
        });
        if (!clickResult.success) {
          return fail({
            message: t("errors.browser.submitFailed", {
              detail: clickResult.message,
            }),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
      }

      // ── 8. Screenshot (always) ────────────────────────────────────────────
      {
        const screenshotDefs =
          await import("@/browser/take-screenshot/definition");
        const screenshotPath = join(
          process.cwd(),
          ".tmp",
          `browser-test-${urlSegment.replaceAll(/[^a-zA-Z0-9-]/g, "_")}-${Date.now()}.png`,
        );
        await browserRun(screenshotDefs.default.POST, {
          format: "png",
          filePath: screenshotPath,
          instanceId: sessionId,
        });
      }

      // ── 9. Poll mutation cache until populated ─────────────────────────────
      // POST mutations store results in the mutation cache, not the query cache.
      // Skip mutations that existed before the submit (tracked via __priorMutationCount).
      const evalScript = `() => {
      const qc = window.__queryClient;
      if (!qc) return null;
      const prior = window.__priorMutationCount ?? 0;
      const mutations = qc.getMutationCache().getAll();
      const newMutations = mutations.slice(prior);
      for (const m of newMutations) {
        if (m.state.status === 'success' && m.state.data) {
          return m.state.data;
        }
        if (m.state.status === 'error') {
          return m.state.error ?? { success: false, message: 'mutation error', errorType: { errorKey: 'errorTypes.internal_error', errorCode: 500 } };
        }
      }
      return null;
    }`;

      const deadline = Date.now() + responseTimeoutMs;
      let rawJson = "";
      while (Date.now() < deadline) {
        const evalResult = await browserRun(evalEndpoint, {
          function: evalScript,
          instanceId: sessionId,
        });
        if (!evalResult.success) {
          return fail({
            message: t("errors.browser.evaluateFailed", {
              detail: evalResult.message,
            }),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        const rawText = extractTextFromResponse(
          evalResult.success ? (evalResult.data as WidgetData) : null,
        );
        const text = stripMarkdownCodeBlock(rawText);
        // null/undefined/__queryClient missing → keep polling
        // also skip debug messages (start with {"debug":)
        if (
          text &&
          text !== "null" &&
          text !== "undefined" &&
          !text.startsWith('{"debug":')
        ) {
          rawJson = text;
          break;
        }
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 300);
        });
      }

      if (!rawJson) {
        return fail({
          message: t("errors.browser.resultTimeout", {
            timeoutMs: responseTimeoutMs,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      let cachedResponse: ResponseType<TEndpoint["types"]["ResponseOutput"]>;
      try {
        // chrome-devtools-mcp JSON-encodes the script return value.
        // If it's a quoted string, unwrap one level to get the real JSON.
        let jsonToParse = rawJson;
        if (jsonToParse.startsWith('"') && jsonToParse.endsWith('"')) {
          jsonToParse = JSON.parse(jsonToParse) as string;
        }
        cachedResponse = JSON.parse(jsonToParse) as ResponseType<
          TEndpoint["types"]["ResponseOutput"]
        >;
      } catch {
        return fail({
          message: t("errors.browser.parseFailed", {
            raw: rawJson.slice(0, 400),
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      if (cachedResponse === null) {
        return fail({
          message: t("errors.browser.cacheEmpty"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return cachedResponse;
    } finally {
      if (pageOpened) {
        await closePage();
      }
    }
  } catch (error) {
    return fail({
      message: t("errors.browser.requestFailed", {
        detail: parseError(error).message,
      }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Flatten a nested object to dot-notation keys matching react-hook-form field names.
 * Arrays use index notation: items.0.name
 */
function flattenObject(
  obj: WidgetData | null | undefined,
  prefix = "",
): Record<string, FlatLeaf> {
  if (!obj || typeof obj !== "object") {
    return {};
  }
  const result: Record<string, FlatLeaf> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item && typeof item === "object") {
          Object.assign(
            result,
            flattenObject(item as WidgetData, `${fullKey}.${i}`),
          );
        } else if (item !== null && item !== undefined) {
          result[`${fullKey}.${i}`] = item as FlatLeaf;
        }
      });
    } else if (
      value !== null &&
      value !== undefined &&
      typeof value === "object"
    ) {
      Object.assign(result, flattenObject(value as WidgetData, fullKey));
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      result[fullKey] = value;
    }
  }
  return result;
}

/**
 * Strip chrome-devtools-mcp markdown wrapper from evaluate-script output.
 * Format: "Script ran on page and returned:\n```json\n<value>\n```"
 */
function stripMarkdownCodeBlock(text: string): string {
  const match = /```(?:json|javascript|js)?\n([\s\S]*?)\n```/.exec(text);
  return match ? match[1] : text;
}

/** Poll an async condition every 300ms until it returns true or deadline passes. */
async function waitForHydration(
  check: () => Promise<boolean>,
  timeoutMs: number,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await check()) {
      return;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 300);
    });
  }
}

/** Extract text from any response shape (ContentResponse, string, plain object). */
function extractTextFromResponse(
  data: WidgetData | FlatLeaf | null | undefined,
): string {
  if (typeof data === "string") {
    return data;
  }
  if (!data || typeof data !== "object") {
    return "";
  }

  interface Block {
    [key: string]: WidgetData;
  }

  const extractBlocks = (blocks: WidgetData): string => {
    if (!Array.isArray(blocks)) {
      return "";
    }
    return (blocks as Block[])
      .filter(
        (b) =>
          b !== null &&
          b !== undefined &&
          typeof b === "object" &&
          b["type"] === "text" &&
          typeof b["text"] === "string",
      )
      .map((b) => b["text"] as string)
      .join("\n");
  };

  // Browser tool response shape: { success, result: [{type, text}], ... }
  if ("result" in data && Array.isArray(data["result"])) {
    return extractBlocks(data["result"]);
  }

  // ContentResponse shape: { content: Array<{ type, text }> }
  if ("content" in data && Array.isArray(data["content"])) {
    return extractBlocks(data["content"]);
  }

  // Flat array of content blocks
  if (Array.isArray(data)) {
    return extractBlocks(data);
  }

  return "";
}
