export const translations = {
  meta: {
    title: "Uncensored AI Image Generator, Price per Image | {{appName}}",
    description:
      "{{uncensoredCount}} uncensored AI image generators next to Flux, Seedream, GPT Image and Recraft: {{modelCount}} models, real price per image, no blur. Edit your own photos too.",
    category: "Model Comparison",
    imageAlt: "{{appName}}: uncensored AI image generators compared",
    keywords:
      "uncensored AI image generator, AI image generator without restrictions, AI image generator no filter, NSFW AI image generator, uncensored image editing, Chroma, Lustify, Qwen Edit Uncensored, FLUX.3, Seedream 5.5, GPT Image, Recraft, AI image generator price per image, cheapest AI image generator, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Comparison",
    readTime: "8 min read",
    title: "Uncensored AI image generators. Real prices, no blur.",
    subtitle:
      "{{modelCount}} image models from {{labCount}} labs on one balance, {{uncensoredCount}} of them uncensored. What each one does, what it costs per image, and where it falls short.",
  },
  intro: {
    lead: "You typed a normal prompt. The image came back blurred, cropped or refused. A figure study, a horror cover, a scene from your own novel. Mainstream image generators filter for the most cautious user on earth, and you pay a monthly fee for the privilege.",
    p2: "{{appName}} runs {{modelCount}} image models from {{labCount}} labs, {{uncensoredCount}} of them uncensored, all on one credit balance. Below: which models actually generate without a filter, every model side by side with its filter level and real price per image, the picks per job, and how to make or edit an image straight from a chat.",
  },
  exists: {
    title: "Is there an uncensored AI image generator?",
    intro:
      "Yes. {{uncensoredCount}} of them run here, served by Venice.ai with no blur and no refusals. Two make images from text, two edit an image you give them.",
    models: {
      lustify:
        "Photoreal adult imagery. Built for bodies and skin. Weak at text in images and complex scenes.",
      chroma:
        "Open weights, retrained without content filtering. Long prompts, wide range of art styles, explicit content included.",
      qwenEdit:
        "Uncensored editing. Hand it a picture and an instruction: swap outfits, restyle, rework the scene.",
      fireRed:
        "Precise edits. Changes what you describe and leaves the rest of the picture alone.",
      other:
        "Uncensored image model. See the model page for what it does best.",
    },
    consent:
      "Uncensored models are for adults. The first time you use one, you confirm you are 18 or older. Once. After that, you decide what you make, not a corporation.",
  },
  levels: {
    title: "What the filter levels mean for images",
    intro: "Every image model carries one of three levels.",
    mainstream:
      "Mainstream ({{mainstreamCount}} models): OpenAI and Recraft. Strict filters. Great at text and design, useless for anything a brand safety team would flag.",
    open: "Open ({{openCount}} models): FLUX, Seedream, Qwen, Grok Imagine, Wan and more. Lighter filters, fine for dark art and mature themes, but not explicit.",
    uncensored:
      "Uncensored ({{uncensoredCount}} models): no filter from us, no refusal upstream. Explicit output on the models built for it.",
    p1: "Pick the level per image, not per account. Need a clean product shot? Use an open model. Need the scene your story actually calls for? Use an uncensored one. Same balance, same chat.",
  },
  table: {
    title: "All {{modelCount}} image models, side by side",
    intro:
      "Uncensored first, then open, then mainstream. Cheapest first inside each level. Prices include our {{markup}}% markup. 1 credit = {{creditValue}}.",
    colModel: "Model",
    colFilter: "Filter level",
    colInput: "Input",
    colCredits: "Credits / image",
    colPrice: "Price / image",
    inputText: "Text",
    inputEdit: "Text or image",
    perUnit: "{{perUnit}} images per {{unit}}",
    footnote:
      '"Text or image" means the model takes a reference picture: edits, image to image, consistent characters. Price is the default size; a few models charge more for larger sizes. Models billed per token instead of per image sit in the full model list.',
    allModels: "See every model with full specs",
  },
  picks: {
    title: "The best AI image generator for each job",
    intro:
      "No single model wins. Six jobs, the models that fit them, the hard facts under each.",
    factLine:
      "{{credits}} credits ({{price}}) · {{perUnit}} per {{unit}} · {{tier}} · {{input}}",
    uncensored: {
      title: "No filter: explicit and taboo",
      body: "From text, nothing blurred. Chroma for range: illustration, painting, fantasy, long detailed prompts. Lustify for photoreal bodies. Both are among the cheapest models on the platform.",
    },
    uncensoredEdit: {
      title: "No filter: edit your own picture",
      body: "Upload an image, say what changes. Qwen Edit Uncensored is the one tagged for explicit output. FireRed is the precise one. On hard edits, run both.",
    },
    cheap: {
      title: "Cheapest: drafts and volume",
      body: "Thumbnails, mood boards, testing a prompt before the real render. {{cheapestName}} costs {{cheapestCredits}} credits, {{cheapestPerUnit}} images per {{unit}}.",
    },
    quality: {
      title: "Best detail: the final render",
      body: "When the image is the deliverable. Sharper detail, tighter prompt following. Draft on a cheap model, render the keeper here.",
    },
    text: {
      title: "Text in the image: posters, logos, ads",
      body: "Most models mangle letters. These do not. Recraft is built for design work. GPT Image keeps dense layouts intact. Qwen Image 3 Pro is the open option. All of them are filtered.",
    },
    references: {
      title: "Reference images and consistent characters",
      body: "Same face, same product, shot after shot. These take one or more reference images. {{editCount}} models here take an image as input.",
    },
  },
  chat: {
    title: "Make an image from any chat",
    intro:
      "No separate app. Ask in any chat on {{appName}} and the AI calls the image generator for you.",
    steps: {
      ask: {
        title: "Describe the picture",
        body: "Subject, style, light, framing. Plain words. The AI writes the generation prompt.",
      },
      model: {
        title: "Use the default, or name a model",
        body: 'Your skill\'s image setting picks the model: {{defaultModel}} unless you changed it. Want another? Say it: "use FLUX.3".',
      },
      edit: {
        title: "Attach a picture to edit it",
        body: "Drop in an image and say what changes. Edits need a model that takes images, like Qwen Edit Uncensored or Seedream. Text-only models cannot read your picture.",
      },
      result: {
        title: "See it, keep it",
        body: "The image shows up in the chat within seconds and saves to your storage. Keep talking to refine it.",
      },
    },
    toolPage:
      "Want full control? The image generator page sets model, size, aspect ratio and quality directly.",
    toolLink: "Open the image generator",
    roleplayLink:
      "Character art for your roleplay: the unfiltered roleplay guide",
  },
  pricing: {
    title: "What an AI image costs here",
    intro: "Credits per image. One balance pays for every model.",
    perImage:
      "Each model has a price per image: the provider's price plus our {{markup}}% markup, rounded up to a tenth of a credit. 1 credit = {{creditValue}}.",
    range:
      "Cheapest right now: {{cheapestName}} at {{cheapestPrice}}. Cheapest uncensored: {{uncensoredName}} at {{uncensoredPrice}}. Priciest: {{priciestName}} at {{priciestPrice}}.",
    failed:
      "Credits come off only after an image is delivered. Failed job or upstream refusal: you pay nothing.",
    free: "Free: {{guestCredits}} credits a month without an account, {{freeCredits}} with a free account. On {{uncensoredName}} that is {{freeUncensoredImages}} images a month for nothing.",
    sub: "Monthly plans: four sizes, starting at {{subCredits}} credits for {{subPrice}}.",
    pack: "Credit packs: a top-up for subscribers, {{packCredits}} credits for {{packPrice}}. They never expire. Card, PayPal or crypto.",
    link: "See plans and credit packs",
  },
  limits: {
    title: "The limits, straight",
    intro: "Know the edges before you spend.",
    textOnly:
      "The two uncensored generators take text only. To change an existing picture without a filter, switch to an uncensored edit model.",
    specialists:
      "Uncensored models are specialists. For typography, logos and clean product shots, the mainstream and open models are better.",
    upstream:
      "Open and mainstream models run behind their providers' moderation. If one refuses, it costs nothing. Switch to an uncensored model instead of rewording.",
    video:
      "Video is different. Every video model here comes from a mainstream lab with its provider's filters. Uncensored stops at still images.",
    law: "No filter means no safety net. What you create and publish is on you, and the law where you live still applies. Sexual imagery of minors is illegal everywhere. In many countries, so is sexual imagery of a real person made without their consent.",
    callout:
      "Adults decide what they look at. We give you the tools and the facts, not a lecture.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Is there an AI image generator without restrictions?",
      a: "Yes. {{appName}} runs {{uncensoredCount}} uncensored image models: Chroma and Lustify make images from text, Qwen Edit Uncensored and FireRed edit your own pictures. No blur, no refusal. A one-time 18+ confirmation unlocks them.",
    },
    free: {
      q: "Is there a free uncensored AI image generator?",
      a: "You can start free. {{guestCredits}} credits a month without an account, {{freeCredits}} with a free account. {{uncensoredName}} costs {{uncensoredCredits}} credits per image. After that: a plan, from {{subPrice}} a month.",
    },
    cheapest: {
      q: "What is the cheapest AI image generator?",
      a: "Right now {{cheapestName}} at {{cheapestCredits}} credits ({{cheapestPrice}}) per image. All {{modelCount}} prices are in the table above, read live from our model registry.",
    },
    edit: {
      q: "Can I edit a photo without a filter?",
      a: "Yes. Attach the picture in a chat and describe the change, then name Qwen Edit Uncensored or FireRed. Mainstream and open edit models apply their providers' filters.",
    },
    consent: {
      q: "Why do I need to confirm I am 18?",
      a: "Uncensored models can produce explicit content. You confirm once that you are an adult, and that is it. No ID upload, no repeated warnings.",
    },
    watermark: {
      q: "Do the images have a watermark?",
      a: "Not from us. No logo, no overlay. Some labs embed invisible provenance data on their own; that comes from the lab.",
    },
    api: {
      q: "Can I generate images through the API?",
      a: "The {{appName}} API covers chat models in the OpenAI and Anthropic formats. Image generation runs in the chat and on the image generator page.",
    },
    videoLink: "Compare the AI video generators",
    chatLink: "Read the guide to every uncensored chat model",
  },
  partners: {
    body: "Run a channel or community about AI art? The {{appName}} partner program pays a recurring share of every payment you refer.",
    link: "See the partner program",
  },
  cta: {
    title: "Pick a model. Make the picture.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Uncensored, open or mainstream, per image.",
    generate: "Generate an image",
    models: "Browse all models",
  },
};
