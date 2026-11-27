import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "लीड",
  tag: "IP मैच लिंकिंग",
  task: {
    description:
      "एक ही IP पता साझा करने वाली अनाम लीड स्कैन करें और उन्हें एक ही व्यक्ति के रूप में लिंक करें",
  },
  post: {
    title: "IP मैच लिंकिंग",
    titleShort: "IP लिंकिंग",
    description: "एक ही IP पता साझा करने वाली अनाम लीड लिंक करें",
    container: {
      title: "IP मैच लिंकिंग",
      description:
        "समय-सीमा में बनी, मेल खाते IP वाली अनाम लीड खोजता है और उन्हें लिंक करता है",
    },
    fields: {
      dryRun: {
        label: "ड्राई रन",
        description: "बदलाव किए बिना चलाएँ",
      },
      windowDays: {
        label: "विंडो (दिन)",
        description: "सिर्फ़ उन लीड को मैच करें जो एक-दूसरे से इतने दिनों के भीतर बनीं",
      },
    },
    response: {
      pairsFound: "मिली जोड़ियाँ",
      pairsLinked: "लिंक की गई जोड़ियाँ",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस मना है",
      },
      server: {
        title: "सर्वर एरर",
        description: "IP मैच लिंकिंग चलाते समय एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
    },
    success: {
      title: "IP मैच लिंकिंग पूरी हुई",
      description: "IP से मैच हुई लीड सफलतापूर्वक लिंक हो गईं",
    },
  },
};
