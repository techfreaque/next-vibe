import { translations as repositoryTranslations } from "../../repository/i18n/en";

export const translations = {
  post: {
    title: "Reorganize Translations",
    description: "Reorganize translation files and remove unused keys",
    form: {
      title: "Reorganization Options",
      description: "Configure translation reorganization parameters",
    },
    container: {
      title: "Translation Reorganization",
      description: "Reorganize and optimize translation files",
    },
    fields: {
      removeUnused: {
        title: "Remove Unused Keys",
        description:
          "Remove translation keys that are not used in the codebase",
      },
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
      regenerateKeys: {
        title: "Regenerate Keys",
        description: "Regenerate translation keys based on file paths",
      },
      success: {
        title: "Operation Successful",
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
    },
    messages: {
      foundKeys: "Found Keys",
      removingKeys: "Removing Keys",
      regeneratedStructure: "Regenerated Structure",
      backupCreated: "Backup Created",
      starting: "Starting reorganization",
      scanningUsage: "Scanning usage",
      loadingFiles: "Loading files",
      dryRunCompleted: "Dry run completed",
      removedKeysFromLanguage: "Removed keys from language",
      unusedKeysLabel: "Unused keys",
      regeneratingStructure: "Regenerating structure",
      analyzingFrequency: "Analyzing frequency",
      groupingByLocation: "Grouping by location",
      generatingFiles: "Generating files",
      completed: "Completed",
      noKeysInUse: "No keys in use",
      writingFilteredTranslations: "Writing filtered translations",
      removeUnusedRequiresRegenerate:
        "removeUnused requires regenerateStructure to be enabled",
    },
    response: {
      title: "Reorganization Result",
      description: "Translation reorganization results",
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
  repository: repositoryTranslations,
};
