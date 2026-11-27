import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  subscription: {
    title: "क्रेडिट और सब्सक्रिप्शन",
    description: "अपने क्रेडिट और मंथली सब्सक्रिप्शन मैनेज करें",
    backToChat: "चैट पर वापस जाएँ",
    billingInterval: "बिलिंग अवधि",
    currentPeriodStart: "मौजूदा अवधि की शुरुआत",
    nextBillingDate: "अगली बिलिंग तारीख",
    endsOn: "सब्सक्रिप्शन खत्म होगा",
    canceledOn: "रद्द किया गया",
    endedOn: "खत्म हुआ",
    cancellation: {
      title: "सब्सक्रिप्शन रद्द होने वाला है",
      description:
        "आपका सब्सक्रिप्शन {{date}} को खत्म होगा। तब तक आपका एक्सेस बना रहेगा।",
    },
    canceled: {
      title: "सब्सक्रिप्शन रद्द हो गया",
      description:
        "आपका सब्सक्रिप्शन रद्द हो गया है। मंथली क्रेडिट वापस पाने के लिए आप कभी भी दोबारा सब्सक्राइब कर सकते हैं।",
    },
    manage: {
      stripe: {
        button: "सब्सक्रिप्शन मैनेज करें",
      },
      nowpayments: {
        button: "सब्सक्रिप्शन की जानकारी देखें",
        info: "आपका सब्सक्रिप्शन ईमेल से मैनेज होता है। NOWPayments से आए पेमेंट लिंक और सब्सक्रिप्शन की जानकारी के लिए अपना इनबॉक्स देखें।",
      },
      portal: {
        error: "बिलिंग पोर्टल नहीं खुल पाया। दोबारा कोशिश करें।",
      },
    },
    balance: {
      title: "क्रेडिट बैलेंस",
      description: "{{modelCount}} मॉडल के साथ AI चैट के लिए आपके उपलब्ध क्रेडिट",
      credit: "{{count}} क्रेडिट",
      credits: "{{count}} क्रेडिट",
      nextExpiration: "अगली एक्सपायरी",
      expiring: {
        title: "सब्सक्रिप्शन क्रेडिट",
        description: "आपके मंथली प्लान से",
      },
      permanent: {
        title: "स्थायी क्रेडिट",
        description: "पैक में खरीदे गए क्रेडिट कभी एक्सपायर नहीं होते",
      },
      free: {
        title: "मंथली फ़्री क्रेडिट",
        description:
          "बिना अकाउंट: {{guest}} फ़्री क्रेडिट/महीना। फ़्री अकाउंट: {{signedIn}}/महीना। अकाउंट + न्यूज़लेटर: {{max}}/महीना।",
      },
      earned: {
        title: "कमाए गए क्रेडिट",
        description: "दोस्तों को बुलाकर कमाएँ →",
      },
    },
    overview: {
      howItWorks: {
        title: "क्रेडिट कैसे काम करते हैं",
        description:
          "हर मॉडल के लिए एक ही करेंसी। प्लान चुनें, टॉप अप करें, या फ़्री में शुरू करें।",
        expiring: {
          title: "मंथली प्लान",
          description:
            "{{minPrice}} से {{maxPrice}} प्रति महीना तक के प्लान, {{maxCredits}} क्रेडिट तक। सभी {{modelCount}} मॉडल।",
        },
        permanent: {
          title: "क्रेडिट पैक",
          description:
            "किसी भी प्लान को टॉप अप करें: {{packPrice}} में {{packCredits}} क्रेडिट। जितने चाहिए उतने खरीदें। कभी एक्सपायर नहीं होते।",
        },
        free: {
          title: "फ़्री क्रेडिट",
          description:
            "बिना अकाउंट: {{guest}}/महीना। फ़्री अकाउंट: {{signedIn}}/महीना। अकाउंट + न्यूज़लेटर: {{max}}/महीना। कोई कार्ड नहीं।",
        },
      },
      costs: {
        title: "किस चीज़ की कितनी कीमत",
        description:
          "हर मैसेज, इमेज, क्लिप या टूल कॉल के क्रेडिट। मैसेज की कीमतें अनुमान हैं: OpenRouter मॉडल असली प्रोवाइडर कीमत और हमारा मार्कअप बिल करते हैं।",
        models: {
          title: "AI मॉडल (प्रति मैसेज)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} क्रेडिट",
          showLegacy: "पुराने मॉडल दिखाएँ",
          hideLegacy: "पुराने मॉडल छिपाएँ",
          free: "फ़्री",
          approxCost: "~क्रेडिट",
          legacyBadge: "पुराना",
          types: {
            text: "चैट",
            tts: "टेक्स्ट से वॉइस",
            stt: "वॉइस से टेक्स्ट",
            image: "इमेज जनरेशन",
            audio: "म्यूज़िक जनरेशन",
            video: "वीडियो जनरेशन",
          },
        },
        features: {
          title: "फ़ीचर",
          braveSearchLabel: "Brave सर्च (प्रति सर्च)",
          kagiSearchLabel: "Kagi सर्च (प्रति सर्च)",
          fetchUrlLabel: "वेबसाइट को टेक्स्ट में पाएँ (प्रति फ़ेच)",
          costFormat: "{{value}} {{unit}}",
          creditsUnit: "क्रेडिट",
        },
      },
      cta: {
        title: "हर मॉडल अनलॉक करें।",
        description:
          "सभी {{modelCount}} मॉडल के लिए मंथली क्रेडिट। जब चाहें पैक से टॉप अप करें।",
        button: "सब्सक्राइब करें",
      },
    },
    buy: {
      signInRequired: {
        title: "लॉग इन ज़रूरी है",
        description:
          "क्रेडिट खरीदने या सब्सक्राइब करने के लिए लॉग इन करें या अकाउंट बनाएँ।",
      },
      provider: {
        stripe: {
          description: "क्रेडिट/डेबिट कार्ड",
        },
        nowpayments: {
          description: "क्रिप्टोकरेंसी",
        },
        cryptoMinimumPacks:
          "न्यूनतम ट्रांज़ैक्शन वैल्यू की वजह से क्रिप्टो पेमेंट के लिए कम से कम {{minPacks}} क्रेडिट पैक ({{minValue}}) ज़रूरी हैं।",
      },
      subscription: {
        badge: "सबसे फ़ायदेमंद",
        title: "मंथली सब्सक्रिप्शन",
        description:
          "{{subPrice}}/महीना: हर महीने {{subCredits}} क्रेडिट, सभी {{modelCount}} AI मॉडल के साथ",
        perMonth: "/महीना",
        perYear: "/साल",
        yearlyEquivalent: "सालाना बिलिंग पर सिर्फ़ {{monthlyPrice}}/महीना",
        features: {
          credits: "हर महीने {{count}} क्रेडिट",
          expiry: "सभी {{modelCount}} AI मॉडल का एक्सेस",
          bestFor: "रेगुलर AI यूज़र के लिए बिल्कुल सही",
        },
        button: "अभी सब्सक्राइब करें",
        buttonAlreadySubscribed: "पहले से सब्सक्राइब्ड",
      },
      pack: {
        title: "एक्स्ट्रा क्रेडिट पैक",
        description: "अपने प्लान को टॉप अप करें। क्रेडिट कभी एक्सपायर नहीं होते।",
        badge: "टॉप अप",
        perPack: "/पैक",
        quantity: "मात्रा",
        total: "{{count}} क्रेडिट",
        features: {
          credits: "हर पैक में {{count}} क्रेडिट",
          permanent: "कभी एक्सपायर नहीं होते",
          expiry: "कभी एक्सपायर नहीं होते",
          bestFor: "पावर यूज़र के लिए जिन्हें और चाहिए",
        },
        button: {
          submit: "क्रेडिट पैक खरीदें",
        },
        totalPrice: "कुल: {{price}}",
        pack: "पैक",
        packs: "पैक",
      },
    },
    history: {
      title: "ट्रांज़ैक्शन हिस्ट्री",
      description: "आपके हाल के क्रेडिट ट्रांज़ैक्शन",
      empty: {
        title: "अभी कोई ट्रांज़ैक्शन नहीं",
        description: "आपकी क्रेडिट ट्रांज़ैक्शन हिस्ट्री यहाँ दिखेगी",
      },
      balance: "बैलेंस: {{count}}",
      loadMore: "और दिखाएँ",
      types: {
        purchase: "खरीदारी",
        subscription: "सब्सक्रिप्शन",
        usage: "इस्तेमाल",
        expiry: "एक्सपायरी",
        free_tier: "फ़्री टियर",
        monthly_reset: "मंथली रीसेट",
        free_grant: "फ़्री ग्रांट",
        free_reset: "फ़्री रीसेट",
        refund: "रिफ़ंड",
        transfer: "ट्रांसफ़र",
        other_devices: "दूसरे डिवाइस से खर्च",
        referral_earning: "रेफ़रल कमाई",
        referral_payout: "रेफ़रल पेआउट",
      },
    },
    tabs: {
      overview: "ओवरव्यू",
      buy: "क्रेडिट खरीदें",
      adminBuy: "क्रेडिट मैनेज करें",
      billing: "बिलिंग",
      history: "हिस्ट्री",
      plans: "प्लान",
      remote: "क्लाउड सिंक",
    },
    admin: {
      title: "क्रेडिट और लिमिट",
      description: "इस इंस्टेंस के लिए क्रेडिट और इस्तेमाल की लिमिट मैनेज करें",
      allocate: {
        title: "क्रेडिट दें",
        description:
          "किसी भी यूज़र अकाउंट में क्रेडिट जोड़ें। क्रेडिट खर्च की लिमिट की तरह काम करते हैं। इनसे तय होता है कि कितना AI इस्तेमाल हो सकता है। सेल्फ़-होस्टेड इंस्टेंस के लिए इसे उतने बजट पर सेट करें जितना आप देना चाहते हैं।",
        howItWorks: {
          title: "क्रेडिट लिमिट कैसे काम करती हैं",
          freePool: {
            title: "फ़्री पूल (शेयर्ड)",
            description:
              "सभी यूज़र फ़्री क्रेडिट का एक पूल शेयर करते हैं जो हर महीने रीसेट होता है। पूल का साइज़ अपनी एनवायरनमेंट सेटिंग्स में सेट करें।",
          },
          bonus: {
            title: "बोनस क्रेडिट (हर यूज़र के लिए)",
            description:
              "बोनस क्रेडिट स्थायी होते हैं। ये कभी एक्सपायर नहीं होते और फ़्री पूल क्रेडिट के ऊपर जुड़ते हैं। किसी यूज़र को एक्स्ट्रा क्षमता देने के लिए इनका इस्तेमाल करें।",
          },
          apiKeys: {
            title: "सारी लिमिट हटाएँ",
            description:
              "क्रेडिट को पूरी तरह बायपास करने के लिए सेटिंग्स में अपनी LLM API key सेट करें। हर यूज़र अपनी API key भी ला सकता है।",
          },
        },
      },
    },
    payment: {
      success: {
        title: "पेमेंट सफल रहा",
        subscription: "आपका सब्सक्रिप्शन चालू हो गया! आपके क्रेडिट जल्द ही उपलब्ध होंगे।",
        credits: "आपका क्रेडिट पैक खरीद लिया गया! आपके क्रेडिट जल्द ही उपलब्ध होंगे।",
      },
      canceled: {
        title: "पेमेंट रद्द हुआ",
        subscription:
          "आपका सब्सक्रिप्शन पेमेंट रद्द हो गया। आप कभी भी दोबारा कोशिश कर सकते हैं।",
        credits:
          "आपकी क्रेडिट पैक खरीदारी रद्द हो गई। आप कभी भी दोबारा कोशिश कर सकते हैं।",
      },
    },
  },
  meta: {
    category: "प्राइसिंग",
    imageAlt: "{{appName}} प्राइसिंग: हर AI मॉडल के लिए क्रेडिट",
    keywords:
      "AI चैट प्राइसिंग, अनसेंसर्ड AI कीमत, प्रति मैसेज AI, AI क्रेडिट, सस्ता AI चैट, {{appName}}",
    overview: {
      title: "AI चैट प्राइसिंग: प्रति मैसेज पेमेंट | {{appName}}",
      description:
        "हर महीने {{freeCredits}} तक फ़्री क्रेडिट। {{subPrice}} से प्लान, हर महीने {{subCredits}} क्रेडिट, {{maxCredits}} तक। {{modelCount}} मॉडल, मेनस्ट्रीम से अनसेंसर्ड तक।",
    },
    buyCredits: {
      title: "AI प्लान और क्रेडिट पैक | {{appName}}",
      description:
        "{{subPrice}} से प्लान, हर महीने {{subCredits}} क्रेडिट, {{maxCredits}} तक। पैक कभी एक्सपायर नहीं होते। कार्ड, PayPal या क्रिप्टो। {{modelCount}} AI मॉडल।",
    },
    history: {
      title: "क्रेडिट हिस्ट्री | {{appName}}",
      description:
        "हर क्रेडिट का हिसाब: खरीदारी, मंथली ग्रांट, रेफ़रल कमाई और हर चैट की कीमत।",
    },
  },
  payment: {
    success: {
      title: "पेमेंट सफल रहा",
      subscription:
        "आपका मंथली सब्सक्रिप्शन चालू हो गया! अब आपको हर महीने {{subCredits}} क्रेडिट मिलेंगे, सभी {{modelCount}} मॉडल के साथ।",
      credits: "आपका क्रेडिट पैक खरीद लिया गया! क्रेडिट कभी एक्सपायर नहीं होते।",
    },
    canceled: {
      title: "पेमेंट रद्द हुआ",
      subscription:
        "आपका सब्सक्रिप्शन पेमेंट रद्द हो गया। आप कभी भी दोबारा कोशिश कर सकते हैं।",
      credits:
        "आपकी क्रेडिट पैक खरीदारी रद्द हो गई। आप कभी भी दोबारा कोशिश कर सकते हैं।",
    },
  },
};
