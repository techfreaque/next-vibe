import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Infraštruktúra",
  type: "Infraštruktúra",

  enums: {
    infraStatus: {
      pending: "Čaká",
      provisioning: "Vytvára sa",
      ready: "Pripravené",
      degraded: "Obmedzená prevádzka",
      error: "Chyba",
    },
    componentStatus: {
      unknown: "Neznáme",
      healthy: "V poriadku",
      degraded: "Obmedzená prevádzka",
      down: "Nedostupné",
    },
    scaleComponent: {
      web: "Web (Next.js)",
      tasks: "Spúšťač úloh",
      storage: "Úložisko (MinIO)",
    },
  },

  errors: {
    noControlPlane:
      "Žiadne pripojenie SSH nemá štítok control-plane. Najprv ho priraďte serveru v nastaveniach SSH.",
    noClusterNodes:
      "Žiadne pripojenie SSH nemá štítok pre uzol klastra. Priraďte aspoň jednému serveru štítok control-plane.",
    kubeconfigMissing:
      "Súbor kubeconfig sa nenašiel. Najprv spustite cluster-init.",
    pulumiNotInstalled:
      "Rozhranie Pulumi CLI nie je nainštalované. Nainštalujte ho príkazom curl -fsSL https://get.pulumi.com | sh",
    sshExecFailed: "Príkaz SSH zlyhal na uzle",
    k3sInstallFailed: "Inštalácia k3s zlyhala",
    scaleTargetNotFound: "Nasadenie sa v klastri nenašlo",
    connectionNotFound: "Pripojenie SSH sa nenašlo",
    encryptionFailed: "Nepodarilo sa dešifrovať prihlasovacie údaje",
    connectTimeout: "Vypršal časový limit pripojenia SSH",
    sshAuthFailed: "Autentifikácia SSH zlyhala",
    sshConnectionFailed: "Pripojenie SSH zlyhalo",
    fingerprintMismatch: "Odtlačok kľúča hostiteľa SSH sa nezhoduje",
  },

  cluster: {
    init: {
      post: {
        title: "Inicializovať klaster",
        titleShort: "Inicializovať klaster",
        description:
          "Nainštaluje k3s, databázy, Redis, MinIO a ingress na serveroch SSH s príslušnými štítkami.",
        container: { title: "Inicializácia klastra" },
        fields: {
          clusterName: {
            label: "Názov klastra",
            description: "Názov klastra pre kubeconfig a štítky",
            placeholder: "next-vibe-prod",
          },
          domain: {
            label: "Doména",
            description:
              "Základná doména pre ingress (napr. example.com → app.example.com)",
            placeholder: "example.com",
          },
          email: {
            label: "E-mail",
            description:
              "Kontaktný e-mail pre certifikáty TLS od Let's Encrypt",
            placeholder: "admin@example.com",
          },
          k3sVersion: {
            label: "Verzia k3s",
            description: "Vydanie k3s na inštaláciu",
            placeholder: "v1.31.0+k3s1",
          },
          dryRun: {
            label: "Náhľad bez zmien",
            description: "Zobrazí plán inštalácie bez vykonania zmien.",
          },
          skipDatabase: {
            label: "Preskočiť databázu",
            description: "Preskočí inštaláciu PostgreSQL cez CloudNativePG.",
          },
          skipRedis: {
            label: "Preskočiť Redis",
            description: "Preskočiť inštaláciu Redis Sentinel",
          },
          skipStorage: {
            label: "Preskočiť úložisko",
            description: "Preskočí inštaláciu distribuovaného úložiska MinIO.",
          },
          skipIngress: {
            label: "Preskočiť ingress",
            description: "Preskočí inštaláciu nginx-ingress a cert-manager.",
          },
        },
        response: {
          success: { title: "Úspech" },
          message: { title: "Správa" },
          nodesProvisioned: { title: "Pripravené uzly" },
          componentsInstalled: { title: "Inštalované komponenty" },
          kubeconfig: { title: "Kubeconfig" },
          duration: { title: "Trvanie (ms)" },
        },
        success: {
          title: "Klaster je pripravený",
          description: "Klaster k3s je pripravený na používanie.",
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Neplatná konfigurácia klastra",
          },
          unauthorized: {
            title: "Bez oprávnenia",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Vyžaduje sa oprávnenie správcu.",
          },
          server: {
            title: "Príprava klastra zlyhala",
            description: "Inicializácia klastra zlyhala",
          },
          notFound: {
            title: "Nenašli sa žiadne uzly",
            description:
              "Žiadne pripojenie SSH nie je označené ako uzol klastra",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Zistili sa neuložené zmeny",
          },
          conflict: {
            title: "Konflikt",
            description: "Klaster už existuje alebo sa práve vytvára",
          },
          network: {
            title: "Chyba siete",
            description: "Nepodarilo sa pripojiť k uzlom klastra",
          },
        },
      },
    },
    status: {
      get: {
        title: "Stav klastra",
        titleShort: "Stav klastra",
        description:
          "Zobrazí stav uzlov Kubernetes, počet podov a stav komponentov.",
        container: { title: "Stav klastra" },
        response: {
          nodes: { title: "Uzly" },
          components: { title: "Komponenty" },
          overallStatus: { title: "Celkový stav" },
          podCounts: { title: "Počet podov" },
        },
        success: {
          title: "Stav načítaný",
          description: "Stav klastra sa úspešne načítal",
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Neplatné parametre",
          },
          unauthorized: {
            title: "Bez oprávnenia",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Vyžaduje sa oprávnenie správcu.",
          },
          server: {
            title: "Chyba servera",
            description: "Nepodarilo sa získať stav klastra",
          },
          notFound: {
            title: "Žiadny klaster",
            description:
              "Klaster nie je nakonfigurovaný. Najprv spustite cluster-init.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Zistili sa neuložené zmeny",
          },
          conflict: { title: "Konflikt", description: "Nastal konflikt" },
          network: {
            title: "Chyba siete",
            description: "Nepodarilo sa pripojiť ku klastru",
          },
        },
      },
    },
  },

  deploy: {
    push: {
      post: {
        title: "Nasadiť",
        titleShort: "Nasadiť",
        description: "Nasadí zmeny infraštruktúry cez Pulumi (pulumi up).",
        container: { title: "Nasadiť" },
        fields: {
          stack: {
            label: "Zásobník",
            description: "Názov zásobníka Pulumi",
            placeholder: "prod",
          },
          skipPreview: {
            label: "Preskočiť náhľad",
            description: "Vykoná zmeny bez predchádzajúceho náhľadu.",
          },
        },
        response: {
          success: { title: "Úspech" },
          message: { title: "Správa" },
          changes: { title: "Zmeny" },
          duration: { title: "Trvanie (ms)" },
        },
        success: {
          title: "Nasadené",
          description: "Infraštruktúra bola úspešne nasadená.",
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Neplatná konfigurácia nasadenia",
          },
          unauthorized: {
            title: "Bez oprávnenia",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Vyžaduje sa oprávnenie správcu.",
          },
          server: {
            title: "Nasadenie zlyhalo",
            description: "Príkaz pulumi up zlyhal",
          },
          notFound: {
            title: "Žiadny klaster",
            description: "Nie je nakonfigurovaný žiadny klaster.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Zistili sa neuložené zmeny",
          },
          conflict: {
            title: "Konflikt",
            description: "Nasadenie už prebieha",
          },
          network: {
            title: "Chyba siete",
            description: "Nepodarilo sa pripojiť ku klastru",
          },
        },
      },
    },
    preview: {
      post: {
        title: "Náhľad nasadenia",
        titleShort: "Náhľad",
        description:
          "Zobrazí plán zmien infraštruktúry bez ich vykonania (pulumi preview).",
        container: { title: "Náhľad nasadenia" },
        fields: {
          stack: {
            label: "Zásobník",
            description: "Názov zásobníka Pulumi",
            placeholder: "prod",
          },
        },
        response: {
          success: { title: "Úspech" },
          message: { title: "Správa" },
          preview: { title: "Náhľad" },
          duration: { title: "Trvanie (ms)" },
        },
        success: {
          title: "Náhľad pripravený",
          description: "Náhľad je pripravený.",
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Neplatná konfigurácia",
          },
          unauthorized: {
            title: "Bez oprávnenia",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Vyžaduje sa oprávnenie správcu.",
          },
          server: {
            title: "Náhľad zlyhal",
            description: "Príkaz pulumi preview zlyhal",
          },
          notFound: {
            title: "Žiadny klaster",
            description: "Nie je nakonfigurovaný žiadny klaster.",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Zistili sa neuložené zmeny",
          },
          conflict: { title: "Konflikt", description: "Nastal konflikt" },
          network: {
            title: "Chyba siete",
            description: "Nepodarilo sa pripojiť ku klastru",
          },
        },
      },
    },
  },

  scale: {
    replicas: {
      post: {
        title: "Upraviť počet replík",
        titleShort: "Upraviť počet replík",
        description: "Upraví počet replík nasadenia v klastri.",
        container: { title: "Upraviť počet replík nasadenia" },
        fields: {
          component: {
            label: "Komponent",
            description: "Nasadenie, ktorého počet replík chcete zmeniť",
          },
          replicas: {
            label: "Repliky",
            description: "Cieľový počet replík (0 = pozastavenie)",
            placeholder: "2",
          },
        },
        response: {
          success: { title: "Úspech" },
          message: { title: "Správa" },
          previousReplicas: { title: "Predchádzajúci počet replík" },
          newReplicas: { title: "Nový počet replík" },
        },
        success: {
          title: "Počet replík upravený",
          description: "Počet replík nasadenia sa zmenil.",
        },
        errors: {
          validation: {
            title: "Chyba overenia",
            description: "Neplatné parametre úpravy počtu replík",
          },
          unauthorized: {
            title: "Bez oprávnenia",
            description: "Vyžaduje sa prihlásenie",
          },
          forbidden: {
            title: "Prístup zakázaný",
            description: "Vyžaduje sa oprávnenie správcu.",
          },
          server: {
            title: "Úprava počtu replík zlyhala",
            description: "Nepodarilo sa upraviť počet replík nasadenia",
          },
          notFound: {
            title: "Nasadenie sa nenašlo",
            description: "Nasadenie sa v klastri nenašlo",
          },
          unknown: {
            title: "Neznáma chyba",
            description: "Vyskytla sa neočakávaná chyba",
          },
          unsavedChanges: {
            title: "Neuložené zmeny",
            description: "Zistili sa neuložené zmeny",
          },
          conflict: { title: "Konflikt", description: "Nastal konflikt" },
          network: {
            title: "Chyba siete",
            description: "Nepodarilo sa pripojiť ku klastru",
          },
        },
      },
    },
  },
};
