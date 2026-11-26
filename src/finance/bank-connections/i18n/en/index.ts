export const translations = {
  possibleDuplicateBookings:
    "The bookings could overlap with an earlier import. Review the ledger bank account before trying again. No bookings were saved.",
  privacyBeforeImport:
    "Set privacy choices before previewing or importing bookings.",
  previewResult: "Preview result",
  importResult: "Import result",
  bookingDay: "Booking day {{date}}",
  bookingWindow: "Booking period {{from}} to {{to}}",
  providerBookings: "Provider bookings checked",
  eligibleBookings: "Eligible business bookings",
  savedBookings: "Bookings saved",
  previewPrivacyResult:
    "Discarded bookings did not qualify under your privacy rules. Bill matching runs when you save. Ambiguous matches stay unmatched.",
  importPrivacyResult:
    "Discarded bookings did not qualify under your privacy rules. Ambiguous bill matches stay unmatched.",
  setup: "Set up bank feed",
  setupHint:
    "Save the ledger account and start date, then set privacy choices. Setup reads no transactions.",
  privacyAction: "Set privacy choices",
  privacyRequired: "Save privacy choices before reading bank transactions.",
  setupSaved: "Bank feed saved. You can now set the supplier rules.",
  supplierTotals: "Matched supplier totals for this period",
  errors: {
    validation: {
      title: "Check your input",
      description:
        "Choose a company and an active posting bank account in its currency.",
    },
    network: {
      title: "Network error",
      description: "Check your connection and try again.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to use bank reconciliation.",
    },
    forbidden: {
      title: "Access denied",
      description: "Your company role does not allow this action.",
    },
    notFound: {
      title: "Bank line or account unavailable",
      description: "Check the selected company and bank account.",
    },
    server: {
      title: "Bank operation failed",
      description:
        "Try again. An unsuccessful operation leaves the records unchanged.",
    },
    unknown: {
      title: "Unexpected bank error",
      description: "Try again.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Your changes are still in this form.",
    },
    conflict: {
      title: "Bank reconciliation conflict",
      description: "Refresh the statement and review the selected entry.",
    },
  },
  maintenance: "Bank feed maintenance",
  maintenanceHint:
    "Clear expired private details, notify account owners before consent expires and update opted-in feeds.",
  completed: "Feeds updated",
  failedFeeds: "Feeds needing attention",
  notified: "Consent reminders sent",
  matchedOnly: "Keep only supplier-rule matches",
  discardedCount: "Discarded",
  autoMatched: "Matched to bills",
  discardHint:
    "Unmatched movements are discarded without saving their details. Turn this off to use the private review inbox.",
  company: "Company",
  account: "Ledger bank account",
  start: "First booking day",
  daily: "Sync daily",
  connect: "Connect bank",
  review: "Review transactions",
  held: "Held for review",
  privateCount: "Private",
  connected: "Bank connected.",
  failed: "The connection could not be completed. Try connecting again.",
  check: "Check application",
  active: "Application active for account information.",
  inactive: "Application inactive for account information.",
  appUnavailable: "Application status unavailable.",
  linking:
    "A control-panel link makes an account eligible. Authorize it once in this app to see it here. Existing app consents appear automatically.",
  pick: "Select an account to preview its booked transactions.",
  apply: "Apply import",
  previewAction: "Preview import",
  dailyHint:
    "Choose a start date and review supplier matches before applying an import.",
  title: "Connected bank accounts",
  description:
    "Preview or import booked transactions from a consented bank account.",
  select: "Choose a bank feed",
  preview: "Preview only",
  sync: "Sync bank transactions",
  connection: "Bank connection",
  consentUntil: "Consent valid through",
  period: "Booking period",
  imported: "Imported",
  skipped: "Already imported",
  unavailable:
    "This bank feed is unavailable. Check the connection and account permissions.",
  consent: "Bank consent expired. Renew it with the bank before syncing.",
  rateLimit: "The bank is busy. Try again later.",
  invalidResponse:
    "The bank returned an incomplete statement. The checkpoint was kept.",
  windowTooLarge:
    "This window contains too many movements. Import a smaller statement file.",
  empty: "No connected bank accounts",
  noBookings: "No bookings in this period.",
  newBookings: "New bookings",
  through: "Last imported booking day",
};
