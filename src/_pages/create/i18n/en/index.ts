export const translations = {
  meta: {
    category: "AI generation",
    imageAlt: "{{appName}} {{title}}",
  },
  studio: "Media Studio",
  navName: "Studio",
  hub: {
    metaTitle: "AI Media Studio: images, video, music and voice",
    metaDescription:
      "Generate images, video clips, music and speech, or transcribe audio. Mainstream and uncensored models side by side. Pay per result.",
    keywords:
      "AI media studio, uncensored AI image generator, AI video generator, AI music generator, text to speech, speech to text",
    title: "Media Studio",
    subtitle:
      "Five tools. Every major model, uncensored ones included. Pay per result, keep everything you make.",
    from: "From {{price}}",
    free: "Free",
    models: "{{count}} models",
    voices: "{{count}} voices",
    open: "Open",
  },
  asyncProgress:
    "Running. Video and music often take one to three minutes. Progress also shows in your history.",
  ooc: {
    title: "Not enough free credits",
    need: "This run needs {{amount}} credits.",
    description:
      "A free account gets {{signedIn}} credits a month, {{max}} with the newsletter. Sign up and you land back here with your settings kept.",
    signUp: "Sign up free",
    defaults: "Try cheaper settings",
    haveAccount: "Have an account?",
    logIn: "Log in",
  },
  moreOptions: "More options",
  modelDefault: "Auto",
  model: "Model",
  voice: "Voice",
  estimate: "Estimated cost",
  credits: "{{amount}} credits",
  failed: "Generation failed",
  historyError: "Could not open your Studio history. Please try again.",
  unavailable: "No model is available for this generator right now.",
  file: "Audio file",
  language: "Recording language",
  languageAuto: "Detect automatically",
  commercialUse: {
    title: "Commercial use by model",
    intro:
      "Each model's license decides what you may do with its output, for example in an ad or a client project. Check the status before you publish.",
    showAll:
      "All {{count}} models by license ({{allowed}} allow commercial use)",
  },
  referenceAudio: "Reference audio URL",
  durationSeconds: "Recording length in seconds",
  duration: "Duration",
  ratio: "Aspect ratio",
  size: "Size",
  quality: "Quality",
  reference: "Reference image URL",
  startImageRequired:
    "This model animates an image. Add a start image to generate.",
  lastFrame: "Last frame URL",
  creating: "Generating · {{seconds}} s",
  submitImage: "Generate image",
  submitVideo: "Generate video",
  submitMusic: "Generate music",
  submitSpeech: "Generate speech",
  submitTranscribe: "Transcribe audio",
  meteredCost: "The final charge uses the provider’s reported usage.",
  estimatePending: "Add audio to estimate the cost.",
  needsCredits: "Needs {{amount}} credits",
  units: {
    image: "{{amount}} credits / image",
    video: "{{amount}} credits / sec",
    music: "{{amount}} credits / track",
    speech: "{{amount}} credits / 1,000 characters",
    transcribe: "{{amount}} credits / min",
    tokenImage: "≈ {{amount}} credits / image",
  },
  kinds: {
    image: {
      label: "Image",
      tab: "Image",
      pitch:
        "Text to image, or edit a reference. Photoreal, anime, art, anything you describe.",
      title: "Create an image",
      metaTitle: "Uncensored AI image generator: {{appName}}",
      metaDescription:
        "Generate images from text or edit a reference photo. Mainstream and uncensored models side by side, photoreal to anime. Pay per result.",
      description: "Describe a scene and choose its framing.",
      keywords: "uncensored AI image generator, AI art, text to image",
    },
    video: {
      label: "Video",
      tab: "Video",
      pitch:
        "Text or a first frame to a clip. Pick length, ratio and resolution.",
      title: "Create a video",
      metaTitle: "AI video generator: {{appName}}",
      metaDescription:
        "Turn a prompt or a first frame into a video clip. Pick length, aspect ratio and resolution across leading video models. Pay per result.",
      description: "Set a scene in motion, from the first frame to the last.",
      keywords: "AI video generator, text to video, image to video",
    },
    music: {
      label: "Music",
      tab: "Music",
      pitch: "A full track from a prompt: mood, genre, instruments, length.",
      title: "Make music",
      metaTitle: "AI music generator: {{appName}}",
      metaDescription:
        "Generate a full track from a prompt: mood, genre, instruments and length. Several music models in one studio. Pay per result.",
      description: "Describe the mood, instruments and length of your track.",
      keywords: "AI music generator, text to music, AI song",
    },
    speech: {
      label: "Speech",
      tab: "Speech",
      pitch: "Your script, read aloud by natural voices in many languages.",
      title: "Give text a voice",
      metaTitle: "AI text to speech: {{appName}}",
      metaDescription:
        "Paste a script, pick a voice, download the audio. Natural AI voices in many languages from several providers. Pay per result.",
      description: "Pick a voice to read your script aloud.",
      keywords: "text to speech, AI voice, TTS",
    },
    transcribe: {
      label: "Transcribe",
      tab: "Transcribe",
      pitch: "Upload a recording, get clean text back. Download it as a file.",
      title: "Transcribe audio",
      metaTitle: "AI speech to text: {{appName}}",
      metaDescription:
        "Upload a recording and get clean text back as a downloadable file. Accurate speech to text models in many languages. Pay per result.",
      description: "Turn a recording into a transcript you can download.",
      keywords: "speech to text, AI transcription, audio to text",
    },
  },
};
