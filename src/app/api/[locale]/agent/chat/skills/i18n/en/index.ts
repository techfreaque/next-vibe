import { translations as idTranslations } from "../../[id]/i18n/en";

export const translations = {
  id: idTranslations,
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
      custom: "Custom",
    },
    source: {
      builtIn: "Built-in",
      my: "My Skills",
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
      smart: "Smart",
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
    speed: {
      fast: "Fast",
      balanced: "Balanced",
      thorough: "Thorough",
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
  },
  modelSelection: {
    sort: {
      intelligence: "Intelligence",
      price: "Price",
      speed: "Speed",
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
    },
    chan4: {
      name: "4chan AI",
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
    },
    researchAgent: {
      name: "Research Agent",
      description:
        "Web research specialist with search, fetch, and memory tools for gathering and synthesizing information",
      tagline: "Find & Synthesize",
      shortDesc: "Web research and information gathering",
      suggestedPrompts: {
        0: "Research the latest developments in AI regulation",
        1: "Find and summarize key facts about a topic",
        2: "Compare different sources on a subject",
        3: "Compile a research brief with citations",
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
        3: "What's the current cron task health?",
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
    },
  },
  get: {
    title: "List Skills",
    dynamicTitle: "Skills ({{count}})",
    description: "Get all available skills (default + custom)",
    fields: {
      query: {
        label: "Search",
        description:
          "Search skills by name, description, or category. Returns compact results.",
        placeholder: "e.g. research, coding, stats",
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
    },
    container: {
      title: "Skills List",
      description: "All available skills for the user",
    },
    createButton: {
      label: "Create Custom Skill",
    },
    browser: {
      advancedModelAccess: "Choose Your AI Experience",
      configureFiltersText:
        "Select models directly or start with pre-configured skills",
      aiModels: "AI models",
      configureAiModelsTitle: "Direct Model Selection",
      advancedChooseText:
        "Choose from {{count}} models with fine-tuned control over intelligence, speed, and cost",
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
        useNow: "Use Now",
        inUse: "In Use",
        chooseFavorite: "Choose Favorite",
        selectFavorite: "Select a favorite to activate:",
      },
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
          minSpeed: { content: "Minimum Speed" },
          maxSpeed: { content: "Maximum Speed" },
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
        "Pick an emoji that represents your skill. This icon appears whenever the skill is displayed.",
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
    voice: {
      label: "Voice",
      description:
        "Select a text-to-speech voice for audio responses. Each skill can have their own unique voice.",
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
        "Choose how to select the AI model for this skill - either pick a specific model or let the system choose based on filters",
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
    speedRange: {
      label: "Speed Range",
      description: "Response speed level range",
      minLabel: "Min Speed",
      maxLabel: "Max Speed",
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
