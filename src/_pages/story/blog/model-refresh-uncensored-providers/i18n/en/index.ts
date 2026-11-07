export const translations = {
  meta: {
    title: "New models, new uncensored providers - {{appName}}",
    description:
      "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 and fresh open models. Plus NanoGPT, a bigger Venice lineup and the first uncensored image models.",
    category: "Model Update",
    imageAlt: "{{appName}} model refresh - November 2026",
    keywords:
      "{{appName}}, Claude Opus 5.5, GPT-6, Gemini 4 Argon, Grok 4.7, uncensored AI, Venice, NanoGPT, Lustify, Chroma",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Update",
    readTime: "5 min read",
    title: "The newest models are in. Uncensored got serious.",
    subtitle:
      "Every major family moved up a generation. A second uncensored provider joined. And for the first time, you can generate uncensored images.",
  },
  intro: {
    lead: "Short version: the catalog is current again. {{modelCount}} models are live right now - {{uncensoredCount}} of them uncensored.",
    p2: "You don't have to do anything. Had an older model pinned? Your chats move to its successor on their own.",
  },
  filter: {
    title: 'What "uncensored" means here',
    intro: "Three levels. You choose.",
    p1: "Every model carries a content level. Mainstream models keep their provider's filters. Open models are looser. Uncensored models answer without the lecture.",
    p2: "Nobody picks the level for you. Pick a mainstream model for work, an uncensored one for the question nobody else will answer - same chat, same account.",
    mainstream: "Mainstream",
    open: "Open",
    uncensored: "Uncensored",
    mainstreamBody: "Provider filters stay on. Safe default for work.",
    openBody: "Fewer refusals, still some guardrails.",
    uncensoredBody: "No lecture, no refusal theatre. Your call.",
    countLabel: "{{count}} live",
  },
  lineup: {
    title: "The new lineup",
    intro:
      "Grouped by family. Older picks in these families now resolve to the new versions.",
    claude: "Claude",
    claudeNote:
      "Anthropic's new generation, from deep reasoning to fast replies.",
    gpt: "GPT",
    gptNote: "OpenAI's GPT-6 family. Every tier has a Pro variant.",
    gemini: "Gemini",
    geminiNote: "Google's flagship plus a fast, cheap workhorse.",
    grok: "Grok",
    grokNote: "xAI's latest - rated open, not mainstream.",
    openModels: "Open models",
    openModelsNote:
      "Kimi, DeepSeek, GLM and MiniMax - strong and less filtered.",
  },
  uncensored: {
    title: "Uncensored got a real upgrade",
    intro: "More models, two providers, and images.",
    veniceTitle: "Venice: the backbone, expanded",
    veniceBody:
      "Venice runs most of our uncensored catalog. Its flagship moved to {{veniceModel}}, and a whole lineup joined:",
    nanoTitle: "NanoGPT: a second route",
    nanoBody:
      "New provider. It brings {{glm}} and {{glmFlash}} with a 1M-token context, and it serves {{deepseek}}, {{abliterated}} and {{deepseekAbliterated}} next to Venice - plus {{mimoAbliterated}}, its own. One provider stumbles - the other picks up.",
    imagesTitle: "First uncensored image models",
    imagesBody:
      "{{lustify}} and {{chroma}}, via Venice. One credit per image. Every image model before them was mainstream or open.",
    warning:
      "{{abliterated}} is the least restricted model we have ever listed. It sits behind the uncensored content level - you only get it if you choose it.",
  },
  underTheHood: {
    title: "Under the hood",
    intro: "For the people who want to know how the swap actually works.",
    successorsTitle: "Old picks follow their successor",
    successorsBody:
      "Older model ids are now marked legacy: hidden from the picker, still resolvable. Pinned picks and saved skills follow a successor map to the current model - but only if that successor can actually be served for you. If it can't, your original pick stays. No silent swap to an unrelated model.",
    pricesTitle: "Prices that stay current",
    pricesBody:
      "New keyless price fetchers for Venice and NanoGPT keep prices, context windows and modalities up to date. Missing price data is exactly why the old Venice model had switched itself off - that can't happen quietly anymore.",
    toolsTitle: "Tool calling, honestly",
    toolsBody:
      "NanoGPT models get native tool calls. Venice Uncensored ignored native tools in our tests, so it keeps a prompt-engineered tool path that does work.",
  },
  cta: {
    title: "Pick a model. Set your filter.",
    subtitle:
      "Every model above is live in the chat. Compare them side by side, or just start talking.",
    chat: "Start a chat",
    models: "Browse all models",
  },
};
