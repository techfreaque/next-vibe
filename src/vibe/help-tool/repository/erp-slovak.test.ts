import { expect, test } from "bun:test";

import { scopedTranslation as chartSetup } from "@/chart-of-accounts/setup/i18n";
import { translations as chartSetupEn } from "@/chart-of-accounts/setup/i18n/en";
import { translations as chartSetupSk } from "@/chart-of-accounts/setup/i18n/sk";
import { scopedTranslation as payables } from "@/chart-of-accounts/reports/payables-aging/i18n";
import { translations as payablesEn } from "@/chart-of-accounts/reports/payables-aging/i18n/en";
import { translations as payablesSk } from "@/chart-of-accounts/reports/payables-aging/i18n/sk";
import { scopedTranslation as posting } from "@/chart-of-accounts/reports/posting-review/i18n";
import { translations as postingEn } from "@/chart-of-accounts/reports/posting-review/i18n/en";
import { translations as postingSk } from "@/chart-of-accounts/reports/posting-review/i18n/sk";
import { scopedTranslation as companyGet } from "@/companies/[companyId]/get/i18n";
import { translations as companyGetEn } from "@/companies/[companyId]/get/i18n/en";
import { translations as companyGetSk } from "@/companies/[companyId]/get/i18n/sk";
import { scopedTranslation as onboarding } from "@/companies/[companyId]/onboard/i18n";
import { translations as onboardingEn } from "@/companies/[companyId]/onboard/i18n/en";
import { translations as onboardingSk } from "@/companies/[companyId]/onboard/i18n/sk";
import { scopedTranslation as companyCreate } from "@/companies/create/i18n";
import { translations as companyCreateEn } from "@/companies/create/i18n/en";
import { translations as companyCreateSk } from "@/companies/create/i18n/sk";

import { scopedTranslation as workspace } from "../i18n";
import { translations as workspaceEn } from "../i18n/en";
import { translations as workspaceSk } from "../i18n/sk";

interface TranslationTree {
  [key: string]: string | TranslationTree;
}

function entries(
  translations: TranslationTree,
  path = "",
): [string, string[]][] {
  return Object.entries(translations)
    .flatMap(([key, value]): [string, string[]][] => {
      const label = path ? `${path}.${key}` : key;
      if (typeof value !== "string") {
        return entries(value, label);
      }
      return [
        [
          label,
          [...value.matchAll(/\{\{(\w+)\}\}/g)]
            .map((match) => match[1])
            .filter((param) => param !== undefined)
            .toSorted(),
        ],
      ];
    })
    .toSorted(([left], [right]) => left.localeCompare(right));
}

test("Slovak ERP copy covers every scoped key and preserves interpolation names", () => {
  for (const [source, translated] of [
    [workspaceEn, workspaceSk],
    [companyCreateEn, companyCreateSk],
    [companyGetEn, companyGetSk],
    [onboardingEn, onboardingSk],
    [chartSetupEn, chartSetupSk],
    [payablesEn, payablesSk],
    [postingEn, postingSk],
  ] as const) {
    expect(entries(translated)).toEqual(entries(source));
  }
});

test("registered Slovak scopes return localized labels and interpolate the selected company and period", () => {
  expect(String(workspace.scopedT("sk-SK").t("erp.home"))).toBe("Domov");
  expect(
    String(
      workspace
        .scopedT("sk-SK")
        .t("erp.companySwitch.current", { name: "Demo" }),
    ),
  ).toBe("Aktuálna firma: Demo");
  expect(
    String(companyCreate.scopedT("sk-SK").t("post.widget.setupAccounting")),
  ).toBe("Nastaviť účtovníctvo");
  expect(
    String(companyGet.scopedT("sk-SK").t("get.widget.setupAccounting")),
  ).toBe("Nastaviť účtovníctvo");
  expect(
    String(
      onboarding.scopedT("sk-SK").t("post.period.opened", { name: "Január" }),
    ),
  ).toBe("Obdobie Január je otvorené na účtovanie.");
  expect(
    String(
      chartSetup.scopedT("sk-SK").t("post.widget.existing", { count: 20 }),
    ),
  ).toBe("Existujúce účty: 20.");
  expect(
    String(
      payables.scopedT("sk-SK").t("widget.asOf", { date: "25. 11. 2026" }),
    ),
  ).toBe("Stav k 25. 11. 2026");
  expect(
    String(
      posting.scopedT("sk-SK").t("pagination.pageInfo", { page: 1, total: 2 }),
    ),
  ).toBe("Strana 1 z 2");
});
