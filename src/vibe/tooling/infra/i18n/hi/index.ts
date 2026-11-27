import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "इंफ़्रास्ट्रक्चर",
  type: "इंफ़्रास्ट्रक्चर",

  enums: {
    infraStatus: {
      pending: "पेंडिंग",
      provisioning: "प्रोविज़निंग",
      ready: "तैयार",
      degraded: "कमज़ोर",
      error: "एरर",
    },
    componentStatus: {
      unknown: "अज्ञात",
      healthy: "स्वस्थ",
      degraded: "कमज़ोर",
      down: "डाउन",
    },
    scaleComponent: {
      web: "वेब (Next.js)",
      tasks: "टास्क रनर",
      storage: "स्टोरेज (MinIO)",
    },
  },

  errors: {
    noControlPlane:
      "कोई SSH कनेक्शन control-plane के रूप में टैग नहीं है। पहले SSH सेटिंग्स में कोई सर्वर टैग करें।",
    noClusterNodes:
      "कोई SSH कनेक्शन क्लस्टर नोड के रूप में टैग नहीं है। कम से कम एक सर्वर को control-plane टैग करें।",
    kubeconfigMissing: "Kubeconfig नहीं मिला। पहले cluster-init चलाएँ।",
    pulumiNotInstalled:
      "Pulumi CLI इंस्टॉल नहीं है। इसे इंस्टॉल करें: curl -fsSL https://get.pulumi.com | sh",
    sshExecFailed: "नोड पर SSH कमांड फ़ेल हुई",
    k3sInstallFailed: "k3s इंस्टॉलेशन फ़ेल हुआ",
    scaleTargetNotFound: "क्लस्टर में डिप्लॉयमेंट नहीं मिला",
    connectionNotFound: "SSH कनेक्शन नहीं मिला",
    encryptionFailed: "क्रेडेंशियल डिक्रिप्शन फ़ेल हुआ",
    connectTimeout: "SSH कनेक्शन टाइमआउट हो गया",
    sshAuthFailed: "SSH ऑथेंटिकेशन फ़ेल हुआ",
    sshConnectionFailed: "SSH कनेक्शन फ़ेल हुआ",
    fingerprintMismatch: "SSH होस्ट key फ़िंगरप्रिंट मेल नहीं खाता",
  },

  cluster: {
    init: {
      post: {
        title: "क्लस्टर इनिशियलाइज़ करें",
        titleShort: "क्लस्टर इनिट",
        description:
          "टैग किए SSH सर्वर पर k3s प्रोविज़न करें। k3s, डेटाबेस, Redis, MinIO और ingress इंस्टॉल करता है।",
        container: { title: "क्लस्टर इनिट" },
        fields: {
          clusterName: {
            label: "क्लस्टर का नाम",
            description: "इस क्लस्टर का नाम (kubeconfig और लेबल में इस्तेमाल)",
            placeholder: "next-vibe-prod",
          },
          domain: {
            label: "डोमेन",
            description:
              "ingress के लिए बेस डोमेन (जैसे example.com → app.example.com)",
            placeholder: "example.com",
          },
          email: {
            label: "ईमेल",
            description: "Let's Encrypt TLS सर्टिफ़िकेट के लिए संपर्क ईमेल",
            placeholder: "admin@example.com",
          },
          k3sVersion: {
            label: "k3s वर्ज़न",
            description: "इंस्टॉल करने वाली k3s रिलीज़",
            placeholder: "v1.31.0+k3s1",
          },
          dryRun: {
            label: "ड्राई रन",
            description: "बदलाव किए बिना प्रीव्यू देखें कि क्या इंस्टॉल होगा",
          },
          skipDatabase: {
            label: "डेटाबेस छोड़ें",
            description: "CloudNativePG PostgreSQL इंस्टॉलेशन छोड़ें",
          },
          skipRedis: {
            label: "Redis छोड़ें",
            description: "Redis Sentinel इंस्टॉलेशन छोड़ें",
          },
          skipStorage: {
            label: "स्टोरेज छोड़ें",
            description: "MinIO डिस्ट्रीब्यूटेड स्टोरेज इंस्टॉलेशन छोड़ें",
          },
          skipIngress: {
            label: "Ingress छोड़ें",
            description: "nginx-ingress और cert-manager इंस्टॉलेशन छोड़ें",
          },
        },
        response: {
          success: { title: "सफल" },
          message: { title: "मैसेज" },
          nodesProvisioned: { title: "प्रोविज़न किए नोड" },
          componentsInstalled: { title: "इंस्टॉल किए कॉम्पोनेंट" },
          kubeconfig: { title: "Kubeconfig" },
          duration: { title: "अवधि (ms)" },
        },
        success: {
          title: "क्लस्टर तैयार",
          description: "k3s क्लस्टर सफलतापूर्वक प्रोविज़न हुआ",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "गलत क्लस्टर कॉन्फ़िगरेशन",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एडमिन एक्सेस ज़रूरी है",
          },
          server: {
            title: "प्रोविज़निंग फ़ेल हुई",
            description: "क्लस्टर इनिशियलाइज़ेशन फ़ेल हुआ",
          },
          notFound: {
            title: "कोई नोड नहीं मिला",
            description: "कोई SSH कनेक्शन क्लस्टर नोड के रूप में टैग नहीं है",
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
            description: "क्लस्टर पहले से मौजूद है या प्रोविज़न हो रहा है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "क्लस्टर नोड तक नहीं पहुँच सके",
          },
        },
      },
    },
    status: {
      get: {
        title: "क्लस्टर स्टेटस",
        titleShort: "क्लस्टर स्टेटस",
        description: "k8s नोड की सेहत, पॉड की गिनती और कॉम्पोनेंट स्टेटस दिखाएँ",
        container: { title: "क्लस्टर स्टेटस" },
        response: {
          nodes: { title: "नोड" },
          components: { title: "कॉम्पोनेंट" },
          overallStatus: { title: "कुल स्टेटस" },
          podCounts: { title: "पॉड की गिनती" },
        },
        success: {
          title: "स्टेटस मिल गया",
          description: "क्लस्टर स्टेटस सफलतापूर्वक मिला",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "गलत पैरामीटर",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एडमिन एक्सेस ज़रूरी है",
          },
          server: {
            title: "सर्वर एरर",
            description: "क्लस्टर स्टेटस नहीं मिल सका",
          },
          notFound: {
            title: "कोई क्लस्टर नहीं",
            description: "कोई क्लस्टर कॉन्फ़िगर नहीं है। पहले cluster-init चलाएँ।",
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
            description: "क्लस्टर तक नहीं पहुँच सके",
          },
        },
      },
    },
  },

  deploy: {
    push: {
      post: {
        title: "डिप्लॉय",
        titleShort: "डिप्लॉय",
        description: "Pulumi से इंफ़्रास्ट्रक्चर बदलाव लागू करें (pulumi up)",
        container: { title: "डिप्लॉय" },
        fields: {
          stack: {
            label: "स्टैक",
            description: "Pulumi स्टैक का नाम",
            placeholder: "prod",
          },
          skipPreview: {
            label: "प्रीव्यू छोड़ें",
            description: "पहले प्रीव्यू दिखाए बिना बदलाव लागू करें",
          },
        },
        response: {
          success: { title: "सफल" },
          message: { title: "मैसेज" },
          changes: { title: "बदलाव" },
          duration: { title: "अवधि (ms)" },
        },
        success: {
          title: "डिप्लॉय हुआ",
          description: "इंफ़्रास्ट्रक्चर सफलतापूर्वक डिप्लॉय हुआ",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "गलत डिप्लॉय कॉन्फ़िगरेशन",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एडमिन एक्सेस ज़रूरी है",
          },
          server: {
            title: "डिप्लॉय फ़ेल हुआ",
            description: "Pulumi up फ़ेल हुआ",
          },
          notFound: {
            title: "कोई क्लस्टर नहीं",
            description: "कोई क्लस्टर कॉन्फ़िगर नहीं",
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
            description: "एक डिप्लॉय पहले से चल रहा है",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "क्लस्टर तक नहीं पहुँच सके",
          },
        },
      },
    },
    preview: {
      post: {
        title: "डिप्लॉय प्रीव्यू",
        titleShort: "प्रीव्यू",
        description:
          "बदलाव लागू किए बिना इंफ़्रास्ट्रक्चर बदलावों का प्रीव्यू देखें (pulumi preview)",
        container: { title: "डिप्लॉय प्रीव्यू" },
        fields: {
          stack: {
            label: "स्टैक",
            description: "Pulumi स्टैक का नाम",
            placeholder: "prod",
          },
        },
        response: {
          success: { title: "सफल" },
          message: { title: "मैसेज" },
          preview: { title: "प्रीव्यू" },
          duration: { title: "अवधि (ms)" },
        },
        success: {
          title: "प्रीव्यू तैयार",
          description: "प्रीव्यू सफलतापूर्वक बना",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "गलत कॉन्फ़िगरेशन",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एडमिन एक्सेस ज़रूरी है",
          },
          server: {
            title: "प्रीव्यू फ़ेल हुआ",
            description: "Pulumi preview फ़ेल हुआ",
          },
          notFound: {
            title: "कोई क्लस्टर नहीं",
            description: "कोई क्लस्टर कॉन्फ़िगर नहीं",
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
            description: "क्लस्टर तक नहीं पहुँच सके",
          },
        },
      },
    },
  },

  scale: {
    replicas: {
      post: {
        title: "स्केल",
        titleShort: "स्केल",
        description: "क्लस्टर में किसी डिप्लॉयमेंट को स्केल करें",
        container: { title: "डिप्लॉयमेंट स्केल करें" },
        fields: {
          component: {
            label: "कॉम्पोनेंट",
            description: "कौन सा डिप्लॉयमेंट स्केल करना है",
          },
          replicas: {
            label: "रेप्लिका",
            description: "लक्ष्य रेप्लिका गिनती (0 = रोकें)",
            placeholder: "2",
          },
        },
        response: {
          success: { title: "सफल" },
          message: { title: "मैसेज" },
          previousReplicas: { title: "पिछली रेप्लिका" },
          newReplicas: { title: "नई रेप्लिका" },
        },
        success: {
          title: "स्केल हुआ",
          description: "डिप्लॉयमेंट सफलतापूर्वक स्केल हुआ",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "गलत स्केल पैरामीटर",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एडमिन एक्सेस ज़रूरी है",
          },
          server: {
            title: "स्केल फ़ेल हुआ",
            description: "डिप्लॉयमेंट स्केल नहीं हो सका",
          },
          notFound: {
            title: "डिप्लॉयमेंट नहीं मिला",
            description: "क्लस्टर में डिप्लॉयमेंट नहीं मिला",
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
            description: "क्लस्टर तक नहीं पहुँच सके",
          },
        },
      },
    },
  },
};
