// Testing infrastructure - messages are for test debugging, not end users

/**
 * EndpointForm — drives one endpoint's rendered form like a user would.
 *
 *   const form = await open(loginEndpoints.POST, { path: "/user/login" });
 *   await form.fill({ email, password });
 *   const result = await form.submit();
 *   // result.sent === true  → real request + response captured off the wire
 *   // result.sent === false → UI blocked it; result.fieldErrors has the messages
 *
 *   const list = await open(threadsEndpoints.GET, { query: { rootFolderId: "private" } });
 *   const loaded = await list.firstCall();   // GET fired on mount
 *
 * Everything is derived from the definition: which widget each key is, which
 * option label a value maps to, which API URL the submit must hit. Every call
 * the page makes to the endpoint — on load, on auto-submit, on click — is
 * recorded from the moment the form is attached (before navigation). When a
 * request is sent after fill(), its body is asserted to contain every value
 * filled — proving each widget wrote what the user entered into the request.
 */

import type { Locator, Page, Request, Route } from "playwright";
import { expect } from "vitest";

import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import { FieldDataType, Methods } from "../../../core/definition/enums";
import type { ResponseType } from "../../../core/route/response.schema";
import type { WidgetData } from "../../../core/utils/json";
import { getTranslatorFromEndpoint } from "../../../unified-ui/_shared/field-helpers";
import { E2E_LOCALE, E2E_RESPONSE_TIMEOUT_MS } from "./config";
import { recordField, recordOutcome } from "./coverage";
import type { E2EFieldMeta, E2EFieldValue } from "./field-drivers";
import { getFieldDriver } from "./field-drivers";

export type E2EFormData<TEndpoint extends CreateApiEndpointAny> = Partial<
  TEndpoint["types"]["RequestOutput"]
>;

export interface E2ESubmitSent<TEndpoint extends CreateApiEndpointAny> {
  sent: true;
  status: number;
  /** Parsed JSON envelope; for non-JSON bodies (files, audio) see `contentType`/`bytes`. */
  response: ResponseType<TEndpoint["types"]["ResponseOutput"]>;
  requestBody: WidgetData;
  contentType: string;
  bytes: number;
}

export interface E2ESubmitBlocked {
  sent: false;
  /** field path → error message the user sees */
  fieldErrors: Record<string, string>;
  /** "native": browser constraint validation (type=email, required…); "app": form schema errors */
  blockedBy: "native" | "app";
}

export type E2ESubmitResult<TEndpoint extends CreateApiEndpointAny> =
  | E2ESubmitSent<TEndpoint>
  | E2ESubmitBlocked;

/** Canonical endpoint id — same form as the generated alias map keys. */
export function e2eEndpointId(endpoint: CreateApiEndpointAny): string {
  return `${endpoint.path.join("_")}_${endpoint.method}`.replaceAll(
    /\[([^\]]+)\]/g,
    "$1",
  );
}

function escapeRegex(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** `/api/<locale>/<path>` with `[param]` segments as wildcards — mirrors call-api.ts buildUrl. */
function apiPathPattern(endpoint: CreateApiEndpointAny): RegExp {
  const segments = endpoint.path.map((segment) =>
    (segment.startsWith("[") && segment.endsWith("]")) ||
    segment.startsWith(":")
      ? "[^/]+"
      : escapeRegex(segment),
  );
  return new RegExp(`/api/[^/]+/${segments.join("/")}$`);
}

function rootChildren(
  endpoint: CreateApiEndpointAny,
): Record<string, E2EFieldMeta> {
  // Structural read of the runtime field tree (same boundary as WidgetRenderer.collectEntries)
  const fields = endpoint.fields as E2EFieldMeta;
  return fields.children ?? {};
}

function requestUsage(field: E2EFieldMeta): string | undefined {
  return (field as { usage?: { request?: string } }).usage?.request;
}

/**
 * Request field paths the web form can render — used to find the right <form>
 * on pages with several. Skips `hidden` and role-gated (`visibleFor`) fields:
 * anchoring on one that never renders would stall `open()`.
 */
function requestFieldPaths(
  children: Record<string, E2EFieldMeta>,
  prefix = "",
): string[] {
  const paths: string[] = [];
  for (const [key, child] of Object.entries(children)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const usage = requestUsage(child);
    if (
      child.type === "form_field" &&
      usage &&
      usage !== "urlPathParams" &&
      child.hidden !== true &&
      child.visibleFor === undefined
    ) {
      paths.push(path);
    }
    if (child.children) {
      paths.push(...requestFieldPaths(child.children, path));
    }
  }
  return paths;
}

function isPlainObject(
  value: WidgetData,
): value is { [key: string]: WidgetData } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A File, or a File[] for multi-file fields — handed to the file driver as is. */
function isFile(
  value: WidgetData | File | readonly File[],
): value is File | readonly File[] {
  if (Array.isArray(value)) {
    return value.length > 0 && value.every((item) => item instanceof File);
  }
  return typeof File !== "undefined" && value instanceof File;
}

function toFieldValue(
  path: string,
  meta: E2EFieldMeta,
  value: WidgetData | File | readonly File[],
): E2EFieldValue {
  if (isFile(value)) {
    return value;
  }
  if (meta.fieldType === FieldDataType.JSON) {
    return typeof value === "string" ? value : JSON.stringify(value);
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (
    Array.isArray(value) &&
    value.every((v) => typeof v === "string" || typeof v === "number")
  ) {
    return value as (string | number)[];
  }
  // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
  throw new Error(
    `[e2e] ${path}: unsupported value ${JSON.stringify(value)} — add a driver that accepts it`,
  );
}

/** Flatten filled values to the dot-keyed strings call-api.ts puts in a GET query. */
function flattenForQuery(
  value: { [key: string]: WidgetData },
  prefix = "",
  out: Record<string, string> = {},
): Record<string, string> {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(child)) {
      flattenForQuery(child, path, out);
    } else if (
      typeof child === "string" ||
      typeof child === "number" ||
      typeof child === "boolean"
    ) {
      out[path] = String(child);
    }
  }
  return out;
}

