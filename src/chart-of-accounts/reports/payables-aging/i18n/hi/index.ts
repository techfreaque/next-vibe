import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "सप्लायर देनदारियाँ",
  titleShort: "देनदारी की उम्र",
  description: "आप सप्लायर को कितना देते हैं, देरी के दिनों के हिसाब से।",
  tag: "देनदारी की उम्र",
  company: {
    label: "कंपनी",
    description: "वह कंपनी चुनें जिसके सप्लायर बिल आप देखना चाहते हैं।",
    choose: "कंपनी चुनें",
    empty: "सप्लायर को देय राशि देखने के लिए कंपनी चुनें।",
  },
  currency: {
    label: "करेंसी",
    description: "बिल एक करेंसी में दिखाएँ। राशियाँ कन्वर्ट नहीं होतीं।",
    default: "कंपनी की करेंसी",
    codes: {
      EUR: "EUR",
      USD: "USD",
      PLN: "PLN",
    },
  },
  agingDate: {
    label: "एजिंग की तारीख़",
    description: "वह तारीख़ जिससे बिल की देरी के दिन गिने जाते हैं।",
  },
  columns: {
    supplier: "सप्लायर",
    vat: "VAT नंबर",
    current: "देर नहीं",
    days1to30: "1-30 दिन",
    days31to60: "31-60 दिन",
    days61to90: "61-90 दिन",
    over90: "91+ दिन",
    undated: "देय तारीख़ नहीं",
    total: "कुल",
    billNumber: "बिल नंबर",
    billDate: "बिल की तारीख़",
    dueDate: "देय तारीख़",
    billAmount: "सेंट में राशि",
  },
  approved: {
    title: "मंज़ूर और अनचुकाए",
    empty: "चुकाने को कोई मंज़ूर बिल नहीं",
    emptyDescription: "बकाया बैलेंस वाले मंज़ूर बिल यहाँ दिखेंगे।",
  },
  received: {
    title: "मंज़ूरी का इंतज़ार",
    empty: "मंज़ूरी के इंतज़ार में कोई बिल नहीं",
    emptyDescription: "मंज़ूर होने तक प्राप्त बिल यहाँ दिखेंगे।",
  },
  disputed: {
    title: "विवादित",
    empty: "कोई विवादित बिल नहीं",
    emptyDescription: "विवादित बिल मंज़ूर और लंबित कुल से बाहर रखे जाते हैं।",
  },
  widget: {
    showBills: "बिल देखें",
    asOf: "{{date}} तक",
    back: "वापस",
    loading: "देनदारियाँ लोड हो रही हैं",
    details: "{{supplier}} के बिल",
    unknownSupplier: "अज्ञात सप्लायर",
    datedBill: "{{date}} का बिल",
    due: "देय {{date}}",
  },
  success: {
    title: "देनदारियाँ लोड हुईं",
    description: "चुनी हुई कंपनी के सप्लायर बिल देखने को तैयार हैं।",
  },
  errors: {
    validation: {
      title: "रिपोर्ट के फ़िल्टर जाँचें",
      description: "इस रिपोर्ट के लिए सही तारीख़ और करेंसी चुनें।",
    },
    unauthorized: {
      title: "साइन इन ज़रूरी है",
      description: "सप्लायर देनदारियाँ देखने के लिए साइन इन करें।",
    },
    forbidden: {
      title: "कंपनी उपलब्ध नहीं",
      description: "आपके पास इस कंपनी के सप्लायर बिल का एक्सेस नहीं है।",
    },
    notFound: {
      title: "नहीं मिला",
      description: "माँगा गया रिसोर्स नहीं मिला।",
    },
    server: {
      title: "देनदारियाँ लोड नहीं हुईं",
      description: "रिपोर्ट फिर लोड करके देखें।",
    },
    network: {
      title: "कनेक्शन उपलब्ध नहीं",
      description: "अपना कनेक्शन जाँचें और फिर कोशिश करें।",
    },
    conflict: {
      title: "रिपोर्ट टकराव",
      description: "रिफ़्रेश करें और रिपोर्ट फिर चलाएँ।",
    },
    unknown: {
      title: "अनपेक्षित एरर",
      description: "फिर कोशिश करें या सपोर्ट से संपर्क करें।",
    },
    unsavedChanges: {
      title: "बिना सेव बदलाव",
      description: "जाने से पहले अपने बदलाव रखें या छोड़ें।",
    },
  },
};
