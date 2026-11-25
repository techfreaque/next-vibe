export const translations = {
  meta: {
    category: "AI Models",
    title: "AI model changelog: new, legacy and repriced models | {{appName}}",
    description:
      "Every model change on {{appName}}, dated: new models, retired ones and what replaced them, price moves and tier changes. Pulled straight from our model registry. RSS feed included.",
    imageAlt: "Model changelog on {{appName}}",
    keywords:
      "AI model changelog, new AI models, LLM price changes, deprecated AI models, uncensored model updates, {{appName}}",
  },
  breadcrumb: {
    models: "AI models",
    changelog: "Changelog",
  },
  hero: {
    eyebrow: "Updated {{date}}",
    title: "Model changelog",
    subtitle:
      "Which models came in, which went legacy, what got cheaper. Every entry is dated and comes straight from our model registry.",
    rss: "RSS feed",
    allModels: "All models",
  },
  stats: {
    added: "Models added",
    legacy: "Moved to legacy",
    repriced: "Price changes",
    since: "Tracked since",
  },
  badge: {
    replaces: "Successor",
    added: "New",
    legacy: "Legacy",
    restored: "Back",
    repriced: "Price",
    tier: "Tier",
    removed: "Removed",
  },
  title: {
    added: "New model",
    legacy: "Moved to legacy",
    restored: "Back in the catalog",
    repriced: "Price change",
    tier: "Tier change",
    removed: "Removed",
  },
  summary: {
    added: "New model in the {{tier}} tier.",
    legacy: "Moved to legacy. Hidden from the model picker.",
    replacedBy: "Replaced by",
    replaces: "Took over from",
    restored: "Back in the active catalog.",
    tier: "Moved from the {{from}} tier to {{to}}.",
    removed: "No longer offered.",
    priceUp: "{{metric}} up {{percent}}",
    priceDown: "{{metric}} down {{percent}}",
  },
  metric: {
    input: "Input price",
    output: "Output price",
    image: "Image price",
    second: "Price per second",
    clip: "Clip price",
    character: "Character price",
    fixed: "Message price",
  },
  list: {
    heading: "All changes",
    empty: "No changes recorded yet.",
    count: "{{count}} changes",
  },
  about: {
    heading: "Where this comes from",
    body: "Every entry is generated from the version history of our model registry: the same files that drive the model picker, pricing and billing. Nobody types this list by hand. Dates mark when a change landed in the registry.",
    prices:
      "Price changes compare the cheapest public provider route before and after. A move can come from the provider changing its price, or from a cheaper route being added or dropped.",
    start:
      "Tracking starts on {{date}}. Models that were already live then have no New entry.",
  },
  model: {
    heading: "What changed",
    intro: "Dated changes to {{model}}, straight from our model registry.",
    none: "No changes to {{model}} since tracking started on {{date}}.",
    link: "Full model changelog",
  },
  index: {
    link: "Model changelog",
    hint: "New, legacy and repriced models, dated",
  },
  feed: {
    title: "{{appName}} model changelog",
    description:
      "New, legacy and repriced AI models on {{appName}}, dated, from our model registry.",
  },
};
