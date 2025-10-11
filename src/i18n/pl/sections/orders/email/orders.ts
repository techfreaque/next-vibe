import type { ordersTranslations as EnglishOrdersTranslations } from "../../../../en/sections/orders/email/orders";

export const ordersTranslations: typeof EnglishOrdersTranslations = {
  list: {
    subject: "Twoje Zamówienia z {{appName}}",
    heading: "Historia Twoich Zamówień",
    greeting: "Witaj {{firstName}},",
    message: "Oto podsumowanie Twoich {{count}} zamówień:",
    table: {
      order_id: "ID Zamówienia",
      date: "Data",
      status: "Status",
      total: "Suma",
    },
    status: {
      new: "Nowe",
      preparing: "Przygotowywane",
      ready: "Gotowe",
      out_for_delivery: "W Dostawie",
      delivered: "Dostarczone",
      cancelled: "Anulowane",
    },
    no_orders: "Nie masz jeszcze żadnych zamówień.",
    closing: "Dziękujemy za korzystanie z naszej usługi!",
    all_time: "cały czas",
  },
};
