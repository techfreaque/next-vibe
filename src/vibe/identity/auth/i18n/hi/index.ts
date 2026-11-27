import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "ऑथेंटिकेशन",
  search: {
    tag: "ऑथ",
  },
  authClient: {
    errors: {
      status_save_failed: "ऑथेंटिकेशन स्टेटस सेव नहीं हो सका",
      status_remove_failed: "ऑथेंटिकेशन स्टेटस हटाया नहीं जा सका",
      status_check_failed: "ऑथेंटिकेशन स्टेटस जाँचा नहीं जा सका",
      token_save_failed: "ऑथेंटिकेशन टोकन सेव नहीं हो सका",
      token_get_failed: "ऑथेंटिकेशन टोकन नहीं मिल सका",
      token_remove_failed: "ऑथेंटिकेशन टोकन हटाया नहीं जा सका",
      token_save_failed_detail: "ऑथेंटिकेशन टोकन सेव नहीं हो सका: {{error}}",
      token_get_failed_detail: "ऑथेंटिकेशन टोकन नहीं मिल सका: {{error}}",
      token_remove_failed_detail: "ऑथेंटिकेशन टोकन हटाया नहीं जा सका: {{error}}",
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
    sessionNotFound: "सेशन नहीं मिला",
    sessionExpired: "Session expired",
    errorValidatingUserSession: "Error validating user session",
    errorGettingUserRoles: "Error getting user roles",
    errorCheckingUserAuth: "Error checking user authentication",
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
  },
  errors: {
    token_generation_failed: "ऑथेंटिकेशन टोकन नहीं बन सका",
    invalid_session: "सेशन अमान्य है या एक्सपायर हो चुका है",
    missing_request_context: "रिक्वेस्ट कॉन्टेक्स्ट गायब है",
    missing_locale: "रिक्वेस्ट में लोकेल गायब है",
    unsupported_platform: "प्लेटफ़ॉर्म सपोर्टेड नहीं है",
    session_retrieval_failed: "सेशन नहीं मिल सका",
    missing_token: "ऑथेंटिकेशन टोकन गायब है",
    invalid_token_signature: "टोकन सिग्नेचर अमान्य है",
    invalid_token_signature_detail: "टोकन सिग्नेचर की जाँच विफल रही: {{error}}",
    jwt_payload_missing_id: "JWT पेलोड में यूज़र ID गायब है",
    cookie_set_failed: "ऑथेंटिकेशन कुकी सेट नहीं हो सकी: {{error}}",
    cookie_clear_failed: "ऑथेंटिकेशन कुकी हटाई नहीं जा सकी: {{error}}",
    publicPayloadNotSupported: "CLI ऑथेंटिकेशन के लिए पब्लिक JWT पेलोड सपोर्टेड नहीं है",
    jwt_signing_failed: "JWT टोकन साइन नहीं हो सका: {{error}}",
    authentication_failed: "ऑथेंटिकेशन विफल रहा: {{error}}",
    user_not_authenticated: "यूज़र ऑथेंटिकेटेड नहीं है: {{email}}",
    publicUserNotAllowed: "इस एंडपॉइंट के लिए पब्लिक यूज़र को अनुमति नहीं है",
    validation_failed: "वैलिडेशन विफल रहा",
    failed_to_create_lead: "लीड नहीं बन सकी",
    native: {
      unsupported: "यह ऑथेंटिकेशन तरीका React Native पर सपोर्टेड नहीं है",
      storage_failed: "ऑथेंटिकेशन डेटा सेव नहीं हो सका: {{error}}",
      clear_failed: "ऑथेंटिकेशन डेटा हटाया नहीं जा सका: {{error}}",
    },
    not_implemented_native: "यह फ़ीचर React Native के लिए अभी लागू नहीं है",
    unknownError: "ऑथेंटिकेशन के दौरान अज्ञात एरर हुआ",
  },
  post: {
    title: "ऑथ",
    description: "ऑथ एंडपॉइंट",
    form: {
      title: "ऑथ कॉन्फ़िगरेशन",
      description: "ऑथ पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "ऑथ रिस्पॉन्स डेटा",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      missing_locale: {
        title: "लोकेल गायब है",
        description: "लोकेल पैरामीटर ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
      token_generation_failed: {
        title: "टोकन बनाना विफल रहा",
        description: "ऑथेंटिकेशन टोकन नहीं बन सका",
      },
      invalid_session: {
        title: "अमान्य सेशन",
        description: "सेशन अमान्य है या एक्सपायर हो चुका है",
      },
      missing_request_context: {
        title: "रिक्वेस्ट कॉन्टेक्स्ट गायब है",
        description: "रिक्वेस्ट कॉन्टेक्स्ट गायब है",
      },
      unsupported_platform: {
        title: "प्लेटफ़ॉर्म सपोर्टेड नहीं है",
        description: "प्लेटफ़ॉर्म सपोर्टेड नहीं है",
      },
      session_retrieval_failed: {
        title: "सेशन मिलना विफल रहा",
        description: "सेशन नहीं मिल सका",
      },
      missing_token: {
        title: "टोकन गायब है",
        description: "ऑथेंटिकेशन टोकन गायब है",
      },
      invalid_token_signature: {
        title: "टोकन सिग्नेचर अमान्य है",
        description: "टोकन सिग्नेचर अमान्य है",
      },
      jwt_payload_missing_id: {
        title: "JWT पेलोड में ID गायब है",
        description: "JWT पेलोड में यूज़र ID गायब है",
      },
      cookie_set_failed: {
        title: "कुकी सेट नहीं हुई",
        description: "ऑथेंटिकेशन कुकी सेट नहीं हो सकी",
      },
      cookie_clear_failed: {
        title: "कुकी हटाना विफल रहा",
        description: "ऑथेंटिकेशन कुकी हटाई नहीं जा सकी",
      },
    },
    success: {
      title: "सफल",
      description: "ऑपरेशन सफल रहा",
    },
  },
  check: {
    get: {
      title: "ऑथेंटिकेशन जाँचें",
      description: "मौजूदा ऑथेंटिकेशन स्टेटस जाँचें",
      response: {
        title: "ऑथेंटिकेशन स्टेटस",
        description: "मौजूदा ऑथेंटिकेशन स्थिति",
        authenticated: "ऑथेंटिकेटेड",
        tokenValid: "टोकन वैध है",
      },
    },
  },
  enums: {
    webSocketErrorCode: {
      unauthorized: "अनधिकृत",
      forbidden: "प्रतिबंधित",
      invalidToken: "अमान्य टोकन",
      tokenExpired: "टोकन एक्सपायर हो गया",
      serverError: "सर्वर एरर",
    },
  },
};
