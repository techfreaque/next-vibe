import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "POS",
    order: "ऑर्डर",
    removePayment: "पेमेंट हटाएँ",
  },
  enums: {
    paymentMethod: {
      cash: "कैश",
      card: "कार्ड",
      transfer: "ट्रांसफ़र",
      other: "अन्य",
    },
  },
  post: {
    title: "पेमेंट हटाएँ",
    titleShort: "पेमेंट हटाएँ",
    description:
      "खुली बिक्री से पेमेंट वापस हटाएँ। जब कोई टेंडर गलती से डल गया हो तब इस्तेमाल करें।",
    orderId: {
      label: "बिक्री",
      description: "वो खुली बिक्री जिसमें पेमेंट है",
    },
    paymentId: {
      label: "पेमेंट",
      description: "बिक्री से हटाने वाला पेमेंट",
    },
    response: {
      orderId: "बिक्री",
      paymentId: "हटाया गया पेमेंट",
      sessionId: "सेशन",
      currency: "करेंसी",
      totalPaid: "अब तक चुकाया",
      outstanding: "अब भी बकाया",
      remainingPayments: "बचे पेमेंट",
    },
    widget: {
      back: "बिक्री पर वापस",
      pickPayment: "हटाने वाला पेमेंट चुनें",
      noPayments: "इस बिक्री में हटाने लायक कोई पेमेंट नहीं।",
      notOpen: "सिर्फ़ खुली बिक्री के पेमेंट हटाए जा सकते हैं।",
      loading: "बिक्री लोड हो रही है",
      change: "चेंज {{amount}}",
      selected: "चुना गया",
      amount: "रकम",
      confirmTitle: "ये पेमेंट हटाएँ?",
      confirmDescription: "बिक्री खुली रहती है। उसके बाद सही पेमेंट लें।",
      confirm: "पेमेंट हटाएँ",
      cancel: "रद्द करें",
      stillDue: "अब भी बकाया",
      paidSoFar: "अब तक चुकाया",
      nothingPaid: "इस बिक्री में कोई पेमेंट नहीं बचा।",
    },
    success: {
      title: "पेमेंट हट गया",
      description: "बिक्री नए पेमेंट के लिए खुली है।",
    },
  },
  errors: {
    validation: {
      title: "पेमेंट जाँचें",
      description: "इसी बिक्री का कोई पेमेंट चुनें।",
    },
    unauthorized: {
      title: "साइन इन ज़रूरी है",
      description: "बिक्री बदलने के लिए साइन इन करें।",
    },
    forbidden: {
      title: "एक्सेस नहीं",
      description: "आप इस कंपनी की बिक्री नहीं बदल सकते।",
    },
    notFound: {
      title: "पेमेंट नहीं मिला",
      description: "ये पेमेंट अब बिक्री पर नहीं है।",
    },
    conflict: {
      title: "बिक्री खुली नहीं है",
      description: "पेमेंट तभी हट सकते हैं जब बिक्री और उसका सेशन खुले हों।",
    },
    server: {
      title: "पेमेंट नहीं हटा",
      description: "कुछ गलत हो गया। दोबारा कोशिश करें।",
    },
    unknown: {
      title: "पेमेंट नहीं हटा",
      description: "कुछ गलत हो गया। दोबारा कोशिश करें।",
    },
    network: {
      title: "कनेक्शन नहीं",
      description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें।",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "पहले अपने बदलाव पूरे करें या छोड़ें।",
    },
  },
};
