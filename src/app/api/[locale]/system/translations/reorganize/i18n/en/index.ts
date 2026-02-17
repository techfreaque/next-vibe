

export const translations = {
  post: {
    title: "Reorganize Translations",
    description: "Reorganize translation files and remove unused keys",
    container: {
      title: "Translation Reorganization",
      description: "Reorganize and optimize translation files",
    },
    fields: {
      dryRun: {
        title: "Dry Run",
        description: "Preview changes without modifying files",
      },
      backup: {
        title: "Create Backup",
        description: "Create a backup before making changes",
      },
      regenerateStructure: {
        title: "Regenerate Structure",
        description: "Regenerate translation file structure based on usage",
      },
      summary: {
        title: "Summary",
      },
      output: {
        title: "Output",
      },
      duration: {
        title: "Duration",
      },
      backupPath: {
        title: "Backup Path",
      },
      changes: {
        title: "Changes",
      },
      title: "Operation Successful",
    },
    messages: {
      foundKeys: "Found Keys",
      removingKeys: "Removing Keys",
      regeneratedStructure: "Regenerated Structure",
      backupCreated: "Backup Created",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid reorganization parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions",
      },
    },
    success: {
      title: "Success",
      description: "Translation reorganization completed successfully",
    },
  },
  maintenance: "Maintenance",
};
