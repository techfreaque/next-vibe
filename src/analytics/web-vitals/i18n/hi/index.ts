import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एनालिटिक्स",
  tags: {
    performance: "परफ़ॉर्मेंस",
    seo: "SEO",
  },

  enums: {
    metric: {
      lcp: "Largest Contentful Paint",
      inp: "Interaction to Next Paint",
      cls: "Cumulative Layout Shift",
      ttfb: "Time to First Byte",
      fcp: "First Contentful Paint",
    },
    rating: {
      good: "अच्छा",
      needsImprovement: "सुधार की ज़रूरत",
      poor: "ख़राब",
    },
    device: {
      mobile: "मोबाइल",
      desktop: "डेस्कटॉप",
    },
    pageType: {
      storyHome: "होम",
      storyPage: "स्टोरी पेज",
      blogIndex: "ब्लॉग इंडेक्स",
      blogPost: "ब्लॉग पोस्ट",
      storyCompare: "तुलना पेज",
      models: "मॉडल सूची",
      modelDetail: "मॉडल पेज",
      modelCompare: "मॉडल बनाम",
      modelChangelog: "मॉडल चेंजलॉग",
      skill: "स्किल पेज",
      skills: "स्किल सूची",
      docs: "डॉक्स",
      help: "हेल्प",
      pricing: "प्राइसिंग",
      create: "मीडिया क्रिएशन",
      threads: "चैट",
      account: "अकाउंट",
      tools: "टूल्स",
      other: "अन्य",
    },
  },

  fields: {
    metric: "मेट्रिक",
    value: "मान",
    rating: "रेटिंग",
    navigationType: "नेविगेशन प्रकार",
    path: "पेज पाथ",
    device: "डिवाइस",
    metrics: "माप",
    days: "दिन",
    pageType: "पेज प्रकार",
    samples: "सैंपल",
    p75: "p75",
    goodShare: "अच्छा",
    poorShare: "ख़राब",
  },

  post: {
    title: "Web Vitals रिपोर्ट करें",
    titleShort: "Vitals रिपोर्ट करें",
    description:
      "एक पेज व्यू के असली-यूज़र Core Web Vitals (LCP, INP, CLS, TTFB, FCP) स्टोर करें।",
    recorded: "स्टोर हुआ",
    success: {
      title: "Vitals स्टोर हुए",
      description: "माप स्टोर हो गए।",
    },
  },

  get: {
    title: "Web Vitals",
    titleShort: "Web Vitals",
    description:
      "हर पेज प्रकार के असली-यूज़र Core Web Vitals: p75 और अच्छी और ख़राब विज़िट का हिस्सा।",
    empty: "इस अवधि में अभी कोई माप नहीं।",
    since: "से",
    total: "माप",
    targets: "p75 पर लक्ष्य: LCP 2.5 s से कम, INP 200 ms से कम, CLS 0.1 से कम।",
    success: {
      title: "Web Vitals लोड हुए",
      description: "हर पेज प्रकार के असली-यूज़र माप।",
    },
  },

  errors: {
    validation: {
      title: "माप गलत हैं",
      description: "भेजे गए मान जाँचें।",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "रिक्वेस्ट सर्वर तक नहीं पहुँची।",
    },
    unauthorized: {
      title: "साइन इन ज़रूरी है",
      description: "यह रिपोर्ट देखने के लिए साइन इन करें।",
    },
    forbidden: {
      title: "एक्सेस नहीं",
      description: "सिर्फ़ एडमिन।",
    },
    notFound: {
      title: "नहीं मिला",
      description: "कुछ नहीं मिला।",
    },
    server: {
      title: "सर्वर एरर",
      description: "माप प्रोसेस नहीं हो सके।",
    },
    unknown: {
      title: "अनजान एरर",
      description: "कुछ अप्रत्याशित हुआ।",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव सेव करें या छोड़ दें।",
    },
    conflict: {
      title: "टकराव",
      description: "इस बीच डेटा बदल गया।",
    },
  },
};
