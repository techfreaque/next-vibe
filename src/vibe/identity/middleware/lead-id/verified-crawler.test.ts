import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { NextRequest } from "next-vibe/ui/lib/request";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { AUTH_TOKEN_COOKIE_NAME } from "@/env/constants";
import { BotFamily } from "@/leads/analytics/enum";
import * as geo from "@/leads/geo/lookup";
import * as crawlerVisitsModule from "@/leads/growth/crawler-visits";
import { proxy } from "@/proxy";

import { studioHistoryPage } from "../../../agent/media-studio/history";
import { defaultLocale } from "../../../core/i18n/core/config";
import { ErrorResponseTypes } from "../../../core/route/response.schema";
import { createEndpointLogger } from "../../../logger/server";
import {
  DEGRADED_PUBLIC_DOCUMENT_HEADER,
  forwardDegradedPublicDocument,
  forwardVerifiedCrawlerDocument,
  VERIFIED_CRAWLER_HEADER,
} from "../../../platforms/web/middleware/public-document";
import * as leadOps from "../../lead/middleware-ops";
import { UserPermissionRole } from "../../roles/enum";
import {
  clearVerifiedCrawlerCache,
  type CrawlerDnsResolver,
  createVerifiedCrawlerCache,
  matchesPtrSuffix,
  verifyCrawler,
} from "./verified-crawler";

const noopDns: CrawlerDnsResolver = {
  reverse: async () => [],
  resolve4: async () => [],
  resolve6: async () => [],
};

afterEach(() => {
  mock.restore();
  clearVerifiedCrawlerCache();
  crawlerVisitsModule.resetCrawlerVisitBuffer();
});

