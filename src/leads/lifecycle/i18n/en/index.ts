export const translations = {
  tag: "Lifecycle",
  enums: {
    journey: {
      firstChat: "Signed up, never chatted",
      outOfCredits: "Free credits used up",
      whatsNew: "Quiet for 7 days",
      winBack: "Quiet for 30 days",
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
      outOfCredits: "Out of credits: plans",
      whatsNew: "What's new",
      winBack: "Win-back: last email",
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
    signoff: "Max",
    signature: "unbottled.ai",
    senderName: "Max from unbottled.ai",
    unsubscribeText: "Unsubscribe:",
    firstChatPrompts: {
      subject: "Three first messages, ready to paste",
      preview: "One uncensored, one mainstream, one image. Pick one, hit send.",
      intro:
        "Your account is ready and the chat is still empty. Here are three messages to start with. Copy one, paste it, send.",
      uncensoredTitle: "Ask without the lecture",
      uncensoredPrompt:
        '"Write a dark crime story where the villain wins. No happy ending, no moral." Pick one of the {{uncensoredCount}} uncensored models. You confirm once that you are 18 or older.',
      mainstreamTitle: "Put the big names side by side",
      mainstreamPrompt:
        '"Plan a cheap weekend in Lisbon. Where to eat, what to skip." Ask GPT first. Then switch to Claude or Gemini in the same thread and compare.',
      mediaTitle: "Make an image, a video or a song",
      mediaPrompt:
        '"A fox in a red scarf on a snowy Tokyo street at night, film photo." One prompt, one image. Short videos and music work the same way.',
      body: "Your free account gets {{freeCreditsSignedIn}} credits every month, {{freeCreditsMax}} with the newsletter on. No card.",
      cta: "Send your first message",
      ps: "P.S. Not sure where to start? Reply to this email. We read replies.",
    },
    outOfCredits: {
      subject: "This month's free credits are used up",
      preview:
        "They come back on the 1st. Or keep going now, plans from {{subscriptionPrice}} a month.",
      intro:
        "You used all of this month's free credits. They come back on the 1st. Don't want to wait? Pick a plan. Plain prices.",
      starterTitle: "Starter: {{subscriptionPrice}}/month",
      starterBody:
        "{{subscriptionCredits}} credits every month. Cancel anytime. Fits if you chat most days.",
      moreTitle: "Need more? Three bigger plans",
      moreBody:
        "Plus: {{plusCredits}} credits for {{plusPrice}}. Pro: {{proCredits}} for {{proPrice}}. Ultra: {{ultraCredits}} for {{ultraPrice}}. Every plan can add top-up packs that never expire.",
      body: "Pay by card, PayPal or crypto. Same models, same filter settings.",
      cta: "Get {{subscriptionCredits}} credits for {{subscriptionPrice}}",
      ps: "P.S. Waiting for the 1st is fine too. Your threads stay where they are.",
    },
    whatsNew: {
      subject: "What changed while you were away",
      preview: "{{modelCount}} models, video and music in chat, and French.",
      intro: "Your last chat was over a week ago. Here is what's new.",
      modelsTitle: "{{modelCount}} chat models",
      modelsBody:
        "{{mainstreamCount}} mainstream, {{openCount}} open, {{uncensoredCount}} uncensored. Switch between them mid-thread.",
      mediaTitle: "Images, video and music",
      mediaBody:
        "Type a prompt in the chat. Get back a picture, a short clip or a track.",
      languagesTitle: "Now in French",
      languagesBody:
        "The whole app runs in English, German, Polish and French.",
      body: "Your threads are right where you left them.",
      cta: "Browse all models",
      ps: "P.S. Know someone who'd use this? Your referral link pays you {{referralPercent}}% of everything they spend, every month.",
    },
    winBack: {
      subject: "One last email from us",
      preview: "Your account, threads and free credits are still here.",
      intro:
        "Your last chat was over a month ago. This is the last nudge you get from us.",
      body: "Your account, your threads and your monthly free credits are all still there. More models than last time, and the filter is still yours to set.",
      cta: "Pick up where you left off",
      ps: "P.S. What put you off? Hit reply and tell us. We read every reply.",
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
        "48 h after signup, verified account, no chat yet. Three concrete prompts.",
    },
    outOfCredits: {
      name: "Lifecycle: out of credits",
      description:
        "Free credits for the month used up, never paid. Plan prices.",
    },
    whatsNew: {
      name: "Lifecycle: what's new",
      description: "7 days without a chat. Models, media, languages.",
    },
    winBack: {
      name: "Lifecycle: win-back",
      description: "30 days without a chat. Last journey email.",
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
