export const translations = {
  app: {
    api: {
      v1: {
        core: {
          agent: {
            chat: {
              threads: {
                search: {
                  get: {
                    title: "Search Threads",
                    description:
                      "Search through chat threads with relevance scoring and snippet extraction",
                    container: {
                      title: "Search Threads",
                      description: "Search parameters and results",
                    },
                    fields: {
                      query: {
                        title: "Search Query",
                        description:
                          "Text to search for in thread titles and messages",
                      },
                      folderId: {
                        title: "Folder ID",
                        description:
                          "Optional folder ID to limit search to specific folder",
                      },
                      status: {
                        title: "Thread Status",
                        description:
                          "Optional status filter (active, archived, deleted)",
                      },
                      limit: {
                        title: "Result Limit",
                        description:
                          "Maximum number of results to return (1-100, default 20)",
                      },
                      results: {
                        title: "Search Results",
                        description:
                          "List of matching threads with relevance scores",
                        item: {
                          title: "Search Result",
                          description: "Thread matching the search query",
                          threadId: {
                            title: "Thread ID",
                            description: "Unique identifier of the thread",
                          },
                          title: {
                            title: "Thread Title",
                            description: "Title of the thread",
                          },
                          score: {
                            title: "Relevance Score",
                            description:
                              "Relevance score based on title and message matches",
                          },
                          matchedMessages: {
                            title: "Matched Messages",
                            description:
                              "Messages that matched the search query",
                            item: {
                              title: "Matched Message",
                              description: "Message matching the search query",
                              messageId: {
                                title: "Message ID",
                                description:
                                  "Unique identifier of the message",
                              },
                              snippet: {
                                title: "Snippet",
                                description:
                                  "Text snippet showing the match context",
                              },
                            },
                          },
                          createdAt: {
                            title: "Created At",
                            description: "Thread creation timestamp",
                          },
                          updatedAt: {
                            title: "Updated At",
                            description: "Thread last update timestamp",
                          },
                        },
                      },
                    },
                    success: {
                      title: "Search Successful",
                      description: "Threads searched successfully",
                    },
                    errors: {
                      validationFailed: {
                        title: "Validation Failed",
                        description: "Search parameters are invalid",
                      },
                      networkError: {
                        title: "Network Error",
                        description: "Failed to connect to the server",
                      },
                      unauthorized: {
                        title: "Unauthorized",
                        description: "You must be logged in to search threads",
                      },
                      forbidden: {
                        title: "Forbidden",
                        description:
                          "You don't have permission to search threads",
                      },
                      notFound: {
                        title: "Not Found",
                        description: "No threads found matching the query",
                      },
                      serverError: {
                        title: "Server Error",
                        description: "An error occurred while searching threads",
                      },
                      unknownError: {
                        title: "Unknown Error",
                        description: "An unexpected error occurred",
                      },
                      unsavedChanges: {
                        title: "Unsaved Changes",
                        description: "You have unsaved changes",
                      },
                      conflict: {
                        title: "Conflict",
                        description: "A conflict occurred while searching",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

