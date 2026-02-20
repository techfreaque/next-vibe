export const translations = {
  post: {
    title: "Compose Email",
    description: "Send a new email via SMTP",
    to: {
      label: "To",
      description: "Recipient email address",
      placeholder: "recipient@example.com",
    },
    toName: {
      label: "Recipient Name",
      description: "Display name of the recipient",
      placeholder: "John Doe",
    },
    subject: {
      label: "Subject",
      description: "Email subject line",
      placeholder: "Enter subject...",
    },
    body: {
      label: "Message",
      description: "Email body (plain text)",
      placeholder: "Write your message here...",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid compose parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to send emails",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to send emails",
      },
      server: {
        title: "Server Error",
        description: "Failed to send email",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while sending",
      },
      conflict: {
        title: "Conflict",
        description: "Conflict while sending email",
      },
      notFound: {
        title: "Not Found",
        description: "SMTP account not found",
      },
      network: {
        title: "Network Error",
        description: "Network error while sending email",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Please save your changes first",
      },
    },
    success: {
      title: "Email Sent",
      description: "Email sent successfully",
    },
  },
  widget: {
    title: "New Message",
    send: "Send",
    sending: "Sending...",
    sent: "Email sent successfully",
    cancel: "Cancel",
    discardConfirm: "Discard draft?",
  },
};
