import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "न्यूज़लेटर",
  status: {
    title: "न्यूज़लेटर स्टेटस",
    description: "किसी ईमेल पते का न्यूज़लेटर सब्सक्रिप्शन स्टेटस देखें",
    category: "न्यूज़लेटर",
    tags: {
      status: "स्टेटस",
    },
    form: {
      title: "न्यूज़लेटर स्टेटस देखें",
      description: "न्यूज़लेटर सब्सक्रिप्शन स्टेटस देखने के लिए ईमेल पता डालें",
    },
    email: {
      label: "ईमेल पता",
      description: "वह ईमेल पता जिसका सब्सक्रिप्शन स्टेटस देखना है",
      placeholder: "user@example.com",
      helpText: "वह ईमेल पता डालें जिसे आप जाँचना चाहते हैं",
    },
    response: {
      subscribed: "सब्सक्रिप्शन स्टेटस",
      status: "मौजूदा स्टेटस",
    },
    errors: {
      validation: {
        title: "गलत ईमेल",
        description: "सही ईमेल पता डालें",
      },
      internal: {
        title: "अंदरूनी एरर",
        description: "सब्सक्रिप्शन स्टेटस जाँचते समय एरर आया",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "आपको यह सब्सक्रिप्शन स्टेटस देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इस ईमेल पते के लिए कोई सब्सक्रिप्शन जानकारी नहीं मिली",
      },
    },
    success: {
      title: "स्टेटस मिल गया",
      description: "न्यूज़लेटर सब्सक्रिप्शन स्टेटस मिल गया",
    },
  },
  subscribe: {
    category: "न्यूज़लेटर",
    tags: {
      newsletter: "न्यूज़लेटर",
      subscription: "सब्सक्रिप्शन",
    },
    email: {
      label: "ईमेल पता",
      description: "न्यूज़लेटर के लिए आपका ईमेल पता",
      placeholder: "user@example.com",
      helpText: "इसी पते पर हम आपको न्यूज़लेटर भेजेंगे",
    },
    name: {
      label: "नाम",
      description: "आपका नाम (वैकल्पिक)",
      placeholder: "राहुल शर्मा",
      helpText: "इससे हम न्यूज़लेटर को आपके लिए पर्सनल बना पाते हैं",
    },
    preferences: {
      label: "न्यूज़लेटर पसंद",
      description: "चुनें कि आपको किस तरह के न्यूज़लेटर चाहिए",
      placeholder: "अपनी पसंद चुनें",
      helpText: "आप इन्हें कभी भी बदल सकते हैं",
    },
    leadId: {
      label: "Lead ID",
      description: "वैकल्पिक लीड पहचान",
      placeholder: "123e4567-e89b-12d3-a456-426614174000",
      helpText: "सिर्फ़ अंदरूनी इस्तेमाल के लिए",
    },
    response: {
      success: "न्यूज़लेटर सब्सक्राइब हो गया",
      message: "सफलता मैसेज",
      leadId: "लीड पहचान",
      subscriptionId: "सब्सक्रिप्शन ID",
      userId: "User ID",
      alreadySubscribed: "यह ईमेल पता पहले से हमारे न्यूज़लेटर में है",
    },
    errors: {
      email_generation_failed: "ईमेल नहीं बन पाया",
      badRequest: {
        title: "गलत रिक्वेस्ट",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      internal: {
        title: "अंदरूनी एरर",
        description: "आपका सब्सक्रिप्शन प्रोसेस करते समय एरर आया",
      },
    },
    post: {
      title: "न्यूज़लेटर सब्सक्रिप्शन",
      description: "न्यूज़लेटर अपडेट और नोटिफ़िकेशन सब्सक्राइब करें",
      form: {
        title: "न्यूज़लेटर सब्सक्रिप्शन",
        description: "अपने न्यूज़लेटर सब्सक्रिप्शन की पसंद सेट करें",
      },
      response: {
        title: "सब्सक्रिप्शन का जवाब",
        description: "न्यूज़लेटर सब्सक्रिप्शन की पुष्टि का डेटा",
      },
      errors: {
        unauthorized: {
          title: "अनुमति नहीं",
          description: "लॉग इन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        internal: {
          title: "अंदरूनी एरर",
          description: "आपका सब्सक्रिप्शन प्रोसेस करते समय एरर आया",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस की अनुमति नहीं है",
        },
        conflict: {
          title: "पहले से सब्सक्राइब है",
          description: "यह ईमेल पता पहले से हमारे न्यूज़लेटर में है",
        },
        badRequest: {
          title: "गलत रिक्वेस्ट",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
      },
      success: {
        title: "सब्सक्राइब हो गया",
        description: "आप हमारे न्यूज़लेटर से जुड़ गए हैं",
      },
    },
    repository: {
      starting: "न्यूज़लेटर सब्सक्रिप्शन शुरू हो रहा है",
      linking_to_lead: "न्यूज़लेटर सब्सक्रिप्शन को लीड से जोड़ा जा रहा है",
      lead_found: "न्यूज़लेटर सब्सक्रिप्शन के लिए लीड मिली",
      lead_updated: "लीड में न्यूज़लेटर सब्सक्रिप्शन डेटा अपडेट हुआ",
      lead_update_failed: "लीड में न्यूज़लेटर डेटा अपडेट नहीं हो पाया",
      lead_not_found: "लीड नहीं मिली या अपडेट के लायक नहीं है",
      lead_linking_error: "न्यूज़लेटर से लीड जोड़ते समय एरर",
      missing_lead_id: "leadId के बिना न्यूज़लेटर सब्सक्रिप्शन की कोशिश हुई",
      already_subscribed: "यूज़र पहले से न्यूज़लेटर में है",
      reactivating: "न्यूज़लेटर सब्सक्रिप्शन फिर से चालू हो रहा है",
      creating_new: "नया न्यूज़लेटर सब्सक्रिप्शन बन रहा है",
      created_successfully: "न्यूज़लेटर सब्सक्रिप्शन बन गया",
      subscription_failed: "न्यूज़लेटर सब्सक्रिप्शन फ़ेल हुआ",
    },
    sms: {
      no_phone_number: "न्यूज़लेटर वेलकम SMS के लिए कोई फ़ोन नंबर नहीं है",
      sending_welcome: "न्यूज़लेटर सब्सक्राइबर को वेलकम SMS भेजा जा रहा है",
      welcome_error: "न्यूज़लेटर वेलकम SMS भेजने में एरर",
      no_admin_phone: "कोई एडमिन फ़ोन नंबर सेट नहीं है, SMS नोटिफ़िकेशन छोड़ा जा रहा है",
      sending_admin_notification:
        "न्यूज़लेटर सब्सक्रिप्शन के लिए एडमिन नोटिफ़िकेशन SMS भेजा जा रहा है",
      admin_notification_error: "एडमिन नोटिफ़िकेशन SMS भेजने में एरर",
      welcome: {
        message: "नमस्ते {{name}}! हमारे न्यूज़लेटर में आपका स्वागत है। अपडेट के लिए जुड़े रहें!",
      },
      admin_notification: {
        message:
          "नया न्यूज़लेटर सब्सक्रिप्शन: {{displayName}} ({{email}}) ने सब्सक्राइब किया",
      },
    },
    route: {
      sms_failed_continuing: "SMS नोटिफ़िकेशन फ़ेल हुए, फिर भी आगे बढ़ रहे हैं",
    },
    emailTemplates: {
      welcome: {
        name: "न्यूज़लेटर वेलकम ईमेल",
        description: "नए न्यूज़लेटर सब्सक्राइबर को भेजा जाने वाला वेलकम ईमेल",
        category: "न्यूज़लेटर",
        preview: {
          email: {
            label: "ईमेल पता",
            description: "सब्सक्राइबर का ईमेल पता",
          },
          name: {
            label: "सब्सक्राइबर का नाम",
            description: "सब्सक्राइबर का नाम (वैकल्पिक)",
          },
          leadId: {
            label: "Lead ID",
            description: "एनालिटिक्स के लिए लीड ट्रैकिंग पहचान",
          },
          userId: {
            label: "User ID",
            description: "यूज़र अकाउंट की पहचान (वैकल्पिक)",
          },
        },
      },
    },
    emailTemplate: {
      welcome: {
        title: "{{appName}} न्यूज़लेटर में आपका स्वागत है!",
        subject: "{{appName}} में स्वागत है: अनसेंसर्ड AI की हर खबर",
        preview: "आप जुड़ गए! अनसेंसर्ड AI, नए मॉडल और खास टिप्स की ताज़ा खबरें पाएँ।",
        greeting_with_name: "नमस्ते {{name}}!",
        greeting: "नमस्ते!",
        message:
          "{{appName}} न्यूज़लेटर में आपका स्वागत है! अब आप AI के उन शौकीनों की कम्युनिटी का हिस्सा हैं जो AI से ईमानदार, अनसेंसर्ड बातचीत चाहते हैं।",
        what_to_expect: "आपको ये मिलेगा:",
        benefit_1: "नए AI मॉडल की घोषणाएँ और अपडेट",
        benefit_2: "अनसेंसर्ड AI का पूरा फ़ायदा उठाने के टिप्स और ट्रिक्स",
        benefit_3: "खास ऑफ़र और नए फ़ीचर्स का अर्ली एक्सेस",
        benefit_4: "कम्युनिटी की खास बातें और सफलता की कहानियाँ",
        frequency: "हम हर कुछ हफ़्तों में अपडेट भेजेंगे। कभी स्पैम नहीं, हमेशा काम की बात।",
        unsubscribe_text: "ये ईमेल नहीं चाहिए?",
        unsubscribe_link: "अनसब्सक्राइब करें",
      },
      admin_notification: {
        title: "नया न्यूज़लेटर सब्सक्रिप्शन",
        subject: "नया न्यूज़लेटर सब्सक्रिप्शन",
        preview: "एक नए यूज़र ने न्यूज़लेटर सब्सक्राइब किया है",
        message: "एक नए यूज़र ने न्यूज़लेटर सब्सक्राइब किया है।",
        subscriber_details: "सब्सक्राइबर की जानकारी",
        email: "ईमेल",
        name: "नाम",
        preferences: "पसंद",
        view_in_admin: "एडमिन पैनल में देखें",
      },
    },
  },
  unsubscribe: {
    category: "न्यूज़लेटर",
    tags: {
      newsletter: "न्यूज़लेटर",
    },
    email: {
      label: "ईमेल पता",
      description: "वह ईमेल पता जिसे न्यूज़लेटर से हटाना है",
      placeholder: "user@example.com",
      unsubscribe: {
        title: "न्यूज़लेटर से अनसब्सक्राइब करें",
        preview: "आप हमारे न्यूज़लेटर से अनसब्सक्राइब हो गए हैं",
        greeting: "नमस्ते",
        confirmation: "हमने {{email}} को अपने न्यूज़लेटर से हटा दिया है",
        resubscribe_info:
          "मन बदल जाए तो हमारी वेबसाइट पर जाकर कभी भी फिर से सब्सक्राइब कर सकते हैं",
        resubscribe_button: "फिर से सब्सक्राइब करें",
        support_message: "कोई सवाल हो तो हमारी सपोर्ट टीम से संपर्क करें",
        subject: "न्यूज़लेटर अनसब्सक्राइब की पुष्टि",
        admin_unsubscribe_notification: {
          title: "न्यूज़लेटर अनसब्सक्राइब नोटिफ़िकेशन",
          preview: "एक यूज़र ने न्यूज़लेटर से अनसब्सक्राइब किया है",
          message: "एक यूज़र ने न्यूज़लेटर से अनसब्सक्राइब किया है",
          email: "ईमेल",
          date: "तारीख",
          view_dashboard: "डैशबोर्ड देखें",
          subject: "न्यूज़लेटर अनसब्सक्राइब: एडमिन नोटिफ़िकेशन",
        },
      },
    },
    response: {
      success: "न्यूज़लेटर से अनसब्सक्राइब हो गया",
      message: "सफलता मैसेज",
    },
    errors: {
      email_generation_failed: "ईमेल नहीं बन पाया",
      internal: {
        title: "अंदरूनी एरर",
        description: "आपकी अनसब्सक्राइब रिक्वेस्ट प्रोसेस करते समय एरर आया",
      },
    },
    post: {
      title: "न्यूज़लेटर अनसब्सक्राइब",
      description: "न्यूज़लेटर अपडेट बंद करें",
      form: {
        title: "न्यूज़लेटर से अनसब्सक्राइब करें",
        description: "हमारे न्यूज़लेटर से अनसब्सक्राइब करने के लिए अपना ईमेल पता डालें",
      },
      response: {
        title: "अनसब्सक्राइब का जवाब",
        description: "न्यूज़लेटर अनसब्सक्राइब की पुष्टि",
      },
      errors: {
        unauthorized: {
          title: "अनुमति नहीं",
          description: "लॉग इन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "ईमेल पता गलत है",
        },
        internal: {
          title: "अंदरूनी एरर",
          description: "आपकी अनसब्सक्राइब रिक्वेस्ट प्रोसेस करते समय एरर आया",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस की अनुमति नहीं है",
        },
      },
      success: {
        title: "अनसब्सक्राइब हो गया",
        description: "आपको हमारे न्यूज़लेटर से हटा दिया गया है",
      },
    },
    sync: {
      failed: "न्यूज़लेटर अनसब्सक्राइब सिंक फ़ेल हुआ",
      error: "न्यूज़लेटर अनसब्सक्राइब सिंक एरर",
      tag: "न्यूज़लेटर सिंक",
      post: {
        title: "न्यूज़लेटर अनसब्सक्राइब सिंक",
        titleShort: "अनसब सिंक",
        description: "न्यूज़लेटर अनसब्सक्राइब के लिए लीड स्टेटस सिंक करें",
        container: {
          title: "अनसब्सक्राइब सिंक सेटिंग्स",
          description: "अनसब्सक्राइब सिंक के पैरामीटर सेट करें",
        },
        fields: {
          batchSize: {
            label: "बैच साइज़",
            description: "हर बैच में कितने रिकॉर्ड प्रोसेस हों",
          },
          dryRun: {
            label: "ड्राई रन",
            description: "बिना कोई बदलाव किए चलाएँ",
          },
        },
        response: {
          leadsProcessed: "प्रोसेस हुई लीड",
          leadsUpdated: "अपडेट हुई लीड",
          executionTimeMs: "चलने का समय (ms)",
        },
        errors: {
          unauthorized: {
            title: "अनुमति नहीं",
            description: "लॉग इन ज़रूरी है",
          },
          forbidden: {
            title: "मना है",
            description: "एक्सेस की अनुमति नहीं है",
          },
          server: {
            title: "सर्वर एरर",
            description: "अनसब्सक्राइब सिंक करते समय एरर आया",
          },
          unknown: {
            title: "अनजान एरर",
            description: "एक अनजान एरर आया",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
        },
        success: {
          title: "सिंक पूरा हुआ",
          description: "न्यूज़लेटर अनसब्सक्राइब सिंक पूरा हुआ",
        },
      },
    },
    emailTemplates: {
      unsubscribe: {
        name: "न्यूज़लेटर अनसब्सक्राइब ईमेल",
        description: "न्यूज़लेटर से अनसब्सक्राइब करने वाले यूज़र को भेजा जाने वाला पुष्टि ईमेल",
        category: "न्यूज़लेटर",
        preview: {
          email: {
            label: "ईमेल पता",
            description: "वह ईमेल पता जिसे अनसब्सक्राइब किया जा रहा है",
          },
        },
      },
    },
    sms: {
      confirmation: {
        message:
          "आप {{appName}} न्यूज़लेटर से अनसब्सक्राइब हो गए हैं। गलती से हुआ हो तो हमारी वेबसाइट पर जाकर फिर से सब्सक्राइब करें।",
      },
      admin_notification: {
        message: "न्यूज़लेटर अनसब्सक्राइब: {{email}} ने न्यूज़लेटर से अनसब्सक्राइब किया।",
      },
      errors: {
        confirmation_failed: {
          title: "SMS पुष्टि फ़ेल हुई",
          description: "अनसब्सक्राइब पुष्टि SMS नहीं भेजा जा सका",
        },
        admin_notification_failed: {
          title: "एडमिन SMS नोटिफ़िकेशन फ़ेल हुआ",
          description: "एडमिन नोटिफ़िकेशन SMS नहीं भेजा जा सका",
        },
      },
    },
  },
  email: {
    welcome: {
      title: "हमारे न्यूज़लेटर में स्वागत है",
      preview: "हमारे न्यूज़लेटर में स्वागत है! सब्सक्राइब करने के लिए शुक्रिया",
      greeting: "नमस्ते",
      greeting_with_name: "नमस्ते {{name}}",
      message: "{{appName}} न्यूज़लेटर में आपका स्वागत है! सब्सक्राइब करने के लिए शुक्रिया।",
      what_to_expect: "हमारे न्यूज़लेटर में आपको ये मिलेगा:",
      benefit_1: "ताज़ा प्रोडक्ट अपडेट और फ़ीचर्स",
      benefit_2: "इंडस्ट्री की जानकारी और ट्रेंड",
      benefit_3: "खास कंटेंट और टिप्स",
      benefit_4: "स्पेशल ऑफ़र और प्रमोशन",
      frequency: "हम हर हफ़्ते ताज़ा अपडेट के साथ न्यूज़लेटर भेजेंगे।",
      unsubscribe_text: "आप कभी भी अनसब्सक्राइब कर सकते हैं, बस क्लिक करें",
      unsubscribe_link: "यहाँ",
      subject: "हमारे न्यूज़लेटर में स्वागत है!",
    },
    admin_notification: {
      title: "नया न्यूज़लेटर सब्सक्रिप्शन",
      preview: "एक नए यूज़र ने न्यूज़लेटर सब्सक्राइब किया है",
      message: "एक नए यूज़र ने आपका न्यूज़लेटर सब्सक्राइब किया है।",
      subscriber_details: "सब्सक्राइबर की जानकारी",
      email: "ईमेल",
      name: "नाम",
      preferences: "पसंद",
      view_in_admin: "एडमिन पैनल में देखें",
      subject: "नया न्यूज़लेटर सब्सक्रिप्शन: एडमिन नोटिफ़िकेशन",
    },
    unsubscribe: {
      title: "न्यूज़लेटर से अनसब्सक्राइब करें",
      preview: "आप हमारे न्यूज़लेटर से अनसब्सक्राइब हो गए हैं",
      greeting: "नमस्ते",
      confirmation: "हमने {{email}} को अपने न्यूज़लेटर से हटा दिया है",
      resubscribe_info:
        "मन बदल जाए तो हमारी वेबसाइट पर जाकर कभी भी फिर से सब्सक्राइब कर सकते हैं",
      resubscribe_button: "फिर से सब्सक्राइब करें",
      support_message: "कोई सवाल हो तो हमारी सपोर्ट टीम से संपर्क करें",
      subject: "न्यूज़लेटर अनसब्सक्राइब की पुष्टि",
      admin_unsubscribe_notification: {
        title: "न्यूज़लेटर अनसब्सक्राइब नोटिफ़िकेशन",
        preview: "एक यूज़र ने न्यूज़लेटर से अनसब्सक्राइब किया है",
        message: "एक यूज़र ने न्यूज़लेटर से अनसब्सक्राइब किया है",
        email: "ईमेल",
        date: "तारीख",
        view_dashboard: "डैशबोर्ड देखें",
        subject: "न्यूज़लेटर अनसब्सक्राइब: एडमिन नोटिफ़िकेशन",
      },
    },
  },
  enum: {
    preferences: {
      marketing: "मार्केटिंग",
      productNews: "प्रोडक्ट न्यूज़",
      companyUpdates: "कंपनी अपडेट",
      industryInsights: "इंडस्ट्री की जानकारी",
      events: "इवेंट",
    },
    status: {
      subscribed: "सब्सक्राइब किया",
      unsubscribed: "अनसब्सक्राइब किया",
      pending: "बाकी",
      bounced: "बाउंस हुआ",
      complained: "शिकायत की",
    },
    creditBonus: {
      active: "बोनस चालू",
      pendingConfirmation: "अनलॉक करने के लिए ईमेल कन्फ़र्म करें",
      claimedElsewhere: "किसी दूसरे अकाउंट ने पहले ही ले लिया",
      accountRequired: "फ़्री अकाउंट ज़रूरी",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "न्यूज़लेटर सब्सक्रिप्शन: leadId नहीं है",
    },
  },
  errors: {
    email_generation_failed: "ईमेल नहीं बन पाया",
  },
  error: {
    general: {
      internal_server_error: "सर्वर में अंदरूनी एरर",
    },
    default: "एक एरर आया",
  },
  subscription: {
    error: {
      description: "न्यूज़लेटर सब्सक्राइब नहीं हो पाया",
    },
    unsubscribe: {
      error: "न्यूज़लेटर से अनसब्सक्राइब नहीं हो पाया",
      confirmQuestion: "क्या आप सच में अनसब्सक्राइब करना चाहते हैं?",
    },
  },
};
