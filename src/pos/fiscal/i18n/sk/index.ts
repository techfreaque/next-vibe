import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { pos: "Pokladnica", fiscal: "Pokladničné doklady" },
  enums: {
    adapter: {
      sandbox: "Sandbox (len na testovanie, necertifikovaný)",
    },
    deviceKind: {
      orp: "ORP (pokladnica s hardvérovým CHDÚ)",
      sorp: "SORP (softvérová pokladnica, úložisko u výrobcu)",
      vrp: "VRP (bezplatná virtuálna pokladnica finančnej správy)",
    },
    receiptStatus: {
      pending: "Čaká na zaevidovanie",
      registered: "Zaevidovaný",
      offline: "Vyhotovený offline",
      failed: "Neúspešný",
    },
  },
  block: {
    ekasaRequired:
      "Podľa slovenského zákona musí byť každý predaj v hotovosti aj kartou zaevidovaný v systéme eKasa. Pred predajom pripojte certifikovanú pokladnicu eKasa v nastaveniach fiškalizácie pokladnice.",
  },
  title: "Pokladničné doklady",
  description:
    "Zistite, či vaša krajina vyžaduje online evidenciu tržieb a ktorá pokladnica eviduje vaše predaje.",
  saveTitle: "Registračná pokladnica",
  saveDescription:
    "Pripojte pokladnicu, ktorá eviduje vaše predaje vo finančnej správe.",
  company: "Spoločnosť",
  adapter: "Poskytovateľ",
  adapterPlaceholder: "Vyberte poskytovateľa",
  adapterDescription:
    "Skutočné predaje môžu evidovať len certifikovaní poskytovatelia. Sandbox slúži na testovanie a predaj nikdy neodblokuje.",
  deviceKind: "Typ pokladnice",
  deviceKindDescription:
    "ORP ukladá doklady do hardvérového CHDÚ. SORP má chránené úložisko na serveroch výrobcu. VRP je bezplatná služba finančnej správy.",
  cashRegisterCode: "Kód pokladnice",
  cashRegisterCodeDescription:
    "Kód, ktorý finančná správa pridelila tejto pokladnici (kód pokladnice ORP).",
  cashRegisterCodePlaceholder: "napr. 88812345678900001",
  isEnabled: "Evidovať predaje cez tohto poskytovateľa",
  isEnabledDescription:
    "Ak je zapnuté, každý dokončený predaj sa zaradí na zaevidovanie.",
  certifiedUntil: "Certifikát platí do",
  certifiedUntilDescription:
    "Posledný deň platnosti certifikátu pokladnice. Po jeho uplynutí je predaj zablokovaný.",
  credentialRef: "Odkaz na prístupové údaje",
  credentialRefDescription:
    "Názov uloženého kľúča alebo certifikátu. Nikdy sem nevkladajte súkromný kľúč ani heslo.",
  offlineDeadlineHours: "Lehota na odoslanie offline dokladov (hodiny)",
  offlineDeadlineHoursDescription:
    "Doklady vyhotovené offline musia byť do tejto lehoty odoslané finančnej správe.",
  response: {
    required: "Povinná evidencia",
    blocked: "Predaj zablokovaný",
    provider: "Pokladnica",
    counts: "Front dokladov",
    adapters: "Dostupní poskytovatelia",
    companyName: "Spoločnosť",
    country: "Krajina",
    saved: "Uložené",
  },
  widget: {
    requiredTitle: "eKasa je pre túto spoločnosť povinná",
    requiredMessage:
      "Každý predaj v hotovosti aj kartou sa musí online zaevidovať v systéme eKasa (zákon 384/2025 Z. z.). Doklady nepotvrdené do 5 sekúnd sa uložia offline a treba ich odoslať do 96 hodín.",
    notRequiredTitle: "Online evidencia tržieb sa nevyžaduje",
    notRequiredMessage:
      "Pre krajinu tejto spoločnosti naša knižnica neobsahuje systém online evidencie. Predaj v pokladnici funguje bez zmeny.",
    blockedTitle: "Predaj v pokladnici je zablokovaný",
    blockedMessage:
      "Pripojte a zapnite certifikovanú pokladnicu eKasa. Dovtedy pokladnica nemôže dokončiť žiadny predaj.",
    readyTitle: "Predaje sa evidujú",
    readyMessage:
      "Dokončené predaje sa zaradia do frontu a zaevidujú cez pripojenú pokladnicu.",
    noCertifiedProvider:
      "V tejto inštalácii zatiaľ nie je k dispozícii žiadny certifikovaný poskytovateľ eKasa.",
    noProvider: "Nie je pripojená žiadna pokladnica",
    configure: "Pripojiť pokladnicu",
    edit: "Zmeniť pokladnicu",
    certified: "Certifikovaná",
    notCertified: "Necertifikovaná",
    enabled: "Zapnutá",
    disabled: "Vypnutá",
    certifiedUntilValue: "Certifikát platí do {{date}}",
    pending: "Čakajúce",
    offline: "Offline",
    failed: "Neúspešné",
    overdue: "Po lehote",
    queueHint: "Doklady, ktoré finančná správa ešte nepotvrdila.",
    disclaimer: "Poskytujeme nástroje, nie daňové poradenstvo.",
    pickCompany: {
      title: "Vyberte spoločnosť",
      message: "Pravidlá evidencie tržieb závisia od krajiny spoločnosti.",
    },
    savedTitle: "Pokladnica uložená",
    savedBlocked:
      "Predaj zostáva zablokovaný: tento poskytovateľ nie je certifikovaný pre eKasa.",
    savedReady: "Dokončené predaje sa budú evidovať cez túto pokladnicu.",
    back: "Späť",
    save: "Uložiť pokladnicu",
    sectionProvider: "Poskytovateľ",
    sectionDevice: "Pokladnica",
  },
  errors: {
    validation: {
      title: "Skontrolujte údaje pokladnice",
      description: "Niektoré údaje chýbajú alebo nie sú platné.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na správu pokladničných dokladov sa prihláste.",
    },
    forbidden: {
      title: "Bez prístupu",
      description:
        "Nastavenia evidencie môžu meniť len vlastníci a administrátori spoločnosti.",
    },
    notFound: {
      title: "Spoločnosť sa nenašla",
      description: "Spoločnosť neexistuje alebo nie ste jej členom.",
    },
    conflict: {
      title: "Nastavenia sa zmenili",
      description: "Obnovte stránku a skúste to znova.",
    },
    server: {
      title: "Nastavenia evidencie nie sú dostupné",
      description: "Skúste to o chvíľu znova.",
    },
    network: {
      title: "Bez pripojenia",
      description: "Skontrolujte pripojenie a skúste to znova.",
    },
    unknown: {
      title: "Niečo sa pokazilo",
      description: "Skúste to o chvíľu znova.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv zmeny uložte alebo zahoďte.",
    },
    deviceKindUnsupported:
      "Tento poskytovateľ nepodporuje zvolený typ pokladnice.",
    adapterUnknown: "Tento poskytovateľ neexistuje.",
    sandboxProduction:
      "Sandbox nie je možné použiť v produkcii. Vyberte certifikovaného poskytovateľa.",
  },
  success: {
    title: "Nastavenia evidencie načítané",
    description: "Stav pokladničných dokladov spoločnosti.",
    savedTitle: "Pokladnica uložená",
    savedDescription: "Nastavenia registračnej pokladnice sú uložené.",
  },
};
