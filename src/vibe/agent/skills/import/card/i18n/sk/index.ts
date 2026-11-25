import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Nástroje AI",
  tags: {
    skills: "zručnosti",
  },
  enums: {
    visibility: {
      private: "Súkromné",
      unlisted: "Prístup cez odkaz",
      public: "Verejné",
    },
  },
  post: {
    title: "Importovať kartu postavy",
    titleShort: "Importovať kartu",
    description:
      "Importuje kartu postavy (V1, V2 alebo V3) zo SillyTavern, Chub, RisuAI alebo inej aplikácie kompatibilnej s formátom Tavern. Prijíma súbor .json, kartu .png s vloženými údajmi alebo text JSON. Meno, opis, osobnosť, scenár, prvá správa, vzorový dialóg, pokyny a štítky sa prenesú do novej postavy, ktorú vlastníš. Obrázok karty PNG sa použije ako avatar. Pri importe sa nič z karty nespúšťa. Opakovaný import rovnakej karty vráti existujúcu postavu.",
    intro:
      "Prenes si svoje postavy. Sem presuň súbor karty exportovaný zo SillyTavern, Chub alebo RisuAI.",
    supported: "Karty V1, V2 a V3. Formát JSON alebo PNG, najviac 10 MB.",
    mapping: {
      title: "Čo sa prenesie",
      fields:
        "Meno, opis, osobnosť, scenár, prvá správa, ukážkový dialóg, pokyny karty, štítky a autor.",
      avatar: "Pri karte PNG sa obrázok použije ako avatar.",
      safe: "Knihy sveta (lorebooks) ani skripty sa neprenesú. Pri importe sa z karty nič nespustí.",
    },
    card: {
      label: "Súbor karty",
      description: "Karta postavy vo formáte .json alebo .png",
      validation: {
        required: "Vyber súbor karty.",
        tooLarge: "Súbor karty je väčší ako 10 MB.",
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
      creatorName: { content: "Autor karty" },
      sourceUrl: { content: "Odkaz na zdroj" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Už importované" },
      importedFields: { content: "Importované" },
    },
    fields: {
      name: "meno",
      avatar: "avatar",
      greeting: "prvá správa",
      description: "opis",
      definition: "osobnosť a scenár",
      tags: "štítky",
    },
    result: {
      imported: "Postava {{name}} je pripravená.",
      alreadyImported:
        "Postavu {{name}} už máš importovanú. Otvára sa tvoja kópia.",
      fieldsList: "Importované: {{fields}}",
      openSkill: "Otvoriť postavu",
      importAnother: "Importovať ďalšiu kartu",
    },
    errors: {
      validation: {
        title: "Neplatná karta",
        description: "Vyber súbor s kartou postavy (.json alebo .png).",
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
        title: "Nenájdené",
        description: "Kartu nebolo možné nájsť.",
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
        title: "Prebieha import",
        description: "Táto karta sa už importuje.",
      },
      invalidCard:
        "Použi kartu postavy vo formáte .json alebo .png, ktorú si exportoval zo SillyTavern, Chub alebo RisuAI.",
      noCardInPng:
        "V súbore PNG chýbajú údaje karty. Exportuj ho znova ako kartu postavy alebo použi súbor .json.",
      rateLimited:
        "Príliš veľa importov. Skús to znova po uplynutí čakacej doby ({{seconds}} s).",
    },
    success: {
      title: "Postava je importovaná",
      description: "Tvoja kópia postavy je pripravená na čet.",
    },
    backButton: {
      label: "Späť",
    },
    submitButton: {
      label: "Importovať kartu",
      loadingText: "Importuje sa…",
    },
  },
};
