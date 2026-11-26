export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
  },
  post: {
    title: "Issue Invoice",
    titleShort: "Issue Invoice",
    description: "Issue the draft and create its journal entry.",
    form: {
      title: "Issue Invoice",
      description: "Create a customer view link after issuing.",
    },
    response: {
      success: "Invoice issued",
      message: "Status message",
      viewUrl: "Customer view URL",
    },
    errors: {
      invoiceLines: "Add invoice lines with a positive total before issuing.",
      posting:
        "Check the invoice total, company currency, accounting period and posting accounts.",
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Invoice not found",
      },
      conflict: {
        title: "Conflict",
        description: "Invoice is not in draft status",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Invoice issued",
      description: "The customer view link is ready to share.",
    },
  },
  invoiceId: {
    label: "Invoice ID",
    description: "ID of the invoice to send",
    placeholder: "Enter invoice ID",
  },
  delivery: {
    share: "Share invoice",
    description:
      "Copy the customer view link or send it to the email saved on the invoice.",
    send: "Send by email",
    confirmDescription: "Send the invoice link to the confirmed recipient.",
    recipient: "Invoice recipient",
    noRecipient:
      "No eligible recipient is saved on this invoice. You can still copy the link.",
    status: "Email status",
    notIssued: "Only issued invoices can be shared.",
    recipientChanged:
      "The invoice recipient has changed or is unavailable. Open Share invoice again.",
    emailSubject: "Invoice {{number}}",
    emailText:
      "{{company}} has issued invoice {{number}}. Open the invoice here:\n{{url}}",
    states: {
      ready: "Ready to send",
      pending:
        "An email attempt is in progress or unconfirmed. Sending is paused.",
      accepted: "Accepted by the mail server.",
      retryable: "The mail server was not contacted. You can retry.",
      uncertain:
        "We could not confirm the mail outcome. Check with the recipient before sending the link separately.",
    },
  },
  widget: {
    back: "Back",
    submit: "Issue invoice",
    sent: "Share the customer link to deliver this invoice.",
    copy: "Copy customer link",
    copied: "Link copied",
    copyError: "Could not copy the link. Select and copy the URL above.",
    viewUrl: "Customer view link",
  },
};
