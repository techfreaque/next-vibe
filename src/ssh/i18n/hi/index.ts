import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",
  type: "SSH",

  enums: {
    authType: {
      password: "पासवर्ड",
      privateKey: "प्राइवेट key (PEM)",
      keyAgent: "SSH एजेंट",
      local: "लोकल मशीन",
    },
    clusterRole: {
      none: "कोई क्लस्टर रोल नहीं",
      controlPlane: "कंट्रोल प्लेन",
      worker: "वर्कर",
      storage: "स्टोरेज",
    },
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "/usr/sbin/nologin",
    },
  },

  errors: {
    localModeOnly: {
      title: "सिर्फ़ लोकल मोड",
      description: "यह फ़ीचर सिर्फ़ LOCAL_MODE में उपलब्ध है",
    },
    adminOnly: {
      title: "सिर्फ़ एडमिन",
      description: "मशीन फ़ीचर सिर्फ़ एडमिन खोल सकते हैं",
    },
    connectionNotFound: "कनेक्शन नहीं मिला",
    sessionNotFound: "सेशन नहीं मिला",
    fileNotFound: "फ़ाइल नहीं मिली",
    directoryNotFound: "डायरेक्टरी नहीं मिली",
    permissionDenied: "अनुमति नहीं",
    sshSecretKeyNotSet:
      "JWT_SECRET_KEY env var सेट नहीं है। SSH मोड चालू करने के लिए 32-बाइट hex वैल्यू जोड़ें।",
    encryptionFailed: "एन्क्रिप्शन फ़ेल हुआ: JWT_SECRET_KEY गलत हो सकती है",
    noRowReturned: "इन्सर्ट से कोई रो नहीं लौटी",
    notImplemented: {
      test: "SSH बैकएंड अभी लागू नहीं है। रिमोट कनेक्शन अभी टेस्ट नहीं हो सकते।",
      local: "SSH बैकएंड अभी लागू नहीं है। लोकल चलाने के लिए connectionId खाली छोड़ें।",
      fileList: "फ़ाइल लिस्टिंग के लिए SSH बैकएंड अभी लागू नहीं है",
      fileRead: "फ़ाइल पढ़ने के लिए SSH बैकएंड अभी लागू नहीं है",
      fileWrite: "फ़ाइल लिखने के लिए SSH बैकएंड अभी लागू नहीं है",
      session:
        "SSH PTY सेशन अभी लागू नहीं हैं। रिमोट कमांड के लिए ssh_exec_POST इस्तेमाल करें।",
    },
    fingerprintMismatch:
      "होस्ट फ़िंगरप्रिंट बदल गया है। MITM अटैक की आशंका। आगे बढ़ने के लिए acknowledgeNewFingerprint=true इस्तेमाल करें।",
    noDefaultConnection:
      "कोई डिफ़ॉल्ट SSH कनेक्शन सेट नहीं है। कनेक्शन बनाएँ और उसे डिफ़ॉल्ट करें।",
    sshConnectionFailed: "SSH कनेक्शन फ़ेल हुआ",
    sshAuthFailed: "SSH ऑथेंटिकेशन फ़ेल हुआ",
    connectTimeout: "कनेक्शन टाइमआउट हो गया",
    invalidWorkingDir:
      "वर्किंग डायरेक्टरी गलत है: '..' के बिना एब्सोल्यूट पाथ होना चाहिए",
    invalidPath: "पाथ गलत है: '..' के बिना एब्सोल्यूट होना चाहिए",
    parentDirNotFound:
      "पैरेंट डायरेक्टरी नहीं मिली। उसे बनाने के लिए createDirs=true सेट करें।",
    commandTimedOut: "कमांड टाइमआउट हो गई",
    cannotDeleteCurrentUser: "मौजूदा प्रोसेस यूज़र को नहीं हटाया जा सकता",
    cannotDeleteSystemUser: "सिस्टम यूज़र (uid < 1000) नहीं हटाए जा सकते",
    userNotFound: "यूज़र नहीं मिला",
    userAlreadyExists: "यूज़र पहले से मौजूद है",
    invalidUsername:
      "यूज़रनेम गलत है: छोटे अक्षर, अंक और हाइफ़न ही हो सकते हैं, और शुरुआत अक्षर से होनी चाहिए",
  },

  session: {
    read: {
      get: {
        title: "SSH सेशन का आउटपुट पढ़ें",
        description: "चालू SSH सेशन से बफ़र्ड आउटपुट पढ़ें",
        fields: {
          sessionId: {
            label: "सेशन ID",
            description: "जिस SSH सेशन से पढ़ना है उसकी ID",
          },
          waitMs: {
            label: "इंतज़ार (ms)",
            description: "आउटपुट के लिए कितने मिलीसेकंड रुकना है",
          },
          maxBytes: {
            label: "अधिकतम बाइट",
            description: "पढ़ने के लिए अधिकतम बाइट",
          },
        },
        response: {
          output: { title: "आउटपुट" },
          eof: { title: "EOF" },
          status: { title: "स्टेटस" },
        },
        success: {
          title: "सेशन आउटपुट पढ़ा गया",
          description: "सेशन आउटपुट सफलतापूर्वक पढ़ा गया",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "सेशन पढ़ने के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "सेशन आउटपुट पढ़ नहीं पाए",
          },
          notFound: {
            title: "सेशन नहीं मिला",
            description: "SSH सेशन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
    close: {
      post: {
        title: "SSH सेशन बंद करें",
        description: "चालू SSH सेशन बंद करें",
        fields: {
          sessionId: {
            label: "सेशन ID",
            description: "जिस SSH सेशन को बंद करना है उसकी ID",
          },
        },
        response: {
          ok: { title: "सफल" },
        },
        success: {
          title: "सेशन बंद हुआ",
          description: "SSH सेशन बंद हो गया",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "सेशन बंद करने के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "सेशन बंद नहीं हो सका",
          },
          notFound: {
            title: "सेशन नहीं मिला",
            description: "SSH सेशन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
    write: {
      post: {
        title: "SSH सेशन में लिखें",
        description: "चालू SSH सेशन में इनपुट भेजें",
        fields: {
          sessionId: {
            label: "सेशन ID",
            description: "जिस SSH सेशन में लिखना है उसकी ID",
          },
          input: {
            label: "इनपुट",
            description: "सेशन को भेजने के लिए इनपुट टेक्स्ट",
          },
          raw: {
            label: "रॉ",
            description: "इनपुट को बिना न्यूलाइन के रॉ बाइट की तरह भेजें",
          },
        },
        response: {
          ok: { title: "सफल" },
        },
        success: {
          title: "इनपुट भेजा गया",
          description: "इनपुट सेशन में लिख दिया गया",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "लिखने के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "सेशन में लिख नहीं पाए",
          },
          notFound: {
            title: "सेशन नहीं मिला",
            description: "SSH सेशन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
    open: {
      post: {
        title: "SSH सेशन खोलें",
        description: "इंटरैक्टिव SSH टर्मिनल सेशन खोलें",
        fields: {
          connectionId: {
            label: "कनेक्शन ID",
            description: "इस्तेमाल होने वाले SSH कनेक्शन की ID",
          },
          name: {
            label: "सेशन का नाम",
            description: "सेशन के लिए वैकल्पिक नाम",
          },
          cols: {
            label: "कॉलम",
            description: "टर्मिनल की चौड़ाई (कॉलम में)",
          },
          rows: {
            label: "पंक्तियाँ",
            description: "टर्मिनल की ऊँचाई (पंक्तियों में)",
          },
        },
        disconnected: "डिस्कनेक्टेड",
        response: {
          sessionId: { title: "सेशन ID" },
          status: { title: "स्टेटस" },
          shell: { title: "शेल" },
        },
        success: {
          title: "सेशन खुल गया",
          description: "SSH सेशन खुल गया",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "सेशन पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "सेशन खोल नहीं पाए",
          },
          notFound: {
            title: "कनेक्शन नहीं मिला",
            description: "SSH कनेक्शन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
  },

  terminal: {
    get: {
      title: "SSH टर्मिनल",
      description: "इंटरैक्टिव SSH टर्मिनल विजेट",
      response: {
        ok: { title: "टर्मिनल तैयार" },
      },
      success: {
        title: "टर्मिनल तैयार",
        description: "SSH टर्मिनल तैयार है",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        server: { title: "सर्वर एरर", description: "टर्मिनल एरर" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव मिले",
        },
        notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
        conflict: { title: "टकराव", description: "टकराव हो गया" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "वैलिडेशन फ़ेल हुआ",
        },
        forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
      },
    },
  },

  files: {
    read: {
      get: {
        title: "रिमोट फ़ाइल पढ़ें",
        description: "SSH से किसी फ़ाइल का कंटेंट पढ़ें",
        fields: {
          connectionId: {
            label: "कनेक्शन ID",
            description: "इस्तेमाल होने वाला SSH कनेक्शन",
            placeholder: "uuid",
          },
          path: {
            label: "फ़ाइल पाथ",
            description: "फ़ाइल का एब्सोल्यूट पाथ",
            placeholder: "/etc/hosts",
          },
          maxBytes: {
            label: "अधिकतम बाइट",
            description: "पढ़ने के लिए अधिकतम बाइट",
            placeholder: "102400",
          },
          offset: {
            label: "ऑफ़सेट",
            description: "जिस बाइट ऑफ़सेट से पढ़ना शुरू करना है",
            placeholder: "0",
          },
        },
        response: {
          content: { title: "कंटेंट" },
          size: { title: "साइज़" },
          truncated: { title: "कटा हुआ" },
          encoding: { title: "एन्कोडिंग" },
        },
        success: {
          title: "फ़ाइल पढ़ी गई",
          description: "फ़ाइल का कंटेंट मिल गया",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "फ़ाइल पढ़ने के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "फ़ाइल पढ़ नहीं पाए",
          },
          notFound: {
            title: "फ़ाइल नहीं मिली",
            description: "फ़ाइल या कनेक्शन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
    list: {
      get: {
        title: "रिमोट फ़ाइलें लिस्ट करें",
        description: "SSH से रिमोट डायरेक्टरी की फ़ाइलें लिस्ट करें",
        fields: {
          connectionId: {
            label: "कनेक्शन ID",
            description: "इस्तेमाल होने वाला SSH कनेक्शन",
            placeholder: "uuid",
          },
          path: {
            label: "डायरेक्टरी पाथ",
            description: "डायरेक्टरी का एब्सोल्यूट पाथ",
            placeholder: "/",
          },
        },
        response: {
          entries: { title: "एंट्री" },
          currentPath: { title: "मौजूदा पाथ" },
        },
        success: {
          title: "डायरेक्टरी लिस्ट हुई",
          description: "डायरेक्टरी का कंटेंट मिल गया",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "लिस्ट के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "डायरेक्टरी लिस्ट नहीं हो पाई",
          },
          notFound: {
            title: "नहीं मिला",
            description: "डायरेक्टरी या कनेक्शन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
    write: {
      post: {
        title: "रिमोट फ़ाइल लिखें",
        description: "SSH से किसी फ़ाइल में कंटेंट लिखें",
        fields: {
          connectionId: {
            label: "कनेक्शन ID",
            description: "इस्तेमाल होने वाला SSH कनेक्शन",
            placeholder: "uuid",
          },
          path: {
            label: "फ़ाइल पाथ",
            description: "जिस एब्सोल्यूट पाथ पर लिखना है",
            placeholder: "/tmp/file.txt",
          },
          content: {
            label: "कंटेंट",
            description: "फ़ाइल में लिखने का कंटेंट",
            placeholder: "फ़ाइल का कंटेंट",
          },
          createDirs: {
            label: "डायरेक्टरी बनाएँ",
            description: "पैरेंट डायरेक्टरी न हों तो बना दें",
          },
        },
        response: {
          ok: { title: "सफल" },
          bytesWritten: { title: "लिखे गए बाइट" },
        },
        success: {
          title: "फ़ाइल लिखी गई",
          description: "फ़ाइल सफलतापूर्वक लिखी गई",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "फ़ाइल लिखने के पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "फ़ाइल लिख नहीं पाए",
          },
          notFound: {
            title: "नहीं मिला",
            description: "पाथ या कनेक्शन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
  },

  linux: {
    users: {
      list: {
        get: {
          title: "Linux यूज़र लिस्ट करें",
          description: "SSH से रिमोट सर्वर के Linux यूज़र लिस्ट करें",
          response: {
            users: { title: "यूज़र" },
          },
          success: {
            title: "यूज़र लिस्ट हुए",
            description: "Linux यूज़र मिल गए",
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "वैलिडेशन फ़ेल हुआ",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "लॉगिन ज़रूरी है",
            },
            forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
            server: {
              title: "सर्वर एरर",
              description: "यूज़र लिस्ट नहीं हो पाए",
            },
            notFound: {
              title: "नहीं मिला",
              description: "रिसोर्स नहीं मिला",
            },
            unknown: {
              title: "अज्ञात एरर",
              description: "कोई अनपेक्षित एरर आया",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "बिना सेव किए बदलाव मिले",
            },
            conflict: {
              title: "टकराव",
              description: "टकराव हो गया",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर आया",
            },
          },
        },
      },
      username: {
        delete: {
          title: "Linux यूज़र हटाएँ",
          description: "SSH से रिमोट सर्वर से Linux यूज़र डिलीट करें",
          fields: {
            removeHome: {
              label: "होम हटाएँ",
              description: "यूज़र की होम डायरेक्टरी भी हटाएँ",
            },
          },
          response: {
            ok: { title: "सफल" },
          },
          success: {
            title: "यूज़र डिलीट हुआ",
            description: "Linux यूज़र डिलीट हो गया",
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "वैलिडेशन फ़ेल हुआ",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "लॉगिन ज़रूरी है",
            },
            forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
            server: {
              title: "सर्वर एरर",
              description: "यूज़र हटाना फ़ेल हुआ",
            },
            notFound: {
              title: "यूज़र नहीं मिला",
              description: "Linux यूज़र नहीं मिला",
            },
            unknown: {
              title: "अज्ञात एरर",
              description: "कोई अनपेक्षित एरर आया",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "बिना सेव किए बदलाव मिले",
            },
            conflict: {
              title: "टकराव",
              description: "टकराव हो गया",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर आया",
            },
          },
        },
      },
      create: {
        post: {
          title: "Linux यूज़र बनाएँ",
          description: "SSH से रिमोट सर्वर पर Linux यूज़र बनाएँ",
          fields: {
            username: {
              label: "यूज़रनेम",
              description: "नए अकाउंट का यूज़रनेम",
              placeholder: "deploy",
            },
            groups: {
              label: "ग्रुप",
              description: "यूज़र को जोड़ने के लिए अतिरिक्त ग्रुप",
              placeholder: "sudo,docker",
            },
            shell: {
              label: "शेल",
              description: "यूज़र का लॉगिन शेल",
              placeholder: "/bin/bash",
            },
            homeDir: {
              label: "होम डायरेक्टरी",
              description: "होम डायरेक्टरी का पाथ",
              placeholder: "/home/deploy",
            },
            sudoAccess: {
              label: "Sudo एक्सेस",
              description: "यूज़र को sudo एक्सेस दें",
            },
          },
          response: {
            ok: { title: "सफल" },
            uid: { title: "UID" },
            gid: { title: "GID" },
            homeDirectory: { title: "होम डायरेक्टरी" },
            shell: { title: "शेल" },
          },
          success: {
            title: "यूज़र बन गया",
            description: "Linux यूज़र बन गया",
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "वैलिडेशन फ़ेल हुआ",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "लॉगिन ज़रूरी है",
            },
            forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
            server: {
              title: "सर्वर एरर",
              description: "यूज़र बना नहीं पाए",
            },
            notFound: {
              title: "नहीं मिला",
              description: "कनेक्शन नहीं मिला",
            },
            unknown: {
              title: "अज्ञात एरर",
              description: "कोई अनपेक्षित एरर आया",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "बिना सेव किए बदलाव मिले",
            },
            conflict: {
              title: "टकराव",
              description: "टकराव हो गया",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर आया",
            },
          },
        },
      },
    },
  },

  exec: {
    post: {
      title: "SSH कमांड चलाएँ",
      description: "SSH से रिमोट सर्वर पर कमांड चलाएँ",
      fields: {
        connectionId: {
          label: "कनेक्शन ID",
          description: "इस्तेमाल होने वाला SSH कनेक्शन",
          placeholder: "uuid",
        },
        command: {
          label: "कमांड",
          description: "चलाने की कमांड",
          placeholder: "ls -la",
        },
        workingDir: {
          label: "वर्किंग डायरेक्टरी",
          description: "कमांड की वर्किंग डायरेक्टरी",
          placeholder: "/home/user",
        },
        timeoutMs: {
          label: "टाइमआउट (ms)",
          description: "कमांड टाइमआउट (मिलीसेकंड में)",
          placeholder: "30000",
        },
      },
      response: {
        stdout: { title: "Stdout" },
        stderr: { title: "Stderr" },
        exitCode: { title: "एग्ज़िट कोड" },
        status: { title: "स्टेटस" },
        durationMs: { title: "अवधि (ms)" },
        backend: { title: "बैकएंड" },
        truncated: { title: "कटा हुआ" },
      },
      success: {
        title: "कमांड चल गई",
        description: "कमांड सफलतापूर्वक चली",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "कमांड पैरामीटर गलत हैं",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
        server: {
          title: "सर्वर एरर",
          description: "कमांड नहीं चल पाई",
        },
        notFound: {
          title: "कनेक्शन नहीं मिला",
          description: "SSH कनेक्शन नहीं मिला",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव मिले",
        },
        conflict: { title: "टकराव", description: "टकराव हो गया" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
      },
    },
  },

  connections: {
    id: {
      get: {
        title: "SSH कनेक्शन देखें",
        description: "SSH कनेक्शन की जानकारी देखें",
        response: {
          id: { title: "ID" },
          label: { title: "लेबल" },
          host: { title: "होस्ट" },
          port: { title: "पोर्ट" },
          username: { title: "यूज़रनेम" },
          authType: { title: "ऑथ प्रकार" },
          isDefault: { title: "डिफ़ॉल्ट है" },
          fingerprint: { title: "Fingerprint" },
          notes: { title: "नोट्स" },
          createdAt: { title: "बनाने का समय" },
        },
        success: {
          title: "कनेक्शन मिला",
          description: "SSH कनेक्शन मिल गया",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "वैलिडेशन फ़ेल हुआ",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "कनेक्शन नहीं मिल पाया",
          },
          notFound: {
            title: "कनेक्शन नहीं मिला",
            description: "SSH कनेक्शन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
    list: {
      get: {
        title: "SSH कनेक्शन लिस्ट करें",
        description: "सभी SSH कनेक्शन लिस्ट करें",
        response: {
          connections: { title: "कनेक्शन" },
        },
        success: {
          title: "कनेक्शन लिस्ट हुए",
          description: "SSH कनेक्शन मिल गए",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "वैलिडेशन फ़ेल हुआ",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "कनेक्शन की लिस्ट नहीं मिल सकी",
          },
          notFound: {
            title: "नहीं मिला",
            description: "कोई कनेक्शन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
    create: {
      post: {
        title: "SSH कनेक्शन बनाएँ",
        description: "नया SSH कनेक्शन बनाएँ",
        fields: {
          label: {
            label: "लेबल",
            description: "कनेक्शन का आसान नाम",
            placeholder: "prod-web-01",
          },
          host: {
            label: "होस्ट",
            description: "SSH सर्वर का होस्टनेम या IP",
            placeholder: "192.168.1.1",
          },
          port: {
            label: "पोर्ट",
            description: "SSH सर्वर का पोर्ट",
            placeholder: "22",
          },
          username: {
            label: "यूज़रनेम",
            description: "SSH यूज़रनेम",
            placeholder: "deploy",
          },
          authType: {
            label: "ऑथ प्रकार",
            description: "ऑथेंटिकेशन का तरीक़ा",
          },
          secret: {
            label: "सीक्रेट",
            description: "पासवर्ड या प्राइवेट key",
          },
          passphrase: {
            label: "पासफ़्रेज़",
            description: "प्राइवेट key का पासफ़्रेज़ (अगर हो)",
          },
          isDefault: {
            label: "डिफ़ॉल्ट",
            description: "डिफ़ॉल्ट कनेक्शन के रूप में सेट करें",
          },
          clusterRole: {
            label: "क्लस्टर रोल",
            description: "k8s क्लस्टर में इस सर्वर की भूमिका",
          },
          notes: {
            label: "नोट्स",
            description: "इस कनेक्शन के बारे में वैकल्पिक नोट्स",
          },
        },
        response: {
          id: { title: "ID" },
        },
        success: {
          title: "कनेक्शन बन गया",
          description: "SSH कनेक्शन बन गया",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "कनेक्शन पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "कनेक्शन नहीं बन पाया",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रिसोर्स नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
    test: {
      post: {
        title: "SSH कनेक्शन टेस्ट करें",
        description: "SSH कनेक्शन टेस्ट करें",
        fields: {
          connectionId: {
            label: "कनेक्शन ID",
            description: "जिस SSH कनेक्शन को टेस्ट करना है उसकी ID",
            placeholder: "uuid",
          },
          acknowledgeNewFingerprint: {
            label: "फ़िंगरप्रिंट स्वीकारें",
            description: "नया होस्ट फ़िंगरप्रिंट स्वीकारें",
            placeholder: "false",
          },
        },
        response: {
          ok: { title: "सफल" },
          latencyMs: { title: "लेटेंसी (ms)" },
          fingerprint: { title: "Fingerprint" },
          fingerprintChanged: { title: "फ़िंगरप्रिंट बदला" },
        },
        success: {
          title: "कनेक्शन सफल",
          description: "SSH कनेक्शन टेस्ट पास हुआ",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "टेस्ट पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
          server: {
            title: "सर्वर एरर",
            description: "कनेक्शन टेस्ट फ़ेल हुआ",
          },
          notFound: {
            title: "कनेक्शन नहीं मिला",
            description: "SSH कनेक्शन नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलाव मिले",
          },
          conflict: { title: "टकराव", description: "टकराव हो गया" },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
        },
      },
    },
  },
};
