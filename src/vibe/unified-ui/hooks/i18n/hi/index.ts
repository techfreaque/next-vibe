import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widgets: {
    errorBoundary: {
      title: "कुछ गड़बड़ हो गई",
      defaultMessage: "कोई अनपेक्षित एरर हुआ",
      errorDetails: "एरर की जानकारी",
    },
    error: {
      title: "एरर",
    },
    chart: {
      noDataAvailable: "कोई डेटा उपलब्ध नहीं",
      noDataToDisplay: "दिखाने के लिए कोई डेटा नहीं",
    },
    codeQualityFiles: {
      affectedFiles: "प्रभावित फ़ाइलें",
      andMoreFiles: "... और {{count}} फ़ाइल",
    },
    codeQualityList: {
      noIssues: "कोई समस्या नहीं मिली",
    },
    codeQualitySummary: {
      errors: "एरर",
      files: "फ़ाइलें",
      issues: "समस्याएँ",
      of: "में से",
      summary: "सार",
    },
    container: {
      noContent: "कोई कंटेंट नहीं",
    },
    endpointRenderer: {
      cancel: "रद्द करें",
      submit: "भेजें",
      submitting: "भेजा जा रहा है...",
      showResults: "नतीजे दिखाएँ",
      saveChanges: "बदलाव सेव करें",
      saving: "सेव हो रहा है...",
      result: "नतीजा",
      fixFields: "हाइलाइट किए फ़ील्ड जाँचें और दोबारा कोशिश करें।",
      hiddenInvalid:
        "“{{field}}” गायब है या अमान्य है। पेज रीलोड करें और दोबारा कोशिश करें।",
    },
    toolUnavailable: {
      permissionTitle: "आपको इस टूल का एक्सेस नहीं है",
      permissionMessage:
        "आपका रोल इसे नहीं खोल सकता। इस वर्कस्पेस के किसी मालिक से एक्सेस माँगें।",
      instanceTitle: "यह टूल इस इंस्टेंस पर नहीं है",
      instanceMessage:
        "यह किसी दूसरे जुड़े हुए इंस्टेंस पर चलता है। इसे खोलने के लिए साइडबार में इंस्टेंस बदलें।",
      setupTitle: "इस टूल को पहले सेटअप चाहिए",
      setupMessage: "एक ज़रूरी सेटिंग गायब है। सेटअप पूरा करें, फिर टूल दोबारा खोलें।",
      unknownTitle: "यह लिंक किसी टूल तक नहीं जाता",
      unknownMessage: "लिंक पुराना हो सकता है या ग़लत टाइप हुआ हो सकता है।",
    },
    recordState: {
      loading: "लोड हो रहा है",
      notFoundMessage: "हो सकता है यह हटा दिया गया हो, या लिंक पुराना हो।",
      loadFailed: "{{title}} लोड नहीं हो सका",
      serverError: "हमारी तरफ़ कुछ गड़बड़ हुई। थोड़ी देर बाद दोबारा कोशिश करें।",
      technicalDetails: "तकनीकी जानकारी",
      moreActions: "और कार्रवाइयाँ",
      more: "और",
      confirmCancel: "रद्द करें",
      details: "विवरण",
      emptyTitle: "यहाँ अभी कुछ नहीं",
      copy: "कॉपी करें",
    },
    formField: {
      requiresContext: "इस फ़ील्ड को कॉन्टेक्स्ट चाहिए",
    },
    markdown: {
      noContent: "कोई कंटेंट नहीं",
    },
    pagination: {
      itemsPerPage: "प्रति पेज आइटम",
      page: "पेज",
      showing: "दिखा रहे हैं",
    },
    rangeSlider: {
      max: "अधिकतम",
      min: "न्यूनतम",
    },
    toolCall: {
      creditsUsed_one: "{{count}} क्रेडिट इस्तेमाल हुआ",
      creditsUsed_other: "{{count}} क्रेडिट इस्तेमाल हुए",
      actions: {
        confirm: "कन्फ़र्म करें",
        deny: "मना करें",
        runInBackground: "बैकग्राउंड में चलाएँ",
        resumeWhenDone: "पूरा होने पर जारी रखें",
      },
      status: {
        complete: "पूरा करें",
        confirmed: "कन्फ़र्म हुए",
        confirmedWakeUp: "कन्फ़र्म हुआ (वेक अप)",
        deferred: "टाला गया",
        denied: "मना किया गया",
        deniedWakeUp: "मना किया गया (वेक अप)",
        error: "एरर",
        executing: "चल रहा है",
        pendingCancellation: "रद्दीकरण पेंडिंग",
        pendingConfirmation: "कन्फ़र्मेशन पेंडिंग",
        sentToBackground: "बैकग्राउंड में भेजा गया",
        waitingForConfirmation: "कन्फ़र्मेशन का इंतज़ार",
        waitingForConfirmationWakeUp: "कन्फ़र्मेशन का इंतज़ार (वेक अप)",
        waitingForRemote: "रिमोट का इंतज़ार",
        wakeUpBackground: "वेक अप (बैकग्राउंड)",
      },
      messages: {
        confirmationRequired: "कन्फ़र्मेशन ज़रूरी है",
        confirmationRequiredWakeUp: "कन्फ़र्मेशन ज़रूरी है (वेक अप)",
        deferredResult: "टाला गया नतीजा",
        errorLabel: "एरर",
        executingTool: "टूल चल रहा है...",
      },
    },
    formFields: {
      common: {
        enterPhoneNumber: "फ़ोन नंबर लिखें",
        required: "ज़रूरी",
        selectDate: "तारीख़ चुनें",
        openCalendar: "कैलेंडर खोलें",
        time: "समय",
        startDate: "शुरू होने की तारीख़",
        endDate: "ख़त्म होने की तारीख़",
        decreaseValue: "मान घटाएँ",
        increaseValue: "मान बढ़ाएँ",
        unknownFieldType: "अज्ञात फ़ील्ड प्रकार",
      },
      entityPicker: {
        change: "बदलें",
        loading: "लोड हो रहा है...",
        noItems: "कोई आइटम नहीं मिला",
        required: "ज़रूरी",
        select: "चुनें...",
        selectLabel: "{{label}} चुनें",
        useToFind: "इसे {{alias}} से खोजें",
      },
      markdownTextarea: {
        edit: "एडिट करें",
        preview: "प्रीव्यू",
        toolbar: {
          blockquote: "ब्लॉककोट",
          bold: "बोल्ड",
          bulletList: "बुलेट सूची",
          code: "कोड",
          heading1: "हेडिंग 1",
          heading2: "हेडिंग 2",
          heading3: "हेडिंग 3",
          horizontalRule: "हॉरिज़ॉन्टल रूल",
          italic: "इटैलिक",
          link: "लिंक",
          linkPrompt: "URL लिखें",
          orderedList: "क्रमांकित सूची",
          strike: "स्ट्राइकथ्रू",
        },
      },
    },
  },
  formErrors: {
    required: "कोई मान लिखें",
    invalid: "यह मान सही नहीं है",
    minLength: "कम से कम {{min}} अक्षर इस्तेमाल करें",
    maxLength: "ज़्यादा से ज़्यादा {{max}} अक्षर इस्तेमाल करें",
    minNumber: "{{min}} या उससे ज़्यादा लिखें",
    maxNumber: "{{max}} या उससे कम लिखें",
    minItems: "कम से कम {{min}} जोड़ें",
    email: "सही ईमेल एड्रेस लिखें",
    url: "पूरा लिंक लिखें, जैसे https://example.com",
    choose: "विकल्पों में से एक चुनें",
  },
  localstorage: {
    noCallback: "localStorage ऑपरेशन के लिए कोई कॉलबैक नहीं दिया गया",
  },
  apiUtils: {
    errors: {
      http_error: "HTTP एरर",
      validation_error: "वैलिडेशन एरर",
      internal_error: "आंतरिक एरर",
      auth_required: "ऑथेंटिकेशन ज़रूरी है",
      missingUrlParam: 'Missing URL parameter "{{param}}" for {{path}}',
      httpStatus: "{{url}} की रिक्वेस्ट स्टेटस {{status}} के साथ विफल रही",
      responseValidation: "सर्वर रिस्पॉन्स वैलिडेशन में विफल रहा: {{error}}",
      malformedResponse: "{{url}} से रिस्पॉन्स ग़लत फ़ॉर्मेट में है",
      recordTimeout: "यह रिकॉर्ड लोड होने में बहुत समय लगा। दोबारा कोशिश करें।",
      requestFailed: "{{path}} की रिक्वेस्ट विफल रही: {{error}}",
      endpointFailed: "{{reason}}, {{path}}: {{error}}",
    },
  },
  mutationForm: {
    post: {
      errors: {
        mutation_failed: {
          title: "म्यूटेशन विफल रहा",
        },
        validation_error: {
          title: "वैलिडेशन एरर",
          detail: "फ़ॉर्म वैलिडेशन विफल रहा: {{errors}}",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "फ़ॉर्म {{formId}} में नेटवर्क विफलता: {{error}}",
      validation_failed: "वैलिडेशन विफल रहा",
      validationFailedDetail: "फ़ॉर्म {{formId}} में वैलिडेशन विफल रहा: {{error}}",
    },
  },
  store: {
    errors: {
      validation_failed: "वैलिडेशन विफल रहा",
      request_failed: "रिक्वेस्ट विफल रही",
      mutation_failed: "म्यूटेशन विफल रहा",
      unexpected_failure: "अनपेक्षित विफलता",
      refetch_failed: "रीफ़ेच विफल रहा",
    },
    status: {
      loading_data: "डेटा लोड हो रहा है...",
      cached_data: "कैश्ड डेटा इस्तेमाल हो रहा है",
      success: "सफल",
      mutation_pending: "म्यूटेशन पेंडिंग...",
      mutation_success: "म्यूटेशन सफल रहा",
    },
  },
};
