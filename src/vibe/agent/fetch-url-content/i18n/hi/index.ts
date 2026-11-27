import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "जानकारी",
  get: {
    title: "URL का कंटेंट लाएँ",
    titleShort: "URL लाएँ",
    description:
      "किसी भी URL से कंटेंट लाकर पढ़ने लायक markdown में बदलें। वेब पेज का कंटेंट पढ़ना या जाँचना हो तो इस्तेमाल करें।",
    form: {
      title: "URL फ़ेच के पैरामीटर",
      description: "वह URL सेट करें जिससे कंटेंट लाना है",
    },
    fields: {
      url: {
        title: "URL",
        description: "पूरा URL जो लाना है (http:// या https:// ज़रूरी है)",
        placeholder: "https://example.com",
      },
      query: {
        title: "सर्च क्वेरी (वैकल्पिक)",
        description:
          "कंटेंट लाने के बाद लगने वाला regex फ़िल्टर। सिर्फ़ पैटर्न से मेल खाते पैराग्राफ़ लौटते हैं, मैच की गिनती के हिसाब से क्रम में, अक्षर सीमा तक। पूरा पेज चाहिए तो खाली छोड़ें (बड़ा हो तो बीच से काटा जाता है)। सिंटैक्स: कोई भी JS regex - 'authentication', '(login|signup)', 'class\\s+\\w+'। गलत regex होने पर सीधा टेक्स्ट मैच होता है।",
        placeholder: "authentication",
      },
    },
    response: {
      message: {
        title: "मैसेज",
        description: "फ़ेच ऑपरेशन का स्टेटस मैसेज",
      },
      content: {
        title: "कंटेंट",
        description: "markdown फ़ॉर्मैट में निकाला गया कंटेंट",
      },
      truncated: {
        title: "काटा गया",
        description: "साइज़ की वजह से कंटेंट काटा गया या नहीं",
      },
      truncatedNote: {
        title: "कटाई का नोट",
        description: "कटाई का ब्योरा और ज़्यादा कंटेंट कैसे पाएँ",
      },
      url: {
        title: "ओरिजिनल देखें",
        description: "जो URL लाया गया",
      },
      statusCode: {
        title: "स्टेटस कोड",
        description: "रिस्पॉन्स का HTTP स्टेटस कोड",
      },
      timeElapsed: {
        title: "लगा समय (ms)",
        description: "कंटेंट लाने में लगा समय, मिलीसेकंड में",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "URL गलत है या दिया नहीं गया",
      },
      internal: {
        title: "फ़ेच एरर",
        description: "URL लाते समय एरर आया",
        // Dedicated key: `title` doubles as the generic errorTypes label, so the
        // detail placeholder lives here instead of leaking into those labels.
        detail: "फ़ेच एरर: {{message}}",
      },
      notConfigured: {
        title:
          "{{label}} की API key सेट नहीं है। अपनी .env फ़ाइल में {{envKey}}=<your-key> जोड़ें। key यहाँ से लें: {{url}}",
        description: "वेब पेज लाने के लिए {{label}} सेट करें",
      },
      timeout: {
        title: "फ़ेच टाइमआउट",
        description: "URL फ़ेच टाइमआउट हो गया",
        detail:
          "{{url}} लाने में टाइमआउट हो गया। पेज बहुत धीमा या उपलब्ध नहीं हो सकता।",
      },
    },
    success: {
      title: "फ़ेच सफल",
      description: "URL का कंटेंट सफलतापूर्वक आ गया",
      detail: "{{url}} लाया गया",
    },
  },
  tags: {
    scraping: "स्क्रैपिंग",
    web: "वेब",
    content: "कंटेंट",
  },
  cleanup: {
    post: {
      title: "URL कैश की सफ़ाई",
      titleShort: "URL कैश की सफ़ाई",
      description: "7 दिन से पुरानी URL कैश फ़ाइलें हटाएँ",
      container: {
        title: "सफ़ाई के नतीजे",
        description: "हटाई गई कैश फ़ाइलों का सार",
      },
      response: {
        deletedCount: "हटाई गई फ़ाइलें",
        totalScanned: "कुल स्कैन हुईं",
        retentionDays: "रिटेंशन के दिन",
      },
      success: {
        title: "कैश साफ़ हो गया",
        description: "पुरानी URL कैश फ़ाइलें हटा दी गईं",
      },
    },
    errors: {
      server: {
        title: "सफ़ाई में एरर",
        description: "URL कैश साफ़ करते समय एरर आया",
      },
    },
    name: "URL कैश की सफ़ाई",
    description: "पुरानी URL फ़ेच कैश फ़ाइलों की साप्ताहिक सफ़ाई",
  },
};
