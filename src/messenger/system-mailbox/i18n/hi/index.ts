import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "प्लेटफ़ॉर्म मेलबॉक्स",
  tag: "प्लेटफ़ॉर्म मेलबॉक्स",

  task: {
    description: "रोज़ की आंतरिक स्टेटस रिपोर्ट बनाएँ और प्लेटफ़ॉर्म मेलबॉक्स से मेल करें",
  },

  send: {
    title: "प्लेटफ़ॉर्म मेल भेजें",
    titleShort: "मेल भेजें",
    description: "प्लेटफ़ॉर्म मेलबॉक्स से एक ट्रांज़ैक्शनल ईमेल भेजें और उसे Sent में रखें",
    container: {
      title: "प्लेटफ़ॉर्म मेल भेजें",
      description:
        "एक प्राप्तकर्ता, एक मैसेज। डिलीवरी के बाद Sent फ़ोल्डर में सेव होता है।",
    },
    fields: {
      to: {
        label: "प्राप्तकर्ता",
        description: "एक ही ईमेल पता",
        placeholder: "name@example.com",
      },
      subject: {
        label: "विषय",
        description: "विषय लाइन",
        placeholder: "ये किस बारे में है?",
      },
      body: {
        label: "मैसेज",
        description: "सादा-टेक्स्ट बॉडी",
        placeholder: "मैसेज लिखें...",
      },
      html: {
        label: "HTML बॉडी",
        description: "वैकल्पिक सादा HTML वर्ज़न",
        placeholder: "<p>वैकल्पिक HTML</p>",
      },
    },
    response: {
      messageId: "मैसेज ID",
      from: "से",
      to: "तक",
      storedInSent: "Sent में सेव",
      sentFolder: "Sent फ़ोल्डर",
      sentLastHour: "पिछले घंटे में भेजे",
      rateLimitPerHour: "घंटे की सीमा",
    },
    widget: {
      submit: "मेल भेजें",
      submitting: "भेजा जा रहा है...",
      sent: "मेल भेज दिया गया",
      filed: "Sent में रखा गया",
      notFiled: "डिलीवर हुआ, पर Sent में नहीं रखा गया",
      yes: "हाँ",
      no: "नहीं",
    },
    success: {
      title: "मेल भेज दिया गया",
      description: "मैसेज मेल सर्वर तक पहुँचा दिया गया",
    },
  },

  inbox: {
    title: "प्लेटफ़ॉर्म इनबॉक्स",
    titleShort: "प्लेटफ़ॉर्म इनबॉक्स",
    description: "प्लेटफ़ॉर्म मेलबॉक्स के हाल के INBOX मैसेज की लिस्ट",
    container: {
      title: "प्लेटफ़ॉर्म इनबॉक्स",
      description: "नए पहले। पढ़ने से मैसेज कभी पढ़ा हुआ चिह्नित नहीं होता।",
    },
    fields: {
      limit: {
        label: "सीमा",
        description: "कितने मैसेज लौटाने हैं (1-50)",
        placeholder: "20",
      },
      unreadOnly: {
        label: "सिर्फ़ बिना पढ़े",
        description: "सिर्फ़ बिना पढ़े मैसेज लौटाएँ",
      },
    },
    response: {
      address: "मेलबॉक्स",
      messages: {
        title: "मैसेज",
        uid: "UID",
        from: "से",
        subject: "विषय",
        date: "तारीख",
        snippet: "स्निपेट",
        unread: "बिना पढ़ा",
      },
    },
    widget: {
      submit: "इनबॉक्स रीफ़्रेश करें",
      submitting: "लोड हो रहा है...",
      empty: "कोई मैसेज नहीं",
      emptyDescription: "इन फ़िल्टर से कुछ मेल नहीं खाता।",
      unread: "बिना पढ़ा",
      noSubject: "(कोई विषय नहीं)",
      open: "खुला",
    },
    success: {
      title: "इनबॉक्स लोड हो गया",
      description: "प्लेटफ़ॉर्म मेलबॉक्स से मैसेज मिल गए",
    },
  },

  message: {
    title: "प्लेटफ़ॉर्म मेल पढ़ें",
    titleShort: "मेल पढ़ें",
    description: "UID से प्लेटफ़ॉर्म मेलबॉक्स का एक INBOX मैसेज पाएँ",
    container: {
      title: "प्लेटफ़ॉर्म मेल पढ़ें",
      description: "एक मैसेज की पूरी बॉडी। उसे पढ़ा हुआ चिह्नित नहीं करता।",
    },
    fields: {
      uid: {
        label: "UID",
        description: "इनबॉक्स लिस्ट से मैसेज UID",
        placeholder: "42",
      },
    },
    response: {
      uid: "UID",
      from: "से",
      to: "तक",
      subject: "विषय",
      date: "तारीख",
      messageId: "मैसेज ID",
      unread: "बिना पढ़ा",
      bodyText: "बॉडी",
    },
    widget: {
      submit: "मैसेज पढ़ें",
      submitting: "लोड हो रहा है...",
      unread: "बिना पढ़ा",
      noSubject: "(कोई विषय नहीं)",
    },
    success: {
      title: "मैसेज लोड हो गया",
      description: "प्लेटफ़ॉर्म मेलबॉक्स से मैसेज मिल गया",
    },
  },

  report: {
    title: "रोज़ की स्टेटस रिपोर्ट",
    titleShort: "रोज़ की रिपोर्ट",
    description: "पिछले 24 घंटे की प्लेटफ़ॉर्म रिपोर्ट बनाएँ और प्लेटफ़ॉर्म मेलबॉक्स से मेल करें",
    container: {
      title: "रोज़ की स्टेटस रिपोर्ट",
      description:
        "साइनअप, सब्सक्रिप्शन, क्रेडिट ख़र्च, फ़नल, टास्क की घटनाएँ और एरर। सादा टेक्स्ट।",
    },
    fields: {
      to: {
        label: "प्राप्तकर्ता",
        description: "कॉन्फ़िगर किए रिपोर्ट पते का इस्तेमाल करने के लिए खाली छोड़ें",
        placeholder: "name@example.com",
      },
      dryRun: {
        label: "सिर्फ़ प्रीव्यू",
        description: "रिपोर्ट बनाएँ पर भेजें नहीं",
      },
    },
    response: {
      subject: "विषय",
      body: "रिपोर्ट",
      recipient: "प्राप्तकर्ता",
      sent: "भेजे गए",
      sections: "शामिल सेक्शन",
      skippedSections: "छोड़े गए सेक्शन",
    },
    widget: {
      submit: "रिपोर्ट भेजें",
      submitting: "बनाई जा रही है...",
      sent: "रिपोर्ट भेज दी गई",
      preview: "प्रीव्यू",
    },
    success: {
      title: "रिपोर्ट तैयार",
      description: "रोज़ की स्टेटस रिपोर्ट बन गई",
    },
  },

  errors: {
    unauthorized: {
      title: "अनधिकृत",
      description: "लॉगिन ज़रूरी है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "प्लेटफ़ॉर्म मेलबॉक्स सिर्फ़ एडमिन इस्तेमाल कर सकते हैं",
    },
    server: {
      title: "सर्वर एरर",
      description: "प्लेटफ़ॉर्म मेलबॉक्स की रिक्वेस्ट फ़ेल हुई",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर आया",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "रिक्वेस्ट के पैरामीटर गलत हैं",
    },
    notConfigured:
      "प्लेटफ़ॉर्म मेलबॉक्स कॉन्फ़िगर नहीं है। THEA_MAIL_ADDRESS, THEA_MAIL_HOST और THEA_MAIL_PASSWORD सेट करें।",
    invalidRecipient: "प्राप्तकर्ता एक ही सही ईमेल पता होना चाहिए",
    noRecipient: "कोई प्राप्तकर्ता नहीं। एक दें या THEA_MAIL_REPORT_TO सेट करें।",
    rateLimited:
      "घंटे की भेजने की सीमा पूरी हो गई ({{limit}} में से {{sent}})। बाद में दोबारा कोशिश करें।",
    smtpFailed: "मेल सर्वर ने मैसेज रिजेक्ट किया: {{error}}",
    imapFailed: "मेलबॉक्स तक नहीं पहुँच सके: {{error}}",
    messageNotFound: "इनबॉक्स में उस UID का कोई मैसेज नहीं",
    reportFailed: "रिपोर्ट नहीं बन सकी: {{error}}",
  },
};
