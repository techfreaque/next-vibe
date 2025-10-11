export const formTranslations = {
  error: {
    validation: {
      title: "Token validation failed",
      description: "The password reset token is invalid or malformed",
    },
    unauthorized: {
      title: "Token unauthorized",
      description: "Your password reset token is invalid or expired",
    },
    server: {
      title: "Token validation server error",
      description: "Unable to validate token due to a server error",
    },
    unknown: {
      title: "Token validation failed",
      description: "An unexpected error occurred while validating token",
    },
  },
  success: {
    title: "Token validation successful",
    description: "Password reset token is valid and ready to use",
  },
};
