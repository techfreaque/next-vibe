export const translations = {
  title: "Start Guard",
  titleShort: "Start Guard",
  description: "Start guard environments for VSCode projects",
  tag: "Start",
  category: "Guard",
  container: {
    title: "Start Configuration",
    description: "Configure guard start parameters",
  },
  fields: {
    projectPath: {
      title: "Project Path",
      description: "Path to the VSCode project",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "Guard ID",
      description: "Unique identifier for the guard environment",
      placeholder: "guard_my_project_abc123",
    },
    startAll: {
      title: "Start All Guards",
      description: "Start all available guard environments",
    },
    totalStarted: {
      title: "Total Started",
    },
    output: {
      title: "Output",
    },
    startedGuards: {
      columns: {
        username: "Username",
        projectPath: "Project Path",
      },
    },
    summary: {
      title: "Summary",
    },
    status: {
      title: "Status",
    },
    hasIssues: {
      title: "Has Issues",
    },
  },
  errors: {
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    validation: {
      title: "Validation Error",
      description: "Invalid request parameters",
    },
    internal: {
      title: "Internal Error",
      description: "Internal server error occurred",
    },
    notFound: {
      title: "Not Found",
      description: "Guard environment not found",
    },
    conflict: {
      title: "Conflict",
      description: "Guard environment already started",
    },
    jailSetupFailed: "Guard jail setup failed: {{detail}}",
    vscodeSetupFailed: "VSCode integration setup failed: {{detail}}",
    startFailed: "Internal error while starting the guard: {{detail}}",
    guardIdLookupUnsupported:
      "Lookup by guard ID is not implemented yet - use the project path instead.",
    notAVscodeProject:
      "Guard requires a VSCode project - no .vscode directory in {{projectPath}}",
  },
  success: {
    title: "Success",
    description: "Guard started successfully",
  },
};
