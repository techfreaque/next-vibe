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
    title: "अधिग्रहण",
    titleShort: "अधिग्रहण",
    description:
      "विज़िटर और लीड कहाँ से आते हैं: चैनल, स्रोत, रेफ़रर, कैंपेन, लैंडिंग पेज, देश, डिवाइस, इंसान बनाम बॉट। हर आँकड़ा संबंधित लीड खोलता है।",
    response: {
      window: "अवधि",
      kpis: "मुख्य आँकड़े",
      trend: "ट्रेंड",
      breakdown: "ब्रेकडाउन",
      agents: "एजेंट",
      coverage: "ट्रैकिंग कवरेज",
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
        description: "अधिग्रहण रिपोर्ट की गणना नहीं हो सकी।",
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
      description: "अधिग्रहण रिपोर्ट लोड हुई।",
    },
  },
  widget: {
    revenue: "राजस्व",
    humanVisits: "इंसानी विज़िट",
    botVisits: "बॉट विज़िट",
    botVisitsHint: "{{count}} बॉट विज़िट",
    unknownLeadsHint: "{{count}} और बिना user agent (अज्ञात)",
    botsTitle: "बॉट लीड",
    botsSubtitle: "क्रॉलर, प्रिव्यू और स्क्रिप्ट। लीड देखने के लिए बार पर क्लिक करें।",
    loading: "अधिग्रहण रिपोर्ट लोड हो रही है...",
    pageSubtitle:
      "लीड कहाँ से आते हैं और कैसे कन्वर्ट होते हैं। लीड खोलने के लिए कोई भी आँकड़ा क्लिक करें।",
    coverage:
      "विज़िट {{date}} से ट्रैक होती हैं। पुराने लीड गिने जाते हैं, पर बिना विज़िट के।",
    botShareHint: "नए लीड का {{percent}}",
    leadsTitle: "इंसानी लीड",
    leadsSubtitle: "नए इंसानी लीड। लीड देखने के लिए बार पर क्लिक करें।",
    visitsTitle: "ट्रैक की गई विज़िट",
    visitsSubtitle: "ट्रैक की गई आमद। इंसान बनाम बॉट के रूप में वर्गीकृत लीड।",
    conversionsTitle: "साइन अप और भुगतान करने वाले",
    conversionsSubtitle: "हर स्टेप के होने के दिन के हिसाब से।",
    breakdownTitle: "लीड कहाँ से आते हैं",
    breakdownSubtitle: "पहला संपर्क। लीड देखने के लिए पंक्ति पर क्लिक करें।",
    agentsTitle: "कौन आता है",
    agentsSubtitle: "user agent से एजेंट परिवार।",
    filtersTitle: "सेगमेंट",
    filtersSubtitle: "इस पेज का हर आँकड़ा सीमित करें।",
    apply: "लागू करें",
    empty: "इस अवधि में कोई लीड नहीं।",
    emptyHint: "लंबी अवधि चुनें या फ़िल्टर साफ़ करें।",
  },
};
