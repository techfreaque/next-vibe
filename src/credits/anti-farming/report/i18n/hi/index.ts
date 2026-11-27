import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { antiFarming: "anti-farming", admin: "admin" },
  get: {
    title: "फ़्री क्रेडिट फ़ार्मिंग रिपोर्ट",
    titleShort: "फ़ार्मिंग रिपोर्ट",
    description:
      "फ़्री क्रेडिट कौन फ़ार्म कर रहा है। ब्लॉक की गई कोशिशों और क्लेम किए गए फ़्री पूल के हिसाब से टॉप सबनेट, डुप्लिकेट और डिस्पोज़ेबल साइनअप में टॉप ईमेल डोमेन, और चालू सीमाएँ।",
    fields: {
      days: {
        label: "विंडो (दिन)",
        description:
          "ब्लॉक की गई कोशिशों, गेस्ट पूल और ईमेल डोमेन के लिए इतने दिन पीछे देखें। अकाउंट पूल हमेशा मौजूदा UTC महीना गिनते हैं।",
      },
    },
    response: {
      window: "विंडो",
      thresholds: "चालू सीमाएँ",
      totals: "ब्लॉक की गई कोशिशें",
      subnetsByBlocked: "ब्लॉक कोशिशों के हिसाब से टॉप सबनेट",
      subnetsByClaims: "क्लेम किए गए फ़्री पूल के हिसाब से टॉप सबनेट",
      emailDomains: "टॉप ईमेल डोमेन",
    },
    success: {
      title: "फ़ार्मिंग रिपोर्ट तैयार",
      description: "एंटी-फ़ार्मिंग रिपोर्ट बन गई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "पहले साइन इन करें",
      },
      forbidden: { title: "अनुमति नहीं", description: "सिर्फ़ एडमिन" },
      server: {
        title: "सर्वर एरर",
        description: "फ़ार्मिंग रिपोर्ट नहीं बन सकी",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ गलत हो गया",
      },
      validation: {
        title: "गलत रिक्वेस्ट",
        description: "दिन 1 से 365 के बीच होने चाहिए",
      },
      notFound: { title: "नहीं मिला", description: "कुछ नहीं मिला" },
      conflict: { title: "टकराव", description: "रिक्वेस्ट में टकराव है" },
      network: {
        title: "नेटवर्क एरर",
        description: "रिक्वेस्ट सर्वर तक नहीं पहुँची",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले अपने बदलाव सेव करें",
      },
    },
  },
  widget: {
    shadowHits:
      "शैडो मोड: {{crawler}} क्रॉलर रिक्वेस्ट, {{cluster}} क्लस्टर चार्ज, {{model}} मॉडल चार्ज।",
    refresh: "रीफ़्रेश करें",
    loading: "फ़ार्मिंग रिपोर्ट लोड हो रही है...",
    windowLine: "पिछले {{days}} दिन ({{from}} से)। अकाउंट पूल: {{month}} (UTC)।",
    kpi: {
      total: "कुल ब्लॉक",
      subnetAccountLimit: "अकाउंट सीमा पूरी",
      subnetGuestLimit: "गेस्ट सीमा पूरी",
      duplicateEmail: "डुप्लिकेट ईमेल",
      disposableEmail: "डिस्पोज़ेबल ईमेल",
      subnetSignupLimit: "साइनअप सीमा पूरी",
    },
    col: {
      subnet: "सबनेट",
      blocked: "ब्लॉक",
      accountGranted: "अकाउंट ठीक",
      accountBlocked: "अकाउंट ना",
      guestGranted: "गेस्ट ठीक",
      guestBlocked: "गेस्ट ना",
      lastSeen: "आख़िरी बार देखा",
      domain: "डोमेन",
      duplicate: "डुप्लिकेट",
      disposable: "डिस्पोज़ेबल",
      total: "कुल",
    },
    colHint:
      "अकाउंट = इस महीने के अकाउंट पूल, गेस्ट = विंडो के गेस्ट पूल। ठीक = फ़्री क्रेडिट मिले, ना = सबनेट का बजट भर गया।",
    empty: {
      subnets: "इस विंडो में कोई सबनेट गतिविधि नहीं।",
      domains: "इस विंडो में कोई डुप्लिकेट या डिस्पोज़ेबल साइनअप नहीं।",
    },
    limits: {
      accountPerSubnet: "हर सबनेट के अकाउंट पूल प्रति माह",
      guestPerSubnet: "हर सबनेट के गेस्ट पूल प्रति दिन",
      guestIpWindow: "एक IP के गेस्ट इतने समय तक एक पूल साझा करते हैं (घंटे)",
      signupLookback: "गेस्ट ख़र्च साइनअप में इतने समय से जुड़ता है (घंटे)",
      subnetPrefix: "सबनेट साइज़",
      signupsPerSubnet: "हर सबनेट के नए अकाउंट प्रति 24 घंटे",
    },
  },
};
