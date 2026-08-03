import { describe, expect, test } from "bun:test";

import { scopedTranslation as browserT } from "../browser/i18n";
import { scopedTranslation as smsT } from "../sms/i18n";
import { scopedTranslation as pagesT } from "../_pages/[...notFound]/i18n";
import { scopedTranslation as desktopT } from "./i18n";

const LOCALES = ["en-US", "de-DE", "pl-PL"] as const;

/**
 * Guards the i18n contract these keys exist to satisfy: every converted fail()
 * site must render fully translated, with runtime detail interpolated and no
 * raw placeholder, bare key name, or untranslated English leaking through.
 */
function assertRendered(out: string, mustContain: string[]): void {
  expect(out).not.toContain("{{");
  expect(out).not.toContain("}}");
  // A bare key name would come back dotted and space-free, e.g. "repository.foo"
  expect(out).not.toMatch(/^[a-zA-Z.]+\.[a-zA-Z]+$/);
  for (const fragment of mustContain) {
    expect(out).toContain(fragment);
  }
}

describe("desktop repository error keys render in every locale", () => {
  for (const locale of LOCALES) {
    const { t } = desktopT.scopedT(locale);

    test(`${locale} interpolates runtime detail`, () => {
      assertRendered(t("repository.monitorNotFoundByName", { monitorName: "DP-1" }), ["DP-1"]);
      assertRendered(t("repository.screenIndexOutOfRange", { screen: 7 }), ["7"]);
      assertRendered(t("repository.unknownKeyName", { key: "ctrl+zz" }), ["ctrl+zz"]);
      assertRendered(t("repository.noWindowWithPid", { pid: 4242 }), ["4242"]);
      assertRendered(t("repository.noWindowWithTitle", { title: "Firefox" }), ["Firefox"]);
      assertRendered(t("repository.monitorNotFound", { monitor: "HDMI-2" }), ["HDMI-2"]);
      assertRendered(t("repository.windowMoveNoEffect", { monitor: "DP-3" }), ["DP-3"]);
      assertRendered(t("repository.scriptWriteFailed", { error: "EACCES" }), ["EACCES"]);
      assertRendered(t("widget.actionScreenshotOnMonitor", { monitor: "DP-1" }), ["DP-1"]);
    });

    test(`${locale} renders param-free keys`, () => {
      assertRendered(t("repository.couldNotListWindows"), []);
      assertRendered(t("repository.noActiveWindow"), []);
      assertRendered(t("repository.provideMonitorNameOrIndex"), []);
      assertRendered(t("repository.focusedWindowParseFailed"), []);
      assertRendered(t("repository.kwinNoOutput"), []);
      assertRendered(t("repository.kwinNoWindowData"), []);
      // The split preserved the param-free label used by three widgets.
      assertRendered(t("widget.actionScreenshot"), []);
    });
  }
});

describe("browser, sms and pages keys render in every locale", () => {
  for (const locale of LOCALES) {
    test(`${locale} renders converted keys`, () => {
      assertRendered(browserT.scopedT(locale).t("repository.mcp.tool.call.newPageFailed"), []);

      const { t: ts } = smsT.scopedT(locale);
      assertRendered(
        ts("sms.error.delivery_failed_http", { phoneNumber: "+4915112345678", error: "Bad Request", status: 400 }),
        ["+4915112345678", "Bad Request", "400"],
      );
      assertRendered(
        ts("sms.error.delivery_failed_code", { phoneNumber: "+4915112345678", error: "Invalid To", code: 21211 }),
        ["+4915112345678", "Invalid To", "21211"],
      );
      assertRendered(
        ts("sms.error.delivery_failed_status", { phoneNumber: "+4915112345678", status: 503 }),
        ["+4915112345678", "503"],
      );
      assertRendered(
        ts("sms.error.aws_sns_api_error_http", { error: "Throttled", status: 429 }),
        ["Throttled", "429"],
      );

      const { t: tp } = pagesT.scopedT(locale);
      assertRendered(tp("pages.frame.endpointNotFound", { endpointId: "desktop/click" }), ["desktop/click"]);
      assertRendered(tp("pages.frame.endpointLoadFailed"), []);
    });
  }
});

describe("de and pl are genuinely translated, not English passthrough", () => {
  test("desktop keys differ from English", () => {
    const en = desktopT.scopedT("en-US").t;
    const de = desktopT.scopedT("de-DE").t;
    const pl = desktopT.scopedT("pl-PL").t;
    for (const key of [
      "repository.couldNotListWindows",
      "repository.noActiveWindow",
      "repository.focusedWindowParseFailed",
      "repository.kwinNoWindowData",
    ] as const) {
      expect(de(key)).not.toBe(en(key));
      expect(pl(key)).not.toBe(en(key));
    }
  });
});
