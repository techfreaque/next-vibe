import type { translations as enTranslations } from "../../en/subscription";
import { translations as actionsTranslations } from "./actions";
import { translations as billingTranslations } from "./billing";
import { translations as cancellationTranslations } from "./cancellation";
import { translations as checkoutTranslations } from "./checkout";
import { translations as currentTranslations } from "./current";
import { translations as downgradeTranslations } from "./downgrade";
import { translations as emailTranslations } from "./email";
import { translations as errorsTranslations } from "./errors";
import { translations as featuresTranslations } from "./features";
import { translations as invoiceStatusTranslations } from "./invoiceStatus";
import { translations as messagesTranslations } from "./messages";
import { translations as noActiveTranslations } from "./noActive";
import { translations as plansTranslations } from "./plans";
import { translations as reactivationTranslations } from "./reactivation";
import { translations as statusTranslations } from "./status";
import { translations as tabsTranslations } from "./tabs";
import { translations as timeTranslations } from "./time";
import { translations as updateTranslations } from "./update";

export const translations: typeof enTranslations = {
  actions: actionsTranslations,
  billing: billingTranslations,
  cancellation: cancellationTranslations,
  checkout: checkoutTranslations,
  current: currentTranslations,
  downgrade: downgradeTranslations,
  email: emailTranslations,
  errors: errorsTranslations,
  features: featuresTranslations,
  invoiceStatus: invoiceStatusTranslations,
  messages: messagesTranslations,
  noActive: noActiveTranslations,
  plans: plansTranslations,
  reactivation: reactivationTranslations,
  status: statusTranslations,
  tabs: tabsTranslations,
  time: timeTranslations,
  update: updateTranslations,
  // Legacy tier-based
  currentPlan: "Aktualny Plan",
  billingCycle: "Cykl Rozliczeniowy",
  nextBilling: "Następna data rozliczenia",
  noBillingDate: "Brak dostępnej daty rozliczenia",
  planFeatures: "Funkcje Planu",
  noSubscription: "Brak aktywnej subskrypcji",
  chooseAPlan: "Wybierz plan subskrypcji, aby dołączyć",
  starterFeatures: "Funkcje Planu Starter",
  cancellationPending: "Oczekujące Anulowanie Subskrypcji",
  accessUntil: "Będziesz mieć dostęp do",
  // New credit-based system
  title: "Kredyty",
  description: "Zarządzaj swoimi kredytami i subskrypcjami",
  balance: {
    title: "Saldo Kredytów",
    description: "Twoje dostępne kredyty do rozmów z AI",
    total: "kredyty",
    expiring: {
      title: "Wygasające Kredyty",
      description: "Z subskrypcji",
    },
    permanent: {
      title: "Stałe Kredyty",
      description: "Nigdy nie wygasają",
    },
    free: {
      title: "Darmowe Kredyty",
      description: "Darmowy poziom",
    },
    nextExpiration: "Następne wygaśnięcie",
  },
  overview: {
    howItWorks: {
      title: "Jak działają kredyty",
      description: "Zrozum swój system kredytów",
      expiring: {
        title: "Wygasające Kredyty",
        description:
          "Kredyty z miesięcznych subskrypcji wygasają pod koniec każdego cyklu rozliczeniowego. Użyj ich, zanim wygasną!",
      },
      permanent: {
        title: "Stałe Kredyty",
        description:
          "Kredyty kupione w pakietach nigdy nie wygasają. Kup raz, używaj w dowolnym momencie. Idealne dla okazjonalnych użytkowników.",
      },
      free: {
        title: "Darmowe Kredyty",
        description:
          "Każdy otrzymuje 20 darmowych kredytów, aby wypróbować naszą usługę. Zacznij rozmawiać z AI natychmiast!",
      },
    },
    costs: {
      title: "Koszty Kredytów",
      description: "Zobacz, ile kosztuje każda funkcja",
      models: {
        title: "Modele AI (na wiadomość)",
        gpt4: "GPT-4",
        claude: "Claude Sonnet",
        gpt35: "GPT-3.5",
        llama: "Llama 3",
        cost: "{{count}} kredyty",
      },
      features: {
        title: "Funkcje",
        search: "Brave Search",
        tts: "Tekst na Mowę",
        stt: "Mowa na Tekst",
        searchCost: "+1 kredyt",
        audioCost: "1 kredyt/min",
      },
    },
  },
  buy: {
    subscription: {
      badge: "Najlepsza Wartość",
      title: "Subskrypcja Miesięczna",
      description: "1000 kredytów miesięcznie (wygasają co miesiąc)",
      perMonth: "/miesiąc",
      features: {
        credits: "1000 kredytów co miesiąc",
        expiry: "Kredyty wygasają pod koniec cyklu rozliczeniowego",
        bestFor: "Najlepsze dla regularnych użytkowników",
      },
      button: "Subskrybuj Teraz",
    },
    pack: {
      title: "Pakiet Kredytów",
      description: "500 kredytów na pakiet (nigdy nie wygasają)",
      perPack: "/pakiet",
      features: {
        credits: "500 stałych kredytów",
        expiry: "Kredyty nigdy nie wygasają",
        bestFor: "Najlepsze dla okazjonalnych użytkowników",
      },
      quantity: "Ilość",
      total: "{{count}} kredyty razem",
      totalPrice: "Razem: {{price}}",
      button: "Kup {{count}} {{type}}",
      pack: "Pakiet",
      packs: "Pakiety",
    },
  },
  history: {
    title: "Historia Transakcji",
    description: "Twoje ostatnie transakcje kredytowe",
    empty: {
      title: "Brak transakcji",
      description: "Twoja historia transakcji kredytowych pojawi się tutaj",
    },
    balance: "Saldo: {{count}}",
    loadMore: "Załaduj Więcej",
    types: {
      purchase: "Zakup",
      subscription: "Subskrypcja",
      usage: "Użycie",
      expiry: "Wygaśnięcie",
      free_tier: "Darmowy Poziom",
    },
  },
};
