export const validationErrorsTranslations = {
  common: {
    invalid_type: "Invalid type provided",
    invalid_literal: "Invalid literal value",
    unrecognized_keys: "Unrecognized keys in object",
    invalid_union: "Invalid union value",
    invalid_union_discriminator: "Invalid union discriminator",
    invalid_enum_value: "Invalid enum value",
    invalid_arguments: "Invalid function arguments",
    invalid_return_type: "Invalid return type",
    invalid_date: "Invalid date",
    invalid_string: "Invalid string format",
    invalid_email: "Invalid email address",
    invalid_url: "Invalid URL format",
    invalid_uuid: "Invalid UUID format",
    too_small: "Value is too small",
    string_too_small: "String is too short",
    number_too_small: "Number is too small",
    array_too_small: "Array has too few items",
    too_big: "Value is too big",
    string_too_big: "String is too long",
    number_too_big: "Number is too big",
    array_too_big: "Array has too many items",
    invalid_intersection_types: "Invalid intersection types",
    not_multiple_of: "Number is not a multiple of required value",
    not_finite: "Number must be finite",
    custom_error: "Validation failed",
    invalid_input: "Invalid input provided",
  },
  user: {
    login: {
      email_invalid: "Please enter a valid email address",
      password_min_length: "Password must be at least 8 characters long",
    },
    signup: {
      first_name_required: "First name is required",
      last_name_required: "Last name is required",
      company_required: "Company name is required",
      email_invalid: "Please enter a valid email address",
      password_min_length: "Password must be at least 8 characters long",
      password_confirmation_required: "Password confirmation is required",
      passwords_do_not_match: "Passwords do not match",
      accept_terms_required: "You must accept the terms and conditions",
    },
    resetPassword: {
      email_invalid: "Please enter a valid email address",
      token_required: "Password reset token is required",
      new_password_min_length:
        "New password must be at least 8 characters long",
      confirm_password_required: "Password confirmation is required",
      passwords_do_not_match: "Passwords do not match",
    },
    profile: {
      first_name_required: "First name is required",
      last_name_required: "Last name is required",
      company_required: "Company is required",
      email_invalid: "Please enter a valid email address",
      current_password_required: "Current password is required",
      current_password_min_length:
        "Current password must be at least 8 characters long",
      new_password_min_length:
        "New password must be at least 8 characters long",
      password_confirmation_required: "Password confirmation is required",
      password_confirmation_min_length:
        "Password confirmation must be at least 8 characters long",
      passwords_do_not_match: "Passwords do not match",
      twitter_url_invalid: "Please enter a valid Twitter profile URL",
      facebook_url_invalid: "Please enter a valid Facebook profile URL",
      instagram_url_invalid: "Please enter a valid Instagram profile URL",
      linkedin_url_invalid: "Please enter a valid LinkedIn profile URL",
      github_url_invalid: "Please enter a valid GitHub profile URL",
      website_url_invalid: "Please enter a valid website URL",
    },
  },
  contact: {
    name_min_length: "Name must be at least 2 characters long",
    email_invalid: "Please enter a valid email address",
    subject_required: "Subject is required",
    subject_min_length: "Subject must be at least 2 characters long",
    message_min_length: "Message must be at least 10 characters long",
    priority_invalid: "Please select a valid priority level",
    status_invalid: "Please select a valid status",
  },
  newsletter: {
    subscribe: {
      email_invalid: "Please enter a valid email address",
    },
    unsubscribe: {
      email_invalid: "Please enter a valid email address",
    },
  },
  businessData: {
    user_id_required: "User ID is required",
    name_required: "Business name is required",
    email_invalid: "Please enter a valid business email address",
    businessInfo: {
      type_required: "Business type is required",
      business_name_required: "Business name is required",
      size_required: "Please select a business size",
      size_invalid:
        "Please select a valid business size: startup, small, medium, large, or enterprise",
      email_invalid: "Please enter a valid business email address",
      website_invalid: "Please enter a valid website URL",
    },
    goals: {
      primary_goals_required: "At least one primary goal is required",
      business_goal_invalid:
        "Please select a valid business goal: increase revenue, grow customer base, improve brand awareness, enhance customer engagement, expand market reach, optimize operations, launch new products, improve customer retention, reduce costs, digital transformation, improve online presence, or generate leads",
    },
    brand: {},
    social: {
      platforms_required: "At least one social media platform is required",
      platform_invalid:
        "Please select a valid social platform: Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest, Snapchat, Discord, Reddit, Telegram, WhatsApp, or Other",
      priority_invalid:
        "Please select a valid priority level: high, medium, or low",
      username_required: "Username/handle is required for each platform",
    },
    profile: {
      first_name_required: "First name is required",
      last_name_required: "Last name is required",
      company_required: "Company is required",
    },
    audience: {
      target_audience_required: "Target audience description is required",
      gender_invalid:
        "Please select a valid gender option: all, male, female, non-binary, or other",
    },
  },
  template: {
    input_value_required: "Input value is required",
    url_param_required: "URL parameter is required",
    output_value_required: "Output value is required",
  },
  phone: {
    number_format:
      "Please enter a valid phone number in E.164 format (e.g., +1234567890)",
  },
  onboarding: {
    name_required: "Full name is required for onboarding",
    email_required: "Email address is required for onboarding",
    email_invalid: "Please enter a valid email address for onboarding",
    business_type_required:
      "Business type selection is required for onboarding",
    target_audience_required: "Target audience description is required",
    target_audience_min_length:
      "Target audience description must be at least 10 characters long",
    select_at_least_one_goal: "Please select at least one business goal",
    social_platforms_required:
      "At least one social media platform must be selected",
    goals_required: "At least one business goal must be selected",
    postal_code_required: "Postal code is required for billing address",
    country_required: "Country selection is required for billing",
    country_invalid: "Please select a valid country from the list",
    plan_required: "Subscription plan selection is required",
    plan_invalid: "Please select a valid subscription plan",
    currency_required: "Currency selection is required for billing",
    currency_invalid: "Please select a valid currency",
  },
  consultation: {
    business_type_required:
      "Business type is required to schedule a consultation",
    contact_email_invalid:
      "Please enter a valid email address for consultation contact",
    name_required: "Name is required for consultation",
    email_invalid: "Please enter a valid email address",
    invalid_selection_type: "Invalid selection type or missing required fields",
    start_date_invalid_datetime:
      "Start date must be a valid ISO datetime format",
    end_date_invalid_datetime: "End date must be a valid ISO datetime format",
    booking_too_early:
      "Consultation must be scheduled at least {{minHours}} hours in advance",
    booking_too_far:
      "Consultation cannot be scheduled more than {{maxMonths}} months in advance",
    non_working_day: "Consultations are only available Monday through Friday",
    outside_business_hours:
      "Consultations are only available between {{startHour}} AM and {{endHour}} PM",
    invalid_date_time: "Please select a valid date and time",
    insufficient_business_days_notice:
      "Consultation must be scheduled at least {{minBusinessDays}} business days in advance",
    weekends_not_available: "Consultations are not available on weekends",
  },
  subscription: {},
  payment: {
    amount_must_be_positive:
      "Payment amount must be a positive number greater than zero",
    success_url_invalid:
      "Success URL must be a valid web address for payment completion redirect",
    cancel_url_invalid:
      "Cancel URL must be a valid web address for payment cancellation redirect",
    payment_method_id_required:
      "Payment method ID is required and cannot be empty",
    transaction_id_invalid: "Transaction ID must be a valid UUID format",
    refund_amount_must_be_positive:
      "Refund amount must be a positive number greater than zero",
    return_url_invalid:
      "Return URL must be a valid web address for customer portal redirect",
    invoice_amount_must_be_positive:
      "Invoice amount must be a positive number greater than zero",
  },
  time: {
    invalid_time_format: "Time must be in valid HH:MM format (e.g., 14:30)",
    invalid_time_range: "Time value must be between 00:00 and 23:59",
  },
};
