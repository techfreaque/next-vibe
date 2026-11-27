import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "ई-इनवॉइस",
  titleShort: "ई-इनवॉइस",
  description:
    "जारी इनवॉइस या क्रेडिट नोट को Peppol BIS Billing 3.0 फ़ाइल (UBL, EN 16931) के रूप में एक्सपोर्ट करें।",
  invoiceId: {
    label: "इनवॉइस",
    description: "एक्सपोर्ट करने के लिए जारी इनवॉइस या क्रेडिट नोट",
  },
  buyerReference: {
    label: "खरीदार रेफ़रेंस",
    description:
      "खरीदार का दिया रेफ़रेंस इस्तेमाल करें। जर्मन सरकारी संस्थाओं के लिए उनका Leitweg-ID डालें।",
  },
  response: {
    invoiceNumber: "दस्तावेज़ नंबर",
    isCreditNote: "क्रेडिट नोट",
    fileName: "फ़ाइल का नाम",
    ready: "भेजने को तैयार",
    missingFields: "गायब ब्योरा",
    xml: "XML",
  },
  widget: {
    peppol: "Peppol XML डाउनलोड करें",
    slovak: "eFaktúra XML डाउनलोड करें",
    xrechnung: "XRechnung XML",
    sendHint: "डाउनलोड की XML अपने ई-इनवॉइसिंग प्रोवाइडर से भेजें।",
    back: "वापस",
    submit: "ई-इनवॉइस तैयार करें",
    invoice: "इनवॉइस {{number}}",
    creditNote: "क्रेडिट नोट {{number}}",
    ready: "तैयार। EN 16931 का सारा ज़रूरी ब्योरा मौजूद है।",
    missing: "फ़ाइल भेजने से पहले यह ब्योरा जोड़ें:",
    download: "XML डाउनलोड करें",
    copy: "XML कॉपी करें",
    copied: "XML कॉपी हो गई",
    copyFailed: "XML कॉपी नहीं हो सकी",
    preview: "XML दिखाएँ",
    disclaimer: "हम टूलिंग देते हैं, टैक्स सलाह नहीं।",
  },
  fields: {
    bt10: "खरीदार रेफ़रेंस",
    bt35: "विक्रेता की सड़क",
    bt37: "विक्रेता का शहर",
    bt38: "विक्रेता का पिन कोड",
    bt42: "विक्रेता का फ़ोन",
    bt43: "विक्रेता का ईमेल",
    bt50: "खरीदार की सड़क",
    bt52: "खरीदार का शहर",
    bt53: "खरीदार का पिन कोड",
    bt1: "दस्तावेज़ नंबर",
    bt2: "जारी करने की तारीख़",
    bt5: "करेंसी",
    bt9: "देय तारीख़",
    bt27: "आपकी कंपनी का नाम",
    bt31: "आपकी VAT ID",
    bt34: "आपका इलेक्ट्रॉनिक पता (VAT ID, टैक्स ID या कंपनी नंबर)",
    bt40: "आपकी कंपनी का देश",
    bt44: "ग्राहक का नाम",
    bt48: "ग्राहक की VAT ID",
    bt49: "ग्राहक का इलेक्ट्रॉनिक पता (VAT ID, टैक्स ID या कंपनी नंबर)",
    bt55: "देश सहित ग्राहक का पता",
    bt153: "हर लाइन पर विवरण",
    bg25: "कम से कम एक लाइन",
  },
  errors: {
    validation: {
      title: "गलत रिक्वेस्ट",
      description: "इनवॉइस रेफ़रेंस जाँचें।",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "ई-इनवॉइस लोड नहीं हो सका।",
    },
    unauthorized: {
      title: "साइन इन ज़रूरी है",
      description: "ई-इनवॉइस एक्सपोर्ट करने के लिए साइन इन करें।",
    },
    forbidden: {
      title: "एक्सेस नहीं",
      description: "आपके पास इस दस्तावेज़ का एक्सेस नहीं है।",
    },
    notFound: {
      title: "दस्तावेज़ नहीं मिला",
      description: "यह इनवॉइस मौजूद नहीं है।",
    },
    server: {
      title: "एक्सपोर्ट फ़ेल",
      description: "ई-इनवॉइस बन नहीं सका। फिर कोशिश करें।",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कुछ गड़बड़ हो गई।",
    },
    unsavedChanges: {
      title: "बिना सेव बदलाव",
      description: "पहले अपने बदलाव सेव करें।",
    },
    conflict: {
      title: "अभी जारी नहीं हुआ",
      description: "ई-इनवॉइस एक्सपोर्ट करने से पहले इनवॉइस जारी करें।",
    },
  },
  success: {
    title: "ई-इनवॉइस तैयार",
    description: "Peppol फ़ाइल तैयार है।",
  },
  tags: { payment: "पेमेंट", invoice: "इनवॉइस", eInvoice: "ई-इनवॉइस" },
};
