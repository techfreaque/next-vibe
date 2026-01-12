export const translations = {
  title: "Evaluate Script",
  description:
    "Evaluate a JavaScript function inside the currently selected page",
  form: {
    label: "Evaluate Script",
    description: "Execute JavaScript in the browser page",
    fields: {
      function: {
        label: "Function",
        description: "JavaScript function declaration to execute",
        placeholder: "() => { return document.title; }",
      },
      args: {
        label: "Arguments",
        description:
          "Optional list of arguments (element UIDs) to pass to the function",
        placeholder: '[{"uid": "element-uid"}]',
        uid: {
          label: "Element UID",
          description: "The unique identifier of an element on the page",
        },
      },
    },
  },
  response: {
    success: "Script evaluation operation successful",
    result: {
      title: "Result",
      description: "Result of the script evaluation",
      executed: "Executed",
      result: "Return Value",
    },
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred during script evaluation",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to evaluate scripts",
    },
    forbidden: {
      title: "Forbidden",
      description: "Script evaluation operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred during script evaluation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during script evaluation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during script evaluation",
    },
  },
  success: {
    title: "Script Evaluated Successfully",
    description: "The JavaScript was executed successfully",
  },
};
