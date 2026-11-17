export const translations = {
  meta: {
    title:
      "Best AI Video Generator: {{modelCount}} Models, Kling vs Seedance | {{appName}}",
    description:
      "{{modelCount}} AI video generators compared: Kling vs Seedance, Veo 3.1 vs Sora 2, Wan 3.0, Hailuo. Text and image to video, real prices, no watermark from us.",
    category: "Model Comparison",
    imageAlt: "{{appName}}: AI video generators compared side by side",
    keywords:
      "best AI video generator, AI video generator, Kling vs Seedance, Seedance 2.0, Seedance 2.5, Kling 3.0, Veo 3.1 vs Sora 2, Veo 3.1, Sora 2, Wan 3.0, Hailuo 3, Grok Imagine video, Gemini Omni, Runway Gen-4.5, image to video AI, text to video AI, AI video generator without watermark, AI video generator price per second, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Comparison",
    readTime: "10 min read",
    title: "{{modelCount}} AI video generators. One balance. Compared.",
    subtitle:
      "Kling vs Seedance, Veo vs Sora, Wan, Hailuo, Grok Imagine and Gemini Omni. Real price per second, real clip lengths, frame control and sound. Pick the model for the shot, then make it from any chat on {{appName}}.",
  },
  intro: {
    lead: "Every lab calls its model the best AI video generator. Each one wants its own app, its own credits, its own subscription. You want one thing: the right clip for the job, at a price you see before you hit generate.",
    p2: "{{appName}} runs {{modelCount}} video models from {{labCount}} labs on one credit balance: Veo, Sora, Kling, Seedance, Wan, Hailuo, Grok Imagine, Gemini Omni, Runway and more. Below, all of them side by side, straight from our live model registry: inputs, frame control, length, resolution, sound and the real price per second. Then the picks per job, the head-to-heads, how to make a clip from any chat, and the limits nobody puts on the landing page.",
  },
  table: {
    title: "All {{modelCount}} video models, side by side",
    intro:
      "Every current model from {{labCount}} labs, cheapest per second first. Prices include our {{markup}}% markup. 1 credit = {{creditValue}}.",
    colModel: "Model",
    colInput: "Input",
    colFrames: "Frames",
    colLength: "Length",
    colResolution: "Resolution",
    colAudio: "Audio",
    colRate: "Credits / sec",
    colClip: "Chat clip",
    i2v: "Text or image",
    t2v: "Text",
    v2v: "Text and video",
    videoAudio: "Video and audio",
    framesFirst: "First frame",
    framesFirstLast: "First and last frame",
    framesNone: "No frame control",
    secondsFixed: "{{max}} s",
    seconds: "{{min}} to {{max}} s",
    resolutionDefault: "Provider default",
    audioYes: "Native audio",
    audioNo: "Silent",
    withImage: "With image: {{credits}}",
    clipValue: "{{credits}} credits, {{seconds}} s",
    footnote:
      "Credits / sec is the rate at the model's default resolution. Where resolution changes the price, the small line lists each rate. \"With image\" is the rate when an attached image moves the job to that model's image route. Chat clip is what one request from chat costs: {{seconds}} seconds asked, snapped to the nearest length the model supports.",
    allModels: "See every model with full specs",
  },
  picks: {
    title: "The best AI video generator for each job",
    intro:
      "There is no single best. There is the best fit for the shot. Six jobs, the models that fit them, the hard facts under each.",
    factLine:
      "{{rate}} credits/s · up to {{max}} s · {{resolution}} · {{audio}} · {{frames}}",
    quality: {
      title: "Best quality: the final shot",
      body: "When the clip is the deliverable. Cinematic realism, believable physics, polish. These sit at the top of the price range, so nail the prompt on a cheap model first, then render here.",
    },
    budget: {
      title: "Cheapest: drafts and volume",
      body: "Test prompts, iterate on motion, feed social at volume. Less detail, a far smaller bill. Most of your attempts belong here.",
    },
    long: {
      title: "Longest clips: one continuous take",
      body: "Up to {{longestSeconds}} seconds in a single clip. Fewer cuts, fewer stitched seams. Set the length on the video generator page; a chat request asks for {{seconds}} seconds.",
    },
    frames: {
      title: "Start and end frame control",
      body: "Hand over the first frame and the last, the model fills the motion in between. Transitions, product reveals, clean loops. {{lastFrameCount}} models take a last frame.",
    },
    audio: {
      title: "Native sound in the same pass",
      body: "Picture and audio in one generation: ambience, effects, and on some models dialogue. No separate sound step, no syncing by hand. {{audioCount}} models make sound natively.",
    },
    editing: {
      title: "Specialists: avatars, lip sync, editing",
      body: "Not for fresh scenes from a prompt. Omnihuman 1.5 animates a person from one photo and an audio track. Lipsync 2 matches mouths in existing footage to a new voice. Gen4 Aleph edits existing footage: add or remove objects, restyle, relight, change the camera angle.",
    },
  },
  versus: {
    title: "Head to head: the match-ups people search for",
    intro:
      "Four comparisons that come up again and again. What each model is built for, and when to pick which.",
    pairTitle: "{{a}} vs {{b}}",
    klingSeedance:
      "{{a}} is the value pick of the Kling 3 line: lively, convincing motion, native audio, first and last frame, clips up to {{aMax}} seconds. The catch: 720p is the ceiling. {{b}} reaches up to 4K and takes reference input that keeps recurring characters consistent across shots. Per second: {{aRate}} credits for {{a}}, {{bRate}} for {{b}}. Drafts and social clips: {{a}}. Story shots with the same character scene after scene: {{b}}.",
    veoSora:
      "{{a}} is Google's flagship: cinematic realism, native audio with dialogue and effects, first and last frame, an image as the opening shot, up to 4K. {{b}} is OpenAI's, known for believable physics. On this platform it takes text only, landscape only. Max length: {{aMax}} seconds for {{a}}, {{bMax}} for {{b}}. Per second: {{aRate}} credits against {{bRate}}. Need sound or a starting image: {{a}}. Pure text prompt, longer take: {{b}}.",
    hailuoWan:
      "{{a}} goes for sharpness: 2K output, native audio, first and last frame, clips up to {{aMax}} seconds. {{b}} goes for length: up to {{bMax}} seconds in one take, native audio, frame control, 480p to 1080p, plus a cheap 480p tier for drafts. Per second: {{aRate}} credits for {{a}}, {{bRate}} for {{b}}. Crisp short shots: {{a}}. Long takes on a budget: {{b}}.",
    grokGemini:
      "{{a}} is xAI's: 480p to 1080p, an optional first frame, no sound, clips up to {{aMax}} seconds. {{b}} is Google's: native audio, first and last frame, 360p up to 4K, clips up to {{bMax}} seconds. Per second: {{aRate}} credits against {{bRate}}. Sound and frame control: {{b}}. Quick silent clips at any length from one second: {{a}}.",
    verdict:
      "No model wins every job. Start cheap: {{cheapestName}} runs at {{minRate}} credits a second. Need sound? {{audioCount}} models make it natively. Need the ending pinned? {{lastFrameCount}} take a last frame. Pay premium only for the render you keep.",
  },
  chat: {
    title: "Make a video from any chat",
    intro:
      "No separate app, no new account. Ask in any chat on {{appName}} and the AI calls the video generator for you.",
    steps: {
      ask: {
        title: "Describe the shot",
        body: 'Subject, motion, camera, mood. Plain words. "A fox runs through fresh snow at dawn, low tracking shot." The AI turns it into a generation request.',
      },
      model: {
        title: "Use the default, or name a model",
        body: 'Your skill\'s video setting picks the model, {{defaultModel}} unless you changed it. Want another? Say it in the prompt: "use Kling 3.0". The AI passes that model on.',
      },
      image: {
        title: "Attach an image to animate it",
        body: "Drop in a picture and it becomes the opening frame. That is image to video. If your model can't take images, the job moves to that model's image route, or to the cheapest model that takes one.",
      },
      lastFrame: {
        title: "Pin the last frame",
        body: "Attach a second image and say it is the ending. The model animates from one to the other. Works on {{lastFrameCount}} models, and both frames must be images. You can also add images, audio or video as references to guide the look.",
      },
      result: {
        title: "Watch it, keep it",
        body: "The clip plays right in the chat and saves to your own storage. Incognito chats keep it tied to your browser session. Expect about a minute up to several minutes per clip.",
      },
    },
    toolPage:
      "One trade-off. In chat the AI can't set length, resolution or aspect ratio: every chat clip asks for {{seconds}} seconds at the model's default resolution. Need full control? The video generator page sets model, duration, aspect ratio, resolution, first and last frame, and a negative prompt.",
    toolLink: "Open the video generator",
  },
  pricing: {
    title: "What AI video costs here",
    intro:
      "Credits per second times seconds. That is the whole formula. One balance pays for every model.",
    perSecond:
      "Each model has a rate per second: the provider's price plus our {{markup}}% markup, rounded up to a tenth of a credit. 1 credit = {{creditValue}}.",
    cheapest:
      "Cheapest chat clip right now: {{cheapestClipName}}, {{cheapestClipCredits}} credits ({{cheapestClipPrice}}). Lowest rate: {{cheapestName}} at {{minRate}} credits a second.",
    priciest:
      "Priciest chat clip: {{priciestClipName}}, {{priciestClipCredits}} credits ({{priciestClipPrice}}). Highest rate: {{priciestName}} at {{maxRate}} credits a second.",
    resolution:
      "Higher resolution costs more per second on models that price by resolution. The table lists those rates.",
    failed:
      "Credits come off only after a clip is delivered. Failed job, refused prompt, timeout: you pay nothing.",
    reported:
      "Routes served through OpenRouter bill the provider's actual reported cost plus the markup, so the final charge can land slightly off the table.",
    sub: "Monthly plans: four sizes, starting at {{subCredits}} credits for {{subPrice}}.",
    pack: "Credit packs: a top-up for subscribers, {{packCredits}} credits for {{packPrice}}. They never expire. Card, PayPal or crypto.",
    link: "See plans and credit packs",
  },
  watermark: {
    title: "AI video without a watermark",
    intro: "{{appName}} stamps nothing on your clip. You get the raw file.",
    ours: "No watermark, no logo, no overlay from us. You download the video exactly as the model delivered it.",
    provenance:
      "Some labs embed invisible provenance marks or metadata themselves. Google puts SynthID into the output of its video models. OpenAI attaches C2PA metadata to Sora clips. Those come from the lab, not from us.",
    storage:
      "Every clip saves to your own storage. In incognito chats it stays owned by your browser session.",
  },
  limits: {
    title: "The limits, straight",
    intro:
      "Video is the hard mode of generative AI. Know the edges before you spend.",
    time: "A clip takes about a minute up to several minutes. Long jobs can time out, and a timeout costs nothing.",
    cost: "Video is the most expensive media type on {{appName}}. Draft on a cheap model, render the keeper on a premium one.",
    filters:
      "Every video model here comes from a mainstream lab and runs behind its provider's moderation. Explicit sexual content, real public figures, minors or gore can be refused upstream. That refusal is the provider's, not ours, and it costs you nothing.",
    chatControls:
      "In chat, length, resolution and aspect ratio stay at their defaults. The video generator page unlocks all of them.",
    snap: "Each model supports its own set of lengths. A request snaps to the nearest one, so some chat clips run a little shorter or longer than {{seconds}} seconds.",
    legacy:
      "{{legacyCount}} older models are left out of this table. They still sit in the full model list.",
    callout:
      "Uncensored is our promise for chat models. Video runs on mainstream models with their providers' filters. None of them makes explicit content.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "What is the best AI video generator?",
      a: "The one that fits the shot. Cinematic realism with sound: Veo 3.1. Long continuous takes: Wan 3.0 or Seedance 2.5. Consistent characters across scenes: Seedance 2.0. Cheap drafts: {{cheapestName}}. A talking person from one photo: Omnihuman 1.5. All {{modelCount}} run on one {{appName}} balance, so you can switch per clip.",
    },
    klingVsSeedance: {
      q: "Kling vs Seedance: which is better?",
      a: "Different jobs. Kling 3.0 Std is the value pick: lively motion, native audio, frame control, capped at 720p. Seedance 2.0 costs more per second and goes up to 4K, with reference input that keeps a character consistent from shot to shot. Draft on Kling, finish story shots on Seedance.",
    },
    imageToVideo: {
      q: "How do I turn an image into a video with AI?",
      a: "Attach the image in any chat and describe the motion. It becomes the opening frame. {{i2vCount}} of {{modelCount}} models take an image directly; if yours doesn't, the job moves to an image-capable route. Add a second image as the last frame on models that support it.",
    },
    watermark: {
      q: "Is there an AI video generator without a watermark?",
      a: "Yes. {{appName}} adds no watermark, logo or overlay. You download the raw file. Some labs embed invisible marks on their own: Google's SynthID on its video models, C2PA metadata on OpenAI's Sora clips.",
    },
    cost: {
      q: "How much does AI video generation cost?",
      a: "From {{cheapestClipPrice}} to {{priciestClipPrice}} per chat clip right now, depending on the model. Every model has a rate per second, provider price plus {{markup}}% markup. 1 credit = {{creditValue}}. Failed jobs cost nothing.",
    },
    free: {
      q: "Can I make AI videos for free?",
      a: "New accounts get free credits. Video is one of the priciest things you can generate, so they cover a few clips at most. The cheapest clip right now is {{cheapestClipName}} at {{cheapestClipCredits}} credits. After that: a plan, from {{subPrice}} a month.",
    },
    length: {
      q: "How long can an AI video be?",
      a: "Up to {{longestSeconds}} seconds in one clip, on {{longestName}}. Most models stop well before that. A chat request asks for {{seconds}} seconds; set a longer duration on the video generator page.",
    },
    uncensored: {
      q: "Is there an uncensored AI video generator?",
      a: "Not here, and we won't pretend otherwise. Every video model on {{appName}} is a mainstream lab's model behind its provider's filters. None of them makes explicit content. Our uncensored models are chat models.",
    },
    modelsLink: "Browse all models with specs and prices",
    pricingLink: "See plans and pricing",
  },
  partners: {
    body: "Making AI video content? The {{appName}} partner program pays you a recurring share of every payment you refer.",
    link: "Join the partner program",
  },
  cta: {
    title: "Pick a model. Make the shot.",
    subtitle:
      "Full control on the video generator page: model, length, aspect ratio, resolution, frames. Or just ask in any chat on {{appName}}.",
    generate: "Generate a video",
    models: "Browse all models",
  },
};
