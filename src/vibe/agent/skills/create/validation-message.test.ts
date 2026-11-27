import { expect, test } from "bun:test";
import { validateData } from "next-vibe/core/core-utils/validation";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";

import { scopedTranslation } from "../i18n";
import definitions from "./definition";

const ignoreLog = (): void => undefined;
const logger: EndpointLogger = {
  debug: ignoreLog,
  error: ignoreLog,
  info: ignoreLog,
  isDebugEnabled: false,
  vibe: ignoreLog,
  warn: ignoreLog,
};

// Prod 2026-11-27: API callers read the raw key
// "post.skillDescription.validation.minLength" in the 400 text.
test("validation responses translate the endpoint's schema message keys", () => {
  for (const locale of ["en-GLOBAL", "de-DE"] as const) {
    const result = validateData(
      { description: "api shim" },
      definitions.POST.requestSchema,
      logger,
      Platform.NEXT_API,
      "vibe/agent/skills/create/POST",
      locale,
      definitions.POST,
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).not.toContain("post.skillDescription");
      expect(result.message).toContain(
        scopedTranslation
          .scopedT(locale)
          .t("post.skillDescription.validation.minLength"),
      );
    }
  }
});
