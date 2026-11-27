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
    title: "दुरुपयोग के संकेत",
    titleShort: "दुरुपयोग",
    description:
      "एक नेटवर्क या एक user agent से लीड और साइन-अप की बाढ़, और बिना साइन अप किए विज़िटर के खर्च किए फ़्री क्रेडिट। हर पंक्ति संबंधित लीड खोलती है।",
    fields: {
      minLeads: {
        label: "बाढ़ की सीमा",
        description: "अवधि में एक क्लस्टर से कितने लीड आएँ तो वह बाढ़ गिनी जाए",
      },
    },
    response: {
      window: "अवधि",
      groupByUsed: "इस हिसाब से ग्रुप",
      minLeadsUsed: "बाढ़ की सीमा",
      kpis: "मुख्य आँकड़े",
      trend: "फ़्लैग किए क्लस्टर के लीड",
      clusters: "क्लस्टर",
      burners: "सबसे ज़्यादा फ़्री क्रेडिट जलाने वाले",
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
        description: "दुरुपयोग रिपोर्ट की गणना नहीं हो सकी।",
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
      description: "दुरुपयोग रिपोर्ट लोड हुई।",
    },
  },
  widget: {
    fast: "तेज़",
    noIp: "IP नहीं",
    perHour: "लीड/घंटा",
    thresholdOption: "{{count}}+ लीड",
    loading: "दुरुपयोग के संकेत लोड हो रहे हैं...",
    flaggedPrefixes: "फ़्लैग किए नेटवर्क",
    flaggedAgents: "फ़्लैग किए एजेंट",
    thresholdHint: "अवधि में {{count}}+ लीड",
    flaggedLeads: "बाढ़ में आए लीड",
    flaggedShare: "नए लीड का {{percent}}%",
    freeCredits: "जले हुए फ़्री क्रेडिट",
    freeCreditsHint: "बिना अकाउंट वाले विज़िटर द्वारा",
    burners: "क्रेडिट जलाने वाले विज़िटर",
    burnersHint: "फ़्री क्रेडिट खर्च करते गैर-यूज़र",
    trendTitle: "बाढ़ के लीड",
    trendSubtitle: "बाढ़ = अवधि में {{count}}+ लीड वाले क्लस्टर।",
    seriesFlagged: "बाढ़ से",
    seriesOther: "बाकी लीड",
    clustersIpTitle: "नेटवर्क के हिसाब से बाढ़",
    clustersUaTitle: "user agent के हिसाब से बाढ़",
    clustersSubtitle:
      "प्रति घंटे लीड के हिसाब से क्रमबद्ध। तेज़ = {{rate}}+ लीड/घंटा। लीड देखने के लिए पंक्ति पर क्लिक करें।",
    prefix: "नेटवर्क",
    userAgent: "User agent",
    prefixes: "अलग-अलग नेटवर्क",
    agents: "अलग-अलग एजेंट",
    noClusters: "इस अवधि में कोई क्लस्टर {{count}} लीड तक नहीं पहुँचा।",
    burnersTitle: "सबसे ज़्यादा फ़्री क्रेडिट जलाने वाले",
    burnersSubtitle: "बिना अकाउंट वाले विज़िटर। लीड खोलने के लिए क्लिक करें।",
    lead: "लीड",
    requests: "रिक्वेस्ट",
    noBurners: "इस अवधि में गैर-यूज़र ने कोई फ़्री क्रेडिट नहीं जलाया।",
    filtersTitle: "सेगमेंट",
    filtersSubtitle: "इस पेज का हर आँकड़ा सीमित करें।",
    apply: "लागू करें",
  },
};
