import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "न्यूज़लेटर",
  tags: {
    newsletter: "न्यूज़लेटर",
  },
  token: {
    label: "कन्फ़र्मेशन कोड",
    description: "आपके वेलकम ईमेल के लिंक वाला कोड",
    placeholder: "ईमेल से कोड पेस्ट करें",
  },
  response: {
    confirmed: "कन्फ़र्म हुआ",
    email: "ईमेल",
    bonusCredits: "हर महीने के बोनस क्रेडिट",
  },
  post: {
    title: "न्यूज़लेटर ईमेल कन्फ़र्म करें",
    titleShort: "ईमेल कन्फ़र्म करें",
    description:
      "वेलकम ईमेल के कोड से न्यूज़लेटर पता कन्फ़र्म करें। इससे हर महीने का फ़्री क्रेडिट बोनस अनलॉक होता है।",
    errors: {
      validation: {
        title: "गलत कोड",
        description: "कन्फ़र्मेशन कोड नहीं है या गलत फ़ॉर्मेट में है",
      },
      notFound: {
        title: "लिंक एक्सपायर या गलत है",
        description:
          "यह कन्फ़र्मेशन लिंक सही नहीं है। नया लिंक पाने के लिए फिर से सब्सक्राइब करें।",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "लॉग इन ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस की अनुमति नहीं है",
      },
      internal: {
        title: "कन्फ़र्म नहीं हो पाया",
        description: "हमारी तरफ़ कुछ गड़बड़ हुई। लिंक फिर से खोलें।",
      },
    },
    success: {
      title: "ईमेल कन्फ़र्म हो गया",
      description: "बोनस आपके फ़्री अकाउंट पर लागू है",
    },
  },
  widget: {
    heroTitle: "एक क्लिक। हर महीने +{{bonusCredits}} क्रेडिट।",
    heroDescription:
      "अपना पता कन्फ़र्म करें। फ़्री अकाउंट पर बोनस तुरंत आपकी लिमिट में जुड़ जाता है।",
    confirmButton: "मेरा ईमेल कन्फ़र्म करें",
    confirming: "कन्फ़र्म हो रहा है...",
    confirmedTitle:
      "कन्फ़र्म हो गया। आपके फ़्री अकाउंट पर हर महीने +{{bonusCredits}} क्रेडिट।",
    confirmedDescription:
      "लॉग इन हैं? बोनस पहले से आपके फ़्री बैलेंस में है और सब्सक्राइब रहने तक हर महीने रिन्यू होता है। अकाउंट नहीं है? इसे अनलॉक करने के लिए इसी ब्राउज़र में फ़्री में साइन अप करें।",
    startChatting: "चैट शुरू करें",
  },
};
