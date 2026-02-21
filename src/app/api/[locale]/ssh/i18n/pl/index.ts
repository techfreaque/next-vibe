export const translations = {
  category: "SSH",
  type: "SSH",
  errors: {
    localModeOnly: {
      title: "Tylko tryb lokalny",
      description: "Ta funkcja jest dostępna tylko w LOCAL_MODE",
    },
    adminOnly: {
      title: "Tylko administratorzy",
      description:
        "Tylko administratorzy mogą uzyskać dostęp do funkcji maszynowych",
    },
    invalidPath: {
      title: "Nieprawidłowa ścieżka",
      description:
        "Ścieżka musi być absolutna i nie może zawierać segmentów '..'",
    },
    commandFailed: {
      title: "Polecenie nie powiodło się",
      description: "Nie udało się wykonać polecenia",
    },
    timeout: {
      title: "Timeout",
      description: "Polecenie przekroczyło limit czasu",
    },
    connectionNotFound: {
      title: "Połączenie nie znalezione",
      description: "Połączenie SSH nie znalezione",
    },
    secretKeyMissing: {
      title: "Brak klucza SSH",
      description:
        "Ustaw zmienną środowiskową SSH_SECRET_KEY (32-bajtowy hex) aby włączyć tryb SSH",
    },
    fingerprintChanged: {
      title: "Zmieniono fingerprint hosta",
      description:
        "Fingerprint serwera już nie pasuje. Potwierdź, aby ponownie się połączyć.",
    },
  },
};
