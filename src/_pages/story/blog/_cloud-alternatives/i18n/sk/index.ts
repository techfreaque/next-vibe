import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  rules: {
    checked:
      "Prečítané v oficiálnej dokumentácii a pravidlách každého poskytovateľa dňa {{date}}. Na mobile tabuľku posúvaj do strany.",
    columns: {
      name: "Služba",
      defaults: "Filter predvolene",
      off: "Vypnutie",
      models: "Modely bez cenzúry",
      weights: "Vlastné váhy",
      rules: "Pravidlá obsahu, ktoré ostávajú",
    },
    rows: {
      azure: {
        defaults: "Zapnutý pre každý model okrem Whisper.",
        off: "Len so schválením. Zákazníci si ho môžu sami uvoľniť na High only. Plná kontrola vyžaduje žiadosť, otvorenú len zákazníkom spravovaným tímom účtu Microsoft alebo v oprávnenom programe.",
        models: "V katalógu sme žiadny nenašli.",
        weights: "Pre tohto sprievodcu sme nekontrolovali.",
        rules:
          "Code of Conduct zakazuje sexuálne explicitný obsah a erotických či romantických chatbotov, s filtrom aj bez neho.",
      },
      bedrock: {
        defaults:
          "Žiadny filter Bedrock, kým nepripojíš Guardrail. Detekcia CSAM beží vždy.",
        off: "Vynechaj ID guardrailu. Odmietnutia samotného modelu ostávajú.",
        models: "V katalógu žiadne.",
        weights:
          "Custom Model Import: architektúry Llama, Mistral, Qwen a gpt-oss, účtované za minútu Custom Model Unit.",
        rules:
          "Responsible AI Policy zakazuje obchádzať bezpečnostné filtre a sexuálne zobrazenia bez súhlasu.",
      },
      vertex: {
        defaults:
          "Predvolene vypnutý od gemini-3.5-flash. Základné škody ostávajú blokované.",
        off: "Nastav prahy na OFF. Naučené odmietnutia Gemini ostávajú.",
        models: "V zozname otvorených modelov žiadne.",
        weights: "Model Garden self-deploy na kontajneroch vLLM alebo TGI.",
        rules:
          "Prohibited Use Policy zakazuje sexuálne explicitný obsah a obchádzanie bezpečnostných filtrov.",
      },
      together: {
        defaults:
          "Na stránkach, ktoré sme čítali, nie je zdokumentovaný žiadny prepínač filtra.",
        off: "Netýka sa.",
        models: "V zozname serverless žiadne.",
        weights:
          "Dedikované koncové body od $5.49 za hodinu H100. Nahrávať sa dajú len fine-tuny podporovanej architektúry.",
        rules: "Podmienky zakazujú obscénny obsah a pornografiu.",
      },
      us: {
        defaults:
          "Model si vyberáš ty: bežný, otvorený alebo bez cenzúry. Žiadna vrstva filtra navrchu.",
        off: "Vyber model bez cenzúry a raz potvrď, že máš 18+ rokov.",
        models: "{{uncensored}} práve beží.",
        weights: "Nepodporované. Ponúkame kurátorský katalóg.",
        rules:
          "Modely bez cenzúry sa odomknú po jednorazovom súhlase 18+. Podmienky poskytovateľa modelu stále platia.",
      },
    },
    sourceLabels: {
      filters: "{{name}}: dokumentácia filtrov",
      access: "{{name}}: pravidlá prístupu",
      policy: "{{name}}: zásady používania",
      privacy: "{{name}}: spracovanie údajov",
      pricing: "{{name}}: cenník",
      import: "{{name}}: vlastné váhy",
    },
    sourcesTitle: "Zdroje",
  },
  prices: {
    columns: {
      model: "Model",
      provider: "Poskytovateľ",
      input: "Vstup / 1M",
      output: "Výstup / 1M",
    },
    us: "{{appName}}",
    live: "cena naživo",
    source: "zdroj",
    note: "USD za 1M tokenov. Ceny konkurencie prečítané {{date}} z ich verejných zoznamov modelov. Naše čítame naživo z vlastného registra vrátane našej marže {{markup}}%. Ak je nastavená lacnejšia trasa, používame ju a zobrazená cena ju sleduje.",
  },
  alts: {
    heading: "{{number}}. {{name}}",
    strength: "Najlepšie:",
    catch: "Háčik:",
    sources: "Zdroje:",
    versusLink: "{{appName}} vs {{name}}: úplné porovnanie",
    openRouter: {
      what: "Brána s 477 modelmi pod jedným kľúčom. Bez prirážky na inferenciu, poplatok 5.5% pri nákupe kreditov (5% pri kryptu).",
      strength:
        "Vlastné kľúče poskytovateľov zadarmo do $25,000 mesačne, smerovanie s nulovým uchovávaním údajov na každú požiadavku, platby v USDC.",
      catch:
        "17 modelov vyladených na hranie rolí alebo bez cenzúry, ani jedno ID s abliterated či uncensored v názve. V prehľade API chýba koncový bod Anthropic Messages.",
    },
    venice: {
      what: "Aplikácia na četovanie a API kompatibilné s OpenAI. Vlastné fine-tuny Venice Uncensored 1.2 ($0.20 / $0.90) a Venice Role Play Uncensored popri abliterovaných modeloch GLM, DeepSeek, Gemma a Qwen.",
      strength:
        "Obraz, video, hlas a hudba v tom istom API. Šifrované modely a možnosti TEE. Platba za požiadavku z peňaženky USDC cez x402, bez účtu.",
      catch:
        "Žiadny natívny koncový bod Anthropic Messages, Claude Code potrebuje lokálny proxy. Podmienky zakazujú ďalší predaj prístupu. Bezplatná úroveň je 10 textových zadaní denne.",
    },
    nanoGpt: {
      what: "Brána s platbou za použitie a 610 modelmi, z toho asi 54 abliterovaných alebo bez cenzúry.",
      strength:
        "OpenAI chat completions, Responses a Anthropic Messages. Bitcoin a Monero, bez účtu, ďalší predaj v režime pay-as-you-go povolený.",
      catch:
        "Neprehľadný katalóg s veľa takmer rovnakými ID bez cenzúry. Produkt je postavený predovšetkým ako brána.",
    },
    openUncensored: {
      what: "Smerovač API pre abliterované váhy: 58 textových, 20 obrazových a 3 video modely na vopred zaplatenom kľúči. Tvoj kľúč je tvoj účet.",
      strength:
        "Žiadna provízia z cien poskytovateľov. GLM 5.3 Flash Uncensored od $0.12 / $0.50. Formáty OpenAI, Responses a Anthropic pod jednou základnou adresou.",
      catch:
        "Žiadna bezplatná úroveň, kryptomeny sa nespomínajú, metadáta požiadaviek sa uchovávajú až dva roky. Žiadny webový čet, len desktopová aplikácia.",
    },
    refuseless: {
      what: "Hosting len cez API pre otvorené váhy bez odmietania: štyri abliterované modely s kontextom 1M a zopár bežných.",
      strength:
        "DeepSeek V4.1 Flash abliterated za $0.12 / $0.45 a GLM 5.3 Flash abliterated za $0.12 / $0.50. Chat completions, Responses, Anthropic Messages a embeddingy.",
      catch:
        "Žiadne chatové rozhranie. Stránky so zásadami ochrany súkromia a podmienkami zablokovali náš čítací nástroj, takže si ich pred nasadením prečítaj sám.",
    },
    abliterationHosts: {
      what: "Dve ďalšie API s abliterovanými modelmi. NEAR AI Cloud spúšťa modely v hardvérových enklávach: Qwen 3.8 27B Abliterated za $0.04 / $1.35. abliteration.ai predáva vlastné abliterované značky od $1 / $2.",
      strength:
        "NEAR: bez žiadosti, bez overovania identity, overiteľná atestácia. abliteration.ai: zadania sa spracúvajú v pamäti a predvolene sa neukladajú, región EÚ, formáty OpenAI a Anthropic.",
      catch:
        "Malé katalógy. NEAR formát Anthropic nespomína. abliteration.ai stojí za podobné váhy viac než Refuseless či NEAR.",
    },
    togetherFireworks: {
      what: "Rýchle inferenčné cloudy pre bežné otvorené modely. Together ponúka 24 serverless modelov na četovanie, žiadny bez cenzúry. Fireworks uvádza modely Dolphin, Hermes a Dobby Unhinged, stav serverless nie je potvrdený.",
      strength:
        "Together: OpenAI, Responses a Anthropic Messages, nulové uchovávanie údajov na vlastnú žiadosť. Fireworks: pri otvorených modeloch predvolene žiadne logy zadaní, až 6,000 požiadaviek za minútu.",
      catch:
        "Podmienky Together zakazujú obscénny obsah a pornografiu. Fireworks vyžaduje záruku, že tvoj vstup neobsahuje nahotu ani sexuálne podnetný obsah.",
    },
    selfHost: {
      what: "Abliterované váhy si spusti sám. Ollama a LM Studio na pracovnej stanici, vLLM alebo TGI na vlastných GPU. Všetky hovoria formátom OpenAI chat completions.",
      strength:
        "Zadania nikdy neopustia tvoje stroje. Ľubovoľný abliterovaný model GGUF alebo safetensors, ktorý si vieš stiahnuť. Lokálne použitie nestojí nič okrem hardvéru.",
      catch:
        "GPU, aktualizácie a dostupnosť máš na starosti ty. Modely veľkosti frontier potrebujú hardvér z dátového centra.",
    },
  },
};