function readRequestBody(
  endpoint: CreateApiEndpointAny,
  request: Request,
): WidgetData {
  if (endpoint.method === Methods.GET) {
    return Object.fromEntries(new URL(request.url()).searchParams);
  }
  try {
    return (request.postDataJSON() as WidgetData | null) ?? {};
  } catch {
    // multipart (file uploads) — not JSON; the file parts are asserted by the spec
    return {};
  }
}

/**
 * Records every call the page makes to one endpoint. Fetching through the
 * route (not waitForResponse) owns the body: a success often navigates away
 * (login → redirect) and Chrome then discards it.
 */
class CallRecorder<TEndpoint extends CreateApiEndpointAny> {
  readonly calls: E2ESubmitSent<TEndpoint>[] = [];
  private readonly listeners = new Set<() => void>();
  private readonly endpointId: string;
  private readonly pattern: RegExp;

  constructor(private readonly endpoint: TEndpoint) {
    this.endpointId = e2eEndpointId(endpoint);
    this.pattern = apiPathPattern(endpoint);
  }

  async attach(page: Page): Promise<void> {
    await page.route(
      (url) => this.pattern.test(url.pathname),
      (route) => this.handle(route),
    );
  }

  private async handle(route: Route): Promise<void> {
    // The page may navigate or the test end mid-request ("Request context
    // disposed") — nothing left to record or fulfil then.
    await this.record(route).catch(() =>
      route.fallback().catch(() => undefined),
    );
  }

  private async record(route: Route): Promise<void> {
    const request = route.request();
    if (request.method() !== this.endpoint.method) {
      await route.fallback();
      return;
    }
    // No cap: first-run fixture recordings (video, music) outlast the 30s default
    const response = await route.fetch({ timeout: 0 });
    const contentType = response.headers()["content-type"] ?? "";
    const raw = await response.body();
    const status = response.status();
    const isJson = contentType.includes("application/json");
    const body = isJson
      ? (JSON.parse(raw.toString("utf-8")) as ResponseType<
          TEndpoint["types"]["ResponseOutput"]
        >)
      : ({ success: status < 400, data: undefined } as ResponseType<
          TEndpoint["types"]["ResponseOutput"]
        >);
    // 5xx without a JSON body is the server being down (dev restart, proxy
    // 503) — infrastructure, not the endpoint rejecting: never counts as coverage.
    if (isJson || status < 500) {
      recordOutcome(
        this.endpointId,
        body.success ? "success" : "serverRejected",
      );
    }
    this.calls.push({
      sent: true,
      status,
      response: body,
      requestBody: readRequestBody(this.endpoint, request),
      contentType,
      bytes: raw.length,
    });
    for (const listener of this.listeners) {
      listener();
    }
    await route.fulfill({ response, body: raw });
  }

  /** Resolve with call #index (0-based) once it exists, or null on timeout. */
  waitFor(
    index: number,
    timeoutMs = E2E_RESPONSE_TIMEOUT_MS,
  ): Promise<E2ESubmitSent<TEndpoint> | null> {
    const existing = this.calls[index];
    if (existing) {
      return Promise.resolve(existing);
    }
    const { promise, resolve } =
      Promise.withResolvers<E2ESubmitSent<TEndpoint> | null>();
    const listener = (): void => {
      const call = this.calls[index];
      if (call) {
        cleanup();
        resolve(call);
      }
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve(null);
    }, timeoutMs);
    const cleanup = (): void => {
      clearTimeout(timer);
      this.listeners.delete(listener);
    };
    this.listeners.add(listener);
    return promise;
  }
}

