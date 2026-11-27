/**
 * Web Vitals enums: metric, rating, device class and public page type.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: WebVitalMetric,
  options: WebVitalMetricOptions,
  Value: WebVitalMetricValue,
} = createEnumOptions(scopedTranslation, {
  LCP: "enums.metric.lcp",
  INP: "enums.metric.inp",
  CLS: "enums.metric.cls",
  TTFB: "enums.metric.ttfb",
  FCP: "enums.metric.fcp",
});

export const WebVitalMetricDB = [
  WebVitalMetric.LCP,
  WebVitalMetric.INP,
  WebVitalMetric.CLS,
  WebVitalMetric.TTFB,
  WebVitalMetric.FCP,
] as const;

export const {
  enum: WebVitalRating,
  options: WebVitalRatingOptions,
  Value: WebVitalRatingValue,
} = createEnumOptions(scopedTranslation, {
  GOOD: "enums.rating.good",
  NEEDS_IMPROVEMENT: "enums.rating.needsImprovement",
  POOR: "enums.rating.poor",
});

export const WebVitalRatingDB = [
  WebVitalRating.GOOD,
  WebVitalRating.NEEDS_IMPROVEMENT,
  WebVitalRating.POOR,
] as const;

export const {
  enum: WebVitalDevice,
  options: WebVitalDeviceOptions,
  Value: WebVitalDeviceValue,
} = createEnumOptions(scopedTranslation, {
  MOBILE: "enums.device.mobile",
  DESKTOP: "enums.device.desktop",
});

export const WebVitalDeviceDB = [
  WebVitalDevice.MOBILE,
  WebVitalDevice.DESKTOP,
] as const;

export const {
  enum: WebVitalPageType,
  options: WebVitalPageTypeOptions,
  Value: WebVitalPageTypeValue,
} = createEnumOptions(scopedTranslation, {
  STORY_HOME: "enums.pageType.storyHome",
  STORY_PAGE: "enums.pageType.storyPage",
  BLOG_INDEX: "enums.pageType.blogIndex",
  BLOG_POST: "enums.pageType.blogPost",
  STORY_COMPARE: "enums.pageType.storyCompare",
  MODELS: "enums.pageType.models",
  MODEL_DETAIL: "enums.pageType.modelDetail",
  MODEL_COMPARE: "enums.pageType.modelCompare",
  MODEL_CHANGELOG: "enums.pageType.modelChangelog",
  SKILL: "enums.pageType.skill",
  SKILLS: "enums.pageType.skills",
  DOCS: "enums.pageType.docs",
  HELP: "enums.pageType.help",
  PRICING: "enums.pageType.pricing",
  CREATE: "enums.pageType.create",
  THREADS: "enums.pageType.threads",
  ACCOUNT: "enums.pageType.account",
  TOOLS: "enums.pageType.tools",
  OTHER: "enums.pageType.other",
});

export const WebVitalPageTypeDB = [
  WebVitalPageType.STORY_HOME,
  WebVitalPageType.STORY_PAGE,
  WebVitalPageType.BLOG_INDEX,
  WebVitalPageType.BLOG_POST,
  WebVitalPageType.STORY_COMPARE,
  WebVitalPageType.MODELS,
  WebVitalPageType.MODEL_DETAIL,
  WebVitalPageType.MODEL_COMPARE,
  WebVitalPageType.MODEL_CHANGELOG,
  WebVitalPageType.SKILL,
  WebVitalPageType.SKILLS,
  WebVitalPageType.DOCS,
  WebVitalPageType.HELP,
  WebVitalPageType.PRICING,
  WebVitalPageType.CREATE,
  WebVitalPageType.THREADS,
  WebVitalPageType.ACCOUNT,
  WebVitalPageType.TOOLS,
  WebVitalPageType.OTHER,
] as const;
