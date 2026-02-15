export const translations = {
  category: "Information",
  get: {
    title: "Search the Web",
    description:
      "Search the internet for current information, news, facts, or recent events. Use this when you need up-to-date information or to verify facts.",
    form: {
      title: "Search Parameters",
      description: "Configure your web search query",
    },
    submitButton: {
      label: "Search",
      loadingText: "Searching...",
    },
    fields: {
      query: {
        title: "Search Query",
        description:
          "Clear and specific search query. Use keywords rather than questions.",
        placeholder: "Enter your search query...",
      },
      maxResults: {
        title: "Max Results",
        description: "Number of results to return (1-10)",
      },
      includeNews: {
        title: "Include News",
        description: "Include news results for current events",
      },
      freshness: {
        title: "Freshness",
        description: "Filter results by how recent they are",
        options: {
          day: "Past Day",
          week: "Past Week",
          month: "Past Month",
          year: "Past Year",
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
      query: {
        title: "Query",
        description: "The search query that was executed",
      },
      results: {
        title: "Results",
        description: "Array of search results",
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
      description: "The web search completed successfully",
    },
  },
  tags: {
    search: "Search",
    web: "Web",
    internet: "Internet",
  },
};
