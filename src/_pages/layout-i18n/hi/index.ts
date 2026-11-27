import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  breadcrumbs: { home: "होम" },
  meta: {
    defaultTitle: "unbottled.ai: अनसेंसर्ड AI चैट, बिना फ़िल्टर",
    category: "AI चैट प्लेटफ़ॉर्म",
    description:
      "{{modelCount}} मॉडल के साथ सच में अनसेंसर्ड AI चैट। कोई फ़िल्टर नहीं, कोई रोक-टोक नहीं। सीधे और ईमानदार जवाब, हिंदी में भी।",
    imageAlt: "unbottled.ai: अनसेंसर्ड AI चैट प्लेटफ़ॉर्म",
    keywords:
      "अनसेंसर्ड AI, AI चैट, हिंदी में AI, फ़्री AI चैट, बिना फ़िल्टर AI, uncensored AI, GPT-4, Claude, Gemini, AI मॉडल",
  },
  structuredData: {
    app: {
      description:
        "{{providerCount}} लैब्स के {{modelCount}} मॉडल के साथ AI चैट: मेनस्ट्रीम, ओपन और अनसेंसर्ड। हर चैट में फ़िल्टर लेवल आप चुनते हैं। क्रेडिट से उतना ही भुगतान करें जितना इस्तेमाल करें। ओपन सोर्स और खुद होस्ट करने लायक।",
      freeOffer:
        "हर महीने फ़्री क्रेडिट: बिना अकाउंट {{guest}}, फ़्री अकाउंट के साथ {{signedIn}}, फ़्री अकाउंट और न्यूज़लेटर के साथ {{max}}। कोई कार्ड नहीं चाहिए।",
      yearlyName: "सालाना सब्सक्रिप्शन",
      yearlyDescription: "हर महीने {{subCredits}} क्रेडिट, सालाना बिलिंग",
    },
    pricing: {
      name: "{{appName}} प्लान और क्रेडिट",
      description:
        "हर महीने फ़्री क्रेडिट, चार मंथली प्लान और टॉप अप के लिए क्रेडिट पैक। {{modelCount}} चैट मॉडल और इमेज, वीडियो, म्यूज़िक, वॉइस मॉडल के लिए एक ही बैलेंस।",
    },
    organization: {
      types: {
        organization: "Organization",
        contactPoint: "ContactPoint",
      },
      contactPoint: {
        contactType: "ग्राहक सहायता",
      },
    },
  },
  constants: {
    languages: {
      it: "इतालवी",
      es: "स्पेनिश",
      sk: "स्लोवाक",
      hi: "हिंदी",
      en: "अंग्रेज़ी",
      de: "जर्मन",
      pl: "पोलिश",
      fr: "फ़्रेंच",
    },
  },
};
