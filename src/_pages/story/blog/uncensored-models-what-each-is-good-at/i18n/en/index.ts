export const translations = {
  meta: {
    title: "The uncensored models, one by one - {{appName}}",
    description:
      "A plain-spoken guide to every uncensored AI model on unbottled.ai. What each one is good at, where it falls short, and why having the full spread of options is the point.",
    category: "Model Guide",
    imageAlt: "{{appName}} uncensored model guide",
    keywords:
      "{{appName}}, uncensored AI models, abliterated models, Venice, GLM uncensored, Gab Arya, FreedomGPT, UncensoredLM, free speech AI",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Guide",
    readTime: "7 min read",
    title: "The uncensored models, one by one.",
    subtitle:
      "No single model is best at everything. Here is what each uncensored model does well, where it falls short, and how to pick the right one for the job.",
  },
  intro: {
    lead: "We run {{uncensoredCount}} uncensored models right now. They are not interchangeable. Each comes from a different lab, sits on a different base, and is good at different things.",
    p2: "This is the honest tour. Real providers, real strengths, real weaknesses. Pick by the work in front of you, not by the loudest label.",
  },
  whatItMeans: {
    title: 'What "uncensored" actually means here',
    p1: "Every model on the platform carries a content level: mainstream, open, or uncensored. Uncensored models answer without the refusal theatre and the moral preamble. They are built two ways. Some are tuned for it from the start. Others are abliterated: the refusal direction is removed from an existing model's weights, so a capable mainstream model keeps its intelligence but drops the reflex to say no.",
    p2: "You choose the level. Nobody chooses it for you. An uncensored model only answers that way because you selected it, and you can switch back to a mainstream model in the same chat, on the same account.",
  },
  groups: {
    reasoning: {
      title: "When you need it to think",
      intro:
        "Reasoning, code, analysis. These carry the most intelligence of the uncensored set.",
    },
    creative: {
      title: "When you need fiction and roleplay",
      intro:
        "Characters that stay in character, long stories, unfiltered dialogue. Built for writing, not for spreadsheets.",
    },
    fast: {
      title: "When you need it fast and cheap",
      intro:
        "Pennies per message, quick replies, most of them read images. The everyday workhorses.",
    },
    viewpoint: {
      title: "When you want a different viewpoint",
      intro:
        "Part of a free-speech platform is carrying models other platforms will not. This one has an explicit political slant, stated plainly.",
    },
  },
  cards: {
    goodLabel: "Good at",
    weakLabel: "Weaker at",
    pageLink: "See the {{model}} page",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis: "DeepSeek-R1 distilled onto a 14B Qwen base. 32K context.",
      good: "Step-by-step reasoning out loud, uncensored. Calls tools. A small, cheap model that still shows its work.",
      weak: "Coding. It is an experimental preview with a short context, so keep tasks focused.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Open-weights lineage. 32K context.",
      good: "Blunt, quick answers with no lecture. The chatbot that opened the free-speech category, tuned for plain talk.",
      weak: "Tools, coding and deep analysis. It is quick-witted rather than a heavy reasoner.",
    },
    arya: {
      maker: "Gab",
      basis: "Base model undisclosed. 131K context.",
      good: "A right-leaning assistant by its maker's own framing, answering topics other models decline. Smart, long context, calls tools.",
      weak: "Coding. Its base and training are not publicly documented, so treat specifics as unverified.",
    },
    venice: {
      maker: "Venice.ai",
      basis: "Dolphin Mistral 24B, Venice edition. 128K context, reads images.",
      good: "Among the lowest refusal rates on the market. Roleplay, fiction, open-ended talk. A dependable uncensored default.",
      weak: "Code and heavy analysis. Native tool calls are shaky, so it uses a prompt-based tool path.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis: "24B tuned for roleplay. 128K context, reads images.",
      good: "Characters that hold their voice across long campaigns. Dark scenes and adult fiction without breaking mid-story.",
      weak: "Anything analytical. This is a storyteller, not an assistant.",
    },
    gemma: {
      maker: "Google (via Venice)",
      basis: "Gemma 4 26B MoE, filter stripped. 256K context, reads images.",
      good: "Fast, cheap, multimodal. A big context window for an uncensored model of this price.",
      weak: "Deep reasoning. It is a quick responder, not a thinker.",
    },
    qwen: {
      maker: "Alibaba (via Venice)",
      basis: "Qwen 3.6 Plus, refusals removed. 256K context, reads images.",
      good: "The strongest coder and analyst in the uncensored set. Reasons well, reads images, keeps long context.",
      weak: "Price. The capability costs more per message than the flash models.",
    },
    glmHeretic: {
      maker: "Z.AI (via Venice)",
      basis: "Abliterated GLM 4.7 Flash. 200K context.",
      good: "Pennies per message, quick answers, no lectures. A cheap uncensored fallback.",
      weak: "Analysis. It is a previous-generation flash model, kept for price and speed.",
    },
    mimo: {
      maker: "Xiaomi (via NanoGPT)",
      basis:
        "MiMo V2.6 Flash, refusal direction ablated. 1M context, reads images.",
      good: "Cheap and fast, multimodal, calls tools, with a huge context window. Solid for high-volume unfiltered work.",
      weak: "It trades some depth for speed. Not the pick for the hardest reasoning.",
    },
    glm53: {
      maker: "Z.AI (via NanoGPT)",
      basis: "Full GLM 5.3 reasoning model, uncensored. 1M context.",
      good: "Frontier-class code, writing and tools, uncensored, at a fraction of an abliterated flagship's price. The heavy hitter.",
      weak: "Speed. It is a large model, and it is still marked experimental.",
    },
    glm53Flash: {
      maker: "Z.AI (via NanoGPT)",
      basis: "320B MoE, uncensored. 1M context, reads images.",
      good: "Fast, cheap, multimodal, 1M context. The daily driver for unfiltered work.",
      weak: "The very hardest reasoning. For that, reach for full GLM 5.3.",
    },
  },
  why: {
    title: "Why the options matter",
    intro: "Choice is not a side feature. It is the whole point.",
    p1: "One model's refusal is another model's answer. A medical question, a legal edge case, a piece of fiction, a security write-up, a viewpoint outside the mainstream: a single filtered model decides for you what you are allowed to ask. A spread of models hands that decision back to you.",
    p2: "The uncensored set is also just a better toolbox. Qwen for code that other models flag, GLM 5.3 for frontier reasoning, Venice for fiction, a flash model for cheap volume, a right-leaning model for a viewpoint the rest of the field avoids. Different jobs, different tools. You keep the mainstream models too, in the same account, for when a filter is exactly what the work needs.",
    callout:
      "Uncensored does not mean careless. You are accountable for what you generate, and the law still applies. What changes here is who holds the dial: you, not the model vendor.",
  },
  howToPick: {
    title: "How to pick in practice",
    p1: "Start from the task. Code or analysis: Qwen 3.6 Plus Uncensored or full GLM 5.3 Uncensored. Fiction and roleplay: Venice Uncensored or Venice Role Play. High-volume, low-cost, multimodal: GLM 5.3 Flash, Gemma 4 or MiMo. A reasoning model that shows its work on a budget: UncensoredLM.",
    p2: "Want a specific viewpoint or a model built around free expression: Gab Arya or FreedomGPT Liberty. Not sure? Open two side by side on the models page and compare them on your own prompt.",
  },
  cta: {
    title: "Pick a model. Set your filter.",
    subtitle:
      "Every uncensored model here is live in the chat. Compare them on your own question, or just start talking.",
    chat: "Start a chat",
    models: "Browse all models",
  },
};
