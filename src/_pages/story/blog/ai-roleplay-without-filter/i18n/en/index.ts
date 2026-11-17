export const translations = {
  meta: {
    title: "AI Roleplay Without Filter: Character.AI Alternative",
    description:
      "Unfiltered AI roleplay on uncensored models. Dark scenes stay dark, characters stay in character. Memory, privacy, price per reply. Free to start, no account.",
    category: "Guide",
    imageAlt: "{{appName}}: AI roleplay without a filter",
    keywords:
      "AI roleplay without filter, Character AI alternative, Character AI alternative without filter, uncensored AI roleplay, unfiltered AI chat, NSFW AI roleplay, dark roleplay AI, AI roleplay no restrictions, AI character chat uncensored, UncensoredLM, Venice Role Play, Artemis 31B, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Guide",
    readTime: "8 min read",
    title: "AI roleplay without a filter. The story goes where you take it.",
    subtitle:
      "{{uncensoredCount}} uncensored roleplay models next to the mainstream ones, on one balance on {{appName}}. Which model holds a character, which remembers the whole campaign, what a reply costs.",
  },
  intro: {
    lead: "The scene was building. Then your character stepped out of the story to tell you it cannot continue. A villain who suddenly apologizes. A horror scene that turns into a safety notice. A romance that fades to black every single time. On Character.AI and most chatbots, the filter writes the last line, not you.",
    p2: "This guide shows what unfiltered AI roleplay looks like on {{appName}}: {{modelCount}} roleplay models side by side, which one fits dark fiction, long campaigns or a tight budget, how memory works, how to set up a character in two minutes, and what it costs per reply.",
  },
  exists: {
    title: "Is there a Character.AI without a filter?",
    p1: "Not from Character.AI. It runs one content filter for every user, with no setting to turn it off and no paid tier that removes it. Jailbreak prompts are a fight you keep losing.",
    p2: "The real alternative is a different model. {{appName}} runs uncensored models built for fiction: no refusals, no moral asides, no character breaking to lecture you. You pick the model per message, and you can switch mid-scene.",
    consent:
      "Uncensored models are for adults. The first time you use one, you confirm you are 18 or older. Once. Then you decide what your story contains, not a corporation.",
  },
  levels: {
    title: 'What "no filter" means in roleplay',
    intro: "Every model carries one of three content levels.",
    mainstream:
      "Mainstream: Claude, GPT, Gemini. Great writers, strict filters. Violence gets softened, intimacy fades to black, dark themes get a disclaimer.",
    open: "Open: Kimi, MiniMax, DeepSeek, GLM. Light filters. Most mature scenes work, the darkest ones get toned down.",
    uncensored:
      "Uncensored: no filter. Explicit, violent, taboo: the scene plays out as written.",
    twoKinds:
      "Uncensored comes in two kinds. Most uncensored models are mainstream models with the refusals cut out, by abliteration or a decensoring fine-tune. They stop saying no, but keep their base model's worldview, so a dark scene can still drift somewhere tamer. {{ownName}} is the other kind: trained on books and documents banned from the mainstream internet. Its own worldview, nothing nudging the story back to safe ground.",
  },
  table: {
    title: "The roleplay models, side by side",
    intro:
      "Live from our model registry. Memory is the context window: how much of the story the model reads before each reply. 1 credit = {{creditValue}}.",
    colModel: "Model",
    colFilter: "Filter level",
    colMemory: "Memory",
    colImages: "Reads images",
    colPrice: "Price per reply",
    memory: "{{context}} tokens, about {{pages}} pages",
    yes: "Yes",
    no: "No",
    credits: "{{credits}} credits",
    footnote:
      "Price per reply assumes a long scene: a large chunk of story in, a full reply out. Short exchanges cost less. Prices include our markup and come from the cheapest provider for each model.",
  },
  models: {
    uncensoredLm: "Dark and taboo, its own worldview",
    artemis: "Roleplay finetune, long memory, cheap",
    veniceRoleplay: "Tuned to hold a character's voice",
    deepseekFlash: "Smart plots, huge memory",
    glmFlash: "Fast and cheap, reads images",
    venice: "Cheap all-rounder",
    minimaxFlash: "Cheapest, open filter",
    kimi: "Rich characters, light filter",
    sonnet: "Top prose, mainstream filter",
  },
  picks: {
    title: "Which model for which story",
    intro: "Start from the scene you want to write.",
    dark: {
      title: "Dark, taboo and explicit",
      body: "{{ownName}} leads here: no softened scenes, no sudden moral aside. Its limit is memory: {{ownContext}} tokens, about {{ownPages}} pages, so long campaigns lose their early chapters. Artemis is a roleplay finetune that writes grimdark and explicit scenes straight, with far more memory.",
    },
    long: {
      title: "Long campaigns",
      body: "When the story runs for weeks. These keep early scenes in reach. DeepSeek V4.1 Flash Uncensored adds real reasoning for plots with moving parts. {{roleplayName}} holds a character's voice across {{roleplayContext}} tokens.",
    },
    cheap: {
      title: "Cheap, for volume",
      body: "Daily chats with a companion, quick scenes, lots of rerolls. {{cheapestName}} is the cheapest reply here, on an open filter. The other two are uncensored.",
    },
    filtered: {
      title: "Rich characters, filter is fine",
      body: "Slow-burn drama, political intrigue, a mystery with clues that add up. The strongest writers keep their filters, so they soften the darkest beats. Use them when the story does not need to go there.",
    },
    compareLink: "Compare {{a}} with {{b}}",
  },
  memory: {
    title: "Does the AI remember my character?",
    intro: "Two kinds of memory. Both matter for roleplay.",
    p1: "The context window is the short-term memory: everything the model rereads before it answers. {{longestName}} holds {{longestContext}} tokens, about {{longestPages}} pages of story. {{ownName}} holds {{ownContext}}, about {{ownPages}} pages. When a thread outgrows the window, the oldest scenes drop out. Pin the essentials (names, relationships, the rules of your world) in the character description so they never fall off.",
    p2: "Long-term memory is separate: facts the AI saves about you and recalls in new threads. It needs a free account and the private folder. Incognito chats never save memories.",
  },
  setup: {
    title: "Set up a character in two minutes",
    intro:
      "No character marketplace, no hunting for the right bot. Build your own.",
    steps: {
      skill: {
        title: "Open the Roleplay skill",
        body: "It tells the model to stay in character, keep the voice consistent, never control your character and skip the content warnings.",
      },
      variant: {
        title: "Pick a variant",
        body: "Uncensored runs {{uncensored}} for dark and taboo scenes. Creative runs {{creative}}, the cheapest. Deep runs {{deep}} for rich inner lives across long campaigns.",
      },
      character: {
        title: "Describe the character and the scene",
        body: "Name, personality, how they talk, what they want, where the story starts. Say whether you write in first or third person. Then make your first move.",
      },
      switch: {
        title: "Switch models mid-scene",
        body: "A model refuses or goes flat? Pick another one and send the next message. The thread keeps its history and the new model reads all of it.",
      },
      art: {
        title: "Add character art",
        body: "Ask for a portrait in the same chat. The image generator runs on the same balance, uncensored image models included.",
      },
    },
    skillLink: "Open the Roleplay skill",
    imageLink: "Compare the uncensored image generators",
  },
  privacy: {
    title: "Is my roleplay private?",
    intro: "Depends on the folder. Here is exactly what happens.",
    incognito:
      "Incognito chats live in your browser's local storage, not on our servers. Clear your browser data and they are gone.",
    transit:
      "Each message still passes through our server to the model provider that writes the reply. Every hosted AI works that way. Credit usage is recorded for billing.",
    private:
      "Private chats are saved on the server and visible only to your account, on any device you log in on.",
    callout:
      "Short version: incognito keeps your story off our servers. It does not hide it from the model that writes the replies.",
  },
  pricing: {
    title: "What unfiltered roleplay costs",
    intro: "Credits per reply. One balance for every model.",
    perReply:
      "Each reply costs credits based on the model and the length of the scene. The table shows a long scene. 1 credit = {{creditValue}}.",
    cheapest:
      "Cheapest reply: {{cheapestName}} at {{cheapestPrice}}, about {{cheapestPerUnit}} replies per {{unit}}. Cheapest uncensored: {{uncensoredName}} at {{uncensoredPrice}}, about {{uncensoredPerUnit}} replies per {{unit}}.",
    free: "Free: {{guestCredits}} credits a month without an account, {{freeCredits}} with a free account. Enough for a long first campaign on a cheap model.",
    sub: "Monthly plans: four sizes, starting at {{subCredits}} credits for {{subPrice}}.",
    pack: "Credit packs: a top-up for subscribers, {{packCredits}} credits for {{packPrice}}. They never expire. Card, PayPal or crypto.",
    link: "See plans and credit packs",
  },
  characterAi: {
    title: "When Character.AI is the better pick",
    intro: "Sometimes. Here is when.",
    library:
      "You want to browse thousands of ready-made community characters. Here you build your own, or start from a skill.",
    flatRate:
      "You want a flat fee and never want to think about cost per reply. Credits are metered, and long scenes on premium models add up.",
    wantFilter:
      "You want the filter. For a younger user or a shared family device, a locked-down app fits better.",
    callout:
      "Unfiltered means no safety net. What you write and publish is on you, and the law where you live still applies.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Is there an AI roleplay chat without a filter?",
      a: "Yes. {{appName}} runs uncensored models built for fiction: {{ownName}}, Artemis, Venice Role Play and more. No refusals, no lectures, no character breaking. A one-time 18+ confirmation unlocks them.",
    },
    free: {
      q: "Is unfiltered AI roleplay free?",
      a: "You can start free: {{guestCredits}} credits a month without an account, {{freeCredits}} with a free account. A reply on {{uncensoredName}} costs about {{uncensoredCredits}} credits in a long scene. After that: a plan, from {{subPrice}} a month.",
    },
    nsfw: {
      q: "Can I do NSFW roleplay?",
      a: "Yes, on the uncensored models, as an adult who confirmed it once. Fiction between adults is your business. Sexual content involving minors is illegal and stays illegal.",
    },
    memory: {
      q: "How long can a roleplay run before the AI forgets?",
      a: "Up to {{longestContext}} tokens on {{longestName}}, about {{longestPages}} pages. {{ownName}} holds about {{ownPages}} pages. Put the essentials in the character description so they stay in memory.",
    },
    private: {
      q: "Can anyone read my roleplay?",
      a: "Incognito chats stay in your browser. Private chats are visible only to your account. Messages still pass through to the model provider that writes the reply.",
    },
    account: {
      q: "Do I need an account?",
      a: "No. Incognito roleplay works without one. You need a free account for long-term memory and for chats saved across devices.",
    },
    guideLink: "Read the guide to every uncensored model",
    chatgptLink: "A ChatGPT alternative without filters",
  },
  partners: {
    body: "Run a roleplay community, a Discord or a channel about AI characters? The {{appName}} partner program pays a recurring share of every payment you refer.",
    link: "See the partner program",
  },
  cta: {
    title: "Pick a character. Write the scene.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Uncensored, open or mainstream: switch any time.",
    start: "Start a roleplay",
    models: "Compare all models",
  },
};
