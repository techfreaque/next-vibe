import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",
  type: "SSH",

  enums: {
    authType: {
      password: "Heslo",
      privateKey: "Súkromný kľúč (PEM)",
      keyAgent: "SSH agent",
      local: "Miestny počítač",
    },
    clusterRole: {
      none: "Bez úlohy v klastri",
      controlPlane: "Riadiaci uzol",
      worker: "Pracovný uzol",
      storage: "Úložisko",
    },
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "/usr/sbin/nologin",
    },
  },

  errors: {
    localModeOnly: {
      title: "Len v miestnom režime",
      description: "Táto funkcia je dostupná iba v režime LOCAL_MODE",
    },
    adminOnly: {
      title: "Len pre správcov",
      description: "K funkciám správy počítača majú prístup iba správcovia",
    },
    connectionNotFound: "Pripojenie sa nenašlo",
    sessionNotFound: "Relácia sa nenašla",
    fileNotFound: "Súbor sa nenašiel",
    directoryNotFound: "Adresár sa nenašiel",
    permissionDenied: "Prístup zamietnutý",
    sshSecretKeyNotSet:
      "Chýba premenná prostredia JWT_SECRET_KEY. Ak chcete zapnúť režim SSH, zadajte 32-bajtovú hodnotu v hexadecimálnom tvare.",
    encryptionFailed:
      "Šifrovanie zlyhalo. Skontrolujte hodnotu JWT_SECRET_KEY.",
    noRowReturned: "Databáza po vložení nevrátila žiadny riadok",
    notImplemented: {
      test: "Podpora SSH ešte nie je k dispozícii. Vzdialené pripojenia zatiaľ nemožno testovať.",
      local:
        "Podpora SSH ešte nie je k dispozícii. Ak chcete príkaz spustiť lokálne, nechajte connectionId prázdne.",
      fileList: "Výpis súborov cez SSH zatiaľ nie je dostupný",
      fileRead: "Čítanie súborov cez SSH zatiaľ nie je dostupné",
      fileWrite: "Zápis do súborov cez SSH zatiaľ nie je dostupný",
      session:
        "Relácie SSH s pseudoterminálom zatiaľ nie sú k dispozícii. Na spustenie vzdialeného príkazu použite ssh_exec_POST.",
    },
    fingerprintMismatch:
      "Odtlačok kľúča hostiteľa sa zmenil. Môže ísť o útok MITM. Po overení odtlačku pokračujte s acknowledgeNewFingerprint=true.",
    noDefaultConnection:
      "Chýba predvolené pripojenie SSH. Vytvorte pripojenie a nastavte ho ako predvolené.",
    sshConnectionFailed: "Pripojenie SSH zlyhalo",
    sshAuthFailed: "Overenie cez SSH zlyhalo",
    connectTimeout: "Čas na pripojenie vypršal",
    invalidWorkingDir:
      "Neplatný pracovný adresár. Zadajte absolútnu cestu bez častí „..“.",
    invalidPath: "Neplatná cesta. Zadajte absolútnu cestu bez častí „..“.",
    parentDirNotFound:
      "Nadradený adresár sa nenašiel. Ak ho chcete vytvoriť, nastavte createDirs=true.",
    commandTimedOut: "Čas na vykonanie príkazu vypršal",
    cannotDeleteCurrentUser:
      "Používateľa, pod ktorým beží tento proces, nemožno odstrániť",
    cannotDeleteSystemUser:
      "Systémových používateľov (UID < 1000) nemožno odstrániť",
    userNotFound: "Používateľ sa nenašiel",
    userAlreadyExists: "Používateľ už existuje",
    invalidUsername:
      "Neplatné používateľské meno. Musí sa začínať písmenom a môže obsahovať malé písmená, číslice a spojovníky.",
  },

  session: {
    read: {
      get: {
        title: "Načítať výstup relácie SSH",
        description:
          "Načítať výstup z vyrovnávacej pamäte aktívnej relácie SSH",
        fields: {
          sessionId: {
            label: "ID relácie",
            description: "ID relácie SSH, ktorej výstup sa má načítať",
          },
          waitMs: {
            label: "Čakanie (ms)",
            description: "Koľko milisekúnd čakať na výstup",
          },
          maxBytes: {
            label: "Maximálny počet bajtov",
            description: "Najvyšší počet bajtov na načítanie",
          },
        },
        response: {
          output: { title: "Výstup" },
          eof: { title: "EOF" },
          status: { title: "Stav" },
        },
        success: {
          title: "Výstup relácie načítaný",
          description: "Výstup relácie SSH sa úspešne načítal",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre na načítanie výstupu relácie",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Výstup relácie sa nepodarilo načítať",
          },
          notFound: {
            title: "Relácia sa nenašla",
            description: "Relácia SSH sa nenašla",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
    close: {
      post: {
        title: "Zavrieť reláciu SSH",
        description: "Zavrieť aktívnu reláciu SSH",
        fields: {
          sessionId: {
            label: "ID relácie",
            description: "ID relácie SSH, ktorá sa má zavrieť",
          },
        },
        response: {
          ok: { title: "Úspech" },
        },
        success: {
          title: "Relácia bola zavretá",
          description: "Relácia SSH bola úspešne zavretá",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre na zavretie relácie",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Reláciu sa nepodarilo zavrieť",
          },
          notFound: {
            title: "Relácia sa nenašla",
            description: "Relácia SSH sa nenašla",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
    write: {
      post: {
        title: "Zapísať do relácie SSH",
        description: "Odoslať vstup do aktívnej relácie SSH",
        fields: {
          sessionId: {
            label: "ID relácie",
            description: "ID relácie SSH, do ktorej sa má zapísať",
          },
          input: {
            label: "Vstup",
            description: "Text, ktorý sa má odoslať do relácie",
          },
          raw: {
            label: "Surové bajty",
            description:
              "Odoslať vstup ako surové bajty bez znaku nového riadka",
          },
        },
        response: {
          ok: { title: "Úspech" },
        },
        success: {
          title: "Vstup odoslaný",
          description: "Vstup bol úspešne zapísaný do relácie",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre zápisu",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Do relácie sa nepodarilo zapísať",
          },
          notFound: {
            title: "Relácia sa nenašla",
            description: "Relácia SSH sa nenašla",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
    open: {
      post: {
        title: "Otvoriť reláciu SSH",
        description: "Otvoriť interaktívnu reláciu terminálu SSH",
        fields: {
          connectionId: {
            label: "ID pripojenia",
            description: "ID pripojenia SSH, ktoré sa má použiť",
          },
          name: {
            label: "Názov relácie",
            description: "Nepovinný názov relácie",
          },
          cols: {
            label: "Stĺpce",
            description: "Šírka terminálu v stĺpcoch",
          },
          rows: {
            label: "Riadky",
            description: "Výška terminálu v riadkoch",
          },
        },
        disconnected: "Odpojené",
        response: {
          sessionId: { title: "ID relácie" },
          status: { title: "Stav" },
          shell: { title: "Príkazový interpret" },
        },
        success: {
          title: "Relácia otvorená",
          description: "Relácia SSH bola úspešne otvorená",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre relácie",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Reláciu sa nepodarilo otvoriť",
          },
          notFound: {
            title: "Pripojenie sa nenašlo",
            description: "Pripojenie SSH sa nenašlo",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
  },

  terminal: {
    get: {
      title: "Terminál SSH",
      description: "Interaktívny terminál SSH",
      response: {
        ok: { title: "Terminál pripravený" },
      },
      success: {
        title: "Terminál pripravený",
        description: "Terminál SSH je pripravený",
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa overenie",
        },
        server: { title: "Chyba servera", description: "Chyba terminálu" },
        unknown: {
          title: "Neznáma chyba",
          description: "Vyskytla sa neočakávaná chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
        notFound: {
          title: "Nenašlo sa",
          description: "Požadovaný zdroj sa nenašiel",
        },
        conflict: {
          title: "Konflikt údajov",
          description: "Vyskytol sa konflikt",
        },
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Overenie vstupu zlyhalo",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
      },
    },
  },

  files: {
    read: {
      get: {
        title: "Načítať vzdialený súbor",
        description: "Načítať obsah súboru cez SSH",
        fields: {
          connectionId: {
            label: "ID pripojenia",
            description: "Pripojenie SSH, ktoré sa má použiť",
            placeholder: "uuid",
          },
          path: {
            label: "Cesta k súboru",
            description: "Absolútna cesta k súboru",
            placeholder: "/etc/hosts",
          },
          maxBytes: {
            label: "Maximálny počet bajtov",
            description: "Najvyšší počet bajtov na načítanie",
            placeholder: "102400",
          },
          offset: {
            label: "Posun",
            description: "Bajtový posun, od ktorého sa začne načítavanie",
            placeholder: "0",
          },
        },
        response: {
          content: { title: "Obsah" },
          size: { title: "Veľkosť" },
          truncated: { title: "Skrátené" },
          encoding: { title: "Kódovanie" },
        },
        success: {
          title: "Súbor načítaný",
          description: "Obsah súboru bol úspešne načítaný",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre na načítanie súboru",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Súbor sa nepodarilo načítať",
          },
          notFound: {
            title: "Súbor sa nenašiel",
            description: "Súbor alebo pripojenie sa nenašli",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
    list: {
      get: {
        title: "Zobraziť vzdialené súbory",
        description: "Zobraziť súbory vo vzdialenom adresári cez SSH",
        fields: {
          connectionId: {
            label: "ID pripojenia",
            description: "Pripojenie SSH, ktoré sa má použiť",
            placeholder: "uuid",
          },
          path: {
            label: "Adresár",
            description: "Absolútna cesta k adresáru",
            placeholder: "/",
          },
        },
        response: {
          entries: { title: "Položky" },
          currentPath: { title: "Aktuálna cesta" },
        },
        success: {
          title: "Výpis adresára pripravený",
          description: "Obsah adresára bol úspešne načítaný",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre výpisu",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Obsah adresára sa nepodarilo vypísať",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Adresár alebo pripojenie sa nenašli",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
    write: {
      post: {
        title: "Zapísať vzdialený súbor",
        description: "Zapísať obsah do súboru cez SSH",
        fields: {
          connectionId: {
            label: "ID pripojenia",
            description: "Pripojenie SSH, ktoré sa má použiť",
            placeholder: "uuid",
          },
          path: {
            label: "Cesta k súboru",
            description: "Absolútna cesta k súboru na zápis",
            placeholder: "/tmp/file.txt",
          },
          content: {
            label: "Obsah",
            description: "Obsah, ktorý sa má zapísať do súboru",
            placeholder: "obsah súboru",
          },
          createDirs: {
            label: "Vytvoriť adresáre",
            description: "Vytvoriť nadradené adresáre, ak neexistujú",
          },
        },
        response: {
          ok: { title: "Úspech" },
          bytesWritten: { title: "Zapísané bajty" },
        },
        success: {
          title: "Súbor zapísaný",
          description: "Súbor bol úspešne zapísaný",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre zápisu do súboru",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Do súboru sa nepodarilo zapísať",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Cesta alebo pripojenie sa nenašli",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
  },

  linux: {
    users: {
      list: {
        get: {
          title: "Zobraziť používateľov Linuxu",
          description:
            "Vypísať používateľov Linuxu na vzdialenom serveri cez SSH",
          response: {
            users: { title: "Používatelia" },
          },
          success: {
            title: "Zoznam používateľov pripravený",
            description: "Zoznam používateľov Linuxu bol úspešne načítaný",
          },
          errors: {
            validation: {
              title: "Neplatné údaje",
              description: "Overenie vstupu zlyhalo",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Vyžaduje sa overenie",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Prístup zamietnutý",
            },
            server: {
              title: "Chyba servera",
              description: "Zoznam používateľov sa nepodarilo načítať",
            },
            notFound: {
              title: "Nenašlo sa",
              description: "Požadovaný zdroj sa nenašiel",
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
              title: "Konflikt údajov",
              description: "Vyskytol sa konflikt",
            },
            network: {
              title: "Chyba siete",
              description: "Vyskytla sa chyba siete",
            },
          },
        },
      },
      username: {
        delete: {
          title: "Odstrániť používateľa Linuxu",
          description:
            "Odstrániť používateľa Linuxu zo vzdialeného servera cez SSH",
          fields: {
            removeHome: {
              label: "Odstrániť domovský adresár",
              description: "Odstrániť aj domovský adresár používateľa",
            },
          },
          response: {
            ok: { title: "Úspech" },
          },
          success: {
            title: "Používateľ odstránený",
            description: "Používateľ Linuxu bol úspešne odstránený",
          },
          errors: {
            validation: {
              title: "Neplatné údaje",
              description: "Overenie vstupu zlyhalo",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Vyžaduje sa overenie",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Prístup zamietnutý",
            },
            server: {
              title: "Chyba servera",
              description: "Používateľa sa nepodarilo odstrániť",
            },
            notFound: {
              title: "Používateľ sa nenašiel",
              description: "Používateľ Linuxu sa nenašiel",
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
              title: "Konflikt údajov",
              description: "Vyskytol sa konflikt",
            },
            network: {
              title: "Chyba siete",
              description: "Vyskytla sa chyba siete",
            },
          },
        },
      },
      create: {
        post: {
          title: "Vytvoriť používateľa Linuxu",
          description:
            "Vytvoriť používateľa Linuxu na vzdialenom serveri cez SSH",
          fields: {
            username: {
              label: "Používateľské meno",
              description: "Používateľské meno nového účtu",
              placeholder: "deploy",
            },
            groups: {
              label: "Skupiny",
              description: "Ďalšie skupiny, do ktorých sa má používateľ pridať",
              placeholder: "sudo,docker",
            },
            shell: {
              label: "Príkazový interpret",
              description: "Prihlasovací interpret používateľa",
              placeholder: "/bin/bash",
            },
            homeDir: {
              label: "Domovský adresár",
              description: "Cesta k domovskému adresáru",
              placeholder: "/home/deploy",
            },
            sudoAccess: {
              label: "Oprávnenie sudo",
              description: "Udeliť používateľovi oprávnenie sudo",
            },
          },
          response: {
            ok: { title: "Úspech" },
            uid: { title: "UID" },
            gid: { title: "GID" },
            homeDirectory: { title: "Domovský adresár" },
            shell: { title: "Príkazový interpret" },
          },
          success: {
            title: "Používateľ vytvorený",
            description: "Používateľ Linuxu bol úspešne vytvorený",
          },
          errors: {
            validation: {
              title: "Neplatné údaje",
              description: "Overenie vstupu zlyhalo",
            },
            unauthorized: {
              title: "Vyžaduje sa prihlásenie",
              description: "Vyžaduje sa overenie",
            },
            forbidden: {
              title: "Prístup zamietnutý",
              description: "Prístup zamietnutý",
            },
            server: {
              title: "Chyba servera",
              description: "Používateľa sa nepodarilo vytvoriť",
            },
            notFound: {
              title: "Nenašlo sa",
              description: "Pripojenie sa nenašlo",
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
              title: "Konflikt údajov",
              description: "Vyskytol sa konflikt",
            },
            network: {
              title: "Chyba siete",
              description: "Vyskytla sa chyba siete",
            },
          },
        },
      },
    },
  },

  exec: {
    post: {
      title: "Spustiť príkaz cez SSH",
      description: "Spustiť príkaz na vzdialenom serveri cez SSH",
      fields: {
        connectionId: {
          label: "ID pripojenia",
          description: "Pripojenie SSH, ktoré sa má použiť",
          placeholder: "uuid",
        },
        command: {
          label: "Príkaz",
          description: "Príkaz na spustenie",
          placeholder: "ls -la",
        },
        workingDir: {
          label: "Pracovný adresár",
          description: "Pracovný adresár príkazu",
          placeholder: "/home/user",
        },
        timeoutMs: {
          label: "Časový limit (ms)",
          description: "Časový limit príkazu v milisekundách",
          placeholder: "30000",
        },
      },
      response: {
        stdout: { title: "Štandardný výstup (stdout)" },
        stderr: { title: "Štandardný chybový výstup (stderr)" },
        exitCode: { title: "Návratový kód" },
        status: { title: "Stav" },
        durationMs: { title: "Trvanie (ms)" },
        backend: { title: "Backend" },
        truncated: { title: "Skrátené" },
      },
      success: {
        title: "Príkaz vykonaný",
        description: "Príkaz bol úspešne vykonaný",
      },
      errors: {
        validation: {
          title: "Neplatné údaje",
          description: "Neplatné parametre príkazu",
        },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Vyžaduje sa overenie",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Prístup zamietnutý",
        },
        server: {
          title: "Chyba servera",
          description: "Príkaz sa nepodarilo vykonať",
        },
        notFound: {
          title: "Pripojenie sa nenašlo",
          description: "Pripojenie SSH sa nenašlo",
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
          title: "Konflikt údajov",
          description: "Vyskytol sa konflikt",
        },
        network: {
          title: "Chyba siete",
          description: "Vyskytla sa chyba siete",
        },
      },
    },
  },

  connections: {
    id: {
      get: {
        title: "Načítať pripojenie SSH",
        description: "Načítať podrobnosti pripojenia SSH",
        response: {
          id: { title: "ID" },
          label: { title: "Názov" },
          host: { title: "Hostiteľ" },
          port: { title: "Port" },
          username: { title: "Používateľské meno" },
          authType: { title: "Spôsob overenia" },
          isDefault: { title: "Predvolené pripojenie" },
          fingerprint: { title: "Odtlačok kľúča" },
          notes: { title: "Poznámky" },
          createdAt: { title: "Dátum vytvorenia" },
        },
        success: {
          title: "Pripojenie nájdené",
          description: "Údaje o pripojení SSH boli úspešne načítané",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Overenie vstupu zlyhalo",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Údaje o pripojení sa nepodarilo načítať",
          },
          notFound: {
            title: "Pripojenie sa nenašlo",
            description: "Pripojenie SSH sa nenašlo",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
    list: {
      get: {
        title: "Zobraziť pripojenia SSH",
        description: "Vypísať všetky pripojenia SSH",
        response: {
          connections: { title: "Pripojenia" },
        },
        success: {
          title: "Zoznam pripojení pripravený",
          description: "Zoznam pripojení SSH bol úspešne načítaný",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Overenie vstupu zlyhalo",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Zoznam pripojení sa nepodarilo načítať",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Nenašli sa žiadne pripojenia",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
    create: {
      post: {
        title: "Vytvoriť pripojenie SSH",
        description: "Vytvoriť nové pripojenie SSH",
        fields: {
          label: {
            label: "Názov",
            description: "Zrozumiteľný názov pripojenia",
            placeholder: "prod-web-01",
          },
          host: {
            label: "Hostiteľ",
            description: "Názov hostiteľa alebo IP adresa servera SSH",
            placeholder: "192.168.1.1",
          },
          port: {
            label: "Port",
            description: "Port servera SSH",
            placeholder: "22",
          },
          username: {
            label: "Používateľské meno",
            description: "Používateľské meno SSH",
            placeholder: "deploy",
          },
          authType: {
            label: "Spôsob overenia",
            description: "Spôsob overenia",
          },
          secret: {
            label: "Tajný údaj",
            description: "Heslo alebo súkromný kľúč",
          },
          passphrase: {
            label: "Prístupová fráza",
            description: "Prístupová fráza súkromného kľúča (ak ju má)",
          },
          isDefault: {
            label: "Predvolené",
            description: "Nastaviť ako predvolené pripojenie",
          },
          clusterRole: {
            label: "Úloha v klastri",
            description: "Rola servera v klastri Kubernetes",
          },
          notes: {
            label: "Poznámky",
            description: "Voliteľné poznámky k tomuto pripojeniu",
          },
        },
        response: {
          id: { title: "ID" },
        },
        success: {
          title: "Pripojenie vytvorené",
          description: "Pripojenie SSH bolo úspešne vytvorené",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre pripojenia",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Pripojenie sa nepodarilo vytvoriť",
          },
          notFound: {
            title: "Nenašlo sa",
            description: "Požadovaný zdroj sa nenašiel",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
    test: {
      post: {
        title: "Otestovať pripojenie SSH",
        description: "Overiť funkčnosť pripojenia SSH",
        fields: {
          connectionId: {
            label: "ID pripojenia",
            description: "ID pripojenia SSH, ktoré sa má otestovať",
            placeholder: "uuid",
          },
          acknowledgeNewFingerprint: {
            label: "Potvrdiť odtlačok",
            description: "Potvrdiť nový odtlačok hostiteľa",
            placeholder: "false",
          },
        },
        response: {
          ok: { title: "Úspech" },
          latencyMs: { title: "Latencia (ms)" },
          fingerprint: { title: "Odtlačok kľúča" },
          fingerprintChanged: { title: "Odtlačok sa zmenil" },
        },
        success: {
          title: "Pripojenie funguje",
          description: "Test pripojenia SSH prebehol úspešne",
        },
        errors: {
          validation: {
            title: "Neplatné údaje",
            description: "Neplatné parametre testu",
          },
          unauthorized: {
            title: "Vyžaduje sa prihlásenie",
            description: "Vyžaduje sa overenie",
          },
          forbidden: {
            title: "Prístup zamietnutý",
            description: "Prístup zamietnutý",
          },
          server: {
            title: "Chyba servera",
            description: "Test pripojenia zlyhal",
          },
          notFound: {
            title: "Pripojenie sa nenašlo",
            description: "Pripojenie SSH sa nenašlo",
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
            title: "Konflikt údajov",
            description: "Vyskytol sa konflikt",
          },
          network: {
            title: "Chyba siete",
            description: "Vyskytla sa chyba siete",
          },
        },
      },
    },
  },
};
