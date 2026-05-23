export const translations = {
  category: "Infrastruktura",
  type: "Infrastruktura",

  enums: {
    infraStatus: {
      pending: "Oczekujący",
      provisioning: "Konfigurowanie",
      ready: "Gotowy",
      degraded: "Ograniczony",
      error: "Błąd",
    },
    componentStatus: {
      unknown: "Nieznany",
      healthy: "Sprawny",
      degraded: "Ograniczony",
      down: "Wyłączony",
    },
    scaleComponent: {
      web: "Web (Next.js)",
      tasks: "Runner zadań",
      storage: "Magazyn (MinIO)",
    },
  },

  errors: {
    noControlPlane:
      "Brak połączenia SSH oznaczonego jako control-plane. Oznacz serwer w ustawieniach SSH.",
    noClusterNodes:
      "Brak połączeń SSH oznaczonych jako węzły klastra. Oznacz co najmniej jeden serwer jako control-plane.",
    kubeconfigMissing:
      "Kubeconfig nie znaleziony. Najpierw uruchom cluster-init.",
    pulumiNotInstalled:
      "Pulumi CLI nie jest zainstalowane. Instalacja: curl -fsSL https://get.pulumi.com | sh",
    sshExecFailed: "Polecenie SSH nie powiodło się na węźle",
    k3sInstallFailed: "Instalacja k3s nie powiodła się",
    scaleTargetNotFound: "Deployment nie znaleziony w klastrze",
    connectionNotFound: "Połączenie SSH nie zostało znalezione",
    encryptionFailed:
      "Odszyfrowanie danych uwierzytelniających nie powiodło się",
    connectTimeout: "Przekroczono limit czasu połączenia SSH",
    sshAuthFailed: "Uwierzytelnianie SSH nie powiodło się",
    sshConnectionFailed: "Połączenie SSH nie powiodło się",
    fingerprintMismatch: "Niezgodność odcisku klucza hosta SSH",
  },

  cluster: {
    init: {
      post: {
        title: "Inicjalizuj klaster",
        container: { title: "Inicjalizacja klastra" },
        description:
          "Skonfiguruj k3s na oznaczonych serwerach SSH. Instaluje k3s, bazy danych, Redis, MinIO i ingress.",
        fields: {
          clusterName: {
            label: "Nazwa klastra",
            description: "Nazwa klastra (używana w kubeconfig i etykietach)",
            placeholder: "next-vibe-prod",
          },
          domain: {
            label: "Domena",
            description:
              "Bazowa domena dla ingressu (np. example.com → app.example.com)",
            placeholder: "example.com",
          },
          email: {
            label: "Email",
            description: "Email kontaktowy dla certyfikatów TLS Let's Encrypt",
            placeholder: "admin@example.com",
          },
          k3sVersion: {
            label: "Wersja k3s",
            description: "Wersja k3s do zainstalowania",
            placeholder: "v1.31.0+k3s1",
          },
          dryRun: {
            label: "Próbny przebieg",
            description: "Podgląd zmian bez ich wprowadzania",
          },
          skipDatabase: {
            label: "Pomiń bazę danych",
            description: "Pomiń instalację CloudNativePG PostgreSQL",
          },
          skipRedis: {
            label: "Pomiń Redis",
            description: "Pomiń instalację Redis Sentinel",
          },
          skipStorage: {
            label: "Pomiń magazyn",
            description: "Pomiń instalację MinIO",
          },
          skipIngress: {
            label: "Pomiń ingress",
            description: "Pomiń nginx-ingress i cert-manager",
          },
        },
        response: {
          success: { title: "Sukces" },
          message: { title: "Wiadomość" },
          nodesProvisioned: { title: "Skonfigurowane węzły" },
          componentsInstalled: { title: "Zainstalowane komponenty" },
          kubeconfig: { title: "Kubeconfig" },
          duration: { title: "Czas (ms)" },
        },
        success: {
          title: "Klaster gotowy",
          description: "Klaster k3s skonfigurowany pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowa konfiguracja klastra",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Wymagany dostęp administratora",
          },
          server: {
            title: "Konfiguracja nie powiodła się",
            description: "Inicjalizacja klastra nie powiodła się",
          },
          notFound: {
            title: "Brak węzłów",
            description: "Brak połączeń SSH oznaczonych jako węzły klastra",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt",
            description: "Klaster już istnieje lub jest konfigurowany",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z węzłami klastra",
          },
        },
      },
    },
    status: {
      get: {
        title: "Status klastra",
        container: { title: "Status klastra" },
        description:
          "Pokaż zdrowie węzłów k8s, liczbę podów i status komponentów",
        response: {
          nodes: { title: "Węzły" },
          components: { title: "Komponenty" },
          overallStatus: { title: "Ogólny status" },
          podCounts: { title: "Liczba podów" },
        },
        success: {
          title: "Status pobrany",
          description: "Status klastra pobrany pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Wymagany dostęp administratora",
          },
          server: {
            title: "Błąd serwera",
            description: "Nie udało się pobrać statusu klastra",
          },
          notFound: {
            title: "Brak klastra",
            description:
              "Brak skonfigurowanego klastra. Najpierw uruchom cluster-init.",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
          },
          conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z klastrem",
          },
        },
      },
    },
  },

  deploy: {
    push: {
      post: {
        title: "Wdróż",
        description: "Zastosuj zmiany infrastruktury przez Pulumi (pulumi up)",
        container: { title: "Wdrożenie" },
        fields: {
          stack: {
            label: "Stack",
            description: "Nazwa stosu Pulumi",
            placeholder: "prod",
          },
          skipPreview: {
            label: "Pomiń podgląd",
            description: "Zastosuj zmiany bez podglądu",
          },
        },
        response: {
          success: { title: "Sukces" },
          message: { title: "Wiadomość" },
          changes: { title: "Zmiany" },
          duration: { title: "Czas (ms)" },
        },
        success: {
          title: "Wdrożono",
          description: "Infrastruktura wdrożona pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowa konfiguracja wdrożenia",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Wymagany dostęp administratora",
          },
          server: {
            title: "Wdrożenie nie powiodło się",
            description: "Pulumi up nie powiodło się",
          },
          notFound: {
            title: "Brak klastra",
            description: "Brak skonfigurowanego klastra",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
          },
          conflict: {
            title: "Konflikt",
            description: "Wdrożenie już trwa",
          },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z klastrem",
          },
        },
      },
    },
    preview: {
      post: {
        title: "Podgląd wdrożenia",
        description:
          "Podgląd zmian infrastruktury bez ich stosowania (pulumi preview)",
        container: { title: "Podgląd wdrożenia" },
        fields: {
          stack: {
            label: "Stack",
            description: "Nazwa stosu Pulumi",
            placeholder: "prod",
          },
        },
        response: {
          success: { title: "Sukces" },
          message: { title: "Wiadomość" },
          preview: { title: "Podgląd" },
          duration: { title: "Czas (ms)" },
        },
        success: {
          title: "Podgląd gotowy",
          description: "Podgląd wygenerowany pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowa konfiguracja",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Wymagany dostęp administratora",
          },
          server: {
            title: "Podgląd nie powiódł się",
            description: "Pulumi preview nie powiodło się",
          },
          notFound: {
            title: "Brak klastra",
            description: "Brak skonfigurowanego klastra",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
          },
          conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z klastrem",
          },
        },
      },
    },
  },

  scale: {
    replicas: {
      post: {
        title: "Skaluj",
        description: "Skaluj deployment w klastrze",
        container: { title: "Skalowanie deploymentu" },
        fields: {
          component: {
            label: "Komponent",
            description: "Który deployment skalować",
          },
          replicas: {
            label: "Repliki",
            description: "Docelowa liczba replik (0 = wstrzymaj)",
            placeholder: "2",
          },
        },
        response: {
          success: { title: "Sukces" },
          message: { title: "Wiadomość" },
          previousReplicas: { title: "Poprzednie repliki" },
          newReplicas: { title: "Nowe repliki" },
        },
        success: {
          title: "Przeskalowano",
          description: "Deployment przeskalowany pomyślnie",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry skalowania",
          },
          unauthorized: {
            title: "Nieautoryzowany",
            description: "Wymagane uwierzytelnienie",
          },
          forbidden: {
            title: "Zabroniony",
            description: "Wymagany dostęp administratora",
          },
          server: {
            title: "Skalowanie nie powiodło się",
            description: "Nie udało się przeskalować deploymentu",
          },
          notFound: {
            title: "Deployment nie znaleziony",
            description: "Deployment nie znaleziony w klastrze",
          },
          unknown: {
            title: "Nieznany błąd",
            description: "Wystąpił nieoczekiwany błąd",
          },
          unsavedChanges: {
            title: "Niezapisane zmiany",
            description: "Wykryto niezapisane zmiany",
          },
          conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
          network: {
            title: "Błąd sieci",
            description: "Nie można połączyć się z klastrem",
          },
        },
      },
    },
  },
};
