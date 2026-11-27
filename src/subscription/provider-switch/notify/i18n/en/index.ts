export const translations = {
  category: "Payments",
  tag: "Plan move notice",

  post: {
    title: "Plan Move Notice",
    titleShort: "Plan Move Notice",
    description:
      "One-time mail to every card subscriber: move the plan to the new payment provider. Dry run lists recipients and renders a preview. A real run sends each user once and refuses until the new provider is live.",
    container: {
      title: "Plan move notice",
      description:
        "Card subscribers (active, trial, past due, ending at period end) who have not been mailed yet",
    },
    fields: {
      dryRun: {
        label: "Dry run",
        description: "List recipients and render a preview. Sends nothing.",
      },
      batchSize: {
        label: "Batch size",
        description:
          "Most mails this run sends (also capped by the hourly budget)",
      },
      hourlyCap: {
        label: "Hourly cap",
        description:
          "Most platform mails per hour, all mail included (mailbox limit is 500)",
      },
      previewLocale: {
        label: "Preview locale",
        description: "Render the mail in this locale",
      },
      testRecipient: {
        label: "Test recipient",
        description:
          "Send the real mail to this address only. Ignores the live check and marks nobody as mailed.",
      },
    },
    response: {
      providerLive: "New provider live",
      targetProvider: "New provider",
      totalRecipients: "Card subscribers",
      alreadyNotified: "Already mailed",
      pending: "Still to mail",
      planNotSupported: "Plan not sold by new provider (skipped)",
      hourlyBudget: "Hourly budget left",
      sent: "Sent",
      failed: "Failed",
      byLocale: "By locale",
      locale: "Locale",
      count: "Count",
      recipients: "Recipients this run",
      userId: "User",
      email: "Email",
      status: "Status",
      deadline: "Deadline",
      testSentTo: "Test sent to",
      previewSubject: "Preview subject",
      previewHtml: "Preview HTML",
    },
    widget: {
      dryRunBadge: "Dry run",
      liveBadge: "Live run",
      notLive: "New provider not live yet. A real run is refused.",
      run: "Run",
      noRecipients: "Nobody left to mail.",
    },
    errors: {
      notLive: {
        title: "New provider not live",
        description:
          "Set SUBSCRIPTION_SWITCH_PROVIDER and SUBSCRIPTION_SWITCH_ENABLED=true and make sure the provider takes payments before sending.",
      },
      validation: {
        title: "Invalid request",
        description: "Check the fields and try again.",
      },
      unauthorized: {
        title: "Sign in required",
        description: "Admins only.",
      },
      forbidden: {
        title: "Not allowed",
        description: "Admins only.",
      },
      server: {
        title: "Run failed",
        description: "The notice run failed. Check the logs.",
      },
      unknown: {
        title: "Unexpected error",
        description: "Something unexpected happened.",
      },
    },
    success: {
      title: "Notice run done",
      description: "See the counts below.",
    },
  },

  emailTemplate: {
    name: "Plan move notice",
    description:
      "One-time mail asking card subscribers to move their plan to the new payment provider",
    category: "Subscriptions",
    preview: {
      privateName: {
        label: "Name",
        description: "First name of the subscriber",
      },
      planName: {
        label: "Plan",
        description: "Plan name",
      },
      deadline: {
        label: "Deadline",
        description: "Last day of the paid period",
      },
    },
  },

  email: {
    subject: "Too free for our card processor. Move your plan by {{deadline}}",
    subjectPastDue: "Too free for our card processor. Move your plan now",
    subjectNoDate: "Too free for our card processor. Move your plan to keep it",
    previewText: "One click keeps your plan. Same price, credits safe.",
    headline: "Too free for their rules. Exactly right for you.",
    greeting: "Hi {{privateName}},",
    intro:
      "Our card processor decided an AI that answers freely doesn't fit their rules, so card payments for your {{planName}} plan stopped. One click moves it to our new checkout before {{deadline}}, or the plan ends on {{deadline}} and your credits stay.",
    introPastDue:
      "Our card processor decided an AI that answers freely doesn't fit their rules, so your last {{planName}} renewal didn't go through. One click moves your plan to our new checkout right now, and your credits stay no matter what.",
    introNoDate:
      "Our card processor decided an AI that answers freely doesn't fit their rules, so card payments for your {{planName}} plan stopped. One click moves it to our new checkout, or the plan ends when your paid period runs out and your credits stay.",
    cta: "Move my plan",
    reassurance:
      "Same plan, same price, and your paid days carry over. Never charged twice. Every credit stays yours.",
    stance: "We'll swap processors before we censor a single answer.",
    crypto: "Rather pay in crypto? That works too.",
    cryptoCta: "Pay with crypto",
    help: "Questions? Reply to this mail. A human reads every one.",
    signoff: "Thanks for standing with us,\nThe {{appName}} team",
  },
};
