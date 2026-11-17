export const translations = {
  category: "Referral",
  tags: {
    referral: "referral",
    admin: "admin",
  },
  post: {
    title: "Referral Code Bonus",
    titleShort: "Code Bonus",
    description:
      "Set the one-time bonus credits a referral code gives the people it brings in. Paid when they start their first paid plan, never on free signup. 0 removes the bonus.",
    fields: {
      code: {
        label: "Referral code",
        description: "The code to change (case does not matter)",
        placeholder: "krysalid",
      },
      bonusCredits: {
        label: "Bonus credits",
        description:
          "Credits granted once with the first paid plan. 0 = no bonus.",
        placeholder: "100",
      },
    },
    response: {
      code: "Code",
      ownerEmail: "Code owner",
      previousBonusCredits: "Previous bonus",
      subscriptionBonusCredits: "Bonus credits",
    },
    widget: {
      back: "Back",
      hint: 'Shown on signup as "+N bonus credits with your first subscription". Granted once per user.',
      submit: "Save bonus",
      set: "{{code}} ({{owner}}): +{{credits}} credits with the first plan (was {{previous}}).",
      cleared: "{{code}} ({{owner}}): no bonus (was {{previous}}).",
    },
  },
  errors: {
    validation: {
      title: "Invalid input",
      description: "Check the code and the credit amount",
    },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in as an admin to set code bonuses",
    },
    forbidden: {
      title: "Admins only",
      description: "Only admins can set code bonuses",
    },
    notFound: {
      title: "Not found",
      description: "Code does not exist",
    },
    conflict: {
      title: "Conflict",
      description: "The code changed in the meantime, try again",
    },
    server: {
      title: "Server error",
      description: "Could not save the bonus",
    },
    network: {
      title: "Network error",
      description: "Request did not reach the server",
    },
    unknown: {
      title: "Unknown error",
      description: "Something unexpected failed",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first",
    },
    codeNotFound: "Referral code {{code}} does not exist",
  },
  success: {
    title: "Saved",
    description: "Code bonus updated",
  },
};
