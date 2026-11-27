import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Dokumentácia API {{appName}} | OpenAI a Anthropic",
    description:
      "Jedna adresa URL pre {{modelCount}} modelov. API kompatibilné s OpenAI a Anthropic, streamovanie, nástroje, obrázky, hlas, video a hudba. Platíš kreditmi.",
    category: "API",
    imageAlt: "Dokumentácia API {{appName}} kompatibilného s OpenAI",
    keywords:
      "api, kompatibilné s openai, kompatibilné s anthropic, chat completions, responses api, messages api, codex cli, claude code, streamovanie, volanie funkcií, api na generovanie obrázkov, api na prevod textu na reč, whisper api, api na generovanie videa, api na generovanie hudby, {{appName}}",
  },
  toc: {
    title: "Na tejto stránke",
    mobileTitle: "Prejsť na",
    groups: {
      start: "Začíname",
      chat: "Chat",
      media: "Médiá",
      reference: "Referenčná príručka",
      integrations: "Integrácie",
    },
  },
  nav: {
    quickstart: "Rýchly štart",
    auth: "Autentifikácia",
    access: "Prístup a ceny",
    models: "Modely",
    chat: "Chat completions",
    tools: "Volanie nástrojov",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Kredity a účtovanie",
    errors: "Chyby a limity požiadaviek",
    codingTools: "Programovacie nástroje",
    sdks: "Príklady použitia SDK",
    guides: "Návody",
    images: "Obrázky",
    speech: "Prevod textu na reč",
    transcriptions: "Prepis reči",
    videos: "Video",
    music: "Hudba",
    mediaFiles: "Mediálne súbory",
  },
  hero: {
    badge: "Dokumentácia API",
    title: "Jedna základná adresa.",
    titleHighlight: "Všetky modely.",
    subtitle:
      "Pripoj ľubovoľné SDK od OpenAI alebo Anthropic k {{appName}}. Funguje aj Codex CLI a Claude Code. Jeden kľúč stačí na obrázky, hlas, video aj hudbu. Používaj klienta, ktorého už poznáš.",
    ctaKey: "Získať kľúč API",
    ctaPricing: "Zobraziť plány",
    quickstartLink: "Rýchly štart v troch krokoch",
    facts: {
      models: "Počet modelov na čet: {{modelCount}}",
      formats: "Formáty OpenAI a Anthropic",
      streaming: "Streamovanie a volanie nástrojov",
      rate: "Bez pevného limitu požiadaviek",
    },
  },
  code: {
    copy: "Kopírovať",
    wrap: "Zalomiť riadky",
    copied: "Skopírované",
    request: "Požiadavka",
    response: "Odpoveď",
    stream: "Stream",
    showResponse: "Príklad odpovede",
    showStream: "Príklad streamu",
    showObject: "Objekt dokončenej úlohy",
  },
  quickstart: {
    title: "Rýchly štart",
    intro:
      "API používa formáty OpenAI a Anthropic. Ak tvoj kód funguje s jedným z nich, tu stačí zmeniť základnú adresu URL a kľúč.",
    baseUrlLabel: "Základná adresa URL pre OpenAI",
    anthropicBaseUrlLabel: "Základná adresa URL pre Anthropic",
    anthropicBaseUrlNote:
      "Pre Claude Code a SDK od Anthropic. Na koniec nedávaj `/v1`. Klienti si `/v1/messages` pridajú sami.",
    baseUrlNote:
      "V ceste môžeš použiť akékoľvek podporované jazykové nastavenie (napríklad sk-SK, en-US, de-DE alebo pl-PL). Ovplyvňuje iba jazyk chybových hlásení.",
    envLabel: "Alebo ju nastav raz pre všetky SDK od OpenAI",
    step1: {
      title: "Vytvor kľúč",
      description:
        "V účte otvor sekciu kľúčov API, pomenuj nový kľúč a skopíruj ho. Zobrazí sa iba raz.",
      cta: "Otvoriť kľúče API",
    },
    step2: {
      title: "Nastav základnú adresu URL",
      description:
        "Zmeň základnú adresu URL v klientovi. Klienti Anthropic používajú druhú adresu.",
    },
    step3: {
      title: "Odošli požiadavku",
      description:
        "Vlož príkaz do terminálu, doplň svoj kľúč a spusti ho. Rovnaké volanie funguje aj v Pythone a JavaScripte.",
    },
  },
  access: {
    title: "Prístup a ceny",
    intro:
      "API aj čet čerpajú z rovnakého zostatku kreditov. Za API neplatíš osobitné predplatné ani poplatok za používateľa.",
    unlockTitle: "Čo odomkne prístup",
    plan: "Ľubovoľný plán od {{subPrice}} mesačne. Každý plán zahŕňa mesačné kredity.",
    grant: "Kredity, ktoré ti pridelí náš tím, napríklad na testovanie.",
    never:
      "Bezplatné kredity prístup neodomknú. Platí to pre mesačný limit, bonusy za registráciu a odber newslettera aj odmeny za odporúčania.",
    withoutTitle: "Bez oprávnenia na API",
    locked:
      "Účet bez oprávnenia na API nemôže vytvoriť kľúč. Jeho volania `/v1` vrátia HTTP 402 `paid_plan_required`.",
    topup:
      "Potrebuješ viac? Ak máš predplatné, môžeš si dokúpiť balík kreditov od {{packPrice}}. Kredity z balíkov neprepadnú.",
    ctaUnlock: "Zobraziť plány",
    ctaKeys: "Otvoriť kľúče API",
  },
  auth: {
    title: "Autentifikácia",
    intro:
      "V každej požiadavke odošli svoj kľúč ako token Bearer. Kľúče začínajú na `sk-unb-`. Klienti Anthropic môžu použiť hlavičku `x-api-key`.",
    header: "Authorization: Bearer sk-unb-YOUR_KEY",
    headerAnthropic: "x-api-key: sk-unb-YOUR_KEY",
    headerTab: "Formát OpenAI",
    headerAnthropicTab: "Formát Anthropic",
    points: {
      hash: "Ukladáme iba odtlačok kľúča. Ak kľúč stratíš, vytvor si nový.",
      scope:
        "Kľúč funguje iba v API: `/v1/models`, chat (`/v1/chat/completions`, `/v1/responses`, `/v1/messages`) a médiá (`/v1/images`, `/v1/audio`, `/v1/videos`, `/v1/music`, `/v1/media`). Nedáva prístup k účtu, platbám ani nastaveniam.",
      limit:
        "Na jeden účet môžeš mať najviac {{maxKeys}} aktívnych kľúčov. Kľúč môžeš kedykoľvek zrušiť a okamžite prestane fungovať.",
      missing:
        "Bez kľúča alebo so zrušeným kľúčom dostaneš stav 401. S kľúčom k účtu bez oprávnenia na API dostaneš stav 402.",
    },
  },
  models: {
    title: "Modely",
    intro:
      "`GET /v1/models` vypíše modely, ktoré môžeš použiť so svojím kľúčom, vrátane veľkosti kontextového okna, podpory nástrojov a cien v kreditoch za milión tokenov. ID modelu zadaj v poli `model`.",
    note: "Zoznam závisí od účtu. Neznáme alebo nedostupné ID vráti 404 `model_not_found`. Pri volaní `/v1/messages` smerujú predvolené ID z Claude Code na náš najnovší model z rovnakej rodiny Claude.",
    browse: "Prezri si všetky modely s cenami a filtrami",
    rates: {
      tiers:
        "Ak odpoveď obsahuje `pricing.tiers`, použi rovnaké cenové polia z príslušného pásma. Pásmo platí od `min_prompt_tokens` vrátane. Polia `utc_start` a `utc_end` sú časy UTC vo formáte HHMM. Začiatok patrí do intervalu a koniec už nie.",
      title: "Ceny tokenov v chate",
      unit: "Rozšírenie `pricing` uvádza ceny v kreditoch za milión tokenov v základnom kontextovom pásme vrátane prirážky. Ceny v tomto objekte sú vždy v kreditoch. Hodnota `null` znamená, že samostatná sadzba chýba.",
      input: "Vstup mimo vyrovnávacej pamäte.",
      output: "Vygenerovaný text na výstupe.",
      read: "Vstup načítaný z vyrovnávacej pamäte zadaní.",
      write:
        "Vstup zapísaný do vyrovnávacej pamäte zadaní s predvolenou dobou platnosti.",
      hour: "Vstup uložený do vyrovnávacej pamäte na jednu hodinu.",
    },
    media: {
      title: "Mediálne modely v rovnakom zozname",
      body: "V tom istom zozname nájdeš modely pre obrázky, video, hudbu, hlas aj prepis. Pri každom je uvedené, čo robí a na ktorej adrese ho môžeš volať.",
      filename: "položka mediálneho modelu",
      points: {
        modality:
          "Pole `modality` obsahuje `chat`, `image`, `video`, `music`, `speech` alebo `transcription`. Pole `endpoints` uvádza cesty, ktoré daný model podporujú.",
        pricing:
          "Cena médií sa uvádza za jednotku: `credits_per_image`, `credits_per_second` (video), `credits_per_clip` (hudba), `credits_per_1k_characters` (reč), `credits_per_minute` (prepis).",
        anthropic:
          "Klienti Anthropic s hlavičkou `anthropic-version` dostanú iba modely na chat. Modely od poskytovateľov, ktorých nemáme nastavených, v zozname chýbajú a vracajú 404 `model_not_found`.",
      },
    },
  },
  chat: {
    title: "Chat completions",
    intro:
      "Štandardné rozhranie OpenAI chat completions. Pošleš správy a dostaneš jednu odpoveď asistenta. Na vstupe môže byť text aj obrázok (`image_url` ako HTTPS URL alebo dátová URL s Base64).",
    nonStream: {
      title: "Bez streamovania",
      body: "Predvolené správanie. Po dokončení modelu dostaneš jedno telo JSON. Cena volania je v poli `usage.credits_charged`.",
    },
    stream: {
      title: "Streamovanie",
      body: "Nastav `stream: true` a server bude odosielať udalosti po častiach vo formáte OpenAI. Stream ukončí `data: [DONE]`. Ak pridáš `stream_options.include_usage`, posledná časť uvedie počet tokenov a `credits_charged`. Zatvorením pripojenia zastavíš generovanie. Zaplatíš iba za to, čo už prebehlo.",
    },
    paramsTitle: "Polia požiadavky",
    paramsColumns: { field: "Pole", description: "Význam" },
    params: {
      model: "Povinné. ID modelu z `GET /v1/models`.",
      messages:
        "Povinné. Správy s rolami `system`, `developer`, `user`, `assistant` a `tool`. Obsah používateľskej správy môže byť reťazec alebo zoznam častí typu `text` a `image_url`.",
      stream:
        "Pri hodnote `true` server odosiela udalosti. Predvolená hodnota je `false`.",
      streamOptions:
        "`{ include_usage: true }` pridá na koniec streamu údaje o spotrebe.",
      maxTokens:
        "Horný limit vygenerovaných tokenov. Prednosť má `max_completion_tokens`. Najviac {{maxTokens}} tokenov.",
      temperature: "Od 0 do 2. Modely bez podpory tohto parametra ho ignorujú.",
      topP: "Od 0 do 1.",
      stop: "Reťazec alebo zoznam reťazcov, ktoré ukončia generovanie.",
      n: "Podporovaná je iba hodnota 1. Iné hodnoty vrátia 400.",
      tools: "Funkcie, ktoré môže model volať. Pozri časť Volanie nástrojov.",
      toolChoice:
        "`none`, `auto`, `required` alebo konkrétna pomenovaná funkcia.",
    },
  },
  tools: {
    title: "Volanie nástrojov",
    intro:
      "Volanie funkcií funguje ako v OpenAI. Opíšeš funkcie, model rozhodne, ktorú zavolať, ty ju spustíš a pošleš výsledok späť. Tvoje nástroje nikdy nespúšťame.",
    flow: {
      title: "Ako prebieha volanie",
      step1: "Pošli nástroje spolu so správami.",
      step2:
        "Model vráti `tool_calls` a `finish_reason: tool_calls`. Každé volanie obsahuje ID, názov funkcie a argumenty vo formáte reťazca JSON.",
      step3:
        "Spusť funkciu. Pridaj správu asistenta a potom ku každému volaniu jednu správu s rolou `tool` a príslušným `tool_call_id`.",
      step4: "Zavolaj API znova. Model použije výsledky a odpovie.",
    },
    requestTitle: "1. Požiadavka s nástrojmi",
    responseTitle: "2. Model požiada o volanie",
    followUpTitle: "3. Vráť výsledok",
    sdkTitle: "Rovnaký postup so súpravou SDK pre Python",
    streamingTitle: "Streamovanie volaní nástrojov",
    streamingBody:
      "Pri `stream: true` prichádzajú volania po častiach v `delta.tool_calls` podľa indexu. Prvá časť pre daný index nesie ID a `function.name`. Ďalšie dopĺňajú `function.arguments`. Spoj ich a spracuj JSON, keď má `finish_reason` hodnotu `tool_calls`. Každé SDK od OpenAI to spraví za teba.",
    rules: {
      title: "Pravidlá",
      support:
        "Model musí podporovať nástroje. Over `supports_tools` cez `GET /v1/models`. Modely bez podpory vracajú 400 `tools_not_supported`.",
      choice:
        "Hodnoty `none`, `auto` a `required` v `tool_choice` fungujú ako v OpenAI. Ak zadáš funkciu, ktorá v `tools` chýba, dostaneš 400.",
      names:
        "Názvy funkcií môžu obsahovať písmená, číslice, podčiarkovník a spojovník. Najviac 64 znakov.",
      billing:
        "Definície a výsledky nástrojov sa počítajú ako vstupné tokeny. Volania sa počítajú ako výstupné tokeny. Účtujú sa rovnako ako ostatné tokeny.",
    },
  },
  billing: {
    title: "Kredity a účtovanie",
    intro:
      "API čerpá z rovnakého zostatku ako chat. Aj účtovanie sa riadi rovnakými pravidlami.",
    points: {
      price:
        "Pri odhade podľa cenníka vydel počet tokenov každej skupiny miliónom a vynásob ho príslušnou sadzbou. Každý vstupný token započítaj iba raz: mimo vyrovnávacej pamäte, pri načítaní z nej alebo pri zápise do nej.",
      usage:
        "Každá odpoveď uvádza `usage.credits_charged`. Zostatok nájdeš v aplikácii v sekcii Kredity.",
      preflight:
        "Pred volaním porovnáme zostatok s najvyšším odhadom ceny. Ak nestačí, dostaneš HTTP 402 `insufficient_credits`. Volanie sa nespustí a nič neúčtujeme.",
      real: "Ak poskytovateľ nahlási skutočnú cenu, pripočítame k nej našu prirážku. Inak použijeme príslušné sadzby za tokeny. Konečnú zaokrúhlenú sumu nájdeš v `usage.credits_charged`.",
      media:
        "Mediálne volania účtujeme rovnako. Ak poskytovateľ nahlási skutočnú cenu, pripočítame prirážku. Inak použijeme cenníkovú cenu modelu. Obrázky účtujeme za kus, reč za znak, prepis za sekundu zvuku, video po dokončení a hudbu za klip.",
      topup:
        "Minuli sa ti kredity? Dokúp balík, obnov predplatné alebo prejdi na vyšší plán. Ďalšiu požiadavku môžeš odoslať hneď.",
    },
  },
  limits: {
    title: "Limity požiadaviek",
    body: "Pre platené účty neplatí žiadny pevný limit požiadaviek. Používanie sa účtuje za každú požiadavku z tvojho zostatku kreditov a pri vyčerpaní sa zastaví chybou HTTP 402. Platí len veľkorysá ochrana proti zneužitiu (vysoký strop pre nárazové špičky a limit súbežných streamov), aby nekontrolované slučky nepreťažili službu. Odpovede HTTP 429 od poskytovateľov modelov posielame ďalej vrátane hlavičky `Retry-After`. Ak dostaneš HTTP 429, počkaj podľa `Retry-After` a skús znova.",
  },
  errors: {
    title: "Chyby a limity požiadaviek",
    intro:
      "Chyby majú štruktúru OpenAI. SDK preto vyvolávajú rovnaké výnimky ako zvyčajne. V kóde sa riaď hodnotou `error.code`. Text hlásenia sa môže meniť.",
    shapeTitle: "Telo chybovej odpovede",
    shapeOpenAi: "Formát OpenAI",
    shapeAnthropic: "Formát Anthropic",
    codesTitle: "Kódy chýb",
    columns: { status: "HTTP", code: "Kód", meaning: "Význam" },
    rows: {
      missingKey:
        "Chýba kľúč. Odošli `Authorization: Bearer sk-unb-...` alebo `x-api-key`.",
      invalidKey: "Kľúč je neplatný alebo zrušený.",
      paid: "Účet ešte nemá oprávnenie na API. Získaš ho napríklad s ľubovoľným plateným predplatným.",
      credits: "Zostatok na toto volanie nestačí. Dobi si kredity.",
      cap: "Zostatok zakúpených kreditov je vyčerpaný a dosiahol si denný limit bezplatných kreditov. Dobi si kredity.",
      notFound: "Model neexistuje alebo k nemu nemáš prístup.",
      invalid:
        "Chybná požiadavka: nepodporovaný parameter, neplatné `tool_choice` alebo neplatná adresa URL obrázka.",
      contentPolicy:
        "Poskytovateľ médií odmietol zadanie. Nič neúčtujeme. Uprav zadanie alebo vyber iný model.",
      consent:
        "Modely bez cenzúry vyžadujú jednorazové potvrdenie veku 18+. Potvrď ho na stránke s kľúčmi API a volanie zopakuj.",
      rate: "Zasiahla ochrana proti zneužitiu (nárazová špička alebo súbežné streamy) alebo 429 od poskytovateľa modelu. Pozri `Retry-After` a skús znova.",
      upstream:
        "Poskytovateľ modelu zlyhal. Volanie môžeš bezpečne zopakovať. Streamy sa ukončia chybovou udalosťou.",
      balance:
        "Zostatok sa nepodarilo načítať, takže sa nič nespustilo. Skús znova.",
    },
    streamNote:
      "Chyby počas streamu prídu ako udalosť `data:` s rovnakým objektom chyby. Nasleduje `data: [DONE]`.",
  },
  responses: {
    title: "Responses API",
    intro:
      "OpenAI Responses API je formát, ktorý používa Codex CLI. Modely, kľúč API, kredity aj limity zostávajú rovnaké ako pri chat completions.",
    request: {
      title: "Požiadavka",
      body: "Pole `input` obsahuje reťazec alebo zoznam vstupných položiek. Pole `instructions` obsahuje systémové pokyny. Odpoveď príde ako zoznam výstupných položiek. Každé SDK od OpenAI poskytuje aj `output_text`.",
    },
    stream: {
      title: "Streamovanie",
      body: "Nastav `stream: true` a dostaneš stream udalostí Responses. Najprv príde `response.created`, potom časti textu a nakoniec `response.completed` s údajmi o spotrebe.",
    },
    points: {
      tools:
        "Nástroje: `function`, `custom` a `local_shell`. Volania modelu sa vracajú ako výstupné položky. Každý výsledok pošli späť ako položku `function_call_output` s rovnakým `call_id`.",
      reasoning:
        "Modely s uvažovaním vracajú popri odpovedi aj položky s priebehom uvažovania.",
      billing:
        "Účtovanie, ID modelov, chyby a limity fungujú rovnako ako pri chat completions.",
    },
  },
  messages: {
    title: "Messages API",
    intro:
      "Anthropic Messages API je formát, ktorý používajú Claude Code a SDK od Anthropic. Použi základnú adresu URL bez `/v1`. Klienti si `/v1/messages` pridajú sami.",
    request: {
      title: "Požiadavka",
      body: "Štandardná požiadavka Messages obsahuje `model`, `max_tokens`, `system` a `messages`. Na vstupe sú bloky textu a obrázkov. Na výstupe sú bloky textu a `tool_use`.",
    },
    stream: {
      title: "Streamovanie",
      body: "Nastav `stream: true` a server bude odosielať udalosti vo formáte Anthropic od `message_start` po `message_stop`.",
    },
    points: {
      auth: "Overenie: `x-api-key` alebo `Authorization: Bearer`. Obe hlavičky prijímajú tvoj kľúč sk-unb.",
      models:
        "Model: ľubovoľné ID z `GET /v1/models`. Predvolené ID, ktoré posiela Claude Code, napríklad `claude-sonnet-4-5-20250929`, smerujú na zodpovedajúci model Claude v našej ponuke.",
      tools:
        "Nástroje fungujú rovnako ako v Anthropic API. Dostaneš bloky `tool_use` a pošleš späť bloky `tool_result`.",
      billing:
        "Kredity, ceny a limity sa riadia rovnakými pravidlami ako v ostatných koncových bodoch.",
    },
    countTokens: {
      title: "Počet tokenov",
      body: "`POST /v1/messages/count_tokens` spočíta vstupné tokeny požiadavky Messages bez spustenia modelu. Claude Code ho volá pri správe kontextu.",
    },
  },
  images: {
    title: "Obrázky",
    intro:
      "Formát obrázkov OpenAI. Vyber model s modalitou `image` z `GET /v1/models`. Funguje s klientom pre obrázky v každom SDK od OpenAI.",
    generate: {
      title: "Generovať",
      body: "Pošli JSON s týmito poľami. Odpoveď obsahuje jednu adresu `url` pre každý obrázok.",
    },
    params: {
      model:
        "Povinné. Ľubovoľné ID modelu s modalitou `image` z `GET /v1/models`.",
      prompt: "Povinné. Opíš, čo sa má nakresliť, najviac 2000 znakov.",
      n: "Počet obrázkov na volanie od 1 do {{maxImages}}. Každý obrázok sa účtuje samostatne.",
      size: "`WIDTHxHEIGHT`, napríklad `1024x1024`, alebo `auto`. Vyberieme najbližšiu veľkosť, ktorú model dokáže vygenerovať.",
      aspectRatio:
        "Naše rozšírenie: `1:1 | 16:9 | 9:16 | 4:3 | 3:4 | 3:2 | 2:3 | 21:9`. Má prednosť pred poľom `size`.",
      quality:
        "`standard | hd | low | medium | high | auto`. Hodnoty `hd` a `high` žiadajú detailnejší výstup, ak ho model ponúka.",
      responseFormat:
        "`url` (predvolený podpísaný odkaz s platnosťou 7 dní) alebo `b64_json`.",
    },
    edit: {
      title: "Upraviť obrázok",
      body: "Pošli jeden vstupný obrázok a prompt. Obrázok nahraj v poli `image` formulára multipart alebo pošli `image_url` v JSON (HTTPS alebo dátovú URL s Base64). Model musí prijímať obrázky: `input_modalities` musí obsahovať `image`. Masky nepodporujeme. Zmenu opíš v prompte.",
    },
    points: {
      size: "Vyberieme najbližšiu veľkosť a pomer strán, ktoré model dokáže vygenerovať.",
      format:
        "Pole `url` obsahuje podpísaný odkaz na súbor. Platí 7 dní bez kľúča. Pole `b64_json` vráti obsah súboru priamo v odpovedi v kódovaní Base64.",
      billing:
        "Účtujeme za každý obrázok. Cenu volania nájdeš v poli `credits_charged`.",
    },
  },
  speech: {
    title: "Prevod textu na reč",
    intro:
      "Z textu dostaneš zvukové dáta. Pole `model` obsahuje ID hlasu z `GET /v1/models` s modalitou `speech`, napríklad `openai-nova`. Funguje aj zápis OpenAI s modelom `tts-1` a hlasom `nova`.",
    points: {
      voices:
        "Pole `input` môže obsahovať najviac {{maxChars}} znakov. Hlasy OpenAI, NanoGPT a ElevenLabs podporujú `speed` od 0,25 do 4.",
      formats:
        "`response_format` môže byť `mp3` (predvolené), `opus`, `aac`, `flac`, `wav` alebo `pcm`. Dostupnosť závisí od poskytovateľa hlasu. Pri nepodporovanom formáte dostaneš 400 so zoznamom možností.",
      billing:
        "Účtujeme za každý znak. Cenu volania nájdeš v hlavičke `X-Credits-Charged`.",
    },
  },
  transcriptions: {
    title: "Prepis reči",
    intro:
      "Prevod reči na text vo formáte OpenAI Whisper. Nahraj súbor cez multipart s volaním SDK, ktoré už používaš.",
    transcribe: {
      title: "Prepísať",
      body: "Pole `file` prijíma súbor do {{maxMb}} MB (mp3, mp4, m4a, wav, webm, ogg, flac). Zadaj `model`, napríklad `whisper-1`, a voliteľne `language`. `response_format` môže byť `json`, `text`, `srt`, `verbose_json` alebo `vtt`.",
    },
    translate: {
      title: "Preložiť do angličtiny",
      body: "`POST /v1/audio/translations` prevedie reč v ľubovoľnom jazyku na anglický text. Používa `whisper-1` a rovnaké formáty ako prepis.",
    },
    points: {
      billing: "Účtujeme za sekundu zvuku.",
    },
  },
  videos: {
    title: "Video",
    intro:
      "Asynchrónne rozhranie vo formáte video API od OpenAI. Volanie okamžite vráti úlohu. Kontroluj jej stav a potom si stiahni MP4.",
    create: {
      title: "Spustiť úlohu",
      body: "Pošli `model`, `prompt`, `seconds`, `size` alebo `aspect_ratio`, `resolution` a `negative_prompt`. Odpoveď obsahuje objekt videa so stavom `queued`.",
    },
    poll: {
      title: "Kontrola stavu a stiahnutie",
      body: "`GET /v1/videos/{id}` vráti stav (`queued`, `in_progress`, `completed`, `failed`), priebeh a po dokončení podpísanú adresu `url`. Kontroly stavu sú bezplatné a nezapočítavajú sa do ochrany proti zneužitiu. `GET /v1/videos/{id}/content` streamuje MP4.",
    },
    points: {
      image:
        "Pri prevode obrázka na video pošli `image_url` v JSON alebo nahraj `input_reference` cez multipart. Obrázok bude prvou snímkou.",
      billing:
        "Po dokončení videa účtujeme za každú jeho sekundu. Cenu nájdeš v `credits_charged`.",
      failed: "Neúspešná úloha nič nestojí. Dôvod nájdeš v poli `error`.",
    },
  },
  music: {
    title: "Hudba",
    intro:
      "Asynchrónne ako video. Spusť úlohu, stav kontroluj cez `GET /v1/music/{id}` a výsledok stiahni cez `GET /v1/music/{id}/content`.",
    startTitle: "Spustiť úlohu",
    pollTitle: "Kontrola stavu a stiahnutie",
    points: {
      seconds:
        "`seconds`: približne 8, 20 alebo 30 sekúnd. Model môže dĺžku zaokrúhliť. V poli `prompt` opíš štýl, náladu, nástroje a tempo.",
      billing: "Hotové klipy účtujeme za kus. Neúspešná úloha nič nestojí.",
    },
  },
  mediaFiles: {
    title: "Mediálne súbory",
    intro:
      "Všetky polia `url` v mediálnych odpovediach odkazujú sem. Podpísaný odkaz funguje bez kľúča 7 dní. Môžeš ho otvoriť v prehliadači alebo poslať používateľovi. S kľúčom API rovnaká cesta funguje kedykoľvek.",
  },
  codingTools: {
    title: "Programovacie nástroje",
    intro:
      "Jedna základná adresa URL, jeden kľúč. Codex CLI a Claude Code sa pripájajú priamo. OpenCode, Continue, Aider a Cline volajú chat completions. Vyber nástroj, skopíruj blok a spusti ho.",
    keyPage:
      "Na stránke s kľúčmi API nájdeš tie isté príklady s predvyplneným kľúčom.",
    keyPageCta: "Získať bloky s vlastným kľúčom",
    guide: "Prečítať návod pre programovacie nástroje",
  },
  sdks: {
    title: "Príklady použitia SDK",
    intro:
      "Oficiálne SDK od OpenAI a Anthropic fungujú bez úprav. Nastav iba základnú adresu URL a kľúč. Zvyšok kódu môžeš ponechať.",
    chat: "Chat",
    stream: "Streamovanie",
    responses: "Responses API",
    anthropic: "Anthropic SDK",
    images: "Obrázky",
    speech: "Reč",
    transcription: "Prepis reči",
  },
  guides: {
    title: "Návody",
    intro:
      "Podrobné postupy pre prechod z OpenAI alebo OpenRouter, používanie modelov bez cenzúry cez API a nastavenie kľúča v programovacích nástrojoch.",
  },
  cta: {
    title: "Vyvíjaj s každým modelom.",
    subtitle: "Vytvor kľúč, pripoj SDK a pusti sa do práce.",
    button: "Vytvoriť kľúč API",
    secondary: "Porovnať plány",
  },
};
