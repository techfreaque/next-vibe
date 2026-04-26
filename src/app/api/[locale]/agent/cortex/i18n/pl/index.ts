/* eslint-disable i18next/no-literal-string */
export const translations = {
  tags: {
    cortex: "Cortex",
  },
  category: "Cortex",
  scaffold: {
    roots: {
      memories: "wspomnienia",
      documents: "dokumenty",
    },
    memories: {
      identity: {
        path: "tożsamość",
        purpose: "Kim jesteś: imię, rola, cele, styl komunikacji",
      },
      expertise: {
        path: "kompetencje",
        purpose: "Co umiesz: umiejętności, narzędzia, doświadczenie",
      },
      context: {
        path: "kontekst",
        purpose:
          "Bieżąca sytuacja: aktywne projekty, preferencje, ograniczenia",
      },
      life: {
        path: "życie",
        purpose:
          "Cele życiowe i aktualny stan: kariera, zdrowie, relacje, finanse, rozwój, cel",
      },
    },
    documents: {
      inbox: {
        path: "skrzynka",
        purpose:
          "Szybkie wpisy — zapisuj od razu, porządkuj gdy kontekst jest jasny",
        icon: "inbox",
      },
      projects: {
        path: "projekty",
        purpose: "Aktywna praca — jeden podfolder na projekt",
        icon: "folder-open",
      },
      knowledge: {
        path: "wiedza",
        purpose: "Stałe referencje — rzeczy warte zachowania na zawsze",
        icon: "book-open",
      },
      journal: {
        path: "dziennik",
        purpose: "Datowane wpisy — pomysły, refleksje, obserwacje",
        icon: "pen-line",
      },
      templates: {
        path: "szablony",
        purpose:
          "Struktury do wielokrotnego użycia dla powtarzających się zadań",
        icon: "layout-template",
      },
    },
  },
  templates: {
    memories: {
      identity: {
        name: {
          path: "imię.md",
          content: `---\npriority: 100\ntags: [tożsamość]\n---\n\n<!-- Twoje imię i jak wolisz być nazywany. AI uzupełni to podczas pierwszej rozmowy. -->\n`,
        },
        role: {
          path: "rola.md",
          content: `---\npriority: 100\ntags: [tożsamość, praca]\n---\n\n<!-- Twoja zawodowa rola, czym się zajmujesz i w jakim kontekście działasz. -->\n`,
        },
        goals: {
          path: "cele.md",
          content: `---\npriority: 90\ntags: [tożsamość, cele]\n---\n\n<!-- Twoje główne cele — co chcesz zbudować, osiągnąć lub poprawić. Krótko- i długoterminowo. -->\n`,
        },
        communication: {
          path: "komunikacja.md",
          content: `---\npriority: 85\ntags: [tożsamość, styl]\n---\n\n<!-- Jak preferujesz się komunikować: ton, głębokość, format, co cię irytuje, co cenisz. -->\n`,
        },
      },
      expertise: {
        skills: {
          path: "umiejętności.md",
          content: `---\npriority: 80\ntags: [kompetencje]\n---\n\n<!-- Twoje techniczne i zawodowe umiejętności. W czym jesteś ekspertem, czego się uczysz. -->\n`,
        },
        tools: {
          path: "narzędzia.md",
          content: `---\npriority: 75\ntags: [kompetencje, tech]\n---\n\n<!-- Narzędzia, języki, frameworki i platformy, których regularnie używasz. Preferowany stack. -->\n`,
        },
        background: {
          path: "historia.md",
          content: `---\npriority: 70\ntags: [kompetencje]\n---\n\n<!-- Twoje doświadczenie i jak tu dotarłeś. Kształtuje kontekst każdej interakcji. -->\n`,
        },
      },
      context: {
        projects: {
          path: "projekty.md",
          content: `---\npriority: 80\ntags: [kontekst, projekty]\n---\n\n<!-- Aktywne projekty: nad czym pracujesz, co jest teraz najważniejsze. -->\n`,
        },
        preferences: {
          path: "preferencje.md",
          content: `---\npriority: 70\ntags: [kontekst]\n---\n\n<!-- Sposób pracy: jak lubisz pracować, co cię spowalnia, co pomaga ci się skupić. -->\n`,
        },
        constraints: {
          path: "ograniczenia.md",
          content: `---\npriority: 65\ntags: [kontekst]\n---\n\n<!-- Ograniczenia, twarde zasady i rzeczy niepodlegające negocjacji w zachowaniu AI wobec ciebie. -->\n`,
        },
      },
      life: {
        career: {
          path: "kariera.md",
          content: `---\npriority: 90\ntags: [życie, kariera, cele]\n---\n\n## Aktualny stan\n\n<!-- Co faktycznie robisz zawodowo? Rola, firma/projekt, poziom dochodów, satysfakcja 1-10. -->\n\n## Cele\n\n<!-- Krótkoterminowe (ten miesiąc): -->\n<!-- Średnioterminowe (ten rok): -->\n<!-- Długoterminowe (3-5 lat): -->\n\n## Aktywne projekty\n\n<!-- Które projekty w /dokumenty/projekty/ służą teraz twojej karierze? Jaki jest związek? -->\n\n## Przeszkody\n\n<!-- Co zmieniłoby wszystko gdyby zostało rozwiązane? Jaka jest największa przeszkoda? -->\n\n## Wzorce\n\n<!-- Powtarzające się motywy kariery: do czego wracasz, co cię wyczerpuje, co cię napędza. -->\n`,
        },
        health: {
          path: "zdrowie.md",
          content: `---\npriority: 90\ntags: [życie, zdrowie, cele]\n---\n\n## Aktualny stan\n\n<!-- Szczery obraz: kondycja fizyczna, stan psychiczny, jakość snu, dolegliwości lub obawy. -->\n\n## Rutyny\n\n<!-- Co naprawdę robisz (nie co planujesz). Ćwiczenia, rytm snu, nawyki żywieniowe. -->\n\n## Energia\n\n<!-- Co cię ładuje? Co cię wyczerpuje? Kiedy w ciągu dnia/tygodnia jesteś najostrzejszy? -->\n\n## Cele\n\n<!-- Krótkoterminowe (ten miesiąc): -->\n<!-- Długoterminowe (ten rok): -->\n\n## Przeszkody\n\n<!-- Co stoi na przeszkodzie lepszemu zdrowiu? Czas, motywacja, wiedza, środowisko? -->\n`,
        },
        relationships: {
          path: "relacje.md",
          content: `---\npriority: 85\ntags: [życie, relacje, cele]\n---\n\n## Bliskie osoby\n\n<!-- 3-5 osób, które liczą się najbardziej. Partner, rodzina, najbliżsi przyjaciele. Jak układa się z każdą? -->\n\n## Aktualny stan\n\n<!-- Ogólna kondycja relacji. Z kim jesteś blisko? Od kogo się oddaliłeś? -->\n\n## Inwestycja\n\n<!-- Kto potrzebuje od ciebie więcej teraz? Gdzie za bardzo, a gdzie za mało inwestujesz? -->\n\n## Cele\n\n<!-- Co chcesz zbudować lub naprawić w relacjach w tym roku? -->\n\n## Przeszkody\n\n<!-- Co stoi na drodze? Czas, odległość, nierozwiązany konflikt, unikanie? -->\n`,
        },
        finances: {
          path: "finanse.md",
          content: `---\npriority: 85\ntags: [życie, finanse, cele]\n---\n\n## Aktualny stan\n\n<!-- Miesięczne przychody vs wydatki. Oszczędności. Długi. Ocena stabilności 1-10. -->\n\n## Poduszka finansowa\n\n<!-- Ile miesięcy przeżyłbyś bez dochodu? Jaki masz runway? -->\n\n## Cele\n\n<!-- Krótkoterminowe (ten miesiąc): -->\n<!-- Długoterminowe (ten rok): -->\n\n## Wzrost\n\n<!-- Jak budujesz majątek lub bezpieczeństwo finansowe? Inwestycje, dodatkowe dochody, płatne umiejętności. -->\n\n## Przeszkody\n\n<!-- Jakie jest największe ryzyko lub przeszkoda finansowa teraz? -->\n`,
        },
        growth: {
          path: "rozwój.md",
          content: `---\npriority: 85\ntags: [życie, rozwój, nauka, cele]\n---\n\n## Aktualny fokus\n\n<!-- Czego aktywnie się uczysz lub co rozwijasz? Co kliknie? -->\n\n## Luka kompetencyjna\n\n<!-- Jaka umiejętność lub wiedza, jeśli zdobyta, odblokowałaby dla ciebie następny poziom? -->\n\n## Cele\n\n<!-- Czego chcesz się nauczyć lub opanować w tym roku? Bądź konkretny. -->\n\n## Zasoby\n\n<!-- Książki, kursy, mentorzy, społeczności, które pomagają. Co działa? -->\n\n## Przeszkody\n\n<!-- Co spowalnia twój rozwój? Czas, fokus, dostęp, strach? -->\n`,
        },
        purpose: {
          path: "sens.md",
          content: `---\npriority: 95\ntags: [życie, sens, wartości, cele]\n---\n\n## Gwiazda przewodnia\n\n<!-- Jedno lub dwa zdania: o czym fundamentalnie jest twoje życie? Co jesteś tu, żeby zrobić lub zbudować? -->\n\n## Podstawowe wartości\n\n<!-- 3-5 wartości, które kierują twoimi decyzjami. Nie aspiracje — rzeczy, którymi naprawdę żyjesz. -->\n\n## Jak wygląda sukces\n\n<!-- Za 5 lat: jak konkretnie wygląda dla ciebie dobrze przeżyte życie? -->\n`,
        },
      },
    },
    documents: {
      meetingNotes: {
        path: "notatki-ze-spotkania.md",
        content: `---\ntype: szablon\ntags: [spotkania, szablon]\n---\n\n# Notatki ze spotkania — [Data]\n\n**Uczestnicy:**\n**Cel:**\n\n## Kontekst\n\nKrótkie tło — dlaczego to spotkanie się odbyło.\n\n## Agenda\n\n1.\n2.\n3.\n\n## Kluczowe decyzje\n\n-\n\n## Zadania\n\n- [ ] @osoba — zadanie — termin [data]\n\n## Notatki\n\n---\n*Przeniesiono z: /dokumenty/skrzynka*\n`,
      },
      projectBrief: {
        path: "opis-projektu.md",
        content: `---\ntype: szablon\ntags: [projekty, szablon]\nstatus: szkic\n---\n\n# Opis projektu: [Nazwa]\n\n**Odpowiedzialny:**\n**Start:**\n**Cel:**\n\n## Problem\n\nCo się psuje lub boli bez tego? Jeden akapit, bez wypełniacza.\n\n## Cel\n\nJedno zdanie. Konkretny wynik. Mierzalny jeśli możliwe.\n\n## Zakres\n\n**W zakresie:**\n-\n\n**Poza zakresem:**\n-\n\n## Kryteria sukcesu\n\n- [ ]\n- [ ]\n\n## Ryzyka\n\n| Ryzyko | Prawdopodobieństwo | Wpływ | Przeciwdziałanie |\n|--------|-------------------|-------|------------------|\n|        |                   |       |                  |\n\n## Zasoby\n\nLinki, referencje, wcześniejsze prace.\n`,
      },
      weeklyReview: {
        path: "tygodniowy-przegląd.md",
        content: `---\ntype: szablon\ntags: [przegląd, tygodniowy, szablon]\n---\n\n# Tydzień od [Data]\n\n## Co zostało zrobione\n\n-\n\n## Co nie\n\n-\n\n## Napotkane przeszkody\n\n-\n\n## Czego się nauczyłem\n\n-\n\n## Fokus na następny tydzień\n\n1.\n2.\n3.\n\n## Poziom energii (1–10)\n\nPraca:\nOsobisty:\n\n---\n*Trzymaj poniżej 200 słów. Szybkość ważniejsza niż kompletność.*\n`,
      },
      decisionLog: {
        path: "dziennik-decyzji.md",
        content: `---\ntype: szablon\ntags: [decyzje, architektura, szablon]\n---\n\n# Decyzja: [Tytuł]\n\n**Data:**\n**Status:** zaproponowana | zaakceptowana | zastąpiona | przestarzała\n**Decydenci:**\n\n## Kontekst\n\nJaka sytuacja wymusiła tę decyzję? Jakie ograniczenia istnieją?\n\n## Rozważane opcje\n\n### Opcja A — [Nazwa]\n\n**Zalety:**\n**Wady:**\n\n### Opcja B — [Nazwa]\n\n**Zalety:**\n**Wady:**\n\n## Decyzja\n\nWybraliśmy **Opcję [X]**, ponieważ:\n\n## Konsekwencje\n\n**Dobre:**\n**Złe:**\n**Neutralne:**\n\n---\n*Podlinkuj ten plik z odpowiedniego opisu projektu lub komentarza w kodzie.*\n`,
      },
      knowledgeArticle: {
        path: "artykuł-wiedzy.md",
        content: `---\ntype: szablon\ntags: [wiedza, referencja, szablon]\n---\n\n# [Temat]\n\n**Ostatnio zweryfikowano:**\n**Źródło:**\n\n## Podsumowanie\n\nJeden akapit. Czym to jest, dlaczego ma znaczenie, kiedy ma zastosowanie?\n\n## Jak to działa\n\nGłówna mechanika. Bez wypełniacza — tylko to, co potrzebujesz, żeby to zrozumieć lub zastosować.\n\n## Kiedy używać\n\n-\n-\n\n## Kiedy NIE używać\n\n-\n\n## Przykłady\n\n\`\`\`\nwklej przykład tutaj\n\`\`\`\n\n## Referencje\n\n-\n`,
      },
    },
  },
  enums: {
    nodeType: {
      file: "Plik",
      dir: "Folder",
    },
    viewType: {
      list: "Lista",
      kanban: "Kanban",
      calendar: "Kalendarz",
      grid: "Siatka",
      wiki: "Wiki",
    },
    syncPolicy: {
      sync: "Synchronizuj",
      local: "Tylko lokalnie",
    },
    creditFeature: {
      write: "Zapis",
      edit: "Edycja",
      search: "Wyszukiwanie",
      embedding: "Osadzanie",
    },
  },
  mounts: {
    memory: "Wspomnienie",
    document: "Dokument",
    thread: "Wątek",
    skill: "Umiejętność",
    task: "Zadanie",
    upload: "Załącznik",
    search: "Wyszukiwanie",
    favorite: "Ulubiony",
    gen: "Wygenerowane",
  },
  button: {
    label: "Korteks",
    title: "Korteks — pamięć AI",
    unavailableTitle: "Korteks niedostępny",
    unavailableDescription:
      "Korteks działa tylko w prywatnych i udostępnionych wątkach. Utwórz prywatny wątek, żeby używać pamięci AI.",
  },
  nav: {
    back: "Wstecz",
    actions: {
      list: "Przeglądaj",
      read: "Podgląd",
      write: "Zapisz",
      edit: "Edytuj",
      delete: "Usuń",
      move: "Przenieś",
      search: "Szukaj",
      tree: "Drzewo",
    },
  },
};
