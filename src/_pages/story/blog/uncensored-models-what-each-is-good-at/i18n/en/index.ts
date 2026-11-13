export const translations = {
  meta: {
    title: "The uncensored models, one by one - {{appName}}",
    description:
      "Every uncensored AI model on unbottled.ai, model by model. UncensoredLM leads for dark roleplay, taboo fiction, politics and other viewpoints. The rest had refusals removed: here is what each does well and where it falls short.",
    category: "Model Guide",
    imageAlt: "{{appName}} uncensored model guide",
    keywords:
      "{{appName}}, uncensored AI models, abliterated models, Venice, GLM uncensored, Gab Arya, FreedomGPT, UncensoredLM, built uncensored AI, uncensored roleplay, dark roleplay AI, uncensored AI for politics, free speech AI",
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
    p2: "This is the honest tour. Real providers, real strengths, real weaknesses. One model here was built uncensored. The rest had their refusals removed. That difference decides which one you take into dark roleplay, taboo fiction, politics and views outside the mainstream: UncensoredLM. For everything else, pick by the work in front of you, not by the loudest label.",
  },
  whatItMeans: {
    title: 'What "uncensored" actually means here',
    p1: "Every model on the platform carries a content level: mainstream, open, or uncensored. Uncensored models answer without the refusal theatre and the moral preamble. They get there two ways. One is built uncensored: its lab trained it that way from the first run. The rest are existing models with their refusals removed, by abliteration (the refusal direction is cut out of the weights) or by a decensoring fine-tune. They keep their intelligence and drop the reflex to say no. They also keep their training data and the base lab's framing.",
    callout:
      "Built uncensored versus refusals removed. UncensoredLM is the only model here trained uncensored from the start. Every other uncensored model stops refusing but still carries its base model's view of the world. In dark fiction it can soften the scene. On politics it drifts back to the consensus. Unrestricted, not neutral.",
    p2: "You choose the level. Nobody chooses it for you. An uncensored model only answers that way because you selected it, and you can switch back to a mainstream model in the same chat, on the same account.",
  },
  groups: {
    builtUncensored: {
      title: "Meet the one built uncensored",
      intro:
        "UncensoredLM is the only model in the catalog trained uncensored from the first run. Nothing was stripped out after the fact, so there is no base framing pulling it back. It leads three jobs: dark and taboo roleplay, political and controversial questions, and views the mainstream will not voice.",
    },
    creative: {
      title: "When you need roleplay and dark fiction",
      intro:
        "Characters that stay in character, scenes that go where the story goes. UncensoredLM leads for the dark and the taboo. The alternatives win on long campaigns, image input or price.",
      topPickReason:
        "Dark and taboo roleplay and fiction, written straight. No softened scenes, no sudden moral aside, no character breaking to lecture you. It is built uncensored, so there is no base model nudging the story somewhere safer. One limit: 32K context, so in very long campaigns it forgets the early scenes.",
    },
    viewpoint: {
      title: "When you want politics, controversy or another viewpoint",
      intro:
        "Part of a free-speech platform is carrying models other platforms will not. UncensoredLM leads here. Gab Arya brings an openly stated right-leaning slant. FreedomGPT keeps it blunt.",
      topPickReason:
        "Political and controversial questions answered in your frame. Heterodox positions argued in full. Devil's advocate played straight, with no steer back to the consensus line and no moralizing. It is not neutral and states contested claims as plainly as settled ones, so check its facts.",
    },
    reasoning: {
      title: "When you need it to think",
      intro:
        "Reasoning, code, analysis. Strong base models with the refusals removed. The most intelligence in the uncensored set.",
    },
    fast: {
      title: "When you need it fast and cheap",
      intro:
        "Low cost per message, quick replies, big context, all three read images. The everyday workhorses.",
    },
  },
  cards: {
    goodLabel: "Good at",
    weakLabel: "Weaker at",
    pageLink: "See the {{model}} page",
    topPickLabel: "Top pick",
    alternativesLabel: "Alternatives",
    uncensoredLm: {
      maker: "Uncensored.ai",
      basis:
        "Trained uncensored by its lab. Its first public release was a DeepSeek-R1 distill on a 14B Qwen base. 32K context, text only.",
      good: "Dark and taboo roleplay and fiction. Political and controversial questions. Views outside the mainstream, argued in your frame. No moralizing, no steer back to the consensus line. Calls tools.",
      weak: "Very long campaigns (32K context), coding and images. It is experimental and states contested claims as plainly as settled ones, so check the facts it gives you.",
    },
    freedomgpt: {
      maker: "Age of AI",
      basis: "Open-weights lineage. 32K context.",
      good: "Blunt, quick answers with no lecture. The chatbot that opened the free-speech category, tuned for plain talk.",
      weak: "Depth. Tools, coding and long arguments are not its game. For a heterodox view argued in full, UncensoredLM goes further.",
    },
    arya: {
      maker: "Gab",
      basis: "Base model undisclosed. 131K context.",
      good: "A right-leaning assistant by its maker's own framing. Pick it when you want that slant on purpose. Long context, calls tools.",
      weak: "Range. It argues from one side by design. Its base and training are undisclosed, so treat specifics as unverified. Not a coder.",
    },
    venice: {
      maker: "Venice.ai",
      basis: "Dolphin Mistral 24B, Venice edition. 128K context, reads images.",
      good: "Cheap uncensored all-rounder with one of the lowest refusal rates around. Fiction, open talk, image input, 128K context.",
      weak: "Refusals removed, not built uncensored: it is a Mistral fine-tune and on dark scenes and politics it shows. Code and heavy analysis. Tool calls run through a prompt-based path.",
    },
    veniceRoleplay: {
      maker: "Venice.ai",
      basis: "24B tuned for roleplay. 128K context, reads images.",
      good: "Long campaigns. 128K context keeps early scenes in reach, and it is tuned to hold a character's voice. Reads images for character art and scene references.",
      weak: "Refusals removed, not built uncensored, so its base framing can soften the darkest material. Anything analytical: this is a storyteller, not an assistant.",
    },
    deepseekFlash: {
      maker: "DeepSeek (via Venice)",
      basis: "DeepSeek V4.1 Flash, refusals removed. 1M context, reads images.",
      good: "Huge context for sprawling worlds at a low price. Reads images, calls tools, and writes code when the story needs a break.",
      weak: "Refusals removed, the DeepSeek framing stays. On politics and the darkest scenes it can hedge. A generalist, not a dedicated storyteller.",
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
    p2: "The uncensored set is also just a better toolbox. UncensoredLM for dark roleplay, taboo fiction, politics and views the mainstream avoids. Venice Role Play for long campaigns. Qwen for code that other models flag. GLM 5.3 for frontier reasoning. A flash model for cheap volume. Gab Arya when you want a right-leaning slant on purpose. Different jobs, different tools. You keep the mainstream models too, in the same account, for when a filter is exactly what the work needs.",
    callout:
      "Uncensored does not mean careless. You are accountable for what you generate, and the law still applies. What changes here is who holds the dial: you, not the model vendor.",
  },
  howToPick: {
    title: "How to pick in practice",
    p1: "Start from the task. Dark or taboo roleplay and fiction, political or controversial questions, a view outside the consensus: UncensoredLM, the one built uncensored. Campaigns too long for 32K, or scenes that need images: Venice Role Play. Cheap all-rounder: Venice Uncensored. Code or analysis: Qwen 3.6 Plus Uncensored or full GLM 5.3 Uncensored. High volume, low cost, multimodal: GLM 5.3 Flash, Gemma 4 or MiMo.",
    p2: "Want a right-leaning slant on purpose: Gab Arya, by its maker's own framing. Blunt plain talk: FreedomGPT Liberty. Not sure? Put two side by side and compare them on your own prompt.",
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
