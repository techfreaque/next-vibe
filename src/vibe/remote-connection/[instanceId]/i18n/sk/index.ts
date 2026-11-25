import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",
  tags: {
    remoteConnection: "Vzdialené pripojenie",
  },
  widget: {
    loading: "Načítava sa pripojenie…",
    title: "Vzdialené pripojenie",
    signInDescription: "Ak chceš nastaviť vzdialené pripojenie, prihlás sa.",
    back: "Späť",
    // ── Status section ─────────────────────────────────────────────────────
    statusSection: "Stav",
    connected: {
      title: "Pripojené",
      badge: "Aktívne",
      connectedTo: "Adresa URL vzdialenej inštancie",
      transport: "Odchádzajúci prenos",
      remoteTransport: "Spôsob prenosu druhej strany",
      remoteInstance: "Vzdialená inštancia",
      capabilities: "Verzia dostupných funkcií",
      lastSynced: "Posledná výmena pri synchronizácii",
      wsConnected: "Pripojené od",
      refresh: "Obnoviť",
      transportReverseWs: "Spätný WebSocket (tunel)",
      transportDirectHttp: "Priame HTTP",
    },
    notConnected: {
      title: "Nepripojené",
      description:
        "Pripoj sa ku cloudovému účtu, napríklad na unbottled.ai. Spomienky sa zosynchronizujú a nástroje AI môžeš volať z terminálu odkiaľkoľvek.",
      benefit1:
        "Spomienky sa automaticky synchronizujú medzi týmto zariadením a tvojím cloudovým účtom.",
      benefit2: "Spusť nástroje AI z príkazového riadka pomocou",
      benefit2Code: "vibe --remote",
      benefit3: "Miestne a cloudové údaje zostanú zosynchronizované.",
    },
    // ── Behavior section ───────────────────────────────────────────────────
    behaviorSection: "Správanie",
    // ── Sync section ───────────────────────────────────────────────────────
    syncSection: "Synchronizácia a prístup",
    syncScope: {
      memories: "Spomienky",
      documents: "Dokumenty",
      skills: "Zručnosti",
      favorites: "Obľúbené",
      threads: "Vlákna",
    },
    // ── Cross-references ───────────────────────────────────────────────────
    cortexSection: "Cortex",
    cortexDescription:
      "Prehliadaj súborový systém zdieľaný cez toto pripojenie.",
    cortexLink: "Otvoriť Cortex",
    sshSection: "SSH a terminál",
    sshDescription: "Konfigurácie SSH a relácie terminálu cez toto pripojenie.",
    sshLink: "Otvoriť pripojenia SSH",
    // ── Connection state banner ────────────────────────────────────────────
    state: {
      noSyncRecorded: "Zatiaľ bez synchronizácie",
      syncRecorded: "Synchronizácia zaznamenaná",
      tunnelActive: "WebSocket je otvorený",
      bridgeActive: "Pripojené",
      degraded: "Kvalita pripojenia sa zhoršila",
      connectionLost: "Pripojenie sa prerušilo",
      inactive: "Neaktívne",
      connectedSince: "od",
      initialSync: "Zosynchronizované",
    },
    // ── Actions ────────────────────────────────────────────────────────────
    reauthButton: "Prihlásiť sa znova",
    renameButton: "Premenovať",
    editButton: "Upraviť",
    reconnectButton: "Pripojiť znova",
    disconnectButton: "Odpojiť",
    disconnectConfirmTitle: "Odpojiť túto inštanciu?",
    disconnectConfirmDescription:
      "Pripojenie sa odstráni. Kedykoľvek ho môžeš vytvoriť znova.",
    disconnectConfirmCancel: "Zrušiť",
    disconnectConfirmProceed: "Odpojiť",
    // ── Edit section titles ────────────────────────────────────────────────
    edit: {
      identitySection: "Názov",
      reauthSection: "Prihlásiť sa znova",
      transportSection: "Prenos",
      behaviorSection: "Správanie",
    },
  },
  get: {
    title: "Stav vzdialeného pripojenia",
    titleShort: "Pripojenie",
    description: "Podrobný stav a nastavenia vzdialeného pripojenia",
    instanceId: {
      label: "ID inštancie",
      description: "Inštancia, ktorej pripojenie chceš zobraziť",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Ak chceš zobraziť vzdialené pripojenie, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš oprávnenie na zobrazenie.",
      },
      notFound: {
        title: "Nepripojené",
        description: "Pre túto inštanciu sa nenašlo vzdialené pripojenie.",
      },
      server: {
        title: "Chyba servera",
        description: "Údaje o pripojení sa nepodarilo načítať.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
    },
    success: {
      title: "Pripojenie sa načítalo",
      description: "Stav vzdialeného pripojenia sa načítal.",
    },
  },
  patch: {
    title: "Aktualizovať vzdialené pripojenie",
    titleShort: "Aktualizovať pripojenie",
    description:
      "Premenuj pripojenie, prihlás sa znova alebo uprav prenos a synchronizáciu.",
    // ── Rename ──────────────────────────────────────────────────────────────
    newInstanceId: {
      label: "Nový názov",
      description:
        "Premenuje pripojenie. Názov sa zmení tu a prenesie sa aj na vzdialenú inštanciu.",
    },
    // ── Reauth ──────────────────────────────────────────────────────────────
    email: {
      label: "E-mail",
      description: "E-mail tvojho účtu na vzdialenej inštancii",
    },
    password: {
      label: "Heslo",
      description: "Heslo tvojho účtu na vzdialenej inštancii",
    },
    // ── Transport ────────────────────────────────────────────────────────────
    transportMode: {
      label: "Spôsob prenosu",
      description:
        "Spôsob komunikácie pripojenia. reverse-ws udržiava odchádzajúce pripojenie WebSocket a otvorí ho hneď po uložení. direct-http používa priame volania HTTP.",
      options: {
        reverseWs: "Spätný WebSocket",
        directHttp: "Priame HTTP",
      },
    },
    remoteTransportMode: {
      label: "Spôsob prenosu druhej strany",
      description:
        "Ako vzdialená inštancia kontaktuje tento server. Pri reverse-ws udržiavame odchádzajúce pripojenie na príjem jej správ. Pri direct-http odosiela požiadavky POST na náš most.",
    },
    // ── Behavior ────────────────────────────────────────────────────────────
    isInferenceProvider: {
      label: "Poskytovateľ spracovania AI",
      description:
        "Povoliť spracovanie požiadaviek AI cez toto pripojenie. Vzdialená inštancia spúšťa cyklus LLM cez spätný kanál WebSocket.",
    },
    forceSystemProvider: {
      label: "Vynútiť systémového poskytovateľa",
      description:
        "Nastavenie správcu. Presmeruje všetky prenosy AI cez toto pripojenie bez ohľadu na pravidlá smerovania podľa ceny alebo používateľa. Vynútiť možno iba jedno pripojenie naraz.",
    },
    threadMirrorMode: {
      label: "Zrkadlenie vlákien",
      description:
        "Určuje synchronizáciu vlákien medzi touto a pripojenou inštanciou. Hodnota both zrkadlí vlákna obojsmerne. Hodnota off ponechá každé vlákno na inštancii, kde vzniklo.",
      options: {
        both: "Zrkadliť obojsmerne",
        off: "Bez zrkadlenia",
      },
    },
    loopLocation: {
      label: "Umiestnenie slučky",
      description:
        "Určuje, kde sa spúšťa cyklus AI vzdialeného vlákna. 'target' ho spustí na pripojenej inštancii (predvolené). 'caller' ho ponechá na tejto inštancii. Nástroje sa naďalej vykonávajú vzdialene.",
      options: {
        target: "Na pripojenej inštancii",
        caller: "Na tejto inštancii",
      },
    },
    // ── Sync scope ──────────────────────────────────────────────────────────
    syncScope: {
      label: "Rozsah synchronizácie",
      description:
        "Ktoré údaje sa prenášajú cez toto pripojenie. Môžeš vybrať spomienky, dokumenty, zručnosti, obľúbené konfigurácie a vlákna.",
      memories: "Spomienky",
      documents: "Dokumenty",
      skills: "Zručnosti",
      favorites: "Obľúbené",
      threads: "Vlákna",
    },
    reconnectNow: {
      label: "Znovu pripojiť",
      description:
        "Zatvorí a znova otvorí pripojenie. Po otvorení stiahne zmeny.",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      network: { title: "Chyba siete", description: "Nepodarilo sa pripojiť" },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Toto pole môže upraviť iba používateľ s rolou správcu.",
      },
      notFound: { title: "Nenašlo sa", description: "Pripojenie sa nenašlo" },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa aktualizovať pripojenie",
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
    },
    success: {
      title: "Pripojenie sa aktualizovalo",
      description: "Nastavenia sa uložili.",
    },
  },
  delete: {
    title: "Odpojiť",
    titleShort: "Odpojiť",
    description: "Odstráni vzdialené pripojenie a zatvorí kanál WebSocket.",
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      network: { title: "Chyba siete", description: "Nepodarilo sa pripojiť" },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáš povolenie.",
      },
      notFound: { title: "Nenašlo sa", description: "Pripojenie sa nenašlo" },
      server: { title: "Chyba servera", description: "Nepodarilo sa odpojiť" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: { title: "Konflikt", description: "Nastal konflikt" },
    },
    success: {
      title: "Odpojené",
      description: "Vzdialené pripojenie bolo odstránené.",
    },
  },
};
