import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  promptCache: {
    label: "Vyrovnávacia pamäť zadania",
    description:
      "Uloží spoločný začiatok zadania do vyrovnávacej pamäte. Podľa potreby nastav dobu platnosti.",
  },
  category: "AI",

  tags: {
    api: "API kompatibilné s OpenAI",
  },

  openai: {
    missingKey:
      "Chýba kľúč API. Odošli ho v hlavičke 'Authorization: Bearer <key>' alebo 'x-api-key: <key>'. Kľúč vytvoríš v časti Nastavenia > Kľúče API.",
    invalidKey:
      "Kľúč API je neplatný alebo má zrušenú platnosť. Skontroluj ho alebo vytvor nový v časti Nastavenia > Kľúče API.",
    authUnavailable:
      "Kľúč API sa teraz nepodarilo overiť. Kľúč sme nezamietli. Skús znova o {{seconds}} s.",
    modelNotFound:
      "Model '{{model}}' neexistuje alebo k nemu nemáš prístup. Dostupné modely zobrazíš cez GET /v1/models.",
    paidRequired:
      "Prístup k API odomkne platený plán od {{subPrice}} mesačne alebo nákup kreditov. Možnosti nájdeš na {{url}}.",
    toolsUnsupportedByModel:
      "Tento model nepodporuje volanie nástrojov. Zvoľ model s touto podporou alebo odstráň 'tools'.",
    badToolArguments:
      "Argumenty volania nástroja '{{name}}' nemajú platný formát JSON.",
    toolChoiceUnknown:
      "Parameter tool_choice odkazuje na '{{name}}', ktorý nie je v zozname 'tools'.",
    toolMessageNeedsId: "Správa nástroja {{param}} vyžaduje tool_call_id.",
    nUnsupported: "Podporuje sa iba n=1.",
    badImageUrl:
      "image_url musí byť adresa http(s) alebo adresa data: s obsahom base64.",
    insufficientCredits:
      "Nemáš dosť kreditov. Táto požiadavka stojí približne {{cost}}, zostatok je {{balance}}. Doplň kredity a pokračuj.",
    rateLimited:
      "Príliš veľa požiadaviek v krátkom slede pre tento kľúč. Skús znova o {{seconds}} s.",
    tooManyStreams:
      "Príliš veľa súbežných streamov pre tento kľúč (limit {{limit}}). Zatvor aktívny stream alebo skús znova o {{seconds}} s.",
    upstreamRateLimited:
      "Poskytovateľ modelu dočasne obmedzuje požiadavky: {{error}}",
    upstreamFailed: "Poskytovateľ modelu vrátil chybu: {{error}}",
    balanceCheckFailed:
      "Zostatok kreditov sa nepodarilo overiť. Požiadavka sa nespustila. Skús znova.",
  },

  models: {
    get: {
      title: "Modely kompatibilné s OpenAI",
      titleShort: "Modely v1",
      description:
        "Zoznam modelov dostupných pre tvoj kľúč vo formáte OpenAI. Na overenie použi hlavičku Authorization: Bearer <key>.",
      response: { object: "Typ objektu" },
      success: {
        title: "Zoznam modelov sa načítal",
        description: "Modely dostupné s týmto kľúčom API",
      },
    },
  },

  completions: {
    post: {
      title: "Odpovede vo formáte OpenAI Chat Completions",
      titleShort: "Chat Completions v1",
      description:
        "Pošli požiadavku ľubovoľnému modelu vo formáte OpenAI Chat Completions. Kredity sa účtujú podľa cien za čet. Podporuje stream: true.",
      fields: {
        model: {
          label: "Model",
          description: "ID modelu z GET /v1/models",
        },
        messages: {
          label: "Správy",
          description: "Pole správ vo formáte OpenAI (system, user, assistant)",
        },
        stream: {
          label: "Priebežná odpoveď",
          description:
            "Odoslať odpoveď priebežne ako udalosti zo servera (SSE)",
        },
        streamOptions: {
          label: "Nastavenia priebežnej odpovede",
          description:
            "Voľba { include_usage: true } doplní na koniec odpovede údaje o spotrebe.",
        },
        maxTokens: {
          label: "Najviac tokenov",
          description: "Horná hranica počtu vygenerovaných tokenov",
        },
        maxCompletionTokens: {
          label: "Najviac tokenov odpovede",
          description:
            "Má rovnaký význam ako max_tokens a má pred ním prednosť.",
        },
        temperature: {
          label: "Teplota",
          description: "Teplota vzorkovania od 0 do 2",
        },
        topP: {
          label: "Top P",
          description: "Pravdepodobnostný prah pre vzorkovanie top-p od 0 do 1",
        },
        stop: {
          label: "Ukončenie generovania",
          description:
            "Reťazec, ktorý ukončí generovanie, alebo zoznam takýchto reťazcov",
        },
        n: {
          label: "Počet odpovedí",
          description: "Podporovaná je iba hodnota 1",
        },
        tools: {
          label: "Nástroje",
          description:
            "Nástroje vo formáte funkcií OpenAI, ktoré môže model volať: [{type:'function', function:{name, description, parameters}}]",
        },
        toolChoice: {
          label: "Výber nástroja",
          description:
            "none, auto, required alebo {type:'function', function:{name}}",
        },
        parallelToolCalls: {
          label: "Paralelné volania nástrojov",
          description:
            "Parameter sa prijíma pre kompatibilitu. O paralelnom volaní rozhoduje model.",
        },
      },
      response: { object: "Typ objektu" },
      success: {
        title: "Odpoveď sa vytvorila",
        description: "Model odpovedal",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id nie je podporované, pretože odpovede sa neukladajú. Celú konverzáciu pošli v poli 'input' s nastavením store: false. Codex CLI to robí predvolene.",
    badInputItem:
      "Parameter {{param}} nemožno spracovať. Obrázok musí mať adresu http(s) alebo adresu data: s obsahom base64. Položky nástrojov musia obsahovať call_id.",
    post: {
      title: "OpenAI Responses API",
      titleShort: "Responses v1",
      description:
        "Pošli požiadavku ľubovoľnému modelu vo formáte OpenAI Responses, ktorý používa aj Codex CLI. Rozhranie neuchováva stav. V poli input vždy pošli celú konverzáciu. Podporuje priebežné odpovede, položky uvažovania a nástroje function, custom a local_shell.",
      fields: {
        model: { label: "Model", description: "ID modelu z GET /v1/models" },
        input: {
          label: "Vstup",
          description:
            "Reťazec alebo konverzácia vo forme položiek Responses (message, function_call, function_call_output, reasoning a ďalšie)",
        },
        instructions: {
          label: "Pokyny",
          description: "Systémové pokyny pre model",
        },
        stream: {
          label: "Priebežná odpoveď",
          description:
            "Odoslať odpoveď priebežne ako udalosti zo servera vo formáte Responses",
        },
        tools: {
          label: "Nástroje",
          description:
            "Nástroje function, custom a local_shell. Hostované nástroje (web_search a ďalšie) sa preskočia.",
        },
        toolChoice: {
          label: "Výber nástroja",
          description: "none, auto, required alebo {type:'function', name}",
        },
        parallelToolCalls: {
          label: "Paralelné volania nástrojov",
          description:
            "Parameter sa prijíma pre kompatibilitu. O paralelnom volaní rozhoduje model.",
        },
        maxOutputTokens: {
          label: "Najviac výstupných tokenov",
          description: "Horná hranica počtu vygenerovaných tokenov",
        },
        temperature: {
          label: "Teplota",
          description: "Teplota vzorkovania od 0 do 2",
        },
        topP: {
          label: "Top P",
          description: "Pravdepodobnostný prah pre vzorkovanie top-p od 0 do 1",
        },
        reasoning: {
          label: "Uvažovanie",
          description:
            "Parameter sa prijíma pre kompatibilitu. Modely s podporou uvažovania vrátia položky uvažovania pri oboch nastaveniach.",
        },
        text: {
          label: "Formát textu",
          description:
            "Nastavenie {format:{type:'json_schema', schema}} vyžiada výstup vo formáte JSON.",
        },
        store: {
          label: "Ukladanie",
          description: "Odpovede sa neukladajú. Odošli false.",
        },
        previousResponseId: {
          label: "ID predchádzajúcej odpovede",
          description: "Nie je podporované. Pošli celú konverzáciu.",
        },
        include: {
          label: "Zahrnúť",
          description:
            "Parameter sa prijíma pre kompatibilitu. Položky uvažovania vždy obsahujú encrypted_content na opätovné použitie.",
        },
      },
      response: { object: "Typ objektu" },
      success: {
        title: "Odpoveď sa vytvorila",
        description: "Model odpovedal",
      },
    },
  },

  messages: {
    badContentBlock:
      "Parameter {{param}} obsahuje nepodporovaný blok. Obrázky musia mať adresu http(s) alebo obsah vo formáte base64.",
    post: {
      title: "Anthropic Messages API",
      titleShort: "Messages v1",
      description:
        "Pošli požiadavku ľubovoľnému modelu vo formáte Anthropic Messages, ktorý používa aj Claude Code. Kľúč zadaj v hlavičke x-api-key alebo Authorization: Bearer. Podporuje priebežné odpovede, nástroje a bloky thinking.",
      fields: {
        model: {
          label: "Model",
          description:
            "ID modelu z GET /v1/models. ID Claude, napríklad claude-sonnet-4-5-20250929, sa priradia k zodpovedajúcemu modelu Claude v našej ponuke.",
        },
        messages: {
          label: "Správy",
          description:
            "Správy vo formáte Anthropic. Správy rolí user a assistant môžu obsahovať bloky text, image, tool_use, tool_result a thinking.",
        },
        system: {
          label: "Systém",
          description:
            "Systémové zadanie ako reťazec alebo pole textových blokov",
        },
        maxTokens: {
          label: "Najviac tokenov",
          description: "Horná hranica počtu vygenerovaných tokenov",
        },
        stream: {
          label: "Priebežná odpoveď",
          description:
            "Odoslať odpoveď priebežne ako udalosti zo servera vo formáte Anthropic",
        },
        tools: {
          label: "Nástroje",
          description:
            "Klientske nástroje: [{name, description, input_schema}]. Serverové nástroje (web_search a ďalšie) sa preskočia.",
        },
        toolChoice: {
          label: "Výber nástroja",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Ukončovacie sekvencie",
          description: "Reťazce, ktoré ukončia odpoveď",
        },
        temperature: {
          label: "Teplota",
          description: "Teplota vzorkovania",
        },
        topP: {
          label: "Top P",
          description: "Pravdepodobnostný prah pre vzorkovanie top-p od 0 do 1",
        },
        thinking: {
          label: "Uvažovanie",
          description:
            "Parameter sa prijíma pre kompatibilitu. Modely s podporou uvažovania vrátia bloky thinking pri oboch nastaveniach.",
        },
      },
      response: { type: "Typ objektu" },
      success: { title: "Správa sa vytvorila", description: "Model odpovedal" },
    },
  },

  countTokens: {
    post: {
      title: "Počet tokenov vo formáte Anthropic",
      titleShort: "Počítanie tokenov v1",
      description:
        "Odhad počtu vstupných tokenov požiadavky Anthropic Messages. Model sa nevolá a kredity sa neúčtujú.",
      fields: {
        action: { label: "Akcia", description: "Vždy count_tokens" },
        model: { label: "Model", description: "ID modelu" },
        messages: {
          label: "Správy",
          description: "Správy vo formáte Anthropic",
        },
        system: { label: "Systém", description: "Systémové zadanie" },
        tools: { label: "Nástroje", description: "Definície nástrojov" },
      },
      response: { inputTokens: "Vstupné tokeny" },
      success: {
        title: "Tokeny sa spočítali",
        description: "Odhadovaný počet vstupných tokenov",
      },
    },
  },

  media: {
    images: {
      generations: {
        title: "Generovanie obrázkov kompatibilné s OpenAI",
        titleShort: "Obrázky v1",
        description:
          "Generuj obrázky pomocou ľubovoľného obrazového modelu z GET /v1/models. Rozhranie používa formát OpenAI Images. Vráti url (podpísaný odkaz s platnosťou 7 dní) alebo b64_json. Každý obrázok sa účtuje samostatne.",
        success: {
          title: "Obrázky sa vygenerovali",
          description: "Obrázky sú uložené a dostupné cez odkazy",
        },
      },
      edits: {
        title: "Úprava obrázkov kompatibilná s OpenAI",
        titleShort: "Úpravy obrázkov v1",
        description:
          "Uprav jeden obrázok podľa zadania pomocou modelu s obrazovým vstupom. Nahraj ho ako pole 'image' vo formáte multipart alebo odošli 'image_url'. Každý obrázok sa účtuje samostatne.",
        success: {
          title: "Obrázok sa upravil",
          description: "Upravený obrázok je uložený a dostupný cez odkaz",
        },
      },
    },
    speech: {
      title: "Prevod textu na reč kompatibilný s OpenAI",
      titleShort: "Syntéza reči v1",
      description:
        "Prevedie text na reč a vráti zvuk ako binárne údaje, predvolene vo formáte mp3. Cena sa počíta podľa počtu znakov.",
      success: { title: "Reč sa vygenerovala", description: "Zvukový súbor" },
    },
    transcriptions: {
      title: "Prepis zvuku kompatibilný s OpenAI",
      titleShort: "Prepisy v1",
      description:
        "Prepíše zvukový súbor nahratý v poli 'file' vo formáte multipart (najviac 25 MB). Výstupom môže byť JSON, text, SRT, WebVTT alebo podrobný JSON so segmentmi. Cena sa počíta podľa sekúnd zvuku.",
      success: { title: "Zvuk sa prepísal", description: "Prepis" },
    },
    translations: {
      title: "Preklad zvuku kompatibilný s OpenAI",
      titleShort: "Preklady v1",
      description:
        "Whisper prepíše zvukový súbor priamo do angličtiny. Formáty aj účtovanie sú rovnaké ako pri prepise.",
      success: {
        title: "Zvuk sa preložil",
        description: "Anglický prepis",
      },
    },
    videos: {
      create: {
        title: "Asynchrónne generovanie videa",
        titleShort: "Videá v1",
        description:
          "Spustí tvorbu videa cez rozhranie kompatibilné s OpenAI Video API a hneď vráti údaje o úlohe. Stav overíš cez GET /v1/videos/{id}, hotové video stiahneš cez GET /v1/videos/{id}/content. Kredity sa účtujú až po dokončení videa.",
        success: {
          title: "Video čaká na spracovanie",
          description: "Stav overíš podľa ID úlohy",
        },
      },
      get: {
        title: "Stav tvorby videa",
        titleShort: "Stav videa v1",
        description:
          "Vráti stav úlohy, priebeh a adresu výsledného videa. Overenie stavu je bezplatné a nezapočítava sa do ochrany proti zneužitiu.",
        success: {
          title: "Úloha na tvorbu videa",
          description: "Aktuálny stav úlohy",
        },
      },
      content: {
        title: "Stiahnutie videa",
        titleShort: "Obsah videa v1",
        description: "Hotový videosúbor z dokončenej úlohy",
        success: {
          title: "Videosúbor",
          description: "Binárny obsah súboru MP4",
        },
      },
    },
    music: {
      create: {
        title: "Asynchrónne generovanie hudby",
        titleShort: "Hudba v1",
        description:
          "Spustí tvorbu hudby a hneď vráti údaje o úlohe. Stav overíš cez GET /v1/music/{id}, hotovú hudbu stiahneš cez GET /v1/music/{id}/content. Každá skladba sa účtuje až po dokončení.",
        success: {
          title: "Hudba čaká na spracovanie",
          description: "Stav overíš podľa ID úlohy",
        },
      },
      get: {
        title: "Stav tvorby hudby",
        titleShort: "Stav hudby v1",
        description:
          "Vráti stav úlohy a adresu výslednej hudby. Overenie stavu je bezplatné a nezapočítava sa do ochrany proti zneužitiu.",
        success: {
          title: "Úloha na tvorbu hudby",
          description: "Aktuálny stav úlohy",
        },
      },
      content: {
        title: "Stiahnutie hudby",
        titleShort: "Hudobný súbor v1",
        description: "Hotový zvukový súbor z dokončenej hudobnej úlohy",
        success: {
          title: "Hudobný súbor",
          description: "Binárny obsah zvukového súboru",
        },
      },
    },
    file: {
      title: "Stiahnutie mediálneho súboru",
      titleShort: "Mediálny súbor v1",
      description:
        "Stiahni si súbor vytvorený požiadavkou na médiá. Podpísaný odkaz funguje bez kľúča 7 dní. S kľúčom API môžeš súbor stiahnuť aj neskôr.",
      success: { title: "Súbor", description: "Binárny obsah súboru" },
    },
    fields: {
      model: {
        label: "Model",
        imageDescription:
          "ID obrazového modelu z GET /v1/models (modalita: image)",
        speechDescription:
          "ID hlasu z GET /v1/models (modalita: speech), napríklad openai-nova. Môžeš použiť aj tts-1 a zadať hlas osobitne.",
        transcriptionDescription:
          "ID modelu na prepis z GET /v1/models (modalita: transcription). Podporuje sa aj whisper-1.",
        translationDescription:
          "Model Whisper od OpenAI: whisper-1 alebo openai-whisper",
        videoDescription:
          "ID modelu na tvorbu videa z GET /v1/models (modalita: video)",
        musicDescription:
          "ID modelu na tvorbu hudby z GET /v1/models (modalita: music)",
      },
      prompt: {
        label: "Zadanie",
        imageDescription: "Opíš obrázok. Najviac 2 000 znakov.",
        editDescription: "Čo chceš na obrázku zmeniť",
        transcriptionDescription:
          "Parameter sa prijíma pre kompatibilitu. Nie všetci poskytovatelia ho dostanú.",
        videoDescription: "Opíš dej klipu. Najviac 2 000 znakov.",
        musicDescription: "Štýl, nálada, nástroje a tempo",
      },
      n: {
        label: "Obrázky",
        description:
          "Počet obrázkov od 1 do 4. Každý obrázok sa účtuje osobitne.",
      },
      size: {
        label: "Rozmery",
        imageDescription:
          "Rozmery v tvare WIDTHxHEIGHT, napríklad 1024x1024 alebo 1536x1024, prípadne auto. Model použije najbližšiu podporovanú veľkosť a pomer strán.",
        videoDescription:
          "Rozmery v tvare WIDTHxHEIGHT, napríklad 1280x720. Určia pomer strán a pri modeloch s voľbou rozlíšenia aj rozlíšenie.",
      },
      aspectRatio: {
        label: "Pomer strán",
        imageDescription:
          "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 alebo 21:9. Má prednosť pred size.",
        videoDescription:
          "16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9 alebo 9:21. Má prednosť pred size.",
      },
      quality: {
        label: "Kvalita",
        description:
          "standard, hd, low, medium, high alebo auto. Hodnoty hd a high vyžiadajú vyššiu úroveň detailov, ak ju model ponúka.",
      },
      style: {
        label: "Štýl",
        description:
          "Parameter sa prijíma pre kompatibilitu. Štýl opíš priamo v zadaní.",
      },
      responseFormat: {
        label: "Formát odpovede",
        imageDescription:
          "url (predvolený formát, podpísaný odkaz platí 7 dní) alebo b64_json",
        speechDescription:
          "mp3 (predvolený formát), opus, aac, flac, wav alebo pcm. Dostupné formáty závisia od poskytovateľa hlasu.",
        transcriptionDescription:
          "json (predvolené), text, srt, verbose_json alebo vtt",
      },
      user: {
        label: "Používateľ",
        description:
          "ID koncového používateľa. Parameter sa prijíma pre kompatibilitu.",
      },
      image: {
        label: "Obrázok",
        description: "Obrázok na úpravu nahraný ako súbor vo formáte multipart",
      },
      imageUrl: {
        label: "URL obrázka",
        description:
          "Pre požiadavky JSON zadaj obrázok na úpravu ako adresu http(s) alebo adresu data: s obsahom base64.",
        videoDescription:
          "Prvá snímka videa z obrázka. Zadaj adresu http(s) alebo adresu data: s obsahom base64.",
      },
      mask: {
        label: "Maska",
        description:
          "Masky nie sú podporované. Požadovanú úpravu opíš v zadaní.",
      },
      input: {
        label: "Vstup",
        description: "Text na prečítanie, najviac 4 096 znakov",
      },
      voice: {
        label: "Hlas",
        description:
          "Pri názve modelu OpenAI (tts-1) vyber alloy, nova, onyx, echo, shimmer alebo fable. Môžeš zadať aj ľubovoľné ID hlasu z GET /v1/models.",
      },
      speed: {
        label: "Rýchlosť",
        description:
          "Od 0,25 do 4,0. Nastavenie používajú hlasy od OpenAI, NanoGPT a ElevenLabs.",
      },
      instructions: {
        label: "Pokyny",
        description:
          "Parameter sa prijíma pre kompatibilitu. Hlasy prečítajú vstupný text tak, ako je napísaný.",
      },
      file: {
        label: "Súbor",
        description:
          "Zvukový súbor vo formáte mp3, mp4, m4a, wav, webm, ogg alebo flac s veľkosťou do 25 MB",
      },
      language: {
        label: "Jazyk",
        description:
          "Kód hovoreného jazyka podľa ISO-639-1, napríklad en alebo de. Predvolene sa použije jazyk z adresy URL.",
      },
      temperature: {
        label: "Teplota",
        description: "Parameter sa prijíma pre kompatibilitu",
      },
      seconds: {
        label: "Sekundy",
        videoDescription:
          "Dĺžka klipu. Použije sa najbližšia dĺžka, ktorú model ponúka.",
        musicDescription:
          "Požadovaná dĺžka je približne 8, 20 alebo 30 sekúnd. Model ju môže zaokrúhliť.",
      },
      resolution: {
        label: "Rozlíšenie",
        description:
          "Napríklad 720p alebo 1080p, ak model umožňuje vybrať rozlíšenie",
      },
      negativePrompt: {
        label: "Čo má vo videu chýbať",
        description: "Čo má model z klipu vynechať, ak túto voľbu podporuje",
      },
      inputReference: {
        label: "Vstupný obrázok",
        description:
          "Prvá snímka videa z obrázka nahraná ako obrázkový súbor vo formáte multipart",
      },
      jobId: {
        label: "ID úlohy",
        description: "ID, ktoré vrátila požiadavka POST",
      },
      threadId: {
        label: "Priečinok",
        description: "Priečinok, v ktorom je súbor uložený",
      },
      filename: {
        label: "Názov súboru",
        description: "Názov uloženého súboru",
      },
      expires: {
        label: "Koniec platnosti",
        description: "Unixový čas, keď podpísaný odkaz prestane platiť",
      },
      sig: { label: "Podpis", description: "Podpis odkazu" },
    },
    response: {
      created: "Vytvorené",
      object: "Typ objektu",
      text: "Text",
      id: "ID úlohy",
      status: "Stav",
    },
    errors: {
      badSize:
        "Hodnota size '{{size}}' musí mať tvar WIDTHxHEIGHT (napríklad 1024x1024) alebo auto.",
      maskUnsupported:
        "Masky nie sú podporované. Požadovanú zmenu opíš v zadaní.",
      oneImageOnly:
        "Pri jednej úprave sa dá zmeniť jeden obrázok. Pošli iba jednu položku 'image'.",
      imageTooLarge: "Obrázok presahuje limit {{max}} MB.",
      imageRequired:
        "Pošli obrázok na úpravu v poli 'image' vo formáte multipart alebo cez 'image_url' v JSON.",
      modelCannotEdit:
        "Model {{model}} neprijíma obrázky na vstupe. V GET /v1/models vyber model na úpravu obrázkov, ktorý má v poli input_modalities hodnotu image.",
      storageFailed:
        "Súbor sa vygeneroval, ale nepodarilo sa ho uložiť. Skús to znova.",
      voiceNotFound:
        "Hlas '{{voice}}' nemáš k dispozícii. Zoznam hlasov získaš z GET /v1/models (modalita: speech). Môžeš použiť aj model tts-1 s hlasom nova.",
      formatUnsupported:
        "Hlas {{voice}} podporuje tieto formáty: {{supported}}. Jeden z nich zadaj ako response_format.",
      audioTooLarge: "Zvukový súbor presahuje limit 25 MB.",
      fileRequired: "Nahraj zvuk ako pole 'file' vo formáte multipart.",
      translationUnsupported:
        "Model {{model}} nepodporuje preklad. Preklad do angličtiny zabezpečuje whisper-1.",
      jobNotFound: "Úloha typu {{kind}} s ID '{{id}}' sa v tomto účte nenašla.",
      jobNotReady:
        "Úloha typu {{kind}} s ID '{{id}}' má stav {{status}}. Výsledok si môžeš stiahnuť, keď sa stav zmení na completed.",
      jobInterrupted:
        "Úloha sa zastavila pri reštarte servera. Žiadne kredity sa neodpočítali. Odošli ju znova.",
      jobNotCreated:
        "Úlohu sa nepodarilo uložiť. Žiadne kredity sa neodpočítali. Skús to znova.",
      mediaNotFound:
        "Súbor sa nenašiel alebo platnosť odkazu vypršala. Získaj nový odkaz z úlohy alebo pošli svoj kľúč API.",
      modelNoImageInput:
        "Model {{model}} nepodporuje obrázok ako prvú snímku. V GET /v1/models vyber model na tvorbu videa z obrázka alebo obrázok vynechaj.",
      modelNeedsImage:
        "Model {{model}} animuje obrázok. Pošli input_reference alebo image_url.",
      resolutionUnsupported:
        "Model {{model}} podporuje tieto rozlíšenia: {{supported}}. Jedno z nich zadaj v poli resolution.",
    },
  },

  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Neplatná požiadavka",
    },
    unauthorized: {
      title: "Vyžaduje sa overenie",
      description: "Vyžaduje sa platný kľúč API",
    },
    server: {
      title: "Chyba servera",
      description: "Interná chyba servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    network: { title: "Chyba siete", description: "Vyskytla sa chyba siete" },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Prístup zamietnutý",
    },
    notFound: { title: "Nenašlo sa", description: "Model sa nenašiel" },
    conflict: {
      title: "Konflikt údajov",
      description: "Požiadavka je v rozpore s aktuálnym stavom.",
    },
  },
};
