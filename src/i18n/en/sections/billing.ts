export const billingTranslations = {
  title: "Billing & Subscription",
  description: "Manage your subscription, payment methods, and billing history",
  history: {
    title: "Billing History",
    description: "View your billing history and download invoices",
    date: "Date: {{date}}",
    status: {
      paid: "Paid",
    },
    planDescriptions: {
      professional: "Professional Plan Subscription",
    },
  },
  noSubscription: {
    title: "No Active Subscription",
    description:
      "You don't have an active subscription. Choose a subscription plan that fits your needs.",
    heading: "Get Started",
    message: "Choose a subscription plan that fits your needs.",
    viewPlans: "View Plans",
  },
  currentPlan: {
    title: "Current Plan",
    description: "Manage your current subscription plan",
    status: "Status: {{status}}",
  },
  subscription: {
    title: "Subscription Management",
    description: "Manage your subscription plan and billing",
    currentPlan: "Current Plan: {{plan}}",
    billingCycle: "Billing Cycle: {{cycle}}",
    nextBilling: "Next billing date:",
    noDate: "No billing date available",
  },
  paymentMethod: {
    title: "Payment Method",
    description: "Manage your payment method and billing information",
    cardNumber: "Card Number",
    cardNumberPlaceholder: "**** **** **** 1234",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    update: "Update Payment Method",
    updating: "Updating...",
    success: {
      title: "Payment Method Updated",
      description: "Your payment method has been updated successfully.",
    },
    error: {
      title: "Update Failed",
      description: "Failed to update your payment method. Please try again.",
    },
  },
  plans: {
    starter: "Starter",
    basic: "Basic",
    professional: "Professional",
    premium: "Premium",
    enterprise: "Enterprise",
  },
  subscriptionStatus: {
    active: "Active",
    pastDue: "Past Due",
    canceled: "Canceled",
  },
  billingActions: {
    upgrade: "Upgrade Plan",
    cancel: "Cancel Subscription",
    canceling: "Canceling...",
  },
};
