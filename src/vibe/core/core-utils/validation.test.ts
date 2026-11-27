import { expect, test } from "bun:test";
import { z } from "zod";

import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import type { CountryLanguage } from "../i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import { validateData } from "./validation";

const ignoreLog = (): void => undefined;
const logger: EndpointLogger = {
  debug: ignoreLog,
  error: ignoreLog,
  info: ignoreLog,
  isDebugEnabled: false,
  vibe: ignoreLog,
  warn: ignoreLog,
};

test("default Zod issues use the request language without affecting other requests", () => {
  const schema = z.object({ email: z.email() });
  const data = { email: "not-an-email" };
  const cases: readonly { locale: CountryLanguage; expected: string }[] = [
    { locale: "en-US", expected: "Invalid email address" },
    { locale: "sk-SK", expected: "Zadajte platnú e-mailovú adresu." },
    { locale: "sk-GLOBAL", expected: "Zadajte platnú e-mailovú adresu." },
    { locale: "en-US", expected: "Invalid email address" },
  ];

  for (const { locale, expected } of cases) {
    const result = validateData(
      data,
      schema,
      logger,
      Platform.NEXT_API,
      "test",
      locale,
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain(expected);
    }
  }
});

test("Slovak CLI validation keeps schema-defined Zod messages", () => {
  const customMessage = "Použite pracovnú e-mailovú adresu.";
  const schema = z.object({
    email: z.email(),
    workEmail: z.email({ error: customMessage }),
    count: z.number(),
  });

  const result = validateData(
    { email: "not-an-email", workEmail: "invalid", count: "invalid" },
    schema,
    logger,
    Platform.CLI,
    "test",
    "sk-SK",
  );

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.message).toContain(`--work-email: ${customMessage}`);
    expect(result.message).toContain(
      "--email: Zadajte platnú e-mailovú adresu.",
    );
    expect(result.message).toContain(
      "--count: Neplatný vstup: očakávané číslo",
    );
  }
});

test("Hindi validation uses Hindi Zod defaults and the shared email message", () => {
  const schema = z.object({ email: z.email(), count: z.number() });
  for (const locale of ["hi-IN", "hi-GLOBAL"] as const) {
    const result = validateData(
      { email: "not-an-email", count: "invalid" },
      schema,
      logger,
      Platform.NEXT_API,
      "test",
      locale,
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain(
        sharedScopedTranslation.scopedT(locale).t("validation.invalidEmail"),
      );
      expect(result.message).toContain("अमान्य इनपुट");
    }
  }
});
