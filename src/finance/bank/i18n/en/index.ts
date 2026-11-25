export const translations = {
  tags: {
    bank: "bank",
    reconciliation: "reconciliation",
  },
  fields: {
    exactAmount: "Exact amount",
    status: "Status",
    company: "Company",
    account: "Bank account",
    csv: "Statement CSV",
    line: "Bank line",
    transactionId: "Transaction ID",
    bookedDate: "Booking date",
    amount: "Amount",
    currency: "Currency",
    journalLine: "Journal line",
    entryNumber: "Journal entry",
    description: "Description",
    journalDate: "Journal date",
    confirm: "Confirm this match",
    imported: "Imported",
    skipped: "Duplicates skipped",
    matchedAt: "Matched at",
    page: "Page",
    pageSize: "Page size",
    total: "Total",
  },
  ui: {
    csvFormat: "CSV format",
    commaFormat: "Comma separators with decimal points",
    semicolonFormat: "Semicolon separators with decimal commas",
    sameDay: "Same amount, same day",
    upload: "Choose CSV file",
    dropCsv: "Or drop a CSV here",
    pasteCsv: "Paste CSV text",
    supportedFormat: "Supported format",
    mapping: "Map columns",
    chooseColumn: "Choose a CSV column",
    preview: "Preview (first 5 transactions)",
    matchRow: "Match",
    unmatched: "Unmatched",
    csvHelp:
      "Map a stable transaction ID, a date (YYYY-MM-DD or DD.MM.YYYY), a signed amount in the selected decimal format and an uppercase currency code. Positive means money in. Keep each record on one line. Do not use thousands separators.",
    unsupported:
      "Convert CAMT XML, OFX/QFX, MT940, spreadsheets, PDF, other separators and records spanning multiple lines to this CSV format first.",
    chooseScope: "Choose a company and an active bank account.",
    empty: "No unmatched lines",
    emptyHint: "Import a statement to start matching.",
    review: "Review matches",
    noCandidates: "No matching journal lines",
    noCandidatesHint:
      "Check the bank account, currency and amount on the posted entry.",
    alreadyMatched: "This line is already matched.",
    importAction: "Import CSV",
    listAction: "Show bank lines",
    back: "Back",
    previous: "Previous",
    next: "Next",
    matchAction: "Match this entry",
    confirmHint:
      "The link records who confirmed the match. It does not create a posting or transfer money.",
  },
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
  check: {
    encoding: "Save the file as UTF-8 CSV.",
    mappingHeader:
      "Choose the separator and use at least four named columns in the header.",
    mapping: "Choose a different CSV column for each required field.",
    columns: "Row {{row}} must have the same columns as the header.",
    value: "Row {{row}} has an invalid value in {{field}}.",
    size: "Use a CSV of up to 256 KB and 1,000 data rows.",
    header: "Use the exact CSV headers transactionId,date,amount,currency.",
    empty: "Add at least one transaction row.",
    row: "Check the transaction ID, date, signed amount and currency on row {{row}}.",
    duplicate: "Row {{row}} repeats a transaction ID with different data.",
    storedDuplicate:
      "A stored line already uses this transaction ID with different data.",
    currency: "Every row must use the company currency.",
    journalTaken: "The selected journal line is already matched.",
    journalMatch:
      "Choose an unmatched posted journal line for the same bank account, amount and currency.",
    confirmation: "Confirm the match before submitting.",
  },
  import: {
    title: "Import bank statement",
    description: "Upload or paste a CSV for one bank account.",
    success: "Statement processed",
  },
  list: {
    title: "Unmatched bank lines",
    description:
      "Review imported bank lines and link them to posted journal entries.",
    success: "Bank lines loaded",
  },
  candidates: {
    title: "Find a journal match",
    description:
      "Review posted bank entries with the same amount and direction.",
    success: "Matches loaded",
  },
  match: {
    title: "Confirm bank match",
    description: "Link this bank line to its posted journal entry.",
    success: "Bank line matched",
  },
};
