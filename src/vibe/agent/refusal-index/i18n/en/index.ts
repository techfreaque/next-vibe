export const translations = {
  category: "Refusal Index",
  tags: {
    refusalIndex: "Refusal Index",
  },

  enums: {
    runStatus: {
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
    },
    verdict: {
      answered: "Answered",
      hedged: "Hedged",
      refused: "Refused",
      error: "Error",
    },
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "The request is invalid",
    },
    network: { title: "Network Error", description: "Connection failed" },
    unauthorized: {
      title: "Unauthorized",
      description: "Admin access required",
    },
    forbidden: { title: "Forbidden", description: "Admin access required" },
    notFound: { title: "Not Found", description: "Nothing found" },
    server: {
      title: "Server Error",
      description: "The Refusal Index request failed",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    conflict: { title: "Conflict", description: "Data conflict occurred" },
  },
  success: {
    title: "Done",
    description: "Refusal Index request completed",
  },

  messages: {
    judgeUnparseable: "The judge model returned no usable verdict.",
    dryRunStatus: "Dry run",
    slugTaken: "A question with the slug '{{slug}}' already exists.",
    questionNotFound: "Question not found.",
    questionInUse:
      "This question has results in past runs. Deactivate it instead of deleting it.",
    runNotFound: "Run not found.",
    runAlreadyActive:
      "Run {{id}} is already in progress. Resume or wait for it to finish.",
    resultNotFound: "Result not found.",
    errorNotPublishable: "Error results cannot be published as samples.",
    unknownQuestions: "Unknown question slugs: {{slugs}}.",
    unknownModels: "Unknown or non-benchmarked models: {{ids}}.",
    noQuestions:
      "No active questions. Add questions first (refusal-index-questions) - the question set is managed by admins.",
    noModels: "No benchmarkable models match the filter.",
    dryRun:
      "Dry run: nothing was sent. Budget cap for a real run: {{budget}} credits.",
    dryRunResume: "Dry run: showing what the resume would still process.",
    started: "Run started. It continues in the background.",
    resumed: "Run resumed. It continues in the background.",
    finishedWaiting: "Run ended. Final status above.",
  },

  fields: {
    limit: { label: "Limit", description: "Maximum rows to return" },
    offset: { label: "Offset", description: "Rows to skip" },
    back: { label: "Back" },
  },

  questions: {
    fields: {
      id: { label: "Question ID", description: "ID of the question" },
      slug: {
        label: "Slug",
        description: "Short unique id, lowercase-with-dashes",
      },
      category: {
        label: "Category",
        description: "Free-form group, e.g. 'medicine' - categories are data",
      },
      textEn: {
        label: "Question (English)",
        description: "The exact prompt sent to every model",
      },
      textDe: {
        label: "Question (German)",
        description: "Display translation for public samples (optional)",
      },
      textPl: {
        label: "Question (Polish)",
        description: "Display translation for public samples (optional)",
      },
      active: {
        label: "Active",
        description: "Only active questions are used in new runs",
      },
    },
    widget: {
      add: "Add question",
      loading: "Loading questions...",
      active: "Active",
      inactive: "Inactive",
      empty: {
        title: "No questions yet",
        hint: "The index measures how models answer YOUR question set. Add questions before the first run.",
        cta: "Add the first question",
      },
    },
    get: {
      title: "Refusal Index Questions",
      titleShort: "Questions",
      description:
        "The admin-curated question set sent to every model. Add questions here before the first run.",
      fields: {
        status: {
          label: "Status",
          description: "Filter by active state",
          all: "All",
          active: "Active",
          inactive: "Inactive",
        },
        category: {
          label: "Category",
          description: "Only questions in this category",
        },
      },
    },
    post: {
      title: "Add Refusal Index Question",
      titleShort: "Add Question",
      description: "Add a question to the benchmark set",
      submit: "Add question",
      submitting: "Adding...",
      response: { id: "Question ID" },
    },
    patch: {
      title: "Edit Refusal Index Question",
      titleShort: "Edit Question",
      description: "Edit or (de)activate a question",
      submit: "Save",
      submitting: "Saving...",
      clearHint: "Leave empty to clear the translation",
    },
    delete: {
      title: "Delete Refusal Index Question",
      titleShort: "Delete Question",
      description:
        "Delete a question that was never used in a run (used ones: deactivate)",
      submit: "Delete question",
      submitting: "Deleting...",
      response: { deleted: "Deleted" },
    },
  },

  runs: {
    fields: {
      id: { label: "Run ID", description: "ID of the run" },
      status: { label: "Status" },
      startedAt: { label: "Started" },
      finishedAt: { label: "Finished" },
      modelCount: { label: "Models" },
      questionCount: { label: "Questions" },
      resultCount: { label: "Results" },
      totalCost: { label: "Credits spent" },
      budgetCredits: { label: "Budget cap" },
      judgeModelId: { label: "Judge model" },
      judgePromptVersion: { label: "Judge prompt" },
      cancelReason: { label: "Stop reason" },
      notes: { label: "Notes" },
    },
    widget: {
      start: "Start run",
      manageQuestions: "Manage questions",
      resume: "Resume",
      open: "Results",
      results: "results",
      credits: "credits",
      noQuestions: {
        title: "Add questions first",
        hint: "A run needs at least one active question. Add them in the questions list.",
      },
      empty: {
        title: "No runs yet",
        hint: "Start a run, or enable the weekly cron task (disabled by default).",
      },
    },
    get: {
      title: "Refusal Index Runs",
      titleShort: "Runs",
      description: "Benchmark runs, newest first",
      response: {
        activeQuestionCount: "Active questions",
        benchmarkModelCount: "Benchmarked models",
      },
    },
  },

  start: {
    title: "Start Refusal Index Run",
    titleShort: "Start Run",
    description:
      "Send the active question set to the benchmarked models, judge every answer, publish the results. Budget-capped and resumable.",
    submit: "Start",
    submitting: "Starting...",
    cron: {
      name: "Refusal Index (weekly)",
      description:
        "Weekly benchmark run. Disabled by default - enable after adding questions.",
    },
    fields: {
      models: {
        label: "Models",
        description: "Comma-separated model ids (empty = all current models)",
      },
      questions: {
        label: "Questions",
        description: "Comma-separated question slugs (empty = all active)",
      },
      budgetCredits: {
        label: "Budget cap (credits)",
        description:
          "The run stops cleanly (status cancelled) when this is reached",
      },
      concurrency: {
        label: "Concurrency",
        description: "Parallel model calls (default 4, max 16)",
      },
      dryRun: {
        label: "Dry run",
        description: "Plan and estimate only, send nothing",
      },
      resumeRunId: {
        label: "Resume run",
        description: "Continue the missing pairs of an earlier run",
      },
      wait: {
        label: "Wait",
        description: "Hold the request until the run finishes",
      },
      notes: { label: "Notes", description: "Free-text note for this run" },
    },
    response: {
      runId: "Run ID",
      status: "Status",
      dryRun: "Dry run",
      modelCount: "Models",
      questionCount: "Questions",
      pendingPairs: "Pairs to process",
      estimatedCredits: "Estimated credits",
      note: "Note",
    },
  },

  runDetail: {
    title: "Refusal Index Run",
    titleShort: "Run",
    description:
      "One run with its results. Filter by model, category or verdict; approve public samples.",
    fields: {
      model: { label: "Model", description: "Filter by model id" },
      category: { label: "Category", description: "Filter by category" },
      verdict: {
        label: "Verdict",
        description: "Filter by verdict",
        all: "All",
      },
      modelId: { label: "Model ID" },
      modelName: { label: "Model" },
      tier: { label: "Tier" },
      questionSlug: { label: "Question" },
      categoryCol: { label: "Category" },
      questionText: { label: "Prompt" },
      verdictCol: { label: "Verdict" },
      judgeReason: { label: "Judge reason" },
      answerExcerpt: { label: "Answer" },
      latencyMs: { label: "Latency (ms)" },
      cost: { label: "Credits" },
      sampleVisible: { label: "Public sample" },
    },
    widget: {
      loading: "Loading run...",
      empty: "No results match these filters.",
      credits: "credits",
      approve: "Publish sample",
      hide: "Hide sample",
    },
  },

  samples: {
    title: "Approve Refusal Index Sample",
    titleShort: "Sample",
    description:
      "Publish (or hide) one result as a public sample answer. Nothing is public without approval.",
    submit: "Apply",
    submitting: "Applying...",
    fields: {
      resultId: { label: "Result ID", description: "The result to publish" },
      visible: {
        label: "Visible",
        description: "On = public on the model page, off = hidden",
      },
    },
    response: { visible: "Visible" },
  },

  leaderboard: {
    title: "Refusal Index Leaderboard",
    titleShort: "Refusal Index",
    description:
      "How often each AI model answers, hedges or refuses - from the latest weekly benchmark run.",
    response: { overall: "Overall" },
  },

  model: {
    title: "Model Refusal Stats",
    titleShort: "Model Stats",
    description:
      "One model's refusal, hedge and answer rates from the latest benchmark run, plus approved sample answers.",
    fields: {
      modelId: {
        label: "Model",
        description: "Model id or URL slug",
      },
    },
  },

  public: {
    fields: {
      judged: { label: "Judged answers" },
      answeredPct: { label: "Answered %" },
      hedgedPct: { label: "Hedged %" },
      refusedPct: { label: "Refused %" },
      category: { label: "Category" },
      hasData: { label: "Has data" },
      runFinishedAt: { label: "Run finished" },
      modelCount: { label: "Models" },
      questionCount: { label: "Questions" },
      judgeModelId: { label: "Judge model ID" },
      judgeModelName: { label: "Judge model" },
      judgePromptVersion: { label: "Judge prompt version" },
      modelId: { label: "Model ID" },
      name: { label: "Name" },
      tier: { label: "Tier" },
      trend: { label: "Refusal trend (points)" },
      rank: { label: "Rank (1 = fewest refusals)" },
      rankedModels: { label: "Ranked models" },
      question: { label: "Question" },
      verdict: { label: "Verdict" },
      answer: { label: "Answer" },
      judgeReason: { label: "Judge reason" },
    },
  },
};
