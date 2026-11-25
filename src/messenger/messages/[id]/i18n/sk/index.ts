import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-maily",
  tags: {
    emails: "E-maily",
  },
  title: "Podrobnosti o e-maile",
  titleShort: "Podrobnosti o e-maile",
  description: "Načítať jeden e-mail podľa jeho jedinečného ID",
  container: {
    title: "Podrobnosti o e-maile",
    description: "Zobraziť podrobné informácie o konkrétnom e-maile",
  },
  fields: {
    id: {
      label: "ID e-mailu",
      description: "Jedinečné ID e-mailu, ktorý sa má načítať",
    },
  },
  response: {
    email: {
      title: "Podrobnosti o e-maile",
      description: "Úplné údaje o požadovanom e-maile",
      id: "ID e-mailu",
      subject: "Predmet",
      recipientEmail: "E-mail príjemcu",
      recipientName: "Meno príjemcu",
      senderEmail: "E-mail odosielateľa",
      senderName: "Meno odosielateľa",
      type: "Typ e-mailu",
      status: "Stav",
      templateName: "Názov šablóny",
      emailProvider: "Poskytovateľ e-mailov",
      externalId: "Externé ID",
      sentAt: "Odoslané",
      deliveredAt: "Doručené",
      openedAt: "Otvorené",
      clickedAt: "Kliknutie na odkaz",
      retryCount: "Počet opakovaných pokusov",
      error: "Chybové hlásenie",
      userId: "ID používateľa",
      leadId: "ID kontaktu",
      createdAt: "Vytvorené",
      updatedAt: "Aktualizované",
    },
  },
  get: {
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Zadané ID e-mailu je neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť podrobnosti e-mailu, prihláste sa",
      },
      not_found: {
        title: "E-mail sa nenašiel",
        description: "E-mail so zadaným ID sa nenašiel",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť tento e-mail",
      },
      server: {
        title: "Chyba servera",
        description: "Pri načítavaní e-mailu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
    },
  },
  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Zadané ID e-mailu je neplatné",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Ak chcete zobraziť podrobnosti e-mailu, prihláste sa",
    },
    notFound: {
      title: "E-mail sa nenašiel",
      description: "E-mail so zadaným ID sa nenašiel",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáte oprávnenie zobraziť tento e-mail",
    },
    server: {
      title: "Chyba servera",
      description: "Pri načítavaní e-mailu nastala interná chyba servera",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Pri spracovaní požiadavky na e-mail nastal konflikt",
    },
    network: {
      title: "Chyba siete",
      description: "Pri načítavaní e-mailu nastala chyba siete",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
  },
  success: {
    title: "E-mail načítaný",
    description: "Podrobnosti e-mailu boli načítané",
  },
  widget: {
    parties: "Odosielateľ a príjemca",
    to: "Komu",
    from: "Od",
    timestamps: "Dátumy a časy",
    sentAt: "Odoslané",
    deliveredAt: "Doručené",
    openedAt: "Otvorené",
    clickedAt: "Kliknutie na odkaz",
    technical: "Technické údaje",
    template: "Šablóna",
    provider: "Poskytovateľ",
    externalId: "Externé ID",
    retryCount: "Počet opakovaných pokusov",
    error: "Chyba",
    associations: "Prepojenia",
    lead: "Kontakt",
    user: "Používateľ",
    notFound: "E-mail sa nenašiel",
  },
  enums: {
    status: {
      pending: "Čaká sa",
      sent: "Odoslané",
      delivered: "Doručené",
      opened: "Otvorené",
      clicked: "S kliknutím na odkaz",
      bounced: "Vrátené",
      failed: "Zlyhalo",
      unsubscribed: "Odber zrušený",
    },
    type: {
      transactional: "Transakčné",
      marketing: "Marketing",
      notification: "Oznámenie",
      system: "Systém",
      leadCampaign: "Kampaň pre kontakty",
      userCommunication: "Komunikácia s používateľmi",
    },
    provider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Iné",
    },
  },
};
