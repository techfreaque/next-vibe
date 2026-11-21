export const translations = {
  meta: {
    title: "ChatGPT Alternative Without Filters | {{appName}}",
    description:
      "Looking for ChatGPT without filters? See which safeguards GPT keeps, compare open and uncensored models, and try a different chatbot without an account.",
    category: "Guide",
    imageAlt: "{{appName}}: a ChatGPT alternative without filters",
    keywords:
      "ChatGPT alternative, ChatGPT alternative without filters, uncensored ChatGPT alternative, ChatGPT without restrictions, unfiltered AI chat, uncensored AI, UncensoredLM, uncensored AI for politics, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Guide",
    readTime: "7 min read",
    title: "A ChatGPT alternative with uncensored models",
    subtitle:
      "Compare mainstream, open and uncensored AI models on {{appName}}. See how switching models affects your chat and what each option costs.",
  },
  intro: {
    lead: "ChatGPT uses OpenAI’s safeguards. GPT keeps its provider safeguards on {{appName}} too. If you want a less restrictive chat, choose a different model. It can still decline a request or get the answer wrong.",
    p2: "{{appName}} lets you choose among {{modelCount}} chat models across three content tiers, using one credit balance.",
  },
  exists: {
    title: "Is there a ChatGPT without filters?",
    p1: "ChatGPT uses OpenAI’s safeguards. On {{appName}}, selecting GPT still gives you a GPT model with its provider safeguards.",
    p2: "To try a less restrictive chat, pick a different model from the uncensored tier on {{appName}}. You can start in your browser as a guest.",
  },
  tiers: {
    title: 'What does "without filters" actually mean?',
    intro: "Every model carries a content level. There are three.",
    mainstream: "Mainstream ({{count}} models). Provider safeguards apply.",
    open: "Open ({{count}} models). Refusal behavior varies by model.",
    uncensored:
      "Uncensored ({{count}} models). These models are grouped by how they handle sensitive topics.",
    vendorRefusals:
      "On {{appName}}, changing models changes which model answers. Its own safeguards still apply.",
    twoKinds:
      "Some uncensored models use abliteration or fine-tuning to reduce refusals. UncensoredLM is trained on books and documents banned from the mainstream internet, giving it political views that diverge from the mainstream. Check factual claims against your sources.",
    modelsLink: "Browse every model by filter level",
  },
  switch: {
    title: "Can I switch models in the middle of a chat?",
    intro: "Yes. You can choose a model for the next message.",
    p1: "Switch models in an existing conversation to keep the thread. The new model can only use the history that fits in its context window.",
    p2: "You can draft with one model and ask a different model to revise the draft in the same chat.",
    caveat:
      "Each model applies its own safeguards to the draft and your next request.",
  },
  picks: {
    title: "Which model should I use instead of ChatGPT?",
    intro:
      "Start from the job. Each name links to the model's page with price and specs.",
    builtUncensored: {
      title: "Politics and viewpoints",
      body: "UncensoredLM can offer a different perspective on political and controversial topics. Check its factual claims against your sources.",
    },
    everyday: {
      title: "Everyday work",
      body: "Try these mainstream models for writing, coding and analysis.",
    },
    open: {
      title: "Open models for code and reasoning",
      body: "Try these open models for coding and reasoning. Compare how each handles the same prompt.",
    },
    unfiltered: {
      title: "Uncensored models for analysis",
      body: "Try these models for analysis, coding or long-form writing. They can still decline requests.",
    },
    fiction: {
      title: "Roleplay and dark fiction",
      body: "For an ongoing story, compare context windows and check whether a model supports image input.",
    },
    cheap: {
      title: "Lower-cost models",
      body: "Check the estimated cost on each model page. Longer inputs and outputs can use more credits.",
    },
    compare:
      "Compare the available pairs by price, context window and capabilities.",
    compareLink: "Compare {{a}} with {{b}}",
    guideLink: "Read the guide to every uncensored model",
  },
  privacy: {
    title: "Is an unfiltered AI chat private?",
    intro: "It depends on the folder. Here is exactly what happens.",
    incognito:
      "Incognito chats live in your browser's local storage. The conversation is not saved on our servers (generated media is stored temporarily for technical reasons). Clear your browser data and it is gone.",
    transit:
      "Each message still passes through our server to the model provider that writes the answer. That is how every hosted AI works. Credit usage is recorded so billing works.",
    memory:
      "Memory is off in incognito. Persistent memory needs a free account and the private folder.",
    private:
      "Private chats are saved on the server and visible only to your account. Open them from any device you log in on.",
    callout:
      "Short version: incognito keeps your history off our servers. It does not hide your messages from the model that answers them.",
  },
  pricing: {
    title: "How much does it cost?",
    intro: "Credits. One balance for every model.",
    free: "Free: {{guestCredits}} credits a month without an account, {{freeCredits}} with a free account, {{maxCredits}} with an account and the newsletter. Enough to try several models on your own prompts.",
    sub: "Monthly plans: four sizes, starting at {{subCredits}} credits for {{subPrice}}.",
    pack: "Credit packs: a top-up for subscribers, {{packCredits}} credits for {{packPrice}}. They never expire. Card, PayPal or crypto.",
    oneBalance:
      "The same balance covers image, video and music generation, voice input and output, and web search.",
    metered:
      "Each message costs credits based on the model. Flash models cost a fraction of a frontier model. Every model page shows the price.",
    link: "See plans and credit packs",
  },
  chatgptBetter: {
    title: "When is ChatGPT the better pick?",
    intro: "Sometimes. Here is when.",
    oneVendor:
      "You only use OpenAI models and never hit a refusal. Then one vendor, one app, one subscription is simpler.",
    flatRate:
      "You want a flat fee and never want to think about cost per message. Credits are metered, and heavy daily use of frontier models adds up.",
    firstFeatures:
      "You want a lab's newest app features on launch day. Labs often ship new features in their own apps first.",
    wantFilter:
      "You want the filter. A child's account or a workplace with strict rules needs guardrails. You can stay on the mainstream tier here, but a locked-down product may fit better.",
  },
  limits: {
    title: "What are the downsides?",
    intro: "Unfiltered comes with tradeoffs. Know them before you switch.",
    smaller:
      "Most uncensored models are smaller than the frontier models. Several are built for conversation and fiction, not hard analysis. UncensoredLM is built for frank answers, not for code. On the toughest reasoning and long coding jobs, top mainstream models still win.",
    tools:
      "Not every uncensored model supports tool calls. Check the model page before you count on web search or other tools.",
    vendor:
      "Mainstream models retain their provider safeguards. Uncensored models can also decline a request.",
    responsibility:
      "Check important claims and consider the consequences before sharing or acting on a response.",
  },
  faq: {
    filters: {
      q: "Can I turn off GPT’s safeguards in a ChatGPT alternative?",
      a: "GPT keeps its provider safeguards on {{appName}}. An uncensored model is a separate option with its own behavior. Selecting it changes which model replies.",
    },
    title: "FAQ",
    free: {
      q: "Is {{appName}} free?",
      a: "No account: {{guestCredits}} free credits a month. Free account: {{freeCredits}}. Account + newsletter: {{maxCredits}}. After that: a plan, from {{subPrice}} a month.",
    },
    account: {
      q: "Do I need an account?",
      a: "No. Incognito chat works without one. You need an account for memory and for chats saved on the server.",
    },
    api: {
      q: "Can I use these models in my own tools?",
      a: "Yes. Every paid plan includes an OpenAI-compatible API. One key, every model, the uncensored ones included.",
    },
    openSource: {
      q: "Is {{appName}} open source?",
      a: "Yes. The code is open source under MIT and GPL v3, and you can run your own instance.",
    },
    apiLink: "Set up the API in your coding tools",
    selfHostLink: "Run your own instance",
  },
  partners: {
    body: "Run a channel, newsletter or community about AI? The {{appName}} partner program pays a recurring share of every payment you refer.",
    link: "See the partner program",
  },
  cta: {
    title: "Choose a model and start chatting",
    subtitle:
      "Start without an account with up to {{guestCredits}} free credits a month.",
    chat: "Try uncensored AI chat",
    models: "Compare all models",
  },
};
