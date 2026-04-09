export const translations = {
  title: "Google Sheets",
  description:
    "Automatically add every new lead as a row in your Google Sheet. Connect your Google account — no API keys required.",
  connect: {
    label: "Connect Google Account",
    description: "Sign in with Google to authorize access to your spreadsheets",
  },
  connected: {
    label: "Connected",
    description: "Your Google account is connected",
  },
  spreadsheetId: {
    label: "Spreadsheet",
    description: "Select the spreadsheet where leads will be added",
    placeholder: "Select a spreadsheet…",
  },
  sheetTab: {
    label: "Sheet tab (optional)",
    description:
      "The tab name within the spreadsheet. Leave blank to use the first tab.",
    placeholder: "e.g. Leads",
  },
  saveTag: "lead-magnet-google-sheets",
  saveTitle: "Save Google Sheets config",
  saveDescription: "Connect your Google Sheet to capture leads",
  saveSuccess: {
    title: "Connected",
    description: "New leads will appear as rows in your sheet.",
  },
  oauthStart: {
    title: "Connect Google Sheets",
    description: "Start the Google OAuth flow to authorize spreadsheet access",
  },
  oauthCallback: {
    title: "Google Sheets OAuth Callback",
    description: "Handles the OAuth code exchange after Google redirect",
  },
  sheetsList: {
    title: "List Spreadsheets",
    description:
      "Returns the list of spreadsheets accessible to the connected Google account",
  },
  errors: {
    validation: { title: "Validation error", description: "Check your input" },
    unauthorized: { title: "Unauthorized", description: "Log in to continue" },
    forbidden: { title: "Forbidden", description: "Access denied" },
    notFound: { title: "Not found", description: "Resource not found" },
    conflict: { title: "Conflict", description: "A conflict occurred" },
    network: {
      title: "Network error",
      description: "A network error occurred",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "You have unsaved changes",
    },
    internal: {
      title: "Server error",
      description: "An internal error occurred",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred",
    },
    oauthFailed: "Google authorization failed. Please try again.",
    noRefreshToken:
      "Google did not return a refresh token. Please disconnect and reconnect your account.",
    sheetsApiFailed:
      "Could not load spreadsheets. Check your Google connection.",
    appendFailed: "Could not write to Google Sheet. Token may be expired.",
  },
  response: {
    provider: "Provider",
    isActive: "Active",
    spreadsheetId: "Spreadsheet ID",
    sheetTab: "Sheet tab",
    sheets: "Spreadsheets",
    connected: "Connected",
  },
  widget: {
    connectTitle: "Connect Google Sheets",
    connectDescription:
      "Sign in with Google to automatically add every new lead as a row in your spreadsheet.",
    redirectNote: "You'll be redirected to Google to grant spreadsheet access.",
    reconnect: "Reconnect",
    loading: "Loading spreadsheets…",
    noSheets: "No spreadsheets found",
    refresh: "Refresh list",
    selectRequired: "Please select a spreadsheet",
    saveFailed: "Failed to save. Please try again.",
    saving: "Saving…",
  },
};
