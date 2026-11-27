import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  update: {
    post: {
      title: "विज़िटर देश डेटाबेस अपडेट करें",
      titleShort: "Geo IP अपडेट",
      description:
        "मासिक DB-IP देश टेबल डेटाबेस में लोड करता है और जिन लीड का देश अभी खाली है उनका देश भरता है। ऑफ़लाइन लुकअप, हर विज़िट पर API कॉल नहीं।",
      tag: "Geo IP",
      container: {
        title: "Geo IP डेटाबेस",
        description:
          "DB-IP का IP से देश और ASN डेटा (CC BY 4.0)। होस्टिंग ASN सूची: bad-asn-list (MIT)",
      },
      fields: {
        force: {
          label: "ज़बरदस्ती डाउनलोड",
          description: "मौजूदा रिलीज़ पहले से स्टोर हो तब भी डाउनलोड करें",
        },
      },
      response: {
        status: "स्टेटस",
        version: "रिलीज़",
        asnVersion: "ASN रिलीज़",
        v4Ranges: "IPv4 रेंज",
        v6Ranges: "IPv6 रेंज",
        backfilled: "रिज़ॉल्व हुई लीड",
        unresolved: "अब भी अनरिज़ॉल्व्ड लीड",
      },
      errors: {
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "Geo डेटाबेस अपडेट करने के लिए एडमिन के रूप में साइन इन करें।",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "Geo डेटाबेस सिर्फ़ एडमिन अपडेट कर सकते हैं।",
        },
        server: {
          title: "अपडेट फ़ेल",
          description: "Geo डेटाबेस अपडेट नहीं हो सका। लॉग देखें।",
        },
        unknown: {
          title: "अनपेक्षित एरर",
          description: "Geo डेटाबेस अपडेट करते समय कुछ गड़बड़ हुई।",
        },
        validation: {
          title: "गलत इनपुट",
          description: "रिक्वेस्ट के फ़ील्ड जाँचें।",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "Geo सोर्स तक पहुँच नहीं हो सकी।",
        },
      },
      success: {
        title: "Geo डेटाबेस जाँचा गया",
        description: "देश टेबल अप-टू-डेट है।",
      },
    },
    task: {
      description: "मासिक DB-IP देश अपडेट और हर घंटे लीड के देश का बैकफ़िल",
    },
  },
  enums: {
    updateStatus: {
      updated: "अपडेट हुआ",
      current: "पहले से अप-टू-डेट",
      unavailable: "डाउनलोड फ़ेल",
    },
  },
};
