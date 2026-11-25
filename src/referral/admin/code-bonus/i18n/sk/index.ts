import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Odporúčania",
  tags: {
    referral: "odporúčania",
    admin: "správca",
  },
  post: {
    title: "Bonus ku kódu odporúčania",
    titleShort: "Bonus kódu",
    description:
      "Nastavte jednorazový bonus v kreditoch pre používateľov, ktorých kód priviedol. Bonus sa pripíše pri prvom platenom pláne. Pri registrácii zadarmo sa nepripisuje. Hodnota 0 bonus vypne.",
    fields: {
      code: {
        label: "Kód odporúčania",
        description: "Kód, ktorý chcete zmeniť. Na veľkosti písmen nezáleží",
        placeholder: "krysalid",
      },
      bonusCredits: {
        label: "Bonusové kredity",
        description:
          "Kredity sa pripíšu raz pri prvom platenom pláne. Hodnota 0 bonus vypne.",
        placeholder: "100",
      },
    },
    response: {
      code: "Kód",
      ownerEmail: "Vlastník kódu",
      previousBonusCredits: "Predchádzajúci bonus",
      subscriptionBonusCredits: "Bonusové kredity",
    },
    widget: {
      back: "Späť",
      hint: "Pri registrácii sa zobrazí „+N bonusových kreditov k prvému predplatnému“. Každý používateľ dostane bonus iba raz.",
      submit: "Uložiť bonus",
      set: "Kód {{code}} ({{owner}}): bonus k prvému plánu +{{credits}} kred. (pôvodne {{previous}}).",
      cleared: "Kód {{code}} ({{owner}}): bez bonusu (pôvodne {{previous}}).",
    },
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontrolujte kód a počet kreditov",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa ako správca, ak chcete nastaviť bonusy kódov",
    },
    forbidden: {
      title: "Iba pre správcov",
      description: "Bonusy kódov môžu nastaviť iba správcovia",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Kód neexistuje",
    },
    conflict: {
      title: "Konflikt",
      description: "Kód sa medzičasom zmenil. Skúste znova.",
    },
    server: {
      title: "Chyba servera",
      description: "Bonus sa nepodarilo uložiť",
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
    codeNotFound: "Kód odporúčania {{code}} neexistuje",
  },
  success: {
    title: "Uložené",
    description: "Bonus kódu sa upravil",
  },
};
