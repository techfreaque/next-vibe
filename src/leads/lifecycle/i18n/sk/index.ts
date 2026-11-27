import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Životný cyklus",
  enums: {
    journey: {
      firstChat: "Registrovaní bez prvého chatu",
      outOfCredits: "Bezplatné kredity minuté",
      whatsNew: "Bez aktivity 7 dní",
      winBack: "Bez aktivity 30 dní",
      customerCheckin: "Aktívni predplatitelia: spätná väzba",
      lapsedWinback: "Bývalí predplatitelia bez aktivity 14 dní",
      newsletterInvite: "Odberatelia newsletteru bez účtu",
    },
    enrollmentStatus: {
      active: "Aktívne",
      completed: "Dokončené",
      exited: "Ukončené",
    },
    exitReason: {
      goalMet: "Cieľ splnený",
      unsubscribed: "Odhlásené z odberu",
      suppressed: "Vylúčené z odosielania",
      ineligible: "Už nespĺňa podmienky",
      sendFailed: "Odoslanie zlyhalo",
    },
    sendStatus: {
      pending: "Čaká sa",
      sent: "Odoslané",
    },
    template: {
      firstChatPrompts: "Prvý chat: tri zadania",
      firstChatSkills: "Prvý chat: začiatok so zručnosťou",
      outOfCredits: "Minuté kredity: dátum obnovenia",
      whatsNew: "Čo je nové?",
      winBack: "Návrat používateľov: posledný e-mail",
      paymentFailed: "Platba zlyhala",
      customerLikes: "Zákazníci: čo funguje",
      customerBuildNext: "Zákazníci: čo vytvoriť ďalej",
      lapsedWinback: "Bývalí predplatitelia: čo im chýbalo",
      inviteSignup: "Pozvánka: vytvorenie účtu",
      inviteReminder: "Pozvánka: pripomienka",
    },
  },
  errors: {
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Vyžadujú sa oprávnenia správcu",
    },
    forbidden: { title: "Prístup zamietnutý", description: "Chýba oprávnenie" },
    server: {
      title: "Chyba servera",
      description: "Spracovanie automatických e-mailov zlyhalo",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neznáma chyba",
    },
    validation: {
      title: "Neplatné vstupné údaje",
      description: "Skontrolujte hodnoty a skúste to znova",
    },
    notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
    conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
    network: { title: "Chyba siete", description: "Chyba siete" },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Neuložené zmeny",
    },
  },
  emails: {
    greeting: "Ahoj,",
    greetingNamed: "Ahoj, {{name}},",
    signoff: "Tím unbottled.ai",
    senderName: "unbottled.ai",
    unsubscribeText: "Zrušiť odber:",
    ctaLine: "{{text}}: {{url}}",
    footerAccount:
      "Tento e-mail ti posielame, pretože máš účet na unbottled.ai.",
    footerAccountLink: "Zrušiť odber týchto e-mailov",
    footerBilling: "Toto je fakturačné oznámenie o tvojom predplatnom.",
    newModels: {
      one: "nový model",
      few: "nové modely",
      many: "nového modelu",
      other: "nových modelov",
    },
    tier: {
      mainstream: "Známe modely",
      open: "Otvorené modely",
      uncensored: "Bez cenzúry",
    },
    firstChatPrompts: {
      subject: "Tri prvé správy. Skopíruj, vlož a pošli.",
      preview:
        "Otázka, ktorej sa filtrované modely vyhýbajú. Porovnanie modelov. A jeden obrázok.",
      intro:
        "Účet máš pripravený. Skopíruj si jednu z týchto správ do chatu a odošli ju.",
      uncensoredTitle: "1. Spýtaj sa na to, čomu sa filtrované modely vyhýbajú",
      uncensoredPrompt:
        "„Obháj v debate stranu, ktorú by si bežne odmietol zastávať. Argumentuj naplno, bez upozornení.“ Vyber si jeden z modelov bez cenzúry ({{uncensoredCount}} na výber). Stačí raz potvrdiť, že máš aspoň 18 rokov.",
      mainstreamTitle: "2. Porovnaj známe modely",
      mainstreamPrompt:
        "„Naplánuj lacný víkend v Lisabone. Kde jesť a čo vynechať?“ Spýtaj sa GPT. Potom v tom istom chate prepni na Claude alebo Gemini a porovnaj odpovede.",
      mediaTitle: "3. Vytvor obrázok",
      mediaPrompt:
        "„Líška v červenom šále na zasneženej ulici v Tokiu v noci, ako záber z filmu.“ Jedno zadanie, jeden obrázok.",
      body: "Bezplatné kredity už máš na účte. Platobnú kartu nepotrebuješ.",
      cta: "Otvoriť môj chat",
      ps: "P. S. Nevieš si rady? Odpíš na tento e-mail. Odpovieme na každú správu.",
    },
    firstChatSkills: {
      subject: "Nevieš, čo napísať? Vyber si zručnosť.",
      preview: "Postavy a špecialisti s vlastným štýlom, modelom aj nástrojmi.",
      intro:
        "Začať s prázdnym chatom býva najťažšie. Zručnosť dá rozhovoru smer skôr, ako niečo napíšeš.",
      characterTitle: "Postavy",
      characterBody:
        "Spoločníci, partneri na hranie rolí aj kritici s ostrým jazykom. Každá postava má vlastný štýl a drží sa ho.",
      specialistTitle: "Špecialisti",
      specialistBody:
        "Programátor, redaktor, výskumník. Každý má vlastné pokyny, model a nástroje.",
      body: "Vyber si jednu zručnosť a pozdrav ju.",
      cta: "Vybrať zručnosť",
    },
    outOfCredits: {
      subject: "Bezplatné kredity sa míňajú. Obnovia sa {{resetDate}}.",
      preview: "Tvoje chaty aj nastavenia zostávajú uložené.",
      intro:
        "Mesačné bezplatné kredity sa takmer minuli. Obnovia sa {{resetDate}}.",
      cta: "Zobraziť moje kredity",
      plansLink: "Pozrieť si plány",
    },
    paymentFailed: {
      subject: "Platba za predplatné neprešla",
      preview:
        "Plán platí do {{graceDate}}. Ak v ňom chceš pokračovať, aktualizuj spôsob platby.",
      intro: "Poslednú platbu za predplatné sa nepodarilo spracovať.",
      body: "Plán platí do {{graceDate}}. Ak v ňom chceš pokračovať, aktualizuj spôsob platby pred týmto dátumom. Podržala banka platbu na schválenie (časté pri indických kartách)? Schváľ ju na stránke účtu. Môžeš si aj dokúpiť jednorazový balík kreditov alebo zaplatiť kryptom.",
      cta: "Aktualizovať spôsob platby",
      ps: "P. S. Ak je už platba vyriešená, tento e-mail môžeš ignorovať.",
    },
    customerLikes: {
      subject: "Týždeň s predplatným. Čo funguje a čo nie?",
      preview:
        "Dve otázky, stačí jeden riadok. Užitočnú odpoveď odmeníme kreditmi ({{feedbackCredits}}).",
      intro: "Ďakujeme za prvý týždeň s predplatným. Máme dve otázky:",
      likeTitle: "Čo ti vyhovuje?",
      likeBody:
        "Model, funkcia alebo chvíľa, keď to začalo dávať zmysel. Povedz nám, čo máme zachovať.",
      missingTitle: "Čo chýba alebo nefunguje?",
      missingBody: "Chyba, nejasné nastavenie alebo čokoľvek, čo ťa spomalilo.",
      body: "Vyber si jednu otázku a odpíš na ňu jedným riadkom. Užitočnú odpoveď odmeníme kreditmi ({{feedbackCredits}}).",
      cta: "Poslať spätnú väzbu",
    },
    customerBuildNext: {
      subject: "Čo máme vytvoriť najbližšie?",
      preview: "O tom, čo vytvoríme najbližšie, môžeš rozhodnúť aj ty.",
      intro: "Už vyše mesiaca nás podporuješ. Ďakujeme.",
      body: "Čo máme vytvoriť ako ďalšie? Môže to byť model, funkcia alebo oprava. Napíš nám jeden riadok. Užitočnú odpoveď odmeníme kreditmi ({{feedbackCredits}}).",
      cta: "Poslať môj nápad",
    },
    lapsedWinback: {
      subject: "Čo sme mohli urobiť lepšie?",
      preview:
        "Pomôže aj jeden riadok. Užitočnú odpoveď odmeníme kreditmi ({{feedbackCredits}}).",
      intro:
        "Tvoje predplatné sa skončilo a už sme ťa dlhšie nevideli. Ak ťa niečo odradilo, radi sa dozvieme čo.",
      body: "Odpíš jedným riadkom. Bola to cena, chýbajúci model, chyba alebo niečo iné? Užitočnú odpoveď odmeníme kreditmi ({{feedbackCredits}}).",
      cta: "Poslať spätnú väzbu",
      newsPs:
        "P. S. Od tvojej poslednej návštevy sme pridali {{newModelCount}} {{newModelsPhrase}}, napríklad {{modelList}}.",
      newsPsAll:
        "P. S. Od tvojej poslednej návštevy sme pridali {{modelList}}.",
    },
    whatsNew: {
      subject:
        "{{newModelCount}} {{newModelsPhrase}} od tvojej poslednej návštevy",
      subjectOne: "Novinka od tvojej poslednej návštevy: {{newModelName}}",
      preview: "Nové modely už nájdeš vo výbere modelov.",
      intro:
        "Od tvojej poslednej návštevy sme pridali {{newModelCount}} {{newModelsPhrase}}. Tu sú najnovšie prírastky:",
      introOne: "Od tvojej poslednej návštevy sme pridali jeden model:",
      body: "Otvor ľubovoľný chat a prepni model. História zostane.",
      bodyMore:
        "Ďalšie modely: {{moreCount}}. Otvor ľubovoľný chat a prepni model priamo počas rozhovoru.",
      cta: "Otvoriť moje chaty",
      introAll:
        "Od tvojej poslednej návštevy sme pridali {{newModelCount}} {{newModelsPhrase}}:",
    },
    whatsNewQuiet: {
      subject: "Spýtaj sa jedného modelu a potom druhého",
      preview: "Prepni model v tom istom chate a porovnaj odpovede.",
      intro: "Polož dvom modelom rovnakú otázku.",
      compareTitle: "Prepínanie medzi modelmi",
      compareBody:
        "Spýtaj sa jedného modelu, prepni na druhý v tom istom chate a porovnaj odpovede.",
      body: "V chatoch môžeš pokračovať presne tam, kde prestal rozhovor.",
      cta: "Otvoriť moje chaty",
    },
    winBack: {
      subject: "Čo ti chýbalo?",
      preview: "Čo ti chýbalo? Stačí jeden riadok.",
      intro:
        "Od tvojho posledného chatu uplynul vyše mesiac. Čo ti chýbalo? Odpíš jedným riadkom. Prečítame každú odpoveď a opravíme, čo sa dá.",
      body: "Účet aj chaty máš stále uložené. Bezplatné kredity sa ti každý mesiac obnovujú.",
      cta: "Povedať, čo mi chýbalo",
      newsPs:
        "P. S. Od tvojej poslednej návštevy sme pridali {{newModelCount}} {{newModelsPhrase}}, napríklad {{modelList}}.",
      newsPsAll:
        "P. S. Od tvojej poslednej návštevy sme pridali {{modelList}}.",
    },
    inviteSignup: {
      subject: "Čítaš náš newsletter. Vyskúšaj aj aplikáciu.",
      preview:
        "Bezplatný účet, až {{freeCreditsMax}} kreditov mesačne. Bez platobnej karty.",
      intro:
        "Už dostávaš náš newsletter. V aplikácii máš na výber {{modelCount}} modelov a filtre si nastavíš podľa seba.",
      guestTitle: "Bez účtu: {{freeCreditsGuest}} kreditov mesačne",
      guestBody: "Stačí na vyskúšanie niekoľkých modelov.",
      accountTitle: "Bezplatný účet: {{freeCreditsSignedIn}} kreditov mesačne",
      accountBody: "Uložené chaty na každom zariadení.",
      newsletterTitle:
        "Účet s newsletterom: {{freeCreditsMax}} kreditov mesačne",
      newsletterBody:
        "Bonus dostávaš, kým máš v účte aktívny odber newsletteru.",
      body: "Platobnú kartu nepotrebuješ. Bezplatné kredity sa aktivujú po potvrdení e-mailu.",
      cta: "Vytvoriť si bezplatný účet",
    },
    inviteReminder: {
      subject: "Posledná pripomienka k bezplatnému účtu",
      preview:
        "{{freeCreditsMax}} kreditov mesačne namiesto {{freeCreditsGuest}}. Bez platobnej karty.",
      intro:
        "Posledná pripomienka. S bezplatným účtom a odberom newsletteru získaš {{freeCreditsMax}} kreditov mesačne. Bez účtu máš {{freeCreditsGuest}}.",
      body: "Stačí minúta. Platobnú kartu nepotrebuješ.",
      cta: "Vytvoriť si bezplatný účet",
      ps: "P. S. Ďalšiu pripomienku už nepošleme. Newsletter bude chodiť ďalej.",
    },
  },
  emailTemplates: {
    category: "Automatické série e-mailov",
    preview: {
      name: {
        label: "Meno",
        description:
          "Meno v oslovení. Ak ho necháte prázdne, použije sa všeobecný pozdrav.",
      },
    },
    firstChatPrompts: {
      name: "Automatické e-maily: prvý chat",
      description:
        "Servisný e-mail 24 hodín po registrácii, ak je účet overený a ešte nemá chat. Obsahuje tri návrhy prvých správ na skopírovanie.",
    },
    firstChatSkills: {
      name: "Automatické e-maily: prvý chat so zručnosťou",
      description:
        "Servisný e-mail na 5. deň, ak ešte neprebehol prvý chat. Predstavuje zručnosti a ich úlohu v rozhovore.",
    },
    outOfCredits: {
      name: "Automatické e-maily: minuté kredity",
      description:
        "Servisný e-mail po minutí mesačných bezplatných kreditov bez predchádzajúcej platby. Obsahuje dátum obnovenia a odkaz na kredity. Odkaz na plány sa pridá po súhlase s marketingom.",
    },
    paymentFailed: {
      name: "Automatické e-maily: platba zlyhala",
      description:
        "Transakčný e-mail pri predplatnom po splatnosti. Jeden e-mail na neúspešné spracovanie platby. Plán platí do konca ochrannej lehoty.",
    },
    customerLikes: {
      name: "Automatické e-maily: spätná väzba predplatiteľa",
      description:
        "Servisný e-mail po 7 dňoch aktívneho predplatného. Pýta sa na spätnú väzbu e-mailom a uvádza odmenu v kreditoch v päte.",
    },
    customerBuildNext: {
      name: "Automatické e-maily: návrhy na ďalší vývoj",
      description:
        "Servisný e-mail po približne 5 týždňoch aktívneho predplatného. Pýta sa, čo máme vytvoriť ďalej.",
    },
    lapsedWinback: {
      name: "Automatické e-maily: návrat bývalých predplatiteľov",
      description:
        "Marketingový e-mail pre bývalých predplatiteľov bez aktívneho plánu a bez aktivity 14 dní. Pýta sa na dôvod odchodu a uvádza nové modely.",
    },
    whatsNew: {
      name: "Automatické e-maily: novinky",
      description:
        "Marketingový e-mail po 7 dňoch bez chatu. Uvádza nové modely od posledného chatu.",
    },
    winBack: {
      name: "Automatické e-maily: návrat používateľov",
      description:
        "Marketingový e-mail po 30 dňoch bez chatu. Posledný e-mail série sa pýta, čo používateľovi chýbalo.",
    },
    inviteSignup: {
      name: "Automatické e-maily: pozvánka pre odberateľov",
      description:
        "Potvrdený odberateľ newsletteru bez účtu, 48 hodín po potvrdení.",
    },
    inviteReminder: {
      name: "Automatické e-maily: pripomienka pozvánky",
      description: "Týždeň po pozvánke, ak si odberateľ ešte nevytvoril účet.",
    },
  },
  run: {
    post: {
      title: "Spustiť automatické série e-mailov",
      titleShort: "Spustiť série",
      description:
        "Zaradí kontakty, ktoré práve splnili podmienky, a odošle naplánované e-maily. Pri pozastavení sa spracovanie nevykoná.",
      container: {
        title: "Spustiť série",
        description:
          "Zaradí kontakty a odošle e-maily podľa nastavenia pozastavenia a limitu frekvencie.",
      },
      fields: {
        dryRun: {
          label: "Skúšobný beh",
          description: "Zobraziť iba výsledok simulácie",
        },
      },
      response: {
        paused: "Pozastavené",
        enrolled: "Zaradené",
        sent: "Odoslané",
        exited: "Ukončené",
        deferred: "Odložené",
        failed: "Zlyhalo",
      },
      success: {
        title: "Spracovanie automatických e-mailov dokončené",
        description: "Naplánované kroky sérií boli spracované",
      },
    },
  },
  settings: {
    post: {
      title: "Nastavenia automatických e-mailov",
      titleShort: "Nastavenia automatických e-mailov",
      description:
        "Pozastavenie, najvyššia frekvencia odosielania, limit dávky a pravidlá súhlasu s automatickými e-mailmi.",
      container: {
        title: "Nastavenia automatických e-mailov",
        description: "Ak pole necháte prázdne, zostane v ňom aktuálna hodnota.",
      },
      fields: {
        paused: {
          label: "Pozastaviť všetky automatické e-maily",
          description:
            "Pri zapnutí sa kontakty nezaraďujú a e-maily sa neodosielajú",
        },
        minHoursBetweenEmails: {
          label: "Minimálny odstup medzi e-mailmi (h)",
          description:
            "Najvyššia povolená frekvencia e-mailov na kontakt naprieč automatickými sériami a kampaňami",
        },
        maxSendsPerRun: {
          label: "Maximum e-mailov na jedno spustenie",
          description: "Limit odoslaných správ pri každom plánovanom spustení",
        },
        autoEnrollWindowDays: {
          label: "Obdobie automatického zaradenia (dni)",
          description:
            "Pri plánovanom spustení sa zaradia len kontakty, ktoré splnili podmienky v tomto období. Staršie kontakty sa zaraďujú dodatočne.",
        },
        requireUserMarketingConsent: {
          label: "Vyžadovať súhlas používateľov s marketingom",
          description:
            "Pri zapnutí potrebujú registrovaní používatelia súhlas s marketingom alebo potvrdený odber newsletteru",
        },
      },
      response: {
        paused: "Pozastavené",
        minHoursBetweenEmails: "Minimálny odstup medzi e-mailmi (h)",
        maxSendsPerRun: "Maximum e-mailov na jedno spustenie",
        autoEnrollWindowDays: "Obdobie automatického zaradenia (dni)",
        requireUserMarketingConsent: "Vyžaduje sa súhlas s marketingom",
      },
      success: {
        title: "Nastavenia uložené",
        description: "Nastavenia automatických e-mailov sú účinné",
      },
    },
  },
  backfill: {
    post: {
      title: "Dodatočné zaradenie do sérií",
      titleShort: "Dodatočne zaradiť",
      description:
        "Zobrazte náhľad a dodatočne zaraďte existujúce kontakty, ktoré spĺňajú podmienky. Začnú krokom 0 a odosielanie sa rozloží do nastaveného obdobia.",
      container: {
        title: "Dodatočne zaradiť existujúce kontakty",
        description:
          "Predvolene je zapnutý skúšobný beh. Pri pozastavení sa žiadne e-maily neodosielajú.",
      },
      fields: {
        dryRun: {
          label: "Skúšobný beh",
          description:
            "Iba spočíta kontakty. Vypnite skúšobný beh, ak ich chcete zaradiť.",
        },
        spreadHours: {
          label: "Rozložiť v čase (h)",
          description: "Časový rozsah rozoslania prvých e-mailov",
        },
      },
      response: {
        dryRunResult: "Skúšobný beh",
        segments: "Segmenty",
        journey: "Séria",
        eligible: "Spĺňajú podmienky",
        alreadyEnrolled: "Už zaradené",
        enrolled: "Zaradené",
        autoEligible: "Zaradí sa pri plánovanom spustení",
        heldSuppressed: "Vynechané: zrušený odber alebo nedoručený e-mail",
        heldPaid: "Vynechané: už zaplatené",
        heldNoConsent: "Vynechané: chýba súhlas s marketingom",
        heldUnverified: "Vynechané: neoverený e-mail",
        heldPendingNewsletter: "Vynechané: nepotvrdený odber newsletteru",
        heldInactiveAccount: "Vynechané: zablokovaný alebo neaktívny účet",
        heldNothingDue: "Vynechané: aktívny účet s kreditmi",
      },
      success: {
        title: "Dodatočné zaradenie dokončené",
        description: "Odpoveď obsahuje počty podľa segmentov",
      },
    },
  },
  overview: {
    get: {
      title: "Automatické série e-mailov",
      titleShort: "Životný cyklus",
      description:
        "Prehľad sérií, zaradených kontaktov, odoslaných e-mailov a konverzií. Umožňuje pozastavenie aj dodatočné zaradenie kontaktov.",
      response: {
        paused: "Pozastavené",
        minHoursBetweenEmails: "Minimálny odstup medzi e-mailmi (h)",
        maxSendsPerRun: "Maximum e-mailov na jedno spustenie",
        autoEnrollWindowDays: "Obdobie automatického zaradenia (dni)",
        requireUserMarketingConsent: "Vyžaduje sa súhlas s marketingom",
        journeys: "Série",
        steps: "Kroky",
        enrolled: "Zaradené",
        active: "Aktívne",
        completed: "Dokončené",
        exited: "Ukončené",
        converted: "S konverziou",
        unsubscribed: "Odhlásené z odberu",
        sent: "Odoslané",
        sent24h: "Odoslané (24 h)",
        attributedPaid: "Zaplatili po zaradení",
      },
      success: {
        title: "Prehľad automatických e-mailov načítaný",
        description: "Počty pre jednotlivé série sa načítali",
      },
    },
  },
  widget: {
    title: "Automatické série e-mailov",
    refresh: "Obnoviť",
    pausedTitle: "Pozastavené",
    pausedBody: "Kontakty sa nezaraďujú a e-maily sa neodosielajú.",
    liveTitle: "Spustené",
    liveBody: "Naplánované e-maily sa odosielajú pri každom spustení.",
    pause: "Pozastaviť všetko",
    resume: "Obnoviť odosielanie",
    settings: "Nastavenia",
    backfill: "Dodatočne zaradiť",
    capLine:
      "Limit: 1 e-mail za {{hours}} h. Najviac {{max}} e-mailov na jedno spustenie.",
    consentOn: "Používatelia potrebujú súhlas s marketingom.",
    consentOff: "Súhlas používateľov s marketingom sa nevyžaduje.",
    noJourneys: "Žiadne automatické série.",
    stepsLine: "Počet krokov: {{steps}}",
    enrolled: "Zaradené",
    active: "Aktívne",
    sent: "Odoslané",
    sent24h: "Odoslané (24 h)",
    converted: "S konverziou",
    paid: "Zaplatili po zaradení",
    unsubscribed: "Zrušený odber",
  },
};
