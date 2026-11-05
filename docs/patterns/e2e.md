# E2E Tests (Playwright)

Real Chromium against a running server. Proves what a customer sees: widgets operate, requests carry what was typed, errors render, redirects happen.

Framework: `src/vibe/tooling/testing/e2e/`. Specs: `<feature>/<name>.e2e.test.ts`, colocated with the definition.

```bash
vibe dev                                   # server under test (Atlas dev); or E2E_BASE_URL=...
bun run test:e2e [filter...]               # every suite, one process each, + coverage report
bun test --isolate src/contact/contact.e2e.test.ts
E2E_HEADED=1 E2E_SLOWMO=250 bun test ...   # watch it
bun src/vibe/tooling/testing/e2e/coverage-report.ts [--min=80]
```

## Spec shape

```ts
import { describe, expect } from "vitest";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import contactEndpoints from "./definition";
import { ContactSubject } from "./enum";

describe("E2E: contact form", () => {
  const e2e = useE2E("contact"); // suite id → coverage + artifact folder

  e2e.it("sends a message", async ({ open, uniqueEmail }) => {
    const form = await open(contactEndpoints.POST, {
      path: "/story/framework",
    });
    await form.fill({
      name: "E2E",
      email: uniqueEmail("contact"),
      subject: ContactSubject.BUG_REPORT,
      message: "...",
    });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success).toBe(true);
  });
});
```

## GET, auto-submit, URL params

```ts
// /tools/<alias>?... — [param] keys become URL path params, the rest prefill fields
const form = await open(threadEndpoints.GET, {
  query: { threadId, rootFolderId: "private" },
});
const loaded = await form.firstCall(); // the call fired on mount
await form.fill({ search: "x" });
const filtered = await form.nextCall(); // auto-submit after the debounce
```

Every call to the endpoint is recorded from before navigation (`form.calls`). `submit()` clicks the submit button when there is one, otherwise waits for the auto-submit. Endpoints with no rendered inputs (URL-param only) skip the form wait.

Non-JSON responses (files, audio) come back with `contentType` + `bytes`; `response.success` reflects the HTTP status.

## Paid / external calls — fixtures

```ts
const e2e = useE2E("agent/image-generation", { fixtures: true });
```

Each test gets its own fixture scope, sent from the browser as `x-vibe-fixture-scope` (honoured in dev/test only). Every external HTTP call made on behalf of that test records to `src/generated/ai-fixtures/http-cache/<slug>/` on the first run, where `<slug>` is `e2e-<suite>--<test>` lowercased, non-alphanumerics collapsed to `-`, cut to 60 chars (the harness rejects two tests in one suite that collide), and replays on every run after. Commit the folder. Delete it to re-record.

- Use it for every suite whose endpoints reach an external service (AI providers, media, search, scraping, email APIs).
- **Product code must route external calls through `createFixtureFetch(toolExecutionContext)`.** A raw `fetch` to an external service escapes record/replay, costs money every run, and is a bug. Fix it in the repository.
- Keep each test's external call order deterministic (ordinals replay by position).

## Rules

- **Test the real page.** Pass `path` for the customer page (`/user/login`, `/story/framework`). Omit it only when the endpoint has no page — then `/tools/<alias>` is used.
- **Every endpoint needs a success**, plus a **rejection** (server or client) when it has any required request field. That is exactly what the coverage report counts as covered.
- **Fill with typed values** (enum members, not labels). The driver resolves option labels via the endpoint's translations and clicks them like a user.
- **`submit()` returns the truth:** `sent: true` → `status`, `response`, `requestBody` captured off the wire (body auto-asserted to contain everything filled). `sent: false` → `fieldErrors` + `blockedBy: "native" | "app"`.
- **Hand-built forms** (not `EndpointsPage`): drive `page` directly, wrap the action in `capture(endpoint, action, timeoutMs?)` for the network contract. Navigate with `gotoReady(path, ready)` — it retries dev-server reloads like `open()` does. Wait on `[data-hydrated] <selector>` before typing — SSR markup gets wiped by hydration.
- **Display-only / custom widgets** that never render the endpoint's own fields: `open(endpoint, { ready: (page) => ... })` replaces the default "form hydrated" wait.
- **Created data:** use `uniqueEmail(tag)` and register `cleanup(fn)` — runs after the test, pass or fail.
- **Auth:** `loginAs(user)` injects a real DB session cookie. Prefer it over driving the login form in every test.
- **Assert on translations, never literal UI strings:** `scopedTranslation.scopedT(defaultLocale).t("...")`.
- **Failed logins pollute the lockout ledger** (counted by email AND IP — enough runs lock every localhost login). Any test that posts a failed login registers `cleanup(() => clearLoginAttempts(email))` (`testing-suite/login-attempts.ts`).
- **Files:** pass `new File([bytes], "name.ext", { type })` for file fields.
- Uncaught page errors fail the test automatically. A dev-server HMR reload or proxy 503 during navigation is retried transparently.
- **Each test runs in its own browser context with a unique user agent**, so anonymous visitors never share a lead (leads are deduped by IP + user agent).
- **Run suites with `bun run test:e2e`** — one process per spec file (Chromium does not survive across files in one `bun test` process), then the coverage report. One file: `bun test --isolate <path>.e2e.test.ts`.

## Failures

Each failure writes `.tmp/e2e/artifacts/<suite>/<test>/` — `trace.zip`, `screenshot.png`, `console.log` — and prints the path. Open the trace: `bunx playwright show-trace <path>/trace.zip` (DOM snapshots per action, network, console).

## DOM hooks the driver relies on

| Hook                              | Set by                                       | Purpose                                           |
| --------------------------------- | -------------------------------------------- | ------------------------------------------------- |
| `[data-hydrated]`                 | `Form` (ui/web/components/form/form.tsx)     | form root, present only once React owns it        |
| `[data-field="<path>"]`           | `FormItem`                                   | one wrapper per field, path = RHF name            |
| `[data-field-error]`              | `FormMessage`                                | rendered field error                              |
| `[data-testid="endpoint-submit"]` | container auto-submit + SUBMIT_BUTTON widget | the submit action                                 |
| `[data-checked]`                  | `MultiSelect` option indicator               | real selection (cmdk's aria-selected = highlight) |

Don't remove them; don't add per-widget `data-testid`s — fix the shared primitive instead.

## Adding a widget type

Add a driver to `fieldDrivers` in `e2e/field-drivers.ts`: operate the visible UI (type, click, pick by label), then confirm the widget holds the value. Field types in scope without a driver show as `(no driver)` in the coverage report.