export class EndpointForm<TEndpoint extends CreateApiEndpointAny> {
  readonly endpointId: string;
  private readonly children: Record<string, E2EFieldMeta>;
  private readonly anchor: string | null;
  private readonly recorder: CallRecorder<TEndpoint>;
  private readonly t: (
    key: string,
    params?: Record<string, string | number>,
  ) => string;
  private filled: { [key: string]: WidgetData } = {};

  constructor(
    readonly page: Page,
    readonly endpoint: TEndpoint,
  ) {
    this.endpointId = e2eEndpointId(endpoint);
    this.children = rootChildren(endpoint);
    const paths = requestFieldPaths(this.children);
    // Any rendered request field identifies the form — platform-gated fields
    // (hiddenForPlatforms) simply don't match.
    this.anchor =
      paths.length > 0
        ? paths.map((path) => `[data-field="${path}"]`).join(", ")
        : null;
    this.recorder = new CallRecorder(endpoint);
    this.t = getTranslatorFromEndpoint(endpoint)(E2E_LOCALE).t;
  }

  /** Start recording this endpoint's calls. Call before navigating. */
  async attach(): Promise<void> {
    await this.recorder.attach(this.page);
  }

  /** True when the endpoint renders request inputs (else it's display/URL-param only). */
  get hasInputs(): boolean {
    return this.anchor !== null;
  }

  /** Every recorded call so far, in order. */
  get calls(): readonly E2ESubmitSent<TEndpoint>[] {
    return this.recorder.calls;
  }

  /** The call the page fired on mount (GET / auto-submit forms). Fails if none came. */
  async firstCall(): Promise<E2ESubmitSent<TEndpoint>> {
    return await this.requireCall(0, "on load");
  }

  /** The next call after the ones already recorded (auto-submit after fill, refetch…). */
  async nextCall(): Promise<E2ESubmitSent<TEndpoint>> {
    return await this.requireCall(this.recorder.calls.length, "next");
  }

  private async requireCall(
    index: number,
    label: string,
  ): Promise<E2ESubmitSent<TEndpoint>> {
    const call = await this.recorder.waitFor(index);
    if (!call) {
      // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
      throw new Error(
        `[e2e] ${this.endpointId}: no ${label} ${this.endpoint.method} call within ${E2E_RESPONSE_TIMEOUT_MS}ms`,
      );
    }
    return call;
  }

  /** The form owning this endpoint's fields (`[data-hydrated]` root). */
  get root(): Locator {
    // `[data-hydrated]` is set by <Form> only once React owns it, so a visible
    // root is safe to type into (SSR markup is not). Last match = innermost,
    // for forms embedded via noFormElement inside another form.
    const forms = this.page.locator("[data-hydrated]");
    return this.anchor
      ? forms.filter({ has: this.page.locator(this.anchor) }).last()
      : forms.first();
  }

  /** The `[data-field]` wrapper of a field path ("email", "basicInfo.email"). */
  field(path: string): Locator {
    return this.root.locator(`[data-field="${path}"]`);
  }

  /** SUBMIT_BUTTON widget or the container's auto submit (a type="button"). */
  get submitButton(): Locator {
    return this.root.locator('[data-testid="endpoint-submit"]').first();
  }

  /** Visible form alert (FORM_ALERT widget / role=alert) inside the form. */
  get alert(): Locator {
    return this.root.locator('[role="alert"]').first();
  }

  /** Fill fields through their widgets. Keys follow the definition's request shape. */
  async fill(data: E2EFormData<TEndpoint>): Promise<this> {
    await this.fillLevel(
      data as { [key: string]: WidgetData },
      this.children,
      "",
    );
    return this;
  }

