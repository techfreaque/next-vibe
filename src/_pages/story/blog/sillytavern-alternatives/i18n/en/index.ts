export const translations = {
  meta: {
    title: "SillyTavern Alternatives: Roleplay Without the Setup (2026)",
    description:
      "SillyTavern is free but needs Node.js, a backend and no iPhone install. Compare {{appName}}, RisuAI, Agnaistic, KoboldCpp, Janitor AI, LM Studio and more.",
    category: "Comparison",
    imageAlt: "SillyTavern alternatives, hosted and local, compared",
    keywords:
      "SillyTavern alternatives, SillyTavern alternative, apps like SillyTavern, SillyTavern for iPhone, SillyTavern online, SillyTavern without install, RisuAI vs SillyTavern, KoboldCpp, Agnaistic, AI roleplay frontend, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Comparison",
    readTime: "9 min read",
    title: "SillyTavern alternatives without the setup",
    subtitle:
      "{{count}} alternatives and {{appName}}, from other open-source frontends to hosted chat. Checked on their own pages on {{date}}.",
  },
  intro: {
    lead: "SillyTavern is the power tool of AI roleplay. Free, open source, endlessly configurable. It also wants Node.js, a model backend, a config file and, on a phone, Termux.",
    p2: "Some people love that. Others just want to write. Here are the alternatives, from open-source clones with the same cards to hosted apps with nothing to install, checked on {{date}}.",
  },
  subject: {
    title: "SillyTavern today",
    intro:
      "Release 1.19.1 shipped on 19 November 2026. What the project's own docs say.",
    plans:
      "Price: free and open source (AGPL-3.0). The developers run no hosted service, so you pay whatever model API you connect, or nothing with a local model.",
    filter:
      "Filter: none of its own. The connected model or provider decides what is allowed.",
    privacy:
      "Privacy: chats live in your own install's data folder. Anything you send to a cloud API follows that provider's policy.",
    extra:
      "Setup: Node.js 20 or newer, Git, then a backend. Android runs it through Termux, iPhone cannot install it at all. Remote access needs a whitelist or password, and the docs warn against exposing it to the internet.",
  },
  why: {
    title: "Why people look elsewhere",
    intro: "The same four complaints, in the project's own words.",
    setup:
      "Backend setup. Local backends can be complex, and the team does not support them.",
    mobile:
      "Mobile. Android needs Termux and can kill the server in the background. iPhone has no install route.",
    security:
      "Security work is yours. Release 1.19.1 fixed scripts running from character cards and imported chats.",
    cost: "Paying twice. A managed host charges for hosting alone, and the model API comes on top.",
  },
  criteria: {
    title: "What to check before you switch",
    intro: "Five questions sort the options.",
    one: "Install: browser, desktop app, or a server you run and patch.",
    two: "Cards: does it import SillyTavern and Chub PNG or JSON cards and lorebooks?",
    three: "Models: bring your own API key, run locally, or models included.",
    four: "Features: group chats, lorebooks, image generation and voice.",
    five: "Cost: free software plus API fees, a flat plan, or pay per message.",
  },
  table: {
    title: "All of them, side by side",
  },
  us: {
    title: "{{appName}}: no install, models included",
    intro:
      "Open a browser on any device, iPhone included. {{modelCount}} models are already connected, so there is no API key to paste.",
    models:
      "Models: {{uncensored}} uncensored next to {{mainstream}} mainstream and {{open}} open ones. {{ownModel}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions.",
    fit: "Characters: the roleplay skill or your own character as a skill. Memory keeps facts across chats, and {{imageModels}} image models illustrate a scene in the same thread.",
    privacy:
      "Privacy: incognito chats stay in your browser's local storage, no account needed.",
    price:
      "Price: {{guestCredits}} free credits a month without an account, {{freeCredits}} with one, {{maxCredits}} with the newsletter. Plans: {{planList}}. One balance for every model.",
    api: "API: OpenAI and Anthropic compatible endpoints, so you can still point SillyTavern at our models. Any purchase unlocks it.",
    weak: "Where SillyTavern wins: total control over prompts, presets and extensions, group chats, lorebooks and card import. Ours is open source too, but it is a platform, not a roleplay toolkit.",
    ownLink: "See {{ownModel}}",
    skillLink: "Start the roleplay skill",
  },
  list: {
    title: "The documented alternatives, one by one",
    intro:
      "The platforms with a full profile in our comparison data, checked on their own pages. The open-source frontends are in the table above.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Models:",
    filter: "Filter:",
    price: "Price:",
    priceValue: "Free tier: {{free}}. Paid: {{plans}}.",
    pro: "Best part:",
    con: "Catch:",
    forWho: "Pick it if:",
    versusLink: "{{appName}} vs {{name}}: full comparison",
    visit: "Visit {{name}}",
  },
  stay: {
    title: "When SillyTavern is still the right pick",
    intro: "For many power users it is.",
    one: "You run models locally and want nothing to leave your machine.",
    two: "You live in extensions, presets, regex rules and group chats.",
    three:
      "You already have API keys and want one front end for all of them. Ours can be one of those keys.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "What is the best SillyTavern alternative?",
      a: "Closest clone: RisuAI, open source with lorebooks, group chats and a web version. Local and simple: KoboldCpp or LM Studio. Hosted character library: Janitor AI or Chub. Nothing to install with models included: {{appName}}.",
    },
    free: {
      q: "Is there a free SillyTavern alternative?",
      a: "RisuAI, Agnaistic, KoboldCpp and Talemate are free software. You still pay the model unless you run it on your own hardware. {{appName}} gives {{guestCredits}} free credits a month without an account and {{freeCredits}} with one, {{maxCredits}} with the newsletter, models included.",
    },
    filter: {
      q: "Which alternatives allow uncensored roleplay?",
      a: "Frontends inherit the model's rules, so pick an uncensored model. Locally, KoboldCpp or LM Studio run abliterated models. Hosted, {{appName}} offers {{uncensored}} uncensored models after a one-time 18+ confirmation. Janitor AI and Chub allow adult roleplay on their own terms.",
    },
    privacy: {
      q: "Is a hosted alternative as private as SillyTavern?",
      a: "Not quite. A local model keeps everything on your machine. A hosted model always sees the prompt it answers. {{appName}} incognito keeps the history in your browser instead of on a server.",
    },
    move: {
      q: "Can I use SillyTavern on iPhone?",
      a: "Not directly. You host it on a PC or server and open it in Safari, which means remote-access setup. A web app such as {{appName}} or Janitor AI works on iPhone without that step.",
    },
  },
  cta: {
    title: "Skip the setup. Keep the story.",
    subtitle:
      "{{guestCredits}} free credits a month, no account and no API key needed.",
    start: "Start a roleplay",
    chat: "Open an incognito chat",
  },
};
