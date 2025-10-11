import type { ordersTranslations as EnglishOrdersTranslations } from "../../../../en/sections/orders/email/orders";

export const ordersTranslations: typeof EnglishOrdersTranslations = {
  list: {
    subject: "Ihre Bestellungen von {{appName}}",
    heading: "Ihr Bestellverlauf",
    greeting: "Hallo {{firstName}},",
    message: "Hier ist eine Zusammenfassung Ihrer {{count}} Bestellungen:",
    table: {
      order_id: "Bestell-ID",
      date: "Datum",
      status: "Status",
      total: "Gesamtsumme",
    },
    status: {
      new: "Neu",
      preparing: "In Vorbereitung",
      ready: "Bereit",
      out_for_delivery: "Unterwegs",
      delivered: "Geliefert",
      cancelled: "Storniert",
    },
    no_orders: "Sie haben noch keine Bestellungen.",
    closing: "Vielen Dank, dass Sie unseren Service nutzen!",
    all_time: "alle Zeit",
  },
};
