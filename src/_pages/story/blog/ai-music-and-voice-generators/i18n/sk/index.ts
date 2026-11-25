import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "AI na hudbu, hlas a prepis reči | {{appName}}",
    description:
      "Hudobné modely: {{musicCount}}. Hlasy na čítanie textu: {{voiceCount}}. Modely na prepis: {{sttCount}}. Alternatívy k Suno s cenami za klip či minútu a kreditmi zadarmo.",
    category: "Porovnanie modelov",
    imageAlt: "{{appName}}: porovnanie modelov AI na hudbu, hlas a prepis",
    keywords:
      "generátor hudby AI, alternatíva k Suno, tvorba piesní s AI, generátor beatov, Lyria 3, ElevenLabs Music, Sonauto, MusicGen, prevod textu na reč, generátor hlasu AI, bezplatné kredity na syntézu reči, hlasy na čítanie textu, alternatíva k ElevenLabs, Kokoro TTS, Gemini TTS, prevod reči na text, automatický prepis, Whisper, Whisper Large V3, Deepgram Nova-2, GPT-4o Mini Transcribe, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie modelov",
    readTime: "11 min čítania",
    title: "Skladby, rytmy, hlasy aj prepisy. Jeden účet.",
    subtitle:
      "Jeden zostatok na {{appName}} pre hudobné modely ({{musicCount}}), hlasy ({{voiceCount}}) a modely prepisu ({{sttCount}}). Porovnaj ceny za klip, minútu aj hodinu a vyber vhodný nástroj.",
  },
  intro: {
    lead: "Aplikácia na hudbu. Ďalšia na hlas. Tretia na prepis. Tri predplatné, tri prihlásenia a tri zostatky kreditov, ktoré vypršia. Pritom ti treba len zvučku, komentár a prepis.",
    p2: "Na {{appName}} máš k dispozícii {{modelCount}} zvukových modelov z {{labCount}} výskumných tímov. Všetky čerpajú z rovnakých kreditov. Dĺžky nahrávok, hlasy, kategórie aj ceny v tomto porovnaní sa načítavajú priamo z katalógu. Vyber si podľa toho, čo chceš vytvoriť.",
    songs:
      "Piesne so spevom: Sonauto, ElevenLabs Music a Lyria 3 Pro. Nahrávka môže mať až {{longestMusic}} sekúnd.",
    beats:
      "Beaty a inštrumentálna hudba: MusicGen Stereo, ModelsLab Music Gen a Lyria 3.",
    voiceovers:
      "Hovorený komentár a čítanie nahlas: na výber máš {{voiceCount}} hlasov. Minúta reči stojí od {{cheapVoiceMinute}} do {{priceyVoiceMinute}}.",
    transcription:
      "Prepis: {{sttCount}} modelov s cenou od {{cheapSttHour}} do {{priceySttHour}} za hodinu zvuku.",
  },
  tiers: {
    mainstream: "Bežné",
    open: "Otvorené",
    uncensored: "Bez cenzúry",
  },
  music: {
    title: "Generátory hudby AI: všetky modely ({{musicCount}})",
    intro:
      "Na začiatku sú modely s najlacnejšou nahrávkou. Ceny už zahŕňajú našu prirážku {{markup}} %. Hodnota jedného kreditu je {{creditValue}}.",
    colModel: "Model",
    colLength: "Dĺžka nahrávky",
    colTier: "Plán",
    colCredits: "Kredity za nahrávku",
    colPrice: "Cena za nahrávku",
    lengthChoice: "{{lengths}} s",
    lengthFixed: "{{seconds}} s",
    footnote:
      "Cena jednej nahrávky je rovnaká pri každej podporovanej dĺžke. Ak zadáš inú dĺžku, použije sa najbližšia dostupná.",
    factLine: "Za nahrávku: {{credits}} kred. ({{price}}) · Dĺžka: {{length}}",
    picks: {
      songs: {
        title: "Piesne so spevom",
        body: "Chceš hlas aj chytľavý refrén? Opíš žáner, náladu, hlas speváka a tému. Tieto modely vedia k hudbe vytvoriť aj spev.",
      },
      beats: {
        title: "Beaty a inštrumentálna hudba",
        body: "Hudobný podklad, slučka do videa alebo beat na rapovanie. Bez spevu. Zadaj žáner, tempo a nástroje, napríklad „lo-fi hip-hop, 85 BPM, zastreté klavírne tóny a praskanie platne“.",
      },
      short: {
        title: "Krátke motívy, predely a zvučky",
        body: "Úvod podcastu, upozornenie či hudobný predel. Krátke nahrávky vyjdú lacno, takže si môžeš vytvoriť desať verzií a vybrať jednu.",
      },
    },
    suno: "Hľadáš alternatívu k Suno? Suno ani Udio na {{appName}} nenájdeš. Máš tu však {{musicCount}} hudobných modelov za spoločné kredity. Nahrávka stojí od {{cheapMusicPrice}} a ďalšie predplatné nepotrebuješ. Najdlhšia môže mať {{longestMusic}} sekúnd. Na celé trojminútové skladby sa zatiaľ viac hodia špecializované hudobné aplikácie.",
    toolLink: "Otvoriť generátor hudby",
  },
  voices: {
    title: "Prevod textu na reč: porovnanie hlasov ({{voiceCount}})",
    intro:
      "Hlasy sú zoradené od najlacnejšieho. Platíš za počet znakov v texte. V poslednom stĺpci je odhad ceny za minútu reči pri približne {{charsPerMinute}} znakoch za minútu.",
    colVoice: "Hlas",
    colCharacter: "Charakter hlasu",
    colTier: "Plán",
    colCredits: "Kredity za 1 000 znakov",
    colMinute: "Približne za minútu reči",
    gender: {
      male: "Mužský",
      female: "Ženský",
      neutral: "Neutrálny",
    },
    style: {
      conversational: "hovorový",
      warm: "vrelý",
      deep: "hlboký",
      expressive: "výrazný",
      calm: "pokojný",
      friendly: "priateľský",
      authoritative: "autoritatívny",
      clear: "zreteľný",
      soft: "jemný",
      steady: "vyrovnaný",
      confident: "sebavedomý",
      british: "britský",
      lively: "živý",
      bright: "jasný",
      upbeat: "veselý",
    },
    footnote:
      "Sadzby už zahŕňajú našu prirážku {{markup}} %. Cena za minútu je odhad. Závisí od tempa aj dĺžky slov. Účtuje sa počet znakov, ktoré odošleš.",
    factLine:
      "Za 1 000 znakov: {{credits}} kred. · Približne {{minute}} za minútu · {{character}}",
    picks: {
      everyday: {
        title: "Na každodenné čítanie nahlas",
        body: "Zrozumiteľné a lacné hlasy, s ktorými môže čítanie zostať zapnuté. Odpovede predvolene číta hlas {{defaultVoice}}.",
      },
      natural: {
        title: "Najprirodzenejšie hlasy pre nahrávky na zverejnenie",
        body: "Vedia vyjadriť emócie a prirodzene meniť tempo. Hodia sa na komentár k videu, reklamu alebo ukážku audioknihy. Patria k najdrahším, preto si text dokonči ešte pred nahrávaním.",
      },
      multilingual: {
        title: "Jeden hlas vo viacerých jazykoch",
        body: "Hlasy Gemini hovoria vyše 100 jazykmi. Môžeš im zadať aj spôsob prednesu: pomalšie, šeptom či s nadšením.",
      },
      expressive: {
        title: "Postavy a rozprávanie príbehov",
        body: "Väčší rozsah aj dramatickejší prejav. Pre fikciu, herné postavy a hranie rolí.",
      },
      budget: {
        title: "Najlacnejšie hlasy bez obsahového filtra",
        body: "Kokoro je model s otvorenými váhami a 82 miliónmi parametrov. V necenzurovanej kategórii má {{uncensoredVoiceCount}} hlasov. Text, ktorý čítajú, neprechádza obsahovým filtrom. Zároveň sú to najlacnejšie hlasy na platforme.",
      },
    },
    languages:
      "Všetky tieto hlasy sú vyladené pre angličtinu. Gemini zvláda vyše 100 jazykov. Ostatné hlasy vedia čítať aj v iných jazykoch, často však s prízvukom. Najprv vyskúšaj jednu vetu a až potom celý scenár.",
    toolLink: "Otvoriť prevod textu na reč",
  },
  stt: {
    title:
      "Prepis zvuku: porovnanie {{sttCount}} modelov na prevod reči na text",
    intro:
      "Najprv vidíš najnižšiu cenu za minútu. Účtuje sa každá sekunda zvuku. Ceny už zahŕňajú našu prirážku {{markup}} %.",
    colModel: "Model",
    colTier: "Plán",
    colCredits: "Kredity za minútu",
    colHour: "Cena za hodinu",
    footnote:
      "Keď poskytovateľ po dokončení oznámi skutočnú cenu, pripočítame k nej prirážku. Výsledná suma sa tak môže mierne líšiť od tabuľky.",
    factLine: "Za minútu: {{credits}} kred. · Za hodinu: {{hour}}",
    picks: {
      cheapest: {
        title: "Najnižšia cena: hodiny zvuku za pár centov",
        body: "Whisper s otvorenými váhami podporuje 99 jazykov. Pri tejto sadzbe jedno predplatné vystačí asi na {{subSttHours}} hodín zvuku.",
      },
      accuracy: {
        title: "Keď rozhoduje presnosť",
        body: "Menej chybne rozpoznaných slov a presnejšie určenie jazyka. Vhodné na rozhovory, citácie a texty na zverejnenie. Pri hlasovom vstupe sa predvolene používa {{defaultStt}}.",
      },
      languages: {
        title: "Podpora mnohých jazykov",
        body: "Whisper podporuje 99 jazykov, Nemotron 40 jazykových nastavení. Voxtral od Mistralu prepisuje nahrávky s dĺžkou do 10 minút.",
      },
      fast: {
        title: "Rýchly prepis aj v hluku",
        body: "Krátka odozva a dobré výsledky aj v hlučnej miestnosti. Vhodné na hlasové poznámky a diktovanie.",
      },
    },
    toolLink: "Otvoriť prevod reči na text",
  },
  chat: {
    title: "Ako to funguje v čete",
    intro:
      "Hudbu, hlas aj prepis nájdeš priamo v každom čete na {{appName}}. Ďalšiu aplikáciu nepotrebuješ.",
    steps: {
      song: {
        title: "Vypýtaj si skladbu",
        body: "Napíš napríklad „vytvor tridsaťsekundovú synthwave zvučku pre môj podcast“. AI použije hudobný model nastavený pre danú zručnosť. Predvolene je to {{defaultMusic}}. Ak chceš iný, uveď jeho názov v zadaní.",
      },
      voice: {
        title: "Nechaj si prečítať odpoveď",
        body: "Ťukni na ikonu reproduktora pri odpovedi. Prečíta ju hlas nastavený pre danú zručnosť, predvolene {{defaultVoice}}. Každej zručnosti môžeš vybrať iný hlas.",
      },
      dictate: {
        title: "Nadiktuj správu",
        body: "Ťukni na mikrofón a hovor. Tvoje slová prepíše do poľa správy model {{defaultStt}}, prípadne sa nahrávka odošle priamo modelu, ktorý rozumie zvuku.",
      },
      transcribe: {
        title: "Prepíš celé súbory",
        body: "Schôdze, rozhovory, hlasové poznámky. Na stránke prevodu reči na text vyber model a pridaj najviac {{sttMaxFiles}} súborov.",
      },
      call: {
        title: "Hlasový hovor",
        body: "Ruky máš voľné. Ty hovoríš, AI odpovedá nahlas a rozhovor pokračuje. Hlasový vstup aj výstup sa hradia z rovnakých kreditov.",
      },
    },
    toolPages:
      "Ak chceš nastaviť každý detail, otvor stránku príslušného nástroja. Vyber model alebo hlas, nastav dĺžku nahrávky či vlož dlhší scenár.",
  },
  pricing: {
    title: "Koľko stojí hudba a hlas generovaný AI",
    intro:
      "Tri spôsoby účtovania, spoločný kreditný zostatok. K cene poskytovateľa sa pripočíta naša prirážka {{markup}} %. Jeden kredit má hodnotu {{creditValue}}.",
    music:
      "Hudba má pevnú cenu za nahrávku. Pri {{cheapMusicName}} vyjde na {{cheapMusicCredits}} kred. ({{cheapMusicPrice}}), pri {{priceyMusicName}} na {{priceyMusicCredits}} kred. ({{priceyMusicPrice}}).",
    voice:
      "Pri hlase sa platí za znaky. Za 1 000 znakov je to od {{cheapVoiceCredits}} kred. pri {{cheapVoiceName}} po {{priceyVoiceCredits}} pri {{priceyVoiceName}}.",
    stt: "Prepis sa účtuje po sekundách. Minúta zvuku vyjde na {{cheapSttCredits}} kred. pri {{cheapSttName}} až {{priceySttCredits}} pri {{priceySttName}}.",
    failed:
      "Kredity odpočítame až po doručení výsledku. Za chybu, vypršanie času ani odmietnuté zadanie neplatíš.",
    free: "Mesačne máš zdarma {{guestCredits}} kred. bez účtu, {{freeCredits}} s bezplatným účtom a {{maxCredits}} pri odbere noviniek. Pri {{cheapMusicName}} vystačí {{freeCredits}} kred. na {{freeClips}} nahrávok alebo pri hlase {{cheapVoiceName}} približne na {{freeVoiceMinutes}} minút reči.",
    sub: "Mesačné predplatné má štyri úrovne. Najnižšia zahŕňa {{subCredits}} kred. za {{subPrice}}.",
    pack: "Balíky pre predplatiteľov: {{packCredits}} kred. za {{packPrice}}. Kredity nevypršia. Zaplatíš kartou, cez PayPal alebo kryptomenou.",
    link: "Pozrieť si plány a balíky kreditov",
  },
  limits: {
    title: "Limity bez prikrášlenia",
    intro: "Čo je dobré vedieť pred vytvorením prvej nahrávky",
    musicLength:
      "Hudobná nahrávka môže mať najviac {{longestMusic}} sekúnd. Trojminútovú skladbu tu nevytvoríš a hotový úsek sa nedá predĺžiť.",
    musicFlat:
      "Pri každej dĺžke stojí nahrávka rovnako. Krátka ukážka je lacný spôsob, ako si vyskúšať zadanie. Zľavu za kratšiu stopáž nedostaneš.",
    noSuno: "Suno a Udio tu nie sú. Ich API na {{appName}} nie sú dostupné.",
    ttsLength:
      "Pri prevode textu na reč môže mať jedna požiadavka najviac {{ttsMaxChars}} znakov. Dlhší scenár rozdeľ na časti.",
    sttFiles:
      "Na prepis môžeš naraz odoslať najviac {{sttMaxFiles}} súborov. Každý môže mať do {{sttMaxMb}} MB.",
    noCloning:
      "Vlastný hlas sa nedá nahrať ani naklonovať. Vyber si z hlasov v tabuľke.",
    filters:
      "Väčšina hudobných a hlasových modelov podlieha filtrom poskytovateľa. Ak poskytovateľ zadanie odmietne, nič neplatíš.",
    callout:
      "Pred zverejnením si over podmienky komerčného použitia hudby a hlasov u poskytovateľa. Každý tím má iné pravidlá a tie sa môžu meniť.",
  },
  faq: {
    title: "Časté otázky",
    bestMusic: {
      q: "Ktorý generátor hudby AI je najlepší?",
      a: "Záleží na skladbe. Na piesne so spevom skús Sonauto či ElevenLabs Music. Na krátke prepracované skladby Lyria 3 Pro, na beaty a slučky MusicGen Stereo. Najlacnejší je {{cheapMusicName}} za {{cheapMusicPrice}} za nahrávku. Všetkých {{musicCount}} modelov na {{appName}} používa rovnaké kredity, takže pri ďalšej nahrávke môžeš model zmeniť.",
    },
    suno: {
      q: "Čím sa dá nahradiť Suno?",
      a: "Na krátke piesne a beaty môžeš použiť Sonauto, ElevenLabs Music alebo Lyria 3 od Googlu. Začínajú na {{cheapMusicPrice}} za nahrávku a ďalšie predplatné nepotrebuješ. Pre celé trojminútové piesne to zatiaľ náhrada nie je: nahrávky majú najviac {{longestMusic}} sekúnd.",
    },
    vocals: {
      q: "Vie AI vytvoriť pieseň aj so spevom?",
      a: "Áno. Modelom Sonauto, ElevenLabs Music alebo Lyria 3 Pro opíš tému, náladu a hlas speváka. Inštrumentálne modely ako MusicGen Stereo vytvárajú hudbu bez spevu.",
    },
    bestVoice: {
      q: "Ktorý generátor hlasu znie najprirodzenejšie?",
      a: "Na bežné čítanie znejú hlasy OpenAI ako {{defaultVoice}} zreteľne a stoja málo. Výrazný prednes ponúkajú xAI Eve a Inworld. Na viac jazykov poslúži Gemini. Pre najnižšiu cenu a čítanie bez filtra si vyber Kokoro.",
    },
    free: {
      q: "Ktorý generátor hlasu ponúka bezplatné kredity?",
      a: "Mesačne máš zdarma {{guestCredits}} kred. bez registrácie, {{freeCredits}} s bezplatným účtom a {{maxCredits}} pri odbere noviniek. Pri {{cheapVoiceName}} je to približne {{freeVoiceMinutes}} minút reči. Z rovnakých kreditov môžeš zaplatiť aj hudbu a prepis.",
    },
    transcribeCost: {
      q: "Koľko stojí automatický prepis?",
      a: "Hodina zvuku stojí od {{cheapSttHour}} pri {{cheapSttName}} po {{priceySttHour}} pri {{priceySttName}}. Účtuje sa po sekundách. Za neúspešný prepis neplatíš.",
    },
    cloning: {
      q: "Môžem si naklonovať vlastný hlas?",
      a: "Nie. Na {{appName}} máš výber z {{voiceCount}} hotových hlasov. Nahrávanie vlastného hlasu ani jeho klonovanie nepodporujeme.",
    },
    uncensored: {
      q: "Dá sa text prečítať nahlas aj bez cenzúry?",
      a: "Áno. V necenzurovanej kategórii máme {{uncensoredVoiceCount}} hlasov Kokoro. Tento model s otvorenými váhami nefiltruje obsah textu, ktorý číta. Pri väčšine hudobných modelov a ostatných hlasov platia filtre poskytovateľa.",
    },
    modelsLink: "Pozrieť všetky modely s parametrami a cenami",
    videoLink: "Potrebuješ aj video? Porovnaj generátory videa s AI",
    pricingLink: "Pozrieť si plány a ceny",
  },
  partners: {
    body: "Tvoríš hudbu, podcasty alebo hovorené komentáre? V partnerskom programe {{appName}} získaš opakovanú províziu z každej platby ľudí, ktorých odporučíš.",
    link: "Zapojiť sa do partnerského programu",
  },
  cta: {
    title: "Vyber model a stlač prehrávanie.",
    subtitle:
      "Piesne, beaty, hlasy aj prepisy z rovnakých kreditov. Začni s {{guestCredits}} bezplatnými kreditmi aj bez účtu.",
    music: "Vytvoriť hudbu",
    voice: "Vytvoriť hlasovú nahrávku",
    transcribe: "Prepísať zvuk",
    models: "Prehľad všetkých modelov",
  },
};
