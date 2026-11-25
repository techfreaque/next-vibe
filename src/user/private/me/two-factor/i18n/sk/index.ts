import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profil používateľa",
  title: "Dvojfaktorové overenie",
  titleShort: "Dvojfaktorové overenie",
  description:
    "Chráň si účet jednorazovým kódom z overovacej aplikácie. Dvojfaktorové overenie môžeš zapnúť alebo vypnúť a vytvoriť nové kódy na obnovu prístupu.",
  tag: "two-factor",
  enums: {
    action: {
      status: "Stav",
      setup: "Spustiť nastavenie",
      enable: "Potvrdiť a zapnúť",
      disable: "Vypnúť",
      regenerate: "Vytvoriť nové kódy na obnovu prístupu",
    },
  },
  fields: {
    action: {
      label: "Akcia",
      description:
        "status, setup, enable, disable alebo regenerate. Akcia setup vráti tajný kľúč, akcia enable ho následne potvrdí kódom.",
    },
    code: {
      label: "Overovací kód",
      description:
        "Šesťmiestny kód z overovacej aplikácie alebo kód na obnovu prístupu.",
      placeholder: "123456",
    },
    password: {
      label: "Heslo",
      description: "Heslo k účtu (pri vypnutí ho možno použiť namiesto kódu).",
      placeholder: "Tvoje heslo",
    },
  },
  response: {
    enabled: "Dvojfaktorové overenie zapnuté",
    message: "Stav",
    recoveryCodesRemaining: "Zostávajúce kódy na obnovu prístupu",
    otpauthUri: "URI overovacej aplikácie",
    secret: "Tajný kľúč",
    qrDataUri: "QR kód",
    recoveryCodes: "Kódy na obnovu prístupu",
  },
  widget: {
    back: "Späť",
    statusOn: "Zapnuté",
    statusOff: "Vypnuté",
    offIntro:
      "Pridaj druhý krok prihlásenia. Ani s tvojím heslom sa nikto neprihlási bez kódu z tvojho telefónu.",
    startSetup: "Nastaviť dvojfaktorové overenie",
    setupStep1:
      "1. Naskenuj QR kód v overovacej aplikácii, napríklad Google Authenticator, Aegis, 1Password alebo Authy.",
    setupStep2: "Ak kód nemôžeš naskenovať, zadaj tento kľúč ručne:",
    setupStep3: "2. Potvrď nastavenie šesťmiestnym kódom z aplikácie.",
    confirm: "Potvrdiť a zapnúť",
    confirming: "Potvrdzuje sa…",
    cancelSetup: "Zrušiť",
    onIntro:
      "Pri prihlásení zadáš kód z overovacej aplikácie. Počet zostávajúcich kódov na obnovu prístupu: {{count}}.",
    recoveryTitle: "Ulož si kódy na obnovu prístupu",
    recoveryHint:
      "Ak stratíš telefón, každý kód môžeš použiť raz. Zobrazia sa iba teraz. Ulož si ich na bezpečné miesto.",
    recoveryCopy: "Kopírovať kódy",
    recoveryCopied: "Skopírované",
    recoveryDone: "Kódy mám uložené",
    manageTitle: "Spravovať",
    manageHint:
      "Ak chceš zmeniť nastavenia, zadaj aktuálny kód z overovacej aplikácie alebo kód na obnovu prístupu.",
    regenerate: "Vytvoriť nové kódy na obnovu prístupu",
    disable: "Vypnúť dvojfaktorové overenie",
    disablePasswordHint: "Môžeš to potvrdiť aj svojím heslom:",
    working: "Spracúva sa…",
  },
  errors: {
    notConfigured:
      "Dvojfaktorové overenie vyžaduje serverový kľúč JWT_SECRET_KEY. Kľúč nie je nastavený.",
    alreadyEnabled:
      "Dvojfaktorové overenie je už zapnuté. Ak ho chceš nastaviť znova, najprv ho vypni.",
    notEnabled: "Dvojfaktorové overenie nie je zapnuté.",
    noPendingSetup: "Nastavenie ešte neprebieha. Najprv ho spusti.",
    codeRequired: "Zadaj šesťmiestny kód.",
    invalidCode: "Kód je neplatný. Skontroluj čas v telefóne a skús znova.",
    credentialRequired:
      "Zadaj aktuálny kód, kód na obnovu prístupu alebo heslo.",
    invalidPassword: "Nesprávne heslo.",
    tooManyAttempts:
      "Príliš veľa nesprávnych pokusov. Počkaj pár minút a skús znova.",
    userNotFound: "Účet sa nenašiel.",
    failed: "Nastavenia dvojfaktorového overenia sa nepodarilo zmeniť.",
    validation: {
      title: "Chyba kontroly údajov",
      description: "Skontroluj zadané údaje a skús to znova",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na správu dvojfaktorového overenia sa musíš prihlásiť",
    },
    server: {
      title: "Chyba servera",
      description: "Dvojfaktorové overenie sa nepodarilo aktualizovať",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    network: {
      title: "Chyba siete",
      description: "Sieťové pripojenie zlyhalo",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáš na to oprávnenie",
    },
    notFound: {
      title: "Nenájdené",
      description: "Nepodarilo sa nájsť účet",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máš neuložené zmeny",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Vyskytol sa konflikt",
    },
  },
  success: {
    title: "Nastavenia dvojfaktorového overenia sa zmenili",
    description: "Nastavenia dvojfaktorového overenia sú uložené",
    status: "Stav dvojfaktorového overenia sa načítal.",
    setupStarted: "Naskenuj QR kód a zapnutie potvrď kódom z aplikácie.",
    enabled:
      "Dvojfaktorové overenie je zapnuté. Ulož si kódy na obnovu prístupu. Zobrazia sa len raz.",
    disabled: "Dvojfaktorové overenie je vypnuté.",
    regenerated:
      "Nové kódy na obnovu prístupu sú pripravené. Pôvodné už neplatia.",
  },
};
