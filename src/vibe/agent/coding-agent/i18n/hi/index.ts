import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एजेंट",
  "claude-code": "Claude Code",
  "open-code": "OpenCode",
  codex: "Codex",
  antigravity: "Antigravity CLI",
  idle: "निष्क्रिय",
  running: "चल रहा है",
  completed: "पूरा हुआ",
  interrupted: "रोका गया",
  failed: "फ़ेल",
  "read-only": "सिर्फ़ पढ़ना",
  "workspace-write": "वर्कस्पेस में लिखना",
  "danger-full-access": "पूरा एक्सेस",
  codingAgent: {
    tags: {
      tasks: "टास्क",
    },
    run: {
      post: {
        title: "कोडिंग एजेंट चलाएँ",
        titleShort: "कोडिंग एजेंट",
        dynamicTitle: "कोडिंग एजेंट: {{prompt}}",
        description:
          "Claude Code, OpenCode, Codex या Antigravity पर कोडिंग एजेंट टास्क चलाएँ। बातचीत सेव करने और बीच टर्न में स्टीयर करके दोबारा शुरू करने के लिए नाम दें, या लाइव टर्मिनल सेशन खोलने के लिए interactiveMode=true रखें।",
        fields: {
          name: {
            label: "एजेंट का नाम",
            description:
              "वैकल्पिक परसिस्टेंट एजेंट नाम (1 से 40 अक्षर, अंक, डैश या अंडरस्कोर)। वही नाम दोबारा देने से बातचीत फिर शुरू होती है।",
          },
          prompt: {
            label: "प्रॉम्प्ट",
            description:
              "कोडिंग एजेंट को भेजा जाने वाला टास्क या सवाल। फ़ाइल पाथ, कॉन्टेक्स्ट और अपेक्षित वेरिफ़िकेशन शामिल करें।",
          },
          promptFile: {
            label: "प्रॉम्प्ट फ़ाइल",
            description:
              "ब्रीफ़ फ़ाइल का पाथ, मौजूदा वर्किंग डायरेक्टरी के सापेक्ष। इनलाइन प्रॉम्प्ट का विकल्प।",
          },
          provider: {
            label: "प्रोवाइडर",
            description:
              "कौन सा कोडिंग एजेंट CLI इस्तेमाल करना है: claude-code, open-code, codex या antigravity। नए नाम वाले एजेंट के लिए डिफ़ॉल्ट codex और बिना नाम की रन के लिए claude-code।",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
              codex: "Codex",
              antigravity: "Antigravity CLI",
            },
          },
          model: {
            label: "मॉडल",
            description:
              "प्रोवाइडर मॉडल ID। प्रोवाइडर के डिफ़ॉल्ट के लिए खाली छोड़ें (Antigravity का डिफ़ॉल्ट Gemini 4 Neon High; Codex का डिफ़ॉल्ट gpt-6.2-sol)।",
          },
          effort: {
            label: "रीज़निंग एफ़र्ट",
            description:
              "Codex या Antigravity के लिए रीज़निंग एफ़र्ट (जैसे low, medium, high)।",
          },
          sandbox: {
            label: "Codex सैंडबॉक्स",
            description:
              "Codex रन के लिए फ़ाइलसिस्टम सैंडबॉक्स (read-only, workspace-write या danger-full-access)।",
          },
          cwd: {
            label: "वर्किंग डायरेक्टरी",
            description:
              "वो डायरेक्टरी जहाँ कोडिंग एजेंट चलता है। डिफ़ॉल्ट मौजूदा वर्किंग डायरेक्टरी।",
          },
          fresh: {
            label: "नए सिरे से शुरू करें",
            description:
              "इस एजेंट नाम के लिए सेव किया थ्रेड दोबारा शुरू करने की जगह नई बातचीत शुरू करें।",
          },
          taskTitle: {
            label: "टास्क का टाइटल",
            description:
              "इस टास्क को आर्काइव करने के लिए छोटा टाइटल (जैसे 'लॉगिन बग ठीक करो')। न दें तो प्रॉम्प्ट से अपने आप बनता है।",
          },
          interactiveMode: {
            label: "इंटरैक्टिव मोड",
            description:
              "false (डिफ़ॉल्ट): बिना टर्मिनल के चलता है और पूरा होने पर आउटपुट लौटाता है। true: लाइव सेशन के लिए टर्मिनल विंडो खोलता है और ख़त्म होने पर बताता है।",
          },
          output: {
            label: "आउटपुट",
            description:
              "कोडिंग एजेंट प्रोसेस का अंतिम जवाब या मिला-जुला stdout। बैकग्राउंड एक्ज़ीक्यूशन पर जाने पर खाली।",
          },
          durationMs: {
            label: "अवधि (ms)",
            description: "प्रोसेस कुल कितनी देर चला।",
          },
          threadId: {
            label: "बातचीत ID",
            description:
              "नाम वाले एजेंट को दोबारा शुरू करने के लिए सेव किया प्रोवाइडर थ्रेड या सेशन ID।",
          },
          status: {
            label: "स्टेटस",
            description: "परसिस्टेंट एजेंट टर्न का नतीजा।",
          },
          taskId: {
            label: "टास्क ID",
            description:
              "इंटरैक्टिव मोड के लिए: ट्रैकिंग टास्क ID। नतीजा पूरा होने पर अपने आप मिलता है।",
          },
          hint: {
            label: "संकेत",
            description: "AI के लिए मार्गदर्शन कि नतीजा कैसे पहुँचाया जाएगा।",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description:
              "रिक्वेस्ट के पैरामीटर गलत हैं। एजेंट का नाम, प्रॉम्प्ट और विकल्प जाँचें।",
          },
          unauthorized: {
            title: "अनधिकृत",
            description:
              "लॉगिन ज़रूरी है। एडमिन अकाउंट या प्रोवाइडर CLI से साइन इन करें।",
          },
          internal: {
            title: "एक्ज़ीक्यूशन फ़ेल",
            description: "कोडिंग एजेंट प्रोसेस शुरू नहीं हो सका या अचानक क्रैश हो गया।",
          },
          binaryMissing: {
            title:
              "{{bin}} इस इंस्टेंस पर इंस्टॉल नहीं है। उसे इंस्टॉल करें या कोई दूसरा प्रोवाइडर चुनें।",
            description: "कोडिंग एजेंट CLI बाइनरी इस सर्वर के PATH में नहीं मिली।",
          },
          internalExitCode: {
            title: "एक्ज़ीक्यूशन फ़ेल (exit {{exitCode}})",
            description: "कोडिंग एजेंट प्रोसेस नॉन-ज़ीरो exit कोड के साथ बाहर निकला।",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एक्सेस नहीं मिला। चुने हुए प्रोवाइडर की अनुमतियाँ जाँचें।",
          },
          notFound: {
            title: "नहीं मिला",
            description: "एजेंट, ब्रीफ़ फ़ाइल या वर्किंग डायरेक्टरी नहीं मिली।",
          },
          vibeCoderRedirect: {
            title: "इसकी जगह vibe-coder के साथ ai-run इस्तेमाल करें",
            description:
              "कोडिंग एजेंट vibe-coder पर सेट है। vibe-coder स्किल के साथ ai-run टूल इस्तेमाल करें।",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "प्रोवाइडर या कोडिंग एजेंट अभी उपलब्ध नहीं है।",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "एक्ज़ीक्यूशन के दौरान कोई अनपेक्षित एरर आया।",
          },
          unsaved: {
            title: "बिना सेव किए बदलाव",
            description: "बिना सेव किए बदलावों में टकराव मिला।",
          },
          conflict: {
            title: "टकराव",
            description:
              "इस नाम के तहत कोई और सेशन पहले से चल रहा है, या सेव किया थ्रेड किसी दूसरे प्रोवाइडर का है।",
          },
          detail: "कोडिंग एजेंट ऑपरेशन फ़ेल हुआ: {{detail}}",
        },
        backButton: {
          label: "वापस",
        },
        submitButton: {
          label: "भेजें",
          loadingText: "चल रहा है...",
        },
        success: {
          title: "कोडिंग एजेंट पूरा हुआ",
          description:
            "कोडिंग एजेंट सफलतापूर्वक पूरा हुआ। आउटपुट खाली हो तो नतीजा थ्रेड इंजेक्शन से आएगा।",
        },
        widget: {
          runningBatch: "चल रहा है...",
          runningInteractive: "इंटरैक्टिव टर्मिनल सेशन शुरू हो रहा है...",
          escalated: "बैकग्राउंड में चल रहा है। पूरा होने पर नतीजा जोड़ दिया जाएगा।",
          taskIdLabel: "टास्क ID",
          outputLabel: "आउटपुट",
          interactiveSessionLaunched: "इंटरैक्टिव सेशन टर्मिनल में शुरू हो गया।",
          copyOutput: "कॉपी करें",
          copied: "कॉपी हो गया!",
          interactive: "इंटरैक्टिव",
          emptyPromptHint: "कोडिंग एजेंट चलाने के लिए नीचे प्रॉम्प्ट डालें",
          agentNamePlaceholder: "एजेंट का नाम (वैकल्पिक)",
        },
      },
    },
    say: {
      post: {
        title: "कोडिंग एजेंट को स्टीयर करें",
        titleShort: "एजेंट स्टीयर करें",
        description:
          "चल रहे Codex या Antigravity कोडिंग एजेंट को बीच टर्न में स्टीयरिंग मैसेज भेजें। टर्न ख़त्म होने पर जारी रखने के लिए coding-agent के साथ वही नाम दोबारा इस्तेमाल करें।",
        success: {
          title: "मैसेज पहुँच गया",
          description: "स्टीयरिंग मैसेज चल रहे एजेंट तक पहुँच गया।",
        },
        fields: {
          message: {
            label: "मैसेज",
            description: "चालू टर्न में डाला जाने वाला मार्गदर्शन।",
          },
          messageFile: {
            label: "मैसेज फ़ाइल",
            description:
              "स्टीयरिंग मैसेज वाली फ़ाइल का पाथ, मौजूदा वर्किंग डायरेक्टरी के सापेक्ष।",
          },
          delivered: {
            label: "पहुँच गया",
          },
        },
      },
    },
    interrupt: {
      post: {
        title: "कोडिंग एजेंट को रोकें",
        titleShort: "एजेंट रोकें",
        description:
          "चल रहे Codex या Antigravity कोडिंग एजेंट का चालू टर्न रोकें। बाद में एजेंट नाम दोबारा इस्तेमाल करके जारी रखें।",
        success: {
          title: "रोकने का अनुरोध भेजा गया",
          description: "कोडिंग एजेंट के लिए इंटरप्ट सिग्नल प्रोसेस हो गया।",
        },
        fields: {
          interrupted: {
            label: "इंटरप्ट भेजा गया",
          },
          noInterrupt: {
            label: "कोई चालू टर्न नहीं",
          },
        },
      },
    },
    list: {
      post: {
        title: "कोडिंग एजेंट की लिस्ट",
        titleShort: "एजेंट की लिस्ट",
        description:
          "चल रहे और सेव किए परसिस्टेंट कोडिंग एजेंट की लिस्ट देखें। किसी एजेंट का हाल का ट्रांसक्रिप्ट और ताज़ा जवाब देखने के लिए नाम दें।",
        success: {
          title: "एजेंट लिस्ट हो गए",
          description: "चालू और सेव किए कोडिंग एजेंट लोड हो गए।",
        },
        fields: {
          summary: "{{name}} · {{provider}} · {{status}}",
          agents: {
            label: "एजेंट",
          },
          noAgents: {
            label: "अभी कोई परसिस्टेंट कोडिंग एजेंट नहीं।",
          },
          lines: {
            label: "ट्रांसक्रिप्ट लाइनें",
            description:
              "एक एजेंट देखते समय आख़िर की कितनी ट्रांसक्रिप्ट लाइनें शामिल करनी हैं।",
          },
          tail: {
            label: "हाल का ट्रांसक्रिप्ट",
          },
          emptyTail: {
            label: "ट्रांसक्रिप्ट खाली है।",
          },
          lastMessage: {
            label: "ताज़ा जवाब",
          },
          lastError: {
            label: "आख़िरी एरर",
          },
          startedAt: {
            label: "शुरू हुआ",
          },
          finishedAt: {
            label: "पूरा हुआ",
          },
        },
      },
    },
  },
};
