import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  receiveBill: "बिल प्राप्त चिह्नित करें",
  supplierDocument: {
    confirmMissing: "पुष्टि करें कि सप्लायर का कोई दस्तावेज़ उपलब्ध नहीं है",
    confirmSeparate: "पुष्टि करें कि यह अलग चार्ज है",
    missingHelp: "बैंक सबूत जाँचें। मंज़ूरी से कुल लागत बिना कटौती योग्य VAT के दर्ज होती है।",
    required:
      "सप्लायर दस्तावेज़ लिंक करें या पुष्टि करें कि वह उपलब्ध नहीं है। सिर्फ़ बैंक के आधार पर मंज़ूरी के लिए जाँची हुई कुल रकम चाहिए और कोई VAT एंट्री नहीं।",
    possibleDuplicate:
      "किसी बैंक ड्राफ़्ट या सप्लायर दस्तावेज़ का ब्योरा मेल खाता है। दस्तावेज़ लिंक करें या पुष्टि करें कि यह अलग चार्ज है।",
  },
  reverseCharge: {
    title: "रिवर्स चार्ज (वैकल्पिक)",
    base: "बिल की करेंसी में कर योग्य आधार",
    rate: "VAT दर (%)",
    help: "जर्मन छोटे व्यवसाय के प्राप्त बिल के लिए, रिवर्स चार्ज लागू होने की पुष्टि के बाद ही दोनों मान दें। यह चार्ज लागत और देय VAT के रूप में बुक होता है।",
    invalid:
      "जर्मन छोटे व्यवसाय व्यवस्था के तहत प्राप्त बिल पर पुष्टि किया हुआ आधार और दर दें।",
    cost: "कटौती के अयोग्य रिवर्स-चार्ज VAT",
  },
  tags: { payment: "payment", bill: "bill", ap: "accounts-payable" },
  enums: {
    billStatus: {
      DRAFT: "ड्राफ़्ट",
      RECEIVED: "प्राप्त",
      APPROVED: "मंज़ूर",
      PAID: "चुकाया",
      DISPUTED: "विवादित",
    },
  },
  post: {
    title: "बिल की स्थिति की समीक्षा करें",
    titleShort: "बिल की स्थिति की समीक्षा करें",
    description: "ड्राफ़्ट या प्राप्त सप्लायर बिल की स्थिति अपडेट करता है।",
    billId: { label: "बिल ID", description: "मंज़ूर किया जाने वाला बिल" },
    errors: {
      existingPosting: "मंज़ूर करने से पहले इस बिल की मौजूदा पोस्टिंग का मिलान करें।",
      lineTotalsReview:
        "लाइनें दर्ज नेट, VAT या कुल से अलग हैं। मंज़ूर करने से पहले मूल सप्लायर दस्तावेज़ देखें।",
      billLines:
        "धनात्मक कुल वाली बिल लाइनें जोड़ें और इस कंपनी के सक्रिय ख़र्च अकाउंट इस्तेमाल करें।",
      posting: "बिल के कुल, कंपनी की करेंसी, अकाउंटिंग अवधि और पोस्टिंग अकाउंट जाँचें।",
      validation: { title: "वैलिडेशन एरर", description: "बिल ID गलत है" },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "बिल मंज़ूर करने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "अकाउंटेंट या एडमिन रोल चाहिए",
      },
      conflict: {
        title: "पहले ही मंज़ूर",
        description: "बिल पहले से मंज़ूर या चुकाया हुआ है",
      },
      server: {
        title: "सर्वर एरर",
        description: "बिल मंज़ूर नहीं हो सका",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      network: { title: "नेटवर्क एरर", description: "अपना कनेक्शन जाँचें" },
      notFound: {
        title: "बिल नहीं मिला",
        description: "यह बिल मौजूद नहीं है",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "बिल मंज़ूर हुआ",
      description: "बिल की स्थिति सफलतापूर्वक आगे बढ़ी",
    },
    response: {
      status: "नई स्थिति",
      journalEntryId: "जर्नल एंट्री ID",
    },
    widget: {
      back: "वापस",
      submit: "स्थिति बदलने की पुष्टि करें",
      confirmTitle: "यह बिल मंज़ूर करें?",
      confirmDescription:
        "ड्राफ़्ट प्राप्त में बदलता है। प्राप्त बिल को मंज़ूर करने पर जर्नल एंट्री पोस्ट होती है।",
      confirmButton: "हाँ, मंज़ूर करें",
      cancelButton: "रद्द करें",
      approved: "बिल की स्थिति अपडेट हुई",
    },
  },
};
