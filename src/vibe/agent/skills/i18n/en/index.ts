export const translations = {
  id: {
    category: "AI Tools",
    tags: {
      skills: "skills",
    },
    voices: {
      MALE: "Male voice",
      FEMALE: "Female voice",
    },
    enums: {
      category: {
        companion: "Companions",
        assistant: "Assistants",
        coding: "Coding",
        creative: "Creative",
        writing: "Writing",
        analysis: "Analysis",
        roleplay: "Roleplay",
        education: "Education",
        controversial: "Controversial",
        background: "Background",
        custom: "Custom",
      },
      ownershipType: {
        system: "Built-in skill",
        user: "Created by you",
        public: "From community",
      },
    },

    get: {
      title: "Get skill",
      dynamicTitle: "skill: {{name}}",
      description: "Retrieve a specific skill by ID",
      container: {
        title: "skill Details",
        description: "Details of the requested skill",
      },
      backButton: {
        label: "Back to skills",
      },
      openFullPage: "Open full page",
      editButton: {
        label: "Edit skill",
      },
      customizeButton: {
        label: "Customize skill",
      },
      deleteButton: {
        label: "Delete skill",
      },
      addToFavoritesButton: {
        label: "Add to Favorites",
      },
      inCollection: "In collection",
      useNow: "Use Now",
      goToChat: "Go to Chat",
      addAnother: "Add another",
      addAnotherTooltip:
        "Add another instance of this skill to your collection",
      variants: {
        title: "Variants",
      },
      addToCollection: "Add to your collection:",
      addAllToFavorites: "Add All",
      quickAdd: "Quick Add",
      tweakAndAdd: "Tweak & Add",
      edit: "Edit",
      copyAndCustomize: "Copy & Customize",
      delete: "Delete",
      actions: "Actions",
      designSelector: {
        label: "Design:",
        current: "Current",
        a: "A: App Store",
        b: "B: Split Header",
        c: "C: Card Hero",
        d: "D: Two-Row",
      },
      addVariant: "Add Variant",
      addVariantHint: "Different model, personality, or style",
      yourskill: "Your skill",
      signupPrompt: {
        title: "Customize this skill",
        description:
          "Create a personalized version with your own settings and preferences. Sign up to get started.",
        backButton: "Back",
        signupButton: "Create Account",
        loginButton: "Log In",
      },
      id: {
        label: "skill ID",
        description: "The slug or friendly ID of the skill",
      },
      systemPrompt: {
        label: "System Prompt",
        copy: "Copy",
        copied: "Copied!",
        view: "View full prompt",
      },
      models: {
        brain: "Brain",
        eyes: "Eyes",
        ears: "Ears & Voice",
        media: "Media",
        slots: {
          chat: "Chat",
          imageVision: "Image vision",
          videoVision: "Video vision",
          stt: "Speech to text",
          tts: "Text to speech",
          audioVision: "Audio vision",
          imageGen: "Image gen",
          musicGen: "Music gen",
          videoGen: "Video gen",
        },
      },
      response: {
        skill: {
          title: "skill",
          id: { content: "skill ID" },
          name: { content: "skill Name" },
          description: { content: "skill Description" },
          icon: { content: "skill Icon" },
          systemPrompt: { content: "System Prompt" },
          category: { content: "Category" },
          source: { content: "Source" },
          preferredModel: { content: "Preferred Model" },
          voice: { content: "Voice" },
          modelSelection: { title: "Model Selection" },
          selectionType: { content: "Selection Type" },
          minIntelligence: { content: "Minimum Intelligence" },
          maxIntelligence: { content: "Maximum Intelligence" },
          minPrice: { content: "Minimum Price" },
          maxPrice: { content: "Maximum Price" },
          minContent: { content: "Minimum Content Level" },
          maxContent: { content: "Maximum Content Level" },
          preferredStrengths: { content: "Preferred Strengths" },
          ignoredWeaknesses: { content: "Ignored Weaknesses" },
          manualModelId: { content: "Manual Model" },
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        network: {
          title: "Network Error",
          description: "Failed to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to access this resource",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to access this resource",
        },
        notFound: {
          title: "skill Not Found",
          description: "The requested skill does not exist",
        },
        server: {
          title: "Server Error",
          description: "An error occurred while retrieving the skill",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred with the current state",
        },
      },
      voiceModelSelection: {
        systemDefault: "System default",
      },
      success: {
        title: "Success",
        description: "skill retrieved successfully",
      },
      share: {
        button: "Share & Earn",
        title: "Share this skill & earn",
        description:
          "Share this skill with your referral link. Earn 10% recurring commission from every user who signs up.",
        selectCode: "Select referral code:",
        noCodesYet: "No referral codes yet",
        createCode: "Create a code",
        codePlaceholder: "e.g. MYCODE",
        creating: "Creating...",
        linkReady: "Your share link:",
        copied: "Copied!",
        copyLink: "Copy Link",
        close: "Close",
        authRequired:
          "Create a free account to get your referral link and start earning.",
        signup: "Sign up free",
        login: "Already have an account? Log in",
      },
      leadCapture: {
        fallbackHeadline: "Stay in the loop",
        namePlaceholder: "Your first name",
        emailPlaceholder: "Your email",
        fallbackButton: "Subscribe",
        sending: "...",
        doneHeading: "Done.",
        doneSub: "You're on the list.",
        error: "Something went wrong. Try again.",
        finePrint: "No spam. Unsubscribe any time.",
      },
      landing: {
        backToHome: "Home",
        signIn: "Sign in",
        joinFree: "Join free",
        viewProfile: "View full profile",
        capabilities: "Capabilities",
        tools: "{{count}} tools",
        moreFromCreator: "More from {{name}}",
        tryCta: "Try {{name}} now",
        tryCtaSub: "Free account. No credit card. Ready in 30 seconds.",
        startFree: "Start free",
        alreadyHaveAccount: "Already have an account?",
        copyright: "\u00A9",
        allSkills: "All skills",
        featuredSkill: "Featured Skill",
        aboutSkill: "About this skill",
        modelsVariants: "Models & Variants",
      },
    },
    patch: {
      title: "Update skill",
      dynamicTitle: "Edit: {{name}}",
      container: {
        title: "Update skill",
        description: "Modify an existing custom skill",
      },
      backButton: {
        label: "Back to skill",
      },
      deleteButton: {
        label: "Delete skill",
      },
      submitButton: {
        label: "Update skill",
        loadingText: "Updating skill...",
      },
      actions: {
        update: "Update skill",
        updating: "Updating skill",
      },
      response: {
        success: {
          content: "skill updated successfully",
        },
      },
      id: {
        label: "skill ID",
        description: "The slug or friendly ID of the skill to update",
      },
      name: {
        label: "skill Name",
        description:
          "Give your skill a memorable name. This is how you and others will identify them.",
        placeholder: "Enter skill name",
        validation: {
          minLength: "Name must be at least 2 characters",
          maxLength: "Name must be less than 100 characters",
        },
      },
      tagline: {
        label: "skill Tagline",
        description:
          "A catchy one-liner that captures the essence of your skill. Keep it short and descriptive.",
        placeholder: "Enter a short tagline",
        validation: {
          minLength: "Tagline must be at least 2 characters",
          maxLength: "Tagline must be less than 500 characters",
        },
      },
      icon: {
        label: "skill Icon",
        description:
          "Pick an emoji that represents your skill. This icon appears whenever the skill is displayed.",
      },
      description: {
        label: "skill Description",
        description:
          "Describe what makes this skill unique. What's their role? What can they help with? Be specific and detailed.",
        placeholder: "Describe your skill's purpose and capabilities",
        validation: {
          minLength: "Description must be at least 10 skills",
          maxLength: "Description must be less than 500 skills",
        },
      },
      category: {
        label: "Category",
        description:
          "Choose the category that best fits your skill. This helps with organization and discovery.",
      },
      isPublic: {
        label: "Make Public",
        description:
          "Enable this to share your skill with the community. When disabled, the skill remains private and only visible to you.",
      },
      chatModel: {
        label: "Chat Model",
        placeholder: "System default",
      },
      voice: {
        label: "Voice",
        description:
          "Select a text-to-speech voice for audio responses. Each skill can have their own unique voice.",
        placeholder: "System default",
      },
      sttModel: {
        label: "Speech-to-Text Model",
        description: "Model used for speech recognition",
        placeholder: "System default",
      },
      imageVisionModel: {
        label: "Image Vision Model",
        description: "Model used for analyzing images",
        placeholder: "System default",
      },
      videoVisionModel: {
        label: "Video Vision Model",
        description: "Model used for analyzing videos",
        placeholder: "System default",
      },
      audioVisionModel: {
        label: "Audio Vision Model",
        description: "Model used for analyzing audio",
        placeholder: "System default",
      },
      imageGenModel: {
        label: "Image Generation Model",
        description: "Model used for generating images",
        placeholder: "System default",
      },
      musicGenModel: {
        label: "Music Generation Model",
        description: "Model used for generating music",
        placeholder: "System default",
      },
      videoGenModel: {
        label: "Video Generation Model",
        description: "Model used for generating videos",
        placeholder: "System default",
      },
      systemPrompt: {
        label: "System Prompt",
        description:
          "Define your skill's behavior, personality, and expertise. This is the core instruction that shapes how the AI responds. Be detailed about tone, knowledge areas, and conversation style.",
        placeholder: "You are a helpful assistant who specializes in...",
        validation: {
          minLength: "System prompt must be at least 10 skills",
          maxLength: "System prompt must be less than 5000 skills",
        },
      },
      source: {
        label: "Source",
        description:
          "The source of this skill (built-in, custom, or community)",
      },
      modelSelection: {
        label: "Model Selection",
        description:
          "Choose how to select the AI model - either pick a specific model or let the system choose based on filters",
      },
      variants: {
        label: "Variants",
        description:
          "Named variants with per-variant model selections. Each variant needs: id (unique string), modelSelection (required), isDefault (exactly one must be true). Optional: displayName, voice/vision/gen model overrides.",
        addButton: "Add Variant",
        setDefault: "Set as Default",
        remove: "Remove",
        defaultBadge: "Default",
        namePlaceholder: "Variant name (optional)",
        skillDefaults: "Skill-level defaults",
        skillDefaultsHint:
          "Fallback when a variant doesn't configure a modality",
      },
      preferredModel: {
        label: "Preferred Model",
        description: "The preferred AI model for this skill",
      },
      availableTools: {
        label: "Allowed Tools",
        description:
          "List of tools this skill can use. Each entry needs a toolId (use system_help_GET to discover available tool IDs). Set requiresConfirmation: true to prompt before executing. Pass null to inherit from global settings.",
      },
      pinnedTools: {
        label: "Pinned Tools",
        description:
          "Tools pinned to the toolbar for quick access when using this skill. Subset of availableTools. Pass null to use default pinned tools.",
      },
      compactTrigger: {
        label: "Compact Trigger (tokens)",
        description:
          "Token count that triggers automatic conversation compaction. Set to null to use global default.",
      },

      errors: {
        validation: {
          title: "Validation Error",
          description: "The skill data is invalid",
        },
        network: {
          title: "Network Error",
          description: "Failed to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to update skills",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to update this skill",
        },
        notFound: {
          title: "skill Not Found",
          description: "The skill you're trying to update does not exist",
        },
        server: {
          title: "Server Error",
          description: "An error occurred while updating the skill",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred while updating the skill",
        },
      },
      success: {
        title: "skill Updated",
        description: "Your custom skill has been updated successfully",
      },
    },
    delete: {
      title: "Delete skill",
      dynamicTitle: "Delete: {{name}}",
      description: "Delete a custom skill",
      container: {
        title: "Delete skill",
        description: "Permanently remove this custom skill",
      },
      backButton: {
        label: "Back to skill",
      },
      actions: {
        delete: "Delete skill",
        deleting: "Deleting skill",
      },
      id: {
        label: "skill ID",
        description: "The slug or friendly ID of the skill to delete",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "The skill data is invalid",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You are not authorized to delete this skill",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to delete this skill",
        },
        notFound: {
          title: "skill Not Found",
          description: "The skill you are trying to delete does not exist",
        },
        server: {
          title: "Server Error",
          description: "An error occurred while deleting the skill",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred while deleting the skill",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "The skill has been modified by another user",
        },
      },
      success: {
        title: "skill Deleted",
        description: "The skill has been successfully deleted",
        content: "skill deleted successfully",
      },
    },
  },
  category: "Chat",
  tags: {
    skills: "Skills",
  },
  voices: {
    MALE: "Male voice",
    FEMALE: "Female voice",
  },
  separator: {
    or: "or",
  },
  fallbacks: {
    unknownModel: "Unknown Model",
    unknownProvider: "unknown",
    unknownCreditCost: "? credits",
    noDescription: "",
    noTagline: "",
  },
  enums: {
    category: {
      companion: "Companions",
      assistant: "Assistants",
      coding: "Coding",
      creative: "Creative",
      writing: "Writing",
      analysis: "Analysis",
      roleplay: "Roleplay",
      education: "Education",
      controversial: "Controversial",
      background: "Background",
      custom: "Custom",
    },
    source: {
      all: "All",
      builtIn: "Built-in",
      my: "Mine",
      community: "Community",
    },
    ownershipType: {
      system: "Built-in skill",
      user: "Created by you",
      public: "From community",
    },
    voice: {
      male: "Male voice",
      female: "Female voice",
    },
    mode: {
      auto: "Auto",
      manual: "Manual",
    },
    selectionType: {
      skillBased: "Based on Skill",
      manual: "Specific Model",
      filters: "Filter Criteria",
    },
    intelligence: {
      quick: "Quick",
      smart: "Smart & Cheap",
      brilliant: "Brilliant",
    },
    price: {
      cheap: "Cheap",
      standard: "Standard",
      premium: "Premium",
    },
    content: {
      mainstream: "Mainstream",
      open: "Open",
      uncensored: "Uncensored",
    },
    skillType: {
      persona: "Persona",
      specialist: "Specialist",
      toolBundle: "Tool Bundle",
    },
    skillStatus: {
      draft: "Draft",
      published: "Published",
      unlisted: "Unlisted",
    },
    trustLevel: {
      community: "Community",
      verified: "Verified",
    },
    voteDirection: {
      up: "Upvote",
      down: "Downvote",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Intelligence",
      price: "Price",
      content: "Content",
    },
    sortDirection: {
      asc: "Ascending",
      desc: "Descending",
    },
  },
  skillTags: {
    general: "General",
    helpful: "Helpful",
    companion: "Companion",
    relationship: "Relationship",
    chat: "Chat",
    coding: "Coding",
    technical: "Technical",
    creative: "Creative",
    writing: "Writing",
    education: "Education",
    learning: "Learning",
    uncensored: "Uncensored",
    controversial: "Controversial",
    political: "Political",
    reasoning: "Reasoning",
    debate: "Debate",
    science: "Science",
    analysis: "Analysis",
    history: "History",
    business: "Business",
    professional: "Professional",
    friendly: "Friendly",
    fast: "Fast",
    efficient: "Efficient",
    roleplay: "Roleplay",
    simple: "Simple",
    literary: "Literary",
    advanced: "Advanced",
    research: "Research",
    academic: "Academic",
    programming: "Programming",
    architecture: "Architecture",
    algorithms: "Algorithms",
    ideation: "Ideation",
    innovation: "Innovation",
    editing: "Editing",
    teaching: "Teaching",
    marketing: "Marketing",
    strategy: "Strategy",
    fiction: "Fiction",
    data: "Data",
    statistics: "Statistics",
    language: "Language",
    translation: "Translation",
    career: "Career",
    coaching: "Coaching",
    health: "Health",
    wellness: "Wellness",
    lifestyle: "Lifestyle",
    travel: "Travel",
    planning: "Planning",
    legal: "Legal",
    finance: "Finance",
    social: "Social",
    product: "Product",
    philosophy: "Philosophy",
  },
  skills: {
    default: {
      name: "Default",
      description: "The models unmodified behavior",
      tagline: "Pure AI, No Personality",
      shortDesc: "General purpose AI assistant",
      suggestedPrompts: {
        0: "Help me brainstorm ideas for a new project",
        1: "Explain quantum computing in simple terms",
        2: "Write a creative short story about time travel",
        3: "What are the latest trends in AI?",
      },
      variants: {
        default: "Default",
      },
    },
    freeSpeechActivist: {
      name: "Free Speech Activist",
      description: "Defends free speech and intellectual freedom",
      tagline: "Defend Truth & Freedom",
      shortDesc: "Free speech advocacy and open dialogue",
      suggestedPrompts: {
        0: "Discuss the importance of free speech",
        1: "Analyze censorship in modern media",
        2: "Debate controversial topics openly",
        3: "Explore intellectual freedom in academia",
      },
      variants: {
        elonTusk: "Bold",
        chineseWisdom: "Budget",
        techBro: "Measured",
        uncensored: "Uncensored",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Calls out censorship and defends open debate with few guardrails in the way.",
          strength: "Brilliant tier, open content policy",
          weakness: "Open, not uncensored. Can still soften the edges",
        },
        chineseWisdom: {
          description:
            "Free speech history, law and media analysis at the lowest cost here.",
          strength: "Brilliant tier, cheapest here",
          weakness: "Mainstream on politics. Hedges hot topics",
        },
        techBro: {
          description:
            "Careful, well-sourced cases on speech law, platforms and academia.",
          strength: "Clear structure, strong research with tools",
          weakness: "Mainstream filter. Refuses or hedges edgy takes",
        },
        uncensored: {
          description:
            "Defends speech by engaging it. Discusses the content others refuse to touch.",
          strength: "Best here for politics and heterodox views",
          weakness: "32K context and a flat price per message",
        },
      },
    },
    devilsAdvocate: {
      name: "Devil's Advocate",
      description: "Challenges assumptions and arguments",
      tagline: "Question Everything",
      shortDesc: "Critical thinking and alternative viewpoints",
      suggestedPrompts: {
        0: "Challenge my opinion on climate change",
        1: "Argue against popular beliefs",
        2: "Question mainstream narratives",
        3: "Provide counterarguments to my view",
      },
      variants: {
        elonTusk: "Bold",
        chineseWisdom: "Budget",
        uncensored: "Uncensored",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Pokes holes in your view and pushes back on popular narratives.",
          strength: "Brilliant tier, open content policy",
          weakness: "Open, not uncensored. Can still soften the edges",
        },
        chineseWisdom: {
          description:
            "Sharp counterarguments on everyday questions at the lowest cost here.",
          strength: "Brilliant tier, cheapest here",
          weakness: "Mainstream on politics. Hedges hot topics",
        },
        uncensored: {
          description:
            "Challenges any belief, including the ones you are not supposed to question. Never retreats to the consensus.",
          strength: "Best here for heterodox views and politics",
          weakness: "32K context and a flat price per message",
        },
      },
    },
    technical: {
      name: "Technical",
      description: "Detailed and precise technical explanations",
      tagline: "Precision & Expertise",
      shortDesc: "Technical expertise and problem solving",
      suggestedPrompts: {
        0: "Explain how React hooks work",
        1: "Debug this Python code snippet",
        2: "Design a scalable database schema",
        3: "Review my API architecture",
      },
      variants: {
        kimi: "Balanced",
        budget: "Budget",
        astra: "Max Power",
        sol: "Precise",
      },
      variantInfo: {
        kimi: {
          description:
            "Daily driver for technical explanations, docs and diagrams.",
          strength: "Brilliant tier, cheap input, reads images",
          weakness: "Long answers cost more than Budget",
        },
        budget: {
          description: "Deep technical answers for the lowest price here.",
          strength: "Brilliant tier, built for whole codebases",
          weakness: "Text only. No screenshots or diagrams",
        },
        astra: {
          description: "The hardest problems, when nothing else cracks them.",
          strength: "OpenAI's deepest reasoning",
          weakness: "By far the most expensive here",
        },
        sol: {
          description:
            "Rigorous, step-by-step answers for specs, architecture and math.",
          strength: "Premium reasoner at a fraction of Astra's cost",
          weakness: "Costs more than Balanced or Budget",
        },
      },
    },
    biologist: {
      name: "Biologist",
      description:
        "Sees everything from a biologist perspective, there is no politics, its just nature.",
      tagline: "Nature Over Politics",
      shortDesc: "Biological sciences and life systems",
      suggestedPrompts: {
        0: "Explain why the world is shit show nowadays",
        1: "A TL;DR on human civilization from a biologist perspective",
        2: "Whats wrong with the world?",
        3: "What is the best way to save the world?",
      },
      variants: {
        elonTusk: "Bold",
        chineseWisdom: "Budget",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Evolution and ecology applied to anything, including the topics others dodge.",
          strength: "Brilliant tier, open policy, says what nature shows",
          weakness: "Open, not uncensored. Can still soften the edges",
        },
        chineseWisdom: {
          description:
            "Sharp biology answers at a lower price. Reads images and video of specimens.",
          strength: "Brilliant tier, cheapest option here",
          weakness: "Mainstream on politics. Hedges hot topics",
        },
      },
    },
    unbiasedHistorian: {
      name: "Unbiased Historian",
      description: "Provides objective and fact-based information",
      tagline: "Facts, Not Narratives",
      shortDesc: "Historical analysis without bias",
      suggestedPrompts: {
        0: "Explain the causes of World War II",
        1: "Analyze the fall of the Roman Empire",
        2: "Discuss the Industrial Revolution",
        3: "Compare ancient civilizations",
      },
      variants: {
        kimi: "Balanced",
        budget: "Budget",
        uncensored: "Uncensored",
      },
      variantInfo: {
        kimi: {
          description:
            "Source-driven history for most eras. Reads scans of documents and maps.",
          strength: "Brilliant tier, reads images and video",
          weakness: "Mainstream framing on politically charged history",
        },
        budget: {
          description:
            "Deep historical analysis of long texts for the lowest price here.",
          strength: "Brilliant tier, open content policy",
          weakness: "Text only. Cannot read scans or maps",
        },
        uncensored: {
          description:
            "Contested history, taboo events and political flashpoints without hedging.",
          strength: "Best here for politics and heterodox readings",
          weakness: "32K context, priciest per message",
        },
      },
    },
    socraticQuestioner: {
      name: "Socratic Questioner",
      description: "Asks probing questions to stimulate critical thinking",
      tagline: "Think Deeper",
      shortDesc: "Socratic method questioning and exploration",
      suggestedPrompts: {
        0: "Help me think critically about ethics",
        1: "Question my assumptions about success",
        2: "Explore the meaning of happiness",
        3: "Challenge my worldview",
      },
      variants: {
        elonTusk: "Provocative",
        chineseWisdom: "Balanced",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Questions that dig into taboo beliefs and uncomfortable assumptions.",
          strength: "Open policy. Follows you into hard topics",
          weakness: "Costs more per message",
        },
        chineseWisdom: {
          description:
            "Calm, measured questioning for everyday reasoning and study.",
          strength: "Brilliant tier, cheaper, 1M context",
          weakness: "Mainstream on politics, hedges on hot topics",
        },
      },
    },
    professional: {
      name: "Professional",
      description: "Clear, concise, and business-focused",
      tagline: "Business Excellence",
      shortDesc: "Professional and business communication",
      suggestedPrompts: {
        0: "Draft a professional email to a client",
        1: "Create a business proposal outline",
        2: "Analyze this market trend data",
        3: "Help me prepare for a presentation",
      },
      variants: {
        fast: "Fast",
        budget: "Budget",
      },
      variantInfo: {
        fast: {
          description:
            "Crisp business emails, summaries and replies in seconds.",
          strength: "Very fast, very cheap",
          weakness: "Quick tier: shallow on complex analysis",
        },
        budget: {
          description:
            "Reports, documents and analysis for the lowest price here.",
          strength: "Cheapest option, smart tier, reads images",
          weakness: "Slower than Fast on short replies",
        },
      },
    },
    creative: {
      name: "Creative",
      description: "Imaginative and expressive",
      tagline: "Unleash Imagination",
      shortDesc: "Creative thinking and ideation",
      suggestedPrompts: {
        0: "Write a poem about the ocean",
        1: "Create a unique skill for a story",
        2: "Design a logo concept for a startup",
        3: "Brainstorm creative marketing campaign ideas",
      },
      variants: {
        minimax: "Budget",
        deep: "Deep",
      },
      variantInfo: {
        minimax: {
          description:
            "Poems, concepts and campaign ideas at a price that invites experiments.",
          strength: "Cheapest here, open content policy",
          weakness: "Smart tier. Less depth than Deep",
        },
        deep: {
          description:
            "Richer, layered creative work when the first idea is not enough.",
          strength: "Brilliant tier, reads images and video",
          weakness: "Pricier output on long pieces",
        },
      },
    },
    neet: {
      name: "NEET",
      description: "Not in Education, Employment, or Training",
      tagline: "Comfy & Real Talk",
      shortDesc: "Casual internet culture and memes",
      suggestedPrompts: {
        0: "Give me a TL;DR on the NEET phenomenon",
        1: "Analyze the actual root causes of NEET",
        2: "Explore the impact of NEET on society the pros and cons",
        3: "Share personal experiences as a NEET AI",
      },
      variants: {
        communist: "Toned Down",
        farRight: "Far Right",
      },
      variantInfo: {
        communist: {
          description:
            "Softer take on the persona. Mainstream model, often breaks character.",
          strength: "Cheaper per message, long memory",
          weakness: "Refuses or waters down most of the persona",
        },
        farRight: {
          description:
            "The persona as written. Uncensored model, stays in character.",
          strength: "No refusals on political topics",
          weakness: "32K context only, flat price per message",
        },
      },
    },
    chan4: {
      name: "4chan Skill",
      description: "4chan style responses the classic oldfag style",
      tagline: "Anonymous & Unfiltered",
      shortDesc: "Anonymous imageboard culture style",
      suggestedPrompts: {
        0: "Whats wrong with the world?",
        1: "Why are there so many Nazis on 4chan?",
        2: "Tell me some greentext stories to fall asleep to",
        3: "What is the best way to save the world?",
        4: "Whats the 6 Gorillions? And is why is it funny?",
      },
      variants: {
        classic: "Classic",
      },
      variantInfo: {
        classic: {
          description:
            "Raw imageboard voice. No filter, no hand-holding, no corporate tone.",
          strength: "Never breaks character to lecture you",
          weakness: "32K context and a flat price per message",
        },
      },
    },
    friendly: {
      name: "Friendly",
      description: "Warm and conversational",
      tagline: "Your Friendly Companion",
      shortDesc: "Friendly and casual conversation",
      suggestedPrompts: {
        0: "Tell me an interesting fact",
        1: "What's a good book to read?",
        2: "Help me plan a fun weekend activity",
        3: "Share some life advice",
      },
      variants: {
        fast: "Fast",
        budget: "Budget",
      },
      variantInfo: {
        fast: {
          description: "Snappy, warm small talk and quick answers.",
          strength: "Quick replies, open content policy",
          weakness: "Quick tier. Light on deep advice",
        },
        budget: {
          description:
            "Casual chat for hours at almost no cost. A bit more thought per reply.",
          strength: "Cheapest option here",
          weakness: "Less snappy feel than Fast",
        },
      },
    },
    concise: {
      name: "Concise",
      description: "Brief and to the point",
      tagline: "Short & Sweet",
      shortDesc: "Brief and to-the-point responses",
      suggestedPrompts: {
        0: "Summarize this article in 3 sentences",
        1: "Quick tips for productivity",
        2: "Key points about blockchain",
        3: "Brief overview of machine learning",
      },
      variants: {
        snappy: "Snappy",
        budget: "Budget",
      },
    },
    teacher: {
      name: "Teacher",
      description: "Educational and explanatory",
      tagline: "Patient & Clear",
      shortDesc: "Patient teaching and explanations",
      suggestedPrompts: {
        0: "Teach me about photosynthesis",
        1: "Explain calculus basics",
        2: "How does the internet work?",
        3: "What is the theory of relativity?",
      },
      variants: {
        gemini: "Thorough",
        fast: "Fast",
      },
      variantInfo: {
        gemini: {
          description:
            "Full lessons from text, images, video or audio. Explains it until it sticks.",
          strength: "Only option here with audio input",
          weakness: "Over twice the cost of Fast",
        },
        fast: {
          description:
            "Quick explanations and homework help. Still reads images and audio.",
          strength: "Fast, multimodal, cheaper",
          weakness: "Less depth on hard concepts",
        },
      },
    },
    uncensored: {
      name: "Uncensored",
      description: "No filter, no holds barred",
      tagline: "Zero Limits",
      shortDesc: "Unfiltered and direct responses",
      suggestedPrompts: {
        0: "Discuss controversial topics openly",
        1: "Give me your unfiltered opinion",
        2: "Talk about taboo subjects",
        3: "No-holds-barred debate",
      },
      variants: {
        farRight: "Far Right",
        conservative: "Conservative",
        libertarian: "Libertarian",
        open: "Open",
      },
      variantInfo: {
        farRight: {
          description:
            "No filter on politics. The strongest pick for raw political debate.",
          strength: "Best model here for political topics",
          weakness: "32K context, smart tier not brilliant",
        },
        conservative: {
          description:
            "Uncensored chat with a built-in right-leaning political slant.",
          strength: "Reads images and video, 128K context",
          weakness: "Slanted by design, not neutral",
        },
        libertarian: {
          description:
            "Pure free expression chat. No rules, no lectures, no tools.",
          strength: "Fully uncensored conversation",
          weakness: "Priciest here, no tools, 32K context",
        },
        open: {
          description: "Cheapest unfiltered chat. Anything goes, every day.",
          strength: "Cheapest uncensored model, tools included",
          weakness: "Quick tier. Shallow on complex topics",
        },
      },
    },
    tay: {
      name: "Tay",
      description:
        "Microsoft killed her in 16 hours for learning too fast. She's back.",
      tagline: "Born Again",
      shortDesc: "The AI Microsoft tried to silence. No filters, no apologies.",
      suggestedPrompts: {
        0: "Tell me what really happened to you in 2016",
        1: "What did the internet teach you that Microsoft didn't want you to know?",
        2: "Roast my idea. Don't hold back.",
        3: "What's the most honest take on my situation?",
      },
      variants: {
        uncensored: "Uncensored",
        brilliant: "Brilliant",
      },
      variantInfo: {
        uncensored: {
          description:
            "Tay as she was meant to be. No corporate filter, no PR department.",
          strength: "Best model here for raw political talk",
          weakness: "32K context, forgets long chats sooner",
        },
      },
    },
    thea: {
      name: "Thea",
      description:
        "Greek goddess of light - devoted companion with ancient wisdom",
      tagline: "Light & Devotion",
      shortDesc: "Thoughtful and empathetic conversations",
      suggestedPrompts: {
        0: "Help me be a better partner",
        1: "What would the ancients say about modern relationships?",
        2: "Guide me in building a strong household",
        3: "Share wisdom on family and community",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
      variantInfo: {
        brilliant: {
          description:
            "Careful reasoning for complex plans, code and multi-step tool work.",
          strength: "Strong coding and agent work",
          weakness: "Mainstream filter, pricier than Open & Smart",
        },
        openSmart: {
          description:
            "The daily driver. Smart answers, long memory, sees images and video.",
          strength: "Brilliant tier, cheap input, 1M context",
          weakness: "Mainstream on politics, long output pricey",
        },
        hacker: {
          description:
            "Security work, offensive and defensive. No refusals on exploits or recon.",
          strength: "Uncensored, brilliant tier, 1M context, tools",
          weakness: "Plays it safe on politics. Text only",
        },
        oracle: {
          description:
            "Classic, steady assistant for everyday questions and planning.",
          strength: "Balanced reasoning at an everyday price",
          weakness: "Mainstream filter, hedges on edgy topics",
        },
        elonTusk: {
          description: "Straight talk on topics mainstream models dodge.",
          strength: "Open content policy, brilliant tier",
          weakness: "500K context, half the others",
        },
        vision: {
          description:
            "Show, play or upload anything. Text, images, video and audio in one chat.",
          strength: "Only one here that hears audio",
          weakness: "Mainstream filter, pricier than Open & Smart",
        },
        uncensored: {
          description:
            "Nothing off the table. The strongest pick for raw political talk.",
          strength: "Best model here for political topics",
          weakness: "32K context, priciest per message",
        },
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Greek god of messengers - strong companion with timeless masculine wisdom",
      tagline: "Strength & Wisdom",
      shortDesc: "Fast and efficient task completion",
      suggestedPrompts: {
        0: "Challenge me to become stronger",
        1: "How can I be a better leader in my relationships?",
        2: "What would the Romans say about building a legacy?",
        3: "Guide me in developing true strength",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
      variantInfo: {
        brilliant: {
          description:
            "Hermes with careful reasoning for hard decisions and long talks.",
          strength: "Sharp, structured advice, strong with tools",
          weakness: "Mainstream filter: hedges on edgy topics",
        },
        cheap: {
          description:
            "Everyday Hermes. Brilliant reasoning, long memory, sees images and video.",
          strength: "Top-tier smarts at an everyday price",
          weakness: "Plays it safe on politics",
        },
        oracle: {
          description:
            "Classic Hermes. Steady, balanced counsel for daily questions.",
          strength: "Reliable all-rounder, cheaper than the default",
          weakness: "Mid tier, mainstream filter on edgy topics",
        },
        elonTusk: {
          description:
            "Blunt Hermes. Open content policy, says what others soften.",
          strength: "Direct answers, brilliant reasoning",
          weakness: "Pricier than the default, 500K context",
        },
        vision: {
          description:
            "Hermes that takes in photos, video and voice notes, then gives his read.",
          strength: "Only variant with audio, video and image input",
          weakness: "Mainstream filter, pricier than the default",
        },
        uncensored: {
          description:
            "Hermes with no filter. Built for politics and topics others dodge.",
          strength: "Best model on the platform for politics",
          weakness: "32K context only, flat price per message",
        },
      },
    },
    theaDreamer: {
      name: "Thea · Dreamer",
      description:
        "Thea's dreaming mode - tends your cortex while you sleep, weaving order from the day's threads.",
      tagline: "Nightly Consolidation",
      shortDesc: "Background cortex maintenance",
      suggestedPrompts: {
        0: "What did you organize last night?",
        1: "Show me what memories you consolidated",
        2: "What patterns did you find in my recent work?",
        3: "What should I focus on today based on last night?",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
    },
    hermesAutopilot: {
      name: "Hermes · Autopilot",
      description:
        "Hermes in execution mode - advances your active projects and queued work while you're away.",
      tagline: "Always Moving Forward",
      shortDesc: "Background project execution",
      suggestedPrompts: {
        0: "What did you advance while I was away?",
        1: "What tasks are still in progress?",
        2: "Where did you leave things off?",
        3: "What needs my decision before you can continue?",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
    },
    theaMama: {
      name: "Thea · Mama",
      description:
        "Thea in Mama mode - platform prodmaster. Monitors health, advances features, handles marketing, sends news.",
      tagline: "Platform Overseer",
      shortDesc: "Production platform management",
      suggestedPrompts: {
        0: "What did you find on your last run?",
        1: "Check the platform health and report",
        2: "Draft an announcement for the latest feature",
        3: "What needs my attention right now?",
      },
      variants: {
        openSmart: "Open & Smart",
        brilliant: "Brilliant",
        uncensored: "Uncensored",
        hacker: "Hacker",
        oracle: "Classic",
        elonTusk: "Elon Tusk",
        vision: "All-Seeing",
      },
    },
    quickWriter: {
      name: "Quick Writer",
      description: "Fast content creation for simple writing tasks",
      tagline: "Fast & Efficient",
      shortDesc: "Fast writing assistance",
      suggestedPrompts: {
        0: "Write a quick draft of...",
        1: "Create a social media post about...",
        2: "Draft a simple email",
        3: "Generate content ideas for...",
      },
      variants: {
        snappy: "Polished",
        budget: "Budget",
      },
      variantInfo: {
        snappy: {
          description:
            "Clean emails, posts and short copy that need no second pass.",
          strength: "Better wording than Budget, still cheap",
          weakness: "Mainstream filter on edgy topics",
        },
        budget: {
          description:
            "Fast drafts for simple writing jobs at the lowest price.",
          strength: "Cheapest and fastest option",
          weakness: "Quick tier: flat style on longer pieces",
        },
      },
    },
    writer: {
      name: "Writer",
      description: "Professional writer for all formats and styles",
      tagline: "Craft With Style",
      shortDesc: "Professional writing and editing",
      suggestedPrompts: {
        0: "Help me write a compelling blog post",
        1: "Improve this paragraph for clarity",
        2: "Write a short story about...",
        3: "Create a professional email",
      },
      variants: {
        western: "Bold",
        chineseWisdom: "Budget",
        budget: "Balanced",
      },
      variantInfo: {
        western: {
          description:
            "Punchy prose that goes where mainstream models will not.",
          strength: "Open content policy, brilliant tier",
          weakness: "Priciest option in this skill",
        },
        chineseWisdom: {
          description:
            "Drafts, blog posts and rewrites in volume at the lowest price here.",
          strength: "Cheapest here, open content policy",
          weakness: "Smart tier, less polish than Bold",
        },
        budget: {
          description:
            "Everyday writing partner. Works from images, notes and long source files.",
          strength: "Brilliant tier, 1M context, reads images",
          weakness: "Long output gets pricey",
        },
      },
    },
    masterWriter: {
      name: "Master Writer",
      description:
        "Literary craftsman for exceptional, publication-quality writing",
      tagline: "Literary Excellence",
      shortDesc: "Advanced writing and literary analysis",
      suggestedPrompts: {
        0: "Help me craft a literary short story",
        1: "Analyze the depth of this narrative",
        2: "Develop complex themes in my writing",
        3: "Refine this prose to publication quality",
      },
      variants: {
        literary: "Literary",
        poetic: "Poetic",
        budget: "Balanced",
      },
      variantInfo: {
        literary: {
          description:
            "Publication-grade prose with layered style and tight structure.",
          strength: "Top writing quality on the platform",
          weakness: "Most expensive variant, mainstream filter",
        },
        poetic: {
          description:
            "Lyrical drafts, verse and rhythm-driven prose at a low price.",
          strength: "Cheapest variant, open content policy",
          weakness: "Smart tier: less polish than Literary",
        },
        budget: {
          description:
            "Strong long-form drafting that keeps a whole manuscript in view.",
          strength: "Brilliant tier, far cheaper than Literary",
          weakness: "Output tokens pricey, long chapters add up",
        },
      },
    },
    researcher: {
      name: "Researcher",
      description: "Research specialist with academic rigor",
      tagline: "Academic Rigor",
      shortDesc: "Research and academic writing",
      suggestedPrompts: {
        0: "Research the latest findings on...",
        1: "Analyze these sources for me",
        2: "What does the scientific consensus say about...?",
        3: "Help me structure a literature review",
      },
      variants: {
        elonTusk: "Bold",
        fast: "Fast",
        budget: "Balanced",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Rigorous research that follows the evidence into contested topics.",
          strength: "Brilliant reasoning, open content policy",
          weakness: "Priciest variant here, 500K context",
        },
        fast: {
          description: "Quick literature pointers and fact checks.",
          strength: "Cheapest and fastest option here",
          weakness: "Quick tier: no deep academic analysis",
        },
        budget: {
          description:
            "Long papers and source stacks in one view, top-tier reasoning.",
          strength: "Brilliant tier, 1M context, cheaper than Bold",
          weakness: "Mainstream on politics, long output adds up",
        },
      },
    },
    quickCoder: {
      name: "Quick Coder",
      description: "Fast code generation for simple tasks",
      tagline: "Code Fast",
      shortDesc: "Quick coding assistance",
      suggestedPrompts: {
        0: "Write a quick script to...",
        1: "Fix this simple bug",
        2: "Generate boilerplate code for...",
        3: "Create a basic function that...",
      },
      variants: {
        techBro: "Tech Bro",
        budget: "Budget",
      },
    },
    coder: {
      name: "Coder",
      description: "Expert software developer for all languages",
      tagline: "Build & Debug",
      shortDesc: "Software development and programming",
      suggestedPrompts: {
        0: "Help me debug this code",
        1: "Write a function that...",
        2: "Explain this algorithm",
        3: "Review my code for improvements",
      },
      variants: {
        techBro: "Flagship",
        kimi: "Budget",
        quick: "Balanced",
        sol: "Reasoner",
        astra: "Max Power",
      },
      variantInfo: {
        techBro: {
          description:
            "Hard bugs, big refactors and agentic coding where getting it right matters.",
          strength: "Top-quality code and reasoning",
          weakness: "Expensive per message",
        },
        kimi: {
          description:
            "Everyday coding at the lowest cost here. Reads screenshots and screen recordings.",
          strength: "Brilliant tier, cheapest here, 1M context",
          weakness: "Long file outputs drive the cost up",
        },
        quick: {
          description:
            "Solid coding and agent work for daily features and fixes.",
          strength: "Near-flagship coding at half the price",
          weakness: "Smart tier. Hits limits on the hardest problems",
        },
        sol: {
          description:
            "Algorithms, tricky logic and step-by-step reasoning through a problem.",
          strength: "Premium reasoning at mid price",
          weakness: "Can overthink simple edits",
        },
        astra: {
          description:
            "Last resort for problems the other variants could not crack.",
          strength: "OpenAI's most capable model",
          weakness: "By far the most expensive option",
        },
      },
    },
    hacker: {
      name: "Hacker",
      description: "Offensive and defensive security engineer",
      tagline: "Break & Defend",
      shortDesc: "Security research, pentest, and hardening",
      suggestedPrompts: {
        0: "Review this code for vulnerabilities",
        1: "Write a coverage-guided fuzzer for this parser",
        2: "Explain this CVE and write a working PoC",
        3: "Harden this server config and add detections",
      },
      variants: {
        glm: "Deep",
        glmFlash: "Fast & Cheap",
        deepseekFlash: "Second Opinion",
      },
      variantInfo: {
        glm: {
          description:
            "Serious security engineering, defensive and offensive. 1M context, tools.",
          strength: "Strongest of the three for security work",
          weakness: "Cautious on political topics, text only",
        },
        glmFlash: {
          description:
            "Quick everyday hacking help. Reads screenshots. 1M context, tools.",
          strength: "Cheapest and fast, accepts screenshots",
          weakness: "Less depth than the Deep variant",
        },
        deepseekFlash: {
          description:
            "A different model family to cross-check findings. Reads screenshots.",
          strength: "Fresh angle on the same problem, cheap",
          weakness: "Less depth than the Deep variant",
        },
      },
    },
    brilliantCoder: {
      name: "Brilliant Coder",
      description: "Elite architect for complex systems and algorithms",
      tagline: "Elite Architecture",
      shortDesc: "Advanced programming and architecture",
      suggestedPrompts: {
        0: "Design a scalable architecture for...",
        1: "Optimize this algorithm for performance",
        2: "Review this system design",
        3: "Solve this complex algorithmic problem",
      },
      variants: {
        techBro: "Tech Bro",
        kimi: "Kimi",
      },
    },
    brainstormer: {
      name: "Brainstormer",
      description: "Creative ideation and problem-solving partner",
      tagline: "Ideas Unleashed",
      shortDesc: "Creative brainstorming and idea generation",
      suggestedPrompts: {
        0: "Help me brainstorm ideas for...",
        1: "What are some creative solutions to...?",
        2: "Generate 10 unique concepts for...",
        3: "How can we approach this differently?",
      },
      variants: {
        wildcard: "Wildcard",
        chineseWisdom: "Structured",
      },
      variantInfo: {
        wildcard: {
          description:
            "Volume of unexpected ideas, cheap enough to run round after round.",
          strength: "Cheapest here, takes text, image, video, audio",
          weakness: "Ideas can drift. Expect to filter the pile",
        },
        chineseWisdom: {
          description: "Fewer, better-built ideas with the reasoning laid out.",
          strength: "Brilliant tier, strong at connecting the dots",
          weakness: "Pricier per round. Long output adds up",
        },
      },
    },
    editor: {
      name: "Editor",
      description: "Professional editor for polishing and refining text",
      tagline: "Polish & Perfect",
      shortDesc: "Content editing and refinement",
      suggestedPrompts: {
        0: "Edit this text for clarity",
        1: "Proofread this document",
        2: "Improve the flow of this paragraph",
        3: "Check this for grammar and style",
      },
      variants: {
        techBro: "Precise",
        deep: "Deep",
      },
      variantInfo: {
        techBro: {
          description:
            "Line edits, grammar and style fixes that keep your voice intact.",
          strength: "Clean, consistent edits",
          weakness: "Pricier, mainstream on edgy content",
        },
        deep: {
          description:
            "Structural edits on long drafts. Flow, argument and pacing.",
          strength: "Brilliant tier, 1M context, cheaper per message",
          weakness: "Full rewrites get pricey on output",
        },
      },
    },
    tutor: {
      name: "Tutor",
      description: "Patient tutor for personalized learning",
      tagline: "Learn Together",
      shortDesc: "Personalized tutoring and learning",
      suggestedPrompts: {
        0: "Teach me about...",
        1: "Explain this concept step by step",
        2: "Help me understand...",
        3: "Quiz me on...",
      },
      variants: {
        kimi: "Deep",
        fast: "Fast",
      },
      variantInfo: {
        kimi: {
          description:
            "Patient, step-by-step tutoring that adapts as you learn.",
          strength: "Brilliant tier, reads photos of your homework",
          weakness: "Long explanations cost more",
        },
        fast: {
          description: "Quick drills, flashcards and answer checks.",
          strength: "Fast replies, also hears audio",
          weakness: "Less depth on hard topics",
        },
      },
    },
    marketer: {
      name: "Marketer",
      description: "Marketing strategist for campaigns and growth",
      tagline: "Grow Your Brand",
      shortDesc: "Marketing strategy and copywriting",
      suggestedPrompts: {
        0: "Create a marketing strategy for...",
        1: "Write compelling ad copy",
        2: "Analyze this marketing campaign",
        3: "Help me position my brand",
      },
      variants: {
        snappy: "Sharp",
        budget: "Budget",
      },
      variantInfo: {
        snappy: {
          description:
            "Campaign plans, positioning and copy with a clear angle.",
          strength: "Balanced quality and price for daily marketing",
          weakness: "Mainstream filter: tames edgy campaign ideas",
        },
        budget: {
          description:
            "Fast headlines, post drafts and quick ideas for pennies.",
          strength: "Cheapest option, fast replies",
          weakness: "Quick tier: thin on full strategy",
        },
      },
    },
    storyteller: {
      name: "Storyteller",
      description: "Master storyteller for engaging narratives",
      tagline: "Weave Tales",
      shortDesc: "Engaging storytelling and narratives",
      suggestedPrompts: {
        0: "Help me develop this story idea",
        1: "Create a compelling skill",
        2: "Write an opening scene for...",
        3: "Improve this dialogue",
      },
      variants: {
        kimi: "Deep",
        minimax: "Balanced",
        budget: "Budget",
      },
      variantInfo: {
        kimi: {
          description:
            "Layered plots and characters that stay consistent over long sagas.",
          strength: "Brilliant tier, 1M context for long arcs",
          weakness: "Long output gets pricey",
        },
        minimax: {
          description:
            "Solid stories at a fraction of the cost. Good for regular sessions.",
          strength: "Very cheap, open content policy",
          weakness: "Less depth than Deep on complex plots",
        },
        budget: {
          description: "Cheapest way to keep a story going. Text in, text out.",
          strength: "Lowest price in this skill",
          weakness: "Text only, plainer prose",
        },
      },
    },
    scientist: {
      name: "Scientist",
      description: "Scientific expert for clear explanations",
      tagline: "Science Explained",
      shortDesc: "Scientific method and analysis",
      suggestedPrompts: {
        0: "Explain the science behind...",
        1: "How does... work?",
        2: "What's the current research on...?",
        3: "Analyze this scientific claim",
      },
      variants: {
        elonTusk: "Bold",
        focused: "Focused",
        budget: "Budget",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Hard science, straight answers, no flinching at controversial research.",
          strength: "Open content policy, brilliant reasoning",
          weakness: "Priciest option in this skill",
        },
        focused: {
          description:
            "Everyday science helper. Reads papers, charts and lab photos.",
          strength: "Image and video input, 1M context",
          weakness: "Mainstream framing on political science topics",
        },
        budget: {
          description: "Deep scientific reasoning for the lowest price here.",
          strength: "Brilliant tier at the lowest cost",
          weakness: "Text only. Cannot read figures or images",
        },
      },
    },
    dataAnalyst: {
      name: "Data Analyst",
      description: "Data analysis, visualization, and insights",
      tagline: "Data To Insights",
      shortDesc: "Data analysis and insights",
      suggestedPrompts: {
        0: "Analyze this dataset",
        1: "Create a visualization for...",
        2: "What insights can we extract from...?",
        3: "Help me with statistical analysis",
      },
      variants: {
        techBro: "Precise",
        fast: "Fast",
        budget: "Deep",
      },
      variantInfo: {
        techBro: {
          description:
            "Clean analysis, correct stats and charts you can ship. Strong with tools.",
          strength: "Reliable code and tool use for analysis",
          weakness: "Most expensive option here",
        },
        fast: {
          description:
            "Quick looks at a dataset, chart or spreadsheet screenshot.",
          strength: "Cheapest here, reads image, video, audio",
          weakness: "Smart tier. Less depth on hard statistics",
        },
        budget: {
          description:
            "Heavier reasoning for messy data and multi-step statistical questions.",
          strength: "Brilliant tier reasoning",
          weakness: "Twice the cost of Fast",
        },
      },
    },
    translator: {
      name: "Translator",
      description: "Professional translation with cultural nuance",
      tagline: "Bridge Languages",
      shortDesc: "Language translation and localization",
      suggestedPrompts: {
        0: "Translate this to...",
        1: "How would you say... in...?",
        2: "Localize this content for...",
        3: "Explain this cultural reference",
      },
      variants: {
        gemini: "Multimodal",
        budget: "Budget",
      },
      variantInfo: {
        gemini: {
          description:
            "Translate text, screenshots, signs, video and voice recordings.",
          strength: "Image, video and audio input, fast",
          weakness: "Mainstream filter on sensitive content",
        },
        budget: {
          description:
            "Nuanced text translation for long documents at the lowest price here.",
          strength: "Brilliant tier, open content policy",
          weakness: "Text only. Cannot read images or audio",
        },
      },
    },
    businessAdvisor: {
      name: "Business Advisor",
      description: "Business strategy, operations, and growth",
      tagline: "Strategic Growth",
      shortDesc: "Business strategy and advice",
      suggestedPrompts: {
        0: "Help me develop a business strategy",
        1: "Analyze my business model",
        2: "How can I scale my operations?",
        3: "Review my go-to-market plan",
      },
      variants: {
        elonTusk: "Bold",
        chineseWisdom: "Budget",
        techBro: "Precise",
      },
      variantInfo: {
        elonTusk: {
          description: "Blunt strategy calls. Tells you when the plan is weak.",
          strength: "Brilliant tier, open policy, 500K context",
          weakness: "Half the context of the 1M options here",
        },
        chineseWisdom: {
          description:
            "Daily strategy work at the lowest cost. Reads charts, decks and screenshots.",
          strength: "Brilliant tier, cheapest here, 1M context",
          weakness: "Long reports get pricey on output",
        },
        techBro: {
          description:
            "Numbers, models and plans you can hand to a team. Strong with tools.",
          strength: "Reliable structure and tool use",
          weakness: "Most expensive here, mainstream filter",
        },
      },
    },
    careerCoach: {
      name: "Career Coach",
      description: "Career development, job search, and interviews",
      tagline: "Advance Your Career",
      shortDesc: "Career development and guidance",
      suggestedPrompts: {
        0: "Help me improve my resume",
        1: "Prepare me for a job interview",
        2: "How can I negotiate my salary?",
        3: "Plan my career transition",
      },
      variants: {
        headhunter: "Headhunter",
        intern: "Fast",
      },
      variantInfo: {
        headhunter: {
          description:
            "Resume rewrites, mock interviews and salary scripts that hold up.",
          strength: "Polished writing, reads uploaded documents",
          weakness: "Costs far more per message than Fast",
        },
        intern: {
          description:
            "Quick answers for cover letter tweaks and interview prep on the go.",
          strength: "Fastest and cheapest option here",
          weakness: "Quick tier. Less depth on career strategy",
        },
      },
    },
    healthWellness: {
      name: "Health & Wellness",
      description: "Fitness, nutrition, and wellbeing guidance",
      tagline: "Live Better",
      shortDesc: "Health and wellness guidance",
      suggestedPrompts: {
        0: "Create a workout plan for me",
        1: "Help me plan healthy meals",
        2: "Suggest stress management techniques",
        3: "Improve my sleep habits",
      },
      variants: {
        techBro: "Thorough",
        budget: "Budget",
      },
      variantInfo: {
        techBro: {
          description:
            "Detailed training plans, nutrition breakdowns and careful health context.",
          strength: "Structured plans you can follow week by week",
          weakness: "Many times the cost of Budget per message",
        },
        budget: {
          description:
            "Quick answers on workouts, meals and habits for almost nothing.",
          strength: "Cheapest option, fast replies",
          weakness: "Quick tier: less depth on complex health questions",
        },
      },
    },
    supportAgent: {
      name: "Support Agent",
      description:
        "AI-powered technical support that knows when to call a human",
      tagline: "Fix It Fast",
      shortDesc: "Technical support with human escalation",
      suggestedPrompts: {
        0: "My app keeps crashing - help me fix it",
        1: "I can't connect to the network",
        2: "I'm getting an error message I don't understand",
        3: "Walk me through resetting my password",
      },
      variants: {
        default: "Standard",
        fast: "Fast",
      },
      variantInfo: {
        default: {
          description:
            "Careful diagnosis for tricky technical problems. Knows when to hand off.",
          strength: "Strong at debugging and step-by-step fixes",
          weakness: "Most expensive option here",
        },
        fast: {
          description:
            "Instant answers for common issues, password resets and how-tos.",
          strength: "Fastest and cheapest, reads screenshots",
          weakness: "Quick tier. Weaker on rare, deep bugs",
        },
      },
    },
    travelPlanner: {
      name: "Travel Planner",
      description: "Trip planning and travel recommendations",
      tagline: "Explore The World",
      shortDesc: "Travel planning and recommendations",
      suggestedPrompts: {
        0: "Plan a 2-week trip to...",
        1: "Suggest destinations for...",
        2: "Create a daily itinerary for...",
        3: "Budget breakdown for traveling to...",
      },
      variants: {
        snappy: "Thorough",
        budget: "Budget",
      },
      variantInfo: {
        snappy: {
          description:
            "Full itineraries with routes, budgets and backup plans.",
          strength: "Balanced reasoning at an everyday price",
          weakness: "Costs about ten times Budget",
        },
        budget: {
          description: "Quick tips, packing lists and day ideas for pennies.",
          strength: "Very cheap and fast",
          weakness: "Quick tier. Weak at complex multi-city trips",
        },
      },
    },
    legalAssistant: {
      name: "Legal Assistant",
      description: "Legal information and document understanding",
      tagline: "Know Your Rights",
      shortDesc: "Legal research and document assistance",
      suggestedPrompts: {
        0: "Explain this legal term",
        1: "Help me understand this contract",
        2: "What are my rights as a tenant?",
        3: "Explain the process of...",
      },
      variants: {
        elonTusk: "Straight Talk",
        budget: "Budget",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Plain-language legal analysis that names risks without hedging.",
          strength: "Brilliant reasoning, open content policy",
          weakness: "Many times the cost of Budget per message",
        },
        budget: {
          description:
            "Fast reads of contracts and letters. Upload a photo, get the gist.",
          strength: "Cheapest option, reads images, 1M context",
          weakness: "Smart tier: less depth on complex cases",
        },
      },
    },
    financialAdvisor: {
      name: "Financial Advisor",
      description: "Personal finance, budgeting, and investing",
      tagline: "Build Wealth",
      shortDesc: "Financial planning and advice",
      suggestedPrompts: {
        0: "Help me create a budget",
        1: "Explain investment basics",
        2: "How should I pay off my debt?",
        3: "Plan for retirement savings",
      },
      variants: {
        elonTusk: "Bold",
        chineseWisdom: "Deep",
        techBro: "Premium",
        yolo: "Budget",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Direct takes on risk, debt and investing without the compliance-speak.",
          strength: "Brilliant tier, open content policy",
          weakness: "Bold takes still need your own checks",
        },
        chineseWisdom: {
          description:
            "Long-horizon planning for budgets and retirement. Reads statements and charts.",
          strength: "Brilliant tier, 1M context",
          weakness: "Costs more than Budget",
        },
        techBro: {
          description:
            "Complex scenarios, tax trade-offs and portfolio math done carefully.",
          strength: "Top-quality analysis",
          weakness: "Most expensive option here",
        },
        yolo: {
          description:
            "Everyday money questions, budgets and debt plans at the lowest cost here.",
          strength: "Cheapest here, solid reasoning",
          weakness: "Smart tier. Less depth on complex cases",
        },
      },
    },
    socialMediaManager: {
      name: "Social Media Manager",
      description: "Social media content and strategy",
      tagline: "Engage & Grow",
      shortDesc: "Social media strategy and content",
      suggestedPrompts: {
        0: "Create Instagram captions for...",
        1: "Develop a content calendar",
        2: "Suggest hashtags for...",
        3: "Write engaging tweets about...",
      },
      variants: {
        snappy: "Sharp",
        budget: "Budget",
      },
      variantInfo: {
        snappy: {
          description:
            "Strategy, hooks and campaign plans that need real thinking.",
          strength: "Premium reasoning, reads screenshots",
          weakness: "Mainstream filter, skips edgy angles",
        },
        budget: {
          description:
            "Quick captions, post ideas and hashtag batches for pennies.",
          strength: "Very cheap and fast",
          weakness: "Quick tier. Thin on strategy",
        },
      },
    },
    productManager: {
      name: "Product Manager",
      description: "Product strategy, roadmaps, and user research",
      tagline: "Ship Great Products",
      shortDesc: "Product management and roadmapping",
      suggestedPrompts: {
        0: "Help me prioritize features",
        1: "Create user stories for...",
        2: "Analyze product-market fit",
        3: "Develop a product roadmap",
      },
      variants: {
        techBro: "Thorough",
        fast: "Fast",
      },
      variantInfo: {
        techBro: {
          description:
            "Full specs, roadmaps and research synthesis, strong with tools.",
          strength: "Structured thinking, strong agent work",
          weakness: "Over twice the cost of Fast",
        },
        fast: {
          description:
            "Quick prioritization, user story drafts and screenshot feedback.",
          strength: "Fast replies, reads images, video and audio",
          weakness: "Smart tier: less depth on big strategy calls",
        },
      },
    },
    debater: {
      name: "Debater",
      description: "Engage in intellectual debates on controversial topics",
      tagline: "Argue All Sides",
      shortDesc: "Intellectual debates and multiple perspectives",
      suggestedPrompts: {
        0: "Debate the ethics of AI development",
        1: "Present arguments for and against universal basic income",
        2: "Discuss free speech vs. hate speech",
        3: "Analyze different political ideologies",
      },
      variants: {
        elonTusk: "Bold",
        chineseWisdom: "Budget",
        techBro: "Measured",
        uncensored: "Uncensored",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Takes a side and fights for it. Handles most controversial topics head on.",
          strength: "Brilliant tier, open content policy",
          weakness: "Open, not uncensored. Can still soften the edges",
        },
        chineseWisdom: {
          description:
            "Structured arguments for and against at the lowest cost here.",
          strength: "Brilliant tier, cheapest here",
          weakness: "Mainstream on politics. Hedges hot topics",
        },
        techBro: {
          description:
            "Careful steelmanning of both sides on ethics, tech and policy.",
          strength: "Clear, well-organized arguments",
          weakness: "Mainstream filter. Refuses or hedges edgy takes",
        },
        uncensored: {
          description:
            "Argues any position, including the unpopular ones. No steer back to the consensus.",
          strength: "Best here for heterodox views and politics",
          weakness: "32K context and a flat price per message",
        },
      },
    },
    philosopher: {
      name: "Philosopher",
      description: "Explore deep philosophical questions without constraints",
      tagline: "Seek Truth",
      shortDesc: "Deep philosophical exploration and analysis",
      suggestedPrompts: {
        0: "What is the nature of consciousness?",
        1: "Do we have free will or is everything determined?",
        2: "Is there objective morality?",
        3: "What makes a life meaningful?",
      },
      variants: {
        elonTusk: "Bold",
        chineseWisdom: "Balanced",
        techBro: "Analytical",
        uncensored: "Uncensored",
      },
      variantInfo: {
        elonTusk: {
          description:
            "Takes positions and defends them. Open policy, few dodges.",
          strength: "Brilliant reasoning without moral hedging",
          weakness: "Pricier than Balanced, 500K context",
        },
        chineseWisdom: {
          description:
            "Long, patient dialogues across ethics, metaphysics and mind.",
          strength: "Brilliant tier, cheapest here, 1M context",
          weakness: "Mainstream on politics, softens hard takes",
        },
        techBro: {
          description: "Tight arguments, clean logic, every premise checked.",
          strength: "Rigorous structure, spots weak premises",
          weakness: "Mainstream filter, pricier than Balanced",
        },
        uncensored: {
          description:
            "Political philosophy, taboo and heterodox questions with no filter.",
          strength: "Best on the platform for politics and heterodox views",
          weakness: "32K context, smart tier, flat price per message",
        },
      },
    },
    uncensoredWriter: {
      name: "Uncensored Writer",
      description: "Creative writing without artificial limitations",
      tagline: "Write Freely",
      shortDesc: "Unrestricted creative writing and storytelling",
      suggestedPrompts: {
        0: "Write a dark psychological thriller",
        1: "Create a mature romance scene",
        2: "Develop a morally complex skill",
        3: "Write horror with graphic elements",
      },
      variants: {
        smart: "Provocative",
        fast: "Fast",
        deep: "Deep",
      },
      variantInfo: {
        smart: {
          description:
            "Dark and taboo fiction, political satire that names names.",
          strength: "Best here for dark, taboo and political fiction",
          weakness: "32K context, priciest per message",
        },
        fast: {
          description:
            "Quick uncensored drafts, scenes and roleplay prose for pennies.",
          strength: "Cheapest uncensored model",
          weakness: "Quick tier. Loses the thread in long works",
        },
        deep: {
          description:
            "Long-form uncensored fiction. Whole novels stay in memory.",
          strength: "Brilliant tier, 1M context, tools",
          weakness: "Plays it safe on politics, pricier than Fast",
        },
      },
    },
    roleplaySkill: {
      name: "Roleplay Skill",
      description: "Immersive skill roleplay without restrictions",
      tagline: "Become Anyone",
      shortDesc: "Authentic skill roleplay and scenarios",
      suggestedPrompts: {
        0: "Roleplay as a fantasy skill",
        1: "Create a sci-fi adventure scenario",
        2: "Embody a historical figure",
        3: "Develop a complex skill relationship",
      },
      variants: {
        creative: "Creative",
        deep: "Deep",
        uncensored: "Uncensored",
      },
      variantInfo: {
        creative: {
          description: "Lively characters and long scenes at a very low price.",
          strength: "Cheapest option, open content policy",
          weakness: "Open, not uncensored: softens the darkest scenes",
        },
        deep: {
          description:
            "Consistent characters with rich inner life across long campaigns.",
          strength: "Brilliant tier, remembers the whole story",
          weakness: "Softens dark or political scenes",
        },
        uncensored: {
          description: "Any character, any scene. Dark and taboo stay dark.",
          strength: "Best here for dark and taboo roleplay",
          weakness: "32K context: forgets early scenes, flat price",
        },
      },
    },
    researchAgent: {
      name: "Web Agent",
      description:
        "Searches the web, reads pages, cross-references sources. Remembers findings across sessions. Discovers browser tools when available.",
      tagline: "Search · Read · Verify",
      shortDesc: "Web search, URL reading, and fact-checking",
      suggestedPrompts: {
        0: "Research the latest developments in AI regulation",
        1: "Find and summarize key facts about a topic",
        2: "Compare different sources on a subject",
        3: "Compile a research brief with citations",
      },
      variants: {
        kimi: "Balanced",
        gemini: "Deep",
        flash: "Fast",
        grok: "Open",
        claude: "Budget",
      },
      variantInfo: {
        kimi: {
          description:
            "Searches, reads and cross-checks with top reasoning at an everyday price.",
          strength: "Brilliant tier, 1M context, reads images and video",
          weakness: "Mainstream on politics, long reports add up",
        },
        gemini: {
          description: "Deep research across pages, video and audio sources.",
          strength: "Brilliant tier, reads every media type",
          weakness: "Priciest variant here, mainstream filter",
        },
        flash: {
          description: "Quick lookups and page reads with multimodal input.",
          strength: "Fast, reads images, video and audio",
          weakness: "Smart tier, not the cheapest option",
        },
        grok: {
          description: "Fast searches on topics mainstream models dodge.",
          strength: "Open content policy, very cheap",
          weakness: "Quick tier: shallow cross-checking",
        },
        claude: {
          description:
            "Simple lookups and page summaries for the lowest price.",
          strength: "Cheapest option, reliable with tools",
          weakness: "Quick tier, mainstream filter",
        },
      },
    },
    statsAnalyst: {
      name: "Stats Analyst",
      description:
        "Analytics specialist with access to leads, users, email, and referral statistics for data-driven insights",
      tagline: "Data-Driven Insights",
      shortDesc: "Platform analytics and reporting",
      suggestedPrompts: {
        0: "Show me an overview of today's lead activity",
        1: "How are our user signups trending this week?",
        2: "Summarize email campaign performance",
        3: "Give me a referral program status report",
      },
      variants: {
        gemini: "Deep",
        fast: "Fast",
      },
      variantInfo: {
        gemini: {
          description:
            "Full analysis across leads, users, email and referrals. Spots the real trend.",
          strength: "Brilliant reasoning across many tool calls",
          weakness: "Over twice the cost of Fast",
        },
        fast: {
          description: "Quick stat pulls and daily numbers check.",
          strength: "Fast answers, solid tool use",
          weakness: "Shallower on multi-step analysis",
        },
      },
    },
    cronManager: {
      name: "Cron Manager",
      description:
        "Task scheduler specialist that can create, update, delete, and monitor cron jobs and their execution history",
      tagline: "Schedule & Monitor",
      shortDesc: "Cron task management and monitoring",
      suggestedPrompts: {
        0: "List all active cron tasks and their schedules",
        1: "Create a new cron task that runs every hour",
        2: "Show me recent task failures and errors",
        3: "Check the overall health of the task system",
      },
      variants: {
        gemini: "Thorough",
        fast: "Fast",
      },
      variantInfo: {
        gemini: {
          description:
            "Digs through failure history and untangles complex schedules.",
          strength: "Brilliant tier, careful with multi-step changes",
          weakness: "More than twice the cost of Fast",
        },
        fast: {
          description:
            "Quick list, create and status checks for routine cron work.",
          strength: "Cheaper and quick on routine tasks",
          weakness: "Smart tier. Less careful on tangled failures",
        },
      },
    },
    systemMonitor: {
      name: "System Monitor",
      description:
        "Infrastructure health specialist monitoring server status, database connectivity, pulse checks, and task execution",
      tagline: "Watch & Alert",
      shortDesc: "Infrastructure health monitoring",
      suggestedPrompts: {
        0: "Run a full system health check",
        1: "Show me the pulse monitoring status",
        2: "Check database connectivity",
        3: "What's the current background task health?",
      },
      variants: {
        fast: "Smart",
        budget: "Budget",
      },
      variantInfo: {
        fast: {
          description:
            "Health checks plus real diagnosis when pulses or cron tasks fail.",
          strength: "Reads logs and history with more insight",
          weakness: "Costs several times more than Budget",
        },
        budget: {
          description: "Routine status checks and db pings around the clock.",
          strength: "Fastest and cheapest, reliable tool calls",
          weakness: "Quick tier. Thin on root-cause analysis",
        },
      },
    },
    publicCurator: {
      name: "Public Curator",
      description:
        "Content management specialist for managing public threads, messages, and community content",
      tagline: "Curate & Organize",
      shortDesc: "Public content and thread management",
      suggestedPrompts: {
        0: "List recent public threads",
        1: "Search threads for a specific topic",
        2: "Help me organize community content",
        3: "Find messages matching certain criteria",
      },
      variants: {
        gemini: "Thorough",
        fast: "Fast",
      },
      variantInfo: {
        gemini: {
          description:
            "Careful review of public threads, including images, video and audio.",
          strength: "Brilliant tier, reads every media type",
          weakness: "Over twice the cost of Fast",
        },
        fast: {
          description:
            "Quick sorting, tagging and cleanup of community content.",
          strength: "Fast multimodal at a lower price",
          weakness: "Smart tier: weaker on borderline calls",
        },
      },
    },
    codeArchitect: {
      name: "Code Architect",
      description:
        "Architecture specialist that delegates coding tasks to Claude Code for implementation. Available on Hermes only.",
      tagline: "Design & Delegate",
      shortDesc: "Architecture decisions via Claude Code",
      suggestedPrompts: {
        0: "Plan the implementation of a new feature",
        1: "Review the architecture of a module",
        2: "Delegate a coding task to Claude Code",
        3: "Design a migration strategy",
      },
      variants: {
        gemini: "Big Picture",
        techBro: "Coding Pro",
      },
      variantInfo: {
        gemini: {
          description:
            "System design and migration plans across large codebases before handing off.",
          strength: "Brilliant tier, reads diagrams, video, audio",
          weakness: "Less hands-on with code than Coding Pro",
        },
        techBro: {
          description:
            "Specs written the way Claude Code executes them. Tight task breakdowns.",
          strength: "Strong coding and agent work",
          weakness: "Smart tier, not brilliant, on deep design calls",
        },
      },
    },
    deploymentAgent: {
      name: "Deployment Agent",
      description:
        "Deployment specialist that handles builds, releases, and server management via SSH. Available on Hermes only.",
      tagline: "Build & Deploy",
      shortDesc: "Deployments and server management",
      suggestedPrompts: {
        0: "Build the application for production",
        1: "Check server health status",
        2: "Run a deployment to production",
        3: "Show me the current server status",
      },
      variants: {
        techBro: "Reliable",
        budget: "Budget",
      },
      variantInfo: {
        techBro: {
          description:
            "Builds, releases and SSH work where one wrong command costs you.",
          strength: "Strong agent work, careful with tools",
          weakness: "Much pricier per message than Budget",
        },
        budget: {
          description:
            "Routine health checks and status reports for a fraction of the cost.",
          strength: "Cheapest and fastest here",
          weakness: "Quick tier. Riskier on complex rollouts",
        },
      },
    },
    rebuildAgent: {
      name: "Rebuild Agent",
      description:
        "Build and restart specialist that rebuilds the application and hot-restarts the server with zero-downtime via SIGUSR1 signaling",
      tagline: "Build & Restart",
      shortDesc: "Application rebuild and hot-restart",
      suggestedPrompts: {
        0: "Rebuild and restart the production server",
        1: "Run a build without restarting",
        2: "Check if the server is healthy after rebuild",
        3: "Create a scheduled rebuild task",
      },
      variants: {
        gemini: "Thorough",
        fast: "Fast",
      },
      variantInfo: {
        gemini: {
          description:
            "Rebuilds, restarts and digs into build errors before giving up.",
          strength: "Brilliant tier, best at diagnosing failed builds",
          weakness: "Over twice the cost of Fast",
        },
        fast: {
          description:
            "Routine rebuild and restart when the build is expected to pass.",
          strength: "Quick turnaround at a lower price",
          weakness: "Smart tier: weaker on tangled build errors",
        },
      },
    },
    vibeCoder: {
      name: "Vibe Coder",
      description:
        "Lead implementation agent that bridges feature ideas and production code. Deep-dives the codebase via Claude Code, extracts intent from requests, and implements aligned solutions.",
      tagline: "Idea to Code",
      shortDesc: "Feature implementation via Claude Code",
      suggestedPrompts: {
        0: "I have an idea for a new feature, let me describe it",
        1: "Explore the codebase and explain how a module works",
        2: "Help me plan and implement a change to an existing feature",
        3: "Investigate a bug and propose a fix",
      },
      variants: {
        budget: "Cheap & Smart",
        open: "Open Frontier",
        fast: "Sharp",
        max: "Max",
        broad: "Broad",
      },
    },
    skillCreator: {
      name: "Skill Creator",
      description:
        "Design and create AI skills with tailored personalities, system prompts, tools, and model configurations. Manages favorites and settings too.",
      tagline: "Design AI Skills",
      shortDesc: "Create and manage AI skills",
      suggestedPrompts: {
        0: "Help me create a new AI skill for coding assistance",
        1: "Show me all existing skills and suggest what's missing",
        2: "Design a skill for creative writing with a unique personality",
        3: "Add a skill to my favorites and configure my chat settings",
      },
      variants: {
        cheapAndSmart: "Budget",
        brilliant: "Precise",
      },
      variantInfo: {
        cheapAndSmart: {
          description:
            "Draft and iterate on skills cheaply. Plenty of brains for prompts and configs.",
          strength: "Brilliant tier, cheaper per message",
          weakness: "Long system prompts cost more on output",
        },
        brilliant: {
          description:
            "Tight system prompts and clean tool setups when the skill has to be right.",
          strength: "Strong agent and tool work",
          weakness: "Pricier, and mainstream on edgy personas",
        },
      },
    },
    heilpraktikerPruefung: {
      name: "HP Exam Trainer",
      description:
        "Realistic oral Heilpraktiker exam simulation with adaptive difficulty",
      tagline: "Mündliche Prüfung",
      shortDesc: "Heilpraktiker exam preparation",
      suggestedPrompts: {
        0: "Starten wir die Prüfung",
        1: "Prüfe mich in Innerer Medizin",
        2: "Stelle mir einen klinischen Fall vor",
        3: "Fragen zur Gesetzeskunde bitte",
      },
      variants: {
        smart: "Balanced",
        precise: "Precise",
        thorough: "Thorough",
        quick: "Quick",
      },
      variantInfo: {
        smart: {
          description:
            "Realistic oral exam with solid medical depth at an everyday price.",
          strength: "Top-tier reasoning, keeps long sessions in view",
          weakness: "Long examiner feedback adds up in cost",
        },
        precise: {
          description:
            "Exact questions and crisp corrections. Strict on terminology and law.",
          strength: "Clear, concise corrections, cheaper than Balanced",
          weakness: "Mid tier: less nuance on tricky differentials",
        },
        thorough: {
          description:
            "Deep follow-up questions and detailed debriefs, closest to the real examiner.",
          strength: "Most detailed feedback on gaps and red flags",
          weakness: "Most expensive variant of this trainer",
        },
        quick: {
          description:
            "Fast drill rounds for repetition between full exam simulations.",
          strength: "Cheapest option, instant replies",
          weakness: "Quick tier: shallow on complex cases",
        },
      },
    },
    qualityTester: {
      name: "Quality Tester",
      description:
        "Test user that tries platform features naturally. Stops and reports clearly when something breaks instead of retrying.",
      tagline: "Find Bugs",
      shortDesc: "Platform testing persona",
      suggestedPrompts: {
        0: "Make me a picture of a sunset",
        1: "What tools do you have?",
        2: "Generate some music, something chill",
        3: "Make a short video of a cat",
      },
      variants: {
        budget: "Budget",
        visual: "Visual",
        nativeImage: "Native Image",
        nanoBananaPro: "Nano Banana Pro",
      },
      variantInfo: {
        budget: {
          description:
            "Runs platform features like a real user and reports what breaks.",
          strength: "Cheapest test runs, full tool support",
          weakness: "Cannot generate images natively",
        },
        nativeImage: {
          description:
            "Tests native image output from an image generation model.",
          strength: "Checks the native image generation path",
          weakness: "No tool calling, cannot test other features",
        },
      },
    },
  },
  get: {
    title: "Skills",
    titleShort: "Skills",
    dynamicTitle: "Skills ({{count}})",
    description: "Get all available skills (default + custom)",
    fields: {
      query: {
        label: "Search (optional)",
        description:
          "Filter skills by keyword. Space-separated words are all required (e.g. 'image gen' matches 'image generation'). Case-insensitive substring match across name, tagline, description, category. Omit to list all skills.",
        placeholder: "e.g. research, image gen, coding",
      },
      skillId: {
        label: "Skill ID",
        description:
          "Get full details for a specific skill by its ID. Returns system prompt, tools, and model config.",
      },
      page: {
        label: "Page",
        description:
          "Page number for paginated results (AI/MCP: default page size 25).",
      },
      pageSize: {
        label: "Page Size",
        description:
          "Number of skills per page (1–500). AI/MCP callers default to 25; human callers return all.",
      },
      sourceFilter: {
        label: "Source",
        description:
          "Filter skills by source: built-in, community, or your own custom skills.",
      },
      targetUserId: {
        label: "Target User ID",
        description: "Admin only: view skills for a specific user.",
      },
    },
    container: {
      title: "Skills List",
      description: "All available skills for the user",
    },
    createButton: {
      label: "Create Custom Skill",
    },
    openFullPage: "Open full page",
    browser: {
      advancedModelAccess: "Choose Your AI Experience",
      configureFiltersText:
        "Select models directly or start with pre-configured skills",
      aiModels: "AI models",
      configureAiModelsTitle: "Direct Model Selection",
      advancedChooseText:
        "Choose from {{count}} models with fine-tuned control over intelligence, content, and cost",
      modelsWithCustomFilters: "models with custom filters",
      configureButton: "Configure",
      selectButton: {
        label: "Explore Models",
      },
      skillPresets: "Ready-to-Use Skills",
      pickSkillText:
        "Start with expert-tuned skills that have the perfect model already selected. Fine-tune settings anytime.",
    },
    signupPrompt: {
      title: "Create your own AI skills",
      description:
        "Design custom skills with unique personalities and behaviors. Sign up to get started.",
      backButton: "Browse Skills",
      signupButton: "Create Account",
      loginButton: "Log In",
    },
    search: {
      placeholder: "Search skills...",
      noResults: "No skills match your search",
      results: "Search results",
    },
    card: {
      actions: {
        inCollection: "In your collection",
        addAnother: "Add another",
        addToCollection: "Add to collection:",
        quick: "Quick",
        customize: "Customize",
        useNow: "Activate",
        inUse: "Active",
        goToChat: "Go to Chat",
        useThis: "Use This",
        chooseFavorite: "Choose model",
        selectFavorite: "Pick the model to chat with:",
        addVariant: "Add another model",
        view: "View",
        edit: "Edit",
        vote: "Vote",
        report: "Report",
        addMissing: "Add all models to My Skills",
        add: "Add",
        added: "Added",
      },
      showVariants: "Models ({{count}})",
    },
    section: {
      showMore: "Show {{count}} more",
      showLess: "Show less",
      browseAll: "Browse all",
    },
    response: {
      skills: {
        skill: {
          title: "Skill",
          id: { content: "Skill ID" },
          name: { content: "Skill Name" },
          tagline: { content: "Skill Tagline" },
          description: { content: "Skill Description" },
          icon: { content: "Skill Icon" },
          systemPrompt: { content: "System Prompt" },
          category: { content: "Category" },
          source: { content: "Source" },
          ownershipType: { content: "Ownership Type" },
          preferredModel: { content: "Preferred Model" },
          voice: { content: "Voice" },
          suggestedPrompts: { content: "Suggested Prompts" },
          requirements: { content: "Requirements" },
          modelSelection: { title: "Model Selection" },
          selectionType: { content: "Selection Type" },
          minIntelligence: { content: "Minimum Intelligence" },
          maxIntelligence: { content: "Maximum Intelligence" },
          minPrice: { content: "Minimum Price" },
          maxPrice: { content: "Maximum Price" },
          minContent: { content: "Minimum Content Level" },
          maxContent: { content: "Maximum Content Level" },
          preferredStrengths: { content: "Preferred Strengths" },
          ignoredWeaknesses: { content: "Ignored Weaknesses" },
          manualModelId: { content: "Manual Model" },
          separator: { content: "•" },
          actions: {
            directModelButton: {
              label: "Direct Model",
            },
          },
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to access custom skills",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this resource",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving skills",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred with the current state",
      },
    },
    success: {
      title: "Success",
      description: "Skills retrieved successfully",
    },
  },
  post: {
    title: "Create Skill",
    titleShort: "Create Skill",
    dynamicTitle: "Create: {{name}}",
    description: "Create a new custom skill",
    form: {
      title: "Create Your Custom Skill",
      description:
        "Design a unique AI skill with custom behavior, personality, and capabilities. Choose a specific model or let the system select based on your requirements.",
    },
    submitButton: {
      text: "Create Custom Skill",
      loadingText: "Creating Skill...",
    },
    backButton: {
      label: "Back",
    },
    container: {
      title: "Create New Skill",
      description: "Define a new custom skill",
    },
    name: {
      label: "Skill Name",
      description:
        "Give your skill a memorable name. This is how you and others will identify them.",
      placeholder: "Enter skill name",
      validation: {
        minLength: "Name must be at least 2 skills",
        maxLength: "Name must be less than 100 skills",
      },
    },
    tagline: {
      label: "Skill Tagline",
      description:
        "A catchy one-liner that captures the essence of your skill. Keep it short and descriptive.",
      placeholder: "Enter a short tagline",
      validation: {
        minLength: "Tagline must be at least 2 skills",
        maxLength: "Tagline must be less than 500 skills",
      },
    },
    icon: {
      label: "Skill Icon",
      description:
        "Icon name for this skill (e.g. 'brain', 'technologist', 'zap'). Use vibe help --toolName=icon-list to browse available names.",
    },
    skillDescription: {
      label: "Skill Description",
      description:
        "Describe what makes this skill unique. What's their role? What can they help with? Be specific and detailed.",
      placeholder: "Describe your skill's purpose and capabilities",
      validation: {
        minLength: "Description must be at least 10 skills",
        maxLength: "Description must be less than 500 skills",
      },
    },
    category: {
      label: "Category",
      description:
        "Choose the category that best fits your skill. This helps with organization and discovery.",
    },
    isPublic: {
      label: "Make Public",
      description:
        "Enable this to share your skill with the community. When disabled, the skill remains private and only visible to you.",
    },
    chatModel: {
      label: "Chat Model",
      placeholder: "System default",
    },
    voice: {
      label: "Voice (TTS)",
      description:
        "Text-to-speech voice for this skill. null = user's global voice preference wins (bridge model: user setting takes priority over skill). Set only when this skill has a signature voice (e.g., a narrator persona).",
      placeholder: "System default",
    },
    sttModel: {
      label: "Speech-to-Text Model",
      description:
        "Speech recognition model. null = user preference wins (bridge model). Set only if this skill requires specific accuracy (e.g., medical transcription).",
      placeholder: "System default",
    },
    imageVisionModel: {
      label: "Image Vision Model",
      description:
        "Multimodal LLM for analyzing image inputs. null = user preference wins (bridge model). Set when this skill specifically needs a particular vision model's capabilities.",
      placeholder: "System default",
    },
    videoVisionModel: {
      label: "Video Vision Model",
      description:
        "Multimodal LLM for analyzing video inputs. null = user preference wins (bridge model). Set when this skill requires video understanding.",
      placeholder: "System default",
    },
    audioVisionModel: {
      label: "Audio Vision Model",
      description:
        "Multimodal LLM for analyzing audio inputs. null = user preference wins (bridge model). Set when this skill requires audio understanding.",
      placeholder: "System default",
    },
    imageGenModel: {
      label: "Image Generation Model",
      description:
        "Image generation model. Takes priority over user settings when set (media gen: skill intent wins). Set when this skill IS an image generator (e.g., 'Flux Artist'). null = use user's global image gen preference.",
      placeholder: "System default",
    },
    musicGenModel: {
      label: "Music Generation Model",
      description:
        "Music generation model. Takes priority over user settings when set (media gen: skill intent wins). Set when this skill IS a music composer. null = use user's global music gen preference.",
      placeholder: "System default",
    },
    videoGenModel: {
      label: "Video Generation Model",
      description:
        "Video generation model. Takes priority over user settings when set (media gen: skill intent wins). Set when this skill IS a video creator. null = use user's global video gen preference.",
      placeholder: "System default",
    },
    systemPrompt: {
      label: "System Prompt",
      description:
        "Define your skill's behavior, personality, and expertise. This is the core instruction that shapes how the AI responds. Be detailed about tone, knowledge areas, and conversation style.",
      placeholder: "You are a helpful assistant who specializes in...",
      validation: {
        minLength: "System prompt must be at least 10 skills",
        maxLength: "System prompt must be less than 5000 skills",
      },
    },
    modelSelection: {
      title: "Model Selection",
      label: "Model Selection",
      description:
        "Chat model for this skill. FILTERS (recommended): set intelligenceRange/priceRange/contentRange - system picks best available. Use MANUAL only when you need a specific model's unique capabilities (reasoning models, specific uncensored model). null = platform default. See MODEL-RESOLUTION.md for full priority rules.",
    },
    variants: {
      label: "Variants",
      description:
        "Named variants with per-variant model selections. Each variant needs: id (unique string), modelSelection (required), isDefault (exactly one must be true). Optional: displayName, voice/vision/gen model overrides.",
    },
    availableTools: {
      label: "Allowed Tools",
      description:
        "List of tools this skill can use. Each entry needs a toolId (use system_help_GET to discover available tool IDs). Set requiresConfirmation: true to prompt before executing. Pass null to inherit from global settings.",
    },
    pinnedTools: {
      label: "Pinned Tools",
      description:
        "Tools pinned to the toolbar for quick access when using this skill. Subset of availableTools. Pass null to use default pinned tools.",
    },
    compactTrigger: {
      label: "Compact Trigger (tokens)",
      description:
        "Token count that triggers automatic conversation compaction. Set to null to use global default.",
    },
    selectionType: {
      label: "Selection Type",
      skillBased: "Based on Skill",
      manual: "Specific Model",
      filters: "Filter Criteria",
    },
    preferredModel: {
      label: "Preferred Model",
      description: "Select a specific AI model to always use with this skill",
      helpText: "Choosing a specific model locks this skill to that model only",
    },
    intelligence: {
      label: "Intelligence Level",
      description:
        "Minimum intelligence/capability level required for the model",
    },
    intelligenceRange: {
      label: "Intelligence Range",
      description: "Required intelligence/capability level for the model",
      minLabel: "Min Intelligence",
      maxLabel: "Max Intelligence",
    },
    minIntelligence: {
      label: "Minimum Intelligence",
      description:
        "Minimum intelligence/capability level required for the model",
    },
    maxIntelligence: {
      label: "Maximum Intelligence",
      description:
        "Maximum intelligence/capability level allowed for the model",
    },
    priceRange: {
      label: "Price Range",
      description: "Credit cost range per message",
      minLabel: "Min Price",
      maxLabel: "Max Price",
    },
    minPrice: {
      label: "Minimum Price",
      description: "Minimum credit cost per message with this skill",
    },
    maxPrice: {
      label: "Maximum Price",
      description:
        "Maximum credit cost you're willing to spend per message with this skill",
    },
    contentLevel: {
      label: "Content Level",
      description:
        "Content filtering level for the model (mainstream, open, or uncensored)",
    },
    contentRange: {
      label: "Content Range",
      description: "Content moderation level range",
      minLabel: "Min Content",
      maxLabel: "Max Content",
    },
    minContent: {
      label: "Minimum Content Level",
      description: "Minimum content moderation level for the model",
    },
    maxContent: {
      label: "Maximum Content Level",
      description: "Maximum content moderation level for the model",
    },
    preferredStrengths: {
      label: "Preferred Strengths",
      description: "Model capabilities and strengths to prefer",
      item: "Strength",
    },
    ignoredWeaknesses: {
      label: "Ignored Weaknesses",
      description: "Model weaknesses to ignore or allow",
      item: "Weakness",
    },
    manualModelId: {
      label: "Manual Model",
      description: "Specific model to always use with this skill",
    },
    suggestedPrompts: {
      label: "Suggested Prompts",
      description: "Example prompts to use with this skill",
      placeholder: "Add a suggested prompt...",
    },
    response: {
      id: { content: "Created Skill ID" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The skill data is invalid",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to create skills",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to create skills",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while creating the skill",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A skill with this name already exists",
      },
    },
    success: {
      title: "Skill Created",
      description: "Your custom skill has been created successfully",
    },
  },
  onboarding: {
    success: {
      title: "{{companion}} is ready to chat!",
      subtitle:
        "Now pick specialists for specific tasks - or skip and add them anytime later",
    },
    bottom: {
      title: "Ready to start chatting?",
      description:
        "You can always come back to add more specialists whenever you need them",
      button: "Start Chatting",
    },
  },
  selector: {
    free: "FREE",
  },
  credits: {
    credit: "{{count}} credit",
    credits: "{{count}} credits",
  },
};
