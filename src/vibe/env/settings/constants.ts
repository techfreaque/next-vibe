export const SYSTEM_SETTINGS_ALIAS = "system-settings" as const;

/**
 * Wizard progress in browser storage: the step index, or "done". Saving a
 * step writes .env, which restarts the dev server and reloads the page; this
 * key lets the wizard reopen where the user left off instead of vanishing.
 */
export const WIZARD_PROGRESS_STORAGE_KEY = "vibe-wizard-progress" as const;
export const WIZARD_DISMISSED_STORAGE_KEY = "vibe-wizard-dismissed" as const;
export const WIZARD_PROGRESS_DONE = "done" as const;
