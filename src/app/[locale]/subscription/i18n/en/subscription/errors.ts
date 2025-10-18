export const translations = {
  fetch_by_user_id_failed:
    "Failed to fetch subscription data for user: {{userId}}: {{error}}",
  create_failed:
    "Failed to create subscription for user: {{userId}}: No value was returned from the database",
  create_crashed:
    "Failed to create subscription for user: {{userId}}: {{error}}",
  update_failed:
    "Failed to update subscription for user: {{userId}}: No value was returned from the database",
  activate_failed:
    "Failed to activate subscription: user: {{userId}}, plan: {{planId}}: No value was returned from the database",
  activate_crashed:
    "Failed to activate subscription: user: {{userId}}, plan: {{planId}}: {{error}}",
  cancel_failed: "Failed to cancel subscription: {{error}}",
  validation_error: "Invalid subscription data: {{error}}",
  not_found: "Subscription not found",
  user_not_found: "User not found",
  invalid_plan: "Invalid subscription plan",
  database_error: "Database error while processing subscription: {{error}}",
  checkout_session_creation_failed:
    "Failed to create checkout session for subscription",
  stripe_customer_creation_failed:
    "Failed to create Stripe customer: {{error}}",
  sync_failed: "Failed to sync subscription with Stripe: {{error}}",
};
