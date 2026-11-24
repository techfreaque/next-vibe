import { beforeAll, expect, it, mock } from "bun:test";
import {
  type CountryLanguage,
  LanguagesArr,
} from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import {
  sanitizeLogString,
  sanitizeLogText,
} from "next-vibe/logger/telemetry-privacy";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { renderToStaticMarkup } from "react-dom/server";

import { scopedTranslation as verifyTranslation } from "../verify-email/i18n";
import definition from "./definition";
import { scopedTranslation } from "./i18n";

let locale: CountryLanguage = "en-US";
let verified = false;
const email = "member@example.invalid";
const user = {
  id: "fixture",
  leadId: "fixture-lead",
  isPublic: false as const,
  roles: [UserPermissionRole.CUSTOMER],
};
const logger = createEndpointLogger(false, locale);
let LoginWidget: typeof import("./widget").LoginFormContainer;
let Banner: typeof import("../verify-email/session-banner").SessionEmailBanner;

beforeAll(async () => {
  const context = {
    ...(await import("next-vibe/unified-ui/_shared/use-widget-context")),
  };
  mock.module("next-vibe/unified-ui/_shared/use-widget-context", () => ({
    ...context,
    useWidgetTranslation: () => scopedTranslation.scopedT(locale).t,
    useWidgetLocale: () => locale,
    useWidgetLogger: () => logger,
    useWidgetValue: () => undefined,
    useWidgetOnSubmit: () => undefined,
    useWidgetIsSubmitting: () => false,
    useWidgetForm: () => ({
      watch: (key: string) => (key === "email" ? email : ""),
    }),
    useWidgetResponse: () => emailResponse,
  }));
  const navigation = { ...(await import("next-vibe/ui/hooks/use-navigation")) };
  mock.module("next-vibe/ui/hooks/use-navigation", () => ({
    ...navigation,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/en-US/threads",
  }));
  mock.module("next-vibe/ui/hooks/use-logger", () => ({
    useLogger: () => logger,
  }));
  mock.module("next-vibe/unified-ui/hooks/use-api-mutation", () => ({
    useApiMutation: () => ({
      data: { success: true, data: { verified, email, message: "" } },
    }),
  }));
  ({ LoginFormContainer: LoginWidget } = await import("./widget"));
  ({ SessionEmailBanner: Banner } =
    await import("../verify-email/session-banner"));
});

function emailPrompt() {
  return fail({
    message: verifyTranslation
      .scopedT(locale)
      .t("accountChallenge.prompt", { email }),
    errorType: ErrorResponseTypes.EMAIL_CONFIRMATION_REQUIRED,
  });
}

let emailResponse = emailPrompt();

it("renders the six-digit login step and dismissible session notice in every locale", () => {
  for (const language of LanguagesArr) {
    locale = `${language}-GLOBAL`;
    emailResponse = emailPrompt();
    const login = renderToStaticMarkup(
      <LoginWidget field={definition.POST.fields} />,
    );
    expect(login).toContain(scopedTranslation.scopedT(locale).t("emailCode"));
    expect(login).toContain(email);
    expect(login.toLowerCase()).toContain('maxlength="6"');
    const notice = renderToStaticMarkup(
      <Banner locale={locale} user={user} email={email} />,
    );
    expect(notice).toContain(email);
    expect(notice).toContain(
      verifyTranslation.scopedT(locale).t("accountChallenge.dismiss"),
    );
    expect(notice).toContain(`/${locale}/user/settings`);
  }
  verified = true;
  expect(
    renderToStaticMarkup(<Banner locale={locale} user={user} email={email} />),
  ).toBe("");
});

it("redacts submitted inbox codes from diagnostics", () => {
  expect(sanitizeLogString("emailCode", "123456")).toBe("[redacted]");
  expect(sanitizeLogText('{"emailCode":"123456"}')).not.toContain("123456");
});
