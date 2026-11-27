import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "यूज़र प्रोफ़ाइल पाएँ",
    titleShort: "मेरी प्रोफ़ाइल",
    description: "मौजूदा यूज़र की प्रोफ़ाइल जानकारी पाएँ",
    response: {
      title: "यूज़र प्रोफ़ाइल रिस्पॉन्स",
      description: "मौजूदा यूज़र का प्रोफ़ाइल डेटा",
      id: "यूज़र ID",
      leadId: "लीड ID",
      isPublic: "पब्लिक प्रोफ़ाइल",
      email: "ईमेल एड्रेस",
      privateName: "प्राइवेट नाम",
      publicName: "पब्लिक नाम",
      locale: "भाषा",
      isActive: "एक्टिव स्टेटस",
      emailVerified: "ईमेल वेरिफ़ाइड",
      pendingEmail: "पेंडिंग ईमेल",
      requireTwoFactor: "टू-फ़ैक्टर ऑथेंटिकेशन ज़रूरी",
      marketingConsent: "मार्केटिंग की सहमति",
      userRoles: "यूज़र रोल",
      roles: "रोल",
      createdAt: "बनाने का समय",
      updatedAt: "अपडेट का समय",
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
        description: "यूज़र प्रोफ़ाइल की जानकारी",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "यूज़र प्रोफ़ाइल नहीं मिली",
        detail: "हमें आपकी प्रोफ़ाइल नहीं मिली (यूज़र {{userId}})",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "सर्वर में आंतरिक एरर हुआ",
        detail: "आपकी प्रोफ़ाइल लोड नहीं हो सकी: {{error}} (यूज़र {{userId}})",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "प्रोफ़ाइल मिल गई",
    },
  },
  update: {
    title: "यूज़र प्रोफ़ाइल अपडेट करें",
    titleShort: "प्रोफ़ाइल अपडेट करें",
    description: "मौजूदा यूज़र की प्रोफ़ाइल जानकारी अपडेट करें",
    groups: {
      basicInfo: {
        title: "बुनियादी जानकारी",
        description: "अपनी बुनियादी प्रोफ़ाइल जानकारी अपडेट करें",
      },
      profileDetails: {
        title: "प्रोफ़ाइल की जानकारी",
        description: "अपनी प्रोफ़ाइल की जानकारी और सेटिंग्स मैनेज करें",
      },
      privacySettings: {
        title: "प्राइवेसी सेटिंग्स",
        description: "तय करें कि आपकी प्रोफ़ाइल जानकारी कौन देख सकता है",
      },
      profileInfo: {
        title: "क्रिएटर प्रोफ़ाइल",
        description: "आपके स्किल पेजों के लिए बायो, सोशल लिंक और ब्रांडिंग",
      },
    },
    fields: {
      email: {
        label: "ईमेल एड्रेस",
        description:
          "आपका लॉगिन एड्रेस। नया एड्रेस तभी लागू होता है जब आप उस पर भेजे गए लिंक पर क्लिक करते हैं।",
        placeholder: "अपना ईमेल एड्रेस लिखें",
        help: "आपका ईमेल एड्रेस अकाउंट नोटिफ़िकेशन और संवाद के लिए इस्तेमाल होगा",
        validation: {
          invalid: "कृपया सही ईमेल एड्रेस लिखें",
        },
      },
      privateName: {
        label: "प्राइवेट नाम",
        description: "आपका आंतरिक/प्राइवेट नाम",
        placeholder: "अपना प्राइवेट नाम लिखें",
        help: "आपका प्राइवेट नाम आंतरिक रूप से और निजी संवाद में इस्तेमाल होता है",
        validation: {
          minLength: "प्राइवेट नाम कम से कम 2 अक्षर का होना चाहिए",
          maxLength: "प्राइवेट नाम 50 अक्षर से ज़्यादा नहीं हो सकता",
        },
      },
      publicName: {
        label: "पब्लिक नाम",
        description: "आपका पब्लिक डिस्प्ले नाम",
        placeholder: "अपना पब्लिक नाम लिखें",
        help: "आपका पब्लिक नाम दूसरे यूज़र्स को दिखेगा",
        validation: {
          minLength: "पब्लिक नाम कम से कम 2 अक्षर का होना चाहिए",
          maxLength: "पब्लिक नाम 50 अक्षर से ज़्यादा नहीं हो सकता",
        },
      },
      imageUrl: {
        label: "प्रोफ़ाइल इमेज",
        description: "आपकी प्रोफ़ाइल इमेज का URL",
        placeholder: "इमेज URL लिखें",
        help: "ऐसी इमेज का URL दें जो आपकी प्रोफ़ाइल फ़ोटो के रूप में दिखे",
        validation: {
          invalid: "कृपया सही इमेज URL दें",
        },
      },
      company: {
        label: "कंपनी",
        description: "आपकी कंपनी का नाम",
        placeholder: "अपनी कंपनी लिखें",
        help: "आपकी कंपनी का नाम आपकी प्रोफ़ाइल पर दिखेगा",
        validation: {
          maxLength: "कंपनी का नाम 100 अक्षर से ज़्यादा नहीं हो सकता",
        },
      },
      visibility: {
        label: "प्रोफ़ाइल की दृश्यता",
        description: "आपकी प्रोफ़ाइल कौन देख सकता है",
        placeholder: "दृश्यता सेटिंग चुनें",
        help: "चुनें कि आपकी प्रोफ़ाइल कौन देख सकता है: पब्लिक (सब), प्राइवेट (सिर्फ़ आप), या सिर्फ़ कॉन्टैक्ट्स",
      },
      marketingConsent: {
        label: "न्यूज़लेटर सब्सक्राइब करें",
        description:
          "नए मॉडल और फ़ीचर्स की कभी-कभार अपडेट। कोई स्पैम नहीं, सिर्फ़ काम की बात।",
        placeholder: "मार्केटिंग ईमेल चालू करें",
        help: "चुनें कि आपको मार्केटिंग ईमेल और प्रमोशनल संदेश मिलें या नहीं",
      },
      bio: {
        label: "बायो",
        description: "अपने बारे में एक छोटा विवरण",
        placeholder: "हमें अपने बारे में बताएँ...",
        help: "अपने बारे में एक छोटा विवरण लिखें जो आपकी प्रोफ़ाइल पर दिखेगा",
        validation: {
          maxLength: "बायो 500 अक्षर से ज़्यादा नहीं हो सकता",
        },
      },
      websiteUrl: {
        label: "वेबसाइट",
        description: "आपकी निजी या बिज़नेस वेबसाइट",
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
        description: "आपकी Nostr प्रोफ़ाइल या npub एड्रेस",
        placeholder: "https://primal.net/p/npub1...",
      },
      gabUrl: {
        label: "Gab",
        description: "आपकी Gab प्रोफ़ाइल का URL",
        placeholder: "https://gab.com/yourhandle",
      },
      creatorSlug: {
        label: "प्रोफ़ाइल URL",
        description: "आपका कस्टम प्रोफ़ाइल स्लग, जो आपके पब्लिक लिंक में दिखता है",
        placeholder: "jane-doe",
        validation: {
          invalid: "सिर्फ़ छोटे अक्षर (a-z), संख्याएँ और हाइफ़न चलते हैं",
        },
      },
      creatorAccentColor: {
        label: "एक्सेंट कलर",
        description: "आपके स्किल पेज की ब्रांडिंग के लिए हेक्स कलर (वैकल्पिक)",
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
      description: "आपकी अपडेट की हुई प्रोफ़ाइल जानकारी",
      success: "अपडेट सफल",
      message: "आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई है",
      id: "यूज़र ID",
      leadId: "लीड ID",
      isPublic: "पब्लिक प्रोफ़ाइल",
      email: "ईमेल एड्रेस",
      privateName: "प्राइवेट नाम",
      publicName: "पब्लिक नाम",
      locale: "भाषा",
      isActive: "एक्टिव स्टेटस",
      emailVerified: "ईमेल वेरिफ़ाइड",
      pendingEmail: "पेंडिंग ईमेल",
      emailChangePending:
        "लगभग हो गया। स्विच करने के लिए {{email}} पर भेजे लिंक पर क्लिक करें। तब तक आप {{current}} से ही लॉग इन करेंगे।",
      requireTwoFactor: "टू-फ़ैक्टर ऑथेंटिकेशन ज़रूरी",
      marketingConsent: "मार्केटिंग की सहमति",
      userRoles: "यूज़र रोल",
      createdAt: "बनाने का समय",
      updatedAt: "अपडेट का समय",
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
        title: "बदलावों का सार",
        description: "आपकी प्रोफ़ाइल में किए गए बदलावों का सार",
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
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
        emailTaken: "यह ईमेल एड्रेस किसी दूसरे अकाउंट का है",
        disposableEmail:
          "अस्थायी इनबॉक्स की अनुमति नहीं है। स्थायी ईमेल एड्रेस इस्तेमाल करें।",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "यूज़र प्रोफ़ाइल नहीं मिली",
        detail: "अपडेट करने के लिए हमें आपकी प्रोफ़ाइल नहीं मिली (यूज़र {{userId}})",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
        creatorSlugTaken: "यह क्रिएटर हैंडल पहले से लिया जा चुका है, कोई दूसरा चुनें",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "सर्वर में आंतरिक एरर हुआ",
        detail: "आपकी प्रोफ़ाइल सेव नहीं हो सकी: {{error}} (यूज़र {{userId}})",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "प्रोफ़ाइल अपडेट हो गई",
      nextSteps: "प्रोफ़ाइल अपडेट करने के बाद के सुझाए गए अगले कदम",
    },
  },
  delete: {
    title: "यूज़र अकाउंट हटाएँ",
    titleShort: "अकाउंट हटाएँ",
    description: "अपना यूज़र अकाउंट हमेशा के लिए हटाएँ",
    response: {
      title: "हटाने का स्टेटस",
      description: "अकाउंट हटाने की पुष्टि",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "यूज़र अकाउंट नहीं मिला",
        detail: "हटाने के लिए हमें आपका अकाउंट नहीं मिला (यूज़र {{userId}})",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      billingCancelFailed:
        "हम आपका सब्सक्रिप्शन रद्द नहीं कर सके, इसलिए आपका अकाउंट नहीं हटाया गया, वरना आपसे बिलिंग चलती रहती। दोबारा कोशिश करें, या पहले सब्सक्रिप्शन में जाकर बिलिंग रद्द करें।",
      internal: {
        title: "आंतरिक एरर",
        description: "सर्वर में आंतरिक एरर हुआ",
        detail: "आपका अकाउंट हटाया नहीं जा सका: {{error}} (यूज़र {{userId}})",
        retry:
          "आपका अकाउंट हटाया नहीं जा सका। दोबारा कोशिश करें। बार-बार विफल हो तो सपोर्ट से संपर्क करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
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
    newsletter: {
      title: "न्यूज़लेटर",
      subtitle:
        "आपके इनबॉक्स में अपडेट, साथ में हर महीने {{bonusCredits}} एक्स्ट्रा फ़्री क्रेडिट",
      subtitleNeutral: "नए मॉडल और प्रोडक्ट ड्रॉप, सीधे आपके इनबॉक्स में",
    },
    loadState: {
      loading: "लोड हो रहा है...",
      profileFailed: "आपकी प्रोफ़ाइल लोड नहीं हुई।",
      creditsFailed: "बैलेंस लोड नहीं हुआ। दोबारा कोशिश के लिए टैप करें।",
      retry: "दोबारा कोशिश करें",
    },
    save: "प्रोफ़ाइल सेव करें",
    saving: "सेव हो रहा है...",
    editProfile: "प्रोफ़ाइल एडिट करें",
    changePhoto: "फ़ोटो बदलें",
    cancelEdit: "रद्द करें",
    memberSince: "सदस्य बने",
    stats: {
      plan: "प्लान",
      credits: "क्रेडिट",
      member: "सदस्य बने",
    },
    profileCard: {
      title: "क्रिएटर प्रोफ़ाइल",
      description: "पूरे प्लेटफ़ॉर्म पर आपकी पब्लिक पहचान",
    },
    socialCard: {
      title: "सोशल लिंक",
      description: "अपने प्लेटफ़ॉर्म जोड़ें",
    },
    emailCard: {
      title: "आपकी ईमेल लिस्ट",
      description:
        "अपने स्किल और प्रोफ़ाइल से सब्सक्राइबर जुटाएँ। आपकी लिस्ट, बीच में कोई नहीं।",
      manage: "मैनेज करें",
    },
    previewCard: {
      title: "आपकी पब्लिक प्रोफ़ाइल",
      description: "दूसरों को आप कैसे दिखते हैं",
    },
    noPreview: "प्रीव्यू देखने के लिए अपनी प्रोफ़ाइल भरें",
    noSocials: "अभी तक कोई सोशल लिंक नहीं जोड़ा",
    viewPublicProfile: "पब्लिक प्रोफ़ाइल देखें",
    profileUrl: "आपका लिंक",
    verifyNudge: {
      title: "अपना ईमेल कन्फ़र्म करें",
      description:
        "हमने {{email}} पर लिंक भेजा है। चैट दोनों हालत में चलती है। कन्फ़र्म करने से आपका अकाउंट रिकवर किया जा सकता है।",
      action: "लिंक दोबारा भेजें",
    },
    pendingEmail: {
      title: "ईमेल बदलाव आपके इंतज़ार में है",
      description:
        "{{email}} पर भेजे लिंक पर क्लिक करें। तब तक आप {{current}} से लॉग इन करेंगे। लिंक दोबारा भेजने के लिए फिर सेव करें, या रद्द करने के लिए अपना मौजूदा एड्रेस सेव करें।",
    },
    slugWarning: "यह URL बदलने पर आपकी प्रोफ़ाइल के मौजूदा लिंक काम करना बंद कर देंगे।",
    bioPreview: "प्रीव्यू",
    bioEdit: "एडिट करें",
    skills: {
      title: "मेरे स्किल",
      chat: "अभी चैट करें",
      add: "अपने कलेक्शन में जोड़ें",
      public: "कम्युनिटी",
      showLess: "कम दिखाएँ",
      hubSubtitle: "{{count}} पब्लिश",
    },
    appearance: {
      title: "दिखावट",
      sectionHint: "ऐप कैसा दिखता और पढ़ा जाता है।",
      theme: "थीम",
      themeHint: "लाइट, डार्क, या डिवाइस के हिसाब से। हर जगह लागू होती है।",
      light: "लाइट",
      dark: "डार्क",
      system: "सिस्टम",
      language: "भाषा",
      languageHint: "इंटरफ़ेस और कंटेंट की भाषा।",
    },
    chatPrefs: {
      title: "चैट",
      sectionHint: "असिस्टेंट के काम करने का तरीका सेट करें।",
      searchProvider: "वेब सर्च",
      searchProviderHint: "आपकी सर्चेज़ का जवाब कौन सा इंजन दे।",
      automation: "बैकग्राउंड ऑटोमेशन",
      automationHint: "आपके दूर रहने पर भी AI को काम करने दें।",
      on: "चालू",
      off: "बंद",
    },
    nav: {
      logoutHint: "इस डिवाइस पर साइन आउट करें",
      logout: "लॉग आउट करें",
      back: "वापस",
    },
    sections: {
      account: "अकाउंट",
      accountHint: "प्लान, बिलिंग, सिक्योरिटी और आपका डेटा।",
      billingHint: "प्लान, क्रेडिट और सेव किए एड्रेस।",
      security: "सिक्योरिटी",
      securityHint: "अपना अकाउंट सुरक्षित रखें।",
      data: "डेटा और प्राइवेसी",
      dataHint: "आपका डेटा, आपका फ़ैसला।",
      creatorHint: "अपनी ऑडियंस और कमाई बढ़ाएँ।",
      basics: "बेसिक्स",
      basicsHint: "आपका नाम, लॉगिन ईमेल और अपडेट।",
      subscription: "सब्सक्रिप्शन",
      subscriptionHint: "मासिक क्रेडिट के लिए सब्सक्राइब करें।",
      manageSubscription: "मैनेज करें",
      noSubscription: "फ़्री प्लान",
      upgrade: "अपग्रेड करें",
      addresses: "बिलिंग एड्रेस",
      addressCount: "{{count}} सेव हैं",
      addAddress: "एड्रेस जोड़ें",
      manageAddresses: "मैनेज करें",
      noAddresses: "कोई सेव नहीं",
      billing: "बिलिंग",
      delivery: "डिलीवरी",
      edit: "एडिट करें",
      credits: "क्रेडिट",
      creditsAvailable: "उपलब्ध",
      password: "पासवर्ड",
      passwordHint: "अपना पासवर्ड बदलें",
      sessions: "एक्टिव सेशन",
      emailVerification: "ईमेल वेरिफ़िकेशन",
      emailVerifiedHint: "आपका एड्रेस कन्फ़र्म है",
      emailUnverifiedHint: "अपना एड्रेस कन्फ़र्म करें। लिंक दोबारा भेजने के लिए टैप करें",
      verified: "वेरिफ़ाइड",
      unverified: "अनवेरिफ़ाइड",
      twoFactor: "टू-फ़ैक्टर ऑथेंटिकेशन",
      twoFactorHint: "साइन इन पर ऐप कोड ज़रूरी करें",
      on: "चालू",
      off: "बंद",
      sessionsHint: "हर डिवाइस देखें और उन्हें साइन आउट करें",
      apiKeys: "API keys",
      apiKeysHint: "आपके कोड, Codex या Claude Code में {{modelCount}} मॉडल",
      exportData: "मेरा डेटा एक्सपोर्ट करें",
      exportDataHint: "हमारे पास आपका जो भी डेटा है उसकी कॉपी डाउनलोड करें",
      creator: "क्रिएटर",
      referral: "रेफ़रल प्रोग्राम",
      referralHint: "आपके लाए हर पेमेंट पर कमाएँ",
    },
    deleteAccount: {
      dangerZone: "डेंजर ज़ोन",
      dangerDescription: "हमेशा के लिए ख़त्म: प्रोफ़ाइल, चैट, स्किल, फ़ाइलें, क्रेडिट।",
      button: "अकाउंट हटाएँ",
      confirmTitle: "अपना अकाउंट हमेशा के लिए हटाएँ",
      confirmDescription:
        "इससे आपका अकाउंट और उससे जुड़ा सारा डेटा हमेशा के लिए हट जाएगा। रिकवरी नहीं। वापस नहीं होगा।",
      confirmLabel: 'Type "DELETE" to confirm',
      confirmPlaceholder: "DELETE",
      confirmButton: "मेरा अकाउंट हमेशा के लिए हटाएँ",
      cancelButton: "रद्द करें",
      whatGetsDeleted: "क्या-क्या हटेगा:",
      items: {
        profile: "आपकी प्रोफ़ाइल और सभी सेटिंग्स",
        chats: "सारी चैट हिस्ट्री और थ्रेड",
        skills: "सभी कस्टम स्किल और कॉन्फ़िगरेशन",
        files: "सारी cortex फ़ाइलें और मेमोरी",
        subscriptions: "एक्टिव सब्सक्रिप्शन",
        credits: "बचे हुए क्रेडिट",
      },
      deleting: "हट रहा है...",
      success: "अकाउंट हट गया। रीडायरेक्ट हो रहा है...",
    },
  },

  avatar: {
    category: "यूज़र प्रोफ़ाइल",

    tag: "अवतार",
    errors: {
      user_not_found: "यूज़र नहीं मिला",
      failed_to_upload_avatar: "अवतार अपलोड नहीं हो सका",
      failed_to_delete_avatar: "अवतार हटाया नहीं जा सका",
      invalid_file_type: "फ़ाइल का प्रकार अमान्य है",
      file_too_large: "फ़ाइल बहुत बड़ी है",
    },
    debug: {
      uploadingUserAvatar: "यूज़र अवतार अपलोड हो रहा है",
      errorUploadingUserAvatar: "यूज़र अवतार अपलोड करने में एरर",
      deletingUserAvatar: "यूज़र अवतार हटाया जा रहा है",
      errorDeletingUserAvatar: "यूज़र अवतार हटाने में एरर",
    },
    success: {
      uploaded: "अवतार सफलतापूर्वक अपलोड हो गया",
      deleted: "अवतार सफलतापूर्वक हट गया",
      nextSteps: {
        visible: "आपका अवतार अब आपकी प्रोफ़ाइल पर दिख रहा है",
        update: "आप इसे कभी भी अपनी प्रोफ़ाइल सेटिंग्स से अपडेट कर सकते हैं",
        default: "आपकी प्रोफ़ाइल अब डिफ़ॉल्ट अवतार दिखा रही है",
        uploadNew: "आप नया अवतार कभी भी अपनी प्रोफ़ाइल सेटिंग्स से अपलोड कर सकते हैं",
      },
    },
    upload: {
      title: "अवतार अपलोड करें",
      description: "प्रोफ़ाइल अवतार इमेज अपलोड करें",
      groups: {
        fileUpload: {
          title: "फ़ाइल अपलोड",
          description: "अपनी अवतार इमेज चुनें और अपलोड करें",
        },
      },
      fields: {
        file: {
          label: "अवतार इमेज",
          description: "अपनी प्रोफ़ाइल अवतार के लिए इमेज फ़ाइल चुनें",
          placeholder: "इमेज फ़ाइल चुनें...",
          help: "इमेज फ़ाइल अपलोड करें (JPG, PNG, GIF), 5MB तक",
          validation: {
            maxSize: "फ़ाइल का साइज़ 5MB से कम होना चाहिए",
            imageOnly: "सिर्फ़ इमेज फ़ाइलें चलती हैं",
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
          description: "अपलोड की गई फ़ाइल अमान्य या ख़राब है",
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
          description: "आंतरिक सर्वर एरर हुआ",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "अपलोड के दौरान अनपेक्षित एरर हुआ",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपलोड के दौरान नेटवर्क एरर हुआ",
        },
        forbidden: {
          title: "प्रतिबंधित",
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
        title: "अवतार अपलोड हो गया",
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
          description: "अवतार हटाने की रिक्वेस्ट अमान्य है",
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
          description: "आंतरिक सर्वर एरर हुआ",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "हटाने के दौरान अनपेक्षित एरर हुआ",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "हटाने के दौरान नेटवर्क एरर हुआ",
        },
        forbidden: {
          title: "प्रतिबंधित",
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
    description: "अपने अकाउंट का पासवर्ड सुरक्षित तरीके से अपडेट करें",
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
        description: "आगे बढ़ने के लिए अपना मौजूदा पासवर्ड वेरिफ़ाई करें",
      },
      newCredentials: {
        title: "नया पासवर्ड",
        description: "अपने अकाउंट के लिए मज़बूत नया पासवर्ड चुनें",
      },
    },
    currentPassword: {
      label: "मौजूदा पासवर्ड",
      description: "अपना मौजूदा पासवर्ड लिखें",
      placeholder: "मौजूदा पासवर्ड लिखें",
      help: "बदलने से पहले अपनी पहचान वेरिफ़ाई करने के लिए मौजूदा पासवर्ड लिखें",
    },
    newPassword: {
      label: "नया पासवर्ड",
      description: "अपना नया पासवर्ड लिखें (कम से कम 8 अक्षर)",
      placeholder: "नया पासवर्ड लिखें",
      help: "कम से कम 8 अक्षर का मज़बूत पासवर्ड चुनें, जिसमें अक्षर, संख्याएँ और सिंबल हों",
    },
    confirmPassword: {
      label: "पासवर्ड कन्फ़र्म करें",
      description: "अपना नया पासवर्ड कन्फ़र्म करें",
      placeholder: "नया पासवर्ड कन्फ़र्म करें",
      help: "सही टाइप हुआ है यह पक्का करने के लिए नया पासवर्ड दोबारा लिखें",
    },
    twoFactorCode: {
      label: "टू-फ़ैक्टर कोड",
      description: "अगर चालू है तो अपना टू-फ़ैक्टर ऑथेंटिकेशन कोड लिखें",
      placeholder: "2FA कोड लिखें",
    },
    response: {
      title: "पासवर्ड बदलने का रिस्पॉन्स",
      description: "पासवर्ड बदलने के ऑपरेशन का रिस्पॉन्स",
      success: "पासवर्ड बदल गया",
      message: "स्टेटस मैसेज",
      securityTip: "सिक्योरिटी टिप",
      nextSteps: {
        item: "अगले कदम",
      },
    },
    validation: {
      currentPassword: {
        minLength: "मौजूदा पासवर्ड कम से कम 8 अक्षर का होना चाहिए",
      },
      newPassword: {
        minLength: "नया पासवर्ड कम से कम 8 अक्षर का होना चाहिए",
      },
      confirmPassword: {
        minLength: "पासवर्ड कन्फ़र्मेशन कम से कम 8 अक्षर का होना चाहिए",
      },
      passwords: {
        mismatch: "पासवर्ड मेल नहीं खाते",
      },
    },
    errors: {
      passwords_do_not_match: "पासवर्ड मेल नहीं खाते",
      user_not_found: "यूज़र नहीं मिला",
      incorrect_password: "ग़लत पासवर्ड",
      update_failed: "पासवर्ड अपडेट नहीं हो सका",
      token_creation_failed: "पासवर्ड टोकन नहीं बन सका",
      two_factor_code_required: "टू-फ़ैक्टर ऑथेंटिकेशन कोड ज़रूरी है",
      invalid_two_factor_code: "टू-फ़ैक्टर ऑथेंटिकेशन कोड ग़लत है",
      invalid_request: {
        title: "अमान्य रिक्वेस्ट",
        description: "पासवर्ड बदलने की रिक्वेस्ट अमान्य है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें और दोबारा कोशिश करें",
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
        title: "अज्ञात एरर",
        description: "पासवर्ड अपडेट करते समय अनपेक्षित एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन विफल रहा",
      },
      forbidden: {
        title: "एक्सेस प्रतिबंधित है",
        description: "आपको यह कार्रवाई करने की अनुमति नहीं है",
      },
      notFound: {
        title: "यूज़र नहीं मिला",
        description: "यूज़र अकाउंट नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं और खो जाएँगे",
      },
      conflict: {
        title: "डेटा में टकराव",
        description: "पासवर्ड अपडेट करते समय टकराव हुआ",
      },
    },
    success: {
      updated: "पासवर्ड सफलतापूर्वक अपडेट हो गया",
      securityTip: "बेहतर सुरक्षा के लिए टू-फ़ैक्टर ऑथेंटिकेशन चालू करें",
      nextSteps: {
        logoutOther: "सुरक्षा के लिए बाकी सभी सेशन लॉग आउट कर दिए गए हैं",
        enable2fa: "बेहतर सुरक्षा के लिए टू-फ़ैक्टर ऑथेंटिकेशन चालू करने पर विचार करें",
      },
      title: "पासवर्ड अपडेट हो गया",
      description: "आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है",
    },
    update: {
      success: {
        title: "पासवर्ड अपडेट हो गया",
        description: "आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है",
      },
      errors: {
        unknown: {
          title: "अज्ञात एरर",
          description: "पासवर्ड अपडेट करते समय अनपेक्षित एरर हुआ",
        },
      },
    },
  },
  addresses: {
    category: "यूज़र एड्रेस",
    tag: "addresses",

    list: {
      title: "मेरे एड्रेस",
      description: "अपने सेव किए एड्रेस देखें",
      response: {
        addresses: "एड्रेस",
      },
      widget: {
        addAddress: "एड्रेस जोड़ें",
        edit: "एडिट करें",
        delete: "हटाएँ",
        billing: "बिलिंग",
        delivery: "डिलीवरी",
        empty: "कोई एड्रेस सेव नहीं है",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "अमान्य रिक्वेस्ट",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "प्रतिबंधित", description: "एक्सेस प्रतिबंधित है" },
        notFound: { title: "नहीं मिला", description: "कोई एड्रेस नहीं मिला" },
        conflict: { title: "टकराव", description: "डेटा में टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुआ",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव हैं",
        },
        internal: {
          title: "सर्वर एरर",
          description: "सर्वर में आंतरिक एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर हुआ",
        },
      },
      success: { title: "सफल", description: "एड्रेस मिल गए" },
    },

    create: {
      title: "एड्रेस जोड़ें",
      description: "अपने अकाउंट में नया एड्रेस सेव करें",
      fields: {
        label: {
          label: "लेबल",
          description: "इस एड्रेस को नाम दें (जैसे घर, ऑफ़िस)",
          placeholder: "घर",
        },
        fullName: {
          label: "पूरा नाम",
          description: "इस एड्रेस के लिए संपर्क का नाम",
          placeholder: "Jane Doe",
        },
        company: {
          label: "कंपनी",
          description: "कंपनी का नाम (वैकल्पिक)",
          placeholder: "Acme Corp",
        },
        phone: {
          label: "फ़ोन",
          description: "संपर्क का फ़ोन नंबर",
          placeholder: "+1 555 000 0000",
        },
        vatNumber: {
          label: "VAT नंबर",
          description: "EU VAT रजिस्ट्रेशन नंबर",
          placeholder: "DE123456789",
        },
        taxId: {
          label: "टैक्स ID",
          description: "राष्ट्रीय टैक्स आइडेंटिफ़ायर",
          placeholder: "123-45-6789",
        },
        addressLine1: {
          label: "एड्रेस लाइन 1",
          description: "सड़क और नंबर",
          placeholder: "123 Main St",
        },
        addressLine2: {
          label: "एड्रेस लाइन 2",
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
          label: "पिन कोड",
          description: "ZIP या पिन कोड",
          placeholder: "10115",
        },
        country: {
          label: "देश",
          description: "ISO 3166-1 alpha-2 देश कोड",
          placeholder: "DE",
        },
        isDefaultBilling: {
          label: "डिफ़ॉल्ट बिलिंग",
          description: "डिफ़ॉल्ट बिलिंग एड्रेस के रूप में इस्तेमाल करें",
        },
        isDefaultDelivery: {
          label: "डिफ़ॉल्ट डिलीवरी",
          description: "डिफ़ॉल्ट डिलीवरी एड्रेस के रूप में इस्तेमाल करें",
        },
      },
      response: {
        id: "एड्रेस ID",
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
        forbidden: { title: "प्रतिबंधित", description: "एक्सेस प्रतिबंधित है" },
        notFound: { title: "नहीं मिला", description: "यूज़र नहीं मिला" },
        conflict: { title: "टकराव", description: "डेटा में टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुआ",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव हैं",
        },
        internal: {
          title: "सर्वर एरर",
          description: "सर्वर में आंतरिक एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर हुआ",
        },
      },
      success: {
        title: "एड्रेस सेव हो गया",
        description: "एड्रेस आपके अकाउंट में जुड़ गया",
      },
      widget: {
        saved: "एड्रेस सेव हो गया।",
        backToAddresses: "एड्रेस पर वापस जाएँ",
      },
    },
  },
  emailChange: {
    subject: "{{appName}} के लिए अपना नया ईमेल कन्फ़र्म करें",
    title: "अपना नया ईमेल कन्फ़र्म करें",
    previewText: "एक क्लिक, और {{appName}} इस एड्रेस का इस्तेमाल करेगा।",
    greeting: "हैलो {{name}},",
    body: "आपने {{appName}} का लॉगिन इस एड्रेस पर बदलने को कहा था। कन्फ़र्म करने के लिए नीचे क्लिक करें। तब तक आपका अकाउंट {{current}} ही इस्तेमाल करता रहेगा।",
    button: "नया ईमेल कन्फ़र्म करें",
    expiry:
      "यह लिंक {{days}} दिन तक काम करता है। आपने यह नहीं माँगा था? इस ईमेल को नज़रअंदाज़ करें, कुछ नहीं बदलेगा।",
    signoff: "{{appName}} टीम",
    errors: {
      failed: "कन्फ़र्मेशन ईमेल नहीं बन सका।",
    },
    template: {
      name: "ईमेल बदलाव की पुष्टि",
      description: "यूज़र के ईमेल बदलने पर नए एड्रेस पर भेजा जाता है",
      category: "अकाउंट",
    },
  },
};
