import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "कोटेशन",
  tags: {
    payment: "payment",
    estimate: "estimate",
    ar: "accounts-receivable",
  },
  post: {
    title: "कोटेशन बनाएँ",
    titleShort: "कोटेशन बनाएँ",
    description: "ड्राफ़्ट स्टेटस में नया सेल्स कोटेशन बनाएँ",
    form: {
      title: "नया कोटेशन",
      description: "कोटेशन का ब्योरा भरें",
    },
    response: {
      success: "कोटेशन बन गया",
      message: "स्टेटस मैसेज",
      estimate: {
        title: "कोटेशन",
        subtitle: "बना हुआ कोटेशन",
        id: "कोटेशन ID",
        companyId: "कंपनी ID",
        estimateNumber: "कोटेशन नंबर",
        status: "स्टेटस",
        customerId: "ग्राहक ID",
        customerEmail: "ग्राहक का ईमेल",
        customerName: "ग्राहक का नाम",
        currency: "मुद्रा",
        validUntil: "इस तारीख तक मान्य",
        title_field: "शीर्षक",
        notes: "नोट्स",
        terms: "शर्तें",
        subtotal: "उप-कुल",
        taxAmount: "टैक्स राशि",
        total: "कुल",
        invoiceId: "इनवॉइस ID",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "कोटेशन के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "इस कंपनी का एडमिन या अकाउंटेंट होना ज़रूरी है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कंपनी नहीं मिली",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "कोटेशन ड्राफ़्ट स्टेटस में बना",
    },
    widget: {
      otherRate: "अन्य दर",
      item: "विवरण",
      quantity: "मात्रा",
      price: "यूनिट कीमत",
      vatRate: "VAT %",
      add: "लाइन जोड़ें",
      remove: "लाइन हटाएँ",
      empty: "जिन सामान या सेवाओं का कोटेशन दे रहे हैं उन्हें जोड़ें।",
      summary: "सारांश",
      back: "वापस",
      submit: "कोटेशन बनाएँ",
      viewButton: "कोटेशन देखें",
    },
  },
  companyId: {
    label: "कंपनी ID",
    description: "यह कोटेशन जारी करने वाली कंपनी",
    placeholder: "कंपनी ID डालें",
  },
  customerId: {
    label: "ग्राहक ID",
    description: "वैकल्पिक: ग्राहक का UUID",
    placeholder: "ग्राहक ID डालें",
  },
  customerEmail: {
    label: "ग्राहक का ईमेल",
    description: "ग्राहक का ईमेल पता",
    placeholder: "customer@example.com",
  },
  customerName: {
    label: "ग्राहक का नाम",
    description: "ग्राहक का नाम",
    placeholder: "ग्राहक का नाम डालें",
  },
  currency: {
    code: "{{code}}",
    label: "मुद्रा",
    description: "कोटेशन की मुद्रा",
    placeholder: "कंपनी की मुद्रा",
  },
  validUntil: {
    label: "इस तारीख तक मान्य",
    description: "वह तारीख जब तक यह कोटेशन मान्य है",
    placeholder: "समाप्ति की तारीख चुनें",
  },
  title: {
    label: "शीर्षक",
    description: "इस कोटेशन का छोटा शीर्षक",
    placeholder: "जैसे वेबसाइट रीडिज़ाइन कोटेशन",
  },
  notes: {
    label: "नोट्स",
    description: "कोटेशन पर दिखने वाले वैकल्पिक नोट्स",
    placeholder: "जैसे कीमतें 30 दिन मान्य",
  },
  terms: {
    label: "शर्तें",
    description: "भुगतान या डिलीवरी की शर्तें",
    placeholder: "जैसे 50% पहले, 50% डिलीवरी पर",
  },
  lines: {
    label: "लाइन आइटम",
    description: "इस कोटेशन में शामिल आइटम",
  },
};
