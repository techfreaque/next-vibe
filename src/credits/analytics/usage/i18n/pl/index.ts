import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/pl";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  get: {
    title: "Zużycie kredytów",
    titleShort: "Zużycie",
    description:
      "Wydatki kredytów w czasie: konta vs goście, darmowe vs kredyty z pakietów, według modelu, funkcji i dostawcy, z kosztem dostawcy, marżą i największymi wydającymi.",
    tags: {
      usage: "zużycie kredytów",
      margin: "marża",
    },
    fields: {
      actor: {
        label: "Wydający",
        description: "Konta, goście (bez konta) albo oba",
      },
      creditKind: {
        label: "Kredyty",
        description: "Darmowy limit miesięczny, kredyty z pakietów albo oba",
      },
      model: {
        label: "Model",
        description: "Tylko wydatki na ten identyfikator modelu",
      },
      feature: {
        label: "Funkcja",
        description: "Tylko wydatki na tę funkcję (czat, Generate Image, ...)",
      },
      provider: {
        label: "Dostawca upstream",
        description: "Tylko wydatki obsłużone przez tego dostawcę",
      },
      includeInternal: {
        label: "Uwzględnij konta adminów",
        description: "Licz też wydatki kont adminów",
      },
    },
    response: {
      window: "Okres",
      appliedFilters: "Zastosowane filtry",
      kpis: "Kluczowe wskaźniki",
      spendByActor: "Wydatki według wydających",
      spendByKind: "Wydatki według rodzaju kredytów",
      costVsSpend: "Wartość wydatków vs koszt dostawcy",
      byModel: "Według modelu",
      byFeature: "Według funkcji",
      byProvider: "Według dostawcy upstream",
      topSpenders: "Najwięcej wydający",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe filtry",
        description: "Sprawdź okres i filtry, potem spróbuj ponownie.",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się jako admin, żeby zobaczyć zużycie kredytów.",
      },
      forbidden: {
        title: "Tylko dla adminów",
        description: "Zużycie kredytów widzą tylko admini.",
      },
      notFound: {
        title: "Nic nie znaleziono",
        description: "Brak danych o zużyciu dla tego zapytania.",
      },
      server: {
        title: "Raport nieudany",
        description:
          "Nie udało się zbudować raportu zużycia. Spróbuj ponownie.",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś poszło nie tak podczas ładowania raportu.",
      },
      network: {
        title: "Błąd połączenia",
        description: "Nie można połączyć się z serwerem.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zastosuj albo odrzuć zmiany filtrów.",
      },
      conflict: {
        title: "Konflikt danych",
        description: "Dane zmieniły się podczas ładowania. Odśwież raport.",
      },
    },
    success: {
      title: "Raport gotowy",
      description: "Zużycie kredytów wczytane",
    },
  },
  widget: {
    extra: {
      nothingRecorded: "Nic nie zapisano",
      paidShareHint2:
        "Kupione pakiety i subskrypcje, w zużyciu ze znanym źródłem; {{missing}} bez źródła",
      costedPct: "Ze znanym kosztem %",
      paidShare: "Udział płatny",
      paidShareHint:
        "Zużycie z kupionych pakietów i subskrypcji; łączna wartość {{value}}",
      freeCostHint3:
        "Koszt dostawcy za {{credits}} darmowych kredytów; koszt znany dla {{coverage}} zużycia",
      fundGrants: "Przyznane",
      boughtPct: "Kupione %",
      subPct: "Sub. %",
      grantsPct: "Przyzn. %",
      unknownPct: "Brak źródła %",
      fundingChart: "Zużycie wg źródła",
      fundingNote:
        "Darmowa pula i typ pakietu, z którego poszło każde obciążenie. Brak źródła = pakiet wyczerpany i usunięty.",
      fundAllowance: "Darmowa pula",
      fundPurchased: "Kupione",
      fundSubscription: "Subskrypcja",
      fundBonus: "Bonusy",
      fundEarned: "Prowizje z poleceń",
      fundUnknown: "Brak źródła",
      change: "vs poprz.",
      paidPct: "Płatne %",
      topModel: "głównie {{model}}",
      spendersHint: "przez {{count}} wydających",
      accountTag: "konto",
      freeCostHint2:
        "Koszt dostawcy za darmowe zużycie; koszt znany dla {{coverage}} zużycia",
      notLoaded: "Raport nie wczytany. Odśwież, aby spróbować ponownie.",
      freeCost: "Koszt darmowego zużycia",
      freeCostHint:
        "Koszt dostawcy za zużycie darmowej puli, tam gdzie zapisany",
      markup: "Zysk brutto (znany koszt)",
      markupPct: "Marża",
      markupPctHint:
        "Zostaje po koszcie dostawcy, w wartości katalogowej (0,01 $/kredyt), nie gotówka",
      kindNote2:
        "Kredyty z pakietów łączą zakupy, subskrypcje i przyznania admina; zużycie nie zapisuje, które z nich.",
      modelNotRecorded: "model nieznany",
      costedSpend: "Zużycie ze znanym kosztem",
      costChart: "Zużycie ze znanym kosztem a koszt dostawcy",
      marginHint2: "Z {{value}} zużycia ze znanym kosztem",
      marginHint:
        "{{value}} wartości zużycia ma dane o kosztach; marża to ta kwota minus koszt dostawcy",
      guestPct: "Goście %",
      freePct: "Darmowe %",
      noCost: "brak danych o kosztach",
    },
    kpi: {
      creditsSpent: "Wydane kredyty",
      spendUsd: "Wartość wydatków",
      guestShare: "Udział gości",
      freeShare: "Udział darmowych",
      upstreamCostUsd: "Koszt dostawcy",
      marginUsd: "Marża brutto",
      marginPct: "Marża",
      activeSpenders: "Aktywni wydający",
    },
    hint: {
      spendUsd: "Wartość katalogowa $0.01 za kredyt, nie wpływy",
      guestShare: "Wydane przez odwiedzających bez konta",
      freeShare: "Opłacone z darmowego limitu miesięcznego",
      upstreamCostUsd: "Zapisany dla {{coverage}} wydatków",
      marginUsd: "Wartość minus koszt dostawcy, tylko wiersze z kosztem",
      marginPct: "Z wartości wydatków z danymi o koszcie",
      activeSpenders: "Konta i goście z jakimkolwiek wydatkiem",
    },
    chart: {
      actor: "Wydatki: konta vs goście",
      kind: "Wydatki: darmowy limit vs kredyty z pakietów",
      kindNote:
        "Kredyty z pakietów to zakupy, subskrypcje i przydziały admina.",
      cost: "Wartość wydatków vs koszt dostawcy",
      costNote: "Koszt dostawcy jest tylko tam, gdzie zapisało go obciążenie.",
    },
    series: {
      users: "Konta",
      guests: "Goście",
      free: "Darmowy limit",
      pack: "Kredyty z pakietów",
      spendUsd: "Wartość wydatków",
      upstreamCostUsd: "Koszt dostawcy",
    },
    breakdown: {
      model: "Model",
      feature: "Funkcja",
      provider: "Dostawca",
      spender: "Wydający",
      byModel: "Według modelu",
      byFeature: "Według funkcji",
      byProvider: "Według dostawcy upstream",
      topSpenders: "Najwięcej wydający",
      topSpendersHint: "Kliknij wiersz, żeby otworzyć konto lub gościa.",
      drillHint: "Kliknij wiersz, żeby przefiltrować raport.",
    },
    column: {
      credits: "Kredyty",
      usd: "Wartość",
      costUsd: "Koszt",
      marginPct: "Marża",
      spenders: "Wydający",
      guestShare: "Goście",
      freeShare: "Darmowe",
      transactions: "Obciążenia",
    },
    label: {
      noModel: "Narzędzia i media",
      noFeature: "Nie zapisano",
      noProvider: "Nie zapisano",
      chat: "Czat",
      guest: "Gość {{id}}",
      guestTag: "gość",
      lastActivity: "ostatni wydatek {{date}}",
    },
    filter: {
      actor: "Wydający",
      creditKind: "Kredyty",
      model: "Model",
      feature: "Funkcja",
      provider: "Dostawca",
      internal: "Z adminami",
    },
    empty: "Brak wydatków kredytów w tym okresie.",
    includeInternal: "Uwzględnij adminów",
  },
  enums: {
    actor: {
      all: "Wszyscy",
      users: "Konta",
      guests: "Goście",
    },
    creditKind: {
      all: "Wszystkie kredyty",
      free: "Darmowe",
      pack: "Wszystkie pakiety",
      purchased: "Kupione",
      subscription: "Subskrypcja",
      grants: "Przyznane",
    },
  },
};
