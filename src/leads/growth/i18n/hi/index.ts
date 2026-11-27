import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  acquisition: {
    title: "लीड एक्विज़िशन",
    description:
      "आगमन हर विज़िट के सोर्स का इस्तेमाल करता है। लीड और कन्वर्ज़न गतिविधि लीड का दर्ज सोर्स और क्रेडिट किया रेफ़रल कोड इस्तेमाल करती है। रेवेन्यू चुनी हुई करेंसी में कुल सफल पेमेंट है। पुराने आगमन की गिनती हमारे बचाए लैंडिंग रिकॉर्ड पर आधारित है।",
    sources: {
      all: "सभी सोर्स",
      creator: "क्रिएटर कोड",
      referral: "रेफ़रल कोड",
      campaign: "UTM campaign",
      search: "ऑर्गेनिक सर्च",
      referrer: "बाहरी रेफ़रर",
      direct: "डायरेक्ट",
      unattributed: "एट्रिब्यूट नहीं",
    },
    metrics: {
      visits: "विज़िट",
      leads: "लीड",
      signups: "साइनअप",
      firstChats: "पहली चैट",
      payers: "पेमेंट करने वाले",
      revenue: "रेवेन्यू",
    },
    fields: {
      type: "सोर्स टाइप",
      source: "UTM source",
      medium: "UTM medium",
      campaign: "UTM campaign",
      referrerHost: "रेफ़रर डोमेन",
      refCode: "रेफ़रल कोड",
      currency: "रेवेन्यू करेंसी",
      metric: "मेट्रिक",
      excludeBots: "बॉट बाहर रखें",
      excludeBotsDescription:
        "सिर्फ़ विज़िट: जाने-माने बॉट और क्रॉलर लीड की विज़िट हटाएँ, लीड फ़नल जैसा ही नियम।",
    },
    series: "समय के साथ लीड एक्विज़िशन",
    empty: "इस अवधि में कोई एक्विज़िशन गतिविधि नहीं।",
    page: "पेज",
    previous: "पिछला",
    next: "अगला",
    apply: "फ़िल्टर लगाएँ",
  },
  category: "ग्रोथ",
  tags: {
    vibeSense: "vibe-sense",
    growth: "growth",
    campaigns: "campaigns",
    spend: "spend",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    funnelStep: {
      visit: "पहली विज़िट",
      chat: "पहला चैट मैसेज",
      signup: "साइनअप",
      newsletter: "न्यूज़लेटर कन्फ़र्म",
      paid: "पहला पेमेंट",
      retained: "दूसरे महीने का रिन्यूअल",
    },
    attributionTouch: {
      first: "पहला टच",
      last: "आख़िरी टच",
    },
    channelType: {
      all: "सभी चैनल",
      campaign: "कैंपेन (UTM)",
      referral: "रेफ़रल कोड",
      organic: "ऑर्गेनिक रेफ़रर",
      direct: "डायरेक्ट",
    },
    paidKind: {
      subscription: "सब्सक्रिप्शन",
      pack: "क्रेडिट पैक",
    },
  },
  links: {
    get: {
      title: "कैंपेन लिंक",
      titleShort: "कैंपेन लिंक",
      description:
        "हर मार्केटिंग चैनल के टैग किए लिंक, हर लिंक से आई विज़िट, साइनअप और पेमेंट करने वाले यूज़र के साथ।",
      response: {
        links: "लिंक",
      },
      widget: {
        title: "कैंपेन लिंक",
        subtitle: "हर चैनल टेस्ट को टैग करें। फ़ैसला इससे कीजिए कि पेमेंट कौन करता है।",
        create: "नया लिंक",
        refresh: "रीफ़्रेश करें",
        loading: "लिंक लोड हो रहे हैं…",
        empty: {
          title: "अभी कोई कैंपेन लिंक नहीं",
          hint: "हर चैनल टेस्ट के लिए एक लिंक बनाएँ। उससे आई हर विज़िट, साइनअप और पेमेंट यहाँ दिखेगा।",
          cta: "पहला लिंक बनाएँ",
        },
        visits: "विज़िट",
        signups: "साइनअप",
        paid: "चुकाया गया",
        funnel: "{{visits}} विज़िट → {{signups}} साइनअप → {{paid}} पेड",
        paidRate: "{{rate}} विज़िट ने पेमेंट किया",
        refCode: "रेफ़ {{code}}",
        landsOn: "{{path}} पर पहुँचता है",
        copy: "लिंक कॉपी करें",
        copied: "कॉपी हो गया",
        spend: "चैनल स्पेंड",
      },
    },
    post: {
      title: "कैंपेन लिंक बनाएँ",
      titleShort: "नया लिंक",
      description:
        "किसी एक चैनल के लिए UTM-टैग वाला लिंक बनाएँ, चाहें तो रेफ़रल कोड से बाँधकर।",
      fields: {
        name: {
          label: "नाम",
          description: "आंतरिक नाम, जैसे 'Reddit r/LocalLLaMA लॉन्च पोस्ट'",
          placeholder: "Reddit लॉन्च पोस्ट",
        },
        channel: {
          label: "सोर्स (utm_source)",
          description: "ट्रैफ़िक कहाँ से आता है: reddit, youtube, x",
          placeholder: "reddit",
        },
        medium: {
          label: "मीडियम (utm_medium)",
          description: "ट्रैफ़िक का प्रकार: social, cpc, email, video",
          placeholder: "social",
        },
        campaign: {
          label: "कैंपेन (utm_campaign)",
          description: "वो टेस्ट जिससे ये लिंक जुड़ा है",
          placeholder: "launch-nov",
        },
        content: {
          label: "कंटेंट (utm_content)",
          description: "वैकल्पिक। कौन सा क्रिएटिव या प्लेसमेंट",
          placeholder: "top-comment",
        },
        term: {
          label: "टर्म (utm_term)",
          description: "वैकल्पिक। पेड कीवर्ड",
          placeholder: "uncensored ai",
        },
        destinationPath: {
          label: "लैंडिंग पाथ",
          description: "साइट का वो पाथ जो लिंक खोलता है, जैसे / या /en-US/story",
          placeholder: "/",
        },
        refCode: {
          label: "रेफ़रल कोड",
          description:
            "वैकल्पिक। विज़िट को /track से गुज़ारता है ताकि रेफ़रल कोड भी क्रेडिट हो",
          placeholder: "FRIEND2024",
        },
      },
      response: {
        id: "लिंक ID",
        url: "कैंपेन URL",
      },
      widget: {
        back: "वापस",
        hint: "एक ही चैनल के लिए हमेशा वही सोर्स। स्पेंड और प्रति पेमेंट करने वाले यूज़र की लागत सोर्स से ग्रुप होती है।",
        created: "लिंक तैयार। यही सटीक URL शेयर करें:",
        copy: "लिंक कॉपी करें",
        copied: "कॉपी हो गया",
      },
    },
  },
  spend: {
    get: {
      title: "चैनल स्पेंड",
      titleShort: "चैनल स्पेंड",
      description:
        "हर चैनल और अवधि का स्पेंड, साइनअप, पेमेंट करने वाले यूज़र और प्रति पेमेंट करने वाले यूज़र की लागत के साथ।",
      response: {
        rows: "स्पेंड एंट्री",
      },
      widget: {
        title: "चैनल स्पेंड",
        subtitle:
          "हर चैनल पर कितना ख़र्च होता है, और एक पेमेंट करने वाला यूज़र आपको कितने का पड़ता है।",
        add: "स्पेंड जोड़ें",
        refresh: "रीफ़्रेश करें",
        loading: "स्पेंड लोड हो रहा है…",
        empty: {
          title: "कोई स्पेंड दर्ज नहीं",
          hint: "चैनल टेस्ट की लागत दर्ज करें। जैसे ही कोई पेमेंट करने वाला आएगा, प्रति पेमेंट करने वाले यूज़र की लागत दिखेगी।",
          cta: "पहला स्पेंड दर्ज करें",
        },
        period: "{{from}} – {{to}}",
        signups: "साइनअप",
        paid: "पेमेंट करने वाले यूज़र",
        costPerPaid: "लागत / पेमेंट करने वाला यूज़र",
        costPerSignup: "लागत / साइनअप",
        none: "–",
        attribution:
          "यूज़र उसी चैनल में गिने जाते हैं जिसने उन्हें पहली बार लाया (पहला टच), अवधि के भीतर।",
      },
    },
    post: {
      title: "चैनल स्पेंड दर्ज करें",
      titleShort: "स्पेंड दर्ज करें",
      description:
        "किसी अवधि में चैनल की लागत दर्ज करें। वही चैनल और वही शुरुआती तारीख़ एंट्री को ओवरराइट करती है।",
      fields: {
        channel: {
          label: "चैनल",
          description: "चैनल का utm_source, या रेफ़रल पार्टनर के लिए ref:CODE",
          placeholder: "reddit",
        },
        periodStart: {
          label: "से",
          description: "स्पेंड अवधि का पहला दिन",
        },
        periodEnd: {
          label: "तक",
          description: "स्पेंड अवधि का आख़िरी दिन",
        },
        amount: {
          label: "रकम",
          description: "अवधि में कुल ख़र्च",
        },
        currency: {
          label: "करेंसी",
          description: "रकम की करेंसी",
        },
        note: {
          label: "नोट",
          description: "वैकल्पिक। पैसे से क्या ख़रीदा गया",
          placeholder: "2 प्रमोटेड पोस्ट",
        },
      },
      response: {
        id: "एंट्री ID",
      },
      widget: {
        back: "वापस",
        hint: "वही सटीक सोर्स नाम इस्तेमाल करें जो आपके कैंपेन लिंक इस्तेमाल करते हैं, वरना ग्राफ़ स्पेंड को यूज़र से मैच नहीं कर पाएगा।",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "रेज़ोल्यूशन", description: "बकेट साइज़" },
      range: { label: "रेंज", description: "क्वेरी की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन मेटाडेटा" },
      touch: {
        label: "एट्रिब्यूशन",
        description: "पहले या आख़िरी टच से ग्रुप करें",
      },
      channelType: {
        label: "चैनल टाइप",
        description: "कैंपेन, रेफ़रल, ऑर्गेनिक, डायरेक्ट, या सभी",
      },
      channel: {
        label: "चैनल",
        description:
          "सटीक चैनल key: utm_source, ref:CODE, रेफ़रर होस्ट या direct। खाली = कोई भी",
      },
      currency: {
        label: "करेंसी",
        description: "सिर्फ़ इसी करेंसी में डाला स्पेंड जोड़ा जाता है",
      },
      convertToUsd: {
        label: "सभी करेंसी USD में",
        description:
          "फ़ाइनेंस FX टेबल की दर पर हर करेंसी को USD में बदलकर जोड़ें। करेंसी फ़िल्टर को नज़रअंदाज़ करता है।",
      },
    },
    funnelStep: {
      post: {
        title: "फ़नल स्टेप",
        titleShort: "फ़नल स्टेप",
        description:
          "हर बकेट में ग्रोथ फ़नल के स्टेप तक पहुँची जर्नी, चैनल से फ़िल्टर करने योग्य",
        fields: {
          step: {
            label: "स्टेप",
            description:
              "फ़नल स्टेप: visit, chat, signup, newsletter, paid, retained",
          },
          result: { label: "जर्नी", description: "हर बकेट का स्टेप काउंट" },
        },
      },
    },
    channelSpend: {
      post: {
        title: "चैनल स्पेंड",
        titleShort: "चैनल स्पेंड",
        description: "हर बकेट में दर्ज मार्केटिंग स्पेंड, हर स्पेंड अवधि में बराबर बँटा हुआ",
        fields: {
          result: { label: "स्पेंड", description: "हर बकेट का स्पेंड" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "गलत इनपुट",
      description: "हाइलाइट की गई फ़ील्ड जाँचें",
    },
    unauthorized: {
      title: "साइन इन नहीं हैं",
      description: "एडमिन के रूप में साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "ग्रोथ टूल्स के लिए एडमिन रोल चाहिए",
    },
    notFound: {
      title: "नहीं मिला",
      description: "वो एंट्री मौजूद नहीं है",
    },
    conflict: {
      title: "टकराव",
      description: "इस बीच एंट्री बदल गई, रीलोड करके दोबारा कोशिश करें",
    },
    server: {
      title: "सर्वर एरर",
      description: "रिक्वेस्ट पूरी नहीं हो सकी",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "रिक्वेस्ट सर्वर तक नहीं पहुँची",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कुछ अनपेक्षित फ़ेल हो गया",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव सेव करें या छोड़ें",
    },
    invalidRefCode: "रेफ़रल कोड {{code}} मौजूद नहीं है या निष्क्रिय है",
    invalidPeriod: "अवधि का अंत उसकी शुरुआत के दिन या उसके बाद होना चाहिए",
    invalidDestination: "लैंडिंग पाथ / से शुरू होना चाहिए और इसी साइट पर रहना चाहिए",
  },
  success: {
    title: "हो गया",
    description: "सेव हो गया",
  },
};
