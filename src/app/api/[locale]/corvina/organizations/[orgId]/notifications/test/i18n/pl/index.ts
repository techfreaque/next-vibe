export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    notifications: "Powiadomienia",
  },
  post: {
    title: "Testuj powiadomienie",
    description:
      "Wysyła testową wiadomość e-mail z powiadomieniem dla organizacji.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    type: {
      label: "Typ powiadomienia",
      description: "Typ powiadomienia do przetestowania.",
    },
    emailTo: {
      label: "E-mail do",
      description: "Adres e-mail odbiorcy testowego powiadomienia.",
      placeholder: "odbiorca@przykład.pl",
    },
    emailBcc: {
      label: "E-mail BCC",
      description: "Adres BCC dla testowego powiadomienia.",
      placeholder: "bcc@przykład.pl",
    },
    subject: {
      label: "Temat",
      description: "Własny temat testowej wiadomości e-mail.",
      placeholder: "Testowe powiadomienie",
    },
    response: {
      message: "Wiadomość",
    },
    enums: {
      notificationMailEventType: {
        alarmNotification: "Powiadomienie alarmowe",
        userCreation: "Tworzenie użytkownika",
        standardLicenseExpiration: "Wygaśnięcie licencji standardowej",
        plusLicenseExpiration: "Wygaśnięcie licencji Plus",
        trialLicenseExpiration: "Wygaśnięcie licencji próbnej",
        standardLicenseExpired: "Licencja standardowa wygasła",
        plusLicenseExpired: "Licencja Plus wygasła",
        trialLicenseExpired: "Licencja próbna wygasła",
        vpnCreditsConsumptions: "Zużycie kredytów VPN",
        vpnCreditsConsumptionsOver: "Przekroczono kredyty VPN",
        iotCreditsConsumptions: "Zużycie kredytów IoT",
        iotCreditsConsumptionsOver: "Przekroczono kredyty IoT",
      },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Klucz API nie ma dostępu do wysyłania testowych powiadomień.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Wysłano",
      description: "Testowe powiadomienie wysłane pomyślnie.",
    },
    submitButton: {
      label: "Wyślij test",
      loadingText: "Wysyłanie...",
    },
  },
};
