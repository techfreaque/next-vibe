import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",
  tags: {
    remoteConnection: "Vzdialené pripojenie",
  },
  post: {
    title: "Zaregistrovať miestnu inštanciu",
    titleShort: "Zaregistrovať inštanciu",
    description:
      "Pri pripájaní zavolá miestna inštancia tento koncový bod, aby sa zaregistrovala na cloudovej inštancii.",
    instanceId: {
      label: "Názov inštancie",
      description: "Jedinečný identifikátor miestnej inštancie",
      placeholder: "hermes",
      validation: {
        invalid: "Použite iba malé písmená, číslice a spojovníky.",
      },
    },
    localUrl: {
      label: "Adresa miestnej inštancie",
      description: "Adresa aplikácie na miestnej inštancii",
      placeholder: "http://localhost:3000",
      validation: {
        required: "Zadajte adresu miestnej inštancie.",
        invalid: "Zadajte platnú adresu URL.",
      },
    },
    reverseToken: {
      label: "Token spätného pripojenia",
      description:
        "Token JWT, ktorým vzdialená inštancia pri spätnom pripojení preukáže svoju totožnosť",
    },
    reverseLeadId: {
      label: "ID kontaktu pre spätné pripojenie",
      description: "ID kontaktu použité pri spätnom pripojení",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Skontrolujte zadané údaje a skúste to znova.",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Ak chcete zaregistrovať inštanciu, prihláste sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na registráciu inštancie nemáte oprávnenie.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zdroj sa nenašiel.",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba pri registrácii inštancie",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Inštancia s týmto ID je už zaregistrovaná",
        description:
          "K vášmu účtu už je zaregistrovaná inštancia s týmto ID. Vyberte iné ID.",
      },
    },
    success: {
      title: "Inštancia sa zaregistrovala",
      description: "Registrácia miestnej inštancie sa dokončila.",
    },
  },
};
