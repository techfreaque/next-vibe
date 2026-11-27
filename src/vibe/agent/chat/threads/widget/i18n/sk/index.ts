import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    newChat: "Nový chat",
    delete: "Odstrániť",
    cancel: "Zrušiť",
    settings: "Nastavenia",
    close: "Zavrieť",
    toggleSidebar: "Otvoriť alebo zavrieť bočný panel",
    noChatsFound: "Nenašli sa žiadne chaty",
  },
  actions: {
    rename: "Premenovať",
    unpin: "Odopnúť",
    pin: "Pripnúť navrch",
    unarchive: "Vrátiť z archívu",
    archive: "Archivovať",
    manageSharing: "Spravovať zdieľanie",
    moveToFolder: "Presunúť do priečinka",
    unfiled: "Odobrať z priečinka",
  },
  folderList: {
    managePermissions: "Spravovať oprávnenia",
    today: "Dnes",
    lastWeek: "Posledných 7 dní",
    lastMonth: "Posledných 30 dní",
    older: "Staršie",
  },
  threadList: {
    deleteDialog: {
      title: "Odstrániť konverzáciu",
      description:
        "Chcete odstrániť „{{title}}“? Všetky správy v tejto konverzácii sa natrvalo odstránia. Tento krok sa nedá vrátiť späť.",
    },
  },
  suggestedPrompts: {
    title: "S čím ti môžem pomôcť?",
    privateTitle: "Váš súkromný asistent AI",
    privateDescription:
      "Konverzácie sa ukladajú do vášho účtu a synchronizujú medzi vašimi zariadeniami.",
    sharedTitle: "Spolupracujte s AI",
    sharedDescription:
      "Vytvárajte konverzácie a zdieľajte ich s tímom pomocou bezpečných odkazov.",
    publicTitle: "Zapojte sa do verejného fóra AI",
    publicDescription:
      "Verejné konverzácie vidí každý. Zdieľajte nápady a zapojte sa do otvorenej diskusie.",
    incognitoTitle: "Anonymný čet s AI",
    incognitoDescription:
      "Ukladá sa len vo vašom prehliadači. Nepridáva sa do účtu ani sa nesynchronizuje.",
    backgroundTitle: "Tvoji agenti AI pracujú",
    backgroundDescription:
      "Podagenti a samostatní agenti na pozadí tu plnia úlohy, kým sa venuješ niečomu inému. Výsledky sa zobrazia automaticky.",
  },
  config: {
    appName: "unbottled.ai",
  },
  components: {
    sidebar: {
      login: "Prihlásiť sa",
      signup: "Vytvoriť účet",
      logout: "Odhlásiť sa",
      footer: {
        account: "Účet",
        expandAccount: "Rozbaliť sekciu účtu",
        collapseAccount: "Zbaliť sekciu účtu",
      },
    },
    credits: {
      label: "Kredity",
      credit: "{{count}} kredit",
      credits: "Kredity: {{count}}",
    },
    navigation: {
      subscription: "Predplatné a kredity",
      partnerDashboard: "Prehľad partnera",
      apiKeys: "Kľúče API",
      referral: "Program odporúčaní",
      settings: "Môj profil a nastavenia",
      leadMagnet: "Darček za registráciu",
      help: "Spätná väzba a podpora",
      about: "O platforme",
      websiteBlog: "Príbehy",
      newsletter: "Odber noviniek: {{freeCreditsMax}} kred. zdarma mesačne",
      admin: "Prehľad správcu",
    },
    confirmations: {
      deleteMessage: "Chcete odstrániť túto správu?",
    },
    signInGate: {
      title: "Na otvorenie konverzácie sa prihlás",
      description:
        "Táto konverzácia je v súkromnom alebo zdieľanom priečinku. Prihlás sa do účtu s prístupom.",
      signIn: "Prihlásiť sa",
      signUp: "Vytvoriť bezplatný účet",
      incognito: "Začať súkromný čet",
    },
  },
};
