import type { smsTranslations as EnglishSmsTranslations } from "../../../en/sections/orders/sms";

export const smsTranslations: typeof EnglishSmsTranslations = {
  error: {
    no_phone: "Użytkownik nie ma numeru telefonu",
  },
  orders: {
    list: {
      list: "{{appName}}: Witaj {{firstName}}, masz {{count}} zamówień z {{period}}.",
      all_time: "cały czas",
    },
  },
};
