import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र्स",
  auth: {
    category: "ऑथेंटिकेशन",
    search: {
      tag: "ऑथ",
    },
    authClient: {
      errors: {
        status_save_failed: "ऑथेंटिकेशन स्थिति सेव नहीं हो सकी",
        status_remove_failed: "ऑथेंटिकेशन स्थिति हटाई नहीं जा सकी",
        status_check_failed: "ऑथेंटिकेशन स्थिति जाँची नहीं जा सकी",
        token_save_failed: "ऑथेंटिकेशन टोकन सेव नहीं हो सका",
        token_get_failed: "ऑथेंटिकेशन टोकन नहीं मिल सका",
        token_remove_failed: "ऑथेंटिकेशन टोकन हटाया नहीं जा सका",
      },
    },
    debug: {
      getAuthMinimalUserNext: {
        start: "getAuthMinimalUserNext: पहले ऑथेंटिकेशन जाँचा जा रहा है",
        result: "getAuthMinimalUserNext: getCurrentUserNext का नतीजा",
        authenticated:
          "getAuthMinimalUserNext: यूज़र ऑथेंटिकेटेड है, leadId ली जा रही है",
        returningAuth: "getAuthMinimalUserNext: ऑथेंटिकेटेड यूज़र लौटाया जा रहा है",
        notAuthenticated:
          "getAuthMinimalUserNext: यूज़र ऑथेंटिकेटेड नहीं, सार्वजनिक यूज़र लौटाया जा रहा है",
      },
      signingJwt: "JWT साइन हो रहा है",
      jwtSignedSuccessfully: "JWT सफलतापूर्वक साइन हुआ",
      errorSigningJwt: "JWT साइन करने में एरर",
      verifyingJwt: "JWT की जाँच हो रही है",
      invalidTokenPayload: "टोकन पेलोड गलत है",
      jwtVerifiedSuccessfully: "JWT की जाँच सफल रही",
      errorVerifyingJwt: "JWT की जाँच में एरर",
      userIdNotExistsInDb: "यूज़र ID डेटाबेस में मौजूद नहीं है",
      sessionNotFound: "सेशन नहीं मिला",
      sessionExpired: "सेशन समाप्त हो गया",
      errorValidatingUserSession: "यूज़र सेशन की जाँच में एरर",
      errorGettingUserRoles: "यूज़र रोल पाने में एरर",
      errorCheckingUserAuth: "यूज़र ऑथेंटिकेशन जाँचने में एरर",
      authenticatingCliUserWithPayload: "पेलोड के साथ CLI यूज़र ऑथेंटिकेट हो रहा है",
      errorAuthenticatingCliUserWithPayload:
        "पेलोड के साथ CLI यूज़र ऑथेंटिकेट करने में एरर",
      creatingCliToken: "CLI टोकन बन रहा है",
      errorCreatingCliToken: "CLI टोकन बनाने में एरर",
      validatingCliToken: "CLI टोकन की जाँच हो रही है",
      errorValidatingCliToken: "CLI टोकन की जाँच में एरर",
      gettingCurrentUserFromNextjs: "Next.js से मौजूदा यूज़र लिया जा रहा है",
      errorGettingAuthUserForNextjs: "Next.js के लिए ऑथ यूज़र पाने में एरर",
      settingNextjsAuthCookies: "Next.js ऑथ कुकी सेट हो रही हैं",
      clearingNextjsAuthCookies: "Next.js ऑथ कुकी साफ़ हो रही हैं",
      gettingCurrentUserFromToken: "टोकन से मौजूदा यूज़र लिया जा रहा है",
      errorGettingCurrentUserFromCli: "CLI से मौजूदा यूज़र पाने में एरर",
      errorGettingAuthUserForCli: "CLI के लिए ऑथ यूज़र पाने में एरर",
      errorGettingUserRolesForCli: "CLI के लिए यूज़र रोल पाने में एरर",
      tokenFromAuthHeader: "ऑथ हेडर से टोकन",
      tokenFromCookie: "कुकी से टोकन",
      noTokenFound: "कोई टोकन नहीं मिला",
      errorExtractingToken: "टोकन निकालने में एरर",
      errorParsingCookies: "कुकी पार्स करने में एरर",
    },
    errors: {
      token_generation_failed: "ऑथेंटिकेशन टोकन बनाना फ़ेल हुआ",
      invalid_session: "सेशन गलत है या समाप्त हो चुका है",
      missing_request_context: "रिक्वेस्ट संदर्भ ग़ायब है",
      missing_locale: "रिक्वेस्ट में लोकेल ग़ायब है",
      unsupported_platform: "प्लेटफ़ॉर्म सपोर्टेड नहीं है",
      session_retrieval_failed: "सेशन पाना फ़ेल हुआ",
      missing_token: "ऑथेंटिकेशन टोकन ग़ायब है",
      invalid_token_signature: "टोकन सिग्नेचर गलत है",
      jwt_payload_missing_id: "JWT पेलोड में यूज़र ID ग़ायब है",
      cookie_set_failed: "ऑथेंटिकेशन कुकी सेट करना फ़ेल हुआ",
      cookie_clear_failed: "ऑथेंटिकेशन कुकी साफ़ करना फ़ेल हुआ",
      publicPayloadNotSupported:
        "CLI ऑथेंटिकेशन के लिए सार्वजनिक JWT पेलोड सपोर्टेड नहीं है",
      jwt_signing_failed: "JWT टोकन साइन करना फ़ेल हुआ",
      authentication_failed: "ऑथेंटिकेशन फ़ेल हुआ",
      user_not_authenticated: "यूज़र ऑथेंटिकेटेड नहीं है",
      publicUserNotAllowed: "इस एंडपॉइंट के लिए सार्वजनिक यूज़र मंज़ूर नहीं है",
      validation_failed: "वैलिडेशन फ़ेल",
      failed_to_create_lead: "लीड बनाना फ़ेल हुआ",
      native: {
        unsupported: "यह ऑथेंटिकेशन तरीक़ा React Native पर सपोर्टेड नहीं है",
        storage_failed: "ऑथेंटिकेशन डेटा स्टोर करना फ़ेल हुआ",
        clear_failed: "ऑथेंटिकेशन डेटा साफ़ करना फ़ेल हुआ",
      },
      not_implemented_native: "यह फ़ीचर React Native के लिए अभी लागू नहीं हुआ है",
      unknownError: "ऑथेंटिकेशन के दौरान अनजान एरर हुई",
    },
    post: {
      title: "ऑथ",
      description: "ऑथ एंडपॉइंट",
      form: {
        title: "ऑथ कॉन्फ़िगरेशन",
        description: "ऑथ पैरामीटर सेट करें",
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
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        missing_locale: {
          title: "लोकेल ग़ायब",
          description: "लोकेल पैरामीटर ज़रूरी है",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कोई अनजान एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुई",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस मना है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा टकराव हुआ",
        },
        token_generation_failed: {
          title: "टोकन बनाना फ़ेल हुआ",
          description: "ऑथेंटिकेशन टोकन बनाना फ़ेल हुआ",
        },
        invalid_session: {
          title: "सेशन गलत है",
          description: "सेशन गलत है या समाप्त हो चुका है",
        },
        missing_request_context: {
          title: "रिक्वेस्ट संदर्भ ग़ायब",
          description: "रिक्वेस्ट संदर्भ ग़ायब है",
        },
        unsupported_platform: {
          title: "प्लेटफ़ॉर्म सपोर्टेड नहीं",
          description: "प्लेटफ़ॉर्म सपोर्टेड नहीं है",
        },
        session_retrieval_failed: {
          title: "सेशन पाना फ़ेल हुआ",
          description: "सेशन पाना फ़ेल हुआ",
        },
        missing_token: {
          title: "टोकन ग़ायब",
          description: "ऑथेंटिकेशन टोकन ग़ायब है",
        },
        invalid_token_signature: {
          title: "टोकन सिग्नेचर गलत",
          description: "टोकन सिग्नेचर गलत है",
        },
        jwt_payload_missing_id: {
          title: "JWT पेलोड में ID ग़ायब",
          description: "JWT पेलोड में यूज़र ID ग़ायब है",
        },
        cookie_set_failed: {
          title: "कुकी सेट करना फ़ेल हुआ",
          description: "ऑथेंटिकेशन कुकी सेट करना फ़ेल हुआ",
        },
        cookie_clear_failed: {
          title: "कुकी साफ़ करना फ़ेल हुआ",
          description: "ऑथेंटिकेशन कुकी साफ़ करना फ़ेल हुआ",
        },
      },
      success: {
        title: "सफल",
        description: "कार्रवाई सफलतापूर्वक पूरी हुई",
      },
    },
    check: {
      get: {
        title: "ऑथेंटिकेशन जाँचें",
        description: "मौजूदा ऑथेंटिकेशन स्थिति जाँचें",
        response: {
          title: "ऑथेंटिकेशन स्थिति",
          description: "मौजूदा ऑथेंटिकेशन स्थिति",
          authenticated: "ऑथेंटिकेटेड",
          tokenValid: "टोकन मान्य",
        },
      },
    },
    enums: {
      webSocketErrorCode: {
        unauthorized: "अनधिकृत",
        forbidden: "मना है",
        invalidToken: "टोकन गलत",
        tokenExpired: "टोकन समाप्त हो गया",
        serverError: "सर्वर एरर",
      },
    },
  },
  private: {
    logout: {
      title: "यूज़र लॉगआउट",
      description: "मौजूदा यूज़र को लॉग आउट करता है और उसका सेशन अमान्य कर देता है",
      category: "यूज़र मैनेजमेंट",
      tag: "logout",
      logoutButton: "लॉग आउट",
      loggingOut: "लॉग आउट हो रहा है...",
      response: {
        title: "लॉगआउट रिस्पॉन्स",
        description: "सफल लॉगआउट बताने वाला रिस्पॉन्स",
        success: "सफल",
        message: "संदेश",
        sessionsCleaned: "सेशन साफ़ हुए",
        nextSteps: "लॉगआउट के बाद सुझाए गए अगले कदम",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "लॉगआउट रिक्वेस्ट में डेटा गलत है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉग आउट करने के लिए आपका लॉग इन होना ज़रूरी है",
        },
        internal: {
          title: "आंतरिक सर्वर एरर",
          description: "लॉग आउट करते समय आंतरिक एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "लॉगआउट के दौरान अप्रत्याशित एरर हुई",
        },
        session_deletion_failed: {
          title: "सेशन हटाना फ़ेल हुआ",
          description: "यूज़र सेशन हटाना फ़ेल हुआ",
        },
        conflict: {
          title: "लॉगआउट में टकराव",
          description: "लॉगआउट के दौरान टकराव हुआ",
        },
        forbidden: {
          title: "मना है",
          description: "लॉगआउट की कार्रवाई मना है",
        },
        network_error: {
          title: "नेटवर्क एरर",
          description: "लॉगआउट के दौरान नेटवर्क एरर हुई",
        },
        not_found: {
          title: "नहीं मिला",
          description: "सेशन नहीं मिला",
        },
        server_error: {
          title: "सर्वर एरर",
          description: "लॉगआउट के दौरान आंतरिक सर्वर एरर हुई",
        },
        unsaved_changes: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव हैं",
        },
        invalid_user: {
          title: "यूज़र गलत है",
          description: "यूज़र सही नहीं है या मौजूद नहीं है",
        },
      },
      success: {
        title: "लॉगआउट सफल",
        description: "आप सफलतापूर्वक लॉग आउट हो गए हैं",
        message: "यूज़र सफलतापूर्वक लॉग आउट हुआ",
      },
    },
    me: {
      // Main user profile routes
      get: {
        title: "यूज़र प्रोफ़ाइल पाएँ",
        description: "मौजूदा यूज़र की प्रोफ़ाइल जानकारी लाएँ",
        response: {
          title: "यूज़र प्रोफ़ाइल रिस्पॉन्स",
          description: "मौजूदा यूज़र प्रोफ़ाइल डेटा",
          id: "यूज़र ID",
          leadId: "लीड ID",
          isPublic: "सार्वजनिक प्रोफ़ाइल",
          email: "ईमेल पता",
          privateName: "निजी नाम",
          publicName: "सार्वजनिक नाम",
          locale: "लोकेल",
          isActive: "सक्रिय स्थिति",
          emailVerified: "ईमेल वेरिफ़ाइड",
          requireTwoFactor: "टू-फ़ैक्टर ऑथेंटिकेशन ज़रूरी",
          marketingConsent: "मार्केटिंग सहमति",
          userRoles: "यूज़र रोल",
          createdAt: "बनने का समय",
          updatedAt: "अपडेट होने का समय",
          stripeCustomerId: "Stripe कस्टमर ID",
          bio: "बायो",
          websiteUrl: "वेबसाइट",
          twitterUrl: "X / Twitter",
          youtubeUrl: "YouTube",
          instagramUrl: "Instagram",
          tiktokUrl: "TikTok",
          githubUrl: "GitHub",
          facebookUrl: "Facebook",
          discordUrl: "Discord",
          tribeUrl: "Tribe",
          rumbleUrl: "Rumble",
          odyseeUrl: "Odysee",
          nostrUrl: "Nostr",
          gabUrl: "Gab",
          creatorSlug: "प्रोफ़ाइल स्लग",
          creatorAccentColor: "एक्सेंट कलर",
          creatorHeaderImageUrl: "हेडर इमेज",
          avatarUrl: "अवतार",
          user: {
            title: "यूज़र की जानकारी",
            description: "यूज़र प्रोफ़ाइल का ब्योरा",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          forbidden: {
            title: "मना है",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "यूज़र प्रोफ़ाइल नहीं मिली",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव हैं",
          },
          internal: {
            title: "आंतरिक एरर",
            description: "आंतरिक सर्वर एरर हुई",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
        },
        success: {
          title: "सफल",
          description: "प्रोफ़ाइल सफलतापूर्वक मिल गई",
        },
      },
      update: {
        title: "यूज़र प्रोफ़ाइल अपडेट करें",
        description: "मौजूदा यूज़र की प्रोफ़ाइल जानकारी अपडेट करें",
        groups: {
          basicInfo: {
            title: "बुनियादी जानकारी",
            description: "अपनी बुनियादी प्रोफ़ाइल जानकारी अपडेट करें",
          },
          profileDetails: {
            title: "प्रोफ़ाइल का ब्योरा",
            description: "अपना प्रोफ़ाइल ब्योरा और सेटिंग्स मैनेज करें",
          },
          privacySettings: {
            title: "प्राइवेसी सेटिंग्स",
            description: "तय करें कि आपकी प्रोफ़ाइल की जानकारी कौन देख सकता है",
          },
          profileInfo: {
            title: "क्रिएटर प्रोफ़ाइल",
            description: "आपके स्किल पेज के लिए बायो, सोशल लिंक और ब्रांडिंग",
          },
        },
        fields: {
          email: {
            label: "ईमेल पता",
            description: "आपका ईमेल पता",
            placeholder: "अपना ईमेल पता दर्ज करें",
            help: "आपका ईमेल पता अकाउंट सूचनाओं और संवाद के लिए इस्तेमाल होगा",
            validation: {
              invalid: "कृपया सही ईमेल पता दर्ज करें",
            },
          },
          privateName: {
            label: "निजी नाम",
            description: "आपका आंतरिक/निजी नाम",
            placeholder: "अपना निजी नाम दर्ज करें",
            help: "आपका निजी नाम आंतरिक रूप से और निजी संवाद के लिए इस्तेमाल होता है",
            validation: {
              minLength: "निजी नाम कम से कम 2 अक्षरों का होना चाहिए",
              maxLength: "निजी नाम 50 अक्षरों से ज़्यादा नहीं हो सकता",
            },
          },
          publicName: {
            label: "सार्वजनिक नाम",
            description: "आपका सार्वजनिक डिस्प्ले नाम",
            placeholder: "अपना सार्वजनिक नाम दर्ज करें",
            help: "आपका सार्वजनिक नाम दूसरे यूज़र्स को दिखेगा",
            validation: {
              minLength: "सार्वजनिक नाम कम से कम 2 अक्षरों का होना चाहिए",
              maxLength: "सार्वजनिक नाम 50 अक्षरों से ज़्यादा नहीं हो सकता",
            },
          },
          imageUrl: {
            label: "प्रोफ़ाइल इमेज",
            description: "आपकी प्रोफ़ाइल इमेज का URL",
            placeholder: "इमेज URL दर्ज करें",
            help: "ऐसी इमेज का URL दें जो आपकी प्रोफ़ाइल तस्वीर के रूप में दिखेगी",
            validation: {
              invalid: "कृपया सही इमेज URL दें",
            },
          },
          company: {
            label: "कंपनी",
            description: "आपकी कंपनी का नाम",
            placeholder: "अपनी कंपनी दर्ज करें",
            help: "आपकी कंपनी का नाम आपकी प्रोफ़ाइल पर दिखेगा",
            validation: {
              maxLength: "कंपनी का नाम 100 अक्षरों से ज़्यादा नहीं हो सकता",
            },
          },
          visibility: {
            label: "प्रोफ़ाइल की दृश्यता",
            description: "आपकी प्रोफ़ाइल कौन देख सकता है",
            placeholder: "दृश्यता सेटिंग चुनें",
            help: "चुनें कि आपकी प्रोफ़ाइल कौन देख सकता है: सार्वजनिक (सब), निजी (सिर्फ़ आप) या सिर्फ़ संपर्क",
          },
          marketingConsent: {
            label: "न्यूज़लेटर सब्सक्राइब करें",
            description:
              "नए मॉडल और फ़ीचर के कभी-कभार अपडेट। कोई स्पैम नहीं, बस काम की बातें।",
            placeholder: "मार्केटिंग ईमेल चालू करें",
            help: "चुनें कि आप मार्केटिंग ईमेल और प्रमोशनल संवाद पाना चाहते हैं या नहीं",
          },
          bio: {
            label: "बायो",
            description: "आपके बारे में एक छोटा विवरण",
            placeholder: "अपने बारे में बताएँ...",
            help: "अपने बारे में एक छोटा विवरण लिखें जो आपकी प्रोफ़ाइल पर दिखेगा",
            validation: {
              maxLength: "बायो 500 अक्षरों से ज़्यादा नहीं हो सकता",
            },
          },
          websiteUrl: {
            label: "वेबसाइट",
            description: "आपकी निजी या व्यावसायिक वेबसाइट",
            placeholder: "https://yoursite.com",
          },
          twitterUrl: {
            label: "X / Twitter",
            description: "आपकी X (Twitter) प्रोफ़ाइल का URL",
            placeholder: "https://x.com/yourhandle",
          },
          youtubeUrl: {
            label: "YouTube",
            description: "आपके YouTube चैनल का URL",
            placeholder: "https://youtube.com/@yourchannel",
          },
          instagramUrl: {
            label: "Instagram",
            description: "आपकी Instagram प्रोफ़ाइल का URL",
            placeholder: "https://instagram.com/yourhandle",
          },
          tiktokUrl: {
            label: "TikTok",
            description: "आपकी TikTok प्रोफ़ाइल का URL",
            placeholder: "https://tiktok.com/@yourhandle",
          },
          githubUrl: {
            label: "GitHub",
            description: "आपकी GitHub प्रोफ़ाइल का URL",
            placeholder: "https://github.com/yourusername",
          },
          facebookUrl: {
            label: "Facebook",
            description: "आपके Facebook पेज या प्रोफ़ाइल का URL",
            placeholder: "https://facebook.com/yourpage",
          },
          discordUrl: {
            label: "Discord",
            description: "आपके Discord सर्वर या प्रोफ़ाइल का लिंक",
            placeholder: "https://discord.gg/yourserver",
          },
          tribeUrl: {
            label: "Tribe",
            description: "आपकी Tribe कम्युनिटी का URL",
            placeholder: "https://yourcommunity.tribe.so",
          },
          rumbleUrl: {
            label: "Rumble",
            description: "आपके Rumble चैनल का URL",
            placeholder: "https://rumble.com/c/yourchannel",
          },
          odyseeUrl: {
            label: "Odysee",
            description: "आपके Odysee चैनल का URL",
            placeholder: "https://odysee.com/@yourchannel",
          },
          nostrUrl: {
            label: "Nostr",
            description: "आपकी Nostr प्रोफ़ाइल या npub पता",
            placeholder: "https://primal.net/p/npub1...",
          },
          gabUrl: {
            label: "Gab",
            description: "आपकी Gab प्रोफ़ाइल का URL",
            placeholder: "https://gab.com/yourhandle",
          },
          creatorSlug: {
            label: "प्रोफ़ाइल URL",
            description: "आपका कस्टम प्रोफ़ाइल स्लग: आपके सार्वजनिक लिंक में दिखता है",
            placeholder: "jane-doe",
            validation: {
              invalid: "सिर्फ़ छोटे अक्षर, अंक और हाइफ़न मान्य हैं",
            },
          },
          creatorAccentColor: {
            label: "एक्सेंट कलर",
            description: "आपके स्किल पेज की ब्रांडिंग के लिए हेक्स रंग (वैकल्पिक)",
            placeholder: "#7c3aed",
          },
          creatorHeaderImageUrl: {
            label: "हेडर इमेज",
            description: "आपके स्किल पेज के हीरो के लिए बैनर इमेज URL",
            placeholder: "https://yoursite.com/banner.jpg",
          },
        },
        response: {
          title: "अपडेट की गई प्रोफ़ाइल",
          description: "आपकी अपडेट की गई प्रोफ़ाइल जानकारी",
          success: "अपडेट सफल",
          message: "आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई है",
          id: "यूज़र ID",
          leadId: "लीड ID",
          isPublic: "सार्वजनिक प्रोफ़ाइल",
          email: "ईमेल पता",
          privateName: "निजी नाम",
          publicName: "सार्वजनिक नाम",
          locale: "लोकेल",
          isActive: "सक्रिय स्थिति",
          emailVerified: "ईमेल वेरिफ़ाइड",
          requireTwoFactor: "टू-फ़ैक्टर ऑथेंटिकेशन ज़रूरी",
          marketingConsent: "मार्केटिंग सहमति",
          userRoles: "यूज़र रोल",
          createdAt: "बनने का समय",
          updatedAt: "अपडेट होने का समय",
          stripeCustomerId: "Stripe कस्टमर ID",
          bio: "बायो",
          websiteUrl: "वेबसाइट",
          twitterUrl: "X / Twitter",
          youtubeUrl: "YouTube",
          instagramUrl: "Instagram",
          tiktokUrl: "TikTok",
          githubUrl: "GitHub",
          facebookUrl: "Facebook",
          discordUrl: "Discord",
          tribeUrl: "Tribe",
          rumbleUrl: "Rumble",
          odyseeUrl: "Odysee",
          nostrUrl: "Nostr",
          gabUrl: "Gab",
          creatorSlug: "प्रोफ़ाइल स्लग",
          creatorAccentColor: "एक्सेंट कलर",
          creatorHeaderImageUrl: "हेडर इमेज",
          user: "अपडेट की गई यूज़र जानकारी",
          changesSummary: {
            title: "बदलावों का सारांश",
            description: "आपकी प्रोफ़ाइल में किए बदलावों का सारांश",
            totalChanges: "कुल बदलाव",
            changedFields: "बदले गए फ़ील्ड",
            verificationRequired: "वेरिफ़िकेशन ज़रूरी",
            lastUpdated: "आख़िरी अपडेट",
          },
          nextSteps: "अगले कदम",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          forbidden: {
            title: "मना है",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "यूज़र प्रोफ़ाइल नहीं मिली",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव हैं",
          },
          internal: {
            title: "आंतरिक एरर",
            description: "आंतरिक सर्वर एरर हुई",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
        },
        success: {
          title: "सफल",
          description: "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई",
          nextSteps: "प्रोफ़ाइल अपडेट करने के बाद सुझाए गए अगले कदम",
        },
      },
      delete: {
        title: "यूज़र अकाउंट हटाएँ",
        description: "अपना यूज़र अकाउंट हमेशा के लिए हटाएँ",
        response: {
          title: "हटाने की स्थिति",
          description: "अकाउंट हटाने की पुष्टि",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          forbidden: {
            title: "मना है",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "यूज़र अकाउंट नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव हैं",
          },
          internal: {
            title: "आंतरिक एरर",
            description: "आंतरिक सर्वर एरर हुई",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
        },
        success: {
          title: "सफल",
          description: "अकाउंट सफलतापूर्वक हट गया",
        },
      },
      put: {
        response: {
          changedFields: {
            item: "बदला गया फ़ील्ड",
          },
        },
      },
      category: "यूज़र प्रोफ़ाइल",
      tag: "यूज़र प्रोफ़ाइल",
      tags: {
        profile: "profile",
        user: "user",
        account: "account",
      },

      widget: {
        save: "प्रोफ़ाइल सेव करें",
        saving: "सेव हो रहा है...",
        editProfile: "प्रोफ़ाइल एडिट करें",
        cancelEdit: "रद्द करें",
        memberSince: "सदस्य बनने की तारीख़",
        profileCard: {
          title: "क्रिएटर प्रोफ़ाइल",
          description: "प्लेटफ़ॉर्म पर आपकी सार्वजनिक पहचान",
        },
        socialCard: {
          title: "सोशल लिंक",
          description: "अपने प्लेटफ़ॉर्म जोड़ें",
        },
        emailCard: {
          title: "आपकी ईमेल लिस्ट",
          description:
            "आपके स्किल पेज और क्रिएटर प्रोफ़ाइल के विज़िटर सब्सक्राइब कर सकते हैं। लिस्ट आपकी है: बीच में कोई प्लेटफ़ॉर्म नहीं।",
        },
        previewCard: {
          title: "आपकी सार्वजनिक प्रोफ़ाइल",
          description: "दूसरों को आप कैसे दिखते हैं",
        },
        noPreview: "प्रीव्यू देखने के लिए अपनी प्रोफ़ाइल भरें",
        noSocials: "अभी कोई सोशल लिंक नहीं जोड़ा",
        viewPublicProfile: "सार्वजनिक प्रोफ़ाइल देखें",
        profileUrl: "आपका लिंक",
        slugWarning: "यह URL बदलने से आपकी प्रोफ़ाइल के मौजूदा लिंक टूट जाएँगे।",
        bioPreview: "प्रीव्यू",
        bioEdit: "एडिट करें",
        skills: {
          title: "मेरी स्किल",
          chat: "अभी चैट करें",
          add: "अपने कलेक्शन में जोड़ें",
          public: "कम्युनिटी",
          showLess: "कम दिखाएँ",
        },
        deleteAccount: {
          dangerZone: "ख़तरे का क्षेत्र",
          button: "अकाउंट हटाएँ",
          confirmTitle: "अपना अकाउंट हमेशा के लिए हटाएँ",
          confirmDescription:
            "इससे आपका अकाउंट और जुड़ा सारा डेटा हमेशा के लिए हट जाता है। कोई रिकवरी नहीं। कोई अनडू नहीं।",
          confirmLabel: 'Type "DELETE" to confirm',
          confirmPlaceholder: "DELETE",
          confirmButton: "मेरा अकाउंट हमेशा के लिए हटाएँ",
          cancelButton: "रद्द करें",
          whatGetsDeleted: "क्या-क्या हटेगा:",
          items: {
            profile: "आपकी प्रोफ़ाइल और सारी सेटिंग्स",
            chats: "सारी चैट हिस्ट्री और थ्रेड",
            skills: "सारी कस्टम स्किल और कॉन्फ़िगरेशन",
            files: "सारी cortex फ़ाइलें और मेमोरी",
            subscriptions: "सक्रिय सब्सक्रिप्शन",
            credits: "बचे हुए सारे क्रेडिट",
          },
          deleting: "हटाया जा रहा है...",
          success: "अकाउंट हट गया। रीडायरेक्ट हो रहा है...",
        },
      },

      // Sub-routes
      avatar: {
        category: "यूज़र प्रोफ़ाइल",

        tag: "avatar",
        errors: {
          user_not_found: "यूज़र नहीं मिला",
          failed_to_upload_avatar: "अवतार अपलोड नहीं हो सका",
          failed_to_delete_avatar: "अवतार हटाया नहीं जा सका",
          invalid_file_type: "फ़ाइल का प्रकार गलत है",
          file_too_large: "फ़ाइल बहुत बड़ी है",
        },
        debug: {
          uploadingUserAvatar: "यूज़र अवतार अपलोड हो रहा है",
          errorUploadingUserAvatar: "यूज़र अवतार अपलोड करने में एरर",
          deletingUserAvatar: "यूज़र अवतार हट रहा है",
          errorDeletingUserAvatar: "यूज़र अवतार हटाने में एरर",
        },
        success: {
          uploaded: "अवतार सफलतापूर्वक अपलोड हुआ",
          deleted: "अवतार सफलतापूर्वक हट गया",
          nextSteps: {
            visible: "आपका अवतार अब आपकी प्रोफ़ाइल पर दिखता है",
            update: "आप इसे कभी भी अपनी प्रोफ़ाइल सेटिंग्स से बदल सकते हैं",
            default: "आपकी प्रोफ़ाइल अब डिफ़ॉल्ट अवतार दिखाती है",
            uploadNew:
              "आप कभी भी अपनी प्रोफ़ाइल सेटिंग्स से नया अवतार अपलोड कर सकते हैं",
          },
        },
        upload: {
          title: "अवतार अपलोड करें",
          description: "प्रोफ़ाइल अवतार की इमेज अपलोड करें",
          groups: {
            fileUpload: {
              title: "फ़ाइल अपलोड",
              description: "अपनी अवतार इमेज चुनें और अपलोड करें",
            },
          },
          fields: {
            file: {
              label: "अवतार इमेज",
              description: "अपने प्रोफ़ाइल अवतार के लिए इमेज फ़ाइल चुनें",
              placeholder: "इमेज फ़ाइल चुनें...",
              help: "5MB तक की इमेज फ़ाइल अपलोड करें (JPG, PNG, GIF)",
              validation: {
                maxSize: "फ़ाइल का आकार 5MB से कम होना चाहिए",
                imageOnly: "सिर्फ़ इमेज फ़ाइल मान्य हैं",
                unsupportedFormat:
                  "इमेज फ़ॉर्मेट सपोर्टेड नहीं है। JPEG, PNG, WebP या GIF इस्तेमाल करें।",
              },
            },
          },
          response: {
            title: "अपलोड रिस्पॉन्स",
            label: "अपलोड का नतीजा",
            description: "अवतार अपलोड रिस्पॉन्स",
            success: "अपलोड सफल",
            message: "आपका अवतार सफलतापूर्वक अपलोड हो गया है",
            avatarUrl: "अवतार URL",
            uploadTime: "अपलोड का समय",
            nextSteps: {
              item: "अगला कदम",
            },
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "अपलोड की फ़ाइल गलत या ख़राब है",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "अवतार अपलोड करने के लिए आपका लॉग इन होना ज़रूरी है",
            },
            server: {
              title: "सर्वर एरर",
              description: "अवतार अपलोड प्रोसेस नहीं हो सका",
            },
            internal: {
              title: "आंतरिक एरर",
              description: "आंतरिक सर्वर एरर हुई",
            },
            unknown: {
              title: "अनजान एरर",
              description: "अपलोड के दौरान अप्रत्याशित एरर हुई",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "अपलोड के दौरान नेटवर्क एरर हुई",
            },
            forbidden: {
              title: "मना है",
              description: "आपको अवतार अपलोड करने की अनुमति नहीं है",
            },
            notFound: {
              title: "नहीं मिला",
              description: "माँगा गया रिसोर्स नहीं मिला",
            },
            unsaved: {
              title: "बिना सेव किए बदलाव",
              description: "बिना सेव किए बदलाव हैं",
            },
            conflict: {
              title: "टकराव",
              description: "अपलोड के दौरान टकराव हुआ",
            },
          },
          success: {
            title: "अवतार अपलोड हुआ",
            description: "आपका प्रोफ़ाइल अवतार सफलतापूर्वक अपलोड हो गया है",
          },
        },
        delete: {
          title: "अवतार हटाएँ",
          description: "मौजूदा प्रोफ़ाइल अवतार हटाएँ",
          response: {
            title: "हटाने का रिस्पॉन्स",
            label: "हटाने का नतीजा",
            description: "अवतार हटाने का रिस्पॉन्स",
            success: "हटाना सफल",
            message: "आपका अवतार सफलतापूर्वक हट गया है",
            nextSteps: {
              item: "अगला कदम",
            },
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "अवतार हटाने की रिक्वेस्ट गलत है",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "अवतार हटाने के लिए आपका लॉग इन होना ज़रूरी है",
            },
            server: {
              title: "सर्वर एरर",
              description: "अवतार हटाया नहीं जा सका",
            },
            internal: {
              title: "आंतरिक एरर",
              description: "आंतरिक सर्वर एरर हुई",
            },
            unknown: {
              title: "अनजान एरर",
              description: "हटाने के दौरान अप्रत्याशित एरर हुई",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "हटाने के दौरान नेटवर्क एरर हुई",
            },
            forbidden: {
              title: "मना है",
              description: "आपको यह अवतार हटाने की अनुमति नहीं है",
            },
            notFound: {
              title: "नहीं मिला",
              description: "हटाया जाने वाला अवतार नहीं मिला",
            },
            unsaved: {
              title: "बिना सेव किए बदलाव",
              description: "बिना सेव किए बदलाव हैं",
            },
            conflict: {
              title: "टकराव",
              description: "हटाने के दौरान टकराव हुआ",
            },
          },
          success: {
            title: "अवतार हट गया",
            description: "आपका प्रोफ़ाइल अवतार सफलतापूर्वक हटा दिया गया है",
          },
        },
      },
      password: {
        category: "यूज़र प्रोफ़ाइल",

        title: "पासवर्ड बदलें",
        description: "अपना अकाउंट पासवर्ड सुरक्षित रूप से अपडेट करें",
        tag: "password-change",
        debug: {
          updatingPassword: "पासवर्ड अपडेट हो रहा है",
          errorUpdatingPassword: "पासवर्ड अपडेट करने में एरर",
          settingPassword: "पासवर्ड सेट हो रहा है",
          errorSettingPassword: "पासवर्ड सेट करने में एरर",
        },
        groups: {
          currentCredentials: {
            title: "मौजूदा पासवर्ड",
            description: "आगे बढ़ने के लिए अपना मौजूदा पासवर्ड सत्यापित करें",
          },
          newCredentials: {
            title: "नया पासवर्ड",
            description: "अपने अकाउंट के लिए मज़बूत नया पासवर्ड चुनें",
          },
        },
        currentPassword: {
          label: "मौजूदा पासवर्ड",
          description: "अपना मौजूदा पासवर्ड दर्ज करें",
          placeholder: "मौजूदा पासवर्ड दर्ज करें",
          help: "बदलने से पहले अपनी पहचान सत्यापित करने के लिए मौजूदा पासवर्ड दर्ज करें",
        },
        newPassword: {
          label: "नया पासवर्ड",
          description: "अपना नया पासवर्ड दर्ज करें (कम से कम 8 अक्षर)",
          placeholder: "नया पासवर्ड दर्ज करें",
          help: "अक्षर, अंक और चिह्न मिलाकर कम से कम 8 अक्षरों का मज़बूत पासवर्ड चुनें",
        },
        confirmPassword: {
          label: "पासवर्ड की पुष्टि करें",
          description: "अपने नए पासवर्ड की पुष्टि करें",
          placeholder: "नए पासवर्ड की पुष्टि करें",
          help: "सही टाइप हुआ है यह पक्का करने के लिए नया पासवर्ड दोबारा दर्ज करें",
        },
        twoFactorCode: {
          label: "टू-फ़ैक्टर कोड",
          description: "अगर चालू है तो अपना टू-फ़ैक्टर ऑथेंटिकेशन कोड दर्ज करें",
          placeholder: "2FA कोड दर्ज करें",
        },
        response: {
          title: "पासवर्ड बदलने का रिस्पॉन्स",
          description: "पासवर्ड बदलने की कार्रवाई का रिस्पॉन्स",
          success: "पासवर्ड बदल गया",
          message: "स्थिति संदेश",
          securityTip: "सुरक्षा टिप",
          nextSteps: {
            item: "अगले कदम",
          },
        },
        validation: {
          currentPassword: {
            minLength: "मौजूदा पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
          },
          newPassword: {
            minLength: "नया पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
          },
          confirmPassword: {
            minLength: "पासवर्ड की पुष्टि कम से कम 8 अक्षरों की होनी चाहिए",
          },
          passwords: {
            mismatch: "पासवर्ड मेल नहीं खाते",
          },
        },
        errors: {
          passwords_do_not_match: "पासवर्ड मेल नहीं खाते",
          user_not_found: "यूज़र नहीं मिला",
          incorrect_password: "पासवर्ड गलत है",
          update_failed: "पासवर्ड अपडेट नहीं हो सका",
          token_creation_failed: "पासवर्ड टोकन बनाना फ़ेल हुआ",
          two_factor_code_required: "टू-फ़ैक्टर ऑथेंटिकेशन कोड ज़रूरी है",
          invalid_two_factor_code: "टू-फ़ैक्टर ऑथेंटिकेशन कोड गलत है",
          invalid_request: {
            title: "रिक्वेस्ट गलत है",
            description: "पासवर्ड बदलने की रिक्वेस्ट गलत है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "पासवर्ड बदलने के लिए आपका लॉग इन होना ज़रूरी है",
          },
          server: {
            title: "सर्वर एरर",
            description: "सर्वर एरर की वजह से पासवर्ड अपडेट नहीं हो सका",
          },
          unknown: {
            title: "अनजान एरर",
            description: "पासवर्ड अपडेट करते समय अप्रत्याशित एरर हुई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क कनेक्शन फ़ेल हुआ",
          },
          forbidden: {
            title: "एक्सेस मना है",
            description: "आपको यह कार्रवाई करने की अनुमति नहीं है",
          },
          notFound: {
            title: "यूज़र नहीं मिला",
            description: "यूज़र अकाउंट नहीं मिल सका",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं और खो जाएँगे",
          },
          conflict: {
            title: "डेटा टकराव",
            description: "पासवर्ड अपडेट करते समय टकराव हुआ",
          },
        },
        success: {
          updated: "पासवर्ड सफलतापूर्वक अपडेट हुआ",
          securityTip: "बेहतर सुरक्षा के लिए टू-फ़ैक्टर ऑथेंटिकेशन चालू करें",
          nextSteps: {
            logoutOther: "सुरक्षा के लिए बाक़ी सारे सेशन लॉग आउट कर दिए गए हैं",
            enable2fa: "बेहतर सुरक्षा के लिए टू-फ़ैक्टर ऑथेंटिकेशन चालू करने पर विचार करें",
          },
          title: "पासवर्ड अपडेट हुआ",
          description: "आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है",
        },
        update: {
          success: {
            title: "पासवर्ड अपडेट हुआ",
            description: "आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है",
          },
          errors: {
            unknown: {
              title: "अनजान एरर",
              description: "पासवर्ड अपडेट करते समय अप्रत्याशित एरर हुई",
            },
          },
        },
      },
      addresses: {
        category: "यूज़र पते",
        tag: "addresses",

        list: {
          title: "मेरे पते",
          description: "अपने सेव किए पते देखें",
          response: {
            addresses: "पते",
          },
          widget: {
            addAddress: "पता जोड़ें",
            edit: "एडिट करें",
            delete: "हटाएँ",
            billing: "बिलिंग",
            delivery: "डिलीवरी",
            empty: "कोई सेव किया पता नहीं",
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "रिक्वेस्ट गलत है",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "ऑथेंटिकेशन ज़रूरी है",
            },
            forbidden: { title: "मना है", description: "एक्सेस मना है" },
            notFound: { title: "नहीं मिला", description: "कोई पता नहीं मिला" },
            conflict: { title: "टकराव", description: "डेटा टकराव" },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर हुई",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "बिना सेव किए बदलाव हैं",
            },
            internal: {
              title: "सर्वर एरर",
              description: "आंतरिक सर्वर एरर",
            },
            unknown: {
              title: "अनजान एरर",
              description: "कोई अनजान एरर आई",
            },
          },
          success: { title: "सफल", description: "पते मिल गए" },
        },

        create: {
          title: "पता जोड़ें",
          description: "अपने अकाउंट में नया पता सेव करें",
          fields: {
            label: {
              label: "लेबल",
              description: "इस पते को नाम दें (जैसे घर, ऑफ़िस)",
              placeholder: "होम",
            },
            fullName: {
              label: "पूरा नाम",
              description: "इस पते का संपर्क नाम",
              placeholder: "Jane Doe",
            },
            company: {
              label: "कंपनी",
              description: "कंपनी का नाम (वैकल्पिक)",
              placeholder: "Acme Corp",
            },
            phone: {
              label: "फ़ोन",
              description: "संपर्क फ़ोन नंबर",
              placeholder: "+1 555 000 0000",
            },
            vatNumber: {
              label: "VAT नंबर",
              description: "EU VAT रजिस्ट्रेशन नंबर",
              placeholder: "DE123456789",
            },
            taxId: {
              label: "टैक्स ID",
              description: "राष्ट्रीय टैक्स पहचान",
              placeholder: "123-45-6789",
            },
            addressLine1: {
              label: "पता पंक्ति 1",
              description: "गली और नंबर",
              placeholder: "123 Main St",
            },
            addressLine2: {
              label: "पता पंक्ति 2",
              description: "अपार्टमेंट, सुइट, यूनिट (वैकल्पिक)",
              placeholder: "Suite 4B",
            },
            city: { label: "शहर", description: "शहर", placeholder: "Berlin" },
            region: {
              label: "राज्य / क्षेत्र",
              description: "राज्य या क्षेत्र (वैकल्पिक)",
              placeholder: "Bayern",
            },
            postalCode: {
              label: "पोस्टल कोड",
              description: "ZIP या पोस्टल कोड",
              placeholder: "10115",
            },
            country: {
              label: "देश",
              description: "ISO 3166-1 alpha-2 देश कोड",
              placeholder: "DE",
            },
            isDefaultBilling: {
              label: "डिफ़ॉल्ट बिलिंग",
              description: "डिफ़ॉल्ट बिलिंग पते के रूप में इस्तेमाल करें",
            },
            isDefaultDelivery: {
              label: "डिफ़ॉल्ट डिलीवरी",
              description: "डिफ़ॉल्ट डिलीवरी पते के रूप में इस्तेमाल करें",
            },
          },
          response: {
            id: "पता ID",
            label: "लेबल",
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "ज़रूरी फ़ील्ड जाँचें",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "ऑथेंटिकेशन ज़रूरी है",
            },
            forbidden: { title: "मना है", description: "एक्सेस मना है" },
            notFound: { title: "नहीं मिला", description: "यूज़र नहीं मिला" },
            conflict: { title: "टकराव", description: "डेटा टकराव" },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर हुई",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "बिना सेव किए बदलाव हैं",
            },
            internal: {
              title: "सर्वर एरर",
              description: "आंतरिक सर्वर एरर",
            },
            unknown: {
              title: "अनजान एरर",
              description: "कोई अनजान एरर आई",
            },
          },
          success: {
            title: "पता सेव हुआ",
            description: "पता आपके अकाउंट में जुड़ गया",
          },
          widget: {
            saved: "पता सेव हुआ।",
            backToAddresses: "पतों पर वापस",
          },
        },
      },
    },
    session: {
      enums: {
        sessionErrorReason: {
          noTokenInCookies: "कुकी में कोई टोकन नहीं",
        },
      },
      errors: {
        session_not_found: "सेशन नहीं मिला",
        session_lookup_failed: "सेशन खोजना फ़ेल हुआ",
        expired_sessions_delete_failed: "समाप्त सेशन हटाना फ़ेल हुआ",
        session_creation_failed: "सेशन बनाना फ़ेल हुआ",
        session_creation_database_error: "सेशन बनाते समय डेटाबेस एरर",
        user_sessions_delete_failed: "यूज़र सेशन हटाना फ़ेल हुआ",
        expired: "सेशन समाप्त हो चुका है",
      },
      post: {
        title: "सेशन",
        description: "सेशन एंडपॉइंट",
        form: {
          title: "सेशन कॉन्फ़िगरेशन",
          description: "सेशन पैरामीटर सेट करें",
        },
        response: {
          title: "रिस्पॉन्स",
          description: "सेशन रिस्पॉन्स डेटा",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "आंतरिक सर्वर एरर हुई",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          forbidden: {
            title: "मना है",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रिसोर्स नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
        },
        success: {
          title: "सफल",
          description: "कार्रवाई सफलतापूर्वक पूरी हुई",
        },
      },
    },
    sessions: {
      category: "यूज़र्स",

      list: {
        title: "मेरे सेशन",
        description: "अपने अकाउंट के सभी सक्रिय सेशन देखें",
        tag: "सेशन",
        response: {
          sessions: "सेशन",
        },
        success: {
          title: "सेशन मिल गए",
          description: "आपके सक्रिय सेशन मिल गए हैं",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट गलत है",
          },
          server: {
            title: "सर्वर एरर",
            description: "आंतरिक सर्वर एरर",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          forbidden: { title: "मना है", description: "एक्सेस मना है" },
          notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
          conflict: { title: "टकराव", description: "डेटा टकराव" },
        },
      },
      create: {
        title: "सेशन टोकन बनाएँ",
        description: "प्रोग्रामेटिक एक्सेस के लिए नाम वाला सेशन टोकन बनाएँ",
        tag: "सेशन",
        form: {
          name: "टोकन का नाम",
          namePlaceholder: "जैसे मेरा एजेंट बॉट",
        },
        response: {
          token: "टोकन",
          id: "सेशन ID",
          name: "नाम",
          message: "यह टोकन कॉपी कर लें: यह दोबारा नहीं दिखेगा",
        },
        success: {
          title: "सेशन बन गया",
          description: "आपका सेशन टोकन बन गया है",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट गलत है",
          },
          server: {
            title: "सर्वर एरर",
            description: "आंतरिक सर्वर एरर",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          forbidden: { title: "मना है", description: "एक्सेस मना है" },
          notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
          conflict: { title: "टकराव", description: "डेटा टकराव" },
        },
      },
      revoke: {
        title: "सेशन रद्द करें",
        description: "ID से किसी सेशन टोकन को रद्द करें",
        tag: "सेशन",
        response: {
          message: "सेशन रद्द हुआ",
        },
        success: {
          title: "सेशन रद्द हुआ",
          description: "सेशन रद्द कर दिया गया है",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट गलत है",
          },
          server: {
            title: "सर्वर एरर",
            description: "आंतरिक सर्वर एरर",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          forbidden: { title: "मना है", description: "एक्सेस मना है" },
          notFound: { title: "नहीं मिला", description: "सेशन नहीं मिला" },
          conflict: { title: "टकराव", description: "डेटा टकराव" },
        },
      },
    },
  },
  public: {
    login: {
      category: "यूज़र्स",
      title: "वापसी पर स्वागत है",
      description: "अनसेंसर्ड AI मॉडल और अपनी बातचीत की हिस्ट्री तक पहुँचें।",
      tag: "ऑथेंटिकेशन",
      options: {
        category: "यूज़र्स",

        title: "लॉगिन विकल्प",
        description: "लॉगिन कॉन्फ़िगरेशन विकल्प",
        tag: "login-options",
        container: {
          title: "लॉगिन कॉन्फ़िगरेशन",
          description: "लॉगिन सेटिंग्स और विकल्प सेट करें",
        },
        fields: {
          email: {
            label: "ईमेल पता",
            description: "अपना ईमेल पता दर्ज करें",
            placeholder: "your@email.com",
          },
          allowPasswordAuth: {
            label: "पासवर्ड ऑथेंटिकेशन की अनुमति दें",
            description: "पासवर्ड-आधारित ऑथेंटिकेशन चालू करें",
          },
          allowSocialAuth: {
            label: "सोशल ऑथेंटिकेशन की अनुमति दें",
            description: "सोशल प्रोवाइडर ऑथेंटिकेशन चालू करें",
          },
          maxAttempts: {
            label: "अधिकतम लॉगिन प्रयास",
            description: "अनुमत लॉगिन प्रयासों की अधिकतम संख्या",
          },
          requireTwoFactor: {
            label: "टू-फ़ैक्टर ऑथेंटिकेशन ज़रूरी करें",
            description: "यूज़र लॉगिन के लिए 2FA ज़रूरी करें",
          },
          socialProviders: {
            label: "सोशल प्रोवाइडर",
            description: "उपलब्ध सोशल ऑथेंटिकेशन प्रोवाइडर",
          },
          socialProvider: {
            title: "सोशल प्रोवाइडर",
            description: "सोशल ऑथेंटिकेशन प्रोवाइडर का कॉन्फ़िगरेशन",
            enabled: {
              label: "चालू",
              description: "यह प्रोवाइडर चालू है या नहीं",
            },
            name: {
              label: "प्रोवाइडर का नाम",
              description: "सोशल प्रोवाइडर का नाम",
            },
            providers: {
              label: "प्रोवाइडर विकल्प",
              description: "उपलब्ध सोशल प्रोवाइडर विकल्प",
            },
          },
        },
        response: {
          title: "लॉगिन विकल्पों का रिस्पॉन्स",
          description: "उपलब्ध लॉगिन कॉन्फ़िगरेशन विकल्प",
          success: {
            badge: "सफल",
          },
          message: {
            content: "स्थिति संदेश",
          },
          forUser: {
            content: "ईमेल पता",
          },
          loginMethods: {
            title: "लॉगिन के तरीक़े",
            description: "उपलब्ध ऑथेंटिकेशन तरीक़े",
            password: {
              title: "पासवर्ड लॉगिन",
              description: "मानक पासवर्ड ऑथेंटिकेशन",
              enabled: {
                badge: "चालू",
              },
            },
            social: {
              title: "सोशल लॉगिन",
              description: "सोशल मीडिया ऑथेंटिकेशन विकल्प",
              enabled: {
                badge: "चालू",
              },
              providers: {
                item: {
                  title: "सोशल प्रोवाइडर",
                  description: "सोशल ऑथेंटिकेशन प्रोवाइडर",
                },
                name: {
                  content: "प्रोवाइडर का नाम",
                },
                id: {
                  content: "प्रोवाइडर ID",
                },
                enabled: {
                  badge: "उपलब्ध",
                },
                description: "प्रोवाइडर का विवरण",
              },
            },
          },
          security: {
            title: "सिक्योरिटी सेटिंग्स",
            description: "ऑथेंटिकेशन की सुरक्षा ज़रूरतें",
            maxAttempts: {
              content: "अधिकतम लॉगिन प्रयास",
            },
            requireTwoFactor: {
              badge: "2FA ज़रूरी",
            },
          },
          recommendations: {
            item: "सुझाया गया लॉगिन विकल्प",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          server: {
            title: "सर्वर एरर",
            description: "आंतरिक सर्वर एरर हुई",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          forbidden: {
            title: "मना है",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रिसोर्स नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बदलाव सेव नहीं हुए",
          },
        },
        success: {
          title: "सफल",
          description: "लॉगिन विकल्प सफलतापूर्वक मिल गए",
        },
        post: {
          title: "लॉगिन विकल्प",
          description: "उपलब्ध लॉगिन विकल्प पाएँ",
          response: {
            title: "लॉगिन विकल्पों का रिस्पॉन्स",
            description: "उपलब्ध लॉगिन कॉन्फ़िगरेशन विकल्प",
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "रिक्वेस्ट के पैरामीटर गलत हैं",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "ऑथेंटिकेशन ज़रूरी है",
            },
            server: {
              title: "सर्वर एरर",
              description: "आंतरिक सर्वर एरर हुई",
            },
            unknown: {
              title: "अनजान एरर",
              description: "कोई अनजान एरर आई",
            },
          },
          success: {
            description: "लॉगिन विकल्प सफलतापूर्वक मिल गए",
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
          successMessage: "लॉगिन विकल्प सफलतापूर्वक मिल गए",
          passwordAuthDescription: "अपने ईमेल और पासवर्ड से लॉग इन करें",
          socialAuthDescription: "अपने सोशल मीडिया अकाउंट से लॉग इन करें",
          continueWithProvider: "{{provider}} से जारी रखें",
          twoFactorRequired: "बेहतर सुरक्षा: 2FA ज़रूरी",
          standardSecurity: "मानक सुरक्षा ज़रूरतें",
          tryPasswordFirst: "पहले पासवर्ड लॉगिन आज़माएँ",
          useSocialLogin: "सोशल लॉगिन इस्तेमाल करें",
          socialLoginFaster: "नए यूज़र्स के लिए सोशल लॉगिन तेज़ है",
        },
      },
      actions: {
        submit: "लॉग इन",
        submitting: "लॉग इन हो रहा है...",
      },
      fields: {
        email: {
          label: "आपका ईमेल",
          description: "वह ईमेल जिससे आपने साइन अप किया था।",
          placeholder: "अपना ईमेल दर्ज करें",
          validation: {
            required: "ईमेल ज़रूरी है",
            invalid: "कृपया सही ईमेल पता दर्ज करें",
          },
        },
        password: {
          label: "आपका पासवर्ड",
          description: "साइनअप के समय बनाया पासवर्ड दर्ज करें।",
          placeholder: "अपना पासवर्ड दर्ज करें",
          help: "अपने अकाउंट का पासवर्ड दर्ज करें",
          validation: {
            required: "पासवर्ड ज़रूरी है",
            minLength: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
          },
        },
        rememberMe: {
          label: "मुझे लॉग इन रखें",
        },
      },
      groups: {
        credentials: {
          title: "लॉगिन क्रेडेंशियल",
          description: "अपनी लॉगिन जानकारी दर्ज करें",
        },
        options: {
          title: "लॉगिन विकल्प",
          description: "लॉगिन की अतिरिक्त पसंद और सेटिंग्स",
        },
        preferences: {
          title: "लॉगिन पसंद",
          description: "लॉगिन के अतिरिक्त विकल्प",
        },
        advanced: {
          title: "एडवांस्ड विकल्प",
          description: "एडवांस्ड लॉगिन सेटिंग्स",
        },
      },
      footer: {
        forgotPassword: "पासवर्ड भूल गए?",
        createAccount: "अकाउंट नहीं है? साइन अप करें",
      },
      response: {
        title: "लॉगिन रिस्पॉन्स",
        description: "लॉगिन रिस्पॉन्स डेटा",
        success: "लॉगिन सफल",
        message: "स्थिति संदेश",
        user: {
          title: "यूज़र का ब्योरा",
          description: "लॉग इन यूज़र की जानकारी",
          id: "यूज़र ID",
          email: "ईमेल पता",
          firstName: "पहला नाम",
          lastName: "उपनाम",
          privateName: "निजी नाम",
          publicName: "सार्वजनिक नाम",
          imageUrl: "प्रोफ़ाइल इमेज",
        },
        sessionInfo: {
          title: "सेशन की जानकारी",
          description: "यूज़र सेशन का ब्योरा",
          expiresAt: "सेशन की समाप्ति",
          rememberMeActive: "मुझे याद रखें की स्थिति",
          loginLocation: "लॉगिन की जगह",
        },
        nextSteps: {
          title: "अगले कदम",
          item: "अगले कदम",
        },
      },
      errors: {
        title: "लॉगिन एरर",
        account_locked: "अकाउंट लॉक है",
        accountLocked: "अकाउंट लॉक है",
        accountLockedDescription:
          "आपका अकाउंट लॉक कर दिया गया है। कृपया सपोर्ट से संपर्क करें।",
        invalid_credentials: "ईमेल या पासवर्ड गलत है",
        two_factor_required: "टू-फ़ैक्टर ऑथेंटिकेशन ज़रूरी है",
        auth_error: "ऑथेंटिकेशन एरर हुई",
        user_not_found: "यूज़र नहीं मिला",
        session_creation_failed: "सेशन बनाना फ़ेल हुआ",
        token_save_failed: "ऑथेंटिकेशन टोकन सेव नहीं हो सका",
        validation: {
          title: "वैलिडेशन फ़ेल",
          description: "कृपया अपना इनपुट जाँचें",
        },
        unauthorized: {
          title: "लॉगिन फ़ेल",
          description: "क्रेडेंशियल गलत हैं",
        },
        unknown: {
          title: "लॉगिन एरर",
          description: "लॉगिन के दौरान एरर हुई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "कनेक्शन फ़ेल",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "लॉगिन की अनुमति नहीं",
        },
        notFound: {
          title: "यूज़र नहीं मिला",
          description: "यूज़र अकाउंट नहीं मिला",
        },
        unsaved: {
          title: "बिना सेव किए बदलाव",
          description: "बदलाव सेव नहीं हुए",
        },
        conflict: {
          title: "लॉगिन में टकराव",
          description: "लॉगिन टकराव मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
        },
      },
      success: {
        title: "लॉगिन सफल",
        description: "आप लॉग इन हो गए हैं",
        message: "वापसी पर स्वागत है! आप सफलतापूर्वक लॉग इन हो गए हैं।",
      },
      token: {
        save: {
          failed: "ऑथेंटिकेशन टोकन सेव नहीं हो सका",
          success: "ऑथेंटिकेशन टोकन सफलतापूर्वक सेव हुआ",
        },
      },
      process: {
        failed: "लॉगिन प्रक्रिया फ़ेल हुई",
      },
      enums: {
        socialProviders: {
          google: "Google",
          github: "GitHub",
          facebook: "Facebook",
        },
      },
      dev: {
        quickLogin: "डेव क्विक लॉगिन",
      },
    },
    resetPassword: {
      confirm: {
        category: "यूज़र्स",

        title: "पासवर्ड रीसेट की पुष्टि करें",
        description: "नए पासवर्ड के साथ अपने पासवर्ड रीसेट की पुष्टि करें",
        tag: "पासवर्ड रीसेट",
        email: {
          title: "पासवर्ड रीसेट सफल",
          subject: "पासवर्ड सफलतापूर्वक रीसेट हुआ - {{appName}}",
          previewText:
            "आपका {{appName}} पासवर्ड रीसेट हो गया है। लॉग इन करें और {{modelCount}} AI मॉडल के साथ चैट शुरू करें।",
          greeting: "नमस्ते {{name}},",
          successMessage:
            "आपका पासवर्ड रीसेट हो गया है। सब तैयार है: लॉग इन करें और वहीं से शुरू करें जहाँ छोड़ा था।",
          loginButton: "{{appName}} में लॉग इन करें",
          promoText: "{{modelCount}} AI मॉडल। कोई फ़िल्टर नहीं। कोई भाषण नहीं।",
          securityWarning:
            "आपने पासवर्ड रीसेट नहीं किया? तुरंत सपोर्ट से संपर्क करें: आपका अकाउंट जोखिम में हो सकता है।",
        },
        groups: {
          verification: {
            title: "वेरिफ़िकेशन",
            description: "अपने पासवर्ड रीसेट अनुरोध की पुष्टि करें",
          },
          newPassword: {
            title: "नया पासवर्ड",
            description: "अपना नया पासवर्ड सेट करें",
          },
        },
        fields: {
          token: {
            label: "रीसेट टोकन",
            description: "आपके ईमेल से मिला पासवर्ड रीसेट टोकन",
            placeholder: "रीसेट टोकन दर्ज करें",
            help: "पासवर्ड रीसेट टोकन के लिए अपना ईमेल देखें और उसे यहाँ दर्ज करें",
            validation: {
              required: "रीसेट टोकन ज़रूरी है",
            },
          },
          email: {
            label: "ईमेल पता",
            description: "आपका ईमेल पता",
            placeholder: "अपना ईमेल पता दर्ज करें",
            validation: {
              invalid: "कृपया सही ईमेल पता दर्ज करें",
            },
          },
          password: {
            label: "नया पासवर्ड",
            description: "आपका नया पासवर्ड",
            placeholder: "नया पासवर्ड दर्ज करें",
            help: "अक्षर, अंक और चिह्न मिलाकर कम से कम 8 अक्षरों का मज़बूत पासवर्ड चुनें",
            validation: {
              minLength: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
            },
          },
          confirmPassword: {
            label: "पासवर्ड की पुष्टि करें",
            description: "अपने नए पासवर्ड की पुष्टि करें",
            placeholder: "नए पासवर्ड की पुष्टि करें",
            validation: {
              minLength: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
            },
          },
        },
        validation: {
          passwords: {
            mismatch: "पासवर्ड मेल नहीं खाते",
          },
        },
        response: {
          title: "पासवर्ड रीसेट रिस्पॉन्स",
          description: "पासवर्ड रीसेट की पुष्टि का रिस्पॉन्स",
          message: {
            label: "संदेश",
            description: "रिस्पॉन्स संदेश",
          },
          securityTip: "बेहतर सुरक्षा के लिए टू-फ़ैक्टर ऑथेंटिकेशन चालू करने पर विचार करें",
          nextSteps: [
            "अपने नए पासवर्ड से लॉग इन करें",
            "अपने ब्राउज़र में सेव पासवर्ड अपडेट करें",
            "अतिरिक्त सुरक्षा के लिए 2FA चालू करने पर विचार करें",
          ],
        },
        errors: {
          title: "पासवर्ड रीसेट एरर",
          no_email: "उस ईमेल पते का कोई अकाउंट नहीं मिला",
          validation: {
            title: "वैलिडेशन एरर",
            description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
            passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "रीसेट टोकन गलत है या समाप्त हो चुका है",
          },
          internal: {
            title: "सर्वर एरर",
            description: "आंतरिक सर्वर एरर हुई",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क कनेक्शन एरर",
          },
          forbidden: {
            title: "एक्सेस नहीं मिला",
            description: "आपको यह कार्रवाई करने की अनुमति नहीं है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रीसेट टोकन नहीं मिला या समाप्त हो चुका है",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव हैं",
          },
          conflict: {
            title: "टकराव",
            description: "आपकी रिक्वेस्ट प्रोसेस करते समय टकराव हुआ",
          },
        },
        success: {
          title: "पासवर्ड रीसेट सफल",
          description: "आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है",
          message: "पासवर्ड सफलतापूर्वक रीसेट हुआ",
          password_reset: "आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है",
        },
        actions: {
          requestNewLink: "नया रीसेट लिंक माँगें",
        },
        emailTemplates: {
          confirm: {
            name: "पासवर्ड रीसेट की पुष्टि का ईमेल",
            description:
              "पासवर्ड सफलतापूर्वक रीसेट होने के बाद यूज़र्स को भेजा जाने वाला ईमेल",
            category: "ऑथेंटिकेशन",
            preview: {
              publicName: {
                label: "सार्वजनिक नाम",
                description: "यूज़र का सार्वजनिक डिस्प्ले नाम",
              },
              userId: {
                label: "यूज़र ID",
                description: "यूज़र की यूनिक पहचान",
              },
            },
          },
        },
      },
      request: {
        category: "यूज़र्स",
        title: "पासवर्ड रीसेट अनुरोध",
        description: "पासवर्ड रीसेट का अनुरोध करें",
        tag: "पासवर्ड रीसेट",
        ui: {
          title: "अपना पासवर्ड रीसेट करें",
          subtitle: "अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट का लिंक भेजेंगे",
          sendResetLink: "रीसेट लिंक भेजें",
          alreadyHaveAccount: "पहले से अकाउंट है? साइन इन करें",
        },
        actions: {
          submitting: "भेजा जा रहा है...",
        },
        email: {
          title: "अपना {{appName}} पासवर्ड रीसेट करें",
          subject: "पासवर्ड रीसेट अनुरोध - {{appName}}",
          previewText:
            "अपना {{appName}} पासवर्ड रीसेट करें: लिंक {{hours}} घंटे तक मान्य है।",
          greeting: "नमस्ते {{name}},",
          requestInfo:
            "किसी ने आपके {{appName}} अकाउंट का पासवर्ड रीसेट माँगा है। अगर वह आप थे, तो नीचे दिए बटन पर क्लिक करें।",
          buttonText: "मेरा पासवर्ड रीसेट करें",
          expirationInfo:
            "लिंक {{hours}} घंटे में समाप्त हो जाता है। आपने यह नहीं माँगा था तो इस ईमेल को अनदेखा करें: आपका पासवर्ड नहीं बदला है।",
          signoff: "{{appName}} टीम",
          promoText: "{{modelCount}} AI मॉडल। कोई फ़िल्टर नहीं। कोई भाषण नहीं।",
        },
        groups: {
          emailInput: {
            title: "ईमेल इनपुट",
            description: "रीसेट के निर्देश पाने के लिए अपना ईमेल पता दर्ज करें",
          },
        },
        fields: {
          email: {
            label: "ईमेल पता",
            description: "अपना ईमेल पता दर्ज करें",
            placeholder: "your@email.com",
            help: "अपने अकाउंट से जुड़ा ईमेल पता दर्ज करें",
            validation: {
              invalid: "कृपया सही ईमेल पता दर्ज करें",
            },
          },
        },
        response: {
          title: "रीसेट अनुरोध का रिस्पॉन्स",
          description: "पासवर्ड रीसेट अनुरोध का रिस्पॉन्स",
          success: {
            message: "पासवर्ड रीसेट का लिंक सफलतापूर्वक भेजा गया",
          },
          deliveryInfo: {
            estimatedTime: "5 मिनट के भीतर",
            expiresAt: "अभी से 4 घंटे बाद",
          },
          nextSteps: {
            checkEmail: "अपना ईमेल इनबॉक्स और स्पैम फ़ोल्डर देखें",
            clickLink: "ईमेल में रीसेट लिंक पर क्लिक करें",
            createPassword: "नया सुरक्षित पासवर्ड बनाएँ",
          },
        },
        errors: {
          title: "एरर",
          validation: {
            title: "वैलिडेशन एरर",
            description: "दिया गया इनपुट गलत है",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "अनुरोध अधिकृत नहीं",
          },
          internal: {
            title: "आंतरिक एरर",
            description: "आंतरिक सर्वर एरर",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क कनेक्शन एरर",
          },
          forbidden: {
            title: "मना है",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रिसोर्स नहीं मिला",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "बदलाव सेव नहीं हुए",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          no_email: "उस ईमेल पते का कोई अकाउंट नहीं मिला",
          email_generation_failed: "ईमेल बनाना फ़ेल हुआ",
        },
        success: {
          title: "अनुरोध भेजा गया",
          description: "पासवर्ड रीसेट का अनुरोध सफलतापूर्वक भेजा गया",
        },
        post: {
          title: "अनुरोध",
          description: "अनुरोध एंडपॉइंट",
          form: {
            title: "अनुरोध कॉन्फ़िगरेशन",
            description: "अनुरोध पैरामीटर सेट करें",
          },
          response: {
            title: "रिस्पॉन्स",
            description: "अनुरोध रिस्पॉन्स डेटा",
          },
          errors: {
            unauthorized: {
              title: "अनधिकृत",
              description: "ऑथेंटिकेशन ज़रूरी है",
            },
            validation: {
              title: "वैलिडेशन एरर",
              description: "रिक्वेस्ट के पैरामीटर गलत हैं",
            },
            server: {
              title: "सर्वर एरर",
              description: "आंतरिक सर्वर एरर हुई",
            },
            unknown: {
              title: "अनजान एरर",
              description: "कोई अनजान एरर आई",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर हुई",
            },
            forbidden: {
              title: "मना है",
              description: "एक्सेस मना है",
            },
            notFound: {
              title: "नहीं मिला",
              description: "रिसोर्स नहीं मिला",
            },
            conflict: {
              title: "टकराव",
              description: "डेटा टकराव हुआ",
            },
          },
          success: {
            title: "सफल",
            description: "कार्रवाई सफलतापूर्वक पूरी हुई",
          },
        },
        emailTemplates: {
          request: {
            name: "पासवर्ड रीसेट अनुरोध ईमेल",
            description: "पासवर्ड रीसेट करने के लिंक के साथ यूज़र्स को भेजा जाने वाला ईमेल",
            category: "ऑथेंटिकेशन",
            preview: {
              publicName: {
                label: "सार्वजनिक नाम",
                description: "यूज़र का सार्वजनिक डिस्प्ले नाम",
              },
              userId: {
                label: "यूज़र ID",
                description: "यूज़र की यूनिक पहचान",
              },
              passwordResetUrl: {
                label: "पासवर्ड रीसेट URL",
                description: "पासवर्ड रीसेट करने का URL",
              },
            },
          },
        },
      },
      validate: {
        category: "यूज़र्स",

        title: "रीसेट पासवर्ड टोकन की जाँच करें",
        description: "पासवर्ड रीसेट टोकन की जाँच का एंडपॉइंट",
        tag: "पासवर्ड रीसेट की जाँच",
        groups: {
          tokenInput: {
            title: "टोकन की जाँच",
            description: "जाँचने के लिए पासवर्ड रीसेट टोकन दर्ज करें",
          },
        },
        fields: {
          token: {
            label: "रीसेट टोकन",
            description: "ईमेल से मिला पासवर्ड रीसेट टोकन",
            placeholder: "रीसेट टोकन दर्ज करें",
            help: "अपने ईमेल में मिला टोकन दर्ज करें",
            validation: {
              required: "रीसेट टोकन ज़रूरी है",
            },
          },
        },
        response: {
          title: "जाँच का नतीजा",
          description: "टोकन जाँच का रिस्पॉन्स",
          valid: "टोकन मान्य",
          message: "जाँच का संदेश",
          validationMessage: "रीसेट टोकन की जाँच पूरी हुई",
          userId: "यूज़र ID",
          expiresAt: "टोकन की समाप्ति",
          nextSteps: {
            item: "जाँच के बाद अगले कदम",
            steps: [
              "अपना नया पासवर्ड सेट करने के लिए आगे बढ़ें",
              "मज़बूत और अनोखा पासवर्ड चुनें",
            ],
          },
        },
        errors: {
          title: "एरर",
          validation: {
            title: "वैलिडेशन एरर",
            description: "टोकन की जाँच फ़ेल हुई",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "टोकन गलत है या समाप्त हो चुका है",
          },
          internal: {
            title: "आंतरिक एरर",
            description: "आंतरिक सर्वर एरर हुई",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          forbidden: {
            title: "मना है",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "टोकन नहीं मिला",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
        },
        success: {
          title: "टोकन मान्य",
          description: "पासवर्ड रीसेट टोकन मान्य है",
        },
        post: {
          title: "जाँचें",
          description: "जाँच एंडपॉइंट",
          form: {
            title: "जाँच कॉन्फ़िगरेशन",
            description: "जाँच के पैरामीटर सेट करें",
          },
          response: {
            title: "रिस्पॉन्स",
            description: "जाँच रिस्पॉन्स डेटा",
          },
          errors: {
            unauthorized: {
              title: "अनधिकृत",
              description: "ऑथेंटिकेशन ज़रूरी है",
            },
            validation: {
              title: "वैलिडेशन एरर",
              description: "रिक्वेस्ट के पैरामीटर गलत हैं",
            },
            server: {
              title: "सर्वर एरर",
              description: "आंतरिक सर्वर एरर हुई",
            },
            unknown: {
              title: "अनजान एरर",
              description: "कोई अनजान एरर आई",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर हुई",
            },
            forbidden: {
              title: "मना है",
              description: "एक्सेस मना है",
            },
            notFound: {
              title: "नहीं मिला",
              description: "रिसोर्स नहीं मिला",
            },
            conflict: {
              title: "टकराव",
              description: "डेटा टकराव हुआ",
            },
          },
          success: {
            title: "सफल",
            description: "कार्रवाई सफलतापूर्वक पूरी हुई",
          },
        },
      },
      actions: {
        back: "वापस",
        submit: "सबमिट करें",
        submitting: "सबमिट हो रहा है...",
      },
      success: {
        password_reset: "आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है।",
      },
      errors: {
        tokenValidationFailed: "टोकन की जाँच फ़ेल हुई",
        userLookupFailed: "यूज़र खोजना फ़ेल हुआ",
        tokenDeletionFailed: "टोकन हटाना फ़ेल हुआ",
        userDeletionFailed: "यूज़र हटाना फ़ेल हुआ",
        resetFailed: "पासवर्ड रीसेट फ़ेल हुआ",
        tokenCreationFailed: "रीसेट टोकन बनाना फ़ेल हुआ",
        noDataReturned: "डेटाबेस से कोई डेटा नहीं लौटा",
        tokenInvalid: "रीसेट टोकन गलत है",
        tokenExpired: "रीसेट टोकन समाप्त हो चुका है",
        tokenVerificationFailed: "टोकन की जाँच फ़ेल हुई",
        userNotFound: "यूज़र नहीं मिला",
        passwordUpdateFailed: "पासवर्ड अपडेट नहीं हो सका",
        passwordResetFailed: "पासवर्ड रीसेट फ़ेल हुआ",
        requestFailed: "रीसेट अनुरोध फ़ेल हुआ",
        emailMismatch: "ईमेल मेल नहीं खाता",
        confirmationFailed: "पासवर्ड रीसेट की पुष्टि फ़ेल हुई",
      },
    },
    signup: {
      category: "यूज़र्स",

      _components: {
        passwordStrength: {
          label: "पासवर्ड की मज़बूती",
          weak: "कमज़ोर",
          fair: "ठीक-ठाक",
          good: "अच्छा",
          strong: "मज़बूत",
          requirement: {
            minLength: {
              icon: "✗",
              text: "कम से कम 8 अक्षर",
            },
            uppercase: {
              icon: "✗",
              text: "कम से कम एक बड़ा अक्षर",
            },
            lowercase: {
              icon: "✗",
              text: "कम से कम एक छोटा अक्षर",
            },
            number: {
              icon: "✗",
              text: "कम से कम एक अंक",
            },
            special: {
              icon: "!",
              text: "विशेष चिह्न (वैकल्पिक, मज़बूती बढ़ाता है)",
            },
          },
        },
        post: {
          title: "_components",
          description: "_components एंडपॉइंट",
          form: {
            title: "_components कॉन्फ़िगरेशन",
            description: "_components पैरामीटर सेट करें",
          },
          response: {
            title: "रिस्पॉन्स",
            description: "_components रिस्पॉन्स डेटा",
          },
          errors: {
            unauthorized: {
              title: "अनधिकृत",
              description: "ऑथेंटिकेशन ज़रूरी है",
            },
            validation: {
              title: "वैलिडेशन एरर",
              description: "रिक्वेस्ट के पैरामीटर गलत हैं",
            },
            server: {
              title: "सर्वर एरर",
              description: "आंतरिक सर्वर एरर हुई",
            },
            unknown: {
              title: "अनजान एरर",
              description: "कोई अनजान एरर आई",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर हुई",
            },
            forbidden: {
              title: "मना है",
              description: "एक्सेस मना है",
            },
            notFound: {
              title: "नहीं मिला",
              description: "रिसोर्स नहीं मिला",
            },
            conflict: {
              title: "टकराव",
              description: "डेटा टकराव हुआ",
            },
          },
          success: {
            title: "सफल",
            description: "कार्रवाई सफलतापूर्वक पूरी हुई",
          },
        },
      },
      title: "यूज़र साइनअप",
      description: "यूज़र रजिस्ट्रेशन एंडपॉइंट",
      tag: "ऑथेंटिकेशन",
      form: {
        title: "अनसेंसर्ड AI में आपका स्वागत है",
        description:
          "अनसेंसर्ड, प्राइवेसी-फ़र्स्ट और सच में स्वतंत्र AI बनाने में मदद करें। unbottled.ai ओपन सोर्स और कम्युनिटी से चलता है: आपका साइनअप ऐसी AI तकनीक के विकास को सपोर्ट करता है जो आपकी आज़ादी का सम्मान करती है।",
      },
      actions: {
        submit: "अकाउंट बनाएँ",
        submitting: "अकाउंट बन रहा है...",
      },
      fields: {
        privateName: {
          label: "आपका निजी नाम",
          description:
            "निजी बातचीत में AI आपको किस नाम से बुलाएगा। यह सिर्फ़ आपके और AI के बीच रहता है: पूरी तरह निजी।",
          placeholder: "अपना नाम दर्ज करें",
          validation: {
            required: "निजी नाम ज़रूरी है",
            minLength: "नाम कम से कम 2 अक्षरों का होना चाहिए",
            maxLength: "नाम 100 अक्षरों से कम होना चाहिए",
          },
        },
        publicName: {
          label: "आपका सार्वजनिक नाम",
          description:
            "सार्वजनिक चैट और फ़ोरम में आपकी पहचान। दूसरे यूज़र और AI यह नाम देखेंगे। समझदारी से चुनें: कम्युनिटी में यह आपका प्रतिनिधित्व करता है।",
          placeholder: "डिस्प्ले नाम दर्ज करें",
          validation: {
            required: "डिस्प्ले नाम ज़रूरी है",
            minLength: "डिस्प्ले नाम कम से कम 2 अक्षरों का होना चाहिए",
            maxLength: "डिस्प्ले नाम 100 अक्षरों से कम होना चाहिए",
          },
        },
        email: {
          label: "आपका ईमेल",
          description:
            "आपके लॉगिन क्रेडेंशियल और संपर्क का तरीक़ा। निजी रखे जाते हैं: दूसरे यूज़र या AI से कभी साझा नहीं होते।",
          placeholder: "ईमेल पता दर्ज करें",
          help: "यही आपका लॉगिन ईमेल और संपर्क का मुख्य तरीक़ा होगा",
          validation: {
            required: "ईमेल ज़रूरी है",
            invalid: "कृपया सही ईमेल पता दर्ज करें",
          },
        },
        password: {
          label: "आपका पासवर्ड",
          description:
            "मज़बूत पासवर्ड आपके अकाउंट की रक्षा करते हैं। हम जल्द एंड-टू-एंड एन्क्रिप्शन ला रहे हैं: तब पासवर्ड रीसेट से आपकी मैसेज हिस्ट्री साफ़ हो जाएगी क्योंकि डिक्रिप्शन की key सिर्फ़ आपके पास होगी। इसे किसी सुरक्षित जगह रखें।",
          placeholder: "पासवर्ड दर्ज करें",
          validation: {
            required: "पासवर्ड ज़रूरी है",
            minLength: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
            complexity: "पासवर्ड में बड़ा अक्षर, छोटा अक्षर और एक अंक होना चाहिए",
          },
        },
        confirmPassword: {
          label: "अपने पासवर्ड की पुष्टि करें",
          validation: {
            required: "कृपया अपने पासवर्ड की पुष्टि करें",
            minLength: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
            mismatch: "पासवर्ड मेल नहीं खाते",
          },
        },
        subscribeToNewsletter: {
          label: "न्यूज़लेटर सब्सक्राइब करें",
          description:
            "नए मॉडल और फ़ीचर के कभी-कभार अपडेट। कोई स्पैम नहीं, बस काम की बातें।",
        },
        acceptTerms: {
          label: "नियम और शर्तें स्वीकार करें",
          description: "हमारे नियम और शर्तें आपकी आज़ादी और प्राइवेसी का सम्मान करते हैं।",
          termsLink: "terms",
          conditionsLink: "प्राइवेसी पॉलिसी",
          descriptionPrefix: "हमारी",
          descriptionAnd: "and",
          descriptionSuffix: "आपकी आज़ादी का सम्मान करते हैं।",
          validation: {
            required: "आगे बढ़ने के लिए आपको नियम और शर्तें स्वीकार करनी होंगी",
          },
        },
        referralCode: {
          label: "रेफ़रल कोड (वैकल्पिक)",
          description:
            "क्या unbottled.ai पर आपका कोई दोस्त है? उनका कोड डालकर उन्हें सपोर्ट करें। आपको लाने पर उन्हें इनाम मिलता है।",
          placeholder: "रेफ़रल कोड दर्ज करें (वैकल्पिक)",
          labelPrefilled: "रेफ़रल कोड",
          descriptionPrefilled: "आपके अकाउंट बनाने पर आपके दोस्त को इनाम मिलता है।",
        },
        supportedSkillId: {
          label: "किसी क्रिएटर को सपोर्ट करें",
          description:
            "आपका साइनअप इस स्किल के क्रिएटर को आपके सब्सक्रिप्शन पर +5% बोनस से सपोर्ट करता है।",
          selectorTitle: "किसी क्रिएटर को सपोर्ट करें",
          selectorDescription:
            "आपने स्वतंत्र क्रिएटर्स की स्किल अपने पसंदीदा में जोड़ी हैं। सपोर्ट के लिए एक चुनें: उन्हें आपके सब्सक्रिप्शन से +5% मिलता है। आप इसे कभी भी बदल सकते हैं।",
          selectorNone: "कोई नहीं (छोड़ें)",
        },
        localFavorites: {
          label: "लोकल पसंदीदा",
        },
      },

      footer: {
        alreadyHaveAccount: "पहले से अकाउंट है? साइन इन करें",
      },
      errors: {
        title: "साइनअप एरर",
        validation: {
          title: "वैलिडेशन एरर",
          description: "कृपया अपना इनपुट जाँचें और फिर कोशिश करें",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        conflict: {
          title: "अकाउंट टकराव",
          description: "इस ईमेल का अकाउंट पहले से मौजूद है",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस नहीं मिला",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुई",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        unsaved: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
        internal: {
          title: "आंतरिक एरर",
          description: "आंतरिक एरर हुई",
        },
      },
      emailCheck: {
        title: "ईमेल उपलब्धता की जाँच",
        description: "जाँचें कि ईमेल रजिस्ट्रेशन के लिए उपलब्ध है या नहीं",
        tag: "ईमेल जाँच",
        fields: {
          email: {
            label: "ईमेल पता",
            description: "जाँचने वाला ईमेल",
            placeholder: "ईमेल पता दर्ज करें",
            validation: {
              invalid: "ईमेल का फ़ॉर्मेट गलत है",
            },
          },
        },
        response: {
          title: "ईमेल जाँच का रिस्पॉन्स",
          description: "ईमेल उपलब्धता जाँच का नतीजा",
          available: "ईमेल उपलब्ध है",
          message: "उपलब्धता का संदेश",
        },
        errors: {
          validation: {
            title: "ईमेल गलत है",
            description: "कृपया सही ईमेल पता दर्ज करें",
          },
          internal: {
            title: "ईमेल जाँच एरर",
            description: "ईमेल उपलब्धता जाँचने में एरर",
          },
          unknown: {
            title: "अनजान एरर",
            description: "अप्रत्याशित एरर आई",
          },
          conflict: {
            title: "ईमेल पहले से लिया हुआ है",
            description: "यह ईमेल पहले से रजिस्टर्ड है",
          },
          forbidden: {
            title: "एक्सेस नहीं मिला",
            description: "आपको यह ईमेल जाँचने की अनुमति नहीं है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "ईमेल जाँचते समय नेटवर्क एरर हुई",
          },
          notFound: {
            title: "सर्विस नहीं मिली",
            description: "ईमेल जाँच सर्विस उपलब्ध नहीं है",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "ईमेल जाँचने के लिए ऑथेंटिकेशन ज़रूरी है",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        success: {
          title: "ईमेल जाँच पूरी",
          description: "ईमेल उपलब्धता सफलतापूर्वक जाँची गई",
        },
      },
      post: {
        title: "साइन अप",
        description: "साइनअप एंडपॉइंट",
        form: {
          title: "साइनअप कॉन्फ़िगरेशन",
          description: "साइनअप पैरामीटर सेट करें",
        },
        response: {
          title: "रिस्पॉन्स",
          description: "साइनअप रिस्पॉन्स डेटा",
          success: "साइनअप सफल",
          message: "स्थिति संदेश",
          userId: "यूज़र ID",
          nextSteps: "अगले कदम",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "ऑथेंटिकेशन ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "आंतरिक सर्वर एरर हुई",
          },
          unknown: {
            title: "अनजान एरर",
            description: "कोई अनजान एरर आई",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर हुई",
          },
          forbidden: {
            title: "मना है",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रिसोर्स नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        success: {
          title: "सफल",
          description: "कार्रवाई सफलतापूर्वक पूरी हुई",
          processing: "साइनअप सफलतापूर्वक प्रोसेस हो रहा है",
        },
      },
      response: {
        title: "रिस्पॉन्स",
        description: "साइनअप रिस्पॉन्स डेटा",
        success: "साइनअप सफल",
        message: "स्थिति संदेश",
        user: {
          id: "यूज़र ID",
          email: "ईमेल पता",
          firstName: "पहला नाम",
          lastName: "उपनाम",
          privateName: "निजी नाम",
          publicName: "सार्वजनिक नाम",
          imageUrl: "प्रोफ़ाइल इमेज URL",
          verificationRequired: "वेरिफ़िकेशन ज़रूरी",
        },
        verificationInfo: {
          title: "ईमेल वेरिफ़िकेशन",
          description: "ईमेल वेरिफ़िकेशन प्रक्रिया का ब्योरा",
          emailSent: "ईमेल भेजा गया",
          expiresAt: "वेरिफ़िकेशन की समाप्ति",
          checkSpamFolder: "स्पैम फ़ोल्डर देखें",
        },
        nextSteps: "अगले कदम",
      },
      success: {
        title: "साइनअप सफल",
        description: "आपका अकाउंट सफलतापूर्वक बन गया है",
      },
      admin_notification: {
        title: "नया यूज़र साइनअप",
        subject: "नया यूज़र साइनअप - {{privateName}}",
        preview: "नए यूज़र {{privateName}} ने साइन अप किया है",
        message: "{{appName}} पर एक नए यूज़र ने साइन अप किया है",
        privateName: "निजी नाम",
        publicName: "सार्वजनिक नाम",
        email: "ईमेल",
        locale: "भाषा",
        creditBalance: "क्रेडिट बैलेंस",
        leadCreditBalance: "लीड क्रेडिट बैलेंस",
        signup_preferences: "साइनअप पसंद",
        user_details: "यूज़र का ब्योरा",
        basic_information: "बुनियादी जानकारी",
        signup_type: "साइनअप का प्रकार",
        direct_signup: "सीधा साइनअप",
        newsletter: "न्यूज़लेटर",
        subscribed: "सब्सक्राइब्ड",
        not_subscribed: "सब्सक्राइब्ड नहीं",
        signup_details: "साइनअप का ब्योरा",
        signup_date: "साइनअप की तारीख़",
        user_id: "यूज़र ID",
        recommended_next_steps: "सुझाए गए अगले कदम",
        direct_recommendation: "यूज़र प्रोफ़ाइल और पेमेंट सेटअप देखें",
        contact_user: "यूज़र से संपर्क करें",
        footer: "यह {{appName}} की ऑटोमैटिक सूचना है",
      },
      email: {
        subject: "आप अंदर हैं। {{appName}} आपके लिए तैयार है",
        previewText:
          "{{privateName}}, आपका अकाउंट तैयार है। Claude, GPT, Gemini, DeepSeek और {{modelCount}} और मॉडल के साथ चैट करें। फ़्री, कार्ड की ज़रूरत नहीं।",
        headline: "आपका AI इंतज़ार कर रहा है।",
        greeting: "नमस्ते {{privateName}},",
        intro:
          "{{appName}} में स्वागत है। ChatGPT की हर पसंदीदा चीज़, साथ में ओपन-सोर्स मॉडल और बिना कंटेंट फ़िल्टर वाले मॉडल। एक अकाउंट, एक जगह।",
        models: {
          title: "3 कैटेगरी में {{modelCount}} मॉडल",
          mainstream: "मुख्यधारा",
          open: "ओपन सोर्स",
          uncensored: "अनसेंसर्ड",
        },
        free: {
          title: "हमेशा फ़्री में क्या मिलता है:",
          credits:
            "हर महीने {{freeCreditsSignedIn}} फ़्री क्रेडिट, न्यूज़लेटर के साथ {{freeCreditsMax}}। कोई कार्ड नहीं।",
          allModels: "सभी {{modelCount}} AI मॉडल का एक्सेस",
          uncensored: "अनसेंसर्ड मॉडल जो आपके सवालों का सच में जवाब देते हैं",
          chatModes: "प्राइवेट, इनकॉग्निटो, शेयर्ड और पब्लिक चैट मोड",
          noCard: "क्रेडिट कार्ड की ज़रूरत नहीं। कभी नहीं।",
        },
        ctaButton: "अभी चैट शुरू करें",
        upgrade: {
          title: "और चाहिए?",
          desc: "प्लान {{subscriptionPrice}}/माह में {{subscriptionCredits}} क्रेडिट से शुरू होते हैं और {{ultraPrice}} में {{ultraCredits}} क्रेडिट तक जाते हैं। सब्सक्राइबर ऐसे पैक से टॉप-अप कर सकते हैं जो कभी एक्सपायर नहीं होते।",
          cta: "प्लान देखें",
        },
        signoff: "चैटिंग का मज़ा लें,\n{{appName}} टीम",
        ps: "P.S. बातचीत सिर्फ़ अपने डिवाइस पर रखने के लिए इनकॉग्निटो मोड इस्तेमाल करें। हम उन्हें अपने सर्वर पर कभी स्टोर नहीं करते (जनरेट किया मीडिया तकनीकी वजहों से कुछ समय के लिए स्टोर होता है)।",
      },
      emailTemplates: {
        welcome: {
          name: "साइनअप वेलकम ईमेल",
          description: "सफल रजिस्ट्रेशन के बाद यूज़र्स को भेजा जाने वाला वेलकम ईमेल",
          category: "ऑथेंटिकेशन",
          preview: {
            privateName: {
              label: "निजी नाम",
              description: "यूज़र का निजी नाम",
            },
            userId: {
              label: "यूज़र ID",
              description: "यूज़र की यूनिक पहचान",
            },
            leadId: {
              label: "लीड ID",
              description: "यूज़र की लीड पहचान",
            },
          },
        },
        adminSignup: {
          name: "एडमिन साइनअप सूचना ईमेल",
          description: "नया यूज़र रजिस्टर होने पर एडमिन को भेजा जाने वाला ईमेल",
          category: "एडमिनिस्ट्रेशन",
          preview: {
            privateName: {
              label: "निजी नाम",
            },
            publicName: {
              label: "सार्वजनिक नाम",
            },
            email: {
              label: "ईमेल पता",
            },
            userId: {
              label: "यूज़र ID",
            },
            subscribeToNewsletter: {
              label: "न्यूज़लेटर सब्सक्रिप्शन",
            },
          },
        },
      },
    },
  },
  search: {
    category: "यूज़र्स",

    title: "यूज़र खोज",
    description: "यूज़र खोजें",
    tag: "यूज़र खोज",
    container: {
      title: "खोज कंटेनर",
      description: "यूज़र खोज कंटेनर",
    },
    groups: {
      searchCriteria: {
        title: "खोज मानदंड",
        description: "अपने खोज पैरामीटर तय करें",
      },
      filters: {
        title: "एडवांस्ड फ़िल्टर",
        description: "अतिरिक्त फ़िल्टर विकल्प",
      },
      pagination: {
        title: "पेजिनेशन",
        description: "नतीजों का पेजिनेशन कैसे हो, तय करें",
      },
    },
    fields: {
      search: {
        label: "खोज क्वेरी",
        description: "खोज शब्द दर्ज करें",
        placeholder: "यूज़र खोजें...",
        help: "नाम, ईमेल या कंपनी से खोजें",
        validation: {
          minLength: "खोज क्वेरी कम से कम 2 अक्षरों की होनी चाहिए",
        },
      },
      roles: {
        label: "यूज़र रोल",
        description: "यूज़र रोल से फ़िल्टर करें",
        placeholder: "रोल चुनें...",
        help: "फ़िल्टर करने के लिए एक या अधिक रोल चुनें",
      },
      status: {
        label: "यूज़र स्थिति",
        description: "यूज़र स्थिति से फ़िल्टर करें",
        placeholder: "स्थिति चुनें...",
        help: "सक्रिय, निष्क्रिय या सभी यूज़र से फ़िल्टर करें",
      },
      limit: {
        label: "सीमा",
        description: "नतीजों की अधिकतम संख्या",
        help: "कितने नतीजे लौटाने हैं बताएँ (डिफ़ॉल्ट: 10)",
      },
      offset: {
        label: "ऑफ़सेट",
        description: "छोड़े जाने वाले नतीजों की संख्या",
        help: "पेजिनेशन ऑफ़सेट बताएँ (डिफ़ॉल्ट: 0)",
      },
    },
    status: {
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      all: "सभी",
    },
    response: {
      title: "खोज के नतीजे",
      description: "यूज़र खोज के नतीजे",
      success: {
        badge: "सफल",
      },
      message: {
        content: "खोज नतीजे का संदेश",
      },
      searchInfo: {
        title: "खोज की जानकारी",
        description: "खोज ऑपरेशन का ब्योरा",
        searchTerm: "खोज शब्द",
        appliedFilters: "लागू फ़िल्टर",
        searchTime: "खोज का समय",
        totalResults: "कुल नतीजे",
      },
      pagination: {
        title: "पेजिनेशन की जानकारी",
        description: "पेज नेविगेशन की जानकारी",
        currentPage: "मौजूदा पेज",
        totalPages: "कुल पेज",
        itemsPerPage: "प्रति पेज आइटम",
        totalItems: "कुल आइटम",
        hasMore: "और हैं",
        hasPrevious: "पिछला है",
      },
      actions: {
        title: "उपलब्ध कार्रवाइयाँ",
        description: "नतीजों पर आप जो कार्रवाइयाँ कर सकते हैं",
        type: "कार्रवाई का प्रकार",
        label: "कार्रवाई",
        href: "लिंक",
      },
      users: {
        label: "मिले यूज़र",
        description: "मेल खाते यूज़र की सूची",
        item: {
          title: "यूज़र",
          description: "यूज़र अकाउंट की जानकारी",
        },
        id: "यूज़र ID",
        leadId: "लीड ID",
        isPublic: "सार्वजनिक",
        firstName: "पहला नाम",
        lastName: "उपनाम",
        privateName: "निजी नाम",
        publicName: "सार्वजनिक नाम",
        company: "कंपनी",
        email: "ईमेल",
        imageUrl: "अवतार",
        isActive: "सक्रिय",
        emailVerified: "ईमेल वेरिफ़ाइड",
        requireTwoFactor: "2FA ज़रूरी",
        marketingConsent: "मार्केटिंग सहमति",
        userRoles: {
          item: {
            title: "रोल",
            description: "यूज़र रोल असाइनमेंट",
          },
          id: "रोल ID",
          role: "रोल",
        },
        createdAt: "बनाया गया",
        updatedAt: "अपडेट हुआ",
      },
    },
    columns: {
      firstName: "पहला नाम",
      lastName: "उपनाम",
      privateName: "निजी नाम",
      publicName: "सार्वजनिक नाम",
      email: "ईमेल",
      company: "कंपनी",
      userRoles: "रोल",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "खोज के पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "खोज अधिकृत नहीं",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "आंतरिक सर्वर एरर",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन एरर",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई यूज़र नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "खोज में टकराव हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बदलाव सेव नहीं हुए",
      },
    },
    success: {
      title: "खोज सफल",
      description: "खोज सफलतापूर्वक पूरी हुई",
    },
    post: {
      title: "खोजें",
      description: "खोज एंडपॉइंट",
      form: {
        title: "खोज कॉन्फ़िगरेशन",
        description: "खोज पैरामीटर सेट करें",
      },
      response: {
        title: "रिस्पॉन्स",
        description: "खोज रिस्पॉन्स डेटा",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कोई अनजान एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुई",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस मना है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा टकराव हुआ",
        },
      },
      success: {
        title: "सफल",
        description: "कार्रवाई सफलतापूर्वक पूरी हुई",
      },
    },
  },
  "session-cleanup": {
    category: "यूज़र्स",

    post: {
      title: "सेशन क्लीनअप",
      description: "समाप्त यूज़र सेशन और टोकन साफ़ करें",
      tag: "सेशन क्लीनअप",
      container: {
        title: "सेशन क्लीनअप",
        description: "सेशन क्लीनअप कॉन्फ़िगर करें और चलाएँ",
      },
      fields: {
        sessionRetentionDays: {
          label: "सेशन रिटेंशन के दिन",
          description: "सेशन कितने दिन रखने हैं",
        },
        tokenRetentionDays: {
          label: "टोकन रिटेंशन के दिन",
          description: "टोकन कितने दिन रखने हैं",
        },
        batchSize: {
          label: "बैच साइज़",
          description: "हर बैच में प्रोसेस होने वाले रिकॉर्ड की संख्या",
        },
        dryRun: {
          label: "ड्राई रन",
          description: "रिकॉर्ड असल में हटाए बिना चलाएँ",
        },
      },
      response: {
        sessionsDeleted: "हटाए गए सेशन",
        tokensDeleted: "हटाए गए टोकन",
        totalProcessed: "कुल प्रोसेस हुए",
        executionTimeMs: "एक्ज़ीक्यूशन समय (ms)",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "सेशन क्लीनअप चलाने के लिए आपका एडमिन होना ज़रूरी है",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस मना है",
        },
        server: {
          title: "सर्वर एरर",
          description: "क्लीनअप के दौरान आंतरिक सर्वर एरर",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कोई अनजान एरर आई",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "क्लीनअप कॉन्फ़िगरेशन गलत है",
        },
      },
      success: {
        title: "सेशन क्लीनअप पूरा हुआ",
        description: "सेशन और टोकन सफलतापूर्वक साफ़ हुए",
      },
    },
    task: {
      name: "user-session-cleanup",
      description: "सिस्टम की सुरक्षा बनाए रखने के लिए समाप्त यूज़र सेशन साफ़ करें",
      purpose: "सुरक्षा और परफ़ॉर्मेंस बनाए रखने के लिए समाप्त सेशन हटाता है",
      impact: "पुराना सेशन डेटा हटाकर सिस्टम की परफ़ॉर्मेंस और सुरक्षा सुधारता है",
      rollback: "क्लीनअप ऑपरेशन के लिए रोलबैक लागू नहीं",
    },
    errors: {
      default: "सेशन क्लीनअप के दौरान एरर हुई",
      execution_failed: {
        title: "सेशन क्लीनअप फ़ेल हुआ",
        description: "समाप्त सेशन साफ़ नहीं हो सके",
      },
      partial_failure: {
        title: "सेशन क्लीनअप आंशिक रूप से फ़ेल",
        description: "कुछ सेशन साफ़ नहीं हो सके",
      },
      unknown_error: {
        title: "अनजान सेशन क्लीनअप एरर",
        description: "सेशन क्लीनअप के दौरान अनजान एरर हुई",
      },
      invalid_session_retention: {
        title: "सेशन रिटेंशन गलत है",
        description: "सेशन रिटेंशन की अवधि गलत दी गई है",
      },
      invalid_token_retention: {
        title: "टोकन रिटेंशन गलत है",
        description: "टोकन रिटेंशन की अवधि गलत दी गई है",
      },
      invalid_batch_size: {
        title: "बैच साइज़ गलत है",
        description: "क्लीनअप के लिए बैच साइज़ गलत दिया गया है",
      },
      validation_failed: {
        title: "वैलिडेशन फ़ेल",
        description: "सेशन क्लीनअप कॉन्फ़िगरेशन की जाँच फ़ेल हुई",
      },
    },
    success: {
      title: "सेशन क्लीनअप पूरा हुआ",
      description: "समाप्त सेशन सफलतापूर्वक साफ़ हुए",
    },
    monitoring: {
      alertTrigger: "सेशन क्लीनअप टास्क फ़ेल हुआ",
    },
    documentation: {
      overview:
        "यह टास्क सुरक्षा और परफ़ॉर्मेंस बनाए रखने के लिए सिस्टम से समाप्त यूज़र सेशन हटाता है",
    },
  },
  sessionCleanup: {
    category: "यूज़र्स",

    post: {
      title: "सेशन क्लीनअप",
      description: "समाप्त यूज़र सेशन और टोकन साफ़ करें",
      tag: "सेशन क्लीनअप",
      container: {
        title: "सेशन क्लीनअप",
        description: "सेशन क्लीनअप कॉन्फ़िगर करें और चलाएँ",
      },
      fields: {
        sessionRetentionDays: {
          label: "सेशन रिटेंशन के दिन",
          description: "सेशन कितने दिन रखने हैं",
        },
        tokenRetentionDays: {
          label: "टोकन रिटेंशन के दिन",
          description: "टोकन कितने दिन रखने हैं",
        },
        batchSize: {
          label: "बैच साइज़",
          description: "हर बैच में प्रोसेस होने वाले रिकॉर्ड की संख्या",
        },
        dryRun: {
          label: "ड्राई रन",
          description: "रिकॉर्ड असल में हटाए बिना चलाएँ",
        },
      },
      response: {
        sessionsDeleted: "हटाए गए सेशन",
        tokensDeleted: "हटाए गए टोकन",
        totalProcessed: "कुल प्रोसेस हुए",
        executionTimeMs: "एक्ज़ीक्यूशन समय (ms)",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "सेशन क्लीनअप चलाने के लिए आपका एडमिन होना ज़रूरी है",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस मना है",
        },
        server: {
          title: "सर्वर एरर",
          description: "क्लीनअप के दौरान आंतरिक सर्वर एरर",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कोई अनजान एरर आई",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "क्लीनअप कॉन्फ़िगरेशन गलत है",
        },
      },
      success: {
        title: "सेशन क्लीनअप पूरा हुआ",
        description: "सेशन और टोकन सफलतापूर्वक साफ़ हुए",
      },
    },
    task: {
      name: "user-session-cleanup",
      description: "सिस्टम की सुरक्षा बनाए रखने के लिए समाप्त यूज़र सेशन साफ़ करें",
      purpose: "सुरक्षा और परफ़ॉर्मेंस बनाए रखने के लिए समाप्त सेशन हटाता है",
      impact: "पुराना सेशन डेटा हटाकर सिस्टम की परफ़ॉर्मेंस और सुरक्षा सुधारता है",
      rollback: "क्लीनअप ऑपरेशन के लिए रोलबैक लागू नहीं",
    },
    errors: {
      default: "सेशन क्लीनअप के दौरान एरर हुई",
      execution_failed: {
        title: "सेशन क्लीनअप फ़ेल हुआ",
        description: "समाप्त सेशन साफ़ नहीं हो सके",
      },
      partial_failure: {
        title: "सेशन क्लीनअप आंशिक रूप से फ़ेल",
        description: "कुछ सेशन साफ़ नहीं हो सके",
      },
      unknown_error: {
        title: "अनजान सेशन क्लीनअप एरर",
        description: "सेशन क्लीनअप के दौरान अनजान एरर हुई",
      },
      invalid_session_retention: {
        title: "सेशन रिटेंशन गलत है",
        description: "सेशन रिटेंशन की अवधि गलत दी गई है",
      },
      invalid_token_retention: {
        title: "टोकन रिटेंशन गलत है",
        description: "टोकन रिटेंशन की अवधि गलत दी गई है",
      },
      invalid_batch_size: {
        title: "बैच साइज़ गलत है",
        description: "क्लीनअप के लिए बैच साइज़ गलत दिया गया है",
      },
      validation_failed: {
        title: "वैलिडेशन फ़ेल",
        description: "सेशन क्लीनअप कॉन्फ़िगरेशन की जाँच फ़ेल हुई",
      },
    },
    success: {
      title: "सेशन क्लीनअप पूरा हुआ",
      description: "समाप्त सेशन सफलतापूर्वक साफ़ हुए",
    },
    monitoring: {
      alertTrigger: "सेशन क्लीनअप टास्क फ़ेल हुआ",
    },
    documentation: {
      overview:
        "यह टास्क सुरक्षा और परफ़ॉर्मेंस बनाए रखने के लिए सिस्टम से समाप्त यूज़र सेशन हटाता है",
    },
  },
  userRoles: {
    errors: {
      find_failed: "यूज़र रोल नहीं मिल सके",
      batch_find_failed: "यूज़र रोल बैच में नहीं मिल सके",
      not_found: "यूज़र रोल नहीं मिला",
      lookup_failed: "यूज़र रोल खोजना फ़ेल हुआ",
      add_failed: "यूज़र को रोल जोड़ना फ़ेल हुआ",
      no_data_returned: "डेटाबेस से कोई डेटा नहीं लौटा",
      remove_failed: "यूज़र से रोल हटाना फ़ेल हुआ",
      check_failed: "यूज़र के पास रोल है या नहीं, जाँचना फ़ेल हुआ",
      delete_failed: "यूज़र रोल हटाना फ़ेल हुआ",
      endpoint_not_created: "यूज़र रोल एंडपॉइंट अभी बना नहीं है",
    },
    post: {
      title: "यूज़र रोल",
      description: "यूज़र रोल एंडपॉइंट",
      form: {
        title: "यूज़र रोल कॉन्फ़िगरेशन",
        description: "यूज़र रोल पैरामीटर सेट करें",
      },
      response: {
        title: "रिस्पॉन्स",
        description: "यूज़र रोल रिस्पॉन्स डेटा",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कोई अनजान एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुई",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस मना है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा टकराव हुआ",
        },
        database_connection_failed: {
          title: "डेटाबेस कनेक्शन फ़ेल",
          description: "डेटाबेस से कनेक्ट नहीं हो सका",
        },
      },
      success: {
        title: "सफल",
        description: "कार्रवाई सफलतापूर्वक पूरी हुई",
      },
    },
    enums: {
      userRole: {
        public: "सार्वजनिक",
        customer: "ग्राहक",
        partnerAdmin: "पार्टनर एडमिन",
        partnerEmployee: "पार्टनर कर्मचारी",
        admin: "एडमिन",
        cliOff: "CLI बंद",
        cliAuthBypass: "CLI ऑथ बायपास",
        aiToolOff: "AI टूल बंद",
        webOff: "वेब बंद",
        mcpOff: "MCP बंद",
        mcpVisible: "MCP दिखता है",
        productionOff: "प्रोडक्शन बंद",
        skillOff: "स्किल बंद",
      },
    },
  },
  profileVisibility: {
    public: "सार्वजनिक",
    private: "निजी",
    contactsOnly: "सिर्फ़ संपर्क",
  },
  contactMethods: {
    email: "ईमेल",
    phone: "फ़ोन",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "लाइट",
    dark: "डार्क",
    system: "सिस्टम",
  },
  userDetailLevel: {
    minimal: "मिनिमल",
    standard: "स्टैंडर्ड",
    complete: "पूरा करें",
  },
  language: {
    it: "इतालवी",
    es: "स्पेनिश",
    sk: "स्लोवाक",
    en: "अंग्रेज़ी",
    de: "जर्मन",
    pl: "पोलिश",
    fr: "फ़्रेंच",
  },
  timezone: {
    utc: "UTC",
    america_new_york: "America/New_York",
    america_los_angeles: "America/Los_Angeles",
    europe_london: "Europe/London",
    europe_berlin: "Europe/Berlin",
    europe_warsaw: "Europe/Warsaw",
    asia_tokyo: "Asia/Tokyo",
    australia_sydney: "Australia/Sydney",
  },
  errors: {
    emailAlreadyInUse: "ईमेल पता पहले से इस्तेमाल में है",
    locale_required: "लोकेल ज़रूरी है",
    auth_required: "ऑथेंटिकेशन ज़रूरी है। इनमें से कोई एक रोल: {{roles}}",
    auth_retrieval_failed: "ऑथेंटिकेशन पाना फ़ेल हुआ: {{error}}",
    not_found: "यूज़र नहीं मिला",
    not_found_by_id: "ID {{userId}} का कोई यूज़र नहीं मिला",
    not_found_by_email: "ईमेल {{email}} का कोई यूज़र नहीं मिला",
    roles_lookup_failed: "यूज़र {{userId}} के रोल खोजना फ़ेल हुआ",
    roles_batch_fetch_failed: "{{count}} यूज़र के रोल बैच में लाना फ़ेल हुआ",
    id_lookup_failed: "यूज़र {{userId}} खोजना फ़ेल हुआ: {{error}}",
    email_lookup_failed: "ईमेल {{email}} से यूज़र खोजना फ़ेल हुआ: {{error}}",
    email_check_failed: "ईमेल {{email}} जाँचना फ़ेल हुआ: {{error}}",
    email_duplicate_check_failed:
      "ईमेल {{email}} को दूसरे यूज़र से जाँचना फ़ेल हुआ ({{excludeUserId}} छोड़कर): {{error}}",
    search_failed: "{{query}} के लिए यूज़र खोजना फ़ेल हुआ: {{error}}",
    list_failed: "यूज़र की सूची बनाना फ़ेल हुआ: {{error}}",
    email_already_in_use: "ईमेल पता पहले से इस्तेमाल में है",
    creation_failed: "यूज़र बनाना फ़ेल हुआ: {{error}}",
    no_data_returned: "डेटाबेस से कोई डेटा नहीं लौटा",
    password_hashing_failed: "{{email}} का पासवर्ड हैश करना फ़ेल हुआ: {{error}}",
    not_implemented_on_native: "यह फ़ीचर React Native पर लागू नहीं है",
    count_failed: "यूज़र की गिनती पाना फ़ेल हुआ: {{error}}",
  },
  userNoteType: {
    note: "नोट",
    call: "कॉल",
    email: "ईमेल",
    meeting: "मीटिंग",
    task: "टास्क",
  },
  notifications: {
    profileUpdated: {
      title: "प्रोफ़ाइल अपडेट हुई",
      description: "आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई है",
    },
    updateFailed: {
      title: "अपडेट फ़ेल हुआ",
      description: "आपकी प्रोफ़ाइल अपडेट नहीं हो सकी। फिर कोशिश करें।",
    },
  },
};
