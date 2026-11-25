import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/sk";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Účet",
  tags: {
    remoteConnection: "Vzdialené pripojenie",
  },
  enums: {
    fleetStatus: {
      all: "Všetky",
      unhealthy: "Problémové",
      critical: "Kritické",
      warning: "Upozornenie",
      disconnected: "Odpojené",
      healthy: "V poriadku",
    },
  },
  fleet: {
    title: "Stav pripojenia",
    subtitle:
      "Všetky inštancie pripojené k tomuto serveru. Stav vychádza z poslednej zaznamenanej aktivity.",
    kpi: {
      attention: "Vyžaduje pozornosť",
      total: "Pripojenia",
      healthy: "V poriadku",
      unhealthy: "Problémové",
      disconnected: "Odpojené",
      totalHint: "Aktívne: {{active}}. Neaktívne: {{inactive}}.",
      healthyHint: "Zosynchronizované bez otvorených problémov",
      unhealthyHint: "Kritické: {{critical}} · upozornenia: {{warning}}",
      disconnectedHint: "Neaktívne, bez poruchy",
    },
    status: {
      healthy: "V poriadku",
      warning: "Upozornenie",
      critical: "Kritické",
      disconnected: "Odpojené",
    },
    issue: {
      reauthRequired:
        "Neaktívne. Vzdialená inštancia odmietla uložené prihlásenie.",
      inactive: "Neaktívne",
      accessDenied: "Prístup je od posledného kontaktu zamietnutý.",
      disconnectedAt: "Odpojenie zaznamenané {{at}}",
      noToken: "Chýba uložený token. Požiadavky sa nedajú overiť.",
      neverSynced: "Zatiaľ bez synchronizácie. Prepojené {{at}}.",
      staleSync: "Synchronizácia mešká. Naposledy prebehla {{at}}.",
      transportDrift:
        "Nastavený je prenos {{configured}}, posledné volanie však použilo {{used}}.",
      transportMismatch: "Na každej strane je nastavený iný spôsob prenosu.",
      mismatch:
        "{{sender}} posiela {{sent}}, {{receiver}} očakáva {{expected}}",
      denial: "Naša akcia {{action}} ({{at}}): {{reason}}",
      peerToolsStale:
        "Vzdialená inštancia má zastaranú kópiu našich nástrojov.",
    },
    table: {
      instance: "Pripojenie",
      trustTools: "Dôvera a nástroje",
      title: "Pripojenia",
      subtitle:
        "Najprv problémové pripojenia, potom podľa času posledného kontaktu.",
      empty: "Žiadne spojenie nemá tento stav.",
      emptyAll: "K tomuto serveru nie je pripojená žiadna inštancia.",
      count: "{{shown}} z {{total}}",
    },
    direction: {
      incoming: "Prepojila vzdialená inštancia",
      outgoing: "Prepojila táto inštancia",
      mine: "Tvoja",
    },
    trust: {
      standard: "Štandardné oprávnenia zákazníka. AI beží vzdialene.",
      tools: "Počet nástrojov: {{count}}",
      peerBuild: "Zostava vzdialenej inštancie {{version}}",
      noBuild: "Verzia zostavy nebola nahlásená",
      syncsAll: "Synchronizuje všetko",
      syncsNone: "Nič nesynchronizuje",
      syncsAllBut: "Synchronizuje všetko okrem: {{missing}}",
      syncsOnly: "Synchronizuje iba {{list}}",
      admin: "Koná s oprávneniami správcu",
      noTools: "Žiadne uložené nástroje vzdialenej inštancie",
      loopHere: "AI beží tu",
    },
    meta: {
      out: "My → vzdialená inštancia",
      in: "Vzdialená inštancia → my",
      lastCall: "Naše posledné volanie",
      none: "zatiaľ nie",
      capabilities: "Dostupné funkcie",
      owner: "Vlastník",
      trust: "Dôvera",
    },
    lastCallNone: "zatiaľ žiadne odchádzajúce volanie",
    earlier: "Predtým: {{text}}",
    yours: "tvoje",
    otherEnd: "vzdialená strana {{peer}}",
    lastCall: "naše posledné volanie cez {{used}}",
    transportPair: "od nás {{out}} · k nám {{in}}",
    transport: {
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    detail: {
      lastContact: "Posledný kontakt",
      lastSynced: "Posledná synchronizácia",
      socket: "Soket otvorený od",
      socketNone: "Bez soketu",
      lastUsed: "Posledné volanie",
      lastUsedValue: "{{transport}}, {{at}}",
      outMode: "Vzdialenú inštanciu kontaktujeme cez",
      inMode: "Vzdialená inštancia nás kontaktuje cez",
      capabilities: "Nástroje vzdialenej inštancie",
      capabilitiesValue: "Počet nástrojov: {{count}} · {{version}}",
      ourTools: "Naše nástroje na vzdialenej inštancii",
      ourToolsCurrent: "{{sent}} (aktuálna verzia)",
      ourToolsStale: "Odoslaná verzia {{sent}}, aktuálna verzia {{current}}",
      inference: "Poskytovateľ spracovania AI",
      forced: "Vynútený systémový poskytovateľ",
      syncScope: "Synchronizácia",
      loop: "Cyklus AI beží na",
      loopTarget: "Vzdialená inštancia",
      loopCaller: "Tento server",
      created: "Prepojené",
      remoteUrl: "Adresa URL druhej strany",
      owner: "Vlastník",
      yes: "Áno",
      no: "Nie",
      none: "Nič",
      unknown: "Neznáme",
      openOwner: "Zobraziť vlastníka",
      openDetail: "Nastavenia tvojho pripojenia",
      showDetails: "Podrobnosti",
      hideDetails: "Skryť",
    },
    scope: {
      memories: "Spomienky",
      documents: "Dokumenty",
      skills: "Zručnosti",
      favorites: "Obľúbené",
      threads: "Chaty",
    },
    never: "Nikdy",
    audit: {
      unknownPeer: "Pripojenie nie je k dispozícii",
      allEvents: "Všetky udalosti auditu",
      eventsShown: "({{first}}–{{last}} z {{total}})",
      previous: "Novšie udalosti",
      next: "Staršie udalosti",
      peer: "Audit pre {{peer}}",
      title: "Záznam auditu",
      subtitle: "Registrácie, odpojenia a zamietnutia na tomto serveri.",
      events: "Udalosti auditu",
      failures: "Zamietnuté alebo obmedzené pre vysoký počet požiadaviek",
      trend: "Udalosti v čase",
      byReason: "Podľa akcie a dôvodu",
      reason: "Akcia a dôvod",
      count: "Udalosti",
      recent: "Najnovšie udalosti",
      empty: "V tomto období nie sú žiadne udalosti auditu.",
      openRecent: "Zobraziť audit",
    },
    action: {
      registered: "Zaregistrované",
      reregistered: "Znova zaregistrované",
      disconnected: "Odpojené",
      denied: "Zamietnuté",
      rate_limited: "Obmedzené limitom požiadaviek",
    },
    cli: {
      counts:
        "Pripojenia: {{total}}. V poriadku: {{healthy}}, problémové: {{unhealthy}}, odpojené: {{disconnected}}.",
      attention: "Vyžaduje pozornosť",
      ok: "V poriadku",
      none: "Žiadne",
      audit:
        "Audit za {{period}}. Udalosti: {{events}}. Zamietnuté alebo obmedzené požiadavky: {{failures}}.",
      lastContact: "posledný kontakt {{at}}",
    },
  },
  get: {
    title: "Vzdialené pripojenia",
    titleShort: "Pripojenia",
    description:
      "Tvoje prepojené inštancie. Správcovia tu vidia aj stav všetkých pripojení na serveri.",
    fields: {
      activeOnly: {
        label: "Iba aktívne",
        description: "Zobraziť iba aktívne pripojenia",
      },
      auditOffset: {
        label: "Posun v zázname auditu",
        description: "Počet udalostí auditu, ktoré sa majú preskočiť",
      },
      auditConnection: {
        label: "ID pripojenia pre audit",
        description: "Zobraziť udalosti auditu iba pre vybrané pripojenie.",
      },
      fleetStatus: {
        label: "Stav pripojenia",
        description: "Zobraziť iba pripojenia v tomto stave",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Ak chceš zobraziť svoje pripojenia, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš povolenie.",
      },
      server: {
        title: "Chyba servera",
        description: "Zoznam pripojení sa nepodarilo načítať.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nenašli sa žiadne pripojenia",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt" },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
    },
    success: {
      title: "Zoznam pripojení načítaný",
      description: "Vzdialené pripojenia sa načítali.",
    },
  },
  widget: {
    loading: "Načítavajú sa pripojenia…",
    refresh: "Obnoviť pripojenia",
    back: "Späť",
    socketSince: "WebSocket otvorený od",
    transportLabel: "Prenos",
    viewConnection: "Otvoriť pripojenie {{instance}}",
    pickConnection: "Vybrať",
    title: "Vzdialené pripojenia",
    addButton: "Pridať pripojenie",
    emptyState:
      "Žiadna inštancia nie je pripojená. Pripoj inštanciu, aby si mohol zdieľať vybrané údaje a nástroje.",
    emptyStateCloud: "Zatiaľ nie je pripojená žiadna inštancia.",
    connectedBadge: "Pripojené",
    registeredBadge: "Zaregistrované",
    selfBadge: "Táto inštancia",
    lastSynced: "Posledná výmena pri synchronizácii",
    never: "Nikdy",
    connectButton: "Prepojiť miestnu inštanciu",
    connectButtonLocal: "Pripojiť sa k cloudu",
    incomingBadge: "Prichádzajúce",
    inactiveBadge: "Neaktívne",
    inferenceProviderBadge: "Spracovanie modelom AI",
    transportBadge: "odchádzajúce {{out}} · prichádzajúce {{in}}",
    transport: {
      unknown: "Neznáme",
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    instanceId: "ID inštancie",
    remoteUrl: "Adresa URL vzdialenej inštancie",
    viewButton: "Zobraziť",
    editButton: "Upraviť",
    deleteButton: "Odpojiť",
    // ── Health status labels ───────────────────────────────────────────────────
    health: {
      socketOpen: "WebSocket je otvorený",
      noSyncRecorded: "Zatiaľ bez synchronizácie",
      syncRecorded: "Synchronizácia zaznamenaná",
      tunnelOpen: "Otvorený tunel",
      bridgeActive: "Pripojené",
      tunnelWarning: "Tunel sa pripája",
      bridgeWarning: "Synchronizácia",
      tunnelLost: "Tunel sa odpojil",
      bridgeFailed: "Spojenie zlyhalo",
      disconnected: "Odpojené",
      reauthRequired: "Vyžaduje sa prihlásenie",
      incomingActive: "Aktívne",
    },
    // ── Reconnect button labels ────────────────────────────────────────────────
    reconnectButton: {
      reauth: "Prihlásiť sa znova",
      reconnect: "Pripojiť znova",
      retry: "Skúsiť znova",
      resync: "Znova synchronizovať",
    },
    // Cloud marketing panel
    cloud: {
      heroTitle: "Pripoj vlastnú inštanciu",
      heroSubtitle:
        "Spusti next-vibe na vlastnom hardvéri a prepoj ho s týmto účtom. Tvoje čety, spomienky a zručnosti budeš mať poruke. Nástroje bežia na tvojom počítači.",
      stepsTitle: "Pripojenie v troch krokoch",
      step1Title: "Nainštalovať next-vibe",
      step1Body:
        "Otvorený zdrojový kód. Beží na notebooku, domácom serveri aj VPS.",
      step2Title: "Spusť prepojenie zo svojej inštancie",
      step2Body:
        "Vo svojej inštancii otvor Predplatné, potom Synchronizácia s cloudom a Pripojiť sa k cloudu. Zadaj {{appUrl}} a prihlasovacie údaje tohto účtu. Na tomto počítači môžeš použiť aj terminál.",
      step2Command: "vibe remote-connect -i",
      step3Title: "Vyber, čo sa má synchronizovať",
      step3Body:
        "Spomienky, dokumenty, zručnosti, obľúbené konfigurácie a čety. Každý typ má vlastný prepínač, ktorý môžeš na svojej inštancii kedykoľvek zmeniť.",
      githubCta: "Zobraziť na GitHube",
      quickstartCta: "Rýchly štart",
      trustTitle: "Čo môže prepojená inštancia robiť",
      trust1:
        "Prepojená inštancia koná v tvojom mene. Môže čítať a meniť tvoje čety, spomienky a zručnosti. K údajom iných účtov prístup nemá.",
      trust2:
        "Nástroje správcu zostanú zamknuté. Inštancia získa presne tie oprávnenia, ktoré má tvoj účet.",
      trust3:
        "Za požiadavky AI odoslané sem sa ti odpočítajú kredity podľa bežnej sadzby. Ide o cenu poskytovateľa s prirážkou 30 %.",
      trust4:
        "Limit prepojených inštancií je {{max}}. Keď niektorú odpojíš, jej prístup sa ihneď ukončí.",
      paidTitle: "Iba pre platené účty",
      paidBody:
        "Na prepojenie vlastnej inštancie potrebuješ platený účet. Stačí kúpiť ktorýkoľvek balík kreditov alebo predplatné.",
      paidCta: "Odomknúť prepojenie",
      alreadyHaveLocal: "Tvoje prepojené inštancie",
      alreadyHaveLocalSub:
        "Každá inštancia koná v mene tohto účtu. Otvor ju, ak chceš skontrolovať stav alebo ju odpojiť.",
    },
    // Local panel
    local: {
      cloudTitle: "Pripojiť sa k cloudu",
      cloudSubtitle:
        "Prepoj túto inštanciu s cloudovou inštanciou. Vybrané údaje sa budú synchronizovať a miestne nástroje môžeš spúšťať z cloudu.",
      benefit1: "Spomienky sa synchronizujú automaticky v oboch smeroch.",
      benefit2: "Cloudová AI nájde a spúšťa tvoje miestne nástroje.",
      benefit3: "Úlohy z cloudu zver tomuto počítaču.",
      noConnectionsYet: "Zatiaľ nič nie je pripojené",
      connectionsTitle: "Prepojené inštancie",
    },
    // Self-identity
    selfIdentity: {
      title: "ID tvojej inštancie",
      description:
        "Ostatné inštancie rozpoznajú tento server podľa tohto ID. Medzi prepojenými inštanciami musí byť jedinečné.",
    },
    // Sync settings (admin only)
    syncSettings: {
      title: "Automatická synchronizácia",
      description:
        "Každú minútu synchronizuje úlohy a spomienky so všetkými pripojenými inštanciami.",
      enabledBadge: "Aktívne",
      disabledBadge: "Neaktívne",
      toggleLabel: "Prepnúť automatickú synchronizáciu",
    },
  },
};
