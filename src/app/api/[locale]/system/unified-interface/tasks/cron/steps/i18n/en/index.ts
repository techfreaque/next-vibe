export const translations = {
  put: {
    title: "Edit Task Steps",
    description: "Update the step sequence for a cron-steps task",
    container: {
      title: "Step Builder",
      description: "Define the ordered list of steps this task will execute",
    },
    fields: {
      id: {
        label: "Task ID",
        description: "Unique identifier of the task",
      },
      steps: {
        label: "Steps (JSON)",
        description:
          "Array of step definitions. Each step must have a 'type' of 'call' or 'ai_agent'.",
        placeholder: '[{"type":"call","routeId":"my-route","args":{}}]',
      },
    },
    response: {
      task: {
        title: "Updated Task",
      },
      success: {
        title: "Success",
      },
    },
    submitButton: {
      label: "Save Steps",
      loadingText: "Saving...",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided steps configuration is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to update this task",
      },
      notFound: {
        title: "Task Not Found",
        description: "The task to update could not be found",
      },
      internal: {
        title: "Internal Server Error",
        description: "An error occurred while saving the steps",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to update this task",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while updating the task",
      },
    },
    success: {
      updated: {
        title: "Steps Saved",
        description: "Task steps updated successfully",
      },
    },
  },
  widget: {
    noSteps: "No steps configured",
    addStep: "Add Step",
    removeStep: "Remove Step",
    stepType: "Step Type",
    call: "Call",
    aiAgent: "AI Agent",
    routeId: "Route ID",
    args: "Arguments",
    model: "Model",
    character: "Character",
    prompt: "Prompt",
    threadMode: "Thread Mode",
    maxTurns: "Max Turns",
    parallel: "Run in parallel",
  },
};
