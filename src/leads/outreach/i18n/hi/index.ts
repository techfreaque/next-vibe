import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "आउटरीच",
  tags: {
    outreach: "आउटरीच",
    crm: "crm",
    deals: "डील्स",
    import: "import",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    contactStatus: {
      sent: "भेजे गए",
      replied: "जवाब आया",
      interested: "दिलचस्पी दिखाई",
      deal: "डील",
      declined: "अस्वीकृत",
      optOut: "ऑप्ट आउट",
      bounced: "बाउंस हुए",
    },
    contactKind: {
      creator: "क्रिएटर",
      newsletter: "न्यूज़लेटर",
      directory: "डायरेक्टरी",
      other: "अन्य",
    },
    direction: {
      out: "हमने भेजा",
      in: "उनका जवाब",
    },
    dealStatus: {
      proposed: "प्रस्तावित",
      committed: "पक्का",
      paid: "चुकाया गया",
      canceled: "रद्द",
    },
    angleGroup: {
      affiliate: "A · एफ़िलिएट",
      audienceFit: "B · ऑडियंस फ़िट",
      mission: "C · अभिव्यक्ति की आज़ादी / प्राइवेसी",
      tryIt: "D · आज़माएँ / लिस्टिंग पाएँ",
      video: "वीडियो पूछताछ",
      infoFirst: "पहले रेट",
      negotiation: "बातचीत",
      other: "अन्य",
    },
    attributionBasis: {
      tracked: "ट्रैक्ड लिंक / रेफ़रल कोड",
      channel: "पूरे चैनल के लिए",
      none: "ट्रैक नहीं",
    },
  },
  crm: {
    get: {
      title: "आउटरीच CRM",
      titleShort: "आउटरीच",
      description:
        "हर संपर्क जिसे पिच किया गया, वे किस स्टेज में हैं, और पेड डील्स से कितने साइन अप और रेवेन्यू आया।",
      fields: {
        status: {
          label: "स्टेटस",
          description: "सिर्फ़ इस स्टेटस के संपर्क",
        },
        kind: {
          label: "प्रकार",
          description: "क्रिएटर, न्यूज़लेटर, डायरेक्टरी या कुछ और",
        },
        angle: {
          label: "एंगल",
          description: "पिच एंगल का प्रीफ़िक्स, जैसे A, B-audience-fit, VIDEO",
          placeholder: "B-audience-fit",
        },
        search: {
          label: "खोजें",
          description: "नाम, ईमेल, सब्जेक्ट या नोट्स",
          placeholder: "नाम, ईमेल, सब्जेक्ट खोजें…",
        },
        page: { label: "पेज", description: "पेज नंबर" },
        limit: { label: "प्रति पेज", description: "प्रति पेज संपर्क" },
      },
      response: {
        summary: "सारांश",
        angles: "एंगल",
        contacts: "संपर्क",
        deals: "डील्स",
        dealTotals: "डील का कुल",
      },
      widget: {
        title: "आउटरीच",
        subtitle: "हमने किसे पिच किया, किसने जवाब दिया, और पैसे से क्या मिला।",
        refresh: "रीफ़्रेश करें",
        addContact: "संपर्क दर्ज करें",
        addDeal: "डील जोड़ें",
        import: "Import log",
        loading: "आउटरीच लोड हो रहा है…",
        allStatuses: "सभी",
        clearFilters: "फ़िल्टर साफ़ करें",
        kpi: {
          contacts: "संपर्क",
          replyRate: "रिप्लाई रेट",
          replyRateHint: "{{total}} में से {{replied}} ने जवाब दिया",
          deals: "पेड डील्स",
          spent: "ख़र्च हुए",
          spentHint: "{{committed}} पक्की, अभी पेमेंट बाकी",
        },
        angles: {
          title: "एंगल",
          hint: "हर पिच एंगल पर रिप्लाई रेट। जो एंगल जवाब पाता है उसी की ओर झुकें।",
          row: "{{contacts}} को पिच किया · {{replied}} ने जवाब दिया",
        },
        contacts: {
          title: "संपर्क",
          columns: {
            contact: "संपर्क",
            status: "स्टेटस",
            angle: "एंगल",
            last: "आख़िरी संपर्क",
            touches: "ईमेल",
          },
          showing: "{{total}} में से {{start}}–{{end}}",
          never: "कभी नहीं",
          replied: "{{date}} को जवाब आया",
        },
        deals: {
          prepareBill: "सप्लायर बिल तैयार करें",
          title: "पेड डील्स",
          hint: "हर डील के ट्रैक्ड लिंक या रेफ़रल कोड से आए विज़िट, साइन अप और रेवेन्यू के मुकाबले खर्च।",
          columns: {
            deal: "डील",
            status: "स्टेटस",
            spend: "स्पेंड",
            visits: "विज़िट",
            signups: "साइनअप",
            paying: "पेइंग",
            revenue: "रेवेन्यू",
            costPerSignup: "लागत / साइनअप",
          },
          live: "{{date}} को लाइव",
          basisChannel: "पूरे चैनल का, किसी एक डील का नहीं",
          basisNone: "मिलान के लिए कोई लिंक, कैंपेन या रेफ़रल कोड नहीं",
          empty: {
            title: "अभी कोई पेड डील नहीं",
            hint: "जैसे ही कोई क्रिएटर कीमत पर राज़ी हो, डील दर्ज करें। ट्रैक्ड लिंक या रेफ़रल कोड जोड़ें ताकि नतीजे यहाँ दिखें।",
          },
        },
        empty: {
          title: "कोई आउटरीच दर्ज नहीं",
          hint: "सेंट लॉग इम्पोर्ट करें, या हर ईमेल के जाते ही उसे दर्ज करें।",
          cta: "सेंट लॉग इम्पोर्ट करें",
          filtered: "इन फ़िल्टर से कोई संपर्क नहीं मिला",
        },
        text: {
          header:
            "{{total}} संपर्क · {{replied}} ने जवाब दिया ({{rate}}) · {{deals}} पेड डील्स",
          statusLine: "स्टेटस: {{counts}}",
          anglesTitle: "एंगल (पिच किए / जवाब आए):",
          contactsTitle: "{{total}} में से संपर्क {{start}}-{{end}}:",
          dealsTitle: "पेड डील्स:",
          dealLine:
            "{{name}} · {{deliverable}} · {{amount}} {{status}} · विज़िट {{visits}} · साइन अप {{signups}} · पेइंग {{paying}} · रेवेन्यू {{revenue}} · कॉस्ट/साइन अप {{cps}}",
          pageHint:
            "पेज {{page}}/{{pages}}, और देखने के लिए --page={{next}} इस्तेमाल करें",
          noContacts: "कोई संपर्क मेल नहीं खाता।",
          noDeals: "कोई पेड डील दर्ज नहीं।",
        },
      },
    },
  },
  contact: {
    post: {
      title: "आउटरीच संपर्क दर्ज करें",
      titleShort: "संपर्क दर्ज करें",
      description:
        "ईमेल से संपर्क बनाएँ या अपडेट करें। अभी भेजा (या मिला) ईमेल दर्ज करने के लिए सब्जेक्ट दें।",
      fields: {
        email: {
          label: "ईमेल",
          description: "संपर्क का ईमेल। केस की परवाह किए बिना मिलान होता है",
          placeholder: "hello@creator.com",
        },
        name: {
          label: "नाम",
          description: "क्रिएटर, आउटलेट या व्यक्ति",
          placeholder: "AI Anytime (Sonu)",
        },
        kind: {
          label: "प्रकार",
          description: "क्रिएटर, न्यूज़लेटर, डायरेक्टरी या कुछ और",
        },
        url: {
          label: "URL",
          description: "चैनल, साइट या न्यूज़लेटर पेज",
          placeholder: "https://youtube.com/@creator",
        },
        angle: {
          label: "एंगल",
          description: "पिच एंगल, जैसे A-affiliate, B-audience-fit",
          placeholder: "B-audience-fit",
        },
        status: {
          label: "स्टेटस",
          description:
            "सिर्फ़ आगे बढ़ता है (भेजा → जवाब आया → दिलचस्पी → डील)। बाहर निकलना हमेशा लागू होता है",
        },
        forceStatus: {
          label: "स्टेटस ज़बरदस्ती बदलें",
          description: "स्टेटस ठीक वैसा ही रखें, भले ही वह पीछे जाए",
        },
        notes: {
          label: "नोट्स",
          description: "संपर्क के नोट्स बदल देता है",
          placeholder: "रेट कार्ड $550 इंटीग्रेशन, 20-150K व्यूज़",
        },
        refCode: {
          label: "रेफ़ कोड",
          description: "इस संपर्क को दिया गया रेफ़रल कोड",
          placeholder: "moemoe",
        },
        channel: {
          label: "चैनल",
          description: "ग्रोथ चैनल की key, जैसे youtube, newsletter",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "कैंपेन लिंक ID",
          description: "उनके ट्रैक्ड लिंक की utm_id। अज्ञात ID हटा दी जाती है",
        },
        subject: {
          label: "ईमेल सब्जेक्ट",
          description: "इस ईमेल का टच दर्ज करने के लिए सेट करें",
          placeholder: "आपके दर्शक यही चाहते हैं",
        },
        direction: {
          label: "दिशा",
          description: "हमने भेजा (डिफ़ॉल्ट) या उनका जवाब",
        },
        at: {
          label: "भेजने का समय",
          description: "ईमेल कब गया। डिफ़ॉल्ट: अभी",
        },
        touchNote: {
          label: "ईमेल नोट",
          description: "ईमेल में क्या लिखा या पूछा गया",
          placeholder: "रेट कार्ड माँगा",
        },
      },
      response: {
        id: "संपर्क ID",
        created: "बनाया गया",
        status: "स्टेटस",
        previousStatus: "पिछला स्टेटस",
        touchLogged: "ईमेल दर्ज हुआ",
        contactCount: "भेजे गए ईमेल",
        warning: "चेतावनी",
      },
      widget: {
        back: "वापस",
        hint: "हर भेजे ईमेल के लिए एक कॉल। एक ही ईमेल एक ही संपर्क को अपडेट करता है।",
        touchSection: "यह ईमेल",
        contactSection: "संपर्क",
        submit: "संपर्क सेव करें",
        warnOptOut: "इस संपर्क ने ऑप्ट-आउट किया है। इन्हें दोबारा ईमेल न करें।",
        warnBounced: "यह पता पहले बाउंस हो चुका है। भेजने से पहले जाँच लें।",
        saved: "{{status}} · भेजे गए ईमेल: {{count}}",
      },
    },
  },
  deal: {
    post: {
      title: "आउटरीच डील सेव करें",
      titleShort: "डील सेव करें",
      description:
        "किसी संपर्क के लिए पेड डील बनाएँ, या ID से मौजूदा डील अपडेट करें। नतीजे नापने के लिए कैंपेन लिंक, utm_campaign या रेफ़रल कोड जोड़ें।",
      fields: {
        id: {
          label: "डील ID",
          description: "मौजूदा डील अपडेट करने के लिए सेट करें",
        },
        contactEmail: {
          label: "संपर्क का ईमेल",
          description: "नई डील के लिए ज़रूरी। संपर्क नया हो तो बन जाता है",
          placeholder: "youtube@creator.com",
        },
        contactName: {
          label: "संपर्क का नाम",
          description: "सिर्फ़ तब इस्तेमाल होता है जब संपर्क पहले से मौजूद न हो",
          placeholder: "MoeMoe",
        },
        deliverable: {
          label: "डिलीवरेबल",
          description: "पैसे के बदले क्या मिलेगा",
          placeholder: "YouTube इंटीग्रेशन",
        },
        amount: {
          label: "रकम",
          description: "कुल कीमत, करेंसी यूनिट में",
        },
        currency: {
          label: "करेंसी",
          description: "रकम की करेंसी",
        },
        status: {
          label: "स्टेटस",
          description: "प्रस्तावित, पक्की, चुकाई या रद्द",
        },
        channel: {
          label: "चैनल",
          description: "ग्रोथ चैनल की key, वही जो चैनल स्पेंड में इस्तेमाल होती है",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "कैंपेन लिंक ID",
          description: "ट्रैक्ड लिंक की utm_id। लिंक इस इंस्टेंस पर न हो तो खाली रहती है",
        },
        utmCampaign: {
          label: "utm_campaign",
          description: "ट्रैक्ड लिंक पर कैंपेन की वैल्यू",
          placeholder: "moemoe-2026-11-14",
        },
        refCode: {
          label: "रेफ़ कोड",
          description: "क्रिएटर जो रेफ़रल कोड शेयर करता है",
          placeholder: "moemoe",
        },
        liveAt: {
          label: "लाइव होने की तारीख",
          description: "पब्लिश की तारीख। रेवेन्यू यहीं से गिना जाता है",
        },
        paidAt: {
          label: "भुगतान की तारीख",
          description: "स्टेटस चुकाया होने पर डिफ़ॉल्ट अभी की तारीख",
        },
        notes: {
          label: "नोट्स",
          description: "पेमेंट का तरीका, इनवॉइस, शर्तें",
          placeholder: "Payoneer, ref 1059964703",
        },
      },
      response: {
        id: "डील ID",
        created: "बनाया गया",
        status: "स्टेटस",
        linkFound: "कैंपेन लिंक मिला",
      },
      widget: {
        back: "वापस",
        hint: "पक्की या चुकाई गई डील्स में संपर्क डील स्टेज में चला जाता है।",
        submit: "डील सेव करें",
      },
    },
  },
  import: {
    post: {
      title: "आउटरीच लॉग इम्पोर्ट करें",
      titleShort: "लॉग इम्पोर्ट करें",
      description:
        "सेंट लॉग (टैब से अलग पंक्तियाँ या मार्कडाउन टेबल) को संपर्क और टच में बदलें। दोबारा चलाना सुरक्षित है: जो ईमेल पहले से स्टोर हैं वे छोड़ दिए जाते हैं।",
      fields: {
        content: {
          label: "लॉग कंटेंट",
          description:
            "सेंट-लॉग की पंक्तियाँ या sent-log.md की टेबल पेस्ट करें। रिमोट इंस्टेंस पर भी चलता है",
          placeholder:
            "2026-11-10\\tModelFit\\tpartnerships@modelfit.io\\tA-affiliate\\tA recurring cut\\tSENT",
        },
        filePaths: {
          label: "सर्वर फ़ाइलें",
          description:
            "सर्वर पर .tmp/ के नीचे के पाथ, कॉमा से अलग, जैसे .tmp/outreach/sent-log",
          placeholder: ".tmp/outreach/sent-log.md,.tmp/outreach/sent-log",
        },
        ignoreEmails: {
          label: "ईमेल अनदेखे करें",
          description: "वे पते (कॉमा से अलग) जो आउटरीच नहीं हैं",
          placeholder: "max@example.com",
        },
        dryRun: {
          label: "ड्राई रन",
          description: "पार्स करें और गिनें, कुछ लिखें नहीं",
        },
      },
      response: {
        rowsParsed: "पार्स की गई पंक्तियाँ",
        contactsCreated: "बने संपर्क",
        contactsUpdated: "अपडेट हुए संपर्क",
        touchesAdded: "जोड़े गए ईमेल",
        touchesDuplicate: "पहले से पता",
        statusChanges: "स्टेटस बदलाव",
        skipped: "छोड़ी गई पंक्तियाँ",
        skippedLines: "छोड़ने का ब्योरा",
      },
      widget: {
        back: "वापस",
        hint: "लॉग पेस्ट करें या सर्वर फ़ाइलों का पाथ दें। इम्पोर्ट कितनी भी बार करें, हर ईमेल एक ही बार स्टोर होता है।",
        submit: "इम्पोर्ट करें",
        line: "{{source}}:{{line}} {{reason}}",
      },
    },
  },
  skip: {
    noEmail: "सही ईमेल नहीं",
    noDate: "सही तारीख नहीं",
    skippedStatus: "SKIPPED चिह्नित",
    ignored: "अनदेखा किया गया पता",
    columns: "कॉलम बहुत कम",
    unreadable: "फ़ाइल पढ़ी नहीं जा सकती",
    outsideTmp: ".tmp/ के बाहर का पाथ",
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
      description: "आउटरीच टूल के लिए एडमिन रोल चाहिए",
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
    dealNotFound: "ID {{id}} वाली कोई डील नहीं है",
    dealNeedsContact: "नई डील के लिए संपर्क का ईमेल चाहिए",
    dealNeedsFields: "नई डील के लिए डिलीवरेबल और राशि चाहिए",
    importEmpty: "Pass log content or at least one server file",
  },
  success: {
    title: "हो गया",
    description: "सेव हो गया",
  },
};
