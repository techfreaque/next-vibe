export const translations = {
  tags: {
    pos: "POS",
    order: "Order",
    removePayment: "Remove Payment",
  },
  enums: {
    paymentMethod: {
      cash: "Cash",
      card: "Card",
      transfer: "Transfer",
      other: "Other",
    },
  },
  post: {
    title: "Remove payment",
    titleShort: "Remove payment",
    description:
      "Take a payment back off an open sale. Use it when a tender was keyed by mistake.",
    orderId: {
      label: "Sale",
      description: "The open sale that holds the payment",
    },
    paymentId: {
      label: "Payment",
      description: "The payment to take off the sale",
    },
    response: {
      orderId: "Sale",
      paymentId: "Removed payment",
      sessionId: "Session",
      currency: "Currency",
      totalPaid: "Paid so far",
      outstanding: "Still due",
      remainingPayments: "Payments left",
    },
    widget: {
      back: "Back to sale",
      pickPayment: "Pick the payment to remove",
      noPayments: "This sale has no payments to remove.",
      notOpen: "Only payments on an open sale can be removed.",
      loading: "Loading sale",
      change: "Change {{amount}}",
      selected: "Selected",
      amount: "Amount",
      confirmTitle: "Remove this payment?",
      confirmDescription:
        "The sale stays open. Take the right payment afterwards.",
      confirm: "Remove payment",
      cancel: "Cancel",
      stillDue: "Still due",
      paidSoFar: "Paid so far",
      nothingPaid: "No payments left on this sale.",
    },
    success: {
      title: "Payment removed",
      description: "The sale is open for a new payment.",
    },
  },
  errors: {
    validation: {
      title: "Check the payment",
      description: "Pick a payment that belongs to this sale.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to change sales.",
    },
    forbidden: {
      title: "No access",
      description: "You cannot change sales for this company.",
    },
    notFound: {
      title: "Payment not found",
      description: "This payment is no longer on the sale.",
    },
    conflict: {
      title: "Sale is not open",
      description:
        "Payments can only be removed while the sale and its session are open.",
    },
    server: {
      title: "Payment not removed",
      description: "Something went wrong. Try again.",
    },
    unknown: {
      title: "Payment not removed",
      description: "Something went wrong. Try again.",
    },
    network: {
      title: "No connection",
      description: "Check your connection and try again.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Finish or discard your changes first.",
    },
  },
};
