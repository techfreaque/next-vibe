export const translations = {
  category: "Information",
  get: {
    title: "Search with Kagi",
    description:
      "Search the internet or get AI-powered answers using Kagi. FastGPT mode provides comprehensive answers with sources, while search mode returns direct results.",
    form: {
      title: "Search Parameters",
      description: "Configure your Kagi search query",
    },
    submitButton: {
      label: "Search",
      loadingText: "Searching...",
    },
    fields: {
      query: {
        title: "Search Query",
        description: "Clear and specific search query or question.",
        placeholder: "Enter your search query...",
      },
      mode: {
        title: "Search Mode",
        description:
          "Choose between AI-powered answers (FastGPT) or direct search results",
        options: {
          fastgpt: "FastGPT (AI-powered answers)",
          search: "Search (Direct results)",
        },
      },
    },
    response: {
      success: {
        title: "Success",
        description: "Whether the search was successful",
      },
      message: {
        title: "Message",
        description: "Status message about the search",
      },
      output: {
        title: "Answer",
        description: "AI-generated answer from FastGPT",
      },
      query: {
        title: "Query",
        description: "The search query that was executed",
      },
      references: {
        title: "References",
        description: "Source references and citations",
        reference: "Reference",
        item: {
          title: "Reference",
          description: "Source reference with citation",
          url: "URL",
          snippet: "Snippet",
        },
      },
      cached: {
        title: "Cached",
        description: "Whether results were served from cache",
      },
      timestamp: {
        title: "Timestamp",
        description: "When the search was performed",
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
      description: "The Kagi search completed successfully",
    },
  },
  tags: {
    search: "Search",
    web: "Web",
    ai: "AI",
  },
};
