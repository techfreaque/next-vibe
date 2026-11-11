export const translations = {
  tag: "Lifecycle",
  enums: {
    journey: {
      inactiveUser: "Signed up, never chatted",
      engagedFree: "Chatted, never paid",
      newsletterInvite: "Newsletter, no account",
    },
    enrollmentStatus: {
      active: "Active",
      completed: "Completed",
      exited: "Exited",
    },
    exitReason: {
      goalMet: "Goal met",
      unsubscribed: "Unsubscribed",
      suppressed: "Suppressed",
      ineligible: "No longer eligible",
      sendFailed: "Send failed",
    },
    sendStatus: {
      pending: "Pending",
      sent: "Sent",
    },
    template: {
      inactiveNudge: "Nudge: start a chat",
      inactiveModels: "Model choice",
      inactiveUpgrade: "Credits touch",
      engagedValue: "Value: get more out of it",
      engagedUpgrade: "Upgrade: do not wait for the reset",
      engagedLast: "Last note on credits",
      inviteSignup: "Invite: create an account",
      inviteReminder: "Invite: reminder",
    },
  },
  errors: {
    unauthorized: {
      title: "Unauthorized",
      description: "Admin access required",
    },
    forbidden: { title: "Forbidden", description: "No permission" },
    server: {
      title: "Server error",
      description: "Lifecycle operation failed",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred",
    },
    validation: {
      title: "Invalid input",
      description: "Check the values and try again",
    },
    notFound: { title: "Not found", description: "Not found" },
    conflict: { title: "Conflict", description: "Conflict" },
    network: { title: "Network error", description: "Network error" },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Unsaved changes",
    },
  },
  emails: {
    greeting: "Hi,",
    signature: "unbottled.ai",
    unsubscribeText: "Unsubscribe:",
    inactiveNudge: {
      subject: "You signed up. You haven't asked anything yet.",
      preview: "Your free credits are waiting.",
      body1:
        "Your account is live and your free credits renew every month. No filter you didn't choose.",
      body2:
        "Ask the question you couldn't ask anywhere else. One message is enough.",
      cta: "Start a chat",
    },
    inactiveModels: {
      subject: "{{modelCount}} models. You decide how much gets filtered.",
      preview: "Mainstream, open or uncensored. Your call.",
      body1:
        "Most AI decides for you what you may ask. Here you choose: mainstream, open or uncensored models, side by side.",
      body2:
        "Pick a model, set your own filter level, send one prompt. That is the whole setup.",
      cta: "Choose a model",
    },
    inactiveUpgrade: {
      subject: "Free credits get you started. Credits get you further.",
      preview: "Bigger models, longer chats.",
      body1:
        "Free credits cover a lot. When you want the bigger models and longer conversations, top up and keep going.",
      body2: "You pay for what you run. Buy credits when you need them.",
      cta: "See credit options",
    },
    engagedValue: {
      subject: "You're already chatting. Here's how to get more out of it.",
      preview: "Try the same prompt on a second model.",
      body1:
        "Different models answer differently. Run the same prompt on a second one and compare.",
      body2:
        "Your free credits renew every month. When you hit the limit, you don't have to wait.",
      cta: "Keep chatting",
    },
    engagedUpgrade: {
      subject: "Out of free credits? Don't wait for the reset.",
      preview: "Top up in a minute.",
      body1:
        "Free credits renew monthly. Paid credits don't make you wait: pick a pack or a subscription and keep your thread going.",
      body2: "You pay per use. Nothing else.",
      cta: "Get more credits",
    },
    engagedLast: {
      subject: "Last note from us on credits",
      preview: "Then we leave you alone.",
      body1:
        "This is the last email in this series. If free credits do the job, stay on free. If you want more room, credits are one click away.",
      body2: "You can unsubscribe at the bottom of this email at any time.",
      cta: "Review credit options",
    },
    inviteSignup: {
      subject: "You're on the list. Now get the account.",
      preview: "Free account. 70 credits every month.",
      body1:
        "A free account gives you 70 credits every month and access to {{modelCount}} models, with the filter level set by you.",
      body2:
        "Newsletter subscribers get a +20 credit bonus on top, every month.",
      cta: "Create free account",
    },
    inviteReminder: {
      subject: "Still no account? It takes a minute.",
      preview: "Free to start.",
      body1:
        "You read us by email. You can use us directly: pick a model, ask anything, decide your own filter.",
      body2:
        "Free accounts get 70 credits per month. Newsletter subscribers get 20 more.",
      cta: "Create free account",
    },
  },
  run: {
    post: {
      title: "Run Lifecycle Journeys",
      titleShort: "Run lifecycle",
      description:
        "Enroll newly eligible contacts and send due journey emails. Does nothing while the kill switch is on.",
      container: {
        title: "Run lifecycle",
        description:
          "Enroll and send. Respects the kill switch and frequency cap.",
      },
      fields: {
        dryRun: {
          label: "Dry run",
          description: "Do nothing, just report",
        },
      },
      response: {
        paused: "Paused",
        enrolled: "Enrolled",
        sent: "Sent",
        exited: "Exited",
        deferred: "Deferred",
        failed: "Failed",
      },
      success: {
        title: "Lifecycle run finished",
        description: "Due journey steps were processed",
      },
    },
  },
  settings: {
    post: {
      title: "Lifecycle Settings",
      titleShort: "Lifecycle settings",
      description:
        "Kill switch, frequency cap, send throttle and consent mode for lifecycle emails.",
      container: {
        title: "Lifecycle settings",
        description: "Leave a field empty to keep its current value.",
      },
      fields: {
        paused: {
          label: "Pause all lifecycle sending",
          description: "On = nothing is enrolled or sent",
        },
        minHoursBetweenEmails: {
          label: "Min hours between emails",
          description:
            "Frequency cap per contact, across lifecycle and campaigns",
        },
        maxSendsPerRun: {
          label: "Max emails per run",
          description: "Throttle for each scheduled run",
        },
        autoEnrollWindowDays: {
          label: "Auto-enroll window (days)",
          description:
            "The scheduled run only enrolls contacts whose trigger is this recent. Older contacts go through the backfill.",
        },
        requireUserMarketingConsent: {
          label: "Require marketing consent for users",
          description:
            "On = registered users need marketing consent or a confirmed newsletter opt-in",
        },
      },
      response: {
        paused: "Paused",
        minHoursBetweenEmails: "Min hours between emails",
        maxSendsPerRun: "Max emails per run",
        autoEnrollWindowDays: "Auto-enroll window (days)",
        requireUserMarketingConsent: "Marketing consent required",
      },
      success: {
        title: "Settings saved",
        description: "Lifecycle settings are in force",
      },
    },
  },
  backfill: {
    post: {
      title: "Lifecycle Backfill",
      titleShort: "Backfill",
      description:
        "Preview, then enroll existing eligible contacts into the right journey. Starts at step 0, spread over a send window.",
      container: {
        title: "Backfill existing contacts",
        description: "Dry run is the default. Nothing is sent while paused.",
      },
      fields: {
        dryRun: {
          label: "Dry run",
          description: "Count only. Turn off to enroll.",
        },
        spreadHours: {
          label: "Spread over (hours)",
          description: "Window the first emails are spread across",
        },
      },
      response: {
        dryRunResult: "Dry run",
        segments: "Segments",
        journey: "Journey",
        eligible: "Eligible",
        alreadyEnrolled: "Already enrolled",
        enrolled: "Enrolled",
        heldSuppressed: "Held: unsubscribed / bounced",
        heldPaid: "Held: already paid",
        heldNoConsent: "Held: no marketing consent",
        heldUnverified: "Held: unverified email",
        heldPendingNewsletter: "Held: newsletter not confirmed",
        heldInactiveAccount: "Held: banned / inactive",
      },
      success: {
        title: "Backfill finished",
        description: "Segment counts are in the response",
      },
    },
  },
  overview: {
    get: {
      title: "Lifecycle Journeys",
      titleShort: "Lifecycle",
      description:
        "Journeys, enrollments, sends and conversions. Kill switch and backfill.",
      response: {
        paused: "Paused",
        minHoursBetweenEmails: "Min hours between emails",
        maxSendsPerRun: "Max emails per run",
        autoEnrollWindowDays: "Auto-enroll window (days)",
        requireUserMarketingConsent: "Marketing consent required",
        journeys: "Journeys",
        steps: "Steps",
        enrolled: "Enrolled",
        active: "Active",
        completed: "Completed",
        exited: "Exited",
        converted: "Converted",
        unsubscribed: "Unsubscribed",
        sent: "Sent",
        sent24h: "Sent (24h)",
        attributedPaid: "Paid after enrollment",
      },
      success: {
        title: "Lifecycle loaded",
        description: "Journey counts loaded",
      },
    },
  },
  widget: {
    title: "Lifecycle journeys",
    refresh: "Refresh",
    pausedTitle: "Paused",
    pausedBody: "Nothing is enrolled or sent.",
    liveTitle: "Live",
    liveBody: "Due emails go out on every run.",
    pause: "Pause everything",
    resume: "Resume sending",
    settings: "Settings",
    backfill: "Backfill",
    capLine: "Cap: 1 email per {{hours}}h. Max {{max}} per run.",
    consentOn: "Users need marketing consent.",
    consentOff: "Users do not need marketing consent.",
    noJourneys: "No journeys.",
    stepsLine: "{{steps}} steps",
    enrolled: "Enrolled",
    active: "Active",
    sent: "Sent",
    sent24h: "Sent (24h)",
    converted: "Converted",
    paid: "Paid after",
    unsubscribed: "Unsub",
  },
};
