import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/hi";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "रेफ़रल",
  tags: {
    referral: "referral",
    admin: "admin",
    analytics: "analytics",
  },
  enums: {
    sort: {
      revenue: "आय",
      commission: "कमीशन",
      payers: "पेड यूज़र",
      signups: "साइनअप",
      leads: "लीड",
      clicks: "क्लिक",
      conversion: "क्लिक से साइनअप",
      ownerQueue: "मालिक पेआउट कतार",
      ownerFree: "मालिक का चुकाने लायक़ बैलेंस (सबसे कम पहले)",
      newest: "सबसे नया कोड",
    },
  },
  get: {
    title: "रेफ़रल ओवरव्यू",
    titleShort: "ओवरव्यू",
    description:
      "हर रेफ़रल कोड और पार्टनर एक नज़र में: क्लिक, लीड, साइनअप, पेड यूज़र, आय, कमीशन और पेआउट कतार, पिछली अवधि से तुलना के साथ।",
    fields: {
      search: {
        label: "खोजें",
        description: "कोड, लेबल या मालिक का ईमेल",
        placeholder: "कोड, लेबल या मालिक का ईमेल",
      },
      ownerUserId: {
        label: "मालिक",
        description: "सिर्फ़ इस पार्टनर के कोड (यूज़र ID)",
      },
      activeOnly: {
        label: "सिर्फ़ सक्रिय कोड",
        description: "निष्क्रिय किए गए कोड छिपाएँ",
      },
      sortBy: {
        label: "कोड इस हिसाब से सॉर्ट करें",
        description: "प्रति-कोड टेबल का क्रम",
      },
      limit: {
        label: "दिखाए गए कोड",
        description: "प्रति-कोड टेबल में अधिकतम पंक्तियाँ",
      },
    },
    response: {
      window: "अवधि",
      kpis: "मुख्य आँकड़े",
      trend: "ट्रेंड",
      codes: "कोड",
      codesTotal: "दायरे में कोड",
      overCommittedOwners: "ज़रूरत से ज़्यादा प्रतिबद्ध मालिक",
      payouts: "पेआउट कतार",
    },
    widget: {
      subtitle: "पिछली अवधि के मुक़ाबले हर पार्टनर कोड के क्लिक, साइनअप, आय और कमीशन।",
      kpi: {
        clicks: "क्लिक",
        clicksHint: "कोड के साथ ब्राउज़र आगमन",
        leads: "लीड",
        leadsHint: "कोड को श्रेय पाने वाले विज़िटर",
        signups: "साइनअप",
        signupsHint: "क्लिक का {{rate}}",
        payers: "पेड यूज़र",
        payersHint: "इस अवधि में पेमेंट करने वाले रेफ़र किए यूज़र",
        revenue: "आय",
        revenueHint: "रेफ़र किए यूज़र का भुगतान",
        commission: "कमाया कमीशन",
        commissionHint: "{{pending}} होल्ड पर, {{confirmed}} पक्के",
        payoutsPaid: "चुकाए गए पेआउट",
        payoutsPaidHint: "इस अवधि में पूरे हुए",
        queue: "पेआउट कतार",
        queueHint: "{{count}} खुले अनुरोध",
        queueEmpty: "कुछ इंतज़ार में नहीं",
      },
      chart: {
        traffic: "ट्रैफ़िक",
        trafficSub: "क्लिक और श्रेय पाई लीड",
        conversions: "कन्वर्ज़न",
        conversionsSub: "नए साइनअप और पेड यूज़र",
        money: "आय और कमीशन",
        moneySub: "USD में, पेमेंट की तारीख़ के हिसाब से",
      },
      series: {
        clicks: "क्लिक",
        leads: "लीड",
        signups: "साइनअप",
        payers: "पेड यूज़र",
        revenue: "आय",
        commission: "कमीशन",
      },
      table: {
        title: "कोड",
        subtitle:
          "{{total}} में से {{shown}} कोड। रिपोर्ट के लिए किसी कोड पर क्लिक करें।",
        dimension: "कोड",
        clicks: "क्लिक",
        leads: "लीड",
        signups: "साइनअप",
        payers: "पेमेंट करने वाले",
        conversion: "क्लिक से साइनअप",
        revenue: "आय",
        commission: "कमीशन",
        signupsChange: "साइनअप बनाम पिछली अवधि",
        ownerQueue: "मालिक कतार",
        ownerFree: "मालिक का चुकाने लायक़ बैलेंस",
        inactive: "inactive",
        overCommitted: "over-committed",
        overCommittedOwners: "{{count}} मालिक ज़रूरत से ज़्यादा प्रतिबद्ध",
        empty: "इन फ़िल्टर से कोई कोड मेल नहीं खाता।",
        sort: "सॉर्ट",
      },
      payouts: {
        title: "स्थिति के हिसाब से पेआउट",
        subtitle:
          "सभी अनुरोधों की मौजूदा स्थिति। सूची पर काम करने के लिए किसी स्थिति पर क्लिक करें।",
        dimension: "स्थिति",
        count: "अनुरोध",
        amount: "रकम",
        open: "खुले पेआउट",
        empty: "अभी कोई पेआउट अनुरोध नहीं।",
      },
      filters: {
        search: "खोजें",
        owner: "मालिक",
        activeOnly: "सिर्फ़ सक्रिय",
        searchPlaceholder: "कोड, लेबल या मालिक का ईमेल",
      },
      loading: "रेफ़रल ओवरव्यू लोड हो रहा है",
      cli: {
        payouts: "पेआउट कतार: {{count}} खुले, {{amount}}",
      },
    },
  },
  errors: {
    validation: {
      title: "फ़िल्टर गलत हैं",
      description: "अवधि और फ़िल्टर जाँचें",
    },
    unauthorized: {
      title: "साइन इन नहीं है",
      description: "रेफ़रल एनालिटिक्स देखने के लिए एडमिन के रूप में साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "सिर्फ़ एडमिन रेफ़रल एनालिटिक्स देख सकते हैं",
    },
    notFound: {
      title: "नहीं मिला",
      description: "इन फ़िल्टर से कुछ मेल नहीं खाता",
    },
    conflict: {
      title: "टकराव",
      description: "लोड होते समय डेटा बदल गया, फिर कोशिश करें",
    },
    server: {
      title: "सर्वर एरर",
      description: "रेफ़रल ओवरव्यू नहीं बन सका",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "रिक्वेस्ट सर्वर तक नहीं पहुँची",
    },
    unknown: {
      title: "अनजान एरर",
      description: "कुछ अप्रत्याशित फ़ेल हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव सेव करें या छोड़ दें",
    },
  },
  success: {
    title: "लोड हुआ",
    description: "रेफ़रल ओवरव्यू लोड हुआ",
  },
};
