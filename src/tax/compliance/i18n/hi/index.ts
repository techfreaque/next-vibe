import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { compliance: "कंप्लायंस", tax: "टैक्स" },
  enums: {
    vatTreatment: {
      domestic: "VAT के साथ घरेलू बिक्री",
      reverseChargeDomestic: "घरेलू रिवर्स चार्ज",
      euServices: "EU के व्यवसाय को सेवाएँ (रिवर्स चार्ज)",
      euGoods: "EU के व्यवसाय को सामान (छूट)",
      export: "EU के बाहर निर्यात (छूट)",
      exempt: "VAT से छूट प्राप्त आपूर्ति",
    },
    severity: {
      error: "जारी करना रोकता है",
      warning: "जाँच",
      info: "नोट",
    },
  },
  issues: {
    issuerAddressMissing:
      "कंपनी की गली, शहर और पोस्टल कोड जोड़ें। इनवॉइस पर पूरा पता दिखना चाहिए।",
    issuerRegistrationMissing:
      "कंपनी का रजिस्ट्रेशन नंबर (IČO) जोड़ें। यह हर इनवॉइस पर दिखना ज़रूरी है।",
    issuerRegistrationInvalid:
      "रजिस्ट्रेशन नंबर (IČO) सही नहीं है। इसमें 8 अंक और एक चेक डिजिट होता है।",
    issuerTaxIdMissing: "टैक्स नंबर (DIČ) जोड़ें। यह हर इनवॉइस पर दिखना ज़रूरी है।",
    issuerTaxIdInvalid: "टैक्स नंबर (DIČ) सही नहीं है। इसमें 10 अंक होते हैं।",
    issuerVatIdMissing:
      "VAT ID (IČ DPH) जोड़ें। VAT रजिस्टर्ड कंपनियों को इसे इनवॉइस पर छापना होता है।",
    issuerVatIdInvalid: "VAT ID (IČ DPH) सही नहीं है। यह SK के बाद 10 अंक होती है।",
    customerVatIdMissing:
      "बिलिंग पते में ग्राहक की VAT ID जोड़ें। रिवर्स चार्ज और EU आपूर्ति के लिए यह चाहिए।",
    customerVatIdInvalid: "ग्राहक की VAT ID सही नहीं है।",
    customerNotForeignEu:
      "EU ट्रीटमेंट के लिए किसी दूसरे EU देश की ग्राहक VAT ID चाहिए।",
    customerNotDomestic: "घरेलू रिवर्स चार्ज के लिए आपके देश की ग्राहक VAT ID चाहिए।",
    treatmentNotAllowed:
      "यह VAT ट्रीटमेंट कंपनी की VAT व्यवस्था से मेल नहीं खाता। कोई और ट्रीटमेंट चुनें या व्यवस्था अपडेट करें।",
    treatmentRequiresZeroRate:
      "रिवर्स चार्ज और छूट वाली आपूर्ति पर कोई VAT नहीं लगता। हर लाइन 0 % पर रखें।",
    rateNotValidOnDate:
      "{{date}} को {{rate}} % VAT लागू नहीं होता। आपूर्ति की तारीख़ पर मान्य दर इस्तेमाल करें।",
    zeroRateWithoutReason:
      "घरेलू बिक्री पर एक लाइन में 0 % VAT है। लागू होने वाली छूट या रिवर्स चार्ज ट्रीटमेंट चुनें।",
    issueDeadlinePassed:
      "आपूर्ति के {{days}} दिन बाद जारी हुआ। क़ानूनी सीमा {{limit}} दिन है।",
    regimeNotElected:
      "कोई VAT व्यवस्था दर्ज नहीं। आपके चुनने तक ERP कंपनी को VAT दाता मानता है।",
    chartTemplateMismatch: "चार्ट ऑफ़ अकाउंट्स इस देश के टेंप्लेट से नहीं आया।",
    taxRatesMissing:
      "इस देश की टैक्स दरें ग़ायब हैं। उन्हें जोड़ें ताकि दस्तावेज़ उनका इस्तेमाल कर सकें।",
    taxRatesOutdated:
      "कुछ सक्रिय टैक्स दरें आज मान्य नहीं हैं। उन्हें निष्क्रिय करें या अंतिम तारीख़ तय करें।",
    fiscalProviderMissing:
      "नकद और कार्ड बिक्री के लिए प्रमाणित eKasa कैश रजिस्टर चाहिए। जब तक एक कनेक्ट नहीं होता, POS बिक्री रुकी रहती है।",
    eInvoicingUpcoming:
      "संरचित ई-इनवॉइस {{date}} से अनिवार्य हैं। Peppol UBL एक्सपोर्ट तैयार है।",
    vatThresholdNear:
      "इस कैलेंडर वर्ष का टर्नओवर {{turnover}} है। {{threshold}} से ऊपर VAT रजिस्ट्रेशन ज़रूरी है।",
    vatThresholdExceeded:
      "इस कैलेंडर वर्ष का टर्नओवर {{turnover}} है, जो {{threshold}} की VAT सीमा से ऊपर है। VAT के लिए रजिस्टर करें।",
  },
  review: {
    title: "देश कंप्लायंस जाँच",
    titleShort: "कंप्लायंस जाँच",
    description:
      "देखें कि कंपनी के देश की कौन सी क़ानूनी ज़रूरतें पूरी हैं और पहले क्या ठीक करना है।",
    company: {
      label: "कंपनी",
      description: "जिस कंपनी को जाँचना है",
    },
    disclaimer: "हम टूलिंग देते हैं, टैक्स सलाह नहीं। फ़ाइलिंग अपने टैक्स सलाहकार से जाँचें।",
    country: "देश के नियम",
    regime: "VAT व्यवस्था",
    findings: "निष्कर्ष",
    findingCode: "निष्कर्ष",
    findingSeverity: "गंभीरता",
    allClear: "इस देश के लिए ज़रूरी सब कुछ मौजूद है।",
    countries: {
      SK: "स्लोवाकिया",
      DE: "जर्मनी",
      AT: "ऑस्ट्रिया",
      XX: "जेनेरिक (देश के नियम नहीं)",
    },
    facts: {
      title: "ERP क्या तैयार करता है",
      vatReturn: "VAT रिटर्न और कंट्रोल स्टेटमेंट",
      statements: "सांविधिक वित्तीय विवरण",
      fiscal: "फ़िस्कल रसीदें",
      eInvoicing: "अनिवार्य ई-इनवॉइसिंग की शुरुआत",
      yes: "उपलब्ध",
      no: "इस देश के लिए उपलब्ध नहीं",
      notRequired: "ज़रूरी नहीं",
      required: "ज़रूरी, प्रमाणित eKasa कैश रजिस्टर के ज़रिए",
    },
    actions: {
      company: "कंपनी का ब्योरा एडिट करें",
      regime: "VAT व्यवस्था चुनें",
      rates: "टैक्स दरें देखें",
      chart: "चार्ट ऑफ़ अकाउंट्स सेट अप करें",
      vatReturn: "VAT रिटर्न खोलें",
      fiscal: "POS फ़िस्कल सेटिंग्स खोलें",
    },
    pickCompany: "जाँचने के लिए कंपनी चुनें।",
    errors: {
      validation: {
        title: "रिक्वेस्ट गलत है",
        description: "ऐसी कंपनी चुनें जिसके आप सदस्य हैं।",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "कंप्लायंस जाँचने के लिए साइन इन करें।",
      },
      forbidden: {
        title: "एक्सेस नहीं",
        description: "आप इस कंपनी के सदस्य नहीं हैं।",
      },
      notFound: {
        title: "कंपनी नहीं मिली",
        description: "कंपनी मौजूद नहीं है या निष्क्रिय है।",
      },
      conflict: {
        title: "टकराव",
        description: "जाँच के दौरान कंपनी बदल गई। फिर कोशिश करें।",
      },
      server: {
        title: "जाँच फ़ेल हुई",
        description: "कंप्लायंस जाँच चल नहीं सकी। फिर कोशिश करें।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "अपना कनेक्शन जाँचें और फिर कोशिश करें।",
      },
      unknown: {
        title: "अप्रत्याशित एरर",
        description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले अपने बदलाव सेव करें या छोड़ दें।",
      },
    },
    success: {
      title: "कंप्लायंस जाँचा गया",
      description: "निष्कर्ष अभी के कंपनी डेटा को दर्शाते हैं।",
    },
  },
};