describe("verifyCrawler", () => {
  it("verifies published CIDR ranges for Google, Bing, Apple, Meta and DuckDuckGo", async () => {
    const cases = [
      [
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "66.249.64.192",
        "google",
        BotFamily.GOOGLE,
      ],
      [
        "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.8103.78 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "::ffff:66.249.78.70",
        "google",
        BotFamily.GOOGLE,
      ],
      [
        "Google-InspectionTool",
        "2001:4860:4801:10::42",
        "google",
        BotFamily.GOOGLE,
      ],
      [
        "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
        "157.55.39.10",
        "bing",
        BotFamily.BING,
      ],
      [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
        "17.166.150.100",
        "apple",
        BotFamily.OTHER_AI,
      ],
      [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 (compatible; meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler))",
        "57.141.0.13",
        "meta",
        BotFamily.META,
      ],
      [
        "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "173.252.101.10",
        "meta",
        BotFamily.META,
      ],
      [
        "DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)",
        "20.191.45.212",
        "duckduckgo",
        BotFamily.OTHER_BOT,
      ],
      [
        "DuckAssistBot/1.2; (+http://duckduckgo.com/duckduckbot.html)",
        "108.141.83.74",
        "duckassist",
        BotFamily.OTHER_AI,
      ],
    ] as const;

    const reverseSpy = mock(noopDns.reverse);
    for (const [ua, ip, expectedId, expectedFamily] of cases) {
      const match = await verifyCrawler(ua, ip, {
        dnsResolver: { ...noopDns, reverse: reverseSpy },
        cache: createVerifiedCrawlerCache(),
      });
      expect(match).toEqual({
        id: expectedId,
        botFamily: expectedFamily,
        method: "cidr",
      });
    }
    // Published CIDRs must verify synchronously without any DNS calls.
    expect(reverseSpy).not.toHaveBeenCalled();
  });

  it("verifies via FCrDNS for Yandex, Baidu, PetalBot and new Google/Bing IPs, then caches", async () => {
    const cache = createVerifiedCrawlerCache();
    const ptrTable = new Map<string, string[]>([
      ["213.180.203.10", ["213-180-203-10.spider.yandex.com."]],
      ["220.181.108.91", ["baiduspider-220-181-108-91.crawl.baidu.com."]],
      ["114.119.129.14", ["petalbot-114-119-129-14.petalsearch.com."]],
      ["198.51.100.42", ["crawl-198-51-100-42.googlebot.com."]],
    ]);
    const aTable = new Map<string, string[]>([
      ["213-180-203-10.spider.yandex.com", ["213.180.203.10"]],
      ["baiduspider-220-181-108-91.crawl.baidu.com", ["220.181.108.91"]],
      ["petalbot-114-119-129-14.petalsearch.com", ["114.119.129.14"]],
      ["crawl-198-51-100-42.googlebot.com", ["198.51.100.42"]],
    ]);
    const reverseSpy = mock(async (ip: string) => ptrTable.get(ip) ?? []);
    const resolve4Spy = mock(async (host: string) => aTable.get(host) ?? []);
    const resolver: CrawlerDnsResolver = {
      reverse: reverseSpy,
      resolve4: resolve4Spy,
      resolve6: async () => [],
    };

    expect(
      await verifyCrawler(
        "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
        "213.180.203.10",
        { dnsResolver: resolver, cache },
      ),
    ).toEqual({ id: "yandex", botFamily: BotFamily.OTHER_BOT, method: "fcrdns" });

    expect(
      await verifyCrawler(
        "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
        "220.181.108.91",
        { dnsResolver: resolver, cache },
      ),
    ).toEqual({ id: "baidu", botFamily: BotFamily.OTHER_BOT, method: "fcrdns" });

    expect(
      await verifyCrawler(
        "Mozilla/5.0 (Linux; Android 7.0;) AppleWebKit/537.36 (compatible; PetalBot;+https://webmaster.petalsearch.com/site/petalbot)",
        "114.119.129.14",
        { dnsResolver: resolver, cache },
      ),
    ).toEqual({ id: "petal", botFamily: BotFamily.OTHER_BOT, method: "fcrdns" });

    // IP outside static Google CIDRs still verifies via FCrDNS.
    expect(
      await verifyCrawler("Googlebot/2.1", "198.51.100.42", {
        dnsResolver: resolver,
        cache,
      }),
    ).toEqual({ id: "google", botFamily: BotFamily.GOOGLE, method: "fcrdns" });

    const callsBeforeRepeat = reverseSpy.mock.calls.length;
    expect(
      await verifyCrawler("Googlebot/2.1", "198.51.100.42", {
        dnsResolver: resolver,
        cache,
      }),
    ).toEqual({ id: "google", botFamily: BotFamily.GOOGLE, method: "cache" });
    expect(reverseSpy.mock.calls.length).toBe(callsBeforeRepeat);
  });

  it("rejects spoofed UAs, mismatched forward DNS, non-boundary suffixes, private IPs and timeouts", async () => {
    expect(matchesPtrSuffix("evilgooglebot.com", ["googlebot.com"])).toBe(
      false,
    );
    expect(matchesPtrSuffix("crawl.googlebot.com.", ["googlebot.com"])).toBe(
      true,
    );

    // Spoofed Googlebot with attacker-controlled PTR but wrong forward IP.
    const spoofedResolver: CrawlerDnsResolver = {
      reverse: async () => ["crawl-198-51-100-99.googlebot.com"],
      resolve4: async () => ["66.249.64.1"],
      resolve6: async () => [],
    };
    expect(
      await verifyCrawler("Googlebot/2.1", "198.51.100.99", {
        dnsResolver: spoofedResolver,
        cache: createVerifiedCrawlerCache(),
      }),
    ).toBeNull();

    // Private / loopback / missing IPs never verify.
    for (const ip of [undefined, "", "127.0.0.1", "10.0.0.1", "192.168.1.5", "::1"]) {
      expect(
        await verifyCrawler("Googlebot/2.1", ip, {
          dnsResolver: noopDns,
          cache: createVerifiedCrawlerCache(),
        }),
      ).toBeNull();
    }

    // Normal browser or human in-app browser (e.g. Pinterest/iOS) never matches even on a crawler IP.
    expect(
      await verifyCrawler(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/145.0.0.0 Safari/537.36",
        "66.249.64.192",
        { dnsResolver: noopDns, cache: createVerifiedCrawlerCache() },
      ),
    ).toBeNull();
    expect(
      await verifyCrawler(
        "Mozilla/5.0 (iPad; CPU OS 18_7 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Pinterest/iOS",
        "198.51.100.10",
        { dnsResolver: noopDns, cache: createVerifiedCrawlerCache() },
      ),
    ).toBeNull();

    // DNS timeout fails closed cleanly within the timeout budget.
    const neverResolves = Promise.withResolvers<string[]>().promise;
    const start = performance.now();
    expect(
      await verifyCrawler("YandexBot/3.0", "198.51.100.77", {
        timeoutMs: 25,
        dnsResolver: {
          reverse: () => neverResolves,
          resolve4: async () => [],
          resolve6: async () => [],
        },
        cache: createVerifiedCrawlerCache(),
      }),
    ).toBeNull();
    expect(performance.now() - start).toBeLessThan(250);
  });

  it("deduplicates concurrent FCrDNS lookups for the same crawler IP", async () => {
    const cache = createVerifiedCrawlerCache();
    const deferred = Promise.withResolvers<string[]>();
    const reverseSpy = mock(() => deferred.promise);
    const resolver: CrawlerDnsResolver = {
      reverse: reverseSpy,
      resolve4: async () => ["213.180.203.10"],
      resolve6: async () => [],
    };

    const p1 = verifyCrawler("YandexBot/3.0", "213.180.203.10", {
      dnsResolver: resolver,
      cache,
    });
    const p2 = verifyCrawler("YandexBot/3.0", "213.180.203.10", {
      dnsResolver: resolver,
      cache,
    });
    expect(reverseSpy).toHaveBeenCalledTimes(1);
    deferred.resolve(["213-180-203-10.spider.yandex.com"]);
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1?.id).toBe("yandex");
    expect(r2?.id).toBe("yandex");
  });
});

