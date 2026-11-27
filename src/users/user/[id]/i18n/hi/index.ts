import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र",
  tag: "यूज़र मैनेजमेंट",

  id: {
    roles: {
      post: {
        title: "यूज़र रोल जोड़ें",
        description: "किसी ख़ास यूज़र अकाउंट को रोल दें",
        container: {
          title: "रोल जोड़ें",
          description: "इस यूज़र को देने के लिए रोल चुनें",
        },
        id: {
          label: "यूज़र ID",
          description: "जिस यूज़र को रोल देना है उसकी यूनिक पहचान",
          placeholder: "यूज़र ID डालें...",
        },
        role: {
          label: "रोल",
          description: "यूज़र को दिया जाने वाला रोल",
          placeholder: "रोल चुनें...",
        },
        submit: {
          label: "रोल जोड़ें",
        },
        response: {
          roleId: {
            content: "रोल असाइनमेंट ID",
          },
          userId: {
            content: "यूज़र ID",
          },
          assignedRole: {
            content: "असाइन किया रोल",
          },
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "यूज़र रोल मैनेज करने के लिए आपका लॉग इन होना ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन फ़ेल हुआ",
            description: "सही यूज़र ID और रोल दें",
          },
          forbidden: {
            title: "एक्सेस मना है",
            description: "सिर्फ़ एडमिन यूज़र रोल मैनेज कर सकते हैं",
          },
          notFound: {
            title: "यूज़र नहीं मिला",
            description: "बताया गया यूज़र नहीं मिल सका",
          },
          conflict: {
            title: "रोल पहले से असाइन है",
            description: "इस यूज़र के पास ये रोल पहले से है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "सर्वर से कनेक्ट नहीं हो सका",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वो खो जाएँगे",
          },
          server: {
            title: "सर्वर एरर",
            description: "सर्वर एरर की वजह से रोल नहीं जुड़ सका",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "रोल जोड़ते समय कोई अनपेक्षित एरर आया",
          },
        },
        success: {
          title: "रोल जुड़ गया",
          description: "यूज़र को रोल सफलतापूर्वक दे दिया गया",
        },
      },
      delete: {
        title: "यूज़र रोल हटाएँ",
        description: "किसी ख़ास यूज़र अकाउंट से रोल वापस लें",
        container: {
          title: "रोल हटाएँ",
          description: "इस यूज़र से वापस लेने के लिए रोल चुनें",
        },
        id: {
          label: "यूज़र ID",
          description: "जिस यूज़र से रोल वापस लेना है उसकी यूनिक पहचान",
          placeholder: "यूज़र ID डालें...",
        },
        role: {
          label: "रोल",
          description: "यूज़र से वापस लिया जाने वाला रोल",
          placeholder: "रोल चुनें...",
        },
        submit: {
          label: "रोल हटाएँ",
        },
        response: {
          success: {
            content: "रोल हट गया",
          },
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "यूज़र रोल मैनेज करने के लिए आपका लॉग इन होना ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन फ़ेल हुआ",
            description: "सही यूज़र ID और रोल दें",
          },
          forbidden: {
            title: "एक्सेस मना है",
            description: "सिर्फ़ एडमिन यूज़र रोल मैनेज कर सकते हैं",
          },
          notFound: {
            title: "यूज़र नहीं मिला",
            description: "बताया गया यूज़र नहीं मिल सका",
          },
          conflict: {
            title: "टकराव एरर",
            description: "मौजूदा निर्भरताओं की वजह से रोल नहीं हट सका",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "सर्वर से कनेक्ट नहीं हो सका",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वो खो जाएँगे",
          },
          server: {
            title: "सर्वर एरर",
            description: "सर्वर एरर की वजह से रोल नहीं हट सका",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "रोल हटाते समय कोई अनपेक्षित एरर आया",
          },
        },
        success: {
          title: "रोल हट गया",
          description: "यूज़र से रोल सफलतापूर्वक वापस ले लिया गया",
        },
      },
    },
    get: {
      title: "यूज़र देखें",
      titleShort: "यूज़र का ब्योरा",
      description: "किसी ख़ास यूज़र की पूरी जानकारी पाएँ",
      container: {
        title: "यूज़र का ब्योरा",
        description: "यूज़र की पूरी जानकारी देखें",
      },
      id: {
        label: "यूज़र ID",
        description: "यूज़र की यूनिक पहचान",
        placeholder: "यूज़र ID डालें...",
      },
      response: {
        userProfile: {
          title: "यूज़र प्रोफ़ाइल",
          description: "यूज़र प्रोफ़ाइल की पूरी जानकारी",
          basicInfo: {
            title: "बुनियादी जानकारी",
            description: "यूज़र की मुख्य जानकारी",
            id: {
              content: "यूज़र ID",
            },
            email: {
              content: "ईमेल पता",
            },
            privateName: {
              content: "निजी नाम",
            },
            publicName: {
              content: "पब्लिक नाम",
            },
            firstName: {
              content: "पहला नाम",
            },
            lastName: {
              content: "अंतिम नाम",
            },
            company: {
              content: "कंपनी",
            },
          },
          contactDetails: {
            title: "संपर्क विवरण",
            description: "यूज़र की संपर्क जानकारी",
            phone: {
              content: "फ़ोन नंबर",
            },
            preferredContactMethod: {
              content: "पसंदीदा संपर्क तरीका",
            },
            website: {
              content: "वेबसाइट",
            },
          },
        },
        profileDetails: {
          title: "प्रोफ़ाइल का ब्योरा",
          description: "प्रोफ़ाइल की अतिरिक्त जानकारी",
          imageUrl: {
            content: "प्रोफ़ाइल इमेज",
          },
          bio: {
            content: "बायो",
          },
          jobTitle: {
            content: "जॉब टाइटल",
          },
          leadId: {
            content: "जुड़ी लीड ID",
          },
        },
        accountStatus: {
          title: "अकाउंट स्टेटस",
          description: "यूज़र अकाउंट की स्टेटस जानकारी",
          isActive: {
            content: "एक्टिव स्टेटस",
          },
          emailVerified: {
            content: "ईमेल वेरिफ़ाइड",
          },
          stripeCustomerId: {
            content: "Stripe कस्टमर ID",
          },
          userRoles: {
            content: "यूज़र रोल",
          },
        },
        timestamps: {
          title: "टाइमस्टैम्प",
          description: "बनाने और अपडेट के टाइमस्टैम्प",
          createdAt: {
            content: "बनाने का समय",
          },
          updatedAt: {
            content: "अपडेट का समय",
          },
        },
        referralInfo: {
          title: "रेफ़रल जानकारी",
          description: "रेफ़रल चेन और कमाई",
          referredByUserId: {
            content: "किसने रेफ़र किया (यूज़र ID)",
          },
          referredByCode: {
            content: "इस्तेमाल हुआ रेफ़रल कोड",
          },
          totalReferrals: {
            content: "रेफ़र किए गए यूज़र",
          },
          totalEarnedCents: {
            content: "कुल कमाई (सेंट)",
          },
          confirmedEarnedCents: {
            content: "पक्की कमाई (सेंट)",
          },
          pendingEarnedCents: {
            content: "पेंडिंग कमाई (सेंट)",
          },
        },
        engagement: {
          title: "क्रेडिट और एंगेजमेंट",
          description: "बैलेंस, ख़र्च, कमाई और गतिविधि",
          creditBalance: {
            content: "क्रेडिट बैलेंस",
          },
          freeAllowance: {
            content: "फ़्री अलाउंस",
          },
          lifetimeCreditsSpent: {
            content: "कुल ख़र्च",
          },
          favoritesCount: {
            content: "पसंदीदा",
          },
          customSkillsCount: {
            content: "कस्टम स्किल",
          },
          newsletterConsent: {
            content: "न्यूज़लेटर सहमति",
          },
          hasConfirmedNewsletter: {
            content: "न्यूज़लेटर कन्फ़र्म",
          },
          paymentsCount: {
            content: "पेमेंट",
          },
          creditEntriesCount: {
            content: "क्रेडिट एंट्री",
          },
          threadsCount: {
            content: "थ्रेड",
          },
        },
        leadId: {
          content: "जुड़ी लीड ID",
        },
        email: {
          content: "ईमेल पता",
        },
        privateName: {
          content: "निजी नाम",
        },
        publicName: {
          content: "पब्लिक नाम",
        },
        firstName: {
          content: "पहला नाम",
        },
        lastName: {
          content: "अंतिम नाम",
        },
        company: {
          content: "कंपनी",
        },
        phone: {
          content: "फ़ोन नंबर",
        },
        preferredContactMethod: {
          content: "पसंदीदा संपर्क तरीका",
        },
        imageUrl: {
          content: "प्रोफ़ाइल इमेज",
        },
        bio: {
          content: "बायो",
        },
        website: {
          content: "वेबसाइट",
        },
        jobTitle: {
          content: "जॉब टाइटल",
        },
        emailVerified: {
          content: "ईमेल वेरिफ़ाइड",
        },
        isActive: {
          content: "एक्टिव स्टेटस",
        },
        stripeCustomerId: {
          content: "Stripe कस्टमर ID",
        },
        userRoles: {
          content: "यूज़र रोल",
        },
        createdAt: {
          content: "बनाने का समय",
        },
        updatedAt: {
          content: "अपडेट का समय",
        },
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत एक्सेस",
          description: "यूज़र का ब्योरा देखने के लिए आपका लॉग इन होना ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "गलत यूज़र ID दी गई",
        },
        forbidden: {
          title: "एक्सेस मना है",
          description: "आपके पास ये यूज़र देखने की अनुमति नहीं है",
        },
        notFound: {
          title: "यूज़र नहीं मिला",
          description: "माँगा गया यूज़र नहीं मिल सका",
          detail: "ID {{userId}} वाला कोई यूज़र नहीं मिला।",
        },
        conflict: {
          title: "टकराव एरर",
          description: "मौजूदा टकराव की वजह से यूज़र नहीं मिल सका",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वो खो जाएँगे",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर एरर की वजह से यूज़र नहीं मिल सका",
          detail: "ये यूज़र लोड नहीं हो सका: {{error}}",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "यूज़र पाते समय कोई अनपेक्षित एरर आया",
        },
      },
      success: {
        title: "यूज़र सफलतापूर्वक मिल गया",
        description: "यूज़र का ब्योरा मिल गया",
      },
    },
    put: {
      title: "यूज़र अपडेट करें",
      titleShort: "यूज़र अपडेट करें",
      description: "यूज़र की जानकारी और प्रोफ़ाइल का ब्योरा अपडेट करें",
      container: {
        title: "यूज़र अपडेट करें",
        description: "यूज़र की जानकारी और सेटिंग्स बदलें",
      },
      id: {
        label: "यूज़र ID",
        description: "अपडेट करने वाले यूज़र की यूनिक पहचान",
        placeholder: "यूज़र ID डालें...",
      },
      sections: {
        basicInfo: {
          title: "बुनियादी जानकारी",
          description: "बुनियादी यूज़र जानकारी अपडेट करें",
        },
        contactInfo: {
          title: "संपर्क जानकारी",
          description: "संपर्क विवरण अपडेट करें",
        },
        profileDetails: {
          title: "प्रोफ़ाइल का ब्योरा",
          description: "प्रोफ़ाइल की अतिरिक्त जानकारी अपडेट करें",
        },
        adminSettings: {
          title: "एडमिन सेटिंग्स",
          description: "एडमिन सेटिंग्स अपडेट करें",
        },
      },
      email: {
        label: "ईमेल पता",
        description: "लॉगिन और संपर्क के लिए यूज़र का ईमेल पता",
        placeholder: "ईमेल पता डालें...",
      },
      privateName: {
        label: "निजी नाम",
        description: "यूज़र का पूरा कानूनी नाम (सिर्फ़ एडमिन को दिखता है)",
      },
      publicName: {
        label: "पब्लिक नाम",
        description: "यूज़र का डिस्प्ले नाम (सबको दिखता है)",
      },
      firstName: {
        label: "पहला नाम",
        description: "यूज़र का पहला नाम",
        placeholder: "पहला नाम डालें...",
      },
      lastName: {
        label: "अंतिम नाम",
        description: "यूज़र का अंतिम नाम",
        placeholder: "अंतिम नाम डालें...",
      },
      company: {
        label: "कंपनी",
        description: "यूज़र की कंपनी या संस्था",
        placeholder: "कंपनी का नाम डालें...",
      },
      phone: {
        label: "फ़ोन नंबर",
        description: "यूज़र का संपर्क फ़ोन नंबर",
        placeholder: "फ़ोन नंबर डालें...",
      },
      preferredContactMethod: {
        label: "पसंदीदा संपर्क तरीका",
        description: "यूज़र से किस तरीके से संपर्क करना पसंद है",
      },
      bio: {
        label: "बायो",
        description: "यूज़र के बारे में संक्षिप्त विवरण",
        placeholder: "बायो डालें...",
      },
      website: {
        label: "वेबसाइट",
        description: "यूज़र की निजी या कंपनी वेबसाइट",
        placeholder: "वेबसाइट URL डालें...",
      },
      jobTitle: {
        label: "जॉब टाइटल",
        description: "यूज़र का जॉब टाइटल या पद",
        placeholder: "जॉब टाइटल डालें...",
      },
      emailVerified: {
        label: "ईमेल वेरिफ़ाइड",
        description: "यूज़र का ईमेल वेरिफ़ाइड है या नहीं",
      },
      isActive: {
        label: "एक्टिव स्टेटस",
        description: "यूज़र अकाउंट एक्टिव है या नहीं",
      },
      leadId: {
        label: "लीड ID",
        description: "जुड़ी लीड की पहचान",
        placeholder: "लीड ID डालें...",
      },
      isBanned: {
        label: "बैन",
        description: "यूज़र प्लेटफ़ॉर्म से बैन है या नहीं",
      },
      bannedReason: {
        label: "बैन की वजह",
        description: "यूज़र को बैन करने की वजह",
      },
      response: {
        leadId: {
          content: "जुड़ी लीड ID",
        },
        email: {
          content: "ईमेल पता",
        },
        privateName: {
          content: "निजी नाम",
        },
        publicName: {
          content: "पब्लिक नाम",
        },
        firstName: {
          content: "पहला नाम",
        },
        lastName: {
          content: "अंतिम नाम",
        },
        company: {
          content: "कंपनी",
        },
        phone: {
          content: "फ़ोन नंबर",
        },
        preferredContactMethod: {
          content: "पसंदीदा संपर्क तरीका",
        },
        imageUrl: {
          content: "प्रोफ़ाइल इमेज",
        },
        bio: {
          content: "बायो",
        },
        website: {
          content: "वेबसाइट",
        },
        jobTitle: {
          content: "जॉब टाइटल",
        },
        emailVerified: {
          content: "ईमेल वेरिफ़ाइड",
        },
        isActive: {
          content: "एक्टिव स्टेटस",
        },
        stripeCustomerId: {
          content: "Stripe कस्टमर ID",
        },
        userRoles: {
          content: "यूज़र रोल",
        },
        createdAt: {
          content: "बनाने का समय",
        },
        updatedAt: {
          content: "अपडेट का समय",
        },
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत एक्सेस",
          description: "यूज़र अपडेट करने के लिए आपका लॉग इन होना ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "फ़ॉर्म का डेटा जाँचें और दोबारा कोशिश करें",
        },
        forbidden: {
          title: "एक्सेस मना है",
          description: "आपके पास ये यूज़र अपडेट करने की अनुमति नहीं है",
        },
        notFound: {
          title: "यूज़र नहीं मिला",
          description: "अपडेट करने वाला यूज़र नहीं मिल सका",
          detail: "ID {{userId}} वाला कोई यूज़र नहीं मिला।",
        },
        conflict: {
          title: "अपडेट में टकराव",
          description: "यूज़र का डेटा मौजूदा रिकॉर्ड से टकराता है",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर एरर की वजह से यूज़र अपडेट नहीं हो सका",
          detail: "इस यूज़र के बदलाव सेव नहीं हो सके: {{error}}",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "यूज़र अपडेट करते समय कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वो खो जाएँगे",
        },
      },
      success: {
        title: "यूज़र सफलतापूर्वक अपडेट हो गया",
        description: "यूज़र की जानकारी सफलतापूर्वक अपडेट हो गई",
      },
    },
    delete: {
      title: "यूज़र हटाएँ",
      titleShort: "यूज़र हटाएँ",
      description: "यूज़र अकाउंट हमेशा के लिए हटाएँ",
      container: {
        title: "यूज़र हटाएँ",
        description: "यूज़र को सिस्टम से हमेशा के लिए हटाएँ",
      },
      id: {
        label: "यूज़र ID",
        description: "हटाने वाले यूज़र की यूनिक पहचान",
        placeholder: "यूज़र ID डालें...",
        helpText: "चेतावनी: ये कार्रवाई वापस नहीं हो सकती",
      },
      submitButton: {
        label: "अकाउंट हटाएँ",
        loadingText: "हटाया जा रहा है...",
      },
      response: {
        deletionResult: {
          title: "हटाने का नतीजा",
          description: "हटाने की कार्रवाई का नतीजा",
          success: {
            content: "हटाना सफल",
          },
          message: {
            content: "हटाने का मैसेज",
          },
          deletedAt: {
            content: "हटाने का समय",
          },
        },
        success: {
          content: "हटाना सफल",
        },
        message: {
          content: "हटाने का मैसेज",
        },
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत एक्सेस",
          description: "यूज़र हटाने के लिए आपका लॉग इन होना ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "हटाने के लिए गलत यूज़र ID दी गई",
        },
        forbidden: {
          title: "एक्सेस मना है",
          description: "आपके पास यूज़र हटाने की अनुमति नहीं है",
        },
        notFound: {
          title: "यूज़र नहीं मिला",
          description: "हटाने वाला यूज़र नहीं मिल सका",
          detail: "ID {{userId}} वाला कोई यूज़र नहीं मिला।",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर एरर की वजह से यूज़र नहीं हट सका",
          detail: "ये यूज़र हट नहीं सका: {{error}}",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "यूज़र हटाते समय कोई अनपेक्षित एरर आया",
        },
        conflict: {
          title: "टकराव एरर",
          description: "मौजूदा निर्भरताओं की वजह से यूज़र नहीं हट सका",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वो खो जाएँगे",
        },
      },
      success: {
        title: "यूज़र सफलतापूर्वक हट गया",
        description: "यूज़र हटा दिया गया",
      },
    },
    widget: {
      userProfile: "यूज़र प्रोफ़ाइल",
      active: "एक्टिव",
      inactive: "निष्क्रिय",
      leadId: "लीड ID",
      viewLead: "लीड देखें",
      created: "जुड़े",
      lastUpdated: "आख़िरी अपडेट",
      relatedRecords: "संबंधित रिकॉर्ड",
      relatedPayments: "पेमेंट",
      relatedThreadActivity: "थ्रेड गतिविधि",
      confirmBan: "{{name}} का अकाउंट एक्सेस ब्लॉक करें?",
      confirmUnban: "{{name}} का अकाउंट एक्सेस बहाल करें?",
      editAccountNamed: "{{name}} एडिट करें",
      saveAccount: "बदलाव सेव करें",
      fullProfile: "पूरी प्रोफ़ाइल खोलें",
      referrals: "रेफ़रल",
      subscription: "सब्सक्रिप्शन",
      creditHistory: "क्रेडिट हिस्ट्री",
      identifiers: "टेक्निकल ब्योरा",
      engagementTitle: "क्रेडिट और गतिविधि",
      balance: "क्रेडिट बैलेंस",
      freeAllowance: "फ़्री क्रेडिट अलाउंस",
      lifetimeSpend: "ख़र्च हुए क्रेडिट",
      earned: "रेफ़रल कमाई",
      earnedPending: "पेंडिंग:",
      referred: "रेफ़र किए यूज़र",
      favorites: "पसंदीदा",
      skills: "स्किल",
      newsletter: "न्यूज़लेटर",
      newsletterConfirmed: "कन्फ़र्म",
      newsletterConsent: "सहमत",
      newsletterNone: "कोई नहीं",
      deleteUser: "यूज़र हटाएँ",
      userDeletedSuccessfully: "यूज़र सफलतापूर्वक हट गया",
      deletedAt: "हटाने का समय",
      dangerZone: "डेंजर ज़ोन",
      deleteAccountHint: "{{name}} का अकाउंट हमेशा के लिए हटाएँ।",
      cancelDeletion: "रद्द करें",
      confirmDeletion: "हटाने की पुष्टि करें",
      confirmDeletionMessage:
        "इस अकाउंट को हटाना स्थायी है। आप इसे वापस नहीं ला सकते।",
      titleReferralCodes: "रेफ़रल कोड और स्टैट्स देखें",
      titleSubscription: "सब्सक्रिप्शन देखें",
      copyLeadId: "लीड ID कॉपी करें",
      noEarnings: "अभी कोई नहीं",
      earningUnitsUnavailable: "कमाई का ब्रेकडाउन उपलब्ध नहीं",
      titleCopyUserId: "यूज़र ID कॉपी करें",
      creditsAmount: "{{count}} क्रेडिट",
      freeAllowanceHint: "फ़्री अलाउंस: महीने के {{count}} क्रेडिट",
      moreActions: "और",
      editAccount: "अकाउंट एडिट करें",
      deleteAccount: "अकाउंट हटाएँ",
      deleteDialogTitle: "{{name}} का अकाउंट हटाएँ?",
      accountTitle: "अकाउंट",
      publicName: "पब्लिक नाम",
      roles: "रोल",
      savedItems: "सेव किए आइटम",
      savedItemsValue: "{{favorites}} पसंदीदा, {{skills}} स्किल",
      userId: "यूज़र ID",
      stripeCustomer: "Stripe कस्टमर",
    },
    getCrm: {
      get: {
        title: "यूज़र CRM प्रोफ़ाइल पाएँ",
        titleShort: "CRM प्रोफ़ाइल",
        description: "किसी यूज़र के बिलिंग फ़ील्ड और नोट की गिनती पाएँ",
        fields: {
          userId: {
            label: "यूज़र ID",
            description: "जिस यूज़र को खोजना है",
            placeholder: "यूज़र UUID",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "गलत यूज़र ID",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "आपका लॉग इन होना ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "आपके पास इस यूज़र का CRM डेटा देखने का एक्सेस नहीं है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "यूज़र नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "टकराव हो गया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं",
          },
          internal: {
            title: "इंटरनल एरर",
            description: "सर्वर एरर। दोबारा कोशिश करें।",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
        },
        success: {
          title: "CRM प्रोफ़ाइल लोड हो गई",
          description: "यूज़र का CRM डेटा मिल गया",
        },
        widget: {
          addNote: "नोट जोड़ें",
          viewNotes: "नोट देखें",
        },
        response: {
          id: "यूज़र ID",
          email: "ईमेल",
          privateName: "नाम",
          companyBillingName: "कंपनी / बिलिंग नाम",
          vatNumber: "VAT नंबर",
          taxId: "टैक्स ID",
          phone: "फ़ोन",
          addressLine1: "पता लाइन 1",
          addressLine2: "पता लाइन 2",
          city: "शहर",
          region: "क्षेत्र",
          postalCode: "पिन कोड",
          billingCountry: "देश",
          defaultCurrency: "डिफ़ॉल्ट करेंसी",
          paymentTermsDays: "पेमेंट की शर्तें (दिन)",
          notesCount: "कुल नोट",
        },
      },
      tag: "CRM",
    },
    notesCreate: {
      post: {
        title: "यूज़र नोट बनाएँ",
        titleShort: "नोट बनाएँ",
        description:
          "किसी यूज़र के लिए CRM नोट, कॉल लॉग, ईमेल रिकॉर्ड, मीटिंग या टास्क जोड़ें",
        fields: {
          userId: {
            label: "यूज़र",
            description: "जिस यूज़र के बारे में ये नोट है",
            placeholder: "यूज़र चुनें",
          },
          type: {
            label: "गतिविधि का प्रकार",
            description: "ये किस तरह की बातचीत दर्ज करता है",
            placeholder: "टाइप चुनें",
          },
          content: {
            label: "कंटेंट",
            description: "गतिविधि का ब्योरा",
            placeholder: "क्या हुआ, लिखें...",
          },
          isPrivate: {
            label: "निजी",
            description: "निजी नोट सिर्फ़ आप देख सकते हैं",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "फ़ील्ड जाँचें और दोबारा कोशिश करें",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "आपका लॉग इन होना ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "आपके पास इस यूज़र का एक्सेस नहीं है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "यूज़र नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "टकराव हो गया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं",
          },
          internal: {
            title: "इंटरनल एरर",
            description: "सर्वर एरर। दोबारा कोशिश करें।",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
        },
        success: {
          title: "नोट बन गया",
          description: "नोट सेव हो गया",
        },
        widget: {
          created: "नोट बन गया",
          noteId: "नोट ID",
          backToNotes: "नोट पर वापस",
        },
        response: {
          id: "नोट ID",
          userId: "यूज़र ID",
          authorUserId: "लेखक ID",
          type: "टाइप",
          content: "कंटेंट",
          isPrivate: "निजी",
          createdAt: "बनाने का समय",
          updatedAt: "अपडेट का समय",
        },
      },
      tag: "CRM",
    },
    notesList: {
      get: {
        title: "यूज़र नोट की लिस्ट",
        titleShort: "यूज़र नोट",
        description:
          "किसी यूज़र के CRM नोट की लिस्ट, टाइप और विज़िबिलिटी से फ़िल्टर करें",
        fields: {
          userId: {
            label: "यूज़र ID",
            description: "किसके नोट दिखाने हैं",
            placeholder: "यूज़र UUID",
          },
          type: {
            label: "टाइप",
            description: "गतिविधि के प्रकार से फ़िल्टर करें",
            placeholder: "सभी टाइप",
          },
          isPrivate: {
            label: "सिर्फ़ निजी",
            description: "सिर्फ़ अपने निजी नोट दिखाएँ",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "फ़िल्टर जाँचें और दोबारा कोशिश करें",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "आपका लॉग इन होना ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "आपके पास ये नोट देखने का एक्सेस नहीं है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "यूज़र नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "टकराव हो गया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं",
          },
          internal: {
            title: "इंटरनल एरर",
            description: "सर्वर एरर। दोबारा कोशिश करें।",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
        },
        success: {
          title: "नोट लोड हो गए",
          description: "नोट सफलतापूर्वक मिल गए",
        },
        widget: {
          addNote: "नोट जोड़ें",
          total: "कुल",
          empty: "अभी कोई नोट नहीं",
          delete: "हटाएँ",
          private: "निजी",
          ago: "पहले",
        },
        response: {
          notes: "नोट्स",
          total: "कुल",
          note: {
            id: "नोट ID",
            userId: "यूज़र ID",
            authorUserId: "लेखक ID",
            type: "टाइप",
            content: "कंटेंट",
            isPrivate: "निजी",
            createdAt: "बनाने का समय",
            updatedAt: "अपडेट का समय",
          },
        },
      },
      tag: "CRM",
    },
    noteDelete: {
      post: {
        title: "यूज़र नोट हटाएँ",
        titleShort: "नोट हटाएँ",
        description: "CRM नोट हटाएँ। ये सिर्फ़ लेखक या एडमिन कर सकता है।",
        fields: {
          noteId: {
            label: "नोट ID",
            description: "हटाने वाला नोट",
            placeholder: "नोट UUID",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "गलत नोट ID",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "आपका लॉग इन होना ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "सिर्फ़ लेखक या एडमिन ये नोट हटा सकता है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "नोट नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "टकराव हो गया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं",
          },
          internal: {
            title: "इंटरनल एरर",
            description: "सर्वर एरर। दोबारा कोशिश करें।",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
        },
        success: {
          title: "नोट हट गया",
          description: "नोट हमेशा के लिए हटा दिया गया",
        },
        widget: {
          warning: "ये नोट हमेशा के लिए हट जाएगा।",
          deleted: "नोट हट गया।",
          backToNotes: "नोट पर वापस",
        },
        response: {
          deleted: "हटा दिया गया",
        },
      },
      tag: "CRM",
    },
  },
};
