export const translations = {
  title: "Customer credit liabilities",
  description:
    "Review the booked liability for paid credit packs linked to this company.",
  tag: "Credit liabilities",
  company: "Company",
  choose: "Choose a company to view its booked credit liability.",
  empty: "No linked paid credit entries",
  account: "Ledger account",
  currency: "Currency",
  amount: "Booked balance",
  asOf: "As of",
  reportDay: "Through {{date}} (UTC)",
  scope:
    "Only linked sale, refund, recognition and reversal postings are included. Wallet credits and amounts without a verified company link are excluded.",
  ledgerScope:
    "Open an account to view its full ledger, including postings outside this report.",
  supplierLink: "Review supplier prepaid balances",
  errors: {
    validation: {
      title: "Check the selected company",
      description: "Select an active company you can access.",
    },
    forbidden: {
      title: "Company access required",
      description: "You do not have access to this company.",
    },
    server: {
      title: "Could not load credit liabilities",
      description: "Try loading the report again.",
    },
  },
};
