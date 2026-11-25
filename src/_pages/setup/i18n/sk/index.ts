import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nastavenie {{appName}}",
    description: "Úvodné nastavenie vlastnej inštancie.",
  },
  stepOf: "Krok {{current}} z {{total}}",
  steps: {
    admin: "Prihlásenie správcu",
    ai: "Pripojenie AI",
    extras: "Ďalšie možnosti",
    done: "Hotovo",
  },
  back: "Obnovený",
  continue: "Pokračovať",
  getKey: "Získať kľúč",
  secretSaved: "Uložené. Ak chcete hodnotu ponechať, pole nechajte prázdne.",
  errors: {
    saveFailed:
      "Uloženie zlyhalo. Skontrolujte terminál, v ktorom beží vibe dev, a skúste to znova.",
  },
  restart: {
    title: "Používajú sa nové nastavenia",
    body: "Inštancia sa reštartuje a načíta nové nastavenia. Stránka sa o niekoľko sekúnd sama obnoví.",
    slow: "Trvá to dlhšie ako zvyčajne?",
    reload: "Obnoviť stránku",
    manualTitle: "Uložené",
    manualBody:
      "Nové nastavenia sa prejavia po reštartovaní servera. Dovtedy môžete pokračovať v práci.",
    continue: "Pokračovať",
  },
  welcome: {
    title: "Vaša inštancia je spustená.",
    body: "Nastavte si vlastné prihlasovacie údaje správcu a pripojte poskytovateľa AI. O dve minúty môžete začať četovať.",
    inProgress:
      "Nastavenie tejto inštancie už začalo. Dokončite ho po prihlásení ako správca.",
    failed:
      "Predvolenými údajmi správcu sa nepodarilo prihlásiť. Ak ste ich už zmenili, použite vlastné údaje.",
    start: "Spustiť nastavenie",
    starting: "Spúšťa sa",
    signIn: "Prihlásiť sa ako správca",
  },
  readOnly: {
    title: "Nastavenia sú tu iba na čítanie",
    body: "Inštancia preberá nastavenia z prostredia nasadenia. Upravte ich priamo v danom prostredí a potom inštanciu reštartujte.",
  },
  admin: {
    title: "Vytvorte si prihlasovacie údaje správcu",
    body: "Nové údaje nahradia predvolené. Budete sa nimi prihlasovať tu aj v príkazovom riadku vibe.",
    email: "E-mail",
    emailHelp:
      "Slúži ako vaše prihlasovacie meno. Žiadne správy naň neposielame.",
    emailPlaceholder: "you@example.com",
    password: "Heslo",
    passwordHelp:
      "Aspoň 8 znakov. Heslo sa na tomto zariadení uloží zašifrované.",
    confirm: "Zopakujte heslo",
    save: "Uložiť a pokračovať",
    errors: {
      email: "Zadajte platnú e-mailovú adresu.",
      passwordShort: "Použite aspoň 8 znakov.",
      passwordDefault: "Zvoľte si vlastné heslo odlišné od predvoleného.",
      mismatch: "Heslá sa nezhodujú.",
    },
  },
  ai: {
    title: "Pripojenie AI",
    body: "Vyberte zdroj modelov. Stačí jedna možnosť, ďalšie môžete pridať kedykoľvek.",
    byo: "Alebo použite vlastné kľúče",
    moreProviders: "Ďalší poskytovatelia",
    skip: "Zatiaľ preskočiť",
    unbottled: {
      title: "Váš účet na unbottled.ai",
      recommended: "Odporúčané",
      body: "Po jednom prihlásení získate prístup ku všetkým modelom na unbottled.ai vrátane bežných, otvorených aj necenzurovaných. Platíte kreditmi z účtu na unbottled.ai a nemusíte spravovať kľúče jednotlivých poskytovateľov.",
      email: "E-mail účtu na unbottled.ai",
      password: "Heslo účtu na unbottled.ai",
      advanced: "Rozšírené nastavenia",
      serverUrl: "URL servera",
      serverUrlHelp:
        "Adresu zmeňte iba vtedy, ak chcete pripojiť inú inštanciu next-vibe.",
      failed: "Prihlásenie zlyhalo. Skontrolujte e-mail a heslo.",
      connect: "Pripojiť účet",
      connecting: "Pripája sa",
      connected: "Pripojené k {{url}}",
      unhealthy: "Pripojenie sa uložilo, ale server momentálne neodpovedá.",
      disconnect: "Odpojiť",
      noAccount: "Ešte nemáte účet?",
      createAccount: "Vytvoriť účet",
    },
    claude: {
      title: "Claude Code",
      detectedBadge: "Zistené v systéme",
      missingBadge: "Nie je nainštalované",
      detected:
        "Claude Code je už na tomto zariadení. Modely Claude budú využívať vaše predplatné Claude. Nemusíte nič zadávať.",
      missing:
        "Ak chcete použiť predplatné Claude, nainštalujte nástroj claude CLI a prihláste sa. Potom reštartujte vibe dev.",
    },
  },
  fields: {
    openRouter: {
      label: "Kľúč API pre OpenRouter",
      help: "Jeden kľúč pre stovky modelov.",
    },
    venice: {
      label: "Kľúč API pre Venice AI",
      help: "Súkromné, necenzurované modely.",
    },
    nanoGpt: {
      label: "Kľúč API pre NanoGPT",
      help: "Necenzurované modely aj modely s odstráneným mechanizmom odmietania. Platba kryptomenou.",
    },
    openAi: {
      label: "Kľúč API pre OpenAI",
      help: "Tvorba obrázkov pomocou modelov gpt-image.",
    },
    smtpHost: {
      label: "Server SMTP",
      help: "Váš poštový server, napríklad smtp.example.com.",
    },
    smtpPort: {
      label: "Port",
      help: "Zvyčajne 587 alebo 465 pri použití TLS.",
    },
    smtpSecure: {
      label: "Použiť TLS",
      help: "Zapnite pri porte 465.",
    },
    smtpUser: {
      label: "Používateľské meno",
      help: "Zvyčajne celá vaša e-mailová adresa.",
    },
    smtpPass: {
      label: "Heslo",
      help: "Gmail a väčšina veľkých poskytovateľov tu vyžadujú heslo pre aplikáciu.",
    },
    smtpFromEmail: {
      label: "Adresa odosielateľa",
      help: "Z tejto adresy budú prichádzať e-maily.",
    },
    smtpFromName: {
      label: "Meno odosielateľa",
      help: "Zobrazí sa ako meno odosielateľa. Môžete použiť napríklad názov inštancie.",
    },
    stripeSecret: {
      label: "Tajný kľúč",
      help: "Začína sa na sk_. Môžete použiť aj testovací kľúč.",
    },
    stripePublishable: {
      label: "Verejný kľúč",
      help: "Začína sa na pk_.",
    },
    stripeWebhook: {
      label: "Tajný kľúč na podpisovanie webhookov",
      help: "Začína sa na whsec_. Slúži na overenie oznámení o platbách doručených vašej inštancii.",
    },
    storageType: {
      label: "Umiestnenie súborov",
      help: "Nahraté súbory, obrázky a zvuk z četov.",
      optionFilesystem: "Na tomto zariadení",
      optionS3: "Úložisko kompatibilné s S3",
    },
    s3Endpoint: {
      label: "URL koncového bodu",
      help: "Adresa koncového bodu S3 vášho poskytovateľa, napríklad https://s3.amazonaws.com.",
    },
    s3Region: {
      label: "Región",
      help: "Napríklad us-east-1. Niektorí poskytovatelia podporujú aj hodnotu auto.",
    },
    s3Bucket: {
      label: "Kontajner (bucket)",
      help: "Kontajner už musí existovať.",
    },
    s3AccessKey: {
      label: "ID prístupového kľúča",
      help: "Nájdete ho v zozname prístupových kľúčov u poskytovateľa úložiska.",
    },
    s3SecretKey: {
      label: "Tajný prístupový kľúč",
      help: "Zobrazí sa iba raz, pri vytvorení prístupového kľúča.",
    },
    s3PublicUrl: {
      label: "Verejná adresa URL",
      help: "Voliteľná adresa CDN alebo verejného kontajnera pre odkazy na súbory.",
    },
  },
  extras: {
    title: "Voliteľné nastavenia",
    body: "Na čet ich nepotrebujete. Môžete ich preskočiť a vrátiť sa k nim neskôr.",
    configured: "Nastavené",
    finish: "Dokončiť nastavenie",
    skipFinish: "Preskočiť a dokončiť",
    errors: {
      s3Incomplete:
        "Pre úložisko S3 zadajte koncový bod, región, názov kontajnera (bucket) a oba kľúče.",
    },
    sections: {
      email: {
        title: "E-mail",
        body: "Potvrdzovanie registrácie a obnova hesla cez váš server SMTP.",
      },
      payments: {
        title: "Platby",
        body: "Predávajte kredity a predplatné cez Stripe.",
      },
      storage: {
        title: "Úložisko súborov",
        body: "Súbory z četov zostanú na tomto zariadení, pokiaľ nevyberiete S3.",
      },
    },
  },
  done: {
    title: "Všetko je pripravené",
    body: "Vaša inštancia je nastavená a máte ju pod kontrolou.",
    admin: "Prihlásenie správcu: {{email}}",
    aiUnbottled: "AI: váš účet na unbottled.ai",
    aiKeys: "AI: vaše kľúče poskytovateľov",
    aiClaude: "AI: Claude Code na tomto zariadení",
    aiNone:
      "Zatiaľ ste nepripojili žiadnu AI. Na čet potrebujete aspoň jedného poskytovateľa. Kedykoľvek ho môžete pridať v nastaveniach správcu.",
    start: "Začať četovať",
    later: "Všetky tieto voľby môžete neskôr zmeniť v nastaveniach správcu.",
  },
};
