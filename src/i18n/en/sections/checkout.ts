export const checkoutTranslations = {
  orderSummary: "Order Summary",
  plan: "Plan",
  total: "Total",
  error: {
    title: "Checkout Error",
    stripe_load_failed: "Failed to load Stripe payment provider",
    general: "An error occurred during checkout. Please try again later.",
    description: "An error occurred during checkout. Please try again later.",
    missing_required_parameters: "Required parameters are missing",
    invalid_checkout_data: "Invalid checkout data",
    stripe_customer_creation_failed: "Failed to create Stripe customer",
    stripe_session_creation_failed: "Failed to create Stripe checkout session",
    checkout_session_creation_failed: "Failed to create checkout session",
  },
  validation: {
    name_required: "Name is required",
    email_invalid: "Please enter a valid email address",
    address_required: "Address is required",
    city_required: "City is required",
    postal_code_required: "Postal code is required",
    country_required: "Country is required",
    plan_invalid: "Invalid subscription plan",
    user_id_invalid: "Invalid user ID",
    currency_invalid: "Invalid currency",
  },
  success: {
    created: "Checkout session created successfully",
    payment_processed: "Payment processed successfully",
    title: "Payment Successful",
    redirecting: "Redirecting to checkout page...",
  },
  verification: {
    success: {
      title: "Payment Verified",
      description: "Your payment has been verified successfully",
    },
    error: {
      title: "Payment Verification Failed",
      description:
        "There was an error verifying your payment. Please try again.",
    },
  },
  errors: {
    fetch_by_id_failed: "Failed to fetch checkout session",
    fetch_by_user_id_failed: "Failed to fetch checkout sessions for user",
    create_failed: "Failed to create checkout session",
    update_failed: "Failed to update checkout session",
  },
};
