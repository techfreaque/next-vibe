export const translations = {
  category: "Platform Mailbox",
  tag: "Platform Mailbox",

  task: {
    description:
      "Compose the daily internal status report and mail it from the platform mailbox",
  },

  send: {
    title: "Send Platform Mail",
    titleShort: "Send Mail",
    description:
      "Send one transactional email from the platform mailbox and file it in Sent",
    container: {
      title: "Send Platform Mail",
      description:
        "One recipient, one message. Stored in the Sent folder after delivery.",
    },
    fields: {
      to: {
        label: "Recipient",
        description: "A single email address",
        placeholder: "name@example.com",
      },
      subject: {
        label: "Subject",
        description: "Subject line",
        placeholder: "What is this about?",
      },
      body: {
        label: "Message",
        description: "Plain-text body",
        placeholder: "Write the message...",
      },
      html: {
        label: "HTML body",
        description: "Optional simple HTML version",
        placeholder: "<p>Optional HTML</p>",
      },
    },
    response: {
      messageId: "Message ID",
      from: "From",
      to: "To",
      storedInSent: "Stored in Sent",
      sentFolder: "Sent folder",
      sentLastHour: "Sent in the last hour",
      rateLimitPerHour: "Hourly limit",
    },
    widget: {
      submit: "Send mail",
      submitting: "Sending...",
      sent: "Mail sent",
      filed: "Filed in Sent",
      notFiled: "Delivered, but not filed in Sent",
      yes: "Yes",
      no: "No",
    },
    success: {
      title: "Mail sent",
      description: "The message was delivered to the mail server",
    },
  },

  inbox: {
    title: "Platform Inbox",
    titleShort: "Inbox",
    description: "List recent INBOX messages of the platform mailbox",
    container: {
      title: "Platform Inbox",
      description: "Newest first. Reading never marks a message as read.",
    },
    fields: {
      limit: {
        label: "Limit",
        description: "How many messages to return (1-50)",
        placeholder: "20",
      },
      unreadOnly: {
        label: "Unread only",
        description: "Only return unread messages",
      },
    },
    response: {
      address: "Mailbox",
      messages: {
        title: "Messages",
        uid: "UID",
        from: "From",
        subject: "Subject",
        date: "Date",
        snippet: "Snippet",
        unread: "Unread",
      },
    },
    widget: {
      submit: "Refresh inbox",
      submitting: "Loading...",
      empty: "No messages",
      emptyDescription: "Nothing matches these filters.",
      unread: "Unread",
      noSubject: "(no subject)",
      open: "Open",
    },
    success: {
      title: "Inbox loaded",
      description: "Messages fetched from the platform mailbox",
    },
  },

  message: {
    title: "Read Platform Mail",
    titleShort: "Read Mail",
    description: "Fetch one INBOX message of the platform mailbox by UID",
    container: {
      title: "Read Platform Mail",
      description: "Full body of one message. Does not mark it as read.",
    },
    fields: {
      uid: {
        label: "UID",
        description: "Message UID from the inbox list",
        placeholder: "42",
      },
    },
    response: {
      uid: "UID",
      from: "From",
      to: "To",
      subject: "Subject",
      date: "Date",
      messageId: "Message ID",
      unread: "Unread",
      bodyText: "Body",
    },
    widget: {
      submit: "Read message",
      submitting: "Loading...",
      unread: "Unread",
      noSubject: "(no subject)",
    },
    success: {
      title: "Message loaded",
      description: "Message fetched from the platform mailbox",
    },
  },

  report: {
    title: "Daily Status Report",
    titleShort: "Daily Report",
    description:
      "Compose the last-24h platform report and mail it from the platform mailbox",
    container: {
      title: "Daily Status Report",
      description:
        "Signups, subscriptions, credit spend, funnel, task incidents and errors. Plain text.",
    },
    fields: {
      to: {
        label: "Recipient",
        description: "Leave empty to use the configured report address",
        placeholder: "name@example.com",
      },
      dryRun: {
        label: "Preview only",
        description: "Compose the report but do not send it",
      },
    },
    response: {
      subject: "Subject",
      body: "Report",
      recipient: "Recipient",
      sent: "Sent",
      sections: "Sections included",
      skippedSections: "Sections skipped",
    },
    widget: {
      submit: "Send report",
      submitting: "Composing...",
      sent: "Report sent",
      preview: "Preview",
    },
    success: {
      title: "Report ready",
      description: "The daily status report was composed",
    },
  },

  errors: {
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Only admins can use the platform mailbox",
    },
    server: {
      title: "Server Error",
      description: "The platform mailbox request failed",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    validation: {
      title: "Validation Error",
      description: "Invalid request parameters",
    },
    notConfigured:
      "The platform mailbox is not configured. Set THEA_MAIL_ADDRESS, THEA_MAIL_HOST and THEA_MAIL_PASSWORD.",
    invalidRecipient: "Recipient must be a single valid email address",
    noRecipient: "No recipient. Pass one or set THEA_MAIL_REPORT_TO.",
    rateLimited:
      "Hourly send limit reached ({{sent}} of {{limit}}). Try again later.",
    smtpFailed: "The mail server rejected the message: {{error}}",
    imapFailed: "Could not reach the mailbox: {{error}}",
    messageNotFound: "No message with that UID in the inbox",
    reportFailed: "Could not compose the report: {{error}}",
  },
};