  private async fillLevel(
    data: { [key: string]: WidgetData | File | readonly File[] },
    children: Record<string, E2EFieldMeta>,
    prefix: string,
  ): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue;
      }
      const path = prefix ? `${prefix}.${key}` : key;
      const meta = children[key];
      if (!meta) {
        // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
        throw new Error(
          `[e2e] ${this.endpointId}: no field "${path}" in definition`,
        );
      }
      if (meta.children && !isFile(value) && isPlainObject(value)) {
        await this.fillLevel(value, meta.children, path);
        continue;
      }
      const driver = getFieldDriver(meta.fieldType);
      if (!driver) {
        // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
        throw new Error(
          `[e2e] ${path}: no driver for fieldType "${String(meta.fieldType)}" — add one in e2e/field-drivers.ts`,
        );
      }
      const scope = this.field(path);
      await scope.waitFor({ state: "visible" });
      await driver.enter(
        { page: this.page, scope, field: meta, path, t: this.t },
        toFieldValue(path, meta, value),
      );
      recordField(this.endpointId, path, meta.fieldType ?? "unknown");
      if (!isFile(value)) {
        this.setFilled(path, value);
      }
    }
  }

  private setFilled(path: string, value: WidgetData): void {
    const parts = path.split(".");
    let node = this.filled;
    for (const part of parts.slice(0, -1)) {
      const next = node[part];
      node[part] = isPlainObject(next ?? null) ? next : {};
      node = node[part] as { [key: string]: WidgetData };
    }
    node[parts[parts.length - 1]] = value;
  }

  /** Rendered field errors inside the form: path → message. */
  async fieldErrors(): Promise<Record<string, string>> {
    return await this.root.locator("[data-field]").evaluateAll((nodes) => {
      const out: Record<string, string> = {};
      for (const node of nodes) {
        const name = node.getAttribute("data-field");
        const message = node.querySelector("[data-field-error]")?.textContent;
        if (name && message) {
          out[name] = message.trim();
        }
      }
      return out;
    });
  }

  /** Browser-native invalid controls (`:invalid`) inside the form: path → validationMessage. */
  async nativeFieldErrors(): Promise<Record<string, string>> {
    return await this.root.locator("[data-field]").evaluateAll((nodes) => {
      const out: Record<string, string> = {};
      for (const node of nodes) {
        const name = node.getAttribute("data-field");
        const control = node.querySelector<HTMLInputElement>(
          "input:invalid, textarea:invalid, select:invalid",
        );
        if (name && control) {
          out[name] = control.validationMessage;
        }
      }
      return out;
    });
  }

  /**
   * Click submit (or, for auto-submit forms without a button, let the debounce
   * fire) and resolve with whichever the UI produces first: the endpoint's
   * next network call, or rendered client-side field errors.
   */
  async submit(
    options: { assertRequestBody?: boolean } = {},
  ): Promise<E2ESubmitResult<TEndpoint>> {
    const { assertRequestBody = true } = options;
    const callIndex = this.recorder.calls.length;
    const callP = this.recorder
      .waitFor(callIndex)
      .then((call) => (call ? { kind: "call" as const, call } : null));
    const errorsP = this.root
      .locator("[data-field-error]")
      .first()
      .waitFor({ state: "visible", timeout: E2E_RESPONSE_TIMEOUT_MS })
      .then(() => ({ kind: "errors" as const }))
      .catch(() => null);

    if ((await this.submitButton.count()) > 0) {
      await this.submitButton.click();
    }

    // Native constraint validation blocks synchronously on click — no submit
    // event, no request, only a browser bubble. Read it straight off the DOM.
    const nativeErrors = await this.nativeFieldErrors();
    if (Object.keys(nativeErrors).length > 0) {
      recordOutcome(this.endpointId, "clientValidation");
      return { sent: false, fieldErrors: nativeErrors, blockedBy: "native" };
    }

    const first = await Promise.race([callP, errorsP]);
    const winner = first ?? (await callP) ?? (await errorsP);
    if (!winner) {
      // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
      throw new Error(
        `[e2e] ${this.endpointId}: submit produced neither a ${this.endpoint.method} request nor field errors within ${E2E_RESPONSE_TIMEOUT_MS}ms`,
      );
    }

    if (winner.kind === "errors") {
      recordOutcome(this.endpointId, "clientValidation");
      return {
        sent: false,
        fieldErrors: await this.fieldErrors(),
        blockedBy: "app",
      };
    }

    if (assertRequestBody) {
      const expected =
        this.endpoint.method === Methods.GET
          ? flattenForQuery(this.filled)
          : this.filled;
      expect(
        winner.call.requestBody,
        `[e2e] ${this.endpointId}: request is missing values the user filled`,
      ).toMatchObject(expected);
    }
    return winner.call;
  }
}

/**
 * Run `action` (click, keypress…) and return the endpoint call it triggers.
 * For hand-built UIs that don't render the endpoint's own form — the network
 * contract is still the endpoint's, so it's still asserted against it.
 */
export async function captureEndpointCall<
  TEndpoint extends CreateApiEndpointAny,
>(
  page: Page,
  endpoint: TEndpoint,
  action: () => Promise<void>,
  timeoutMs = E2E_RESPONSE_TIMEOUT_MS,
): Promise<E2ESubmitSent<TEndpoint>> {
  const recorder = new CallRecorder(endpoint);
  await recorder.attach(page);
  await action();
  const call = await recorder.waitFor(0, timeoutMs);
  if (!call) {
    // eslint-disable-next-line restricted/restricted-syntax -- test assertion failure
    throw new Error(
      `[e2e] ${e2eEndpointId(endpoint)}: action did not call ${endpoint.method} within ${timeoutMs}ms`,
    );
  }
  return call;
}
