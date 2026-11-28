import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सर्वर मैनेजमेंट",
  tags: {
    imagePush: "इमेज पुश",
  },
  post: {
    title: "इमेज बिल्ड और पुश करें",
    titleShort: "इमेज पुश करें",
    description:
      "प्रोडक्शन Docker इमेज बिल्ड करें और उसे रजिस्ट्री या SSH से सीधे सर्वर तक पहुँचाएँ, ताकि डिप्लॉय सर्वर उसे बिल्ड करने की जगह सिर्फ़ पुल करे (या उसके पास पहले से हो)",
    form: {
      title: "इमेज पुश कॉन्फ़िगरेशन",
      description: "इमेज का नाम, टैग और टारगेट प्लेटफ़ॉर्म सेट करें",
      submit: "बिल्ड और पुश",
      runAgain: "फिर से चलाएँ",
    },
    fields: {
      image: {
        title: "इमेज",
        description:
          "बिल्ड और पुश करने के लिए रजिस्ट्री + इमेज नाम। डिफ़ॉल्ट आपकी .env का DOCKER_IMAGE_NAME।",
      },
      commit: {
        title: "कमिट",
        description:
          "बिल्ड करने का कमिट: sha, टैग या ब्रांच नाम। डिफ़ॉल्ट मौजूदा ब्रांच का HEAD। सिर्फ़ कमिट किया कोड शिप होता है। वर्किंग ट्री के बिना कमिट बदलाव कभी शामिल नहीं होते।",
      },
      tag: {
        title: "टैग",
        description:
          "इमेज टैग। डिफ़ॉल्ट बिल्ड किए कमिट का छोटा sha। छोटा sha और 'latest' हमेशा टैग भी होते हैं।",
      },
      push: {
        title: "पुश",
        description:
          "बिल्ड के बाद रजिस्ट्री पर पुश करें (या SSH टारगेट पर ट्रांसफ़र करें)। सिर्फ़ लोकल बिल्ड के लिए बंद करें: कोई पुश नहीं, कोई SSH ट्रांसफ़र नहीं, कोई डिप्लॉय नहीं।",
      },
      platform: {
        title: "प्लेटफ़ॉर्म",
        description:
          "बिल्ड का टारगेट प्लेटफ़ॉर्म (docker buildx --platform)। डिप्लॉय सर्वर के आर्किटेक्चर से मेल खाना चाहिए: आमतौर पर linux/amd64।",
      },
      sshTarget: {
        title: "SSH टारगेट",
        description:
          "रजिस्ट्री की जगह बिल्ड की गई इमेज को सीधे SSH से भेजने के लिए user@host (जैसे root@203.0.113.5): सेट हो तो डिफ़ॉल्ट SSH_SERVER। पहले SSH_SERVER_KEY की key दी जाती है, फिर पासवर्ड के विकल्प के तौर पर SSH_SERVER_PWD; दोनों सेट न हों तो आपकी अपनी SSH key/कॉन्फ़िग। रजिस्ट्री पर पुश करने के लिए ख़ाली छोड़ें।",
      },
      secondary: {
        title: "सर्वर 2 रोल करें",
        description:
          "सर्वर 1 लाइव और स्वस्थ होने के बाद दूसरा HA नोड (SSH_SERVER2) भी रोल करें: इमेज SSH_SERVER2_IMAGE_TAG के तहत लोड करें (कभी :latest नहीं), सर्वर 1 की .env सिंक करें, दोबारा बनाएँ, हेल्थ-चेक करें, ऑटो-रोलबैक। तब तक हर बॉक्स का Caddy दूसरे बॉक्स से सर्व करता है, इसलिए किसी को गैप नहीं दिखता। SSH_SERVER2 सेट न हो या --sshTarget दिया हो तो अनदेखा।",
      },
      primary: {
        title: "सर्वर 1 डिप्लॉय करें",
        description:
          "डिफ़ॉल्ट चालू। बंद = फ़ेलओवर के बाद सर्वर 1 डाउन या फ़ेंस्ड है: इमेज इसी मशीन से सीधे सर्वर 2 (SSH_SERVER2) पर भेजें और सिर्फ़ उसी नोड को रोल करें, उसकी अपनी .env और फ़ेलओवर ओवरराइड रखकर। धीमा (घर से अपलोड, बॉक्स-से-बॉक्स रिले नहीं)।",
      },
      drain: {
        title: "रीस्टार्ट से पहले ड्रेन करें",
        description:
          "डिफ़ॉल्ट चालू (दोनों HA नोड)। हर नोड पहले रोटेशन से बाहर होता है (Caddy नए रिक्वेस्ट पीयर को भेजता है, DNS उसे हटाता है), अपने चल रहे AI स्ट्रीम और टास्क पूरे करता है, अपने WebSocket क्लाइंट आगे भेजता है, और तभी नई इमेज पाता है। पहले सर्वर 1, फिर सर्वर 1 ट्रैफ़िक वापस लेता है जबकि सर्वर 2 ड्रेन होता है। बंद = इंतज़ार किए बिना दोबारा बनाएँ (पुराना व्यवहार)।",
      },
      drainTimeout: {
        title: "ड्रेन टाइमआउट (सेकंड)",
        description:
          "रीस्टार्ट से पहले नोड अपने चल रहे AI काम के लिए कितनी देर तक इंतज़ार करे। जो तब भी चल रहा हो उस पर शटडाउन ड्रेन (STREAM_DRAIN_TIMEOUT_MS) लगता है और अधूरा कंटेंट सेव करके उसे रोक दिया जाता है।",
      },
      cleanup: {
        title: "लोकली साफ़ करें",
        description:
          "डिफ़ॉल्ट चालू। सफल पुश के बाद नई लोड हुई इमेज और कंटेनर की इस्तेमाल की इमेज रखें। बाक़ी लोकल ghcr.io/techfreaque/next-vibe-app टैग हटाएँ। बाक़ी सभी कमिट एक्सपोर्ट और उनके मार्कर .tmp/todelete/image-build/ में ले जाएँ। कम से कम 24 घंटे से अनइस्तेमाल Docker बिल्ड कैश प्रून करें और 30 GB का लक्ष्य रखें। Docker फ़ाइलसिस्टम पर 40 GB से कम जगह हो तो क्लीनअप बिल्ड से पहले भी चलता है। प्रोडक्शन सर्वर के लिए remoteCleanup इस्तेमाल करें।",
      },
      remoteCleanup: {
        title: "प्रोडक्शन सर्वर साफ़ करें",
        description:
          "डिफ़ॉल्ट चालू। कोई नोड डिप्लॉय होकर हेल्थ चेक पास करे तो उस सर्वर पर सिर्फ़ ये रखें: जो इमेज कोई कंटेनर चला रहा है, उसके रोलबैक टैग (सर्वर 1 :latest, :rollback, :prod-current-good; सर्वर 2 :unbottled, :unbottled-rollback, :unbottled-prev और साथ होस्ट की साइट का :latest) और ghcr.io/techfreaque/next-vibe-app के सबसे नए 3 बिल्ड। पुराने टैग सादे docker rmi से हटते हैं (कभी -f नहीं, Docker इस्तेमाल में इमेज से इनकार करता है), फिर डैंगलिंग इमेज प्रून होती हैं। हर लोड से पहले 30 GB से कम जगह पर यही रिटेंशन चलता है। सिर्फ़ कॉन्फ़िगर किए HA सर्वर पर, कभी स्पष्ट --sshTarget पर नहीं। बंद = सिर्फ़ चेतावनी।",
      },
      skipCheck: {
        title: "सेफ़्टी गेट छोड़ें",
        description:
          "बिल्ड से पहले के सेफ़्टी गेट (vibe gen ड्रिफ़्ट जाँच और पूरे रेपो का vibe check) को बायपास करने का स्पष्ट रास्ता। एक ग़ैर-ख़ाली वजह चाहिए, जो लॉग होती है। .checked कैश मार्कर नहीं लिखता।",
      },
      checkOnly: {
        title: "सिर्फ़ जाँच",
        description:
          "कमिट एक्सपोर्ट करें, बिल्ड से पहले का सेफ़्टी गेट (vibe gen ड्रिफ़्ट जाँच और पूरे रेपो का vibe check) चलाएँ, पास होने पर .checked मार्कर लिखें, और Docker इमेज बिल्ड या पुश करने से पहले रुक जाएँ।",
      },
      success: {
        title: "सफल",
      },
      output: {
        title: "आउटपुट",
      },
      resolvedImage: {
        title: "इमेज",
      },
      tags: {
        title: "पुश हुए टैग",
      },
      duration: {
        title: "अवधि (ms)",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "इमेज पुश के दिए पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "इमेज पुश के दौरान नेटवर्क कनेक्शन फ़ेल हुआ",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "इमेज बिल्ड और पुश करने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपको इमेज बिल्ड और पुश करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इमेज पुश के रिसोर्स नहीं मिले",
      },
      server: {
        title: "सर्वर एरर",
        // Declared errorTypes label - rendered param-free, so no placeholder.
        description: "Docker बिल्ड या पुश फ़ेल हुआ",
      },
      unknown: {
        title: "अनजान एरर",
        description: "इमेज पुश के दौरान अनजान एरर हुई",
      },
      conflict: {
        title: "टकराव",
        description: "इमेज पुश में टकराव मिला",
      },
      unsavedChanges: {
        title: "अनजान एरर",
        description: "इमेज पुश के दौरान अनजान एरर हुई",
      },
    },
    success: {
      title: "इमेज पुश हुई",
      description: "Docker इमेज सफलतापूर्वक बिल्ड और पुश हुई",
    },
    repository: {
      messages: {
        buildStart: "🐳 {{image}}:{{tag}} बिल्ड हो रही है ...",
        buildSuccess: "✅ {{refs}} बिल्ड हुई (पुश नहीं की)",
        pushSuccess: "🚀 {{refs}} पुश हुई",
        buildMemoryExceeded: "बिल्ड {{gb}} GB की मेमोरी सीमा पर रोक दिया गया।",
        buildExitCode: "docker buildx कोड {{code}} के साथ बाहर निकला",
        buildKilled: "docker buildx को सिग्नल {{signal}} से मार दिया गया",
        dockerBuildFailed: "Docker बिल्ड फ़ेल हुआ: {{error}}",
        commitResolveFailed: "कमिट '{{ref}}' नहीं मिल सका",
        commitResolveFailedDetail: "कमिट '{{ref}}' नहीं मिल सका: {{error}}",
        commitResolved:
          "📌 कमिट {{sha}} बिल्ड हो रहा है ({{ref}}): {{subject}}",
        dirtyTreeWarning:
          "⚠️ वर्किंग ट्री में {{count}} बिना कमिट बदलाव हैं। वे इमेज से बाहर हैं। सिर्फ़ कमिट {{sha}} बिल्ड होता है।",
        deployedShaRecorded:
          "📝 डिप्लॉय किया कमिट {{sha}} {{path}} में दर्ज हुआ",
        deployedShaRecordFailed:
          "डिप्लॉय सफल रहा, पर {{path}} लिखना फ़ेल हुआ: {{error}}",
        exportStart: "📦 कमिट {{sha}} {{dir}} में एक्सपोर्ट हो रहा है ...",
        exportReused:
          "📦 {{sha}} का एक्सपोर्ट किया ट्री {{dir}} से दोबारा इस्तेमाल हो रहा है",
        exportFailed: "कमिट {{sha}} एक्सपोर्ट करना फ़ेल हुआ: {{error}}",
        sshTransferStart:
          "📡 {{refs}} को ssh से {{target}} पर भेजा जा रहा है ...",
        sshTransferSuccess: "🚀 {{refs}} ssh से {{target}} पर भेजी गईं",
        sshTransferFailed: "{{target}} पर ssh ट्रांसफ़र फ़ेल हुआ: {{error}}",
        scriptSynced: "📜 कमिट {{sha}} से {{target}} पर {{script}} सिंक हुई",
        scriptSyncFailed:
          "{{target}} पर {{script}} सिंक करना फ़ेल हुआ, डिप्लॉय रोका गया: {{error}}",
        scriptMissing: "कमिट {{sha}} में {{path}} ग़ायब है",
        scriptSyntaxInvalid:
          "bash -n ने कमिट {{sha}} की {{path}} अस्वीकार की। लाइव स्क्रिप्ट नहीं छुई गई।",
        pgGuardFailed:
          "{{target}} पर Postgres गार्ड ने डिप्लॉय रोक दिया, कुछ नहीं बदला: {{error}}",
        pgGuardMissing: "इस चेकआउट में {{path}} नहीं है",
        pgGuardPassed: "🛡️ {{target}} पर Postgres गार्ड पास",
        scriptRemoteExit: "रिमोट कमांड कोड {{code}} के साथ बाहर निकली",
        secondaryStart:
          "🔁 सर्वर 1 लाइव है। सर्वर 2 ({{target}}) रोल हो रहा है ...",
        secondarySuccess:
          "🚀 {{refs}} को {{target}} और सर्वर 2 ({{secondary}}) पर रोल किया",
        secondaryOnlyMissing:
          "--primary=false सिर्फ़ सर्वर 2 रोल करता है, पर SSH_SERVER2 सेट नहीं है",
        secondaryOnlySuccess:
          "🚀 सर्वर 1 छोड़ा गया। {{refs}} सर्वर 2 ({{secondary}}) पर रोल हुई",
        secondaryOnlyFailed:
          "सर्वर 2 ({{secondary}}) अकेले रोल करना फ़ेल हुआ: {{error}}। सर्वर 2 ने अपनी पिछली इमेज रखी या बहाल की।",
        secondaryFailed:
          "सर्वर 1 ({{target}}) नई इमेज पर लाइव है, पर सर्वर 2 ({{secondary}}) रोल करना फ़ेल हुआ: {{error}}। सर्वर 2 ने अपनी पिछली इमेज रखी या बहाल की।",
        drainStart:
          "🚰 {{node}} ड्रेन हो रहा है: नया ट्रैफ़िक पीयर को जाता है, चल रहे AI काम को {{timeout}}s तक का समय मिलता है",
        drainSwap:
          "🔀 {{from}} नई इमेज पर लाइव है और ट्रैफ़िक वापस ले रहा है। {{to}} ड्रेन हो रहा है ({{timeout}}s तक)",
        drainUndrained: "{{node}} अपनी पिछली इमेज पर रोटेशन में वापस आ गया",
        drainLeftDrained:
          "{{node}} DRAINED रहता है (रोटेशन से बाहर, पीयर सब कुछ सर्व कर रहा है): {{error}}। इसे ठीक करें, फिर दोनों बॉक्स पर चलाएँ: bash scripts/ha-node-drain.sh edge-off {{node}}",
        drainPreflightFailed:
          "{{target}} पर ड्रेन प्री-चेक ने डिप्लॉय से मना किया, कुछ नहीं बदला: {{error}}",
        drainScriptMissing:
          "कमिट {{sha}} में scripts/ha-node-drain.sh ग़ायब है: ड्रेन के बिना डिप्लॉय हो रहा है",
        drainStepFailed:
          "{{target}} पर ha-node-drain.sh {{step}} फ़ेल हुआ: {{error}}",
        envSyncFailed:
          "सर्वर 1 की .env सर्वर 2 पर कॉपी करना फ़ेल हुआ: {{error}}",
        cleanupSkippedImage:
          "🧹 लोकल क्लीनअप छोड़ा गया: {{image}} {{allowed}} नहीं है",
        cleanupListFailed:
          "लोकल क्लीनअप छोड़ा गया, {{image}} की इमेज की सूची नहीं मिल सकी: {{error}}",
        cleanupCurrentMissing:
          "लोकल इमेज क्लीनअप छोड़ा गया क्योंकि {{image}} के लिए अभी लोड हुई बिल्ड नहीं मिल सकी।",
        cleanupTagFailed: "लोकल {{ref}} हटाया नहीं जा सका: {{error}}",
        cleanupTagsRemoved:
          "🧹 {{image}} के {{count}} पुराने लोकल रेफ़ हटाए ({{tags}})",
        cleanupCachePruned:
          "🧹 कम से कम {{hours}} घंटे से अनइस्तेमाल Docker बिल्ड कैश प्रून हुआ ({{reclaimed}} वापस मिला)",
        cleanupCacheCapped:
          "🧹 Docker बिल्ड कैश {{size}} GB के लक्ष्य तक प्रून हुआ ({{reclaimed}} वापस मिला)",
        cleanupCacheFailed: "Docker बिल्ड कैश प्रून करना फ़ेल हुआ: {{error}}",
        cleanupExportsParked:
          "🧹 {{count}} पुराने कमिट एक्सपोर्ट {{dir}} में ले जाए गए",
        cleanupExportFailed:
          "पुराना कमिट एक्सपोर्ट {{dir}} ले जाना फ़ेल हुआ: {{error}}",
        diskLow:
          "⚠️ {{path}} पर सिर्फ़ {{free}} GB खाली (न्यूनतम {{min}} GB)। बिल्ड से पहले पुरानी लोकल इमेज और बिल्ड कैश प्रून हो रहे हैं ...",
        diskLowNoCleanup:
          "⚠️ {{path}} पर सिर्फ़ {{free}} GB खाली (न्यूनतम {{min}} GB)। क्लीनअप बंद है, कुछ प्रून नहीं हुआ। बिल्ड से डिस्क भर सकती है।",
        diskAfterPrune: "💽 प्रून के बाद {{path}} पर {{free}} GB खाली",
        diskCheckFailed: "{{path}} पर खाली जगह पढ़ी नहीं जा सकी: {{error}}",
        remoteDiskOk: "💽 {{target}}: लोड से पहले {{free}} GB खाली",
        remoteDiskLow:
          "⚠️ {{target}}: सिर्फ़ {{free}} GB खाली (न्यूनतम {{min}} GB)। लोड से पहले पुरानी इमेज हटाई जा रही हैं ...",
        remoteDiskLowNoCleanup:
          "⚠️ {{target}}: सिर्फ़ {{free}} GB खाली (न्यूनतम {{min}} GB)। remoteCleanup बंद है, कुछ नहीं हटा। लोड से डिस्क भर सकती है।",
        remoteDiskAfter: "💽 {{target}}: रिटेंशन के बाद {{free}} GB खाली",
        remoteListFailed:
          "{{target}} पर इमेज रिटेंशन छोड़ा गया, कुछ नहीं हटा: {{error}}",
        remoteTagFailed: "{{target}}: {{ref}} हटाया नहीं जा सका: {{error}}",
        remoteRetained:
          "🧹 {{target}}: {{count}} पुराने इमेज रेफ़ हटाए, सबसे नए {{keep}} बिल्ड, रोलबैक टैग और इस्तेमाल में इमेज रखीं: {{tags}}। डैंगलिंग प्रून: {{pruned}}",
        gateSkipped:
          "⚠️ कमिट {{sha}} के लिए डिप्लॉय सेफ़्टी गेट छोड़ा गया (--skipCheck): {{reason}}",
        gateCached:
          "✅ कमिट {{sha}} के लिए डिप्लॉय सेफ़्टी गेट पहले ही पास हो चुका है (कैश्ड मार्कर: {{marker}})",
        gateGenStart:
          "🔍 एक्सपोर्ट किए कमिट {{sha}} में जेनरेट फ़ाइलों की ड्रिफ़्ट जाँच हो रही है ...",
        gateGenPassed: "✅ कमिट {{sha}} के लिए जेनरेट फ़ाइलें अप-टू-डेट हैं",
        gateGenFailed:
          "डिप्लॉय रुका: कमिट {{sha}} के लिए vibe gen जाँच फ़ेल हुई: {{error}}",
        gateGenStale:
          "डिप्लॉय रुका: कमिट {{sha}} में जेनरेट फ़ाइलें पुरानी हैं (vibe gen ने {{count}} फ़ाइल बदली): {{files}}",
        gateCheckStart:
          "🔍 एक्सपोर्ट किए कमिट {{sha}} में पूरे रेपो का vibe check चल रहा है ...",
        gateCheckPassed:
          "✅ कमिट {{sha}} के लिए पूरे रेपो का vibe check पास हुआ",
        gateCheckFailed:
          "डिप्लॉय रुका: कमिट {{sha}} के लिए vibe check फ़ेल हुआ: {{error}}",
        gateCheckIncomplete:
          "डिप्लॉय रुका: कमिट {{sha}} के लिए vibe check पूरा नहीं हुआ: {{error}}",
        gateSetupFailed:
          "डिप्लॉय रुका: सेफ़्टी गेट के लिए एक्सपोर्ट किया कमिट {{sha}} तैयार नहीं हो सका: {{error}}",
        gateCleanupWarn:
          "⚠️ {{dir}} के लिए सेफ़्टी गेट क्लीनअप चेतावनी: {{error}}",
        gateMarkerWarn:
          "⚠️ {{sha}} के लिए सेफ़्टी गेट पास हुआ, पर कैश मार्कर {{path}} लिखना फ़ेल हुआ: {{error}}",
        gatePassed: "✅ कमिट {{sha}} के लिए डिप्लॉय सेफ़्टी गेट पास हुआ",
        checkOnlySuccess:
          "✅ कमिट {{sha}} के लिए सेफ़्टी गेट {{status}} (Docker बिल्ड और पुश --checkOnly से छोड़े गए)",
      },
    },
  },
};
