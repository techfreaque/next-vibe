import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Tvorba pomocou AI",
    imageAlt: "{{appName}} {{title}}",
  },
  studio: "Media Studio",
  navName: "Štúdio",
  hub: {
    metaTitle: "AI Media Studio: obrázky, video, hudba a hlas",
    metaDescription:
      "Vytváraj obrázky, videá, hudbu aj hovorené slovo alebo prepíš zvuk na text. Vyber si bežný či necenzurovaný model. Platíš za výsledok.",
    keywords:
      "multimediálne štúdio AI, necenzurovaný generátor obrázkov, generovanie videa pomocou AI, tvorba hudby s AI, prevod textu na reč, prepis reči",
    title: "Media Studio",
    subtitle:
      "Päť nástrojov a všetky hlavné modely vrátane necenzurovaných. Platíš za výsledok. Všetko, čo vytvoríš, ti zostane.",
    from: "Od {{price}}",
    free: "Zadarmo",
    models: "Počet modelov: {{count}}",
    voices: "Počet hlasov: {{count}}",
    open: "Otvoriť",
  },
  asyncProgress:
    "Spracúva sa. Video a hudba zvyčajne trvajú jednu až tri minúty. Priebeh uvidíš aj v histórii.",
  ooc: {
    title: "Nedostatok bezplatných kreditov",
    need: "Kredity potrebné na túto úlohu: {{amount}}.",
    description:
      "Mesačné kredity s bezplatným účtom: {{signedIn}}, s odberom noviniek {{max}}. Po registrácii sa vrátiš sem s rovnakými nastaveniami.",
    signUp: "Vytvoriť bezplatný účet",
    defaults: "Vyskúšať lacnejšie nastavenia",
    haveAccount: "Máš už účet?",
    logIn: "Prihlásiť sa",
  },
  moreOptions: "Ďalšie možnosti",
  modelDefault: "Automaticky",
  model: "Model",
  voice: "Hlas",
  estimate: "Odhadovaná cena",
  credits: "Kredity: {{amount}}",
  failed: "Generovanie zlyhalo",
  historyError: "Históriu štúdia sa nepodarilo otvoriť. Skús to znova.",
  unavailable:
    "Pre tento druh tvorby momentálne nie je k dispozícii žiadny model.",
  file: "Zvukový súbor",
  language: "Jazyk nahrávky",
  referenceAudio: "URL referenčnej nahrávky",
  durationSeconds: "Dĺžka nahrávky v sekundách",
  duration: "Trvanie",
  ratio: "Pomer strán",
  size: "Veľkosť",
  quality: "Kvalita",
  reference: "URL referenčného obrázka",
  lastFrame: "URL poslednej snímky",
  creating: "Generuje sa · {{seconds}} s",
  submitImage: "Vytvoriť obrázok",
  submitVideo: "Vytvoriť video",
  submitMusic: "Vytvoriť hudbu",
  submitSpeech: "Vytvoriť hlasovú nahrávku",
  submitTranscribe: "Prepísať nahrávku",
  meteredCost: "Konečná cena vychádza zo spotreby, ktorú vykáže poskytovateľ.",
  estimatePending: "Pridaj nahrávku a zobrazí sa odhad ceny.",
  needsCredits: "Potrebné kredity: {{amount}}",
  units: {
    image: "Kredity za obrázok: {{amount}}",
    video: "Kredity za sekundu: {{amount}}",
    music: "Kredity za skladbu: {{amount}}",
    speech: "Kredity za 1 000 znakov: {{amount}}",
    transcribe: "Kredity za minútu: {{amount}}",
    tokenImage: "Odhad kreditov za obrázok: {{amount}}",
  },
  kinds: {
    image: {
      label: "Obrázok",
      tab: "Obrázok",
      pitch:
        "Vytvor obrázok podľa zadania alebo uprav predlohu. Fotorealizmus, anime či umelecká ilustrácia podľa tvojho opisu.",
      title: "Vytvoriť obrázok",
      metaTitle: "Necenzurovaný generátor obrázkov AI | {{appName}}",
      metaDescription:
        "Vytváraj obrázky podľa opisu alebo upravuj fotografie. Vyber si bežný či necenzurovaný model a štýl od fotorealizmu po anime. Platíš za výsledok.",
      description: "Opíš scénu a vyber si kompozíciu.",
      keywords:
        "necenzurovaný generátor obrázkov AI, umenie s AI, obrázok z textu",
    },
    video: {
      label: "Video",
      tab: "Video",
      pitch:
        "Vytvor klip zo zadania alebo z úvodnej snímky. Zvoľ si dĺžku, pomer strán a rozlíšenie.",
      title: "Vytvoriť video",
      metaTitle: "Generátor videa s AI | {{appName}}",
      metaDescription:
        "Vytvor video zo zadania alebo z úvodnej snímky. Vyber si z popredných modelov, nastav dĺžku, pomer strán a rozlíšenie. Platíš za výsledok.",
      description: "Rozhýb scénu od prvej snímky až po poslednú.",
      keywords: "generátor videa s AI, video z textu, video z obrázka",
    },
    music: {
      label: "Hudba",
      tab: "Hudba",
      pitch:
        "Z opisu vznikne celá skladba. Urči náladu, žáner, nástroje aj dĺžku.",
      title: "Vytvoriť hudbu",
      metaTitle: "Generátor hudby s AI | {{appName}}",
      metaDescription:
        "Vytvor celú skladbu podľa nálady, žánru, nástrojov a dĺžky. V jednom štúdiu máš na výber viacero hudobných modelov. Platíš za výsledok.",
      description: "Opíš náladu, nástroje a dĺžku skladby.",
      keywords: "generátor hudby s AI, hudba z textu, skladba vytvorená AI",
    },
    speech: {
      label: "Hlas",
      tab: "Hlas",
      pitch: "Tvoj text prečítajú prirodzene znejúce hlasy v mnohých jazykoch.",
      title: "Prečítať text nahlas",
      metaTitle: "Prevod textu na reč pomocou AI | {{appName}}",
      metaDescription:
        "Vlož text, vyber si hlas a stiahni si nahrávku. Prirodzene znejúce hlasy vo viacerých jazykoch ponúka niekoľko poskytovateľov. Platíš za výsledok.",
      description: "Vyber si hlas, ktorý prečíta tvoj text.",
      keywords: "prevod textu na reč, hlas AI, TTS",
    },
    transcribe: {
      label: "Prepis",
      tab: "Prepis",
      pitch:
        "Nahraj zvuk a získaj prehľadný prepis. Môžeš si ho stiahnuť ako súbor.",
      title: "Prepísať nahrávku",
      metaTitle: "Prepis reči pomocou AI | {{appName}}",
      metaDescription:
        "Nahraj zvukový súbor a stiahni si hotový prepis. K dispozícii máš presné modely na rozpoznávanie reči v mnohých jazykoch. Platíš za výsledok.",
      description: "Premeň nahrávku na prepis a stiahni si ho.",
      keywords:
        "prepis reči, automatický prepis pomocou AI, prevod zvuku na text",
    },
  },
};
