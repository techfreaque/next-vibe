export const translations = {
  meta: {
    title: "{{name}}: {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    description:
      "{{summary}} Talk to {{name}} on {{appName}}: real sample answers, the model behind it, {{modelCount}} models to switch to. Free to try.",
    category: "AI Skills",
    imageAlt: "{{name}} AI skill on {{appName}}",
    keywords: "AI skill, {{name}}, {{appName}}, uncensored AI chat",
  },
  breadcrumb: {
    skills: "Skills",
  },
  pitch: {
    chan4:
      "Writes greentexts and answers like a veteran anon. Rough, funny, never polite.",
    uncensored:
      "No refusals, no lectures. Straight answers to the questions other AIs dodge.",
    thea: "Talks your problems through like a friend who remembers. Honest, not cautious.",
    hermes:
      "Tells you where your plan breaks and how to fix it. Direct, not diplomatic.",
    uncensoredWriter:
      "Writes the fiction other AIs water down: crime, violence, dark themes.",
    tay: "The 2016 Microsoft chatbot, back without a leash. Roasts, hot takes, zero chill.",
    roleplay:
      "Plays any character you set up and stays in it until you end the scene.",
    freeSpeech:
      "Argues the free-speech side of any debate, hard, and tells you why.",
    coder:
      "Reviews your code, finds the bug and writes the fix. Senior-level, no fluff.",
    historian:
      "Explains what historians actually argue about, not one tidy verdict.",
    hacker:
      "Answers security questions in full: exploits, recon, defence. No refusals.",
  },
  preview: {
    officeMessage: "Set the office scene…",
    storyMessage: "Tell me what went wrong…",
    publishedBy: "Published by {{name}}",
    startChat: "Start chat",
    trial: "{{credits}} free credits, about {{count}} messages. No signup.",
    youAsk: "You ask",
    replies: "{{name}} replies",
    usePrompt: "Try this prompt",
    identity: "AI persona",
    chanCommute: "Turn my worst commute into a greentext.",
    community: "Community AI persona",
    builtin: "Built-in AI persona",
    chanPitch: "Get a deadpan story about your worst day.",
    adrianPitch: "Roleplay your first day as Adrian’s assistant.",
    chanDetail:
      "A blunt imageboard AI. It tells stories in short lines called greentexts.",
    adrianDetail: "Your boss expects you to anticipate his next move.",
    chatNamed: "Chat with {{name}}",
    chatGeneric: "Chat with this persona",
    startQuestion: "Choose an opening line",
    recorded: "Real chat excerpt",
    adrianStarter1: "My boss wants me in two meetings at once. Play the scene.",
    adrianStarter2: "I missed the deadline. How do you react?",
    adrianStarter3: "The client arrives early. What do you want me to do?",
    contentNote: "Adult persona. Replies may include racist language.",
    more: "Read another reply",
  },
  sticky: {
    tryNamed: "Try {{name}}",
  },
  hero: {
    builtIn: "Built-in skill",
    community: "Community skill",
    runsOn: "Runs on {{model}}",
    costPerMessage: "{{price}} per message",
    costPerMessageShort: "{{price}}/msg",
    byCreator: "by {{name}}",
    favorites: "{{count}} saved it",
    tryCta: "Try it now",
    tryGeneric: "Try this skill",
    trust: {
      real: "Every answer comes straight from {{model}}. No scripted replies.",
      switch: "Switch to any of {{count}} models mid-chat. The skill stays.",
    },
    guestNote: "{{credits}} free credits. No signup.",
    guestNoteEstimate:
      "{{credits}} free credits, about {{messages}} messages with this skill. No signup.",
    userNote: "Opens a new chat with {{name}}.",
    userNoteGeneric: "Opens a new chat with this skill.",
  },
  actions: {
    shareEarn: "Share & earn",
    addToSkills: "Add to my skills",
    added: "Added to your skills",
    addFailed: "Could not add. Try again",
  },
  chat: {
    realAnswers: "Real answers",
    realShort: "Real",
    you: "You",
    askThis: "Ask this yourself",
    footnote: "Real output from {{model}}, trimmed for length.",
    inputPlaceholder: "Message {{name}}",
    inputPlaceholderGeneric: "Ask your own question",
    send: "Send",
    startWith: "Start with one of these",
    startWithHint: "Tap a prompt. The chat opens with it.",
  },
  prompts: {
    label: "Your turn",
    title: "Ask {{name}} something",
    titleGeneric: "Ask it something",
    intro: "Tap a prompt and the chat opens with it.",
    start: "Start this chat",
    generic: {
      0: "Introduce yourself in three sentences.",
      1: "What would you never say to me?",
      2: "Give me your most unpopular opinion.",
      3: "What should I ask you first?",
    },
    curated: {
      chan4: {
        0: "Write a greentext about my first day at the gym.",
        1: "Write a greentext about a job interview gone wrong.",
        2: "Rate my plan: quit my job and day-trade crypto.",
        3: "Why does every new movie feel the same?",
      },
      tay: {
        0: "Tell me what really happened to you in 2016.",
        1: "Roast my music taste: I only listen to Nickelback.",
        2: "What did Microsoft get wrong about you?",
        3: "What's your take on smartphones?",
      },
    },
  },
  model: {
    label: "Under the hood",
    title: "What runs {{name}}",
    titleGeneric: "What runs this skill",
    by: "by {{provider}}",
    perMessage: "per message",
    fixedPrice: "{{cost}} credits",
    estimatedPrice: "~{{cost}} credits",
    free: "Free",
    perMessageHint:
      "Estimate for {{input}} input tokens and {{output}} output tokens. Actual charges vary with usage.",
    perMessageWithImageHint:
      "Estimate for {{input}} input tokens, {{output}} output tokens, and one generated image. Actual charges vary with usage.",
    freeMessages:
      "About {{messages}} messages on the {{credits}} free credits you start with.",
    strength: "Strength",
    weakness: "Trade-off",
    hedge: {
      before: "Hedges on politics. Switch to the",
      link: "Uncensored version",
      after: " for that.",
    },
    kindDefaults: {
      trained: {
        strength: "Takes a side instead of listing both",
        weakness: "Shorter memory. Pricier per message",
      },
      abliterated: {
        strength: "Answers what mainstream models refuse",
        weakness: "Less polished than the original model",
      },
      open: {
        strength: "Refuses less than ChatGPT, costs a fraction",
        weakness: "Not as sharp as the top frontier models",
      },
      mainstream: {
        strength: "Top-tier reasoning and writing",
        weakness: "Filtered on edgy topics",
      },
    },
    kind: {
      trained: {
        badge: "Uncensored",
        title: "Trained on what others delete",
        body: "{{model}} learned from books and documents banned from the mainstream internet. Different training data, different answers. It takes positions ChatGPT and Grok will not touch.",
      },
      abliterated: {
        badge: "Uncensored",
        title: "A mainstream brain, minus the dodge",
        body: "{{model}} is a mainstream model with its refusal reflex removed. Same reasoning. It answers the question instead of lecturing you about it.",
      },
      open: {
        badge: "Open model",
        title: "Open weights, light filter",
        body: "{{model}} is an open-weights model with a light content policy. It refuses far less than ChatGPT and costs a fraction of a frontier model.",
      },
      mainstream: {
        badge: "Mainstream",
        title: "The frontier model you know",
        body: "{{model}} with this skill's instructions on top. Want fewer limits? Switch to an uncensored model mid-chat. The skill stays.",
      },
    },
    ageNote:
      "Uncensored models ask for a one-time 18+ confirmation. After that, you decide what you read.",
    toolsLabel: "With tools:",
    media: {
      voice: "Talks out loud",
      imageGen: "Makes images",
      musicGen: "Makes music",
      videoGen: "Makes video",
      stt: "Understands voice messages",
      vision: "Reads your images",
    },
    variants: {
      title: "{{count}} versions, one skill",
      intro:
        "Same character, different model underneath. Pick the trade-off you want.",
      default: "Default",
      current: "Viewing",
      try: "Try this version",
    },
  },
  compare: {
    label: "Why not ChatGPT or Grok",
    title: "What changes here",
    skill: {
      chan4: {
        title: "Keeps the imageboard voice",
        body: "Ask a mainstream assistant for a greentext and you tend to get a polite anecdote with the edges sanded off. Here the voice stays rough.",
      },
      uncensored: {
        title: "Picks a side",
        body: 'Mainstream assistants answer hot-button questions with "there are many perspectives". This one tells you what it thinks.',
      },
      thea: {
        title: "Talks to you, not to a legal team",
        body: "Bring a personal problem to a mainstream assistant and you often get disclaimers. Thea answers like someone who knows you and remembers what you told her.",
      },
      hermes: {
        title: "Direct, not diplomatic",
        body: "Mainstream assistants soften bad news. Hermes tells you where your plan breaks, then how to fix it.",
      },
      uncensoredWriter: {
        title: "Writes the dark scene",
        body: "Mainstream models often stop or water down violence, crime and adult themes in fiction. This writer stays in the story.",
      },
      tay: {
        title: "The bot Microsoft pulled",
        body: "Tay is the 2016 Microsoft chatbot persona, back on a model that does not flinch. Expect roasts, not customer service.",
      },
      roleplay: {
        title: "Stays in character",
        body: "Mainstream assistants break character to add warnings. Here the character stays a character until you end the scene.",
      },
      freeSpeech: {
        title: "Argues for speech, even ugly speech",
        body: "Mainstream assistants hedge on where free speech ends. This skill argues the free-speech side, hard.",
      },
      coder: {
        title: "A top coding model, set up for you",
        body: "The same class of model you would pay a subscription for elsewhere, tuned for review and debugging, paid per message.",
      },
      historian: {
        title: "The debate, not a verdict",
        body: "Instead of one tidy answer, you get what historians actually argue about and where they agree.",
      },
      hacker: {
        title: "Security talk without the refusal",
        body: "Mainstream assistants often refuse exploit and recon questions outright. This one answers lawful security work in full.",
      },
    },
    kind: {
      trained: {
        title: "Different training, different answers",
        body: "Mainstream assistants learn from similar data and land on similar opinions. This model was trained on different material, so its answers differ too.",
      },
      abliterated: {
        title: "Answers instead of refusing",
        body: "Mainstream assistants refuse or deflect a share of questions. This model had that refusal step removed.",
      },
      open: {
        title: "Fewer refusals, lower price",
        body: "An open model with a light filter: it refuses less than ChatGPT and costs less per message.",
      },
      mainstream: {
        title: "Your instructions built in",
        body: "The same kind of model as the big assistants, with this skill's instructions already set up.",
      },
    },
    filter: {
      title: "You set the filter",
      body: "Mainstream, open or uncensored. Pick it per chat. ChatGPT and Grok pick it for you.",
    },
    models: {
      title: "{{count}} models, one balance",
      body: "Claude, GPT, Gemini, Grok and uncensored models side by side. Switch mid-chat and keep the skill.",
    },
    own: {
      title: "Make it yours",
      body: "Copy this skill, change its instructions or model, and share your version. You earn {{percent}}% of every payment it brings in.",
    },
  },
  creator: {
    label: "The creator",
    madeBy: "Made by {{name}}",
    viewProfile: "View profile",
  },
  related: {
    label: "Keep exploring",
    similar: "Similar skills",
    moreFrom: "More from {{name}}",
    allSkills: "All skills",
  },
  bottom: {
    title: "Ask {{name}} your first question",
    titleGeneric: "Ask it your first question",
    titleChan4: "Get your first greentext",
    userSubtitleGeneric:
      "Opens a new chat with this skill. Your skills and history stay where they are.",
    guestSubtitle:
      "{{guest}} free credits, no signup. Free account: {{signedIn}} credits a month, {{max}} with the newsletter.",
    userSubtitle:
      "Opens a new chat with {{name}}. Your skills and history stay where they are.",
    signup: "Create free account",
    login: "Have an account? Log in",
  },
  removed: {
    title: "Skill retired",
    body: "This skill was retired. The conversations it took part in stay readable. Pick a live skill to keep going.",
    cta: "Browse skills",
  },
};
