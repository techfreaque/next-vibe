import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  email: {
    errors: {
      rendering_failed: "E-Mail-Vorlage konnte nicht gerendert werden",
      send_failed: "E-Mail konnte nicht gesendet werden",
      email_failed_subject: "E-Mail fehlgeschlagen",
      unknown_recipient: "Unbekannter Empfänger",
      email_render_exception: "E-Mail-Rendering-Ausnahme aufgetreten",
      batch_send_failed: "Batch-E-Mail-Versand fehlgeschlagen",
    },
  },
};
