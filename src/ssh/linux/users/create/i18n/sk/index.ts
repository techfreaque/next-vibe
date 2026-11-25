import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "Bez prihlasovacieho shellu",
    },
  },

  errors: {
    localModeOnly: {
      title: "Len v miestnom režime",
    },
    invalidUsername:
      "Meno sa musí začínať písmenom. Ďalej môže obsahovať malé písmená, číslice a spojovníky. Najviac 32 znakov.",
    userAlreadyExists: "Účet s týmto používateľským menom už existuje",
    connectionNotFound: "SSH pripojenie nenájdené",
    encryptionFailed:
      "Šifrovanie zlyhalo. Skontrolujte hodnotu JWT_SECRET_KEY.",
    connectTimeout: "Čas na pripojenie vypršal",
    sshAuthFailed: "Overenie cez SSH zlyhalo",
    sshConnectionFailed: "Pripojenie SSH zlyhalo",
    sudoAuthFailed:
      "Overenie cez sudo zlyhalo. Skontrolujte heslo a oprávnenia na použitie sudo.",
    permissionDenied:
      "Prístup zamietnutý. Na vytvorenie systémového účtu zadajte heslo pre sudo.",
    fingerprintMismatch:
      "Odtlačok kľúča hostiteľa sa zmenil. Môže ísť o útok MITM. Pred pokračovaním nový odtlačok overte a potvrďte.",
  },

  post: {
    title: "Vytvoriť používateľa Linuxu",
    titleShort: "Vytvoriť používateľa",
    description:
      "Na cieľovom počítači sa príkazom useradd vytvorí nový používateľský účet. Účet môže vytvoriť iba správca.",
    fields: {
      connectionId: {
        label: "Pripojenie SSH",
        description:
          "Vyberte server, na ktorom chcete vytvoriť účet. Ak pole necháte prázdne, použije sa predvolené pripojenie alebo miestny režim.",
        placeholder: "Vyberte pripojenie…",
      },
      username: {
        label: "Používateľské meno",
        description:
          "Meno sa musí začínať písmenom. Ďalej môže obsahovať malé písmená, číslice a spojovníky. Najviac 32 znakov.",
        placeholder: "alice",
      },
      groups: {
        label: "Ďalšie skupiny",
        description:
          "Môžete pridať používateľa do ďalších skupín. Názvy oddeľte čiarkou, napríklad docker, www-data.",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Prihlasovací shell",
        description:
          "Shell, ktorý sa otvorí pri interaktívnom prihlásení používateľa.",
      },
      homeDir: {
        label: "Domovský adresár",
        description:
          "Cesta k domovskému adresáru používateľa. Ak ju nezadáte, použije sa /home/<username>.",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Udeliť oprávnenia sudo",
        description:
          "Zaradením do skupiny sudo umožníte používateľovi spúšťať príkazy ako root. Toto oprávnenie udeľujte uvážene.",
      },
      sudoPassword: {
        label: "Heslo pre sudo",
        description:
          "Heslo pre sudo na spustenie príkazu useradd so zvýšenými oprávneniami. Pri nastavenom sudo bez hesla nechajte pole prázdne.",
        placeholder: "Zadajte heslo pre sudo…",
      },
    },
    response: {
      ok: { title: "Úspech" },
      uid: { title: "UID" },
      gid: { title: "GID" },
      homeDirectory: { title: "Domovský adresár" },
      shell: { title: "Shell" },
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte polia formulára a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Miestny režim nie je na tomto serveri povolený",
      },
      server: {
        title: "Chyba servera",
        description: "Používateľský účet sa nepodarilo vytvoriť",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "SSH pripojenie nenájdené",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Toto používateľské meno sa už používa",
        description: "Na serveri už existuje účet s týmto používateľským menom",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa dosiahnuť server",
      },
      timeout: {
        title: "Časový limit",
        description: "Čas na spracovanie požiadavky vypršal",
      },
    },
    success: {
      title: "Používateľ sa vytvoril",
      description: "V systéme sa vytvoril používateľský účet",
    },
    submitButton: {
      text: "Vytvoriť používateľa",
      loadingText: "Vytvára sa…",
    },
  },
  widget: {
    title: "Vytvoriť používateľa Linuxu",
    createButton: "Vytvoriť používateľa",
    creating: "Vytvára sa…",
    sudoWarning:
      "Oprávnenie sudo dáva používateľovi práva účtu root. Udeľte ho iba používateľovi, ktorému úplne dôverujete.",
  },
};
