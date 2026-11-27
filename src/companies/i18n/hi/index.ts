import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "कंपनियाँ",
  tags: {
    companies: "कंपनियाँ",
    create: "बनाएँ",
    list: "सूची",
    get: "पाएँ",
    update: "अपडेट",
    members: "सदस्य",
    invite: "आमंत्रित करें",
    management: "प्रबंधन",
  },
  endpointCategories: {
    companies: "कंपनियाँ",
    companyManagement: "कंपनी प्रबंधन",
    companyMembers: "कंपनी सदस्य",
  },
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "व्यक्तिगत",
    },
    companyMemberRole: {
      owner: "मालिक",
      admin: "एडमिन",
      member: "सदस्य",
      accountant: "अकाउंटेंट",
      viewer: "दर्शक",
    },
  },
  auth: {
    errors: {
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपके पास यह कार्रवाई करने की अनुमति नहीं है",
      },
      notFound: {
        title: "कंपनी नहीं मिली",
        description: "यह कंपनी मौजूद नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
      },
      patchNotFound: {
        title: "कंपनी नहीं मिली",
        description: "अपडेट करने के लिए कंपनी नहीं मिली",
      },
      patchServer: {
        title: "सर्वर एरर",
        description: "कंपनी अपडेट नहीं हो सकी",
      },
    },
  },
  updateRole: {
    patch: {
      title: "सदस्य का रोल बदलें",
      titleShort: "रोल बदलें",
      description: "किसी सदस्य का रोल बदलें। सिर्फ़ मालिक।",
      companyId: {
        label: "कंपनी ID",
        description: "कंपनी",
      },
      memberId: {
        label: "सदस्य ID",
        description: "जिस सदस्य को अपडेट करना है",
      },
      role: {
        label: "नया रोल",
        description: "इस सदस्य को दिया जाने वाला रोल",
        placeholder: "रोल चुनें",
      },
      errors: {
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "सदस्य के रोल अपडेट करने के लिए साइन इन करें",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "इनपुट गलत है",
        },
        forbidden: {
          title: "सिर्फ़ मालिक",
          description: "सदस्य के रोल सिर्फ़ कंपनी का मालिक बदल सकता है",
        },
        server: {
          title: "सर्वर एरर",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कुछ अनपेक्षित हुआ",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा टकराव",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "सदस्य नहीं मिला",
          description: "यह सदस्य कंपनी में मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "रोल अपडेट हुआ",
        description: "सदस्य का रोल सफलतापूर्वक बदल गया",
      },
      response: {
        memberId: "सदस्य ID",
        role: "नया रोल",
      },
      widget: {
        back: "सदस्यों पर वापस",
        successLabel: "रोल अपडेट हुआ",
        title: "सदस्य का रोल बदलें",
      },
    },
  },
  removeMember: {
    post: {
      title: "सदस्य हटाएँ",
      titleShort: "सदस्य हटाएँ",
      description: "कंपनी से सदस्य हटाएँ। आख़िरी मालिक को नहीं हटा सकते।",
      companyId: {
        label: "कंपनी ID",
        description: "कंपनी",
      },
      memberId: {
        label: "सदस्य ID",
        description: "जिस सदस्य को हटाना है",
      },
      errors: {
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "सदस्य हटाने के लिए साइन इन करें",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "इनपुट गलत है",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description:
            "मालिक या एडमिन रोल ज़रूरी है। आख़िरी मालिक को नहीं हटाया जा सकता।",
        },
        server: {
          title: "सर्वर एरर",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कुछ अनपेक्षित हुआ",
        },
        conflict: {
          title: "आख़िरी मालिक",
          description: "कंपनी के आख़िरी मालिक को नहीं हटाया जा सकता",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "सदस्य नहीं मिला",
          description: "यह सदस्य कंपनी में मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "सदस्य हटा दिया गया",
        description: "सदस्य को कंपनी से हटा दिया गया",
      },
      response: {
        removedMemberId: "हटाए गए सदस्य की ID",
      },
      widget: {
        back: "सदस्यों पर वापस",
        successLabel: "सदस्य हटा दिया गया",
        confirmTitle: "यह सदस्य हटाएँ?",
        confirmDescription:
          "उनका इस कंपनी का एक्सेस तुरंत खत्म हो जाएगा। इसे पलटा नहीं जा सकता।",
        confirmButton: "हाँ, सदस्य हटाएँ",
        cancelButton: "रद्द करें",
      },
    },
  },
};
