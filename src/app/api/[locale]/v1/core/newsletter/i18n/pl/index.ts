import { translations as statusTranslations } from "../../status/i18n/pl";
import { translations as subscribeTranslations } from "../../subscribe/i18n/pl";
import { translations as unsubscribeTranslations } from "../../unsubscribe/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  status: statusTranslations,
  subscribe: subscribeTranslations,
  unsubscribe: unsubscribeTranslations,
  email: {
    welcome: {
      title: "Witamy w naszym newsletterze",
      preview: "Witamy w naszym newsletterze! Dziękujemy za subskrypcję",
      greeting: "Cześć",
      greeting_with_name: "Cześć {{name}}",
      message: "Witamy w newsletterze {{appName}}! Dziękujemy za subskrypcję.",
      what_to_expect: "Oto czego możesz oczekiwać od naszego newslettera:",
      benefit_1: "Najnowsze aktualizacje produktów i funkcji",
      benefit_2: "Wglądy branżowe i trendy",
      benefit_3: "Ekskluzywne treści i wskazówki",
      benefit_4: "Specjalne oferty i promocje",
      frequency:
        "Będziemy wysyłać Ci newslettery tygodniowo z najnowszymi aktualizacjami.",
      unsubscribe_text: "Możesz wypisać się w dowolnym momencie klikając",
      unsubscribe_link: "tutaj",
      subject: "Witamy w naszym newsletterze!",
    },
    admin_notification: {
      title: "Nowa subskrypcja newslettera",
      preview: "Nowy użytkownik zasubskrybował newsletter",
      message: "Nowy użytkownik zasubskrybował Twój newsletter.",
      subscriber_details: "Dane subskrybenta",
      email: "E-mail",
      name: "Imię",
      preferences: "Preferencje",
      view_in_admin: "Zobacz w panelu administracyjnym",
      subject: "Nowa subskrypcja newslettera - Powiadomienie administracyjne",
    },
    unsubscribe: {
      title: "Wypisz się z newslettera",
      preview: "Pomyślnie wypisałeś się z naszego newslettera",
      greeting: "Cześć",
      confirmation: "Pomyślnie wypisaliśmy {{email}} z naszego newslettera",
      resubscribe_info:
        "Jeśli zmienisz zdanie, zawsze możesz ponownie zapisać się odwiedzając naszą stronę",
      resubscribe_button: "Zapisz ponownie",
      support_message:
        "Jeśli masz jakieś pytania, skontaktuj się z naszym zespołem wsparcia",
      subject: "Potwierdzenie wypisania z newslettera",
      admin_unsubscribe_notification: {
        title: "Powiadomienie o wypisaniu z newslettera",
        preview: "Użytkownik wypisał się z newslettera",
        message: "Użytkownik wypisał się z newslettera",
        email: "E-mail",
        date: "Data",
        view_dashboard: "Zobacz pulpit",
        subject: "Wypisanie z newslettera - Powiadomienie administracyjne",
      },
    },
  },
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Nowości produktowe",
      companyUpdates: "Aktualności firmowe",
      industryInsights: "Wgląd w branżę",
      events: "Wydarzenia",
    },
    status: {
      subscribed: "Zasubskrybowany",
      unsubscribed: "Wypisany",
      pending: "Oczekujący",
      bounced: "Odrzucony",
      complained: "Skarga",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "Subskrypcja newslettera: Brak leadId",
    },
  },
};
