import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Odporúčania",
  tags: {
    referral: "odporúčania",
    admin: "správca",
  },
  post: {
    title: "Zmeniť vlastníka kódu odporúčania",
    titleShort: "Presunúť kód",
    description:
      "Presunie kód odporúčania na iný účet. Používatelia, ktorých už priviedol, zostanú priradení ku kódu. Provízie z ich ďalších platieb dostane nový vlastník. Doterajšie provízie ostávajú pôvodným príjemcom. Predvolene sa spustí skúšobný beh.",
    fields: {
      code: {
        label: "Kód odporúčania",
        description: "Presný kód na presun",
        placeholder: "quelllm",
      },
      targetUser: {
        label: "Nový vlastník",
        description: "ID používateľa alebo e-mail účtu, ktorý dostane kód",
        placeholder: "creator@example.com",
      },
      dryRun: {
        label: "Skúšobný beh",
        description: "Zobrazí náhľad presunu bez vykonania zmien",
      },
    },
    response: {
      dryRun: "Skúšobný beh",
      code: "Kód",
      fromUserId: "ID predchádzajúceho vlastníka",
      fromEmail: "Predchádzajúci vlastník",
      toUserId: "ID nového vlastníka",
      toEmail: "Nový vlastník",
      referralsMoved: "Presunutí odporučení používatelia",
      selfReferralsKept:
        "Vlastné odporúčania zostávajú predchádzajúcemu vlastníkovi",
      linksMoved: "Presunuté sledované odkazy",
      linksTotal: "Odkazy kampaní používajúce kód",
    },
    widget: {
      back: "Späť",
      hint: "Provízie z ďalších platieb dostáva vlastník kódu. Najprv spustite skúšobný beh. Ak chcete kód skutočne presunúť, vypnite ho.",
      submit: "Presunúť kód",
      preview: "Skúšobný beh. Žiadna zmena sa nevykonala.",
      done: "Kód bol presunutý.",
      summary: "{{code}}: {{from}} → {{to}}",
    },
    note: "Správca {{admin}} presunul kód {{code}} z účtu {{from}} na účet {{to}} v čase {{at}}. Presunutí odporučení používatelia: {{referrals}}. Presunuté sledované odkazy: {{links}}. Doterajšie provízie zostali bez zmeny.",
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontrolujte kód a nového vlastníka",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Ak chcete presunúť kód, prihláste sa ako správca",
    },
    forbidden: {
      title: "Iba pre správcov",
      description: "Kódy odporúčaní môžu presunúť iba správcovia",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Kód alebo používateľ neexistuje",
    },
    conflict: {
      title: "Konflikt",
      description: "Nový vlastník už vlastní tento kód",
    },
    server: {
      title: "Chyba servera",
      description: "Kód sa nepodarilo presunúť",
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
    userNotFound: "Nenašiel sa používateľ zodpovedajúci {{target}}",
    alreadyOwner: "{{target}} už vlastní kód odporúčania {{code}}",
  },
  success: {
    title: "Hotovo",
    description: "Vlastník kódu odporúčania sa zmenil",
  },
};
