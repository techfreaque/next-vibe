export const translations = {
  meta: {
    title: "DeepSeek Uncensored: Abliterated DeepSeek Online | {{appName}}",
    description:
      "Where DeepSeek's censorship really sits, why another host fixes only half of it, and the uncensored DeepSeek builds you can chat with now. No GPU, no account.",
    category: "Model Guide",
    imageAlt:
      "DeepSeek uncensored: stock DeepSeek next to its abliterated builds",
    keywords:
      "DeepSeek uncensored, uncensored DeepSeek, DeepSeek abliterated, DeepSeek without censorship, DeepSeek V4.1 Flash Uncensored, DeepSeek censorship, DeepSeek Tiananmen, uncensored DeepSeek online, DeepSeek jailbreak alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Guide",
    readTime: "7 min read",
    title: "DeepSeek uncensored. What actually removes the filter.",
    subtitle:
      "{{count}} uncensored DeepSeek builds, side by side with stock DeepSeek. From {{buildPrice}} a message, in the browser.",
  },
  intro: {
    lead: "DeepSeek is fast, cheap and sharp at code. Ask it about the wrong topic and it goes quiet, changes the subject or deletes its own answer.",
    p2: "That behavior has two sources, and most fixes only touch one. Below: where the censorship sits, the three ways around it, and the uncensored DeepSeek builds that run on {{appName}} right now, with live prices.",
  },
  where: {
    title: "Where DeepSeek's censorship sits",
    intro: "Two layers. They come off in different ways.",
    app: "The app layer. DeepSeek's own chat app and website run a moderation layer on top of the model. Answers on topics sensitive in China get cut off mid-sentence or swapped for a stock reply.",
    weights:
      "The weights. The model itself was trained to deflect some topics and refuse others, like every mainstream model. That travels with the model wherever it runs.",
    hosts:
      "Third-party hosts. Because DeepSeek publishes its weights, other companies run the same model without DeepSeek's app layer. The live deletions stop. The trained refusals stay.",
    callout:
      "Running DeepSeek somewhere else removes the app filter. Only a modified build removes the refusals trained into the model.",
  },
  ways: {
    title: "Three ways to get DeepSeek without the filter",
    intro: "From most work to least.",
    localTitle: "1. Run the open weights yourself",
    local:
      "Full DeepSeek models are far too big for a home GPU. Most small downloads named DeepSeek are distills: a Qwen or Llama base trained on DeepSeek output. Useful, but a different model with different refusals.",
    hostedTitle: "2. Use stock DeepSeek from another host",
    hosted:
      "Kills the live deletions, keeps the trained deflections. Fine for code and everyday work. Not the fix if refusals are your problem.",
    buildTitle: "3. Use an uncensored build",
    build:
      "Someone took the DeepSeek weights and removed the refusal behavior, usually by abliteration. Same model, same speed, same context window. It stops dodging. Hosted, so nothing to install.",
    noGpuLink: "Run an uncensored LLM online, no GPU needed",
  },
  models: {
    title: "DeepSeek models on this platform",
    intro:
      "Uncensored builds first, then the stock models they come from. Live from our catalog.",
    colModel: "Model",
    colContext: "Context",
    colStrengths: "Good at",
    colPrice: "Per message",
    colChat: "Try it",
    chatLink: "Chat with {{model}}",
    footnote:
      "Price of one reference message, our {{markup}}% markup included. The label under each name shows how a build was made.",
  },
  builds: {
    title: "The {{count}} uncensored DeepSeek builds",
    intro: "Same base family, different hands.",
    venice:
      "Served by Venice.ai, with the refusals removed and tool calls intact. Tagged for {{strengths}}. One reference message costs {{price}}.",
    csf: "An abliterated build by the independent developer jcartu, with reasoning and tool calls. Tagged for {{strengths}}. One reference message costs {{price}}.",
    chatLink: "Chat with {{model}}",
    abliteration:
      "Abliteration finds the direction in the model's activations that triggers a refusal and removes it from the weights. The rest of what the model learned stays where it was. That is why an abliterated DeepSeek still codes like DeepSeek.",
    explainerLink: "Abliterated vs uncensored models, explained",
  },
  compare: {
    title: "Stock vs uncensored, side by side",
    intro:
      "Context, price, strengths and refusal behavior on one page. Then send both the same prompt.",
    link: "{{a}} vs {{b}}",
  },
  limits: {
    title: "What an uncensored build does not change",
    intro: "Removing refusals is one fix. Not every fix.",
    knowledge:
      "Knowledge. The model knows what its training data held. Taking away a refusal does not add facts it never saw.",
    slant:
      "Slant. Abliteration removes refusals, not the leanings of the training data. If you want a model that disagrees with the mainstream on purpose: {{ownModel}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions.",
    mistakes:
      "Mistakes. An uncensored model is as wrong as often as the original. Check facts that matter.",
    callout:
      "Uncensored models unlock after a one-time 18+ confirmation. What you do with the answers is your call.",
  },
  faq: {
    title: "FAQ",
    censored: {
      q: "Is DeepSeek censored?",
      a: "Yes, in two layers. DeepSeek's own app moderates answers on topics sensitive in China, and the model itself was trained to deflect and refuse some requests. Other hosts drop the first layer. Only an uncensored build drops the second.",
    },
    exists: {
      q: "Is there an uncensored DeepSeek?",
      a: "Yes. {{appName}} runs {{count}} uncensored DeepSeek builds, starting with {{buildName}}. They keep DeepSeek's skills and context window and stop dodging.",
    },
    local: {
      q: "Can I run uncensored DeepSeek locally?",
      a: "Only with serious hardware. The full models need far more memory than a gaming PC has. The small DeepSeek downloads are mostly distills on other bases. Hosted builds skip the hardware question.",
    },
    china: {
      q: "Will uncensored DeepSeek answer questions about China?",
      a: "Trained deflections on those topics are exactly the kind of refusal abliteration removes. How good the answer is still depends on what the model learned. Ask {{stockName}} and an uncensored build the same question and compare.",
    },
    api: {
      q: "Can I use uncensored DeepSeek over an API?",
      a: "Yes. The same builds run over OpenAI and Anthropic compatible endpoints. Your first purchase unlocks API keys, plans start at {{apiSubPrice}} a month.",
    },
    free: {
      q: "Can I try it for free?",
      a: "Yes. {{guestCredits}} free credits a month without an account, {{freeCredits}} with a free one, {{maxCredits}} with the newsletter. Enough for plenty of messages on the cheaper builds.",
    },
    directoryLink: "All abliterated models, with context and price",
    bestLink: "The best uncensored LLM, picked by job",
    refusalLink: "Refusal Index: who answers, who refuses",
  },
  cta: {
    title: "DeepSeek's brain. Without the dodging.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Start with {{buildName}}.",
    start: "Chat with uncensored DeepSeek",
    models: "Compare all models",
  },
};
