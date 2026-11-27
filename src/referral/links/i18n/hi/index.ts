import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "रेफ़रल",
  tags: {
    referral: "referral",
    links: "links",
  },
  get: {
    title: "मेरे ट्रैक्ड लिंक",
    titleShort: "ट्रैक्ड लिंक",
    description:
      "आपके रेफ़रल लिंक, हर प्लेसमेंट के लिए एक, हर एक के विज़िट, साइन अप और कमाई के साथ।",
    response: {
      links: "लिंक",
    },
    widget: {
      title: "ट्रैक्ड लिंक",
      subtitle:
        "हर प्लेसमेंट के लिए एक लिंक। देखें कि कौन सा वीडियो, पोस्ट या न्यूज़लेटर असल में कमाई करा रहा है।",
      create: "नया लिंक",
      refresh: "रिफ़्रेश करें",
      loading: "आपके लिंक लोड हो रहे हैं...",
      copy: "कॉपी करें",
      copied: "कॉपी हो गया",
      visits: "विज़िट",
      signups: "साइन अप",
      paid: "पेइंग",
      earned: "कमाया",
      pending: "{{amount}} पेंडिंग",
      code: "कोड {{code}}",
      landsOn: "{{path}} पर पहुँचता है",
      empty: {
        title: "अभी कोई ट्रैक्ड लिंक नहीं",
        hint: "हर वीडियो, पोस्ट या न्यूज़लेटर के लिए एक बनाएँ। हर विज़िट, साइन अप और पेमेंट उसी के नाम गिना जाता है।",
        cta: "अपना पहला लिंक बनाएँ",
      },
      cli: {
        header: "{{count}} ट्रैक्ड लिंक",
        funnel:
          "{{visits}} विज़िट, {{signups}} साइन अप, {{paid}} पेइंग, {{earned}} कमाई ({{pending}} पेंडिंग)",
      },
    },
  },
  post: {
    title: "ट्रैक्ड लिंक बनाएँ",
    titleShort: "नया लिंक",
    description:
      "किसी एक प्लेसमेंट के लिए रेफ़रल लिंक बनाएँ। इसमें आपका रेफ़रल कोड और UTM टैग होते हैं, ताकि हर विज़िट, साइन अप और पेमेंट लिंक के हिसाब से गिना जाए।",
    submit: "लिंक बनाएँ",
    fields: {
      name: {
        label: "नाम",
        description: "यह सिर्फ़ आपको दिखता है। प्लेसमेंट का नाम रखें।",
        placeholder: "YouTube रिव्यू, नवंबर",
      },
      source: {
        label: "आप इसे कहाँ पोस्ट करेंगे",
        description: "प्लेटफ़ॉर्म या साइट, जैसे youtube, newsletter, x",
        placeholder: "youtube",
      },
      campaign: {
        label: "कैंपेन",
        description: "लिंक्स को ग्रुप करता है, जैसे एक वीडियो या एक इश्यू। वैकल्पिक।",
        placeholder: "uncensored-ai-review",
      },
      medium: {
        label: "मीडियम",
        description: "प्लेसमेंट का प्रकार। डिफ़ॉल्ट referral है।",
        placeholder: "video",
      },
      destinationPath: {
        label: "लैंडिंग पेज",
        description: "इस साइट पर वह पाथ जहाँ विज़िटर पहुँचेंगे",
        placeholder: "/",
      },
      code: {
        label: "रेफ़रल कोड",
        description:
          "आपके कोड में से एक। खाली छोड़ने पर आपका पहला एक्टिव कोड इस्तेमाल होता है।",
        placeholder: "MYCODE",
      },
    },
    response: {
      id: "लिंक ID",
      url: "लिंक",
      code: "रेफ़रल कोड",
    },
    widget: {
      back: "वापस",
      hint: "हर प्लेसमेंट के लिए एक लिंक। फिर आप ठीक-ठीक देखते हैं कि कौन सा पेइंग यूज़र ला रहा है।",
      presets: "आप इसे कहाँ शेयर करेंगे?",
      created: "आपका लिंक तैयार है",
      copy: "कॉपी करें",
      copied: "कॉपी हो गया",
    },
  },
  errors: {
    validation: {
      title: "अमान्य इनपुट",
      description: "हाइलाइट किए फ़ील्ड जाँचें",
    },
    unauthorized: {
      title: "साइन इन नहीं हैं",
      description: "अपने लिंक मैनेज करने के लिए साइन इन करें",
    },
    forbidden: {
      title: "अनुमति नहीं है",
      description: "आप इन लिंक को मैनेज नहीं कर सकते",
    },
    notFound: {
      title: "नहीं मिला",
      description: "वह लिंक मौजूद नहीं है",
    },
    conflict: {
      title: "टकराव",
      description: "इस बीच कुछ बदल गया, रीलोड करके दोबारा कोशिश करें",
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
      description: "कुछ अनपेक्षित विफल हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव सेव करें या छोड़ दें",
    },
    noCode: "पहले अपना रेफ़रल कोड बनाएँ। आपके ट्रैक्ड लिंक उसी पर बनते हैं।",
    notYourCode: "कोड {{code}} आपके एक्टिव रेफ़रल कोड में से नहीं है",
    invalidDestination: "लैंडिंग पाथ / से शुरू होना चाहिए और इसी साइट पर रहना चाहिए",
  },
  success: {
    title: "हो गया",
    description: "लिंक तैयार",
  },
};
