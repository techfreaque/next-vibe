export const translations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
    credits: "Credits",
  },
  enum: {
    offer: {
      available: "Available",
      pendingConfirmation: "Waiting for email confirmation",
      active: "Bonus active",
      notEligible: "Not available",
    },
  },
  response: {
    offer: "Newsletter bonus",
    email: "Account email",
    bonusCredits: "Bonus credits per month",
    freeRefillAt: "Free credits refill on",
  },
  get: {
    title: "Newsletter Credit Bonus",
    titleShort: "Newsletter bonus",
    description:
      "Whether your account can still get the monthly newsletter credit bonus. Accounts only.",
  },
  post: {
    title: "Claim Newsletter Credit Bonus",
    titleShort: "Claim newsletter bonus",
    description:
      "Subscribe your account email to the newsletter for extra free credits every month. Accounts only, once per account.",
  },
  errors: {
    validation: {
      title: "Invalid request",
      description: "The request could not be processed",
    },
    unauthorized: {
      title: "Account required",
      description:
        "The newsletter credit bonus is for accounts. Sign up free or log in first.",
    },
    forbidden: {
      title: "Not allowed",
      description: "You cannot claim this bonus",
    },
    notFound: {
      title: "Account not found",
      description: "We could not find your account",
    },
    internal: {
      title: "Something broke",
      description: "Could not check the newsletter bonus. Try again.",
    },
  },
  success: {
    title: "Done",
    description: "Newsletter bonus status loaded",
  },
  widget: {
    available: "+{{bonusCredits}} free credits every month",
    availableHint:
      "Subscribe {{email}} to the newsletter. We'll send a confirm link first.",
    claim: "Get +{{bonusCredits}} credits/month",
    pending:
      "Check {{email}}. Click the confirm link to unlock +{{bonusCredits}} credits/month.",
    active: "Newsletter bonus active: +{{bonusCredits}} credits/month.",
    notEligible: "Newsletter bonus not available for this account.",
    refill: "Free credits refill on {{date}}.",
  },
};
