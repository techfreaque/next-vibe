import { translations as idTranslations } from "../../[id]/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Edytuj konto SMTP",
  description: "Edytuj konfigurację konta SMTP",
  container: {
    title: "Szczegóły konta SMTP",
    description: "Zaktualizuj ustawienia i konfigurację konta SMTP",
  },
  fields: {
    name: {
      label: "Nazwa konta",
      description: "Nazwa konta SMTP",
      placeholder: "Wprowadź nazwę konta",
    },
    description: {
      label: "Opis",
      description: "Opis konta",
      placeholder: "Wprowadź opis konta",
    },
    host: {
      label: "Host SMTP",
      description: "Nazwa hosta serwera SMTP",
      placeholder: "smtp.przyklad.pl",
    },
    port: {
      label: "Port",
      description: "Port serwera SMTP",
      placeholder: "587",
    },
    securityType: {
      label: "Typ zabezpieczeń",
      description: "Typ zabezpieczeń połączenia SMTP",
      placeholder: "Wybierz typ zabezpieczeń",
    },
    username: {
      label: "Nazwa użytkownika",
      description: "Nazwa użytkownika uwierzytelniania SMTP",
      placeholder: "Wprowadź nazwę użytkownika",
    },
    password: {
      label: "Hasło",
      description: "Hasło uwierzytelniania SMTP",
      placeholder: "Wprowadź hasło",
    },
    fromEmail: {
      label: "E-mail nadawcy",
      description: "Domyślny adres e-mail nadawcy",
      placeholder: "nadawca@przyklad.pl",
    },
    priority: {
      label: "Priorytet",
      description: "Priorytet konta dla równoważenia obciążenia",
      placeholder: "Wprowadź numer priorytetu",
    },
  },
  response: {
    account: {
      title: "Zaktualizowane konto",
      description: "Pomyślnie zaktualizowano konto SMTP",
      id: "ID konta",
      name: "Nazwa konta",
      host: "Host SMTP",
      port: "Port",
      username: "Nazwa użytkownika",
      fromEmail: "E-mail nadawcy",
    },
  },
  id: idTranslations,
};
