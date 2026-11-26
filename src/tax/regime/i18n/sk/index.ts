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
    slovakSection7: "Slovensko: registrácia podľa § 7 (neplatiteľ DPH)",
    slovakSection7a: "Slovensko: registrácia podľa § 7a (neplatiteľ DPH)",
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
  choose: "Vyberte režim DPH",
  back: "Späť",
  appliesOn: "Režim DPH k {{date}}",
  invoiceText: "Text na faktúrach",
  savedTitle: "{{regime}} platí od {{date}}",
  pickCompany: {
    title: "Vyberte spoločnosť",
    message:
      "Pozrite si, aké pravidlá DPH platia pre jej faktúry k ľubovoľnému dňu.",
  },
  hints: {
    standard:
      "Faktúry uplatňujú DPH podľa sadzieb spoločnosti. DPH z nákupov je odpočítateľná.",
    german: "Faktúry bez DPH, s odkazom na oslobodenie podľa § 19 UStG.",
    austrian:
      "Faktúry bez DPH, s odkazom na rakúsky režim malých podnikateľov.",
    slovak: "Faktúry bez DPH, pretože podnik nie je registrovaný pre DPH.",
    slovakSection7:
      "Tuzemské faktúry sú bez DPH. Nadobudnutie tovaru z EÚ nad limit zdaníte sami cez svoje IČ DPH.",
    slovakSection7a:
      "Tuzemské faktúry sú bez DPH. Služby pre podnikateľov z EÚ fakturujete s prenesením daňovej povinnosti cez svoje IČ DPH.",
  },
};
