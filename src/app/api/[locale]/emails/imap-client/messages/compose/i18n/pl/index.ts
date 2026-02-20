export const translations = {
  post: {
    title: "Utwórz e-mail",
    description: "Wyślij nowy e-mail przez SMTP",
    to: {
      label: "Do",
      description: "Adres e-mail odbiorcy",
      placeholder: "odbiorca@przyklad.pl",
    },
    toName: {
      label: "Nazwa odbiorcy",
      description: "Wyświetlana nazwa odbiorcy",
      placeholder: "Jan Kowalski",
    },
    subject: {
      label: "Temat",
      description: "Temat wiadomości",
      placeholder: "Wpisz temat...",
    },
    body: {
      label: "Wiadomość",
      description: "Treść e-maila (zwykły tekst)",
      placeholder: "Napisz tutaj swoją wiadomość...",
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
        description: "Brak uprawnień do wysyłania",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wysłać e-maila",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Nieznany błąd podczas wysyłania",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt podczas wysyłania",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Konto SMTP nie znalezione",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas wysyłania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Proszę najpierw zapisać",
      },
    },
    success: {
      title: "E-mail wysłany",
      description: "E-mail wysłany pomyślnie",
    },
  },
  widget: {
    title: "Nowa wiadomość",
    send: "Wyślij",
    sending: "Wysyłanie...",
    sent: "E-mail wysłany pomyślnie",
    cancel: "Anuluj",
    discardConfirm: "Odrzucić szkic?",
  },
};
