/**
 * Maps a page path to its Search Console style URL group (page type).
 * Pure: shared by the ingest repository and its unit test.
 */

import { WebVitalPageType, type WebVitalPageTypeValue } from "./enum";

const LOCALE_SEGMENT = /^[a-z]{2}-[A-Z]{2,6}$/;

export function classifyPageType(path: string): typeof WebVitalPageTypeValue {
  const segments = path.split("?")[0]?.split("/").filter(Boolean) ?? [];
  const rest =
    segments[0] && LOCALE_SEGMENT.test(segments[0])
      ? segments.slice(1)
      : segments;
  const [first, second, third] = rest;

  switch (first) {
    case undefined:
      return WebVitalPageType.STORY_HOME;
    case "story":
      if (second === undefined) {
        return WebVitalPageType.STORY_HOME;
      }
      if (second === "blog") {
        return third === undefined
          ? WebVitalPageType.BLOG_INDEX
          : WebVitalPageType.BLOG_POST;
      }
      if (second === "compare") {
        return WebVitalPageType.STORY_COMPARE;
      }
      return WebVitalPageType.STORY_PAGE;
    case "models":
      if (second === undefined) {
        return WebVitalPageType.MODELS;
      }
      if (second === "compare") {
        return WebVitalPageType.MODEL_COMPARE;
      }
      if (second === "changelog") {
        return WebVitalPageType.MODEL_CHANGELOG;
      }
      return WebVitalPageType.MODEL_DETAIL;
    case "skill":
      return WebVitalPageType.SKILL;
    case "skills":
      return WebVitalPageType.SKILLS;
    case "docs":
      return WebVitalPageType.DOCS;
    case "help":
      return WebVitalPageType.HELP;
    case "subscription":
    case "pricing":
      return WebVitalPageType.PRICING;
    case "create":
    case "media-studio":
      return WebVitalPageType.CREATE;
    case "threads":
      return WebVitalPageType.THREADS;
    case "user":
      return WebVitalPageType.ACCOUNT;
    case "tools":
      return WebVitalPageType.TOOLS;
    default:
      return WebVitalPageType.OTHER;
  }
}
