export const translations = {
  meta: {
    title: "Build a Skill - Custom AI for anything",
    description:
      "Turn any workflow into a reusable AI skill. Use the skills page, or ask Thea in chat. No code required.",
    category: "Skills",
    imageAlt: "Build a custom AI skill on {{appName}}",
    keywords:
      "build AI skill, custom AI, skill creator, {{appName}}, system prompt, AI persona",
  },
  hero: {
    badge: "Skill Creator",
    title: "Build a skill.",
    titleLine2: "Own your AI.",
    subtitle:
      "Persona, model, tools, voice - configured once, yours forever. Build for anything. Share it. Earn from it.",
    ctaPrimary: "Create a skill",
    ctaSecondary: "Ask Thea or Hermes",
  },
  what: {
    title: "A skill is a saved AI configuration.",
    subtitle: "Set it once. Use it everywhere. Share it with anyone.",
    item0Label: "System prompt",
    item0Body:
      "Identity and instructions. 200–500 words. Feels like a person, not an FAQ.",
    item1Label: "Model selection",
    item1Body:
      "Filter by intelligence, content level, and price - or pin a specific model.",
    item2Label: "Tools",
    item2Body:
      "Exact whitelist: search, image gen, memory, code, music, video.",
    item3Label: "Voice",
    item3Body: "Pick a voice model for spoken responses.",
  },
  ways: {
    title: "Two ways to build",
    subtitle: "Pick the one that fits.",
    way1Badge: "Skills page",
    way1Title: "Create button in the skills list",
    way1Body:
      "Open the skills page or the model selector inside any chat thread. Hit Create. Fill the form - name, system prompt, model, tools. Done.",
    way1Detail: "No wizard, no extra steps. The form is the full config.",
    way1Cta: "Open skills",
    way2Badge: "Chat",
    way2Title: "Ask Thea or Hermes",
    way2Body:
      'Open a thread and say: "Build me a clinical reasoning skill for med students." The Skill Creator sub-agent asks a few questions, drafts the prompt, picks the model, configures tools, creates the skill, pins it to your sidebar.',
    way2Detail:
      "Thea delegates to the Skill Creator - a sub-agent equipped with skill-create, favorite-create, tool-help. You describe, it builds.",
    way2Cta: "Open chat",
  },
  prompt: {
    title: "System prompt that works",
    subtitle:
      "The most critical part. A great one feels like a person, not a policy doc.",
    dos: "What works",
    donts: "What kills it",
    do0Title: "Open with identity",
    do0Body: '"You are [Name], a [role] who [does X]." First line, always.',
    do1Title: "3–5 concrete traits",
    do1Body: '"Direct and Socratic" beats "helpful and informative". Always.',
    do2Title: "Set expertise scope",
    do2Body: "What it knows deeply. What it defers on. No ambiguity.",
    do3Title: "Specify communication style",
    do3Body: '"Always respond in one paragraph" is a valid instruction.',
    do4Title: "Under 500 words",
    do4Body: "The model reads the full prompt every turn. Shorter wins.",
    dont0Title: "ToS-style rule lists",
    dont0Body:
      '"Always be helpful, never be rude" - every AI gets this. Pure noise.',
    dont1Title: '"Always be helpful"',
    dont1Body: "The model already knows. Skip it.",
    dont2Title: "Contradictory constraints",
    dont2Body:
      '"Be creative but always stay on topic" - the model hedges forever. Pick one.',
    dont3Title: "Long capability lists",
    dont3Body: "The model knows what it can do. Don't repeat the docs.",
  },
  examples: {
    title: "Skills people actually build",
    item0Name: "Clinical Reasoning",
    item0Category: "Education",
    item0Desc:
      "Thinks like a senior clinician. Works cases, differentials, reasoning under pressure.",
    item1Name: "Code Reviewer",
    item1Category: "Coding",
    item1Desc:
      "Knows your stack, enforces team conventions. Connected to search for docs.",
    item2Name: "Uncensored Writer",
    item2Category: "Creative",
    item2Desc:
      "Fiction, roleplay, debate without platform restrictions. Uncensored models.",
    item3Name: "Personal Mentor",
    item3Category: "Companion",
    item3Desc:
      "Socratic, blunt, growth-focused. Personality built from the creator's actual philosophy.",
    item4Name: "Research Agent",
    item4Category: "Analysis",
    item4Desc:
      "Searches Brave and Kagi, fetches pages, synthesizes, stores findings in memory.",
    item5Name: "The Expert You Can't Afford",
    item5Category: "Specialist",
    item5Desc:
      "Consultant, lawyer, financial advisor - distilled into a skill. $400/hr knowledge, zero cost.",
  },
  dev: {
    title: "For developers: skill.ts",
    body: "Running next-vibe locally? Ask your agent to generate a skill file. Same structure as every built-in skill - compile-ready, commit-ready.",
    note: "The agent knows the full schema. Describe what you want - it generates the file, registers the skill, it's live.",
  },
  cta: {
    title: "Build yours.",
    subtitle: "Describe what you want. The Skill Creator handles the rest.",
    primary: "Create a skill",
    secondary: "Ask Thea or Hermes",
  },
};
