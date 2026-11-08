export const translations = {
  category: "Growth",
  tags: {
    vibeSense: "vibe-sense",
    growth: "growth",
    campaigns: "campaigns",
    spend: "spend",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    funnelStep: {
      visit: "First visit",
      chat: "First chat message",
      signup: "Signup",
      newsletter: "Newsletter confirmed",
      paid: "First payment",
      retained: "Second-month renewal",
    },
    attributionTouch: {
      first: "First touch",
      last: "Last touch",
    },
    channelType: {
      all: "All channels",
      campaign: "Campaign (UTM)",
      referral: "Referral code",
      organic: "Organic referrer",
      direct: "Direct",
    },
    paidKind: {
      subscription: "Subscription",
      pack: "Credit pack",
    },
  },
  links: {
    get: {
      title: "Campaign Links",
      titleShort: "Campaign Links",
      description:
        "Tagged links per marketing channel, with visits, signups and paying users each link brought in.",
      response: {
        links: "Links",
      },
      widget: {
        title: "Campaign links",
        subtitle: "Tag every channel test. Judge it by who pays.",
        create: "New link",
        refresh: "Refresh",
        loading: "Loading links…",
        empty: {
          title: "No campaign links yet",
          hint: "Create one link per channel test. Every visit, signup and payment it brings lands here.",
          cta: "Create first link",
        },
        visits: "Visits",
        signups: "Signups",
        paid: "Paid",
        funnel: "{{visits}} visits → {{signups}} signups → {{paid}} paid",
        paidRate: "{{rate}} of visits paid",
        refCode: "Ref {{code}}",
        landsOn: "Lands on {{path}}",
        copy: "Copy link",
        copied: "Copied",
        spend: "Channel spend",
      },
    },
    post: {
      title: "Create Campaign Link",
      titleShort: "New Link",
      description:
        "Build a UTM-tagged link for one channel, optionally bound to a referral code.",
      fields: {
        name: {
          label: "Name",
          description: "Internal name, e.g. 'Reddit r/LocalLLaMA launch post'",
          placeholder: "Reddit launch post",
        },
        channel: {
          label: "Source (utm_source)",
          description: "Where the traffic comes from: reddit, youtube, x",
          placeholder: "reddit",
        },
        medium: {
          label: "Medium (utm_medium)",
          description: "Type of traffic: social, cpc, email, video",
          placeholder: "social",
        },
        campaign: {
          label: "Campaign (utm_campaign)",
          description: "The test this link belongs to",
          placeholder: "launch-nov",
        },
        content: {
          label: "Content (utm_content)",
          description: "Optional. Which creative or placement",
          placeholder: "top-comment",
        },
        term: {
          label: "Term (utm_term)",
          description: "Optional. Paid keyword",
          placeholder: "uncensored ai",
        },
        destinationPath: {
          label: "Landing path",
          description:
            "Path on this site the link opens, e.g. / or /en-US/story",
          placeholder: "/",
        },
        refCode: {
          label: "Referral code",
          description:
            "Optional. Routes the visit through /track so the referral code is credited too",
          placeholder: "FRIEND2024",
        },
      },
      response: {
        id: "Link ID",
        url: "Campaign URL",
      },
      widget: {
        back: "Back",
        hint: "Same source for the same channel, every time. Spend and cost per paying user group by source.",
        created: "Link ready. Share this exact URL:",
        copy: "Copy link",
        copied: "Copied",
      },
    },
  },
  spend: {
    get: {
      title: "Channel Spend",
      titleShort: "Channel Spend",
      description:
        "Spend per channel and period, with signups, paying users and cost per paying user.",
      response: {
        rows: "Spend entries",
      },
      widget: {
        title: "Channel spend",
        subtitle:
          "What each channel costs, and what one paying user costs you.",
        add: "Add spend",
        refresh: "Refresh",
        loading: "Loading spend…",
        empty: {
          title: "No spend logged",
          hint: "Log what a channel test cost. Cost per paying user appears as soon as it brings someone who pays.",
          cta: "Log first spend",
        },
        period: "{{from}} – {{to}}",
        signups: "Signups",
        paid: "Paying users",
        costPerPaid: "Cost / paying user",
        costPerSignup: "Cost / signup",
        none: "—",
        attribution:
          "Users count toward the channel that first brought them (first touch), within the period.",
      },
    },
    post: {
      title: "Log Channel Spend",
      titleShort: "Log Spend",
      description:
        "Record what a channel cost in a period. Same channel and start date overwrites the entry.",
      fields: {
        channel: {
          label: "Channel",
          description:
            "utm_source of the channel, or ref:CODE for a referral partner",
          placeholder: "reddit",
        },
        periodStart: {
          label: "From",
          description: "First day of the spend period",
        },
        periodEnd: {
          label: "To",
          description: "Last day of the spend period",
        },
        amount: {
          label: "Amount",
          description: "Total spent in the period",
        },
        currency: {
          label: "Currency",
          description: "Currency of the amount",
        },
        note: {
          label: "Note",
          description: "Optional. What the money bought",
          placeholder: "2 promoted posts",
        },
      },
      response: {
        id: "Entry ID",
      },
      widget: {
        back: "Back",
        hint: "Use the exact source name your campaign links use, or the graph cannot match spend to users.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "Resolution", description: "Bucket size" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
      touch: {
        label: "Attribution",
        description: "Group by the first or the latest touch",
      },
      channelType: {
        label: "Channel type",
        description: "Campaign, referral, organic, direct - or all",
      },
      channel: {
        label: "Channel",
        description:
          "Exact channel key: utm_source, ref:CODE, referrer host or direct. Empty = any",
      },
      currency: {
        label: "Currency",
        description: "Only spend entered in this currency is summed",
      },
    },
    funnelStep: {
      post: {
        title: "Funnel Step",
        titleShort: "Funnel Step",
        description:
          "Journeys reaching a growth funnel step per bucket, filterable by channel",
        fields: {
          step: {
            label: "Step",
            description:
              "Funnel step: visit, chat, signup, newsletter, paid, retained",
          },
          result: { label: "Journeys", description: "Step count per bucket" },
        },
      },
    },
    channelSpend: {
      post: {
        title: "Channel Spend",
        titleShort: "Channel Spend",
        description:
          "Logged marketing spend per bucket, spread evenly over each spend period",
        fields: {
          result: { label: "Spend", description: "Spend per bucket" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Invalid input",
      description: "Check the highlighted fields",
    },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in as admin",
    },
    forbidden: {
      title: "Admins only",
      description: "Growth tools need the admin role",
    },
    notFound: {
      title: "Not found",
      description: "That entry does not exist",
    },
    conflict: {
      title: "Conflict",
      description: "The entry changed meanwhile, reload and retry",
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
    invalidRefCode: "Referral code {{code}} does not exist or is inactive",
    invalidPeriod: "The period end must be on or after its start",
    invalidDestination: "Landing path must start with / and stay on this site",
  },
  success: {
    title: "Done",
    description: "Saved",
  },
};
