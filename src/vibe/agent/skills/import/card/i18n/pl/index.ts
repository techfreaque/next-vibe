import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Narzędzia AI",
  tags: {
    skills: "skille",
  },
  enums: {
    visibility: {
      private: "Prywatna",
      unlisted: "Poza listą",
      public: "Publiczna",
    },
  },
  post: {
    title: "Importuj kartę postaci",
    titleShort: "Importuj kartę",
    description:
      "Importuje kartę postaci (V1, V2 lub V3) z SillyTavern, Chub, RisuAI lub innej aplikacji zgodnej z formatem Tavern. Przyjmuje plik .json, kartę .png z osadzonymi danymi albo JSON karty jako tekst. Imię, opis, osobowość, scenariusz, pierwsza wiadomość, przykładowy dialog, instrukcje karty i tagi trafiają do nowej postaci, która należy do Ciebie. Obraz z karty PNG staje się awatarem. Nic z karty nie jest uruchamiane. Ponowny import tej samej karty zwraca istniejącą postać.",
    intro:
      "Zabierz swoje postacie ze sobą. Wgraj plik karty wyeksportowany z SillyTavern, Chub albo RisuAI.",
    supported: "Karty V1, V2 i V3. JSON lub PNG, do 10 MB.",
    mapping: {
      title: "Co zostanie przeniesione",
      fields:
        "Imię, opis, osobowość, scenariusz, pierwsza wiadomość, przykładowy dialog, instrukcje karty, tagi, autor.",
      avatar: "Karty PNG: obraz staje się awatarem.",
      safe: "Lorebooki i skrypty są pomijane. Nic z karty nie jest uruchamiane.",
    },
    card: {
      label: "Plik karty",
      description: "Karta postaci jako .json lub .png",
      validation: {
        required: "Wybierz plik karty.",
        tooLarge: "Plik karty przekracza 10 MB.",
      },
    },
    visibility: {
      label: "Widoczność",
      description:
        "Prywatna: tylko Ty. Niepubliczna: poza listą publiczną. Publiczna: widoczna dla wszystkich.",
    },
    response: {
      id: { content: "ID postaci" },
      name: { content: "Imię" },
      platform: { content: "Źródło" },
      creatorName: { content: "Autor karty" },
      sourceUrl: { content: "Link źródłowy" },
      avatarUrl: { content: "Awatar" },
      alreadyImported: { content: "Już zaimportowano" },
      importedFields: { content: "Zaimportowano" },
    },
    fields: {
      name: "imię",
      avatar: "awatar",
      greeting: "pierwsza wiadomość",
      description: "opis",
      definition: "osobowość i scenariusz",
      tags: "tagi",
    },
    result: {
      imported: "Postać {{name}} jest gotowa.",
      alreadyImported:
        "Postać {{name}} jest już zaimportowana. Otwieramy Twoją kopię.",
      fieldsList: "Zaimportowano: {{fields}}",
      openSkill: "Otwórz postać",
      importAnother: "Importuj kolejną kartę",
    },
    errors: {
      validation: {
        title: "Nieprawidłowa karta",
        description: "Wybierz plik karty postaci (.json lub .png).",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem.",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby importować postacie.",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Twoje konto nie może importować postaci.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono karty.",
      },
      server: {
        title: "Import się nie udał",
        description: "Coś poszło nie tak podczas importu. Spróbuj ponownie.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany.",
      },
      conflict: {
        title: "Import trwa",
        description: "Ta karta jest właśnie importowana.",
      },
      invalidCard:
        "To nie jest karta postaci. Użyj pliku .json lub .png wyeksportowanego z SillyTavern, Chub albo RisuAI.",
      noCardInPng:
        "Ten plik PNG nie zawiera danych karty. Wyeksportuj go ponownie jako kartę postaci albo użyj pliku .json.",
      rateLimited:
        "Za dużo importów. Odczekaj {{seconds}} s i spróbuj ponownie.",
    },
    success: {
      title: "Postać zaimportowana",
      description: "Twoja kopia jest gotowa do rozmowy.",
    },
    backButton: {
      label: "Wstecz",
    },
    submitButton: {
      label: "Importuj kartę",
      loadingText: "Importowanie...",
    },
  },
};
