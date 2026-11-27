import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "ऑस्ट्रिया (AT)",
      DE: "जर्मनी (DE)",
      XX: "जेनेरिक चार्ट (टैक्स दरें खुद सेट करें)",
      SK: "स्लोवाकिया (SK)",
    },
  },
  tags: {
    companies: "कंपनियाँ",
    onboard: "ऑनबोर्ड",
    setup: "सेटअप",
  },
  post: {
    title: "अकाउंटिंग सेट करें",
    titleShort: "अकाउंटिंग सेट करें",
    description:
      "अपना चार्ट ऑफ़ अकाउंट्स इंस्टॉल करें और पोस्टिंग के लिए कैश और बैंक अकाउंट तैयार करें।",
    companyId: {
      label: "कंपनी",
      description: "कंपनी",
    },
    country: {
      genericPreview: "जेनेरिक चार्ट जोड़ता है। इनवॉइस जारी करने से पहले टैक्स दरें सेट करें।",
      regionalPreview: "उस देश का चार्ट ऑफ़ अकाउंट्स और VAT प्रीसेट इस्तेमाल करता है।",
      label: "अकाउंटिंग टेम्पलेट",
      description:
        "वहाँ पंजीकृत कंपनी के लिए ऑस्ट्रिया या जर्मनी चुनें। बाकी देशों के लिए जेनेरिक चार्ट चुनें।",
      placeholder: "टेम्पलेट चुनें",
    },
    period: {
      title: "पहली अकाउंटिंग अवधि",
      open: "सेटअप के दौरान यह अवधि खोलें",
      description: "डिफ़ॉल्ट यह महीना है। कस्टम या सालाना अवधि के लिए तारीख़ें बदलें।",
      name: "अवधि का नाम",
      start: "शुरू की तारीख़",
      end: "खत्म की तारीख़",
      proposal: "प्रस्तावित अवधि {{name}}, {{start}} से {{end}}",
      kept: "आपका मौजूदा फ़िस्कल कैलेंडर वैसा ही रहेगा।",
      invalid: "अवधि का नाम और शुरू की तारीख़ पर या उसके बाद की खत्म तारीख़ डालें।",
      opened: "{{name}} पोस्टिंग के लिए खुली है।",
      view: "अकाउंटिंग अवधि देखें",
      viewHint: "अपना फ़िस्कल कैलेंडर देखें।",
      createHint: "पहली एंट्री पोस्ट करने से पहले तारीख़ें चुनें।",
    },
    errors: {
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "कंपनी ऑनबोर्ड करने के लिए साइन इन करें",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "सभी फ़ील्ड जाँचें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "एडमिन रोल ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "ऑनबोर्डिंग पूरी नहीं हो सकी",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      conflict: {
        title: "मौजूदा चार्ट दूसरे देश का टेम्पलेट इस्तेमाल करता है",
        description: "अकाउंटिंग टेम्पलेट बदलने से पहले मौजूदा चार्ट देखें।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "अपना कनेक्शन जाँचें",
      },
      notFound: {
        title: "कंपनी नहीं मिली",
        description: "यह कंपनी मौजूद नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      profileMismatch: "कंपनी प्रोफ़ाइल वाले देश का अकाउंटिंग टेम्पलेट चुनें।",
    },
    success: {
      title: "अकाउंटिंग सेटअप पूरा",
      description: "चार्ट तैयार है। अब आप अवधि खोलकर दस्तावेज़ बनाना शुरू कर सकते हैं।",
    },
    widget: {
      books: "बुक्स सेटअप",
      setupCounts: "चार्ट अकाउंट तैयार {{accounts}} · जोड़ी गई टैक्स दरें {{rates}}",
      invoiceHint:
        "इस कंपनी के लिए ड्राफ़्ट तैयार करें। जारी करने से पहले आप उसे देख सकते हैं।",
      submit: "अकाउंटिंग सेट करें",
      company: "कंपनी: {{name}}",
      back: "वापस",
      cashAndBankReady: "कैश और बैंक अकाउंट पोस्टिंग के लिए तैयार हैं।",
      nextHint: "एंट्री पोस्ट करने से पहले अकाउंटिंग अवधि खोलें।",
      period: "अवधि बनाएँ",
      invoice: "इनवॉइस ड्राफ़्ट बनाएँ",
    },
    response: {
      accountsCreated: "जोड़े गए अकाउंट",
      accountsSkipped: "मौजूदा अकाउंट",
      taxRatesCreated: "जोड़ी गई टैक्स दरें",
      cashAccountId: "कैश अकाउंट ID",
      bankAccountId: "बैंक अकाउंट ID",
      success: "सफल",
    },
  },
};
