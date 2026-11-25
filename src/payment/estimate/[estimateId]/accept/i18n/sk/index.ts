import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cenové ponuky",
  tags: { payment: "platba", estimate: "cenová ponuka" },
  post: {
    title: "Prijať cenovú ponuku",
    titleShort: "Prijať cenovú ponuku",
    description: "Označiť cenovú ponuku ako prijatú zákazníkom",
    form: {
      title: "Prijať cenovú ponuku",
      description: "Označiť cenovú ponuku ako prijatú zákazníkom",
    },
    response: { success: "Úspech", message: "Stavová správa" },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Požadované overenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre",
      },
      server: { title: "Chyba servera", description: "Interná chyba servera" },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Cenová ponuka sa nenašla",
      },
      conflict: {
        title: "Konflikt",
        description: "Nie je možné vykonať akciu v aktuálnom stave",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Úspech",
      description: "Označiť cenovú ponuku ako prijatú zákazníkom",
    },
  },
  estimateId: {
    label: "ID cenovej ponuky",
    description: "Cenová ponuka, ktorej sa úkon týka",
  },
  widget: {
    back: "Späť",
    submit: "Prijať cenovú ponuku",
    accepted: "Cenová ponuka bola označená ako prijatá.",
    confirmMessage: "Cenová ponuka sa označí ako prijatá zákazníkom.",
  },
};
