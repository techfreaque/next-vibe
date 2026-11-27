export const translations = {
  tag: "Lifecycle",
  enums: {
    journey: {
      firstChat: "Signed up, never chatted",
      outOfCredits: "Free credits used up",
      whatsNew: "Quiet for 7 days",
      winBack: "Quiet for 30 days",
      customerCheckin: "Active subscriber: feedback check-ins",
      lapsedWinback: "Paid before, quiet 14 days",
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
      firstChatPrompts: "First chat: three prompts",
      firstChatSkills: "First chat: let a skill start",
      outOfCredits: "Out of credits: refill date",
      whatsNew: "What's new",
      winBack: "Win-back: last email",
      paymentFailed: "Payment failed",
      customerLikes: "Customer: what works",
      customerBuildNext: "Customer: what to build next",
      lapsedWinback: "Lapsed: why did you stop",
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
    greetingNamed: "Hi {{name}},",
    signoff: "The unbottled.ai team",
    senderName: "unbottled.ai",
    unsubscribeText: "Unsubscribe:",
    ctaLine: "{{text}}: {{url}}",
    footerAccount: "You get this because you have an unbottled.ai account.",
    footerAccountLink: "Stop these emails",
    footerBilling: "This is a billing notice about your subscription.",
    newModels: {
      one: "new model",
      few: "new models",
      many: "new models",
      other: "new models",
    },
    tier: {
      mainstream: "Mainstream",
      open: "Open source",
      uncensored: "Uncensored",
    },
    firstChatPrompts: {
      subject: "Three first messages. Copy, paste, send.",
      preview: "One question filtered AIs dodge, one model duel, one image.",
      intro:
        "Your account is ready and your chat is still empty. Take one of these, paste it, send it.",
      uncensoredTitle: "1. Ask what filtered AIs dodge",
      uncensoredPrompt:
        '"Argue the side of a debate you would normally refuse to take. Full force, no disclaimers." Use one of the {{uncensoredCount}} uncensored models. You confirm once that you are 18 or older.',
      mainstreamTitle: "2. Make the big names compete",
      mainstreamPrompt:
        '"Plan a cheap weekend in Lisbon. Where to eat, what to skip." Ask GPT. Then switch to Claude or Gemini in the same thread and compare.',
      mediaTitle: "3. Make an image",
      mediaPrompt:
        '"A fox in a red scarf on a snowy Tokyo street at night, film photo." One prompt, one picture.',
      body: "Your free credits are already on your account. No card needed.",
      cta: "Open my chat",
      ps: "P.S. Stuck? Reply to this email. We answer every reply.",
    },
    firstChatSkills: {
      subject: "No idea what to type? Pick a skill.",
      preview:
        "Characters and specialists with their own voice, model and tools.",
      intro:
        "A blank chat box is the hardest part. A skill gives the chat a job before you type a word.",
      characterTitle: "Characters",
      characterBody:
        "Companions, roleplay partners, sharp-tongued critics. Each one has its own voice and keeps it.",
      specialistTitle: "Specialists",
      specialistBody:
        "A coder, an editor, a researcher. Each one brings its own instructions, model and tools.",
      body: "Pick one and say hi.",
      cta: "Pick a skill",
    },
    outOfCredits: {
      subject: "Free credits almost gone. They refill on {{resetDate}}.",
      preview: "Nothing is lost. Your threads and settings stay as they are.",
      intro:
        "You've used almost all of this month's free credits. They refill on {{resetDate}}.",
      cta: "See my credits",
      plansLink: "See the plans",
    },
    paymentFailed: {
      subject: "Your subscription payment didn't go through",
      preview:
        "Your plan stays active until {{graceDate}}. Update your payment method to keep it.",
      intro: "We couldn't charge your last subscription payment.",
      body: "Your plan stays active until {{graceDate}}. Update your payment method before then to keep it. Did your bank hold the charge for approval (common with Indian cards)? Approve it from your account page. You can also top up with a one-time credit pack or pay with crypto.",
      cta: "Update payment method",
      ps: "P.S. Already fixed it? Then ignore this email.",
    },
    customerLikes: {
      subject: "One week in. What works, what doesn't?",
      preview:
        "Two questions. One line back is enough. Useful feedback earns {{feedbackCredits}} credits.",
      intro: "You've been on your plan for a week. Thank you. Two questions:",
      likeTitle: "What do you like?",
      likeBody:
        "The model, the feature, the moment it clicked. Tell us what to keep.",
      missingTitle: "What's missing or broken?",
      missingBody: "A bug, a confusing setting, anything that slowed you down.",
      body: "Reply to either question in one line. Useful feedback earns you {{feedbackCredits}} credits.",
      cta: "Send feedback",
    },
    customerBuildNext: {
      subject: "What should we build next?",
      preview: "You get a say in what we build next.",
      intro: "You've backed us for over a month. Thank you.",
      body: "One question: if we could build one thing for you next, what would it be? A model, a feature, a fix. Reply in one line. Useful feedback earns you {{feedbackCredits}} credits.",
      cta: "Send my idea",
    },
    lapsedWinback: {
      subject: "What could we have done better?",
      preview:
        "One line back helps. Useful feedback earns {{feedbackCredits}} credits.",
      intro:
        "You've been a paying user, and we haven't seen you in a while. If something put you off, we'd like to hear it.",
      body: "Hit reply and tell us in one line: price, a missing model, a bug, anything. Useful feedback earns you {{feedbackCredits}} credits.",
      cta: "Send feedback",
      newsPs:
        "P.S. Since your last visit we added {{newModelCount}} {{newModelsPhrase}}, including {{modelList}}.",
      newsPsAll: "P.S. Since your last visit we added {{modelList}}.",
    },
    whatsNew: {
      subject: "{{newModelCount}} {{newModelsPhrase}} since your last visit",
      subjectOne: "New since your last visit: {{newModelName}}",
      preview: "Added after your last visit. Already in your model picker.",
      intro:
        "Since your last visit we added {{newModelCount}} {{newModelsPhrase}}. The newest:",
      introOne: "Since your last visit we added one model:",
      body: "Open any thread and switch models. Your history stays.",
      bodyMore:
        "Plus {{moreCount}} more. Open any thread and switch models mid-conversation.",
      cta: "Open my chats",
      introAll:
        "Since your last visit we added {{newModelCount}} {{newModelsPhrase}}:",
    },
    whatsNewQuiet: {
      subject: "Ask one model, then ask another",
      preview: "Switch models in one chat and compare.",
      intro: "Try this: ask two models the same question.",
      compareTitle: "Model switching",
      compareBody:
        "Ask one model, switch to another in the same thread, compare the answers.",
      body: "Your threads are where you left them.",
      cta: "Open my chats",
    },
    winBack: {
      subject: "What was missing?",
      preview: "What was missing? One line back is enough.",
      intro:
        "Your last chat was over a month ago. One question: what was missing? Hit reply, one line is enough. We read every answer and fix what we can.",
      body: "Your account and your threads are still there, and your free credits still refill every month.",
      cta: "Tell us what was missing",
      newsPs:
        "P.S. Since your last visit we added {{newModelCount}} {{newModelsPhrase}}, including {{modelList}}.",
      newsPsAll: "P.S. Since your last visit we added {{modelList}}.",
    },
    inviteSignup: {
      subject: "You read the newsletter. Now use the app.",
      preview:
        "Free account, up to {{freeCreditsMax}} credits a month. No card.",
      intro:
        "You get our newsletter. The app is one step away: {{modelCount}} models, and you set the filter.",
      guestTitle: "No account: {{freeCreditsGuest}} credits a month",
      guestBody: "Enough to test a few models.",
      accountTitle: "Free account: {{freeCreditsSignedIn}} credits a month",
      accountBody: "Your threads saved, on every device.",
      newsletterTitle:
        "Account + newsletter: {{freeCreditsMax}} credits a month",
      newsletterBody:
        "Keep the newsletter on in your account and the bonus is yours.",
      body: "No card. Free credits switch on once you confirm your email.",
      cta: "Create my free account",
    },
    inviteReminder: {
      subject: "Last reminder: your free account",
      preview:
        "{{freeCreditsMax}} credits a month instead of {{freeCreditsGuest}}. No card.",
      intro:
        "Last reminder. A free account with the newsletter on gets {{freeCreditsMax}} credits every month. Without one: {{freeCreditsGuest}}.",
      body: "Takes a minute. No card.",
      cta: "Create my free account",
      ps: "P.S. No more reminders after this one. The newsletter keeps coming as usual.",
    },
  },
  emailTemplates: {
    category: "Lifecycle journeys",
    preview: {
      name: {
        label: "First name",
        description: "Greeting name. Empty = generic greeting.",
      },
    },
    firstChatPrompts: {
      name: "Lifecycle: first chat",
      description:
        "Service. 24 h after signup, verified account, no chat yet. Three paste-ready first messages.",
    },
    firstChatSkills: {
      name: "Lifecycle: first chat, skills",
      description: "Service. Day 5, still no chat. Skills give the chat a job.",
    },
    outOfCredits: {
      name: "Lifecycle: out of credits",
      description:
        "Service. Free credits for the month used up, never paid. Refill date, link to the credits page; plans link only with marketing consent.",
    },
    paymentFailed: {
      name: "Lifecycle: payment failed",
      description:
        "Transactional. Subscription went past due: one email per failed payment run, plan active until the grace date.",
    },
    customerLikes: {
      name: "Lifecycle: customer check-in",
      description:
        "Service. Active subscriber, 7 days into the plan. Pure feedback ask, reply to answer, feedback credits as promised in the footer.",
    },
    customerBuildNext: {
      name: "Lifecycle: what to build next",
      description:
        "Service. Active subscriber, about 5 weeks in. Asks what to build next.",
    },
    lapsedWinback: {
      name: "Lifecycle: lapsed win-back",
      description:
        "Marketing. Paid before, no live plan, 14 days quiet. Asks why they stopped, lists new models.",
    },
    whatsNew: {
      name: "Lifecycle: what's new",
      description:
        "Marketing. 7 days without a chat. Models added since the last chat.",
    },
    winBack: {
      name: "Lifecycle: win-back",
      description:
        "Marketing. 30 days without a chat. Last journey email, asks what was missing.",
    },
    inviteSignup: {
      name: "Lifecycle: newsletter invite",
      description:
        "Confirmed newsletter subscriber without an account, 48 h after confirming.",
    },
    inviteReminder: {
      name: "Lifecycle: invite reminder",
      description: "One week after the invite, still no account.",
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
        autoEligible: "Scheduled run would enroll",
        heldSuppressed: "Held: unsubscribed / bounced",
        heldPaid: "Held: already paid",
        heldNoConsent: "Held: no marketing consent",
        heldUnverified: "Held: unverified email",
        heldPendingNewsletter: "Held: newsletter not confirmed",
        heldInactiveAccount: "Held: banned / inactive",
        heldNothingDue: "Held: nothing due (active, has credits)",
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
