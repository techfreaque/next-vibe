export const translations = {
  authClient: {
    errors: {
      status_save_failed: "Failed to save authentication status",
      status_remove_failed: "Failed to remove authentication status",
      status_check_failed: "Failed to check authentication status",
      token_save_failed: "Failed to save authentication token",
      token_get_failed: "Failed to retrieve authentication token",
      token_remove_failed: "Failed to remove authentication token",
    },
  },
  debug: {
    getAuthMinimalUserNext: {
      start: "getAuthMinimalUserNext: - Checking authentication first",
      result: "getAuthMinimalUserNext: getCurrentUserNext result",
      authenticated:
        "getAuthMinimalUserNext: User is authenticated, getting leadId",
      returningAuth: "getAuthMinimalUserNext: Returning authenticated user",
      notAuthenticated:
        "getAuthMinimalUserNext: User not authenticated, returning public user",
    },
    signingJwt: "Signing JWT",
    jwtSignedSuccessfully: "JWT signed successfully",
    errorSigningJwt: "Error signing JWT",
    verifyingJwt: "Verifying JWT",
    invalidTokenPayload: "Invalid token payload",
    jwtVerifiedSuccessfully: "JWT verified successfully",
    errorVerifyingJwt: "Error verifying JWT",
    userIdNotExistsInDb: "User ID does not exist in database",
    sessionNotFound: "Session not found",
    sessionExpired: "Session expired",
    errorValidatingUserSession: "Error validating user session",
    errorGettingUserRoles: "Error getting user roles",
    errorCheckingUserAuth: "Error checking user authentication",
    gettingCurrentUserFromTrpc: "Getting current user from tRPC",
    errorGettingAuthUserForTrpc: "Error getting auth user for tRPC",
    errorGettingUserRolesForTrpc: "Error getting user roles for tRPC",
    authenticatingCliUserWithPayload: "Authenticating CLI user with payload",
    errorAuthenticatingCliUserWithPayload:
      "Error authenticating CLI user with payload",
    creatingCliToken: "Creating CLI token",
    errorCreatingCliToken: "Error creating CLI token",
    validatingCliToken: "Validating CLI token",
    errorValidatingCliToken: "Error validating CLI token",
    gettingCurrentUserFromNextjs: "Getting current user from Next.js",
    errorGettingAuthUserForNextjs: "Error getting auth user for Next.js",
    settingNextjsAuthCookies: "Setting Next.js auth cookies",
    clearingNextjsAuthCookies: "Clearing Next.js auth cookies",
    gettingCurrentUserFromToken: "Getting current user from token",
    errorGettingCurrentUserFromCli: "Error getting current user from CLI",
    errorGettingAuthUserForCli: "Error getting auth user for CLI",
    errorGettingUserRolesForCli: "Error getting user roles for CLI",
    tokenFromAuthHeader: "Token from auth header",
    tokenFromCookie: "Token from cookie",
    noTokenFound: "No token found",
    errorExtractingToken: "Error extracting token",
    errorParsingCookies: "Error parsing cookies",
    errorGettingCurrentUserFromTrpc: "Error getting current user from tRPC",
  },
  errors: {
    token_generation_failed: "Failed to generate authentication token",
    invalid_session: "The session is invalid or expired",
    missing_request_context: "Request context is missing",
    missing_locale: "Locale is missing from request",
    unsupported_platform: "Platform is not supported",
    session_retrieval_failed: "Failed to retrieve session",
    missing_token: "Authentication token is missing",
    invalid_token_signature: "Token signature is invalid",
    jwt_payload_missing_id: "JWT payload is missing user ID",
    cookie_set_failed: "Failed to set authentication cookie",
    cookie_clear_failed: "Failed to clear authentication cookie",
    publicPayloadNotSupported:
      "Public JWT payload is not supported for CLI authentication",
    jwt_signing_failed: "Failed to sign JWT token",
    authentication_failed: "Authentication failed",
    user_not_authenticated: "User is not authenticated",
    publicUserNotAllowed: "Public user is not allowed for this endpoint",
    validation_failed: "Validation failed",
    failed_to_create_lead: "Failed to create lead",
    native: {
      unsupported:
        "This authentication method is not supported on React Native",
      storage_failed: "Failed to store authentication data",
      clear_failed: "Failed to clear authentication data",
    },
    not_implemented_native:
      "This feature is not yet implemented for React Native",
  },
  post: {
    title: "Auth",
    description: "Auth endpoint",
    form: {
      title: "Auth Configuration",
      description: "Configure auth parameters",
    },
    response: {
      title: "Response",
      description: "Auth response data",
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
      missing_locale: {
        title: "Missing Locale",
        description: "Locale parameter is required",
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
      token_generation_failed: {
        title: "Token Generation Failed",
        description: "Failed to generate authentication token",
      },
      invalid_session: {
        title: "Invalid Session",
        description: "The session is invalid or expired",
      },
      missing_request_context: {
        title: "Missing Request Context",
        description: "Request context is missing",
      },
      unsupported_platform: {
        title: "Unsupported Platform",
        description: "Platform is not supported",
      },
      session_retrieval_failed: {
        title: "Session Retrieval Failed",
        description: "Failed to retrieve session",
      },
      missing_token: {
        title: "Missing Token",
        description: "Authentication token is missing",
      },
      invalid_token_signature: {
        title: "Invalid Token Signature",
        description: "Token signature is invalid",
      },
      jwt_payload_missing_id: {
        title: "JWT Payload Missing ID",
        description: "JWT payload is missing user ID",
      },
      cookie_set_failed: {
        title: "Cookie Set Failed",
        description: "Failed to set authentication cookie",
      },
      cookie_clear_failed: {
        title: "Cookie Clear Failed",
        description: "Failed to clear authentication cookie",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
  check: {
    get: {
      title: "Check Authentication",
      description: "Check current authentication status",
      response: {
        title: "Authentication Status",
        description: "Current authentication state",
        authenticated: "Authenticated",
        tokenValid: "Token Valid",
      },
    },
  },
  enums: {
    webSocketErrorCode: {
      unauthorized: "Unauthorized",
      forbidden: "Forbidden",
      invalidToken: "Invalid Token",
      tokenExpired: "Token Expired",
      serverError: "Server Error",
    },
  },
};
