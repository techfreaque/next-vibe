import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "रेफ़रल",
  tags: {
    referral: "referral",
    admin: "admin",
  },
  post: {
    title: "रेफ़रल कोड बोनस",
    titleShort: "कोड बोनस",
    description:
      "वो एकमुश्त बोनस क्रेडिट तय करें जो रेफ़रल कोड अपने लाए लोगों को देता है। उनके पहले पेड प्लान पर मिलता है, फ़्री साइनअप पर कभी नहीं। 0 बोनस हटा देता है।",
    fields: {
      code: {
        label: "रेफ़रल कोड",
        description: "बदलने वाला कोड (अपरकेस-लोअरकेस मायने नहीं रखता)",
        placeholder: "krysalid",
      },
      bonusCredits: {
        label: "बोनस क्रेडिट",
        description:
          "पहले पेड प्लान के साथ एक बार दिए जाने वाले क्रेडिट। 0 = कोई बोनस नहीं।",
        placeholder: "100",
      },
    },
    response: {
      code: "कोड",
      ownerEmail: "कोड का मालिक",
      previousBonusCredits: "पिछला बोनस",
      subscriptionBonusCredits: "बोनस क्रेडिट",
    },
    widget: {
      back: "वापस",
      hint: 'साइनअप पर "आपके पहले सब्सक्रिप्शन के साथ +N बोनस क्रेडिट" के रूप में दिखता है। हर यूज़र को एक बार दिया जाता है।',
      submit: "बोनस सेव करें",
      set: "{{code}} ({{owner}}): पहले प्लान के साथ +{{credits}} क्रेडिट (पहले {{previous}})।",
      cleared: "{{code}} ({{owner}}): कोई बोनस नहीं (पहले {{previous}})।",
    },
  },
  errors: {
    validation: {
      title: "गलत इनपुट",
      description: "कोड और क्रेडिट की रकम जाँचें",
    },
    unauthorized: {
      title: "साइन इन नहीं हैं",
      description: "कोड बोनस सेट करने के लिए एडमिन के रूप में साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "सिर्फ़ एडमिन कोड बोनस सेट कर सकते हैं",
    },
    notFound: {
      title: "नहीं मिला",
      description: "कोड मौजूद नहीं है",
    },
    conflict: {
      title: "टकराव",
      description: "इस बीच कोड बदल गया, दोबारा कोशिश करें",
    },
    server: {
      title: "सर्वर एरर",
      description: "बोनस सेव नहीं हो सका",
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
    codeNotFound: "रेफ़रल कोड {{code}} मौजूद नहीं है",
  },
  success: {
    title: "सेव हो गया",
    description: "कोड बोनस अपडेट हो गया",
  },
};
