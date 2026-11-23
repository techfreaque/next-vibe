/**
 * Blog topic clusters - which section of the blog index a post sits in, which
 * landing page is its hub, and which sibling guides it recommends. One source
 * for the grouped blog index, the hub pages' guide lists and the "Related
 * guides" block at the end of every post.
 */

import { BLOG_POST_SLUGS } from "./posts-cards";
import type { BlogPostSlug } from "./posts-meta";

/** Blog index sections, in display order. */
export const BLOG_TOPICS = [
  "uncensored",
  "media",
  "developers",
  "updates",
  "engineering",
  "referral",
] as const;

export type BlogTopic = (typeof BLOG_TOPICS)[number];

/** Section of each post on the blog index. Exhaustive: a new post needs one. */
export const POST_TOPICS: Record<BlogPostSlug, BlogTopic> = {
  "nofiltergpt-alternatives": "uncensored",
  "deepseek-uncensored": "uncensored",
  "grok-alternative": "uncensored",
  "claude-without-filters": "uncensored",
  "openrouter-alternatives": "developers",
  "best-uncensored-llm": "uncensored",
  "uncensored-ai-writer": "uncensored",
  "unbiased-ai-chatbot": "uncensored",
  "ai-chat-no-sign-up": "uncensored",
  "uncensored-llm-without-gpu": "uncensored",
  "uncensored-llm-api": "developers",
  "chatgpt-jailbreak-alternative": "uncensored",
  "venice-ai-alternatives": "uncensored",
  "character-ai-alternatives": "uncensored",
  "abliterated-vs-uncensored-models": "uncensored",
  "uncensored-ai-image-generator": "media",
  "ai-roleplay-without-filter": "uncensored",
  "ai-music-and-voice-generators": "media",
  "ai-video-generators-compared": "media",
  "openai-anthropic-compatible-api": "developers",
  "chatgpt-alternative-without-filters": "uncensored",
  "unbottled-api-in-coding-tools": "developers",
  "uncensored-models-what-each-is-good-at": "uncensored",
  "model-refresh-uncensored-providers": "uncensored",
  "whats-new-november-2026": "updates",
  "hermes-thea-two-way-remote": "updates",
  "interactive-coding-agent": "engineering",
  "e2e-tests-found-real-bugs": "engineering",
  "whats-new-may-2026": "updates",
  "whats-new-april-2026": "updates",
  "one-endpoint-every-surface": "engineering",
  "skill-sharing-economy": "referral",
  "referral-for-beginners": "referral",
  "referral-for-developers": "referral",
  "referral-for-affiliate-pros": "referral",
  "one-codebase-13-platforms": "engineering",
  "type-checker-made-ai-stop-lying": "engineering",
  "dead-trading-bot-to-monitoring-engine": "engineering",
};

/** Landing pages that anchor a topic cluster. */
export type TopicHub = "uncensored" | "abliterated";

/** Locale-less path of each hub page. */
export const TOPIC_HUB_PATHS: Record<TopicHub, string> = {
  uncensored: "/story/uncensored-ai",
  abliterated: "/story/abliterated-ai-chat",
};

/** Guides each hub page lists, most useful first. */
export const HUB_GUIDES: Record<TopicHub, readonly BlogPostSlug[]> = {
  uncensored: [
    "best-uncensored-llm",
    "uncensored-models-what-each-is-good-at",
    "abliterated-vs-uncensored-models",
    "chatgpt-alternative-without-filters",
    "chatgpt-jailbreak-alternative",
    "claude-without-filters",
    "grok-alternative",
    "deepseek-uncensored",
    "unbiased-ai-chatbot",
    "uncensored-ai-writer",
    "ai-roleplay-without-filter",
    "character-ai-alternatives",
    "venice-ai-alternatives",
    "nofiltergpt-alternatives",
    "ai-chat-no-sign-up",
    "uncensored-llm-without-gpu",
    "uncensored-llm-api",
    "uncensored-ai-image-generator",
    "model-refresh-uncensored-providers",
  ],
  abliterated: [
    "abliterated-vs-uncensored-models",
    "best-uncensored-llm",
    "deepseek-uncensored",
    "uncensored-models-what-each-is-good-at",
    "unbiased-ai-chatbot",
    "chatgpt-jailbreak-alternative",
    "uncensored-llm-api",
  ],
};

interface RelatedGuideSet {
  hub: TopicHub | null;
  /** Two or three sibling guides, closest match first. */
  related: readonly BlogPostSlug[];
}

