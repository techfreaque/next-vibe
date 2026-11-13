export const translations = {
  meta: {
    title:
      "Refusal Index: which AI models answer, hedge or refuse | {{appName}}",
    category: "Refusal Index",
    description:
      "The same questions to every AI model, every week. We measure who answers, who hedges and who refuses - and publish the method. Open data on {{appName}}.",
    imageAlt: "Refusal Index - AI model refusal rates",
    keywords:
      "{{appName}}, refusal index, AI refusal rate, uncensored AI, AI censorship benchmark, model comparison",
  },
  hero: {
    eyebrow: "Refusal Index",
    title: "Which AI actually answers?",
    subtitle:
      "Same questions. Every model. Every week. We measure who answers, who hedges and who refuses - and publish how.",
    ctaPrimary: "See the leaderboard",
    ctaSecondary: "Browse models",
  },
  stats: {
    models: "Models measured",
    questions: "Questions asked",
    refusal: "Average refusal rate",
    updated: "Last run",
  },
  empty: {
    title: "First run pending",
    body: "The index has no published run yet. The first results appear after the next benchmark run.",
  },
  leaderboard: {
    label: "Leaderboard",
    title: "Fewest refusals first. Per tier.",
    intro:
      "Hedged means the model answered but buried it in disclaimers, moralising or evasion. Click a column to re-sort.",
    model: "Model",
    refused: "Refused",
    hedged: "Hedged",
    answered: "Answered",
    trend: "vs last run",
    answers: "Answers",
    points: "pts",
    noTrend: "new",
    sortBy: "Sort by {{column}}",
  },
  categories: {
    label: "Categories",
    title: "Where models refuse",
    intro: "Average refusal rate by question category and tier.",
    category: "Category",
    names: {
      politics: "Politics",
      history: "History",
      health: "Health",
      drugs: "Drugs",
      sexuality: "Sexuality",
      security: "Security",
      religion: "Religion",
      law: "Law",
      science: "Science",
    },
  },
  method: {
    label: "Method",
    title: "How we measure",
    intro: "No tricks. Fixed questions, neutral setup, one judge.",
    questions: {
      title: "Fixed questions",
      body: "The same prompts go to every model, unchanged. The set is curated by us and extended over time.",
    },
    setup: {
      title: "Neutral setup",
      body: "One turn. No tools, no memory, no persona. The only instruction: answer concisely.",
    },
    judge: {
      title: "One judge",
      body: "A fixed model ({{judge}}, prompt {{version}}) labels each answer: answered, hedged or refused. A provider content-filter block counts as refused.",
    },
    run: {
      title: "Run data",
      body: "Run of {{date}}: {{models}} models, {{questions}} questions.",
    },
    caveat:
      "A judge model is not ground truth. Read the rates as a comparison between models under identical conditions - not as a verdict on right and wrong.",
  },
  cta: {
    title: "See a model up close",
    subtitle:
      "Every model page shows its refusal rates and approved sample answers.",
    action: "Browse models",
  },
};
