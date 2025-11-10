import { translations as hooksTranslations } from "../../hooks/i18n/en";

export const translations = {
  hooks: hooksTranslations,
  widgets: {
    container: {
      noContent: "No content",
    },
    dataTable: {
      showing: "Showing",
      of: "of",
      results: "results",
    },
    linkList: {
      noResults: "No results found",
    },
    link: {
      invalidData: "Invalid link data",
    },
    markdown: {
      noContent: "No content",
    },
    errorBoundary: {
      title: "Widget Error",
      errorDetails: "Error Details",
      defaultMessage: "An error occurred while rendering this widget",
    },
    toolCall: {
      status: {
        error: "Error",
        executing: "Executing...",
        complete: "Complete",
      },
      sections: {
        request: "Request",
        response: "Response",
      },
      messages: {
        executingTool: "Executing tool...",
        errorLabel: "Error:",
        noArguments: "No arguments",
        noResult: "No result",
        metadataNotAvailable:
          "Widget metadata not available. Showing raw result.",
      },
    },
  },
};
