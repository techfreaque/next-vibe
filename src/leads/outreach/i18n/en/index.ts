export const translations = {
  category: "Outreach",
  tags: {
    outreach: "outreach",
    crm: "crm",
    deals: "deals",
    import: "import",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    contactStatus: {
      sent: "Sent",
      replied: "Replied",
      interested: "Interested",
      deal: "Deal",
      declined: "Declined",
      optOut: "Opted out",
      bounced: "Bounced",
    },
    contactKind: {
      creator: "Creator",
      newsletter: "Newsletter",
      directory: "Directory",
      other: "Other",
    },
    direction: {
      out: "Sent by us",
      in: "Reply from them",
    },
    dealStatus: {
      proposed: "Proposed",
      committed: "Committed",
      paid: "Paid",
      canceled: "Canceled",
    },
    angleGroup: {
      affiliate: "A · Affiliate",
      audienceFit: "B · Audience fit",
      mission: "C · Free speech / privacy",
      tryIt: "D · Try it / get listed",
      video: "Video inquiry",
      infoFirst: "Rates first",
      negotiation: "Negotiation",
      other: "Other",
    },
    attributionBasis: {
      tracked: "Tracked link / ref code",
      channel: "Channel-wide",
      none: "Not tracked",
    },
  },
  crm: {
    get: {
      title: "Outreach CRM",
      titleShort: "Outreach",
      description:
        "Every contact pitched, where each one stands, and what the paid deals brought back in signups and revenue.",
      fields: {
        status: {
          label: "Status",
          description: "Only contacts in this status",
        },
        kind: {
          label: "Kind",
          description: "Creator, newsletter, directory or other",
        },
        angle: {
          label: "Angle",
          description: "Pitch angle prefix, e.g. A, B-audience-fit, VIDEO",
          placeholder: "B-audience-fit",
        },
        search: {
          label: "Search",
          description: "Name, email, subject or notes",
          placeholder: "Search name, email, subject…",
        },
        page: { label: "Page", description: "Page number" },
        limit: { label: "Per page", description: "Contacts per page" },
      },
      response: {
        summary: "Summary",
        angles: "Angles",
        contacts: "Contacts",
        deals: "Deals",
        dealTotals: "Deal totals",
      },
      widget: {
        title: "Outreach",
        subtitle: "Who we pitched, who answered, what the money bought.",
        refresh: "Refresh",
        addContact: "Log contact",
        addDeal: "Add deal",
        import: "Import log",
        loading: "Loading outreach…",
        allStatuses: "All",
        clearFilters: "Clear filters",
        kpi: {
          contacts: "Contacts",
          replyRate: "Reply rate",
          replyRateHint: "{{replied}} of {{total}} answered",
          deals: "Paid deals",
          spent: "Spent",
          spentHint: "{{committed}} committed, not paid yet",
        },
        angles: {
          title: "Angles",
          hint: "Reply rate per pitch angle. Rotate toward what answers.",
          row: "{{contacts}} pitched · {{replied}} replied",
        },
        contacts: {
          title: "Contacts",
          columns: {
            contact: "Contact",
            status: "Status",
            angle: "Angle",
            last: "Last contact",
            touches: "Emails",
          },
          showing: "{{start}}–{{end}} of {{total}}",
          never: "never",
          replied: "replied {{date}}",
        },
        deals: {
          title: "Paid deals",
          hint: "Spend against the visits, signups and revenue each deal's tracked link or ref code brought in.",
          columns: {
            deal: "Deal",
            status: "Status",
            spend: "Spend",
            visits: "Visits",
            signups: "Signups",
            paying: "Paying",
            revenue: "Revenue",
            costPerSignup: "Cost / signup",
          },
          live: "live {{date}}",
          basisChannel: "channel-wide, not deal-specific",
          basisNone: "no link, campaign or ref code to match",
          empty: {
            title: "No paid deals yet",
            hint: "Log a deal the moment a creator agrees on a price. Attach the tracked link or ref code so results land here.",
          },
        },
        empty: {
          title: "No outreach logged",
          hint: "Import the sent log, or log each email as it goes out.",
          cta: "Import sent log",
          filtered: "No contacts match these filters",
        },
        text: {
          header:
            "{{total}} contacts · {{replied}} replied ({{rate}}) · {{deals}} paid deals",
          statusLine: "Status: {{counts}}",
          anglesTitle: "Angles (pitched / replied):",
          contactsTitle: "Contacts {{start}}-{{end}} of {{total}}:",
          dealsTitle: "Paid deals:",
          dealLine:
            "{{name}} · {{deliverable}} · {{amount}} {{status}} · visits {{visits}} · signups {{signups}} · paying {{paying}} · revenue {{revenue}} · cost/signup {{cps}}",
          pageHint: "Page {{page}}/{{pages}} - use --page={{next}} for more",
          noContacts: "No contacts match.",
          noDeals: "No paid deals logged.",
        },
      },
    },
  },
  contact: {
    post: {
      title: "Log Outreach Contact",
      titleShort: "Log Contact",
      description:
        "Create or update a contact by email. Pass a subject to log the email you just sent (or received).",
      fields: {
        email: {
          label: "Email",
          description: "Contact email. Matched case-insensitively",
          placeholder: "hello@creator.com",
        },
        name: {
          label: "Name",
          description: "Creator, outlet or person",
          placeholder: "AI Anytime (Sonu)",
        },
        kind: {
          label: "Kind",
          description: "Creator, newsletter, directory or other",
        },
        url: {
          label: "URL",
          description: "Channel, site or newsletter page",
          placeholder: "https://youtube.com/@creator",
        },
        angle: {
          label: "Angle",
          description: "Pitch angle, e.g. A-affiliate, B-audience-fit",
          placeholder: "B-audience-fit",
        },
        status: {
          label: "Status",
          description:
            "Moves forward only (sent → replied → interested → deal). Exits always apply",
        },
        forceStatus: {
          label: "Force status",
          description: "Set the status exactly, even if it moves backwards",
        },
        notes: {
          label: "Notes",
          description: "Replaces the contact notes",
          placeholder: "Rate card $550 integration, 20-150K views",
        },
        refCode: {
          label: "Ref code",
          description: "Referral code given to this contact",
          placeholder: "moemoe",
        },
        channel: {
          label: "Channel",
          description: "Growth channel key, e.g. youtube, newsletter",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "Campaign link ID",
          description: "utm_id of their tracked link. Unknown IDs are dropped",
        },
        subject: {
          label: "Email subject",
          description: "Set to log a touch for this email",
          placeholder: "Your viewers already want this",
        },
        direction: {
          label: "Direction",
          description: "Sent by us (default) or a reply from them",
        },
        at: {
          label: "Sent at",
          description: "When the email went out. Defaults to now",
        },
        touchNote: {
          label: "Email note",
          description: "What the email said or asked",
          placeholder: "Asked for rate card",
        },
      },
      response: {
        id: "Contact ID",
        created: "Created",
        status: "Status",
        previousStatus: "Previous status",
        touchLogged: "Email logged",
        contactCount: "Emails sent",
        warning: "Warning",
      },
      widget: {
        back: "Back",
        hint: "One call per email sent. Same email updates the same contact.",
        touchSection: "This email",
        contactSection: "Contact",
        submit: "Save contact",
        warnOptOut: "This contact opted out. Do not email them again.",
        warnBounced: "This address bounced before. Check it before sending.",
        saved: "{{status}} · emails sent: {{count}}",
      },
    },
  },
  deal: {
    post: {
      title: "Save Outreach Deal",
      titleShort: "Save Deal",
      description:
        "Create a paid deal for a contact, or update one by ID. Attach the campaign link, utm_campaign or ref code to measure it.",
      fields: {
        id: {
          label: "Deal ID",
          description: "Set to update an existing deal",
        },
        contactEmail: {
          label: "Contact email",
          description: "Required for a new deal. Creates the contact if new",
          placeholder: "youtube@creator.com",
        },
        contactName: {
          label: "Contact name",
          description: "Used only when the contact does not exist yet",
          placeholder: "MoeMoe",
        },
        deliverable: {
          label: "Deliverable",
          description: "What the money buys",
          placeholder: "YouTube integration",
        },
        amount: {
          label: "Amount",
          description: "Total price, in currency units",
        },
        currency: {
          label: "Currency",
          description: "Currency of the amount",
        },
        status: {
          label: "Status",
          description: "Proposed, committed, paid or canceled",
        },
        channel: {
          label: "Channel",
          description: "Growth channel key, same as channel spend uses",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "Campaign link ID",
          description:
            "utm_id of the tracked link. Kept empty if the link is not on this instance",
        },
        utmCampaign: {
          label: "utm_campaign",
          description: "Campaign value on the tracked link",
          placeholder: "moemoe-2026-11-14",
        },
        refCode: {
          label: "Ref code",
          description: "Referral code the creator shares",
          placeholder: "moemoe",
        },
        liveAt: {
          label: "Goes live",
          description: "Publish date. Revenue counts from here",
        },
        paidAt: {
          label: "Paid on",
          description: "Defaults to now when status becomes paid",
        },
        notes: {
          label: "Notes",
          description: "Payment method, invoice, terms",
          placeholder: "Payoneer, ref 1059964703",
        },
      },
      response: {
        id: "Deal ID",
        created: "Created",
        status: "Status",
        linkFound: "Campaign link found",
      },
      widget: {
        back: "Back",
        hint: "Committed or paid deals move the contact to Deal.",
        submit: "Save deal",
      },
    },
  },
  import: {
    post: {
      title: "Import Outreach Log",
      titleShort: "Import Log",
      description:
        "Parse a sent log (tab-separated lines or markdown tables) into contacts and touches. Safe to re-run: emails already stored are skipped.",
      fields: {
        content: {
          label: "Log content",
          description:
            "Paste sent-log lines or sent-log.md tables. Works against remote instances",
          placeholder:
            "2026-11-10\tModelFit\tpartnerships@modelfit.io\tA-affiliate\tA recurring cut\tSENT",
        },
        filePaths: {
          label: "Server files",
          description:
            "Comma-separated paths under .tmp/ on the server, e.g. .tmp/outreach/sent-log",
          placeholder: ".tmp/outreach/sent-log.md,.tmp/outreach/sent-log",
        },
        ignoreEmails: {
          label: "Ignore emails",
          description: "Comma-separated addresses that are not outreach",
          placeholder: "max@example.com",
        },
        dryRun: {
          label: "Dry run",
          description: "Parse and count, write nothing",
        },
      },
      response: {
        rowsParsed: "Rows parsed",
        contactsCreated: "Contacts created",
        contactsUpdated: "Contacts updated",
        touchesAdded: "Emails added",
        touchesDuplicate: "Already known",
        statusChanges: "Status changes",
        skipped: "Skipped lines",
        skippedLines: "Skipped detail",
      },
      widget: {
        back: "Back",
        hint: "Paste the log or point at server files. Each email is stored once, however often you import.",
        submit: "Import",
        line: "{{source}}:{{line}} {{reason}}",
      },
    },
  },
  skip: {
    noEmail: "no valid email",
    noDate: "no valid date",
    skippedStatus: "marked SKIPPED",
    ignored: "ignored address",
    columns: "too few columns",
    unreadable: "file not readable",
    outsideTmp: "path outside .tmp/",
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
      description: "Outreach tools need the admin role",
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
    dealNotFound: "No deal with ID {{id}}",
    dealNeedsContact: "A new deal needs a contact email",
    dealNeedsFields: "A new deal needs a deliverable and an amount",
    importEmpty: "Pass log content or at least one server file",
  },
  success: {
    title: "Done",
    description: "Saved",
  },
};
