import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folderContents: "फ़ोल्डर की सामग्री",
  },
  config: {
    folders: {
      private: "प्राइवेट",
      shared: "शेयर्ड",
      public: "पब्लिक",
      background: "बैकग्राउंड",
      incognito: "इनकॉग्निटो",
      remote: "रिमोट",
    },
  },
  enums: {
    userRole: {
      public: "पब्लिक",
      customer: "कस्टमर",
      partnerAdmin: "पार्टनर एडमिन",
      partnerEmployee: "पार्टनर कर्मचारी",
      admin: "एडमिन",
    },
    threadStatus: {
      active: "सक्रिय",
      archived: "आर्काइव्ड",
      deleted: "हटाया गया",
    },
  },
  get: {
    title: "फ़ोल्डर की सामग्री देखें",
    titleShort: "फ़ोल्डर की सामग्री",
    description: "किसी फ़ोल्डर लेवल के फ़ोल्डर और थ्रेड की मिली-जुली सूची पाएँ",
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "रूट फ़ोल्डर (प्राइवेट, शेयर्ड, पब्लिक आदि)",
    },
    subFolderId: {
      label: "सब फ़ोल्डर",
      description: "सब फ़ोल्डर की ID (रूट लेवल के लिए null)",
    },
    threadIds: {
      label: "थ्रेड ID",
      description: "चुनिंदा थ्रेड ID से फ़िल्टर करें (सर्च नतीजों के लिए)",
    },
    response: {
      items: {
        item: {
          type: { content: "आइटम का प्रकार" },
          sortOrder: { content: "क्रम" },
          // Folder fields
          id: { content: "ID" },
          userId: { content: "यूज़र ID" },
          rootFolderId: { content: "रूट फ़ोल्डर" },
          name: { content: "नाम" },
          icon: { content: "आइकन" },
          color: { content: "रंग" },
          parentId: { content: "पैरेंट फ़ोल्डर" },
          expanded: { content: "खुला हुआ" },
          canManage: { content: "मैनेज कर सकते हैं" },
          canCreateThread: { content: "थ्रेड बना सकते हैं" },
          canModerate: { content: "मॉडरेट कर सकते हैं" },
          canDelete: { content: "हटा सकते हैं" },
          canManagePermissions: { content: "परमिशन मैनेज कर सकते हैं" },
          // Thread fields
          title: { content: "थ्रेड का टाइटल" },
          folderId: { content: "फ़ोल्डर" },
          status: { content: "स्टेटस" },
          preview: { content: "प्रिव्यू" },
          pinned: { content: "पिन किया हुआ" },
          archived: { content: "आर्काइव्ड" },
          canEdit: { content: "एडिट कर सकते हैं" },
          canPost: { content: "पोस्ट कर सकते हैं" },
          streamingState: { content: "स्ट्रीमिंग की स्थिति" },
          activeShareCount: { content: "चालू शेयर लिंक" },
          lastSharedAt: { content: "आखिरी बार शेयर किया" },
          createdAt: { content: "बनाने का समय" },
          updatedAt: { content: "अपडेट का समय" },
        },
      },
      rootFolderPermissions: {
        title: "रूट फ़ोल्डर की परमिशन",
        description: "रूट फ़ोल्डर के लिए परमिशन",
        canCreateThread: { content: "थ्रेड बना सकते हैं" },
        canCreateFolder: { content: "फ़ोल्डर बना सकते हैं" },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दी गई फ़ोल्डर ID सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर की सामग्री देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह फ़ोल्डर देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर की सामग्री लाते समय एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "आपका रिक्वेस्ट प्रोसेस करते समय टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "फ़ोल्डर की सामग्री मिल गई",
    },
    backButton: {
      label: "वापस",
    },
  },
};
