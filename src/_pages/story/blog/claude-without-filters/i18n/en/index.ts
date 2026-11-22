export const translations = {
  meta: {
    title:
      "Claude Without Filters: Why It Refuses and What Works | {{appName}}",
    description:
      "There is no uncensored Claude. Why Claude refuses, why jailbreaks and fake 'uncensored Claude' sites don't hold, and the setup that works: Claude plus uncensored models in one thread. Live prices.",
    category: "Model Guide",
    imageAlt: "Claude next to uncensored models in one chat",
    keywords:
      "Claude without filters, Claude uncensored, uncensored Claude, Claude jailbreak, Claude no restrictions, Claude refuses, Claude alternative for fiction, Claude alternative no filter, Claude NSFW alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Guide",
    readTime: "7 min read",
    title: "Claude without filters. Why it can't exist, and what works.",
    subtitle:
      "Keep {{claudeName}} for what it does best. Hand the rest to {{count}} models without a refusal layer, in the same thread.",
  },
  intro: {
    lead: "Claude writes some of the best prose of any model. It also stops mid-scene, adds a disclaimer nobody asked for, or turns your villain into a therapist.",
    p2: "There is no switch that turns that off. Here is why, what doesn't work, and the setup that does: {{claudeName}} and uncensored models side by side, one conversation, one balance. {{appName}} runs both.",
  },
  why: {
    title: "Why Claude refuses",
    intro: "Three reasons, and none of them is a setting.",
    trained:
      "Trained in. Anthropic trains its values into the model itself. The refusals come from training, not from a filter someone can toggle off.",
    policy:
      "Policy everywhere. Anthropic's usage policy applies on every app and API that serves Claude, ours included. A different front end does not change the model.",
    closed:
      "Closed weights. Nobody outside Anthropic can modify Claude. Open models can be abliterated, slightly changed so they stop dodging. Claude can't.",
  },
  tricks: {
    title: "What doesn't work",
    intro: "Every week a new trick goes around. They share the same problems.",
    jailbreak:
      "Jailbreak prompts. They get patched, they make the writing worse, and breaking safeguards is against Anthropic's terms. Accounts get banned for it.",
    fiction:
      '"It\'s just fiction." Helps for mild material. Fails on exactly the scenes that matter.',
    fake: "\"Uncensored Claude\" sites. Either a jailbreak prompt in a wrapper or a different model wearing Claude's name. You can't verify which.",
    callout:
      "If a site promises uncensored Claude, ask what model actually answers. The honest answer is never Claude.",
    jailbreakLink: "Why jailbreak prompts keep breaking",
  },
  switch: {
    title: "What works: switch models per message",
    intro:
      "{{claudeName}} and the uncensored models share one thread. The model changes, the story stays.",
    steps: {
      draft: {
        title: "Draft with Claude",
        body: "Outline, structure, dialogue, the parts {{claudeName}} handles well.",
      },
      switch: {
        title: "Switch when it balks",
        body: "Pick an uncensored model for the next message. It reads the whole conversation and writes the scene Claude refused.",
      },
      back: {
        title: "Go back for polish",
        body: "Hand the text back to Claude for line edits when the content allows. Or keep going uncensored.",
      },
      compare: {
        title: "Compare on the same prompt",
        body: "Not sure which voice fits? Send one prompt to two models and keep the better draft.",
      },
    },
  },
  models: {
    title: "Claude and the uncensored picks, side by side",
    intro:
      "Content tier or uncensored method under each name. Live from our catalog.",
    colModel: "Model",
    colContext: "Context",
    colStrengths: "Good at",
    colPrice: "Per message",
    colChat: "Try it",
    chatLink: "Chat with {{model}}",
    footnote:
      "Price of one reference message, our {{markup}}% markup included.",
  },
  picks: {
    title: "Which uncensored model for which job",
    intro: "Same chat as Claude. Pick by the job, not the hype.",
    long: {
      title: "Long creative work: {{model}}",
      body: "Moonshot AI's flagship Kimi, abliterated. Holds a long plot together and reasons through it. {{price}} a message.",
    },
    fast: {
      title: "Fast all-rounder: {{model}}",
      body: "A mainstream model, slightly changed so it stops dodging. Quick, sharp, good with prose and code. {{price}} a message.",
    },
    contrary: {
      title: "Views Claude won't voice: {{model}}",
      body: "{{model}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions. For characters and essays that argue against the consensus. {{price}} a message.",
    },
    roleplay: {
      title: "Characters and dark scenes: {{model}}",
      body: "Fine-tuned for roleplay. Stays in character and does not step out of the story to warn you. {{price}} a message.",
    },
    cheap: {
      title: "Cheap first drafts: {{model}}",
      body: "DeepSeek with the refusals removed. Fast and inexpensive for bulk drafting. {{price}} a message.",
    },
    compareLink: "{{a}} vs {{b}}",
    writerLink: "Uncensored AI writer: the full guide",
  },
  limits: {
    title: "The honest limits",
    intro: "No refusals is not the same as no tradeoffs.",
    style:
      "Different voices. Each model writes differently. Try two on the same scene before you commit.",
    mistakes:
      "Same mistakes. Uncensored models get facts wrong as often as the originals. Check what matters.",
    claude:
      "Claude stays Claude. Switching models never changes what Claude itself will write. It only means you are not stuck with it.",
    callout:
      "Uncensored models unlock after a one-time 18+ confirmation. You decide what you read.",
  },
  faq: {
    title: "FAQ",
    can: {
      q: "Can Claude be uncensored?",
      a: "No. Claude's refusals are trained into a closed model, so nobody can remove them. Anything sold as uncensored Claude is a prompt trick or a different model. Open models with the refusals removed are the real alternative.",
    },
    jailbreak: {
      q: "Is jailbreaking Claude allowed?",
      a: "No. Circumventing safeguards breaks Anthropic's usage policy and can cost you your account. It also degrades the output. Switching to a model without a refusal layer gets the same result without the risk.",
    },
    best: {
      q: "What is the best Claude alternative for fiction?",
      a: "For long, dark or explicit fiction: an abliterated model like {{firstName}}. For characters that argue against the mainstream: {{ownModel}}. For roleplay: a roleplay fine-tune. On {{appName}} they all sit next to Claude.",
    },
    same: {
      q: "Can I use Claude and an uncensored model in one chat?",
      a: "Yes. Pick the model per message. The conversation history carries over, so the uncensored model continues exactly where Claude stopped.",
    },
    api: {
      q: "Can I call Claude and uncensored models over one API?",
      a: "Yes. OpenAI and Anthropic compatible endpoints, one key for Claude and the uncensored models. Your first purchase unlocks API keys, plans start at {{apiSubPrice}} a month.",
    },
    free: {
      q: "Can I try it for free?",
      a: "Yes. {{guestCredits}} free credits a month without an account, {{freeCredits}} with a free one. Uncensored models included after a one-time 18+ confirmation.",
    },
    chatLink: "Uncensored AI chat: pick a model and start",
    roleplayLink: "AI roleplay without a filter",
    refusalLink: "Refusal Index: who answers, who refuses",
  },
  cta: {
    title: "Keep Claude's pen. Lose the brakes.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Start with {{firstName}}.",
    start: "Start an uncensored chat",
    models: "Compare all models",
  },
};
