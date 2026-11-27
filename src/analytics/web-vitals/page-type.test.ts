import { describe, expect, it } from "bun:test";

import { WebVitalMetric, WebVitalPageType, WebVitalRating } from "./enum";
import { classifyPageType } from "./page-type";
import { rateWebVital } from "./thresholds";

describe("classifyPageType", () => {
  const cases: Array<[string, string]> = [
    ["/en-US", WebVitalPageType.STORY_HOME],
    ["/de-DE/story", WebVitalPageType.STORY_HOME],
    ["/en-US/story/about-us", WebVitalPageType.STORY_PAGE],
    ["/en-US/story/blog", WebVitalPageType.BLOG_INDEX],
    ["/en-US/story/blog/sillytavern-alternatives", WebVitalPageType.BLOG_POST],
    ["/en-US/story/compare/unbottled-vs-venice", WebVitalPageType.STORY_COMPARE],
    ["/en-US/models", WebVitalPageType.MODELS],
    ["/en-US/models/gemma-4-uncensored", WebVitalPageType.MODEL_DETAIL],
    ["/en-US/models/compare/a/b", WebVitalPageType.MODEL_COMPARE],
    ["/en-US/models/changelog", WebVitalPageType.MODEL_CHANGELOG],
    ["/en-US/skill/uncensored", WebVitalPageType.SKILL],
    ["/en-US/skills", WebVitalPageType.SKILLS],
    ["/en-US/docs/api", WebVitalPageType.DOCS],
    ["/en-US/help", WebVitalPageType.HELP],
    ["/en-US/subscription/overview", WebVitalPageType.PRICING],
    ["/en-US/create/image", WebVitalPageType.CREATE],
    ["/en-US/threads/private", WebVitalPageType.THREADS],
    ["/en-US/user/login", WebVitalPageType.ACCOUNT],
    ["/en-GLOBAL/tools/x", WebVitalPageType.TOOLS],
    ["/en-US/install", WebVitalPageType.OTHER],
  ];
  for (const [path, expected] of cases) {
    it(`${path} -> ${expected}`, () => {
      expect(classifyPageType(path)).toBe(expected);
    });
  }
});

describe("rateWebVital", () => {
  it("uses the web.dev thresholds", () => {
    expect(rateWebVital(WebVitalMetric.LCP, 2500)).toBe(WebVitalRating.GOOD);
    expect(rateWebVital(WebVitalMetric.LCP, 4001)).toBe(WebVitalRating.POOR);
    expect(rateWebVital(WebVitalMetric.INP, 300)).toBe(
      WebVitalRating.NEEDS_IMPROVEMENT,
    );
    expect(rateWebVital(WebVitalMetric.CLS, 0.05)).toBe(WebVitalRating.GOOD);
  });
});
