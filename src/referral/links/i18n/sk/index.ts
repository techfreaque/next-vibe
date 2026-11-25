import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Odporúčania",
  tags: {
    referral: "odporúčania",
    links: "odkazy",
  },
  get: {
    title: "Moje sledované odkazy",
    titleShort: "Sledované odkazy",
    description:
      "Tvoje odkazy s odporúčaním podľa umiestnenia. Pri každom vidíš návštevy, registrácie a provízie.",
    response: {
      links: "Odkazy",
    },
    widget: {
      title: "Sledované odkazy",
      subtitle:
        "Jeden odkaz na každé umiestnenie. Zistíš, ktoré video, príspevok či newsletter prináša platiacich používateľov.",
      create: "Nový odkaz",
      refresh: "Obnoviť",
      loading: "Načítavajú sa tvoje odkazy…",
      copy: "Kopírovať",
      copied: "Skopírované",
      visits: "Návštevy",
      signups: "Registrácie",
      paid: "Platiaci",
      earned: "Získané",
      pending: "Čaká na uvoľnenie: {{amount}}",
      code: "Kód {{code}}",
      landsOn: "Otvára {{path}}",
      empty: {
        title: "Zatiaľ žiadne sledované odkazy",
        hint: "Vytvor jeden odkaz na každé video, príspevok či vydanie newslettera. Započíta sa k nemu každá návšteva, registrácia aj platba.",
        cta: "Vytvoriť prvý odkaz",
      },
      cli: {
        header: "Počet sledovaných odkazov: {{count}}",
        funnel:
          "Návštevy: {{visits}}, registrácie: {{signups}}, platiaci: {{paid}}, provízie: {{earned}} (zadržané: {{pending}})",
      },
    },
  },
  post: {
    title: "Vytvoriť sledovaný odkaz",
    titleShort: "Nový odkaz",
    description:
      "Vytvor odkaz s odporúčaním pre jedno umiestnenie. Obsahuje tvoj kód a parametre UTM, aby sa ku konkrétnemu odkazu započítala každá návšteva, registrácia aj platba.",
    submit: "Vytvoriť odkaz",
    fields: {
      name: {
        label: "Názov",
        description: "Tento názov vidíš iba ty. Pomenuj umiestnenie.",
        placeholder: "Recenzia na YouTube, november",
      },
      source: {
        label: "Kde ho zverejníš",
        description: "Platforma alebo web, napríklad youtube, newsletter, x",
        placeholder: "youtube",
      },
      campaign: {
        label: "Kampaň",
        description:
          "Zoskupuje odkazy, napríklad pre jedno video či vydanie newslettera. Voliteľné.",
        placeholder: "uncensored-ai-review",
      },
      medium: {
        label: "Médium",
        description: "Typ umiestnenia. Predvolená hodnota je referral.",
        placeholder: "video",
      },
      destinationPath: {
        label: "Vstupná stránka",
        description: "Cesta na tomto webe, ktorú návštevníci otvoria",
        placeholder: "/",
      },
      code: {
        label: "Kód odporúčania",
        description:
          "Jeden z tvojich kódov. Pri prázdnom poli sa použije prvý aktívny kód.",
        placeholder: "MYCODE",
      },
    },
    response: {
      id: "ID odkazu",
      url: "Odkaz",
      code: "Kód odporúčania",
    },
    widget: {
      back: "Späť",
      hint: "Jeden odkaz na každé umiestnenie. Presne tak zistíš, ktorý odkaz privádza platiacich používateľov.",
      presets: "Kde ho budeš zdieľať?",
      created: "Tvoj odkaz je pripravený",
      copy: "Kopírovať",
      copied: "Skopírované",
    },
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontroluj zvýraznené polia",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Ak chceš spravovať odkazy, prihlás sa",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáš oprávnenie spravovať tieto odkazy",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Tento odkaz neexistuje",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Údaje sa medzičasom zmenili. Načítaj ich znova a zopakuj akciu.",
    },
    server: {
      title: "Chyba servera",
      description: "Požiadavku sa nepodarilo dokončiť",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv zmeny uložte alebo zahoďte",
    },
    noCode:
      "Najprv vytvor kód odporúčania. Ten potom použiješ v sledovaných odkazoch.",
    notYourCode: "Kód {{code}} nie je medzi tvojimi aktívnymi kódmi odporúčaní",
    invalidDestination:
      "Vstupná cesta musí začínať znakom / a zostať na tomto webe",
  },
  success: {
    title: "Hotovo",
    description: "Odkaz pripravený",
  },
};
