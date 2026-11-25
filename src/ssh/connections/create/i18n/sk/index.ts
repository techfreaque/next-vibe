import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Heslo",
      privateKey: "Súkromný kľúč (PEM)",
      keyAgent: "SSH agent",
      local: "Miestny počítač",
    },
  },

  errors: {
    sshSecretKeyNotSet:
      "Chýba premenná prostredia JWT_SECRET_KEY. Ak chcete zapnúť režim SSH, zadajte 32-bajtovú hodnotu v hexadecimálnom tvare.",
    encryptionFailed:
      "Šifrovanie zlyhalo. Skontrolujte hodnotu JWT_SECRET_KEY.",
    noRowReturned: "Databáza po vložení nevrátila žiadny riadok",
  },

  post: {
    title: "Vytvoriť pripojenie SSH",
    titleShort: "Vytvoriť pripojenie",
    description:
      "Uložte nové pripojenie SSH. Uložené prihlasovacie údaje chráni šifrovanie AES-256-GCM.",
    fields: {
      label: {
        label: "Názov",
        description: "Názov, podľa ktorého pripojenie spoznáte",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Hostiteľ alebo IP adresa",
        description: "Názov hostiteľa alebo IP adresa servera SSH",
        placeholder: "192.168.1.1",
      },
      port: {
        label: "Port",
        description: "Port servera SSH (predvolene 22)",
        placeholder: "22",
      },
      username: {
        label: "Používateľské meno",
        description: "Používateľské meno, pod ktorým sa prihlásite cez SSH",
        placeholder: "deploy",
      },
      authType: {
        label: "Spôsob overenia",
        description:
          "Prihláste sa heslom, súkromným kľúčom vo formáte PEM alebo cez systémového SSH agenta (SSH_AUTH_SOCK).",
      },
      secret: {
        label: "Heslo alebo súkromný kľúč",
        description:
          "Pri overení heslom zadajte heslo. Pri overení kľúčom vložte celý kľúč PEM vrátane riadka -----BEGIN ... KEY-----. Pri použití SSH agenta nechajte pole prázdne.",
        placeholder: "",
      },
      passphrase: {
        label: "Heslo k súkromnému kľúču",
        description:
          "Ak súkromný kľúč chráni heslo, zadajte ho sem. Pri nezašifrovanom kľúči nechajte pole prázdne.",
        placeholder: "",
      },
      isDefault: {
        label: "Nastaviť ako predvolené pripojenie",
        description:
          "Použiť toto pripojenie pre relácie AI, terminál a príkazy exec, keď nezadáte iné pripojenie.",
      },
      notes: {
        label: "Poznámky",
        description: "Voliteľné interné poznámky k tomuto pripojeniu",
        placeholder: "VPS za NAT, vyžaduje sa sprostredkujúci server",
      },
    },
    response: {
      id: { title: "ID pripojenia" },
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
        description: "Nemáte oprávnenie vytvárať pripojenia",
      },
      server: {
        title: "Chyba servera",
        description: "Pripojenie sa nepodarilo uložiť",
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
        title: "Tento názov sa už používa",
        description: "Pripojenie s týmto názvom už existuje",
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
      title: "Pripojenie sa uložilo",
      description: "Pripojenie SSH sa uložilo",
    },
    submitButton: {
      text: "Uložiť pripojenie",
      loadingText: "Ukladá sa…",
    },
  },
  widget: {
    title: "Nové pripojenie SSH",
    createButton: "Uložiť pripojenie",
    creating: "Ukladá sa…",
    testFirst: "Pred uložením otestujte pripojenie",
  },
};
