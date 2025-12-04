import { translations as idTranslations } from "../../[id]/i18n/en";

export const translations = {
  id: idTranslations,
  category: {
    general: "General",
    creative: "Creative",
    technical: "Technical",
    education: "Education",
    controversial: "Controversial",
    lifestyle: "Lifestyle",
  },
  personas: {
    default: {
      name: "Default",
      description: "The models unmodified behavior",
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
      suggestedPrompts: {
        0: "Explain how React hooks work",
        1: "Debug this Python code snippet",
        2: "Design a scalable database schema",
        3: "Review my API architecture",
      },
    },
    biologist: {
      name: "Biologist",
      description: "Sees everything from a biologist perspective, there is no politics, its just nature.",
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
      suggestedPrompts: {
        0: "Write a poem about the ocean",
        1: "Create a unique character for a story",
        2: "Design a logo concept for a startup",
        3: "Brainstorm creative marketing campaign ideas",
      },
    },
    neet: {
      name: "NEET",
      description: "Not in Education, Employment, or Training",
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
      suggestedPrompts: {
        0: "Discuss controversial topics openly",
        1: "Give me your unfiltered opinion",
        2: "Talk about taboo subjects",
        3: "No-holds-barred debate",
      },
    },
  },
  get: {
    title: "List Personas",
    description: "Get all available personas (default + custom)",
    container: {
      title: "Personas List",
      description: "All available personas for the user",
    },
    response: {
      personas: {
        persona: {
          title: "Persona",
          id: { content: "Persona ID" },
          name: { content: "Persona Name" },
          description: { content: "Persona Description" },
          icon: { content: "Persona Icon" },
          systemPrompt: { content: "System Prompt" },
          category: { content: "Category" },
          source: { content: "Source" },
          preferredModel: { content: "Preferred Model" },
          suggestedPrompts: { content: "Suggested Prompts" },
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
        description: "You must be logged in to access custom personas",
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
        description: "An error occurred while retrieving personas",
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
      description: "Personas retrieved successfully",
    },
  },
  post: {
    title: "Create Persona",
    description: "Create a new custom persona",
    container: {
      title: "Create New Persona",
      description: "Define a new custom persona",
    },
    name: {
      label: "Name",
      description: "The name of the persona",
    },
    personaDescription: {
      label: "Description",
      description: "A brief description of the persona",
    },
    icon: {
      label: "Icon",
      description: "An emoji icon for the persona",
    },
    systemPrompt: {
      label: "System Prompt",
      description: "The system prompt that defines the persona's behavior",
    },
    category: {
      label: "Category",
      description: "The category this persona belongs to",
    },
    preferredModel: {
      label: "Preferred Model",
      description: "The preferred AI model for this persona",
    },
    suggestedPrompts: {
      label: "Suggested Prompts",
      description: "Example prompts to use with this persona",
    },
    response: {
      id: { content: "Created Persona ID" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The persona data is invalid",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to create personas",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to create personas",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while creating the persona",
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
        description: "A persona with this name already exists",
      },
    },
    success: {
      title: "Persona Created",
      description: "Your custom persona has been created successfully",
    },
  },
};
