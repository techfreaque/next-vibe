export const translations = {
  meta: {
    title: "ChatGPT Alternative Without Filters | {{appName}}",
    description:
      "An unfiltered ChatGPT alternative: {{modelCount}} models from mainstream to uncensored. You pick the filter level per chat. Free to start, no account.",
    category: "Guide",
    imageAlt: "{{appName}}: a ChatGPT alternative without filters",
    keywords:
      "ChatGPT alternative, ChatGPT alternative without filters, uncensored ChatGPT alternative, ChatGPT without restrictions, unfiltered AI chat, uncensored AI, UncensoredLM, uncensored AI for politics, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Guide",
    readTime: "7 min read",
    title: "A ChatGPT alternative without filters. You set the level.",
    subtitle:
      "Claude, GPT and Gemini next to open and uncensored models, in one chat on {{appName}}. The honest version: what changes, what does not, and what it costs.",
  },
  intro: {
    lead: "You asked a normal question. ChatGPT answered with a disclaimer, a lecture or a polite no. A medical detail, a crime novel scene, a security question, a political take outside the consensus. The refusal is a policy decision, made for you before you typed a word.",
    p2: "This is what an unfiltered alternative actually looks like on {{appName}}: {{modelCount}} models, three filter levels, one balance. What it does well, where it falls short, and when ChatGPT is still the better pick.",
  },
  exists: {
    title: "Is there a ChatGPT without filters?",
    p1: "Not from OpenAI. GPT models follow OpenAI's usage policies wherever you run them. Claude and Gemini follow their own vendors' rules. Any app that promises an unfiltered GPT is overselling.",
    p2: "What a real alternative does is put other models next to them. {{appName}} runs the mainstream models and, in the same chat, open models with light filters and uncensored models with no filter at all. One of them, UncensoredLM, was built uncensored from the start. You decide which one answers.",
  },
  tiers: {
    title: 'What does "without filters" actually mean?',
    intro: "Every model carries a content level. There are three.",
    mainstream:
      "Mainstream ({{count}} models): Claude, GPT, Gemini, Mistral. Big-lab safety filters. They decline sensitive topics.",
    open: "Open ({{count}} models): DeepSeek, Kimi, GLM, Qwen, Grok, MiniMax and more. Light filters. They take on most edgy topics.",
    uncensored:
      "Uncensored ({{count}} models): UncensoredLM, built uncensored from the start. Plus Venice and uncensored builds of GLM, Qwen, Gemma and DeepSeek: existing models with their refusals removed. No filter. You set the limits.",
    vendorRefusals:
      "Mainstream models keep their vendor's filters here too. GPT on {{appName}} refuses what GPT refuses everywhere. The difference is what sits next to it.",
    twoKinds:
      "Uncensored comes in two kinds. UncensoredLM was trained uncensored by its lab from the first run. Take it into dark roleplay, a taboo topic, politics or a view outside the mainstream and it answers in your frame, with no lecture, no softened scene and no nudge back to the consensus line. Every other uncensored model started as a mainstream or open model and had its refusals stripped out. They stop saying no. Their training data and the base lab's framing stay. On politics they can still lean, hedge or frame things the way the base model does, and in dark fiction they can soften the scene. Unrestricted, not neutral.",
    modelsLink: "Browse every model by filter level",
  },
  switch: {
    title: "Can I switch models in the middle of a chat?",
    intro: "Yes. You pick the model per message, not per account.",
    p1: "Start a thread with Claude. Hit a refusal. Pick an uncensored model and send the next message. The thread keeps its history, and the new model reads all of it.",
    p2: "It works the other way too. Draft with an uncensored model, then hand the result to a frontier model for structure and polish.",
    caveat:
      "The filter lives in the model, not in the thread. A mainstream model reading an uncensored draft can still refuse to continue it.",
  },
  picks: {
    title: "Which model should I use instead of ChatGPT?",
    intro:
      "Start from the job. Each name links to the model's page with price and specs.",
    builtUncensored: {
      title: "Dark roleplay, politics, other viewpoints: built uncensored",
      body: "UncensoredLM is the one model here its lab trained to be uncensored from the start. Dark and taboo roleplay stays dark. Political and controversial questions get a straight answer in the frame you ask. Heterodox views get argued in full. No moralizing, no steer back to the consensus. The catch: 32K context, text only, not for code, and it states contested claims as plainly as settled ones. Check the facts it gives you.",
    },
    everyday: {
      title: "Everyday work, mainstream filters",
      body: "Writing, research, code, analysis. The closest match to ChatGPT, with the same kind of filters.",
    },
    open: {
      title: "Smart, fewer refusals",
      body: "Strong open models with light filters. They answer most of what a mainstream model dodges and hold up on code and reasoning.",
    },
    unfiltered: {
      title: "No refusals, real reasoning",
      body: "The heavy hitters among the refusal-stripped models. Strong base models with the refusals removed: code, analysis and long writing on topics other models flag. The base model's framing stays, so for politics, dark roleplay and other viewpoints start with UncensoredLM.",
    },
    fiction: {
      title: "Roleplay and dark fiction",
      body: "UncensoredLM leads for dark and taboo scenes: built uncensored, so nothing softens the story. Venice Role Play for long campaigns (128K context) and image input. Venice Uncensored as the cheap all-rounder.",
    },
    cheap: {
      title: "Cheap and fast",
      body: "High volume at a low price. Three refusal-stripped flash models, plus Claude Haiku for when a filter is fine.",
    },
    compare:
      "Torn between two? Put price, context window and capabilities side by side. Start with UncensoredLM against ChatGPT's model, against Venice Role Play and against a refusal-stripped flagship.",
    compareLink: "Compare {{a}} with {{b}}",
    guideLink: "Read the guide to every uncensored model",
  },
  privacy: {
    title: "Is an unfiltered AI chat private?",
    intro: "It depends on the folder. Here is exactly what happens.",
    incognito:
      "Incognito chats live in your browser's local storage. The conversation is not saved on our servers. Clear your browser data and it is gone.",
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
    sub: "Subscription: {{subCredits}} credits a month for {{subPrice}}.",
    pack: "Credit packs: {{packCredits}} credits for {{packPrice}}. They never expire. Card or crypto.",
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
      "Mainstream models keep their own refusals. If Claude says no, switch models instead of arguing with it.",
    responsibility:
      "No filter means no safety net. What you generate and publish is on you, and the law where you live still applies.",
  },
  faq: {
    title: "FAQ",
    free: {
      q: "Is {{appName}} free?",
      a: "No account: {{guestCredits}} free credits a month. Free account: {{freeCredits}}. Account + newsletter: {{maxCredits}}. After that: a subscription at {{subPrice}} a month or a credit pack.",
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
    title: "Pick your filter. Ask your question.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Mainstream, open or uncensored: switch any time.",
    chat: "Start an unfiltered chat",
    models: "Compare all models",
  },
};
