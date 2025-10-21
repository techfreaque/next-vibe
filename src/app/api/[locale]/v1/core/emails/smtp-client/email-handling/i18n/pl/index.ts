import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  email: {
    errors: {
      rendering_failed: "Nie udało się renderować szablonu e-mail",
      send_failed: "Nie udało się wysłać e-maila",
      email_failed_subject: "E-mail nie powiódł się",
      unknown_recipient: "Nieznany odbiorca",
      email_render_exception: "Wystąpił wyjątek renderowania e-maila",
      batch_send_failed: "Nie udało się wysłać wsadowo e-maili",
    },
  },
};
