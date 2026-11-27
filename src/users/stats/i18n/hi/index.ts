import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/hi";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  title: "साइनअप",
  titleShort: "साइनअप",
  description:
    "किसने साइन अप किया, किस चैनल या रेफ़ कोड से, कितनों ने वेरिफ़ाई किया, एक्टिव रहे और पेमेंट किया, और कौन फ़्री क्रेडिट जला रहा है। हर नंबर पिछली अवधि से तुलना में, हर टाइल और पंक्ति मेल खाते अकाउंट खोलती है।",
  category: "यूज़र",
  tag: "स्टैटिस्टिक्स",
  response: {
    window: "अवधि",
    kpis: "KPI",
    totals: "कुल",
    signupTrend: "समय के साथ साइनअप",
    activityTrend: "समय के साथ गतिविधि",
    funnel: "साइनअप फ़नल",
    byChannel: "चैनल के हिसाब से",
    byRefCode: "रेफ़ कोड के हिसाब से",
    byPlan: "प्लान के हिसाब से सब्सक्राइबर",
    byLocale: "लोकेल के हिसाब से",
    freeBurners: "टॉप फ़्री बर्नर",
  },
  widget: {
    cohortNote:
      "अब तक के नतीजे। पुराने साइनअप को वेरिफ़ाई करने, क्रेडिट इस्तेमाल करने या पेमेंट करने के लिए ज़्यादा समय मिला।",
    activityToggle: "अकाउंट गतिविधि",
    reviewUnverified: "{{count}} अनवेरिफ़ाइड साइनअप देखें",
    planLapsed: "बंद हुआ सब्सक्रिप्शन",
    planPacks: "सिर्फ़ क्रेडिट पैक",
    groups: {
      abuse: "दुरुपयोग",
      signups: "इस अवधि के साइनअप",
      accounts: "इस अवधि के सभी मेल खाते अकाउंट",
    },
    cliHint:
      "इन साइनअप के पीछे के अकाउंट: vibe users-list --audience=enums.audience.humans --signupFrom={{from}} --signupTo={{to}}",
    loading: "नंबर निकाले जा रहे हैं...",
    filters: "फ़िल्टर",
    openUsers: "अकाउंट खोलें",
    empty: "इस अवधि में कोई साइनअप नहीं।",
    noJourney: "(ट्रैक नहीं)",
    noRefCodes: "इस अवधि में कोई रेफ़-कोड साइनअप नहीं।",
    noSubscribers: "इस कोहोर्ट में कोई एक्टिव सब्सक्राइबर नहीं।",
    noBurners: "इस अवधि में किसी ने फ़्री क्रेडिट नहीं जलाए।",
    signedUpOn: "{{date}} को जुड़े",
    banned: "बैन",
    unverified: "अनवेरिफ़ाइड",
    kpi: {
      revenuePerPayerHint: "अवधि का रेवेन्यू / पेमेंट करने वाले अकाउंट",
      revenuePerPayer: "प्रति पेयर रेवेन्यू",
      revenuePeriod: "अवधि का रेवेन्यू",
      activatedRate: "ख़र्च हुए क्रेडिट",
      signups: "साइनअप",
      signupsHint: "अवधि में साइन अप किया। कुल मिलाकर {{total}} मेल खाते अकाउंट",
      verifiedRate: "वेरिफ़ाइड",
      paidConversion: "पेड कन्वर्ज़न",
      ofSignups: "{{total}} साइनअप में से {{count}}",
      activeUsers: "एक्टिव अकाउंट",
      activeHint: "सभी मेल खाते अकाउंट जिन्होंने अवधि में क्रेडिट ख़र्च किए",
      payingUsers: "पेमेंट करने वाले अकाउंट",
      payingHint: "सभी मेल खाते अकाउंट जिन्होंने अवधि में पेमेंट किया",
      revenue: "रेवेन्यू",
      revenueHint: "सभी मेल खाते अकाउंट, अवधि के सफल पेमेंट, USD में",
      freeBurn: "फ़्री क्रेडिट बर्न",
      freeBurnHint: "कभी पेमेंट न करने वाले अकाउंट के ख़र्च किए क्रेडिट। अकाउंट: {{count}}",
      banned: "बैन साइनअप",
      bannedHint: "अवधि में साइन अप किया, अब बैन",
    },
    series: {
      paid: "चुकाया गया",
      verified: "वेरिफ़ाइड, पेमेंट नहीं किया",
      unverified: "अनवेरिफ़ाइड, पेमेंट नहीं किया",
      active: "एक्टिव अकाउंट",
      paying: "पेमेंट करने वाले अकाउंट",
    },
    funnel: {
      paid: "चुकाया गया",
      active: "ख़र्च हुए क्रेडिट",
      verified: "वेरिफ़ाइड ईमेल",
      signups: "साइन अप किया",
    },
    charts: {
      signups: "साइनअप",
      signupsHint:
        "हर बकेट में नए अकाउंट, बाद में उन्होंने जो किया उसके हिसाब से बँटे। अकाउंट देखने के लिए बार पर क्लिक करें।",
      activity: "गतिविधि",
      activityHint:
        "हर बकेट के सभी मेल खाते अकाउंट। लेजेंड अवधि के अलग-अलग अकाउंट दिखाता है",
      funnel: "साइनअप मील के पत्थर",
      funnelHint:
        "अवधि के साइनअप जो हर मील के पत्थर तक पहुँचे। गिनती ऊपर की टाइलों से मेल खाती है।",
      byChannel: "पहले टच चैनल के हिसाब से साइनअप",
      byChannelHint: "इन साइनअप का पहला टच। रेवेन्यू = अवधि में उनके पेमेंट",
      byRefCode: "रेफ़ कोड के हिसाब से साइनअप",
      byRefCodeHint:
        "कोड को क्रेडिट हुए साइनअप, नहीं तो पहली विज़िट का कोड। ref: चैनल पंक्तियों से ज़्यादा हो सकते हैं",
      byPlan: "प्लान के हिसाब से पेमेंट करने वाले अकाउंट",
      byPlanHint:
        "जिन अकाउंट ने अवधि में पेमेंट किया और उनका रेवेन्यू; पेमेंट करने वाले और रेवेन्यू टाइल से जुड़ता है",
      byLocale: "लोकेल के हिसाब से साइनअप",
      freeBurners: "टॉप फ़्री बर्नर",
      freeBurnersHint: "कभी पेमेंट नहीं किया, अवधि में सबसे ज़्यादा क्रेडिट ख़र्च",
    },
    columns: {
      ofSignups: "साइनअप का %",
      accounts: "अकाउंट",
      milestone: "मील का पत्थर",
      active: "ख़र्च हुए क्रेडिट",
      creditsGranted: "ग्रांटेड",
      creditsSpentTotal: "अब तक",
      creditBalance: "बैलेंस",
      signups: "साइनअप",
      verified: "वेरिफ़ाइड",
      paid: "चुकाया गया",
      conversion: "कन्व.",
      revenue: "अवधि का रेवेन्यू",
      channel: "चैनल",
      refCode: "रेफ़ कोड",
      plan: "प्लान",
      subscribers: "अकाउंट",
      revenueWindow: "रेवेन्यू",
      locale: "लोकेल",
      account: "अकाउंट",
      creditsSpent: "अवधि में",
    },
    definitions:
      "डिफ़ॉल्ट रूप से सिर्फ़ इंसान: एडमिन और टेस्ट डोमेन शामिल नहीं। एक्टिव = अपने या जुड़े गेस्ट वॉलेट से क्रेडिट ख़र्च किए। रेवेन्यू USD में तय FX दरों पर। कन्वर्ज़न साइनअप के बाद किसी भी समय हुए पेमेंट गिनता है।",
  },
  errors: {
    validation: {
      title: "गलत स्टैट्स रिक्वेस्ट",
      description: "विंडो और तारीखें जाँचें",
    },
    unauthorized: {
      title: "साइन इन ज़रूरी है",
      description: "स्टैट्स देखने के लिए साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "स्टैट्स देखने के लिए आपके पास एडमिन रोल होना चाहिए",
    },
    notFound: {
      title: "कोई डेटा नहीं",
      description: "इस विंडो में रिपोर्ट करने को कुछ नहीं",
    },
    server: {
      title: "स्टैट्स की गणना नहीं हो सकी",
      description: "सर्वर यूज़र स्टैटिस्टिक्स की गणना नहीं कर सका",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "सर्वर तक नहीं पहुँच सके",
    },
    unknown: {
      title: "अनपेक्षित एरर",
      description: "स्टैट्स की गणना में कुछ गलत हो गया",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "रिक्वेस्ट मौजूदा डेटा से टकराती है",
    },
  },
  success: {
    title: "स्टैट्स तैयार",
    description: "यूज़र स्टैटिस्टिक्स की गणना हो गई",
  },
};
