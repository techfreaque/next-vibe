import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Skontrolujte krajinu firmy, režim DPH a dátum účinnosti.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa.",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Režim DPH môže zmeniť iba vlastník alebo správca firmy.",
    },
    notFound: { title: "Nenašlo sa", description: "Firma sa nenašla" },
    conflict: {
      title: "Dátum účinnosti je už obsadený",
      description: "Pre tento dátum už má firma uložený režim DPH.",
    },
    server: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba.",
    },
    network: {
      title: "Chyba siete",
      description: "Skontrolujte pripojenie a skúste to znova.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Nastala neočakávaná chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
  },
  reviewDescription:
    "Overte si, aký režim DPH platí pre túto spoločnosť k zvolenému dátumu.",
  view: "Skontrolovať režim DPH",
  asOf: "Ku dňu",
  change: "Zmeniť režim DPH",
  regimes: {
    standard: "Bežný režim DPH",
    german: "Nemecko: oslobodenie malého podniku (§ 19 UStG)",
    austrian: "Rakúsko: oslobodenie malého podniku (§ 6 ods. 1 bod 27 UStG)",
    slovak: "Slovensko: neplatiteľ DPH",
  },
  title: "Režim DPH firmy",
  description: "Vyberte režim DPH pre doklady od určeného dátumu.",
  company: "Firma",
  from: "Platnosť od",
  save: "Uložiť režim DPH",
  regime: "Režim DPH",
  saved: "Vybraný režim platí od uvedeného dátumu.",
  conflict: "Vyberte iný dátum alebo skontrolujte už uložený režim.",
  foreign:
    "Služby zo zahraničia posúďte s daňovým poradcom. Prenesenie daňovej povinnosti sa môže vzťahovať aj na malý podnik oslobodený od DPH.",
  saleConflict:
    "Vyčíslená DPH je v rozpore s oslobodením firmy. Pred vystavením faktúry skontrolujte jej položky.",
};
