export const translations = {
  meta: {
    title:
      "AI Music Generator, Voices and Transcription in One Account | {{appName}}",
    description:
      "{{musicCount}} AI music models, {{voiceCount}} text to speech voices, {{sttCount}} transcription models. Suno alternatives with real prices per clip, per minute and per hour. Free credits to start.",
    category: "Model Comparison",
    imageAlt: "{{appName}}: AI music, voice and transcription models compared",
    keywords:
      "AI music generator, Suno alternative, AI song generator, AI beat generator, Lyria 3, ElevenLabs Music, Sonauto, MusicGen, AI text to speech, AI voice generator, AI voice generator free credits, text to speech voices, ElevenLabs alternative, Kokoro TTS, Gemini TTS, speech to text, AI transcription, Whisper, Whisper Large V3, Deepgram Nova-2, GPT-4o Mini Transcribe, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Comparison",
    readTime: "11 min read",
    title: "Songs, beats, voices, transcripts. One account.",
    subtitle:
      "{{musicCount}} music models, {{voiceCount}} voices, {{sttCount}} transcription models on one {{appName}} balance. The real price per clip, per minute, per hour. And which one fits which job.",
  },
  intro: {
    lead: "A music app. A voice app. A transcription app. Three subscriptions, three logins, three piles of credits that expire. All you wanted was a jingle, a voiceover and a transcript.",
    p2: "{{appName}} runs {{modelCount}} audio models from {{labCount}} labs on one credit balance. Every number below comes live from our model registry: lengths, voices, tiers, real prices. Four jobs, four answers:",
    songs:
      "Songs with vocals: Sonauto, ElevenLabs Music, Lyria 3 Pro. Clips up to {{longestMusic}} seconds.",
    beats:
      "Beats and instrumentals: MusicGen Stereo, ModelsLab Music Gen, Lyria 3.",
    voiceovers:
      "Voiceovers and read-aloud: {{voiceCount}} voices, {{cheapVoiceMinute}} to {{priceyVoiceMinute}} per minute of speech.",
    transcription:
      "Transcription: {{sttCount}} models, {{cheapSttHour}} to {{priceySttHour}} per hour of audio.",
  },
  tiers: {
    mainstream: "Mainstream",
    open: "Open",
    uncensored: "Uncensored",
  },
  music: {
    title: "AI music generator: all {{musicCount}} models",
    intro:
      "Cheapest clip first. Prices include our {{markup}}% markup. 1 credit = {{creditValue}}.",
    colModel: "Model",
    colLength: "Clip length",
    colTier: "Tier",
    colCredits: "Credits / clip",
    colPrice: "Price / clip",
    lengthChoice: "{{lengths}} s",
    lengthFixed: "{{seconds}} s",
    footnote:
      "One price per clip, whatever length you pick. Ask for a length the model does not offer and the request snaps to the closest one it does.",
    factLine: "{{credits}} credits ({{price}}) per clip · {{length}}",
    picks: {
      songs: {
        title: "Songs with vocals",
        body: "A singer and a hook. Describe the genre, the mood, the voice and what the song is about. These models are built for songs that sing.",
      },
      beats: {
        title: "Beats and instrumentals",
        body: 'Background music, loops for a video, a beat to rap over. No vocals. Name genre, tempo and instruments: "lo-fi hip hop, 85 bpm, dusty piano, vinyl crackle".',
      },
      short: {
        title: "Short clips, stings, jingles",
        body: "Intros, notification sounds, a podcast sting. Short and cheap. Make ten, keep one.",
      },
    },
    suno: "Looking for a Suno alternative? Suno and Udio are not on {{appName}}. What you get instead: {{musicCount}} music models on one balance, from {{cheapMusicPrice}} a clip, no extra subscription. The honest catch: clips stop at {{longestMusic}} seconds. Full three-minute tracks still belong to the dedicated song apps.",
    toolLink: "Open the music generator",
  },
  voices: {
    title: "AI text to speech: {{voiceCount}} voices compared",
    intro:
      "Cheapest first. Billed per character of text. The last column estimates one minute of speech at about {{charsPerMinute}} characters.",
    colVoice: "Voice",
    colCharacter: "Sound",
    colTier: "Tier",
    colCredits: "Credits / 1,000 chars",
    colMinute: "About 1 min of speech",
    gender: {
      male: "Male",
      female: "Female",
      neutral: "Neutral",
    },
    style: {
      conversational: "conversational",
      warm: "warm",
      deep: "deep",
      expressive: "expressive",
      calm: "calm",
      friendly: "friendly",
      authoritative: "authoritative",
      clear: "clear",
      soft: "soft",
      steady: "steady",
      confident: "confident",
      british: "British",
      lively: "lively",
      bright: "bright",
      upbeat: "upbeat",
    },
    footnote:
      "Rates include our {{markup}}% markup. The minute is an estimate: fast talkers and long words shift it. You pay for the characters you send, not the seconds you get back.",
    factLine:
      "{{credits}} credits / 1,000 chars · about {{minute}} per minute · {{character}}",
    picks: {
      everyday: {
        title: "Everyday read-aloud",
        body: "Clean, clear, cheap enough to leave on. {{defaultVoice}} is the default voice for reading answers aloud.",
      },
      natural: {
        title: "Most natural: voiceovers you publish",
        body: "Emotional range, human pacing. For YouTube narration, ads, audiobook samples. The priciest voices here, so finish the script first and render once.",
      },
      multilingual: {
        title: "Many languages, one voice",
        body: "Gemini voices speak 100+ languages and follow delivery instructions: slower, whispered, excited.",
      },
      expressive: {
        title: "Characters and storytelling",
        body: "More drama, more range. Built for fiction, game characters, roleplay scenes.",
      },
      budget: {
        title: "Cheapest, no content filter",
        body: "Kokoro is an open-weight 82M model. {{uncensoredVoiceCount}} Kokoro voices sit in our uncensored tier: no content filter on what they read. They are also the cheapest voices on the platform.",
      },
    },
    languages:
      "Every voice here is tuned for English. Gemini voices handle 100+ languages. The rest can read other languages, often with an accent. Test one sentence before you render a whole script.",
    toolLink: "Open text to speech",
  },
  stt: {
    title: "AI transcription: {{sttCount}} speech to text models",
    intro:
      "Cheapest per minute first. Billed per second of audio. Prices include our {{markup}}% markup.",
    colModel: "Model",
    colTier: "Tier",
    colCredits: "Credits / minute",
    colHour: "Price / hour",
    footnote:
      "When a provider reports its actual cost for a job, we bill that cost plus the markup. A final charge can land slightly off the table.",
    factLine: "{{credits}} credits / minute · {{hour}} per hour",
    picks: {
      cheapest: {
        title: "Cheapest: hours of audio for cents",
        body: "Open-weight Whisper, 99 languages. One subscription covers about {{subSttHours}} hours of audio at this rate.",
      },
      accuracy: {
        title: "Accuracy first",
        body: "Fewer wrong words, better language detection. For interviews, quotes, anything you publish. {{defaultStt}} is the default for voice input.",
      },
      languages: {
        title: "Many languages",
        body: "Whisper covers 99 languages, Nemotron 40 locales. Voxtral is Mistral's transcription model, built for recordings up to 10 minutes.",
      },
      fast: {
        title: "Fast and noise-robust",
        body: "Low latency, holds up in loud rooms. Made for quick voice notes and dictation.",
      },
    },
    toolLink: "Open speech to text",
  },
  chat: {
    title: "How it works in the chat",
    intro:
      "No separate app. Music, voice and transcription live inside every chat on {{appName}}.",
    steps: {
      song: {
        title: "Ask for a song",
        body: 'Type "make a 30 second synthwave intro for my podcast". The AI calls the music generator with your skill\'s music model, {{defaultMusic}} unless you changed it. Name another model in the prompt to switch.',
      },
      voice: {
        title: "Hear any answer",
        body: "Hit the speaker icon on a reply and it is read aloud in your skill's voice, {{defaultVoice}} by default. Set a different voice per skill.",
      },
      dictate: {
        title: "Talk instead of typing",
        body: "Tap the mic and speak. {{defaultStt}} transcribes your words into the input, or the recording goes straight to models that understand audio.",
      },
      transcribe: {
        title: "Transcribe whole files",
        body: "Meetings, interviews, voice memos: drop up to {{sttMaxFiles}} files on the speech to text tool page and pick the model.",
      },
      call: {
        title: "Call mode",
        body: "Hands-free. You speak, the AI answers out loud, you answer back. Voice in, voice out, same balance.",
      },
    },
    toolPages:
      "Want full control? Each job has its own tool page: pick the model or voice, set the clip length, paste a long script.",
  },
  pricing: {
    title: "What AI music and voice cost here",
    intro:
      "Three formulas, one balance. Provider price plus our {{markup}}% markup. 1 credit = {{creditValue}}.",
    music:
      "Music: a flat price per clip. From {{cheapMusicCredits}} credits ({{cheapMusicPrice}}) on {{cheapMusicName}} to {{priceyMusicCredits}} credits ({{priceyMusicPrice}}) on {{priceyMusicName}}.",
    voice:
      "Voice: per character. From {{cheapVoiceCredits}} credits per 1,000 characters on {{cheapVoiceName}} to {{priceyVoiceCredits}} on {{priceyVoiceName}}.",
    stt: "Transcription: per second of audio. From {{cheapSttCredits}} credits a minute on {{cheapSttName}} to {{priceySttCredits}} on {{priceySttName}}.",
    failed:
      "Credits come off only once you have the result. Failed job, timeout, refused prompt: you pay nothing.",
    free: "Free: {{guestCredits}} credits a month without an account, {{freeCredits}} with a free account, {{maxCredits}} with the newsletter. {{freeCredits}} credits buy {{freeClips}} clips on {{cheapMusicName}}, or about {{freeVoiceMinutes}} minutes of {{cheapVoiceName}}.",
    sub: "Monthly plans: four sizes, starting at {{subCredits}} credits for {{subPrice}}.",
    pack: "Credit packs: a top-up for subscribers, {{packCredits}} credits for {{packPrice}}. They never expire. Card, PayPal or crypto.",
    link: "See plans and credit packs",
  },
  limits: {
    title: "The limits, straight",
    intro: "Know the edges before you spend a credit.",
    musicLength:
      "Music clips run {{longestMusic}} seconds at most. No three-minute tracks, no extending a clip.",
    musicFlat:
      "A clip costs the same at every length. Short clips are the cheap way to test a prompt, not a discount.",
    noSuno: "No Suno, no Udio. Their APIs are not on {{appName}}.",
    ttsLength:
      "Text to speech takes up to {{ttsMaxChars}} characters per request. Longer scripts: split them.",
    sttFiles:
      "Transcription takes up to {{sttMaxFiles}} files per request, {{sttMaxMb}} MB each.",
    noCloning:
      "No voice cloning. You pick from the voices in the table. You cannot upload your own.",
    filters:
      "Most music and voice models run behind their provider's moderation. A prompt can be refused upstream. That refusal costs nothing.",
    callout:
      "Before you publish: check the provider's terms for commercial use of generated music and voices. Rules differ per lab, and they change.",
  },
  faq: {
    title: "FAQ",
    bestMusic: {
      q: "What is the best AI music generator?",
      a: "Depends on the track. Songs with vocals: Sonauto or ElevenLabs Music. Polished short tracks: Lyria 3 Pro. Beats and loops: MusicGen Stereo. Cheapest: {{cheapMusicName}} at {{cheapMusicPrice}} a clip. All {{musicCount}} run on one {{appName}} balance, so you switch per clip.",
    },
    suno: {
      q: "Is there a good Suno alternative?",
      a: "For short songs and beats, yes: Sonauto, ElevenLabs Music and Google's Lyria 3 run here on one balance, from {{cheapMusicPrice}} a clip, no extra subscription. For full three-minute songs, not yet: clips here stop at {{longestMusic}} seconds.",
    },
    vocals: {
      q: "Can AI make songs with vocals?",
      a: "Yes. Ask Sonauto, ElevenLabs Music or Lyria 3 Pro for a song and describe the topic, the mood and the singer. Instrumental models like MusicGen Stereo make music without a voice.",
    },
    bestVoice: {
      q: "Which AI voice generator sounds most natural?",
      a: "For everyday read-aloud, OpenAI voices like {{defaultVoice}} sound clean and cost little. Most expressive: xAI Eve and Inworld. For many languages: Gemini. For the lowest price and no filter: Kokoro.",
    },
    free: {
      q: "Is there an AI voice generator with free credits?",
      a: "Yes. {{guestCredits}} free credits a month without an account, {{freeCredits}} with a free account, {{maxCredits}} with the newsletter. On {{cheapVoiceName}} that is about {{freeVoiceMinutes}} minutes of speech. The same credits pay for music and transcription.",
    },
    transcribeCost: {
      q: "How much does AI transcription cost?",
      a: "From {{cheapSttHour}} per hour of audio on {{cheapSttName}} to {{priceySttHour}} on {{priceySttName}}. Billed per second. Failed jobs cost nothing.",
    },
    cloning: {
      q: "Can I clone my own voice?",
      a: "No. {{appName}} offers {{voiceCount}} ready-made voices. No cloning, no uploading your own voice.",
    },
    uncensored: {
      q: "Is there an uncensored text to speech?",
      a: "Yes. {{uncensoredVoiceCount}} Kokoro voices sit in our uncensored tier: an open-weight model with no content filter on what it reads. Most music models and the other voices run behind their provider's filters.",
    },
    modelsLink: "Browse all models with specs and prices",
    videoLink: "Need video too? AI video generators compared",
    pricingLink: "See plans and pricing",
  },
  partners: {
    body: "Making music, podcasts or voiceover content? The {{appName}} partner program pays you a recurring share of every payment you refer.",
    link: "Join the partner program",
  },
  cta: {
    title: "Pick a model. Hit play.",
    subtitle:
      "Songs, beats, voices and transcripts from one balance. Start with {{guestCredits}} free credits, no account needed.",
    music: "Make music",
    voice: "Generate a voice",
    transcribe: "Transcribe audio",
    models: "Browse all models",
  },
};
