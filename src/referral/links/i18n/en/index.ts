export const translations = {
  category: "Referral",
  tags: {
    referral: "referral",
    links: "links",
  },
  get: {
    title: "My Tracked Links",
    titleShort: "Tracked Links",
    description:
      "Your referral links, one per placement, with visits, signups and earnings for each.",
    response: {
      links: "Links",
    },
    widget: {
      title: "Tracked links",
      subtitle:
        "One link per placement. See which video, post or newsletter actually pays.",
      create: "New link",
      refresh: "Refresh",
      loading: "Loading your links...",
      copy: "Copy",
      copied: "Copied",
      visits: "Visits",
      signups: "Signups",
      paid: "Paying",
      earned: "Earned",
      pending: "{{amount}} pending",
      code: "Code {{code}}",
      landsOn: "Lands on {{path}}",
      empty: {
        title: "No tracked links yet",
        hint: "Make one per video, post or newsletter issue. Every visit, signup and payment is counted against it.",
        cta: "Create your first link",
      },
      cli: {
        header: "{{count}} tracked links",
        funnel:
          "{{visits}} visits, {{signups}} signups, {{paid}} paying, {{earned}} earned ({{pending}} pending)",
      },
    },
  },
  post: {
    title: "Create Tracked Link",
    titleShort: "New Link",
    description:
      "Create a referral link for one placement. It carries your referral code plus UTM tags so every visit, signup and payment is counted per link.",
    submit: "Create link",
    fields: {
      name: {
        label: "Name",
        description: "Only you see this. Name the placement.",
        placeholder: "YouTube review, November",
      },
      source: {
        label: "Where you post it",
        description: "The platform or site, e.g. youtube, newsletter, x",
        placeholder: "youtube",
      },
      campaign: {
        label: "Campaign",
        description: "Groups links, e.g. one video or one issue. Optional.",
        placeholder: "uncensored-ai-review",
      },
      medium: {
        label: "Medium",
        description: "Type of placement. Defaults to referral.",
        placeholder: "video",
      },
      destinationPath: {
        label: "Landing page",
        description: "Path on this site where visitors land",
        placeholder: "/",
      },
      code: {
        label: "Referral code",
        description: "One of your codes. Empty uses your first active code.",
        placeholder: "MYCODE",
      },
    },
    response: {
      id: "Link ID",
      url: "Link",
      code: "Referral code",
    },
    widget: {
      back: "Back",
      hint: "One link per placement. Then you see exactly which one brings paying users.",
      presets: "Where will you share it?",
      created: "Your link is ready",
      copy: "Copy",
      copied: "Copied",
    },
  },
  errors: {
    validation: {
      title: "Invalid input",
      description: "Check the highlighted fields",
    },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in to manage your links",
    },
    forbidden: {
      title: "Not allowed",
      description: "You cannot manage these links",
    },
    notFound: {
      title: "Not found",
      description: "That link does not exist",
    },
    conflict: {
      title: "Conflict",
      description: "Something changed meanwhile, reload and retry",
    },
    server: {
      title: "Server error",
      description: "Could not complete the request",
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
    noCode:
      "Create your referral code first. Your tracked links are built on it.",
    notYourCode: "Code {{code}} is not one of your active referral codes",
    invalidDestination: "Landing path must start with / and stay on this site",
  },
  success: {
    title: "Done",
    description: "Link ready",
  },
};
