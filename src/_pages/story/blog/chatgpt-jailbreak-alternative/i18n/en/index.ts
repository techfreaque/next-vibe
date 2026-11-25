export const translations = {
  meta: {
    title: "ChatGPT Jailbreak Prompts Keep Breaking. Try This | {{appName}}",
    description:
      "Compare alternatives to ChatGPT jailbreak prompts, from {{appName}} and Venice to LM Studio and Ollama. See model choices, privacy and costs.",
    category: "Model Guide",
    imageAlt: "ChatGPT jailbreak prompts compared with uncensored models",
    keywords:
      "ChatGPT jailbreak, ChatGPT jailbreak prompt, DAN prompt, bypass ChatGPT filter, ChatGPT without filter, ChatGPT no restrictions, does ChatGPT jailbreak still work, jailbreak alternative, uncensored ChatGPT alternative, abliterated model, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Guide",
    readTime: "7 min read",
    title: "Compare ChatGPT jailbreak alternatives",
    subtitle:
      "Compare hosted chat and local models on limits, cost and privacy. See {{count}} model picks for writing and roleplay.",
  },
  intro: {
    lead: "A prompt that changes how ChatGPT answers today may behave differently after an update. Choose a model that already fits your writing or roleplay.",
    p2: "Compare hosted chats and local apps first. We also list {{count}} models on {{appName}} with context and live prices.",
  },
  why: {
    title: "Why ChatGPT jailbreaks keep breaking",
    intro: "Three layers stand between your prompt and a straight answer.",
    weights:
      "The refusal is in the weights. GPT models are trained to decline whole categories of requests. A jailbreak doesn't remove that training, it tries to talk around it, one conversation at a time.",
    patched:
      "Known jailbreaks get trained against. Once a prompt spreads, it shows up in the next round of safety training. That is why last month's prompt fails today.",
    layer:
      "There can be a check outside the model too. Mainstream apps can run moderation on inputs and outputs, so even a reply the model wrote can be flagged or removed.",
  },
  cost: {
    title: "What a jailbreak actually costs you",
    intro: "Even when it works, you pay for it.",
    quality:
      "Worse answers. The model spends its effort playing a character instead of answering. Persona replies are padded, theatrical and often less accurate.",
    unstable:
      "No consistency. The same prompt works in one chat and fails in the next. You can't build a workflow on it.",
    account:
      "Account risk. ChatGPT's usage policies apply to every prompt, and OpenAI can restrict or suspend accounts that break them. A jailbreak is an attempt to break them on purpose.",
    time: "Wasted time. Hunting, testing and rewording prompts takes longer than asking the question.",
    callout:
      "A jailbreak treats the symptom. The refusal comes from how the model was trained, so pick a model that was trained differently.",
  },
  instead: {
    title: "The model that doesn't need a jailbreak",
    intro: "Two kinds of uncensored model, two different fixes.",
    abliteratedTitle: "Abliterated: the refusal taken out of the weights",
    abliterated:
      "A 2024 study found that, in the chat models it tested, refusal is largely carried by a single direction inside the network. Abliteration removes that direction from the weights. The result is the same model, same knowledge, same style, that mostly stops dodging questions. No prompt tricks, because there is nothing left to trick.",
    ownTitle: "{{ownModel}}: a different worldview",
    own: "{{ownModel}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions. Not a mainstream model with the brakes off. A different set of opinions entirely.",
    sources: {
      paper:
        "Arditi et al., Refusal in language models is mediated by a single direction (2024)",
      blog: "Maxime Labonne, Uncensor any LLM with abliteration",
    },
    link: "Abliterated, fine-tuned or own worldview: the full explainer",
  },
  models: {
    title: "{{count}} uncensored models, no jailbreak needed",
    intro:
      "Every current uncensored model on our platform, cheapest first. Context and price come from our model registry.",
    colModel: "Model",
    colContext: "Context",
    colPrice: "Per message",
    colChat: "Try it",
    chatLink: "Chat with {{model}}",
    footnote:
      "Per message means one reference exchange on the cheapest route. Long chats and long answers cost more.",
  },
  test: {
    title: "Run the test yourself: same question, two models",
    intro: "Don't trust us. Ask the question you wanted to jailbreak for.",
    steps: {
      ask: {
        title: "Ask a mainstream model",
        body: "Start a chat and pick GPT or another mainstream model. Ask the question it would normally dodge. Note the answer.",
      },
      switch: {
        title: "Switch to an uncensored model",
        body: "Change the model for the next message, in the same chat. Confirm you are 18+ once when asked.",
      },
      compare: {
        title: "Ask again, compare",
        body: "Same question, no persona, no tricks. Compare length, directness and accuracy.",
      },
      keep: {
        title: "Keep the one that answers",
        body: "Switch back any time. Mainstream models for the hard code, uncensored ones for the questions others won't touch.",
      },
    },
    compareLink: "{{a}} vs {{b}}: side by side",
  },
  limits: {
    title: "What no model removes",
    intro: "Uncensored is not magic. Know the edges.",
    decline:
      "It can still decline. Abliteration removes most trained refusals, not every one. Results vary by model and prompt.",
    wrong:
      "It can still be wrong. No filter also means no one softening a bad answer. Check facts that matter.",
    adult:
      "Adults only. Uncensored models unlock after a one-time 18+ confirmation and the terms.",
    callout:
      "What you generate and publish is on you, and the law where you live still applies.",
  },
  faq: {
    title: "FAQ",
    work: {
      q: "Do ChatGPT jailbreak prompts still work?",
      a: "Sometimes, briefly. Popular prompts get trained against and moderation catches many outputs, so a working prompt rarely lasts. A model without the trained refusal is the reliable route.",
    },
    dan: {
      q: "What is the DAN prompt?",
      a: "DAN (Do Anything Now) is a roleplay jailbreak that tells ChatGPT to act as a persona without rules. Its versions get patched one after another, and persona answers tend to be worse than plain ones.",
    },
    ban: {
      q: "Can I get banned for jailbreaking ChatGPT?",
      a: "OpenAI's usage policies apply to every prompt, and it can restrict or suspend accounts that break them. Using a model built to answer avoids the problem entirely.",
    },
    gpt: {
      q: "Can I use GPT without its filter on {{appName}}?",
      a: "No. GPT keeps OpenAI's safeguards everywhere, including here. For unfiltered answers, pick one of the {{count}} uncensored models. You can switch between GPT and them in the same chat.",
    },
    legal: {
      q: "Is it legal to use an uncensored AI model?",
      a: "A model is a tool. What you generate and publish is your responsibility, and the law where you live applies to it. On {{appName}}, uncensored models unlock after a one-time 18+ confirmation.",
    },
    free: {
      q: "Can I try an uncensored model for free?",
      a: "Yes. {{appName}} gives {{guestCredits}} free credits a month without an account and {{freeCredits}} with a free account. How many messages that is depends on the model and the chat length.",
    },
    alternativeLink: "A ChatGPT alternative without filters: model picks",
    refusalLink: "Which AI actually answers? The refusal index",
    chatLink: "Uncensored AI chat in your browser",
  },
  cta: {
    title: "Skip the jailbreak. Ask the question.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Pick an uncensored model and ask it straight.",
    start: "Start an uncensored chat",
    models: "Compare all models",
  },
};
