import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Koncový bod API",
  tags: {
    tasks: "Úlohy",
    cron: "Cron",
    bulk: "Hromadné akcie",
  },
  post: {
    title: "Hromadná akcia s úlohami",
    titleShort: "Hromadná správa úloh",
    description:
      "Hromadne odstráni, zapne, vypne alebo spustí viacero úloh cron.",
    fields: {
      ids: {
        label: "ID úloh",
        description: "Zoznam ID úloh, na ktoré sa má akcia použiť",
      },
      action: {
        label: "Akcia",
        description: "Akcia, ktorá sa má vykonať na vybraných úlohách",
        options: {
          delete: "Odstrániť",
          enable: "Zapnúť",
          disable: "Vypnúť",
          run: "Spustiť teraz",
        },
      },
      succeeded: {
        label: "Úspešné",
        description: "Počet úspešne spracovaných úloh",
      },
      failed: {
        label: "Zlyhalo",
        description: "Počet úloh, ktoré sa nespracovali",
      },
      errors: {
        label: "Chyby",
        description: "Zoznam chýb podľa úloh",
      },
    },
    errors: {
      fetchFailed: "ID úloh pre hromadnú akciu sa nepodarilo načítať.",
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Poskytnuté údaje o hromadnej akcii sú neplatné",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte povolenie na vykonávanie hromadných akcií",
      },
      internal: {
        title: "Interná chyba",
        description: "Nastala chyba pri vykonávaní hromadnej akcie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup k tomuto zdroju je zakázaný",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri spracovaní hromadnej akcie došlo ku konfliktu",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Aspoň jedna z vybraných úloh sa nenašla.",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Sú tu neuložené zmeny.",
      },
    },
    success: {
      completed: {
        title: "Hromadná akcia sa dokončila",
        description: "Hromadná akcia sa vykonala na vybraných úlohách.",
      },
    },
  },
};
