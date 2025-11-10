export const translations = {
  name: "NOWPayments",
  description: "Cryptocurrency payment provider with subscription support",

  errors: {
    userNotFound: {
      title: "User Not Found",
      description: "The specified user could not be found",
    },
    customerCreationFailed: {
      title: "Customer Creation Failed",
      description: "Failed to ensure NOWPayments customer: {error}",
    },
    productNotFound: {
      title: "Product Not Found",
      description: "The specified product could not be found: {productId}",
    },
    userEmailRequired: {
      title: "User Email Required",
      description: "User email is required for subscriptions: {userId}",
    },
    checkoutCreationFailed: {
      title: "Checkout Creation Failed",
      description: "Failed to create NOWPayments checkout session: {error}",
    },
    invoiceCreationFailed: {
      title: "Invoice Creation Failed",
      description: "Failed to create NOWPayments invoice: {error}",
    },
    planCreationFailed: {
      title: "Plan Creation Failed",
      description: "Failed to create NOWPayments subscription plan: {error}",
    },
    subscriptionCreationFailed: {
      title: "Subscription Creation Failed",
      description: "Failed to create NOWPayments subscription: {error}",
    },
    subscriptionRetrievalFailed: {
      title: "Subscription Retrieval Failed",
      description: "Failed to retrieve NOWPayments subscription: {error}",
    },
    subscriptionCancellationFailed: {
      title: "Subscription Cancellation Failed",
      description: "Failed to cancel NOWPayments subscription: {error}",
    },
    subscriptionListFailed: {
      title: "Subscription List Failed",
      description: "Failed to list NOWPayments subscriptions: {error}",
    },
    webhookVerificationFailed: {
      title: "Webhook Verification Failed",
      description: "Failed to verify NOWPayments webhook signature: {error}",
    },
    paymentStatusFailed: {
      title: "Payment Status Retrieval Failed",
      description:
        "Failed to retrieve payment status from NOWPayments: {error}",
    },
  },

  success: {
    invoiceCreated: {
      title: "Invoice Created",
      description: "NOWPayments invoice created successfully",
    },
    webhookVerified: {
      title: "Webhook Verified",
      description: "NOWPayments webhook verified successfully",
    },
    paymentStatusRetrieved: {
      title: "Payment Status Retrieved",
      description: "NOWPayments payment status retrieved successfully",
    },
  },
};
