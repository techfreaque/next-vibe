export const translations = {
  category: "Release Executor",
  releaseExecutor: {
    processing: "Processing: {{directory}}",
    executing: "Executing: {{command}}",
    completed: "Successfully completed: {{directory}}",
    failed: "Failed to process {{directory}}",
    baseCommand: "bun pub release",
    forceUpdateCommand: "bun pub release --force-update",

    state: {
      continuing: "Continuing from previous state...",
      noState: "No existing state found, starting fresh...",
      allCompleted: "All targets have been processed successfully!",
    },

    prompts: {
      retryFailed: "Retry {{count}} failed targets?",
      targetAction: "What would you like to do with {{directory}}?",
      processTarget: "Process this target",
      skipTarget: "Skip this target",
      abortOperation: "Abort entire operation",
      continueAfterFailure: "Continue with remaining targets?",
    },

    actions: {
      skipped: "Skipped: {{directory}}",
      aborted: "Operation aborted by user",
      stopped: "Operation stopped due to failure",
      continuing: "Continuing with remaining targets...",
    },

    summary: {
      title: "Final Summary:",
      allSuccess: "All targets processed successfully!",
      failedTargets: "{{count}} targets failed. Use --continue to retry.",
    },

    forceUpdate: {
      starting: "Force updating dependencies for all targets...",
      updating: "Updating: {{directory}}",
      updated: "Updated: {{directory}}",
      failed: "Failed to update {{directory}}",
      completed: "Force update completed for all targets!",
    },

    forceRelease: {
      starting:
        "Force releasing all targets with {{versionBump}} version bump...",
    },

    weeklyUpdate: {
      starting: "Starting weekly update process...",
      targetBranch: "Target branch: {{branchName}}",
      creatingBranch: "Creating update branch...",
      gitCheckout:
        "git checkout -b {{branchName}} || git checkout {{branchName}}",
      updatingPackages: "Updating all package dependencies...",
      runningSnyk: "Running Snyk security monitoring...",
      noChanges: "No changes detected, skipping commit and PR creation",
      committing: "Committing changes...",
      pushing: "Pushing branch...",
      gitPush: "git push origin {{branchName}}",
      creatingPR: "Creating/updating pull request...",
      completed: "Weekly update completed successfully!",
      failed: "Weekly update failed:",
    },

    snyk: {
      noCredentials: "Snyk credentials not found, skipping security monitoring",
      monitoring: "Monitoring {{packageName}}...",
      failed: "Snyk monitoring failed for {{packageFile}}, continuing...",
    },

    github: {
      noToken: "GITHUB_TOKEN not found, skipping PR creation",
      prFailed: "PR creation failed, continuing...",
      prError: "PR creation error:",
      prSuccess: "PR created/updated successfully",
    },

    git: {
      findCommand:
        'find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"',
    },
  },
};
