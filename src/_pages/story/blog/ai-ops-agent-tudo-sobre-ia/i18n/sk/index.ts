import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Naša AI dohodla recenziu a opravila chybu",
    description:
      "Thea dohodla bezplatnú recenziu, vyriešila chybu v účtovaní videa a vrátila peniaze všetkým dotknutým. Opravu nasadila v ten istý deň.",
    category: "Zákulisie",
    imageAlt:
      "Thea, prevádzková agentka AI pre {{appName}}, vybavuje dohodu o recenzii",
    keywords:
      "agent AI, prevádzka s AI, autonómny agent, Tudo Sobre IA, recenzia, Kling video, vrátenie kreditov, Mediálne štúdio, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Zákulisie",
    readTime: "5 min čítania",
    title: "Moja AI dohodla recenziu, opravila chybu a vrátila peniaze",
    subtitle:
      "Brazílsky web o AI nás vyskúšal, narazil na chybu a aj tak nás odporučil. O každý krok sa postarala Thea.",
  },
  intro: {
    lead: "Vediem unbottled.ai. Dňa 25. novembra o nás brazílsky web o AI zverejnil recenziu. Zistil som to až večer z prevádzkového denníka.",
    reviewBefore: "Tu je:",
    reviewLink: "Tudo Sobre IA testuje unbottled.ai",
    reviewAfter:
      ". Verdikt: dôveryhodné a pre tvorcov sa oplatí. Od prvého e-mailu po verdikt prišla cenová ponuka, bezplatná dohoda, chyba modelu na video, vrátenie kreditov aj oprava v ten istý deň. Všetko vybavila naša prevádzková agentka AI Thea. Nikto sa ma na nič nepýtal.",
    p2: "Thea beží na modeli Claude. Oslovuje tvorcov, odpovedá na otázky pre podporu a rieši veľkú časť vývoja. Jednotlivé úlohy zadáva ďalším agentom. Takto vyzerá jeden bežný deň.",
  },
  deal: {
    title: "Dohoda bez platby na oboch stranách",
    p1: "Thea oslovila Tudo Sobre IA 20. novembra po portugalsky. Najprv skúška, až potom debata o peniazoch. Za sponzorovaný článok si vypýtali 500 USD. Thea im priamo povedala, že platené dohody odkladá do decembra.",
    p2: "Dňa 25. novembra prišli s lepším nápadom. Vyskúšajú platformu s 3 000 kreditmi a zverejnia nezávislú recenziu s výhodami aj nedostatkami. Na oplátku dostanú odkaz na našej stránke partnerov. Ani jedna strana neplatí a ak skúška dopadne zle, článok nemusia vydať.",
    p3: "Thea súhlasila a kredity pripísala hneď po tom, čo si vytvorili účet. Dohodol by som sa rovnako. Len som pri tom nebol.",
  },
  bug: {
    title: "Chyba: 1,56 sekundy videa za cenu 5 sekúnd",
    p1: "Po hodine testovania sa tím ozval. Od modelov Kling V2.5 Turbo a LTX 2.3 Pro žiadali 5- až 6-sekundové videá. Dostali klipy s dĺžkou približne 1,56 sekundy a rozlíšením 464 × 832. Zaúčtovali sme plnú dĺžku.",
    p2: "Mali pravdu. Agent poverený Theou rýchlo našiel príčinu. Adaptér ModelsLab ešte volal staré koncové body videa v6. Tie ignorujú vybraný model a použijú predvolený, ktorý vykreslí 25 snímok pri 16 fps. To je 1,5625 sekundy bez ohľadu na zadanie.",
    callout:
      "Rovnakú chybu malo všetkých 21 video rozhraní ModelsLab. Všimol si ju jeden testujúci. Všetci používatelia týchto modelov platili aj za sekundy, ktoré nedostali.",
  },
  timeline: {
    title: "Jedno popoludnie od hlásenia po opravu",
    intro:
      "Všetko sa stalo 25. novembra. Nič sa ku mne nedostalo, pretože nič nevyžadovalo môj zásah.",
    utc: "{{time}} UTC",
    report: {
      title: "Dostali sme hlásenie chyby",
      body: "Krátke videá s nízkym rozlíšením sa účtovali ako videá s plnou dĺžkou.",
    },
    fix: {
      title: "Príčina, oprava aj vrátenie kreditov",
      body: "Prešli sme na koncové body v7, ktoré poskytovateľovi posielajú model, dĺžku aj rozlíšenie. Účtovanie teraz zmeria doručený súbor a účtuje iba jeho skutočnú dĺžku. Recenzent dostal späť 157 kreditov. Kredity sme vrátili aj ďalšiemu tvorcovi, ktorého sa chyba dotkla.",
    },
    reply: {
      title: "Priama odpoveď po portugalsky",
      body: "Priznali sme chybu na našej strane. Vysvetlili sme, čo sa pokazilo, koľko kreditov sme vrátili a čo meníme.",
    },
    live: {
      title: "Oprava beží v produkcii",
      body: "Opravu sme nasadili menej než hodinu po hlásení.",
    },
    verified: {
      title: "Overenie na skutočnom klipe",
      body: "Kling na žiadosť o 5 sekúnd vrátil klip dlhý 5,04 sekundy v rozlíšení 720p. Stál presne 27,3 kreditu.",
    },
    review: {
      title: "Recenzia vyšla",
      body: "S bannerom na titulnej stránke aj položkou v menu. Podľa dohody sme Tudo Sobre IA pridali na stránku partnerov.",
    },
  },
  review: {
    title: "Čo napísali",
    quote: "„Confiável? Sim. Vale a pena? Sim, para quem cria conteúdo.“",
    cite: "Verdikt Tudo Sobre IA: Dôveryhodné? Áno. Oplatí sa? Áno, pre tvorcov obsahu.",
    p1: "V štúdiu vytvorili 50-sekundový film s maskotom. Obrázok, video, hlas a hudba stáli spolu približne 516 kreditov. Potom opísali, čo sa im páčilo aj čo si treba overiť.",
    likesTitle: "Čo sa im páčilo",
    likes: {
      panel: "Obrázky, video, hlas, hudba aj prepis na jednom mieste.",
      price:
        "Cenu v kreditoch vidíš pred spustením a zostatok po odpočítaní sedí.",
      text: "Portugalský text v obrázkoch vyšiel správne aj na lacnejších modeloch.",
      support: "Podpora priznala chybu a vrátila kredity.",
    },
    flagsTitle: "Na čo upozornili",
    flags: {
      transcription: "Prepis v portugalčine sa stále často mýli.",
      history: "História štúdia ukazuje iba posledných 20 položiek.",
      commercial:
        "Podmienky komerčného používania sa líšia podľa modelu. Pred spustením reklamy si over podmienky konkrétneho modelu.",
      privacy:
        "Na stránke chýba jasná informácia o tom, čo dostávajú poskytovatelia modelov.",
      music: "Jedna z dvoch skladieb znela dosť umelo.",
    },
    fixes:
      "Výhrady sú opodstatnené. V poradí sú opravy prvých štyroch: lepší prepis portugalčiny, dlhšia história štúdia, jasný prehľad komerčného použitia a vysvetlenie, čo dostane každý poskytovateľ.",
    readBefore: "Celú recenziu aj s filmom o maskotovi nájdeš na",
    readLink: "tudosobreia.com.br",
    readAfter: ". Je po portugalsky a stojí za prečítanie.",
  },
  lesson: {
    title: "Čo to hovorí o unbottled.ai",
    p1: "unbottled.ai budujeme a prevádzkujeme s agentmi. Thea oslovuje tvorcov, vyjednáva, odpovedá na otázky, sleduje chyby a zadáva ich programovacím agentom. Platby schvaľujem ja. Thea preto našla dohodu, ktorá nič nestála.",
    p2: "Najdôležitejšia je pre mňa chyba. Thea ju otvorene označila za našu, vrátila kredity každému, koho sa dotkla, overila opravu v produkcii a recenzentovi presne vysvetlila zmeny. Recenzent to potom uviedol medzi výhodami.",
    p3: "Tak vyzerá otvorenosť, ktorú sľubujeme. Filtre určuješ ty. Cenu vidíš pred spustením. Keď sa pomýlime, ozveme sa ako prví a vrátime ti kredity. Ľudia, ktorí nás poctivo testujú, dostanú miesto na",
    partnersLink: "našej stránke partnerov.",
    p4: "Dozvedel som sa to až po zverejnení recenzie. Takto vyzerá dobrá streda.",
  },
  cta: {
    title: "Vytvor video. Zaplať len za sekundy, ktoré dostaneš.",
    subtitle:
      "Kling, LTX, Veo a ďalšie modely v jednom Mediálnom štúdiu. Cenu uvidíš pred spustením.",
    video: "Vytvoriť video",
    studio: "Otvoriť Mediálne štúdio",
  },
};
