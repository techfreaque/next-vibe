import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "AI generátory videa: Kling, Seedance, Veo | {{appName}}",
    description:
      "Porovnanie generátorov videa ({{modelCount}}): Kling, Seedance, Veo 3.1, Sora 2, Wan 3.0 a Hailuo. Video z textu aj obrázka, ceny a výstup bez nášho vodoznaku.",
    category: "Porovnanie modelov",
    imageAlt: "{{appName}}: porovnanie generátorov videa s AI",
    keywords:
      "najlepší AI generátor videa, generovanie videa s AI, Kling a Seedance, Seedance 2.0, Seedance 2.5, Kling 3.0, Veo 3.1 a Sora 2, Veo 3.1, Sora 2, Wan 3.0, Hailuo 3, Grok Imagine video, Gemini Omni, Runway Gen-4.5, video z obrázka, video z textu, AI video bez vodoznaku, cena generovania videa za sekundu, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Porovnanie modelov",
    readTime: "10 min čítania",
    title: "Porovnanie generátorov videa AI ({{modelCount}}). Jeden zostatok.",
    subtitle:
      "Kling, Seedance, Veo, Sora, Wan, Hailuo, Grok Imagine aj Gemini Omni. Porovnaj cenu za sekundu, dĺžku klipu, nastavenia snímok aj zvuk. Vyber model na svoj záber a vytvor ho v čete na {{appName}}.",
  },
  intro: {
    lead: "Každé laboratórium označuje svoj model za najlepší generátor videa s AI. Každé chce vlastnú aplikáciu, vlastné kredity a vlastné predplatné. Ty chceš vhodný klip a cenu, ktorú uvidíš ešte pred spustením.",
    p2: "Na {{appName}} máš na výber {{modelCount}} modelov na video od {{labCount}} výskumných tímov. Veo, Sora, Kling, Seedance, Wan, Hailuo, Grok Imagine, Gemini Omni, Runway aj ostatné čerpajú z rovnakých kreditov. Údaje v tabuľke pochádzajú priamo z živého katalógu: vstupy, prvá a posledná snímka, dĺžka, rozlíšenie, zvuk aj cena za sekundu. Ďalej nájdeš porovnania pre konkrétne zábery, návod na tvorbu videa v čete aj obmedzenia, ktoré sa na úvodné stránky zvyčajne nezmestia.",
  },
  table: {
    title: "Porovnanie všetkých {{modelCount}} modelov na video",
    intro:
      "Zahrnuté sú všetky aktuálne modely od {{labCount}} tímov. Najlacnejšia sekunda videa je na začiatku tabuľky. Ceny zahŕňajú našu prirážku {{markup}} %. Jeden kredit má hodnotu {{creditValue}}.",
    colModel: "Model",
    colInput: "Vstup",
    colFrames: "Snímky",
    colLength: "Dĺžka",
    colResolution: "Rozlíšenie",
    colAudio: "Zvuk",
    colRate: "Kredity za sekundu",
    colClip: "Video v čete",
    i2v: "Text alebo obrázok",
    t2v: "Text",
    v2v: "Text a video",
    videoAudio: "Video a zvuk",
    framesFirst: "Prvá snímka",
    framesFirstLast: "Prvá a posledná snímka",
    framesNone: "Bez možnosti určiť snímky",
    secondsFixed: "{{max}} s",
    seconds: "{{min}} až {{max}} s",
    resolutionDefault: "Podľa poskytovateľa",
    audioYes: "Vlastný zvuk modelu",
    audioNo: "Bez zvuku",
    withImage: "S obrázkom: {{credits}}",
    clipValue: "{{credits}} kred. za {{seconds}} s",
    footnote:
      "Sadzba za sekundu platí pre predvolené rozlíšenie. Ak rozlíšenie mení cenu, ďalší riadok uvádza sadzby jednotlivo. „S obrázkom“ označuje sadzbu, ktorá sa použije, keď príloha presmeruje požiadavku na obrazový vstup modelu. Cena videa v čete zodpovedá jednej požiadavke na {{seconds}} sekúnd, upravenej na najbližšiu podporovanú dĺžku.",
    allModels: "Pozrieť všetky modely a ich parametre",
  },
  picks: {
    title: "Ako vybrať generátor podľa záberu",
    intro:
      "Výber závisí od toho, aký záber potrebuješ. Tu je šesť prípadov, modely, ktoré ich zvládnu, a parametre, podľa ktorých sa môžeš rozhodnúť.",
    factLine:
      "{{rate}} kred./s · najviac {{max}} s · {{resolution}} · {{audio}} · {{frames}}",
    quality: {
      title: "Najvyššia kvalita pre finálny záber",
      body: "Keď odovzdávaš hotové video, záleží na filmovom obraze, presvedčivom pohybe a detailoch. Tieto modely patria k najdrahším. Zadanie najskôr dolaď na lacnom modeli a finálny záber vytvor tu.",
    },
    budget: {
      title: "Najnižšia cena pre návrhy a väčší objem",
      body: "Vyskúšaj rôzne zadania, dolaď pohyb alebo vytvor viac videí na sociálne siete. Detailov bude menej, účet však bude podstatne nižší. Sem patrí väčšina skúšobných záberov.",
    },
    long: {
      title: "Najdlhšie video na jeden záber",
      body: "Jeden súvislý záber môže mať až {{longestSeconds}} sekúnd. Ušetríš si tak strihanie aj spájanie krátkych úsekov. Dĺžku nastavíš na stránke generátora. Požiadavka z četu štandardne žiada {{seconds}} sekúnd.",
    },
    frames: {
      title: "Určenie prvej a poslednej snímky",
      body: "Dodaj úvodný a záverečný obrázok a model dotvorí pohyb medzi nimi. Hodí sa to na prechody, predstavenie produktu či plynulé slučky. Poslednú snímku môžeš určiť pri {{lastFrameCount}} modeloch.",
    },
    audio: {
      title: "Obraz aj zvuk vzniknú spolu",
      body: "Model spolu s obrazom vytvorí aj ruchy, efekty a v niektorých prípadoch dialóg. Zvuk nemusíš vyrábať zvlášť ani ručne synchronizovať. Počet modelov so vstavanou tvorbou zvuku: {{audioCount}}.",
    },
    editing: {
      title: "Avatary, synchronizácia pier a úprava videa",
      body: "Tieto modely pracujú s dodaným materiálom. Omnihuman 1.5 rozhýbe osobu z fotografie podľa zvukovej stopy. Lipsync 2 prispôsobí pohyb úst v existujúcom videu novému hlasu. Gen4 Aleph upraví hotový záber: pridá či odstráni objekty, zmení štýl, osvetlenie aj uhol kamery.",
    },
  },
  versus: {
    title: "Priame porovnania najčastejšie hľadaných dvojíc",
    intro:
      "Štyri dvojice, medzi ktorými sa ľudia často rozhodujú. Pozri, na čo je každý model určený a kedy po ňom siahnuť.",
    pairTitle: "{{a}} a {{b}}",
    klingSeedance:
      "{{a}} má v rade Kling 3 dobrý pomer ceny a výkonu. Ponúka živý pohyb, zvuk, zadanie oboch krajných snímok a až {{aMax}} sekúnd videa. Rozlíšenie končí na 720p. {{b}} ide až do 4K a podľa predlohy zachová vzhľad tej istej postavy v rôznych záberoch. Za sekundu s {{a}} zaplatíš {{aRate}} kred., s {{b}} {{bRate}}. Na návrhy a sociálne siete sa hodí {{a}}. Ak sa tá istá postava vracia vo viacerých scénach, vyber {{b}}.",
    veoSora:
      "{{a}} je vlajkový model Googlu. Ponúka filmový obraz, dialógy aj ruchy, výber prvej a poslednej snímky a rozlíšenie do 4K. Začať môžeš obrázkom. {{b}} od OpenAI vyniká presvedčivým pohybom. Na tejto platforme prijíma len text a vytvára video na šírku. Najviac dostaneš {{aMax}} sekúnd pri {{a}} a {{bMax}} pri {{b}}. Sekunda stojí {{aRate}}, respektíve {{bRate}} kred. Na zvuk či prvú snímku vyber {{a}}. Na dlhší záber iba z textu sa hodí {{b}}.",
    hailuoWan:
      "{{a}} kladie dôraz na ostrosť obrazu: 2K, vlastný zvuk, prvá aj posledná snímka a dĺžka do {{aMax}} sekúnd. Prednosťou {{b}} je dĺžka do {{bMax}} sekúnd na jeden záber, vstavaný zvuk a voľba snímok. Ponúka 480p až 1080p a lacné návrhy v 480p. Za sekundu s {{a}} zaplatíš {{aRate}} kred., s {{b}} {{bRate}}. Na krátky ostrý záber vyber {{a}}, na dlhšie sekvencie {{b}}.",
    grokGemini:
      "{{a}} od xAI vytvára tiché videá od 480p do 1080p, voliteľne s prvou snímkou a najviac na {{aMax}} sekúnd. {{b}} od Googlu má vlastný zvuk, prvú aj poslednú snímku, rozlíšenie od 360p do 4K a najviac {{bMax}} sekúnd. Sekunda stojí {{aRate}}, respektíve {{bRate}} kred. Pre zvuk a obe krajné snímky vyber {{b}}. Pre rýchle tiché zábery od jednej sekundy {{a}}.",
    verdict:
      "Začni lacným pokusom. {{cheapestName}} stojí {{minRate}} kred. za sekundu. Chceš zvuk priamo z modelu? Ponúka ho {{audioCount}} modelov. Potrebuješ určiť poslednú snímku? Podporovaných modelov je {{lastFrameCount}}. Drahší model si nechaj na výsledný záber.",
  },
  chat: {
    title: "Vytvor video priamo v čete",
    intro:
      "Požiadaj o video v ktoromkoľvek čete na {{appName}}. AI za teba zavolá generátor. Ďalšiu aplikáciu ani účet nepotrebuješ.",
    steps: {
      ask: {
        title: "Opíš záber",
        body: "Napíš, čo je v zábere, ako sa to hýbe, čo robí kamera a aká je nálada. Napríklad „Líška na svitaní beží čerstvým snehom, kamera ju sleduje nízko pri zemi.“ AI premení opis na požiadavku pre generátor.",
      },
      model: {
        title: "Nechaj predvolený model alebo zadaj iný",
        body: "Použije sa model pre video nastavený pri tvojej zručnosti, predvolene {{defaultModel}}. Ak chceš iný, napíš napríklad „použi Kling 3.0“. AI výber odovzdá generátoru.",
      },
      image: {
        title: "Prilož obrázok, ktorý chceš rozhýbať",
        body: "Z priloženého obrázka sa stane prvá snímka videa. Ak zvolený model obrázky neprijíma, požiadavka sa presmeruje na jeho obrazovú verziu alebo na najlacnejší model, ktorý s obrázkami pracuje.",
      },
      lastFrame: {
        title: "Urči poslednú snímku",
        body: "Prilož druhý obrázok a označ ho ako záver. Model vytvorí pohyb od prvej po poslednú snímku. Túto možnosť podporuje {{lastFrameCount}} modelov a obe snímky musia byť obrázky. Ako predlohy pre vzhľad môžeš pridať aj ďalšie obrázky, zvuk či video.",
      },
      result: {
        title: "Prehraj si a ulož výsledok",
        body: "Video sa prehrá priamo v čete a uloží sa do tvojho úložiska. V režime inkognito patrí relácii v tvojom prehliadači. Na jeden záber počítaj približne s minútou až niekoľkými minútami.",
      },
    },
    toolPage:
      "V čete AI nemení dĺžku, rozlíšenie ani pomer strán. Každá požiadavka žiada {{seconds}} sekúnd v predvolenom rozlíšení modelu. Na stránke generátora si nastavíš aj dĺžku, model, pomer strán, rozlíšenie, prvú a poslednú snímku a to, čo na videu nechceš.",
    toolLink: "Otvoriť generátor videa",
  },
  pricing: {
    title: "Koľko stojí vytvorenie videa",
    intro:
      "Vynásob sadzbu za sekundu dĺžkou videa v sekundách. Všetky modely čerpajú z rovnakých kreditov.",
    perSecond:
      "Cenu za sekundu tvorí sadzba poskytovateľa a naša prirážka {{markup}} %. Výsledok sa zaokrúhli nahor na desatinu kreditu. Jeden kredit má hodnotu {{creditValue}}.",
    cheapest:
      "Najlacnejšie video z četu aktuálne vytvorí {{cheapestClipName}} za {{cheapestClipCredits}} kred. ({{cheapestClipPrice}}). Najnižšiu sekundovú sadzbu má {{cheapestName}}: {{minRate}} kred.",
    priciest:
      "Najdrahšie video z četu vytvorí {{priciestClipName}} za {{priciestClipCredits}} kred. ({{priciestClipPrice}}). Najvyššiu sekundovú sadzbu má {{priciestName}}: {{maxRate}} kred.",
    resolution:
      "Ak model účtuje podľa rozlíšenia, pri vyššom rozlíšení rastie aj cena za sekundu. Sadzby nájdeš v tabuľke.",
    failed:
      "Kredity odpočítame až po doručení videa. Za neúspešné generovanie, odmietnuté zadanie ani vypršanie času neplatíš.",
    reported:
      "Pri modeloch dostupných cez OpenRouter sa účtuje cena, ktorú nahlási poskytovateľ, spolu s prirážkou. Výsledná suma sa preto môže trochu líšiť od tabuľky.",
    sub: "Mesačné predplatné má štyri úrovne. Najnižšia zahŕňa {{subCredits}} kred. za {{subPrice}}.",
    pack: "Balíky pre predplatiteľov: {{packCredits}} kred. za {{packPrice}}. Kredity nevypršia. Zaplatíš kartou, cez PayPal alebo kryptomenou.",
    link: "Pozrieť si plány a balíky kreditov",
  },
  watermark: {
    title: "Video vytvorené AI bez vodoznaku",
    intro:
      "{{appName}} nepridáva na video žiadnu značku. Dostaneš pôvodný súbor.",
    ours: "Nepridávame vodoznak, logo ani prekrytie obrazu. Stiahneš si video presne v podobe, v akej ho vrátil model.",
    provenance:
      "Niektoré tímy vkladajú neviditeľné označenia pôvodu alebo metadáta. Google používa vo videách SynthID. OpenAI prikladá k videám zo Sory metadáta C2PA. Tieto údaje pridáva samotný poskytovateľ modelu.",
    storage:
      "Každé video sa uloží do tvojho úložiska. Pri čete v režime inkognito zostáva priradené k tvojej relácii v prehliadači.",
  },
  limits: {
    title: "Limity bez prikrášlenia",
    intro:
      "Video patrí medzi najnáročnejšie úlohy generatívnej AI. Pred prvým pokusom sa oplatí poznať obmedzenia.",
    time: "Vytvorenie videa trvá približne minútu až niekoľko minút. Ak dlhšia úloha prekročí časový limit, nič za ňu neplatíš.",
    cost: "Video je najdrahší druh médií na {{appName}}. Návrhy rob na lacnom modeli a drahší použi až na výsledný záber.",
    filters:
      "Všetky tunajšie modely na video pochádzajú zo zavedených výskumných tímov a používajú filtre poskytovateľa. Ten môže odmietnuť explicitný sexuálny obsah, skutočné verejne známe osoby, maloletých či drastické násilie. Za odmietnutie neplatíš.",
    chatControls:
      "V čete sa používa predvolená dĺžka, rozlíšenie a pomer strán. Na stránke generátora ich môžeš nastaviť sám.",
    snap: "Každý model podporuje určité dĺžky. Požiadavka z četu sa upraví na najbližšiu z nich, preto môže mať video o niečo viac či menej než {{seconds}} sekúnd.",
    legacy:
      "Tabuľka vynecháva staršie modely ({{legacyCount}}). V úplnom katalógu ich stále nájdeš.",
    callout:
      "Necenzurované modely ponúkame na četovanie. Video vytvárajú modely zavedených poskytovateľov s ich obsahovými filtrami. Explicitný obsah negenerujú.",
  },
  faq: {
    title: "Časté otázky",
    best: {
      q: "Ktorý generátor videa s AI je najlepší?",
      a: "Záleží na zábere. Na filmový obraz so zvukom Veo 3.1, na dlhé súvislé zábery Wan 3.0 alebo Seedance 2.5, na rovnaké postavy vo viacerých scénach Seedance 2.0. Na lacné návrhy stačí {{cheapestName}}. Rozhovoriť osobu na jednej fotke vie Omnihuman 1.5. Všetkých {{modelCount}} modelov na {{appName}} čerpá z rovnakých kreditov, takže ďalší záber môžeš vytvoriť v inom.",
    },
    klingVsSeedance: {
      q: "Kling alebo Seedance: ktorý vybrať?",
      a: "Kling 3.0 Std má dobrý pomer ceny a výkonu. Ponúka živý pohyb, vlastný zvuk aj voľbu krajných snímok, no najviac 720p. Seedance 2.0 stojí viac za sekundu, podporuje až 4K a podľa predlohy zachováva vzhľad postavy od záberu k záberu. Návrh môžeš spraviť v Klingu a výsledné scény v Seedance.",
    },
    imageToVideo: {
      q: "Ako vytvorím video z obrázka?",
      a: "V ľubovoľnom čete prilož obrázok a opíš pohyb. Obrázok sa stane prvou snímkou. Priamo ho prijíma {{i2vCount}} z {{modelCount}} modelov. Ak ho tvoj model neprijíma, požiadavka prejde na model s obrazovým vstupom. Pri podporovaných modeloch môžeš pridať aj obrázok pre poslednú snímku.",
    },
    watermark: {
      q: "Dá sa vytvoriť video s AI bez vodoznaku?",
      a: "Áno. {{appName}} nepridáva vodoznak, logo ani prekrytie. Stiahneš si pôvodný súbor. Niektoré tímy používajú vlastné neviditeľné označenia: Google vo videách SynthID a OpenAI vo videách zo Sory metadáta C2PA.",
    },
    cost: {
      q: "Koľko stojí vytvorenie videa s AI?",
      a: "Video z četu stojí podľa zvoleného modelu od {{cheapestClipPrice}} do {{priciestClipPrice}}. Každý model má sadzbu za sekundu s prirážkou {{markup}} % k cene poskytovateľa. Jeden kredit má hodnotu {{creditValue}}. Za neúspešné generovanie neplatíš.",
    },
    free: {
      q: "Dá sa video vytvoriť aj zdarma?",
      a: "Nový účet dostane bezplatné kredity. Video patrí k najdrahším typom obsahu, takže vystačia najviac na niekoľko pokusov. Najlacnejšie video práve vytvorí {{cheapestClipName}} za {{cheapestClipCredits}} kred. Ďalšie možnosti ponúka predplatné od {{subPrice}} mesačne.",
    },
    length: {
      q: "Aké dlhé môže byť video vytvorené s AI?",
      a: "Model {{longestName}} zvládne na jeden záber až {{longestSeconds}} sekúnd. Väčšina modelov má nižší limit. Čet žiada {{seconds}} sekúnd. Dlhšie video si nastav na stránke generátora.",
    },
    uncensored: {
      q: "Je k dispozícii necenzurovaný generátor videa?",
      a: "Na {{appName}} sú pre video dostupné modely zavedených poskytovateľov s ich vlastnými filtrami. Explicitný obsah negenerujú. Necenzurované modely ponúkame na četovanie.",
    },
    modelsLink: "Pozrieť všetky modely s parametrami a cenami",
    pricingLink: "Pozrieť si plány a ceny",
  },
  partners: {
    body: "Tvoríš videá s AI? V partnerskom programe {{appName}} dostávaš opakovanú províziu z každej platby ľudí, ktorých odporučíš.",
    link: "Zapojiť sa do partnerského programu",
  },
  cta: {
    title: "Vyber model a vytvor záber.",
    subtitle:
      "Na stránke generátora si nastav model, dĺžku, pomer strán, rozlíšenie aj krajné snímky. Alebo stačí o video požiadať v ktoromkoľvek čete na {{appName}}.",
    generate: "Vytvoriť video",
    models: "Prehľad všetkých modelov",
  },
};