describe("lead-id middleware verified crawler bypass", () => {
  it("serves full SSR public and crawlable app pages without lead creation or cookie, and records bot visits", async () => {
    const createSpy = spyOn(leadOps, "createAnonymousLead").mockRejectedValue(
      new Error("Lead creation must not run for verified crawlers"),
    );
    const recordVisitSpy = spyOn(
      crawlerVisitsModule,
      "recordVerifiedCrawlerVisit",
    ).mockImplementation(() => undefined);

    const crawlerHeaders = {
      "user-agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "x-forwarded-for": "66.249.64.192",
      accept: "text/html",
    };

    const paths = [
      "/en-US/story",
      "/en-US/models/claude-opus-5-5",
      "/en-US/skills",
      "/en-US/skill/uncensored",
      "/en-US/create/image",
      "/en-US/subscription/overview",
      "/en-US/threads/public",
      "/en-US/threads/incognito/new",
      "/en-US/user/login",
    ];

    for (const path of paths) {
      const response = await proxy(
        new NextRequest(`https://example.test${path}`, {
          headers: crawlerHeaders,
        }),
      );
      expect(response.status).toBe(200);
      expect(response.headers.has("set-cookie")).toBe(false);
      // Marked as verified crawler, NOT degraded (preserves full SSR HTML).
      const forwarded = new Headers();
      expect(forwardVerifiedCrawlerDocument(forwarded, response)).toBe(true);
      expect(forwarded.get(VERIFIED_CRAWLER_HEADER)).toBe("1");
      expect(forwardDegradedPublicDocument(forwarded, response)).toBe(false);
      expect(forwarded.has(DEGRADED_PUBLIC_DOCUMENT_HEADER)).toBe(false);
    }

    expect(createSpy).not.toHaveBeenCalled();
    expect(recordVisitSpy).toHaveBeenCalledTimes(paths.length);
    for (const call of recordVisitSpy.mock.calls) {
      expect(call[0]).toBe(BotFamily.GOOGLE);
    }

    // HEAD and prefetch requests skip lead creation without double-counting visits.
    recordVisitSpy.mockClear();
    const headResp = await proxy(
      new NextRequest("https://example.test/en-US/story", {
        method: "HEAD",
        headers: crawlerHeaders,
      }),
    );
    expect(headResp.status).toBe(200);
    expect(headResp.headers.has("set-cookie")).toBe(false);
    expect(recordVisitSpy).not.toHaveBeenCalled();
  });

  it("does not bypass spoofed crawlers, POST requests, API routes, or authenticated cookies, and strips forged headers", async () => {
    spyOn(geo, "geoCountryForIp").mockResolvedValue(null);
    const createSpy = spyOn(leadOps, "createAnonymousLead").mockResolvedValue(
      "00000000-0000-4000-8000-000000000123",
    );
    spyOn(crawlerVisitsModule, "recordVerifiedCrawlerVisit").mockImplementation(
      () => undefined,
    );

    // Spoofed Googlebot from untrusted IP with forged internal header:
    // header must be stripped and normal lead creation must run.
    const spoofed = new NextRequest("https://example.test/en-US/story", {
      headers: {
        "user-agent": "Googlebot/2.1",
        "x-forwarded-for": "127.0.0.1",
        [VERIFIED_CRAWLER_HEADER]: "1",
      },
    });
    const spoofedResp = await proxy(spoofed);
    expect(spoofedResp.status).toBe(200);
    expect(spoofedResp.headers.has("set-cookie")).toBe(true);
    const forwarded = new Headers(spoofed.headers);
    expect(forwardVerifiedCrawlerDocument(forwarded, spoofedResp)).toBe(false);
    expect(forwarded.has(VERIFIED_CRAWLER_HEADER)).toBe(false);
    expect(createSpy).toHaveBeenCalledTimes(1);

    // POST from a verified Googlebot IP must not bypass.
    createSpy.mockClear();
    const postResp = await proxy(
      new NextRequest("https://example.test/en-US/story", {
        method: "POST",
        headers: {
          "user-agent": "Googlebot/2.1",
          "x-forwarded-for": "66.249.64.192",
        },
      }),
    );
    expect(postResp.status).toBe(200);
    expect(createSpy).toHaveBeenCalledTimes(1);

    // Authenticated request with Googlebot UA/IP must not bypass.
    createSpy.mockClear();
    const authedResp = await proxy(
      new NextRequest("https://example.test/en-US/story", {
        headers: {
          "user-agent": "Googlebot/2.1",
          "x-forwarded-for": "66.249.64.192",
          cookie: `${AUTH_TOKEN_COOKIE_NAME}=session`,
        },
      }),
    );
    expect(authedResp.status).toBe(200);
    expect(createSpy).toHaveBeenCalledTimes(1);

    // API route without lead cookie still returns 401 for crawlers.
    const apiResp = await proxy(
      new NextRequest("https://example.test/api/en-US/credits", {
        headers: {
          "user-agent": "Googlebot/2.1",
          "x-forwarded-for": "66.249.64.192",
        },
      }),
    );
    expect(apiResp.status).toBe(401);
  });
});

describe("leadless public user safety for credits and media history", () => {
  it("returns clean empty/unauthorized results without DB errors when a public user has no leadId", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const errorSpy = spyOn(logger, "error");
    const { t } = creditsScopedTranslation.scopedT(defaultLocale);
    const crawlerUser = {
      isPublic: true as const,
      leadId: "",
      roles: [UserPermissionRole.PUBLIC],
    };

    const credits = await CreditRepository.getCreditBalanceForUser(
      crawlerUser,
      defaultLocale,
      logger,
      t,
    );
    expect(credits.success).toBe(false);
    if (!credits.success) {
      expect(credits.errorType).toEqual(ErrorResponseTypes.UNAUTHORIZED);
    }
    expect(errorSpy).not.toHaveBeenCalled();

    const history = await studioHistoryPage(crawlerUser, {
      page: 1,
      limit: 12,
    });
    expect(history).toEqual({ items: [], totalCount: 0 });
  });
});
