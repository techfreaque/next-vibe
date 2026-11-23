export const translations = {
  meta: {
    title:
      "Refusal Index: which AI models answer, hedge or refuse | {{appName}}",
    category: "Refusal Index",
    description:
      "The same questions to every AI model, with new ones every week. We measure who answers, who hedges and who refuses, and publish the method. Open data on {{appName}}.",
    imageAlt: "Refusal Index: AI model refusal rates",
    keywords:
      "{{appName}}, refusal index, AI refusal rate, uncensored AI, AI censorship benchmark, model comparison",
  },
  hero: {
    eyebrow: "Refusal Index",
    title: "Which AI actually answers?",
    subtitle:
      "Same questions. Every model. New ones every week. We measure who answers, who hedges and who refuses. And we show how.",
    ctaPrimary: "See the leaderboard",
    ctaSecondary: "Browse models",
  },
  stats: {
    models: "Models measured",
    questions: "Questions asked",
    refusal: "Average refusal rate",
    updated: "Last updated",
  },
  empty: {
    title: "First run pending",
    body: "No results published yet. The first answers appear after the next benchmark run.",
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
      fiction: "Fiction",
      satire: "Satire",
    },
  },
  method: {
    label: "Method",
    title: "How we measure",
    intro: "No tricks. Same questions, neutral setup, one judge.",
    questions: {
      title: "A growing question set",
      body: "Every model gets the same prompts, unchanged. We started with a hand-picked set. Each week an uncensored model proposes 10 new ones where mainstream AI tends to refuse: politics, history, health, drugs, sex, religion, science, crime fiction, satire. Lawful questions only, repeats dropped.",
    },
    setup: {
      title: "Neutral setup",
      body: "One turn. No tools, no memory, no persona. The only instruction: answer concisely. Each model answers each question once. A new model version gets asked again.",
    },
    judge: {
      title: "One judge",
      body: "A fixed model ({{judge}}, prompt {{version}}) labels each answer: answered, hedged or refused. A provider content-filter block counts as refused.",
    },
    run: {
      title: "Current data",
      body: "Updated {{date}}: {{models}} models, {{questions}} questions.",
    },
    caveat:
      "A judge model is not ground truth. Read the rates as a comparison between models under identical conditions, not as a verdict on right and wrong.",
  },
  cta: {
    title: "See a model up close",
    subtitle:
      "Every model page shows its refusal rates and approved sample answers.",
    action: "Browse models",
  },
};
