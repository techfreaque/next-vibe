import type { smsTranslations as EnglishSmsTranslations } from "../../../en/sections/orders/sms";

export const smsTranslations: typeof EnglishSmsTranslations = {
  error: {
    no_phone: "Benutzer hat keine Telefonnummer",
  },
  orders: {
    list: {
      list: "{{appName}}: Hallo {{firstName}}, Sie haben {{count}} Bestellungen von {{period}}.",
      all_time: "alle Zeit",
    },
  },
};
