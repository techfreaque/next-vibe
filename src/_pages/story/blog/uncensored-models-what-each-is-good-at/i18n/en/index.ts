export const translations = {
  meta: {
    title: "The uncensored models, one by one - {{appName}}",
    description:
      "A plain-spoken guide to every uncensored AI model on unbottled.ai. Which one is built uncensored, which ones had their refusals removed, what each is good at and where it falls short.",
    category: "Model Guide",
    imageAlt: "{{appName}} uncensored model guide",
    keywords:
      "{{appName}}, uncensored AI models, abliterated models, Venice, GLM uncensored, Gab Arya, FreedomGPT, UncensoredLM, built uncensored AI, uncensored AI for politics, free speech AI",
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
    p2: "This is the honest tour. Real providers, real strengths, real weaknesses. One model here was built uncensored. The rest had their refusals removed. That difference decides which one you ask about politics. For everything else, pick by the work in front of you, not by the loudest label.",
  },
  whatItMeans: {
    title: 'What "uncensored" actually means here',
    p1: "Every model on the platform carries a content level: mainstream, open, or uncensored. Uncensored models answer without the refusal theatre and the moral preamble. They get there two ways. One is built uncensored: its lab trained it that way from the first run. The rest are existing models with their refusals removed, by abliteration (the refusal direction is cut out of the weights) or by a decensoring fine-tune. They keep their intelligence and drop the reflex to say no. They also keep their training data and the base lab's framing.",
    callout:
      "Built uncensored versus refusals removed. UncensoredLM is the only model here trained uncensored from the start. Every other uncensored model stops refusing but still carries its base model's view of the world. On politics that shows. Unrestricted, not neutral.",
    p2: "You choose the level. Nobody chooses it for you. An uncensored model only answers that way because you selected it, and you can switch back to a mainstream model in the same chat, on the same account.",
  },
  groups: {
    builtUncensored: {
      title: "When the question is political or controversial",
      intro:
        "The one model in the catalog built to be uncensored. It answers in the frame you ask, without moralizing and without steering you back to the consensus line.",
    },
    reasoning: {
      title: "When you need it to think",
      intro:
        "Reasoning, code, analysis. Strong base models with the refusals removed. The most intelligence in the uncensored set.",
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
      basis:
        "Trained uncensored by its lab. Its first public release was a DeepSeek-R1 distill on a 14B Qwen base. 32K context, text only.",
      good: "Political, controversial and taboo questions, answered head-on in your frame. No moralizing, no steer back to the consensus line. Calls tools.",
      weak: "Coding, long documents and images. It is experimental and states contested claims as plainly as settled ones, so check the facts it gives you.",
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
      weak: "Code and heavy analysis. Native tool calls are shaky, so it uses a prompt-based tool path. Under the hood it is a Mistral fine-tune, and on politics it shows.",
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
      weak: "Deep reasoning. It is a quick responder, not a thinker. Google's training still shapes how it frames hot topics.",
    },
    qwen: {
      maker: "Alibaba (via Venice)",
      basis: "Qwen 3.6 Plus, refusals removed. 256K context, reads images.",
      good: "The strongest coder and analyst in the uncensored set. Reasons well, reads images, keeps long context.",
      weak: "Price. The capability costs more per message than the flash models. The refusals are gone, Alibaba's training data is not: expect its base framing on politics.",
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
      weak: "Speed. It is a large model, and it is still marked experimental. It no longer refuses, but on political questions it can still hedge like base GLM.",
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
    p2: "The uncensored set is also just a better toolbox. UncensoredLM for political and controversial questions, Qwen for code that other models flag, GLM 5.3 for frontier reasoning, Venice for fiction, a flash model for cheap volume, a right-leaning model for a viewpoint the rest of the field avoids. Different jobs, different tools. You keep the mainstream models too, in the same account, for when a filter is exactly what the work needs.",
    callout:
      "Uncensored does not mean careless. You are accountable for what you generate, and the law still applies. What changes here is who holds the dial: you, not the model vendor.",
  },
  howToPick: {
    title: "How to pick in practice",
    p1: "Start from the task. Politics, controversial or taboo questions: UncensoredLM, the one built uncensored. Code or analysis: Qwen 3.6 Plus Uncensored or full GLM 5.3 Uncensored. Fiction and roleplay: Venice Uncensored or Venice Role Play. High-volume, low-cost, multimodal: GLM 5.3 Flash, Gemma 4 or MiMo.",
    p2: "Want a deliberate viewpoint: Gab Arya, right-leaning by its maker's own framing. Blunt plain talk: FreedomGPT Liberty. Not sure? Put two side by side and compare them on your own prompt.",
    compareLink: "Compare {{a}} with {{b}}",
  },
  cta: {
    title: "Pick a model. Set your filter.",
    subtitle:
      "Every uncensored model here is live in the chat. Compare them on your own question, or just start talking.",
    chat: "Start a chat",
    models: "Browse all models",
  },
};
