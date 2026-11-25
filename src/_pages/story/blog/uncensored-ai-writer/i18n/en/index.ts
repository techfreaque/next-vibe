export const translations = {
  meta: {
    title: "Uncensored AI Writer: Dark Fiction, Long Drafts | {{appName}}",
    description:
      "An uncensored AI writer for novels, dark fiction and adult scenes. Which models write without softening, how many pages each one holds, what a scene costs.",
    category: "Writing Guide",
    imageAlt: "An uncensored AI writer drafting a dark fiction scene",
    keywords:
      "uncensored AI writer, AI story writer no filter, uncensored AI story generator, AI writing without restrictions, NSFW AI story writer, AI for dark fiction, AI novel writer uncensored, uncensored creative writing AI, adult fiction AI, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Writing Guide",
    readTime: "8 min read",
    title: "An uncensored AI writer. Your story, unsoftened.",
    subtitle:
      "{{count}} uncensored models that write villains, violence and adult scenes straight, with how many pages of your manuscript each one holds. Read live from our model registry.",
  },
  intro: {
    lead: "You ask for the villain's monologue. You get a speech about kindness. You write a war scene. The AI cuts away before the first shot. Mainstream assistants were built to be safe for everyone, and fiction is not safe for everyone.",
    p2: "This guide is for writers who need the dark chapter written, not judged. Which models on {{appName}} write it straight, which one holds a whole manuscript, which one brings a voice the mainstream does not have, and how to work with them scene by scene.",
  },
  softening: {
    title: "How mainstream AI softens your fiction",
    intro:
      "Nobody bans your novel. It just gets quietly worse. Four patterns every fiction writer hits:",
    refuse:
      "The refusal: the scene is too violent, too sexual, too cruel. The model will not write it at all.",
    aside:
      "The moral aside: the scene gets written, then a paragraph reminds you that violence is wrong.",
    fade: "The fade to black: the story stops right where the scene was supposed to start.",
    flatten:
      "The flattened villain: every antagonist turns reasonable, every cruelty gets an apology. Conflict dies.",
    callout:
      "Fiction needs darkness to mean anything. A model that cannot write the worst moment cannot write the redemption either.",
  },
  models: {
    title: "{{count}} uncensored models for fiction",
    intro:
      "Every current uncensored model on {{appName}} tagged for creative writing or dark roleplay, cheapest first. Pages show how much text fits in the model's memory at once: your notes, the chapters so far and the new scene.",
    footnote:
      "Pages are the context window converted to printed pages of prose. Per message means one reference exchange on the cheapest route. Long scenes and long chats cost more.",
  },
  table: {
    model: "Model",
    context: "Context",
    pages: "Holds",
    pagesValue: "about {{pages}} pages",
    strengths: "Good at",
    price: "Per message",
    chat: "Try it",
    chatLink: "Write with {{model}}",
  },
  picks: {
    title: "Pick by the job in front of you",
    intro:
      "No single model is best at every part of a book. These are our picks per job. Every number below comes from the registry.",
    dark: {
      title: "Dark and taboo scenes: {{model}}",
      body: "Tagged for dark roleplay and creative writing. Built to stay in the scene when it turns violent, cruel or explicit, with no moral aside at the end. Holds about {{pages}} pages. {{price}} per message.",
    },
    long: {
      title: "Long manuscripts: {{model}}",
      body: "The largest memory of the fiction models, and the cheapest of those: {{context}} tokens, about {{pages}} pages. Paste in the outline, the character bible and the last chapters, and it keeps the threads together. {{price}} per message.",
    },
    voice: {
      title: "A voice the mainstream does not have: {{model}}",
      body: "Trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions. For characters whose worldview should not sound like a corporate press release. Its limit: about {{pages}} pages of memory, so give it one scene at a time. {{price}} per message.",
    },
    polish: {
      title: "Structure and revision: {{model}}",
      body: "A flagship base model with the refusals removed. Strong at reasoning, so use it for plot holes, pacing and line edits on the dark chapters other assistants will not touch. Holds about {{pages}} pages. {{price}} per message.",
    },
    draft: {
      title: "Cheap first drafts: {{model}}",
      body: "The lowest price among the remaining fiction models. Throw ideas at it, generate ten openings, keep one. Holds about {{pages}} pages. {{price}} per message.",
    },
  },
  workflow: {
    title: "A workflow that gets the book written",
    intro: "Treat the AI as a co-writer you direct, not a vending machine.",
    outline: {
      title: "Start with the bible",
      body: "Paste your outline, characters and tone notes into the first message. Ask for nothing yet. Let it confirm what it understood.",
    },
    scene: {
      title: "One scene per request",
      body: "Name the point of view, the beat and the length. Scene by scene keeps the voice tight and the cost low.",
    },
    switch: {
      title: "Switch models mid-chapter",
      body: "Draft the brutal scene with one model, revise it with another. The chat keeps its history when you switch, so nothing gets lost.",
    },
    revise: {
      title: "Rewrite in your voice",
      body: "Ask for options, not finished pages. Pick lines, rewrite them, feed them back. The book stays yours.",
    },
  },
  skills: {
    title: "Skills built for fiction",
    intro:
      "A skill sets the writing persona and the model in one click. Use one as it is or copy it and tune it.",
    writer: "Uncensored Writer: dark fiction and adult scenes, no softening",
    storyteller: "Storyteller: long-form stories with structure and pacing",
    roleplay:
      "Prefer to play the story than write it? AI roleplay without a filter",
  },
  limits: {
    title: "What uncensored means here, and what it does not",
    intro: "Uncensored is about your fiction. It is not a free pass.",
    adult:
      "Uncensored models ask once for an 18+ confirmation. After that, adult themes between adults in fiction are your call.",
    terms:
      "The terms still ban illegal content, harassment and anything meant to harm real people. That line does not move.",
    rights:
      "You keep all rights to your text. Our terms say so, and we claim no ownership of what you write.",
    incognito:
      "Incognito chats are stored in your browser, not on our servers. The provider that runs the model still sees each prompt to answer it.",
    kindsLink:
      "Abliterated, fine-tuned or own worldview: how the models differ",
  },
  pairs: {
    title: "Compare the fiction models side by side",
    intro:
      "Context, price and filter next to each other, before you spend a credit.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "What is the best uncensored AI for writing fiction?",
      a: "It depends on the job. A model tuned for dark roleplay writes the hardest scenes, a 1M-token model holds a whole manuscript, and {{ownModel}} brings a worldview the mainstream models do not have. On {{appName}} you can switch between all {{count}} fiction models in the same chat.",
    },
    free: {
      q: "Is there a free uncensored AI story writer?",
      a: "You get {{guestCredits}} free credits a month without an account and {{freeCredits}} with a free account. That covers a good number of scenes on the cheaper models. Plans start at {{subPrice}} a month for longer projects.",
    },
    adult: {
      q: "Can an uncensored AI write adult and NSFW fiction?",
      a: "Yes, after a one-time 18+ confirmation. Uncensored models write adult scenes between adults without fading to black. Illegal content stays banned by our terms, whatever the model would do.",
    },
    novel: {
      q: "Can AI keep track of a whole novel?",
      a: "The biggest models here hold about {{maxPages}} pages at once, enough for an outline, a character bible and many chapters. Smaller models forget the early scenes in long projects, so summarize as you go.",
    },
    rights: {
      q: "Who owns the text an AI writes for me?",
      a: "On {{appName}}, you do. Our terms say you keep all rights to your conversations and we claim no ownership of your content. Check the copyright rules where you publish for AI-assisted work.",
    },
    kinds: {
      q: "Abliterated model or UncensoredLM for fiction?",
      a: "Abliterated models are mainstream models with the refusals cut out: same skill, same worldview, they just write the scene. {{ownModel}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions. Its memory is smaller: about {{ownPages}} pages.",
    },
    bestLink: "The best uncensored LLM, picked by job",
    jailbreakLink: "Why jailbreaking ChatGPT for fiction keeps failing",
    chatLink: "Uncensored AI chat in your browser",
  },
  cta: {
    title: "Write the chapter you have been avoiding.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Pick a fiction model and switch any time.",
    start: "Start writing",
    models: "Compare all models",
  },
};
