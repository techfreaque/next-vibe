export const translations = {
  login: {
    category: "Users",
    title: "Welcome Back",
    description: "Access uncensored AI models and your conversation history.",
    tag: "Authentication",
    options: {
      category: "Users",

      title: "Login Options",
      description: "Login configuration options",
      tag: "login-options",
      container: {
        title: "Login Configuration",
        description: "Configure login settings and options",
      },
      fields: {
        email: {
          label: "Email Address",
          description: "Enter your email address",
          placeholder: "your@email.com",
        },
        allowPasswordAuth: {
          label: "Allow Password Authentication",
          description: "Enable password-based authentication",
        },
        allowSocialAuth: {
          label: "Allow Social Authentication",
          description: "Enable social provider authentication",
        },
        maxAttempts: {
          label: "Maximum Login Attempts",
          description: "Maximum number of login attempts allowed",
        },
        requireTwoFactor: {
          label: "Require Two-Factor Authentication",
          description: "Require 2FA for user login",
        },
        socialProviders: {
          label: "Social Providers",
          description: "Available social authentication providers",
        },
        socialProvider: {
          title: "Social Provider",
          description: "Social authentication provider configuration",
          enabled: {
            label: "Enabled",
            description: "Whether this provider is enabled",
          },
          name: {
            label: "Provider Name",
            description: "Name of the social provider",
          },
          providers: {
            label: "Provider Options",
            description: "Available social provider options",
          },
        },
      },
      response: {
        title: "Login Options Response",
        description: "Available login configuration options",
        success: {
          badge: "Success",
        },
        message: {
          content: "Status Message",
        },
        forUser: {
          content: "Email Address",
        },
        loginMethods: {
          title: "Login Methods",
          description: "Available authentication methods",
          password: {
            title: "Password Login",
            description: "Standard password authentication",
            enabled: {
              badge: "Enabled",
            },
          },
          social: {
            title: "Social Login",
            description: "Social media authentication options",
            enabled: {
              badge: "Enabled",
            },
            providers: {
              item: {
                title: "Social Provider",
                description: "Social authentication provider",
              },
              name: {
                content: "Provider Name",
              },
              id: {
                content: "Provider ID",
              },
              enabled: {
                badge: "Available",
              },
              description: "Provider Description",
            },
          },
        },
        security: {
          title: "Security Settings",
          description: "Authentication security requirements",
          maxAttempts: {
            content: "Maximum Login Attempts",
          },
          requireTwoFactor: {
            badge: "2FA Required",
          },
        },
        recommendations: {
          item: "Recommended Login Option",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
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
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "Changes were not saved",
        },
      },
      success: {
        title: "Success",
        description: "Login options retrieved successfully",
      },
      post: {
        title: "Login Options",
        description: "Get available login options",
        response: {
          title: "Login Options Response",
          description: "Available login configuration options",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          server: {
            title: "Server Error",
            description: "Internal server error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
        },
        success: {
          description: "Login options retrieved successfully",
        },
      },
      enums: {
        socialProviders: {
          google: "Google",
          github: "GitHub",
          facebook: "Facebook",
        },
      },
      messages: {
        successMessage: "Login options retrieved successfully",
        passwordAuthDescription: "Log in with your email and password",
        socialAuthDescription: "Log in with your social media accounts",
        continueWithProvider: "Continue with {{provider}}",
        twoFactorRequired: "Enhanced security: 2FA required",
        standardSecurity: "Standard security requirements",
        tryPasswordFirst: "Try password login first",
        useSocialLogin: "Use social login",
        socialLoginFaster: "Social login is faster for new users",
      },
    },
    actions: {
      submit: "Login",
      submitting: "Logging in...",
    },
    fields: {
      email: {
        label: "Your Email",
        description: "The email you signed up with.",
        placeholder: "Enter your email",
        validation: {
          required: "Email is required",
          invalid: "Please enter a valid email address",
        },
      },
      password: {
        label: "Your Password",
        description: "Enter the password you set during signup.",
        placeholder: "Enter your password",
        help: "Enter your account password",
        validation: {
          required: "Password is required",
          minLength: "Password must be at least 8 characters long",
        },
      },
      rememberMe: {
        label: "Keep me logged in",
      },
    },
    groups: {
      credentials: {
        title: "Login Credentials",
        description: "Enter your login information",
      },
      options: {
        title: "Login Options",
        description: "Additional login preferences and settings",
      },
      preferences: {
        title: "Login Preferences",
        description: "Additional login options",
      },
      advanced: {
        title: "Advanced Options",
        description: "Advanced login settings",
      },
    },
    footer: {
      forgotPassword: "Forgot password?",
      createAccount: "Don't have an account? Sign up",
    },
    response: {
      title: "Login Response",
      description: "Login response data",
      success: "Login Successful",
      message: "Status Message",
      user: {
        title: "User Details",
        description: "Logged in user information",
        id: "User ID",
        email: "Email Address",
        firstName: "First Name",
        lastName: "Last Name",
        privateName: "Private Name",
        publicName: "Public Name",
        imageUrl: "Profile Image",
      },
      sessionInfo: {
        title: "Session Information",
        description: "User session details",
        expiresAt: "Session Expires",
        rememberMeActive: "Remember Me Status",
        loginLocation: "Login Location",
      },
      nextSteps: {
        title: "Next Steps",
        item: "Next Steps",
      },
    },
    errors: {
      title: "Login Error",
      account_locked: "Account is locked",
      accountLocked: "Account is locked",
      accountLockedDescription:
        "Your account has been locked. Please contact support.",
      invalid_credentials: "Invalid email or password",
      two_factor_required: "Two-factor authentication required",
      auth_error: "Authentication error occurred",
      user_not_found: "User not found",
      session_creation_failed: "Failed to create session",
      token_save_failed: "Failed to save authentication token",
      validation: {
        title: "Validation Failed",
        description: "Please check your input",
      },
      unauthorized: {
        title: "Login Failed",
        description: "Invalid credentials",
      },
      unknown: {
        title: "Login Error",
        description: "An error occurred during login",
      },
      network: {
        title: "Network Error",
        description: "Connection failed",
      },
      forbidden: {
        title: "Access Denied",
        description: "Login not allowed",
      },
      notFound: {
        title: "User Not Found",
        description: "User account not found",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "Changes were not saved",
      },
      conflict: {
        title: "Login Conflict",
        description: "Login conflict detected",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
    },
    success: {
      title: "Login Successful",
      description: "You have been logged in",
      message: "Welcome back! You have successfully logged in.",
    },
    token: {
      save: {
        failed: "Failed to save authentication token",
        success: "Authentication token saved successfully",
      },
    },
    process: {
      failed: "Login process failed",
    },
    enums: {
      socialProviders: {
        google: "Google",
        github: "GitHub",
        facebook: "Facebook",
      },
    },
    dev: {
      quickLogin: "Dev Quick Login",
    },
  },
  resetPassword: {
    confirm: {
      category: "Users",

      title: "Confirm Password Reset",
      description: "Confirm your password reset with a new password",
      tag: "Password Reset",
      email: {
        title: "Password Reset Successful",
        subject: "Password Successfully Reset - {{appName}}",
        previewText:
          "Your {{appName}} password has been reset. Log in and start chatting with {{modelCount}} AI models.",
        greeting: "Hey {{name}},",
        successMessage:
          "Your password has been reset. You're all set - log in and pick up where you left off.",
        loginButton: "Log In to {{appName}}",
        promoText: "{{modelCount}} AI models. No filters. No lectures.",
        securityWarning:
          "Didn't reset your password? Contact support immediately - your account may be at risk.",
      },
      groups: {
        verification: {
          title: "Verification",
          description: "Verify your password reset request",
        },
        newPassword: {
          title: "New Password",
          description: "Set your new password",
        },
      },
      fields: {
        token: {
          label: "Reset Token",
          description: "The password reset token from your email",
          placeholder: "Enter reset token",
          help: "Check your email for the password reset token and enter it here",
          validation: {
            required: "Reset token is required",
          },
        },
        email: {
          label: "Email Address",
          description: "Your email address",
          placeholder: "Enter your email address",
          validation: {
            invalid: "Please enter a valid email address",
          },
        },
        password: {
          label: "New Password",
          description: "Your new password",
          placeholder: "Enter new password",
          help: "Choose a strong password with at least 8 characters including letters, numbers, and symbols",
          validation: {
            minLength: "Password must be at least 8 characters long",
          },
        },
        confirmPassword: {
          label: "Confirm Password",
          description: "Confirm your new password",
          placeholder: "Confirm new password",
          validation: {
            minLength: "Password must be at least 8 characters long",
          },
        },
      },
      validation: {
        passwords: {
          mismatch: "Passwords do not match",
        },
      },
      response: {
        title: "Password Reset Response",
        description: "Password reset confirmation response",
        message: {
          label: "Message",
          description: "Response message",
        },
        securityTip:
          "Consider enabling two-factor authentication for better security",
        nextSteps: [
          "Log in with your new password",
          "Update saved passwords in your browser",
          "Consider enabling 2FA for added security",
        ],
      },
      errors: {
        title: "Password Reset Error",
        no_email: "No account found with that email address",
        validation: {
          title: "Validation Error",
          description: "Please check your input and try again",
          passwordsDoNotMatch: "Passwords do not match",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Invalid or expired reset token",
        },
        internal: {
          title: "Server Error",
          description: "An internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network connection error",
        },
        forbidden: {
          title: "Access Denied",
          description: "You do not have permission to perform this action",
        },
        notFound: {
          title: "Not Found",
          description: "Reset token not found or expired",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred while processing your request",
        },
      },
      success: {
        title: "Password Reset Successful",
        description: "Your password has been successfully reset",
        message: "Password has been reset successfully",
        password_reset: "Your password has been successfully reset",
      },
      actions: {
        requestNewLink: "Request a New Reset Link",
      },
      emailTemplates: {
        confirm: {
          name: "Password Reset Confirmation Email",
          description:
            "Email sent to users after their password has been successfully reset",
          category: "Authentication",
          preview: {
            publicName: {
              label: "Public Name",
              description: "The user's public display name",
            },
            userId: {
              label: "User ID",
              description: "The user's unique identifier",
            },
          },
        },
      },
    },
    request: {
      category: "Users",
      title: "Reset Password Request",
      description: "Request password reset",
      tag: "Password Reset",
      ui: {
        title: "Reset Your Password",
        subtitle:
          "Enter your email address and we'll send you a link to reset your password",
        sendResetLink: "Send Reset Link",
        alreadyHaveAccount: "Already have an account? Sign in",
      },
      actions: {
        submitting: "Sending...",
      },
      email: {
        title: "Reset Your {{appName}} Password",
        subject: "Password Reset Request - {{appName}}",
        previewText:
          "Reset your {{appName}} password - link valid for {{hours}} hours.",
        greeting: "Hey {{name}},",
        requestInfo:
          "Someone requested a password reset for your {{appName}} account. If that was you, click the button below.",
        buttonText: "Reset My Password",
        expirationInfo:
          "Link expires in {{hours}} hours. If you didn't request this, ignore this email - your password is unchanged.",
        signoff: "The {{appName}} Team",
        promoText: "{{modelCount}} AI models. No filters. No lectures.",
      },
      groups: {
        emailInput: {
          title: "Email Input",
          description: "Enter your email address to receive reset instructions",
        },
      },
      fields: {
        email: {
          label: "Email Address",
          description: "Enter your email address",
          placeholder: "your@email.com",
          help: "Enter the email address associated with your account",
          validation: {
            invalid: "Please enter a valid email address",
          },
        },
      },
      response: {
        title: "Reset Request Response",
        description: "Password reset request response",
        success: {
          message: "Password reset link sent successfully",
        },
        deliveryInfo: {
          estimatedTime: "within 5 minutes",
          expiresAt: "4 hours from now",
        },
        nextSteps: {
          checkEmail: "Check your email inbox and spam folder",
          clickLink: "Click the reset link in the email",
          createPassword: "Create a new secure password",
        },
      },
      errors: {
        title: "Error",
        validation: {
          title: "Validation Error",
          description: "Invalid input provided",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Request not authorized",
        },
        internal: {
          title: "Internal Error",
          description: "Internal server error",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network connection error",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "Changes were not saved",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        no_email: "No account found with that email address",
        email_generation_failed: "Failed to generate email",
      },
      success: {
        title: "Request Sent",
        description: "Password reset request sent successfully",
      },
      post: {
        title: "Request",
        description: "Request endpoint",
        form: {
          title: "Request Configuration",
          description: "Configure request parameters",
        },
        response: {
          title: "Response",
          description: "Request response data",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
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
            description: "Resource not found",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
      emailTemplates: {
        request: {
          name: "Password Reset Request Email",
          description:
            "Email sent to users with a link to reset their password",
          category: "Authentication",
          preview: {
            publicName: {
              label: "Public Name",
              description: "The user's public display name",
            },
            userId: {
              label: "User ID",
              description: "The user's unique identifier",
            },
            passwordResetUrl: {
              label: "Password Reset URL",
              description: "The URL for resetting the password",
            },
          },
        },
      },
    },
    validate: {
      category: "Users",

      title: "Validate Reset Password Token",
      description: "Validate password reset token endpoint",
      tag: "Password Reset Validation",
      groups: {
        tokenInput: {
          title: "Token Validation",
          description: "Enter the password reset token to validate",
        },
      },
      fields: {
        token: {
          label: "Reset Token",
          description: "Password reset token from email",
          placeholder: "Enter reset token",
          help: "Enter the token you received in your email",
          validation: {
            required: "Reset token is required",
          },
        },
      },
      response: {
        title: "Validation Result",
        description: "Token validation response",
        valid: "Token Valid",
        message: "Validation Message",
        validationMessage: "Reset token validation completed",
        userId: "User ID",
        expiresAt: "Token Expires At",
        nextSteps: {
          item: "Next Steps After Validation",
          steps: [
            "Proceed to set your new password",
            "Choose a strong, unique password",
          ],
        },
      },
      errors: {
        title: "Error",
        validation: {
          title: "Validation Error",
          description: "Token validation failed",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Invalid or expired token",
        },
        internal: {
          title: "Internal Error",
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
          description: "Token not found",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "Unsaved changes detected",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
      },
      success: {
        title: "Token Valid",
        description: "Password reset token is valid",
      },
      post: {
        title: "Validate",
        description: "Validate endpoint",
        form: {
          title: "Validate Configuration",
          description: "Configure validate parameters",
        },
        response: {
          title: "Response",
          description: "Validate response data",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
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
            description: "Resource not found",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
    },
    actions: {
      back: "Back",
      submit: "Submit",
      submitting: "Submitting...",
    },
    success: {
      password_reset: "Your password has been successfully reset.",
    },
    errors: {
      tokenValidationFailed: "Token validation failed",
      userLookupFailed: "Failed to lookup user",
      tokenDeletionFailed: "Failed to delete token",
      userDeletionFailed: "Failed to delete user",
      resetFailed: "Password reset failed",
      tokenCreationFailed: "Failed to create reset token",
      noDataReturned: "No data returned from database",
      tokenInvalid: "Reset token is invalid",
      tokenExpired: "Reset token has expired",
      tokenVerificationFailed: "Token verification failed",
      userNotFound: "User not found",
      passwordUpdateFailed: "Failed to update password",
      passwordResetFailed: "Password reset failed",
      requestFailed: "Reset request failed",
      emailMismatch: "Email does not match",
      confirmationFailed: "Password reset confirmation failed",
    },
  },
  signup: {
    category: "Users",

    _components: {
      passwordStrength: {
        label: "Password Strength",
        weak: "Weak",
        fair: "Fair",
        good: "Good",
        strong: "Strong",
        requirement: {
          minLength: {
            icon: "✗",
            text: "At least 8 characters",
          },
          uppercase: {
            icon: "✗",
            text: "At least one uppercase letter",
          },
          lowercase: {
            icon: "✗",
            text: "At least one lowercase letter",
          },
          number: {
            icon: "✗",
            text: "At least one number",
          },
          special: {
            icon: "!",
            text: "Special character (optional, improves strength)",
          },
        },
      },
      post: {
        title: "_components",
        description: "_components endpoint",
        form: {
          title: "_components Configuration",
          description: "Configure _components parameters",
        },
        response: {
          title: "Response",
          description: "_components response data",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
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
            description: "Resource not found",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
    },
    title: "User Signup",
    description: "User registration endpoint",
    tag: "Authentication",
    form: {
      title: "Welcome to Uncensored AI",
      description:
        "Help build uncensored, privacy-first, and truly independent AI. unbottled.ai is open source and community-driven, your signup supports the development of AI technology that respects your freedom.",
    },
    actions: {
      submit: "Create Account",
      submitting: "Creating Account...",
    },
    fields: {
      privateName: {
        label: "Your Private Name",
        description:
          "How the AI will address you in private conversations. This stays between you and the AI - completely private.",
        placeholder: "Enter your name",
        validation: {
          required: "Private name is required",
          minLength: "Name must be at least 2 characters",
          maxLength: "Name must be less than 100 characters",
        },
      },
      publicName: {
        label: "Your Public Name",
        description:
          "Your identity in public chats and forums. Other users and AIs will see this name. Choose wisely - it represents you in the community.",
        placeholder: "Enter display name",
        validation: {
          required: "Display name is required",
          minLength: "Display name must be at least 2 characters",
          maxLength: "Display name must be less than 100 characters",
        },
      },
      email: {
        label: "Your Email",
        description:
          "Your login credentials and contact method. Kept private - never shared with other users or AIs.",
        placeholder: "Enter email address",
        help: "This will be your login email and primary contact method",
        validation: {
          required: "Email is required",
          invalid: "Please enter a valid email address",
        },
      },
      password: {
        label: "Your Password",
        description:
          "Strong passwords protect your account. We're implementing end-to-end encryption soon - at that point, password resets will clear your message history since only you hold the decryption key. Save it somewhere safe.",
        placeholder: "Enter password",
        validation: {
          required: "Password is required",
          minLength: "Password must be at least 8 characters",
          complexity:
            "Password must contain uppercase, lowercase, and a number",
        },
      },
      confirmPassword: {
        label: "Confirm Your Password",
        validation: {
          required: "Please confirm your password",
          minLength: "Password must be at least 8 characters",
          mismatch: "Passwords do not match",
        },
      },
      subscribeToNewsletter: {
        label: "Subscribe to Newsletter",
        description:
          "Occasional updates about new models and features. No spam, just what matters.",
      },
      acceptTerms: {
        label: "Accept Terms & Conditions",
        description:
          "Our terms and conditions respect your freedom and privacy.",
        termsLink: "terms",
        conditionsLink: "conditions",
        descriptionPrefix: "Our",
        descriptionAnd: "and",
        descriptionSuffix: "respect your freedom and privacy.",
        validation: {
          required: "You must accept the terms and conditions to continue",
        },
      },
      referralCode: {
        label: "Referral Code (optional)",
        description:
          "Have a friend on unbottled.ai? Enter their code to support them. They get rewarded for bringing you in.",
        placeholder: "Enter referral code (optional)",
        labelPrefilled: "Referral code",
        descriptionPrefilled:
          "Your friend gets rewarded when you create your account.",
      },
      supportedSkillId: {
        label: "Support a Creator",
        description:
          "Your signup supports the creator of this skill with a +5% bonus on your subscriptions.",
        selectorTitle: "Support a Creator",
        selectorDescription:
          "You added skills by independent creators to your favorites. Pick one to support - they get +5% from your subscriptions. You can change this anytime.",
        selectorNone: "None (skip)",
      },
      localFavorites: {
        label: "Local Favorites",
      },
    },

    footer: {
      alreadyHaveAccount: "Already have an account? Sign in",
    },
    errors: {
      title: "Signup Error",
      validation: {
        title: "Validation Error",
        description: "Please check your input and try again",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Account Conflict",
        description: "An account with this email already exists",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      internal: {
        title: "Internal Error",
        description: "An internal error occurred",
      },
    },
    emailCheck: {
      title: "Email Availability Check",
      description: "Check if email is available for registration",
      tag: "Email Check",
      fields: {
        email: {
          label: "Email Address",
          description: "Email to check",
          placeholder: "Enter email address",
          validation: {
            invalid: "Invalid email format",
          },
        },
      },
      response: {
        title: "Email Check Response",
        description: "Email availability check result",
        available: "Email Available",
        message: "Availability Message",
      },
      errors: {
        validation: {
          title: "Invalid Email",
          description: "Please enter a valid email address",
        },
        internal: {
          title: "Email Check Error",
          description: "Error checking email availability",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        conflict: {
          title: "Email Already Taken",
          description: "This email is already registered",
        },
        forbidden: {
          title: "Access Denied",
          description: "You don't have permission to check this email",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while checking email",
        },
        notFound: {
          title: "Service Not Found",
          description: "Email check service is not available",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to check email",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Email Check Complete",
        description: "Email availability checked successfully",
      },
    },
    post: {
      title: "Signup",
      description: "Signup endpoint",
      form: {
        title: "Signup Configuration",
        description: "Configure signup parameters",
      },
      response: {
        title: "Response",
        description: "Signup response data",
        success: "Signup Successful",
        message: "Status Message",
        userId: "User ID",
        nextSteps: "Next Steps",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
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
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
        processing: "Processing signup successfully",
      },
    },
    response: {
      title: "Response",
      description: "Signup response data",
      success: "Signup Successful",
      message: "Status Message",
      user: {
        id: "User ID",
        email: "Email Address",
        firstName: "First Name",
        lastName: "Last Name",
        privateName: "Private Name",
        publicName: "Public Name",
        imageUrl: "Profile Image URL",
        verificationRequired: "Verification Required",
      },
      verificationInfo: {
        title: "Email Verification",
        description: "Details about the email verification process",
        emailSent: "Email Sent",
        expiresAt: "Verification Expires At",
        checkSpamFolder: "Check Spam Folder",
      },
      nextSteps: "Next Steps",
    },
    success: {
      title: "Signup Successful",
      description: "Your account has been created successfully",
    },
    admin_notification: {
      title: "New User Signup",
      subject: "New User Signup - {{privateName}}",
      preview: "New user {{privateName}} has signed up",
      message: "A new user has signed up for {{appName}}",
      privateName: "Private Name",
      publicName: "Public Name",
      email: "Email",
      locale: "Language",
      creditBalance: "Credit Balance",
      leadCreditBalance: "Lead Credit Balance",
      signup_preferences: "Signup Preferences",
      user_details: "User Details",
      basic_information: "Basic Information",
      signup_type: "Signup Type",
      direct_signup: "Direct Signup",
      newsletter: "Newsletter",
      subscribed: "Subscribed",
      not_subscribed: "Not Subscribed",
      signup_details: "Signup Details",
      signup_date: "Signup Date",
      user_id: "User ID",
      recommended_next_steps: "Recommended Next Steps",
      direct_recommendation: "Review user profile and payment setup",
      contact_user: "Contact User",
      footer: "This is an automated notification from {{appName}}",
    },
    email: {
      subject: "You're in - {{appName}} is ready for you",
      previewText:
        "Hey {{privateName}}, your account is ready. Chat with Claude, GPT, Gemini, DeepSeek, and {{modelCount}} more - free, no card needed.",
      headline: "Your AI is waiting.",
      greeting: "Hey {{privateName}},",
      intro:
        "Welcome to {{appName}}. You just unlocked access to the most complete AI chat platform out there - everything you love about ChatGPT, plus open-source models, and models without content filters.",
      models: {
        title: "{{modelCount}} models across 3 categories",
        mainstream: "Mainstream",
        open: "Open Source",
        uncensored: "Uncensored",
      },
      free: {
        title: "What you get for free, forever:",
        credits: "{{freeCredits}} credits per month - no card, no expiry",
        allModels: "Access to all {{modelCount}} AI models",
        uncensored: "4 uncensored models that actually answer your questions",
        chatModes: "Private, Incognito, Shared, and Public chat modes",
        noCard: "No credit card required - ever",
      },
      ctaButton: "Start Chatting Now",
      upgrade: {
        title: "Want more?",
        desc: "{{subscriptionPrice}}/month gets you {{subscriptionCredits}} credits - that's 40× more. Plus you can buy extra credit packs that never expire. Perfect if you use AI daily.",
        cta: "Upgrade to Pro",
      },
      signoff: "Happy chatting,\nThe {{appName}} Team",
      ps: "P.S. Use Incognito mode to keep conversations on your device only - we never store them on our servers.",
    },
    emailTemplates: {
      welcome: {
        name: "Signup Welcome Email",
        description:
          "Welcome email sent to users after successful registration",
        category: "Authentication",
        preview: {
          privateName: {
            label: "Private Name",
            description: "The user's private name",
          },
          userId: {
            label: "User ID",
            description: "The user's unique identifier",
          },
          leadId: {
            label: "Lead ID",
            description: "The user's lead identifier",
          },
        },
      },
      adminSignup: {
        name: "Admin Signup Notification Email",
        description: "Email sent to admins when a new user registers",
        category: "Administration",
        preview: {
          privateName: {
            label: "Private Name",
          },
          publicName: {
            label: "Public Name",
          },
          email: {
            label: "Email Address",
          },
          userId: {
            label: "User ID",
          },
          subscribeToNewsletter: {
            label: "Newsletter Subscription",
          },
        },
      },
    },
  },
};
