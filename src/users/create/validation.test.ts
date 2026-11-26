import { describe, expect, it } from "bun:test";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { scopedTranslation as formCopy } from "next-vibe/unified-ui/hooks/i18n";

import definition from "./definition";

const locales: CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
  "fr-FR",
  "it-IT",
  "es-ES",
  "sk-SK",
];

describe("create user validation", () => {
  for (const locale of locales) {
    it(`uses the request locale for missing and malformed fields in ${locale}`, () => {
      const error = definition.POST.requestErrorMap?.(locale);
      const { t } = formCopy.scopedT(locale);
      const empty = definition.POST.requestSchema.safeParse(
        {
          basicInfo: {
            email: "  ",
            password: "",
            privateName: " ",
            publicName: " ",
          },
        },
        { error },
      );
      expect(empty.success).toBe(false);
      if (empty.success) {
        return;
      }

      for (const field of ["email", "password", "privateName", "publicName"]) {
        const issues = empty.error.issues.filter(
          (issue) => issue.path.join(".") === `basicInfo.${field}`,
        );
        expect(issues.map((issue) => issue.message)).toEqual([
          t("formErrors.required"),
        ]);
      }

      const malformed = definition.POST.formSchema.safeParse(
        { basicInfo: { email: "not-an-address" } },
        { error },
      );
      expect(malformed.success).toBe(false);
      if (!malformed.success) {
        expect(
          malformed.error.issues.find(
            (issue) => issue.path.join(".") === "basicInfo.email",
          )?.message,
        ).toBe(t("formErrors.email"));
      }
    });
  }

  it("normalizes account identity before persisting", () => {
    const result = definition.POST.requestSchema.safeParse({
      basicInfo: {
        email: "  Person@Example.test ",
        password: " passphrase ",
        privateName: "  Given Family   ",
        publicName: " Given ",
        country: "US",
        language: "en",
      },
      adminSettings: {},
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.basicInfo).toMatchObject({
        email: "person@example.test",
        password: " passphrase ",
        privateName: "Given Family",
        publicName: "Given",
      });
    }
  });
});
