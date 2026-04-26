export const translations = {
  category: "Information",
  get: {
    title: "Search the Web",
    dynamicTitle: "Search: {{query}}",
    description:
      "Search the internet for current information, news, facts, or recent events. Automatically routes to your preferred search provider.",
    form: {
      title: "Web Search",
      description: "Search the web with your preferred provider",
    },
    submitButton: {
      label: "Search",
      loadingText: "Searching...",
    },
    backButton: {
      label: "Back",
    },
    fields: {
      query: {
        title: "Search Query",
        description:
          "Clear and specific search query. Use keywords rather than questions.",
        placeholder: "Enter your search query...",
      },
      provider: {
        title: "Search Provider",
        description:
          "Which search engine to use. Auto picks your default or the cheapest available.",
        options: {
          auto: "Auto (recommended)",
          brave: "Brave Search",
          kagi: "Kagi FastGPT",
        },
      },
      maxResults: {
        title: "Max Results",
        description: "Number of results to return (1-10). Brave only.",
      },
      includeNews: {
        title: "Include News",
        description: "Include news results for current events. Brave only.",
      },
      freshness: {
        title: "Freshness",
        description: "Filter results by how recent they are. Brave only.",
        options: {
          day: "Past Day",
          week: "Past Week",
          month: "Past Month",
          year: "Past Year",
        },
      },
    },
    response: {
      provider: {
        title: "Provider",
        description: "Which search provider was used",
      },
      output: {
        title: "AI Answer",
        description: "AI-generated summary (Kagi only)",
      },
      results: {
        title: "Results",
        description: "Web search results",
        result: "Result",
        item: {
          title: "Search Result",
          description: "Individual search result",
          url: "URL",
          snippet: "Snippet",
          age: "Age",
          source: "Source",
        },
      },
    },
    errors: {
      queryEmpty: {
        title: "Search query is required",
        description: "Please provide a search query",
      },
      queryTooLong: {
        title: "Search query is too long",
        description: "Query must be 400 characters or less",
      },
      noProvider: {
        title: "No search provider available",
        description:
          "No search API keys are configured. Set up Brave Search or Kagi in your .env file.",
      },
      providerUnavailable: {
        title: "Search provider not available",
        description:
          "The selected search provider is not configured. Choose a different provider or use auto.",
      },
      timeout: {
        title: "Search request timed out",
        description: "The search took too long to complete",
      },
      searchFailed: {
        title: "Search failed",
        description: "An error occurred while searching",
      },
      validation: {
        title: "Invalid Search",
        description: "Please check your search parameters and try again",
      },
      internal: {
        title: "Something Went Wrong",
        description: "We couldn't complete your search. Please try again",
      },
    },
    success: {
      title: "Search Successful",
      description: "The web search completed successfully",
    },
  },
  tags: {
    search: "Search",
    web: "Web",
    internet: "Internet",
  },
};
