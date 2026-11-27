import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} सेटअप करें",
    description: "आपके सेल्फ़ होस्टेड इंस्टेंस का पहला सेटअप।",
  },
  stepOf: "स्टेप {{current}} / {{total}}",
  steps: {
    admin: "एडमिन लॉगिन",
    ai: "AI जोड़ें",
    extras: "एक्स्ट्रा",
    done: "हो गया",
  },
  back: "वापस",
  continue: "आगे बढ़ें",
  getKey: "key लें",
  secretSaved: "सेव हो गया। इसे बनाए रखने के लिए ख़ाली छोड़ें।",
  errors: {
    saveFailed: "सेव नहीं हो पाया। vibe dev चला रहे टर्मिनल को देखें और फिर कोशिश करें।",
  },
  restart: {
    title: "आपकी सेटिंग्स लागू हो रही हैं",
    body: "इन्हें लोड करने के लिए आपका इंस्टेंस रीस्टार्ट होता है। यह पेज कुछ सेकंड में ख़ुद रीलोड हो जाएगा।",
    slow: "सामान्य से ज़्यादा समय लग रहा है?",
    reload: "पेज रीलोड करें",
    manualTitle: "सेव हो गया",
    manualBody: "नई सेटिंग्स लागू करने के लिए सर्वर रीस्टार्ट करें। तब तक आप आगे बढ़ सकते हैं।",
    continue: "आगे बढ़ें",
  },
  welcome: {
    title: "आपका इंस्टेंस चल रहा है।",
    body: "अपने एडमिन लॉगिन से इसे सुरक्षित करें, AI जोड़ें और चैट शुरू। बस 2 मिनट।",
    inProgress:
      "इस इंस्टेंस पर सेटअप शुरू हो चुका है। पूरा करने के लिए एडमिन के तौर पर साइन इन करें।",
    failed:
      "बिल्ट इन एडमिन लॉगिन काम नहीं किया। अगर आपने इसे पहले ही बदल दिया है, तो अपने लॉगिन से साइन इन करें।",
    start: "सेटअप शुरू करें",
    starting: "शुरू हो रहा है",
    signIn: "एडमिन के तौर पर साइन इन करें",
  },
  readOnly: {
    title: "यहाँ सेटिंग्स सिर्फ़ पढ़ी जा सकती हैं",
    body: "यह इंस्टेंस अपनी सेटिंग्स डिप्लॉयमेंट एनवायरनमेंट से लेता है, इसलिए यह पेज उन्हें सेव नहीं कर सकता। जहाँ डिप्लॉय करते हैं वहाँ सेट करें, फिर रीस्टार्ट करें।",
  },
  admin: {
    title: "अपना एडमिन लॉगिन बनाएँ",
    body: "यह बिल्ट इन डिफ़ॉल्ट लॉगिन की जगह लेता है। इसी से आप यहाँ और vibe CLI में साइन इन करेंगे।",
    email: "ईमेल",
    emailHelp: "आपका साइन इन नाम। इस पर कुछ भेजा नहीं जाता।",
    emailPlaceholder: "you@example.com",
    password: "पासवर्ड",
    passwordHelp: "कम से कम 8 अक्षर। इसी मशीन पर एन्क्रिप्ट करके स्टोर होता है।",
    confirm: "पासवर्ड दोबारा लिखें",
    save: "सेव करें और आगे बढ़ें",
    errors: {
      email: "सही ईमेल पता डालें।",
      passwordShort: "कम से कम 8 अक्षर रखें।",
      passwordDefault: "डिफ़ॉल्ट नहीं, अपना ख़ुद का पासवर्ड चुनें।",
      mismatch: "दोनों पासवर्ड मेल नहीं खाते।",
    },
  },
  ai: {
    title: "AI जोड़ें",
    body: "चुनें कि मॉडल कहाँ से आएँ। एक विकल्प काफ़ी है। बाद में कभी भी और जोड़ें।",
    byo: "या अपनी key लाएँ",
    moreProviders: "और प्रोवाइडर",
    skip: "अभी छोड़ें",
    unbottled: {
      title: "आपका unbottled.ai अकाउंट",
      recommended: "सुझाया गया",
      body: "एक साइन इन से unbottled.ai के सारे मॉडल अनलॉक: मेनस्ट्रीम, ओपन और अनसेंसर्ड। इस्तेमाल आपके unbottled.ai क्रेडिट से चलता है। कोई प्रोवाइडर key संभालने की ज़रूरत नहीं।",
      email: "unbottled.ai ईमेल",
      password: "unbottled.ai पासवर्ड",
      advanced: "एडवांस्ड",
      serverUrl: "सर्वर URL",
      serverUrlHelp: "इसे सिर्फ़ किसी दूसरे next-vibe इंस्टेंस से जुड़ने के लिए बदलें।",
      failed: "साइन इन फ़ेल हो गया। अपना ईमेल और पासवर्ड जाँचें।",
      connect: "अकाउंट जोड़ें",
      connecting: "जुड़ रहा है",
      connected: "{{url}} से जुड़ गया",
      unhealthy: "कनेक्शन सेव हो गया, लेकिन सर्वर अभी जवाब नहीं दे रहा।",
      disconnect: "डिस्कनेक्ट करें",
      noAccount: "अभी अकाउंट नहीं है?",
      createAccount: "अकाउंट बनाएँ",
    },
    claude: {
      title: "Claude Code",
      detectedBadge: "मिल गया",
      missingBadge: "इंस्टॉल नहीं है",
      detected:
        "इस मशीन पर मिल गया। Claude मॉडल आपके Claude सब्सक्रिप्शन पर चलते हैं। कुछ भरने की ज़रूरत नहीं।",
      missing:
        "अपना Claude सब्सक्रिप्शन इस्तेमाल करने के लिए claude CLI इंस्टॉल करें और साइन इन करें। फिर vibe dev रीस्टार्ट करें।",
    },
  },
  fields: {
    openRouter: {
      label: "OpenRouter API key",
      help: "एक key के पीछे सैकड़ों मॉडल।",
    },
    venice: {
      label: "Venice AI API key",
      help: "प्राइवेट, अनसेंसर्ड मॉडल।",
    },
    nanoGpt: {
      label: "NanoGPT API key",
      help: "अनसेंसर्ड और abliterated मॉडल। क्रिप्टो से पेमेंट।",
    },
    openAi: {
      label: "OpenAI API key",
      help: "gpt-image मॉडल से इमेज जनरेशन।",
    },
    smtpHost: {
      label: "SMTP सर्वर",
      help: "आपका मेल सर्वर, जैसे smtp.example.com।",
    },
    smtpPort: { label: "पोर्ट", help: "आमतौर पर 587, या TLS के साथ 465।" },
    smtpSecure: {
      label: "TLS इस्तेमाल करें",
      help: "पोर्ट 465 के लिए चालू करें।",
    },
    smtpUser: { label: "यूज़रनेम", help: "आमतौर पर आपका पूरा ईमेल पता।" },
    smtpPass: {
      label: "पासवर्ड",
      help: "Gmail और ज़्यादातर बड़े प्रोवाइडर यहाँ ऐप पासवर्ड माँगते हैं।",
    },
    smtpFromEmail: {
      label: "भेजने वाले का पता",
      help: "ईमेल इसी पते से आएँगे।",
    },
    smtpFromName: {
      label: "भेजने वाले का नाम",
      help: "भेजने वाले के रूप में दिखता है, जैसे आपके इंस्टेंस का नाम।",
    },
    stripeSecret: {
      label: "Secret key",
      help: "sk_ से शुरू होती है। टेस्ट key भी चलती है।",
    },
    stripePublishable: {
      label: "Publishable key",
      help: "pk_ से शुरू होती है।",
    },
    stripeWebhook: {
      label: "Webhook signing secret",
      help: "whsec_ से शुरू होता है। पक्का करता है कि पेमेंट आपके इंस्टेंस तक पहुँचे।",
    },
    storageType: {
      label: "फ़ाइलें कहाँ रहें",
      help: "आपकी चैट के अपलोड, इमेज और ऑडियो।",
      optionFilesystem: "यही मशीन",
      optionS3: "S3 कम्पैटिबल स्टोरेज",
    },
    s3Endpoint: {
      label: "Endpoint URL",
      help: "आपके प्रोवाइडर का S3 endpoint, जैसे https://s3.amazonaws.com।",
    },
    s3Region: {
      label: "रीजन",
      help: "जैसे us-east-1। कुछ प्रोवाइडर auto लेते हैं।",
    },
    s3Bucket: { label: "Bucket", help: "Bucket पहले से मौजूद होना चाहिए।" },
    s3AccessKey: {
      label: "Access key ID",
      help: "आपके स्टोरेज प्रोवाइडर के access keys पेज से।",
    },
    s3SecretKey: {
      label: "Secret access key",
      help: "access key बनाते समय सिर्फ़ एक बार दिखती है।",
    },
    s3PublicUrl: {
      label: "पब्लिक URL",
      help: "वैकल्पिक। फ़ाइल लिंक के लिए CDN या पब्लिक bucket का पता।",
    },
  },
  extras: {
    title: "वैकल्पिक एक्स्ट्रा",
    body: "चैट के लिए इनमें से कुछ भी ज़रूरी नहीं। अभी छोड़ें, ज़रूरत पड़े तो लौट आएँ।",
    configured: "सेट है",
    finish: "सेटअप पूरा करें",
    skipFinish: "छोड़ें और पूरा करें",
    errors: {
      s3Incomplete: "S3 स्टोरेज के लिए endpoint, रीजन, bucket और दोनों key चाहिए।",
    },
    sections: {
      email: {
        title: "ईमेल",
        body: "आपके SMTP सर्वर से साइन अप कन्फ़र्मेशन और पासवर्ड रीसेट।",
      },
      payments: {
        title: "पेमेंट",
        body: "Stripe से क्रेडिट और सब्सक्रिप्शन बेचें।",
      },
      storage: {
        title: "फ़ाइल स्टोरेज",
        body: "जब तक आप S3 नहीं चुनते, चैट फ़ाइलें इसी मशीन पर रहती हैं।",
      },
    },
  },
  done: {
    title: "सब तैयार है।",
    body: "आपका इंस्टेंस कॉन्फ़िगर हो गया और अब आपका है।",
    admin: "एडमिन लॉगिन: {{email}}",
    aiUnbottled: "AI: आपका unbottled.ai अकाउंट",
    aiKeys: "AI: आपकी अपनी प्रोवाइडर key",
    aiClaude: "AI: इस मशीन पर Claude Code",
    aiNone:
      "अभी कोई AI नहीं जुड़ा। चैट के लिए एक प्रोवाइडर चाहिए। एडमिन सेटिंग्स में कभी भी जोड़ें।",
    start: "चैट शुरू करें",
    later: "यहाँ का सब कुछ बाद में एडमिन सेटिंग्स में बदला जा सकता है।",
  },
};
