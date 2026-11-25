import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Nástroje AI",
  tags: {
    skills: "zručnosti",
  },
  enums: {
    platform: {
      characterAi: "Character.AI",
      talkie: "Talkie",
      characterCard: "Karta postavy",
    },
    visibility: {
      private: "Súkromné",
      unlisted: "Prístup cez odkaz",
      public: "Verejné",
    },
  },
  post: {
    title: "Importovať postavu z odkazu",
    titleShort: "Importovať z odkazu",
    description:
      "Importuje postavu z verejného odkazu Character.AI (character.ai, c.ai) alebo Talkie (talkie-ai.com). Meno, avatar, pozdrav, opis, definícia a štítky sa skopírujú do novej postavy, ktorú vlastníš. Uvedie sa pôvodný autor aj odkaz na zdroj. Pri opakovanom importe toho istého odkazu dostaneš existujúcu postavu.",
    dynamicTitle: "Import: {{url}}",
    intro:
      "Vlož verejný odkaz na postavu. Skopírujeme verejne dostupné údaje zo stránky a uvedieme pôvodného autora.",
    supported: "Podporuje Character.AI a Talkie.",
    url: {
      label: "Odkaz na postavu",
      description: "Verejný odkaz na stránku postavy",
      placeholder: "https://character.ai/character/...",
      validation: {
        invalid: "Vlož celý odkaz začínajúci na https://",
      },
    },
    visibility: {
      label: "Viditeľnosť",
      description:
        "Súkromnú postavu vidíš iba ty. Postava s prístupom cez odkaz sa nezobrazuje vo verejnom zozname. Verejnú postavu vidia všetci.",
    },
    response: {
      id: { content: "ID postavy" },
      name: { content: "Názov" },
      platform: { content: "Zdroj" },
      creatorName: { content: "Pôvodný autor" },
      sourceUrl: { content: "Odkaz na zdroj" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Už importované" },
      importedFields: { content: "Importované" },
    },
    fields: {
      name: "meno",
      avatar: "avatar",
      greeting: "pozdrav",
      description: "opis",
      definition: "definícia",
      tags: "štítky",
    },
    result: {
      imported: "Postava {{name}} je pripravená.",
      alreadyImported:
        "Postavu {{name}} už máš importovanú. Otvára sa tvoja kópia.",
      credit: "Pôvodný autor na {{platform}}: {{creator}}",
      creditUnknown: "Zdroj importu: {{platform}}",
      cardCredit: "Karta od {{creator}}",
      cardCreditUnknown: "Importované z karty postavy",
      fieldsList: "Importované: {{fields}}",
      openSkill: "Otvoriť postavu",
      importAnother: "Importovať ďalšiu postavu",
    },
    errors: {
      validation: {
        title: "Neplatný odkaz",
        description: "Vlož celý verejný odkaz na postavu.",
      },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihlás sa a importuj postavy.",
      },
      forbidden: {
        title: "Nepovolené",
        description: "Tvoj účet nemá oprávnenie importovať postavy.",
      },
      notFound: {
        title: "Postava sa nenašla",
        description:
          "Stránka nezobrazuje verejné údaje o postave. Postava môže byť súkromná, odstránená alebo dostupná iba po prihlásení.",
      },
      server: {
        title: "Import zlyhal",
        description: "Import sa nepodaril. Skús to znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Už importované",
        description: "Túto postavu už máš importovanú.",
      },
      unsupported:
        "Vlož podporovaný odkaz na postavu z Character.AI (character.ai, c.ai) alebo Talkie (talkie-ai.com).",
      blocked:
        "Platforma {{platform}} požiadavku zablokovala. Skús to o pár minút alebo vytvor postavu ručne.",
      noPublicData:
        "Platforma {{platform}} nezobrazuje verejné údaje o postave. Postava môže byť súkromná, odstránená alebo dostupná iba po prihlásení.",
      rateLimited:
        "Príliš veľa importov. Skús to znova po uplynutí čakacej doby ({{seconds}} s).",
      notConfigured:
        "Na načítanie stránok platformy {{platform}} treba nástroj, ktorý na tomto serveri nie je nastavený.",
    },
    success: {
      title: "Postava je importovaná",
      description: "Tvoja kópia postavy je pripravená na čet.",
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Importovať",
      loadingText: "Importuje sa…",
    },
  },
};
