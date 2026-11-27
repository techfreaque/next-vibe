import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "payment",
    bill: "bill",
    ap: "accounts-payable",
  },
  post: {
    title: "नया सप्लायर बिल",
    titleShort: "नया सप्लायर बिल",
    description: "सप्लायर और लाइनें दर्ज करें, फिर ड्राफ़्ट सेव करें।",
    form: {
      title: "नया सप्लायर बिल",
      description: "आपको मिले बिल का ब्योरा भरें",
    },
    errors: {
      vendor: "इस कंपनी का कोई एक्टिव सप्लायर चुनें।",
      supplier: "सप्लायर का नाम लिखें या सप्लायर चुनें।",
      dates: "सही बिल तारीख और देय तारीख डालें।",
      amounts: "लाइन की वैल्यू जाँचें और बिल का कुल योग समर्थित रकम के अंदर रखें।",
      expenseAccount: "इस कंपनी का कोई एक्टिव ख़र्च अकाउंट चुनें।",

      validation: {
        title: "वैलिडेशन एरर",
        description: "सभी फ़ील्ड जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "साइन इन नहीं हैं",
        description: "बिल बनाने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपके पास Accountant या Admin रोल होना चाहिए",
      },
      conflict: {
        title: "टकराव",
        description:
          "इस सप्लायर और इनवॉइस नंबर का बिल पहले से है। नया बनाने से पहले मौजूदा बिल देखिए।",
      },
      server: {
        title: "सर्वर एरर",
        description: "बिल नहीं बन सका। दोबारा कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
      },
      notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "बिल बन गया",
      description: "सप्लायर बिल दर्ज हो गया",
    },
    widget: {
      supplier: "सप्लायर",
      dates: "तारीखें और करेंसी",
      items: "बिल लाइनें",
      itemsDescription: "वैकल्पिक लाइनें। VAT दर 0 से 1 के बीच दशमलव में डालें।",
      itemsHint: "इस बिल की वस्तुएँ या सेवाएँ जोड़ें।",
      item: "विवरण",
      quantity: "मात्रा",
      unitPrice: "यूनिट कीमत",
      manualTaxRate: "दूसरी दर",
      taxRate: "VAT %",
      lineTotal: "लाइन का योग",
      addItem: "लाइन जोड़ें",
      removeItem: "लाइन हटाएँ",
      itemError: "विवरण, मात्रा, कीमत और VAT दर जाँचें।",
      supplierTotalReview:
        "इस योग को सप्लायर के इनवॉइस से मिलाइए। अलग हो तो सेव करने से पहले मूल दस्तावेज़ देख लें।",
      summary: "बिल का सारांश",
      net: "नेट",
      tax: "VAT",
      total: "कुल",
      chooseVendor: "सप्लायर चुनें",
      vendorSource: "सप्लायर डायरेक्टरी से",
      terms: "सप्लायर की शर्तें इस्तेमाल करें",
      manualVendor: "सप्लायर हाथ से भरें",
      selectCompanyFirst: "डायरेक्टरी सप्लायर चुनने से पहले कंपनी चुनें।",

      back: "वापस",
      submit: "ड्राफ़्ट सेव करें",
      viewButton: "बिल देखें",
      addAnotherButton: "एक और जोड़ें",
    },
    response: {
      id: "बिल ID",
      companyId: "कंपनी ID",
      supplierName: "सप्लायर",
      billNumber: "बिल नंबर",
      billDate: "बिल तारीख",
      dueDate: "देय तारीख",
      currency: "करेंसी",
      subtotal: "सबटोटल",
      taxAmount: "टैक्स",
      total: "कुल",
      status: "स्टेटस",
      createdAt: "बनाया गया",
      updatedAt: "अपडेट किया गया",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "ड्राफ़्ट",
      RECEIVED: "प्राप्त",
      APPROVED: "मंज़ूर",
      PAID: "चुकाया गया",
      DISPUTED: "विवादित",
    },
  },
  companyId: {
    label: "कंपनी",
    description: "वो कंपनी जिसे ये बिल मिल रहा है",
    placeholder: "कंपनी UUID",
  },
  vendorId: {
    label: "सप्लायर चुनें",
    description: "सप्लायर डायरेक्टरी से",
  },
  supplierName: {
    label: "सप्लायर का नाम",
    description: "उस सप्लायर का नाम जिसने ये बिल भेजा",
    placeholder: "Acme GmbH",
  },
  supplierVatNumber: {
    label: "सप्लायर का VAT नंबर",
    description: "सप्लायर का VAT/टैक्स पहचान नंबर",
    placeholder: "DE123456789",
  },
  billNumber: {
    label: "बिल नंबर",
    description: "सप्लायर के इनवॉइस/बिल का रेफ़रेंस नंबर",
    placeholder: "INV-2024-001",
  },
  billDate: {
    label: "बिल तारीख",
    description: "बिल जारी होने की तारीख",
    placeholder: "बिल तारीख चुनें",
  },
  dueDate: {
    label: "देय तारीख",
    description: "भुगतान की देय तारीख",
    placeholder: "देय तारीख चुनें",
  },
  currency: {
    code: "{{code}}",
    label: "करेंसी",
    description: "बिल की करेंसी",
    placeholder: "EUR",
  },
  notes: {
    label: "नोट्स",
    description: "इस बिल के बारे में आंतरिक नोट्स",
    placeholder: "वैकल्पिक नोट्स",
  },
};