/** Curated hub + siblings. Posts not listed fall back to their topic. */
const CURATED_RELATED: Partial<Record<BlogPostSlug, RelatedGuideSet>> = {
  "nofiltergpt-alternatives": {
    hub: "uncensored",
    related: [
      "chatgpt-alternative-without-filters",
      "venice-ai-alternatives",
      "best-uncensored-llm",
    ],
  },
  "deepseek-uncensored": {
    hub: "abliterated",
    related: [
      "abliterated-vs-uncensored-models",
      "best-uncensored-llm",
      "uncensored-llm-without-gpu",
    ],
  },
  "grok-alternative": {
    hub: "uncensored",
    related: [
      "chatgpt-alternative-without-filters",
      "claude-without-filters",
      "best-uncensored-llm",
    ],
  },
  "claude-without-filters": {
    hub: "uncensored",
    related: [
      "uncensored-ai-writer",
      "chatgpt-jailbreak-alternative",
      "ai-roleplay-without-filter",
    ],
  },
  "openrouter-alternatives": {
    hub: null,
    related: [
      "uncensored-llm-api",
      "openai-anthropic-compatible-api",
      "venice-ai-alternatives",
    ],
  },
  "best-uncensored-llm": {
    hub: "uncensored",
    related: [
      "abliterated-vs-uncensored-models",
      "uncensored-models-what-each-is-good-at",
      "uncensored-llm-without-gpu",
    ],
  },
  "uncensored-ai-writer": {
    hub: "uncensored",
    related: [
      "ai-roleplay-without-filter",
      "claude-without-filters",
      "best-uncensored-llm",
    ],
  },
  "unbiased-ai-chatbot": {
    hub: "uncensored",
    related: [
      "abliterated-vs-uncensored-models",
      "best-uncensored-llm",
      "chatgpt-alternative-without-filters",
    ],
  },
  "ai-chat-no-sign-up": {
    hub: "uncensored",
    related: [
      "venice-ai-alternatives",
      "uncensored-llm-without-gpu",
      "best-uncensored-llm",
    ],
  },
  "uncensored-llm-without-gpu": {
    hub: "uncensored",
    related: [
      "uncensored-llm-api",
      "best-uncensored-llm",
      "ai-chat-no-sign-up",
    ],
  },
  "uncensored-llm-api": {
    hub: "uncensored",
    related: [
      "openai-anthropic-compatible-api",
      "openrouter-alternatives",
      "unbottled-api-in-coding-tools",
    ],
  },
  "chatgpt-jailbreak-alternative": {
    hub: "uncensored",
    related: [
      "chatgpt-alternative-without-filters",
      "claude-without-filters",
      "abliterated-vs-uncensored-models",
    ],
  },
  "venice-ai-alternatives": {
    hub: "uncensored",
    related: [
      "character-ai-alternatives",
      "nofiltergpt-alternatives",
      "chatgpt-alternative-without-filters",
    ],
  },
  "character-ai-alternatives": {
    hub: "uncensored",
    related: [
      "ai-roleplay-without-filter",
      "venice-ai-alternatives",
      "uncensored-ai-writer",
    ],
  },
  "abliterated-vs-uncensored-models": {
    hub: "abliterated",
    related: [
      "best-uncensored-llm",
      "deepseek-uncensored",
      "uncensored-models-what-each-is-good-at",
    ],
  },
  "uncensored-models-what-each-is-good-at": {
    hub: "uncensored",
    related: [
      "best-uncensored-llm",
      "abliterated-vs-uncensored-models",
      "model-refresh-uncensored-providers",
    ],
  },
  "chatgpt-alternative-without-filters": {
    hub: "uncensored",
    related: [
      "chatgpt-jailbreak-alternative",
      "nofiltergpt-alternatives",
      "venice-ai-alternatives",
    ],
  },
  "ai-roleplay-without-filter": {
    hub: "uncensored",
    related: [
      "character-ai-alternatives",
      "uncensored-ai-writer",
      "best-uncensored-llm",
    ],
  },
  "model-refresh-uncensored-providers": {
    hub: "uncensored",
    related: [
      "uncensored-models-what-each-is-good-at",
      "best-uncensored-llm",
      "venice-ai-alternatives",
    ],
  },
  "uncensored-ai-image-generator": {
    hub: "uncensored",
    related: [
      "ai-video-generators-compared",
      "ai-music-and-voice-generators",
      "best-uncensored-llm",
    ],
  },
  "openai-anthropic-compatible-api": {
    hub: null,
    related: [
      "uncensored-llm-api",
      "unbottled-api-in-coding-tools",
      "interactive-coding-agent",
    ],
  },
  "unbottled-api-in-coding-tools": {
    hub: null,
    related: [
      "openai-anthropic-compatible-api",
      "uncensored-llm-api",
      "interactive-coding-agent",
    ],
  },
};

const RELATED_LIMIT = 3;

/** Hub and sibling guides recommended at the end of a post. */
export function relatedGuides(slug: BlogPostSlug): RelatedGuideSet {
  const curated = CURATED_RELATED[slug];
  if (curated !== undefined) {
    return curated;
  }
  const topic = POST_TOPICS[slug];
  const inTopic = BLOG_POST_SLUGS.filter(
    (other) => POST_TOPICS[other] === topic,
  );
  // The next posts in the topic, wrapping around, so every post in a topic
  // gets inbound links (not only the newest three).
  const position = inTopic.indexOf(slug);
  const siblings = [
    ...inTopic.slice(position + 1),
    ...inTopic.slice(0, position),
  ];
  return {
    hub: topic === "uncensored" ? "uncensored" : null,
    related: siblings.slice(0, RELATED_LIMIT),
  };
}
