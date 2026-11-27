import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/hi";

import { translations as leadAnalyticsTranslations } from "@/leads/analytics/i18n/hi";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  ...leadAnalyticsTranslations,
  tags: {
    leads: "leads",
    analytics: "analytics",
  },
  get: {
    title: "फ़नल",
    titleShort: "फ़नल",
    description:
      "अवधि में बने लीड और वे कहाँ तक पहुँचे: इंसान, पहली चैट, साइन अप, ईमेल कन्फ़र्म, पेड। चैनल, स्रोत या रेफ़ कोड के हिसाब से। हर स्टेप अपने लीड खोलता है।",
    response: {
      window: "अवधि",
      dimensionUsed: "सेगमेंट का आयाम",
      steps: "फ़नल के स्टेप",
      previousSteps: "पिछली अवधि के स्टेप",
      rates: "कन्वर्ज़न दरें",
      segments: "सेगमेंट के हिसाब से फ़नल",
      trend: "कोहोर्ट ट्रेंड",
      signupSteps: "अवधि में साइन-अप स्टेप",
      previousSignupSteps: "पिछली अवधि में साइन-अप स्टेप",
      signupSegments: "सेगमेंट के हिसाब से साइन-अप स्टेप",
      signupTrackedSince: "साइन-अप स्टेप इस तारीख़ से ट्रैक",
      wallSteps: "अवधि में कन्वर्ज़न की दीवारें",
      previousWallSteps: "पिछली अवधि में कन्वर्ज़न की दीवारें",
      wallSegments: "सेगमेंट के हिसाब से कन्वर्ज़न की दीवारें",
      wallTrackedSince: "कन्वर्ज़न की दीवारें इस तारीख़ से ट्रैक",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "एडमिन के रूप में लॉग इन करें।",
      },
      validation: {
        title: "फ़िल्टर गलत हैं",
        description: "अवधि और फ़िल्टर के मान जाँचें।",
      },
      server: {
        title: "रिपोर्ट फ़ेल हुई",
        description: "फ़नल रिपोर्ट की गणना नहीं हो सकी।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ गड़बड़ हुई।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके।",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "सिर्फ़ एडमिन।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिपोर्ट का कोई डेटा नहीं।",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "अपने फ़िल्टर बदलाव लागू करें या छोड़ें।",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा बदल गया। रीलोड करें।",
      },
    },
    success: {
      title: "रिपोर्ट तैयार",
      description: "फ़नल रिपोर्ट लोड हुई।",
    },
  },
  widget: {
    wallTitle: "कन्वर्ज़न की दीवारें",
    wallSubtitle:
      "जिन्हें किसी दीवार पर रोका गया, उस दिन के हिसाब से। हर दीवार पर एक बार गिना जाता है।",
    wallTrackedHint: "{{date}} से ट्रैक: पहले की दीवारें दर्ज नहीं हुईं।",
    creditWallGuests: "क्रेडिट खत्म गेस्ट",
    creditWallAccounts: "क्रेडिट खत्म अकाउंट",
    consentDeclined: "18+ सहमति ठुकराई",
    creditWallHint: "भेजना रोका गया, क्रेडिट खत्म वाला कार्ड दिखा",
    consentDeclinedHint: "सहमति डायलॉग बिना सहमत हुए बंद किया",
    wallSegmentsTitle: "सेगमेंट के हिसाब से दीवारें",
    wallSegmentsSubtitle: "वही दीवारें चुने हुए आयाम के हिसाब से बँटी हुईं।",
    wallEmpty: "इस अवधि में कोई दीवार से नहीं टकराया।",
    signupTitle: "साइन-अप कन्फ़र्मेशन",
    signupSubtitle:
      "हर स्टेप पर लीड, स्टेप के होने के दिन के हिसाब से। ड्रॉप-ऑफ़ दिखाता है कि साइन अप कहाँ दम तोड़ते हैं।",
    signupTrackedHint:
      "{{date}} से ट्रैक: पहले के साइन अप ने सिर्फ़ अपनी विफलताएँ दर्ज छोड़ीं।",
    started: "शुरू हुए",
    emailSent: "ईमेल भेजा",
    sendFailed: "भेजना फ़ेल",
    bounced: "बाउंस",
    expired: "एक्सपायर",
    expiredHint: "भेजना फ़ेल: {{failed}} · याद दिलाया: {{reminded}}",
    reminded: "याद दिलाया",
    confirmed: "कन्फ़र्म",
    confirmRate: "कन्फ़र्म दर",
    ofStarted: "{{total}} में से {{count}} शुरू हुए",
    signupSegmentsTitle: "सेगमेंट के हिसाब से साइन-अप स्टेप",
    signupSegmentsSubtitle: "वही स्टेप चुने हुए आयाम के हिसाब से बँटे हुए।",
    signupEmpty: "इस अवधि में कोई साइन-अप गतिविधि नहीं।",
    signupLost: "ईमेल पर खोए",
    signupLostHint: "कन्फ़र्म होने से पहले बाउंस, फ़ेल या एक्सपायर हुए",
    loading: "फ़नल लोड हो रहा है...",
    cohortHint: "बने {{count}} लीड में से",
    signupRate: "साइन-अप दर",
    payRate: "भुगतान दर",
    overallRate: "लीड से भुगतानकर्ता",
    overallShort: "भुगतानकर्ता तक",
    ofHumans: "{{total}} गैर-बॉट लीड में से {{count}}",
    ofSignups: "{{total}} साइन अप में से {{count}}",
    funnelTitle: "कोहोर्ट फ़नल",
    funnelSubtitle:
      "गैर-बॉट लीड (ब्राउज़र या बिना user agent) से फ़नल। बॉट और रॉ लीड: पहला कार्ड देखें।",
    trendTitle: "बनने के दिन के हिसाब से कोहोर्ट",
    trendSubtitle: "गैर-बॉट लीड और उनमें से कितने कन्वर्ट हुए।",
    segmentsTitle: "सेगमेंट के हिसाब से फ़नल",
    segmentsSubtitle: "दरें प्रति गैर-बॉट लीड हैं। लीड देखने के लिए पंक्ति पर क्लिक करें।",
    filtersTitle: "सेगमेंट",
    filtersSubtitle: "इस पेज का हर आँकड़ा सीमित करें।",
    apply: "लागू करें",
    empty: "इस अवधि में कोई लीड नहीं।",
  },
};
