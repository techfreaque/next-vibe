export const translations = {
  category: "Accounting",
  tags: {
    ledger: "ledger",
    fx: "fx",
    rates: "exchange-rates",
  },
  fields: {
    companyId: "Company",
    baseCurrency: "Base currency",
    quoteCurrency: "Quote currency",
    rate: "Exchange rate",
    rateDate: "Rate date",
    source: "Source",
    asOfDate: "Revaluation date",
    dryRun: "Preview only",
    postReversalNextDay: "Auto-reverse next day",
    currency: "Currency",
    limit: "Max rows",
  },
  list: {
    title: "Exchange rates",
    titleShort: "FX rates",
    description:
      "ECB daily reference rates and manual exchange rates for multi-currency ledger translation",
    syncEcbAction: "Sync ECB rates",
    setManualAction: "Add manual rate",
    revalueAction: "Period-end FX revaluation",
    empty:
      "No exchange rates stored yet. Sync ECB daily rates or add a manual rate.",
    countLabel: "Stored rates",
    latestDate: "Latest rate date",
    success: "Exchange rates loaded",
  },
  set: {
    title: "Set manual exchange rate",
    description:
      "Record a manual exchange rate (1 base currency = rate quote currency). Manual rates override ECB on the same date.",
    action: "Save rate",
    success: "Exchange rate saved",
  },
  sync: {
    title: "Sync ECB daily rates",
    description:
      "Fetch the latest Euro reference exchange rates published by the European Central Bank",
    action: "Fetch ECB rates now",
    success: "ECB daily rates synchronized",
    upsertedCount: "Rates updated",
  },
  revaluation: {
    title: "Period-end FX revaluation",
    description:
      "Revalue open foreign-currency receivables, payables, and cash/bank balances at closing rates",
    action: "Run FX revaluation",
    previewAction: "Preview revaluation",
    postAction: "Post revaluation entry",
    success: "FX revaluation completed",
    noAdjustments: "No open foreign-currency balances require revaluation.",
    functionalCurrency: "Functional currency",
    totalUnrealized: "Net unrealized FX gain/loss",
    journalEntryId: "Revaluation journal entry",
    reversalEntryId: "Next-day reversal entry",
    missingRates: "Currencies missing closing rates",
    account: "Account",
    foreignBalance: "Original balance",
    carryingFunctional: "Carrying value",
    closingRate: "Closing rate",
    revaluedFunctional: "Revalued value",
    unrealizedDelta: "Unrealized FX",
    previewBanner: "Preview only. No journal entries were posted.",
    postedBanner: "Unrealized FX revaluation journal entry posted.",
  },
  errors: {
    validation: {
      title: "Invalid input",
      description: "Check the currency codes, date, and exchange rate values.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Authenticate to access exchange rates and FX revaluation.",
    },
    forbidden: {
      title: "Access denied",
      description: "Accountant permissions are required for this action.",
    },
    notFound: {
      title: "Not found",
      description: "Requested company or exchange rate data was not found.",
    },
    conflict: {
      title: "Conflict",
      description:
        "Open accounting period or required FX accounts are missing.",
    },
    network: {
      title: "Network error",
      description: "Could not reach the ECB exchange rate feed.",
    },
    server: {
      title: "Server error",
      description: "An unexpected error occurred while processing FX data.",
    },
    unknown: {
      title: "Unknown error",
      description: "An unexpected error occurred.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "You have unsaved changes.",
    },
  },
};
