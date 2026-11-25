import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",
  tags: {
    remoteConnection: "Vzdialené pripojenie",
  },
  widget: {
    signInDescription: "Ak chceš pripojiť vzdialený účet, prihlás sa.",
    adminOnlyDescription:
      "Odchádzajúce pripojenia môže vytvárať iba správca. Ak ťa pripojila vzdialená inštancia, pripojenie uvidíš vyššie.",
    benefit1:
      "Spomienky sa synchronizujú automaticky. Prenesie sa aj to, čo tu AI naučíš.",
    benefit2:
      "Z miestnej inštancie máš prístup ku cloudovým modelom a nástrojom AI.",
    benefit3: "Kontext budeš mať na všetkých svojich zariadeniach.",
    adminBenefit1: "Spomienky sa synchronizujú automaticky v oboch smeroch.",
    adminBenefit2:
      "Cloudová AI nájde a použije tvoje miestne nástroje na SSH, prácu so súbormi a spúšťanie kódu.",
    adminBenefit3:
      "Úlohy z cloudu môžeš zveriť tomuto počítaču. Claude Code ich vykoná tu.",
    adminBenefit4:
      "Pri každej synchronizácii sa odošle prehľad funkcií. Thea tak vie, čo táto inštancia dokáže.",
  },
  post: {
    title: "Pripojiť sa k vzdialenému účtu",
    titleShort: "Vzdialené pripojenie",
    description:
      "Pripoj svoj účet k vzdialenej inštancii. Spomienky sa zosynchronizujú a nástroje AI budeš môcť používať odkiaľkoľvek.",
    remoteUrl: {
      label: "Adresa URL vzdialenej inštancie",
      description:
        "Webová adresa tvojho vzdialeného účtu, napríklad https://unbottled.ai",
      placeholder: "https://unbottled.ai",
      validation: {
        required: "Zadaj adresu vzdialenej inštancie.",
        invalid: "Zadaj platnú adresu, napríklad https://unbottled.ai.",
      },
    },
    email: {
      label: "E-mail",
      description: "Tvoja e-mailová adresa na vzdialenej inštancii",
      placeholder: "you@example.com",
      validation: {
        required: "Zadaj svoj e-mail.",
        invalid: "Zadaj platnú e-mailovú adresu.",
      },
    },
    password: {
      label: "Heslo",
      description: "Tvoje heslo na vzdialenej inštancii",
      placeholder: "••••••••",
      validation: {
        required: "Zadaj svoje heslo.",
      },
    },
    token: {
      label: "Token",
      description: "Token JWT zo vzdialenej inštancie (vyplní sa automaticky)",
      validation: {
        required: "Najprv sa prihlás na vzdialenú inštanciu.",
      },
    },
    leadId: {
      label: "ID kontaktu",
      description:
        "ID kontaktu zo vzdialenej inštancie (vyplní sa automaticky)",
    },
    isInferenceProvider: {
      label: "Použiť na spracovanie požiadaviek AI",
      description:
        "Povoliť prenos odpovedí AI cez toto pripojenie. Vzdialená inštancia spracúva cyklus AI cez spätný kanál WebSocket.",
    },
    syncScope: {
      label: "Rozsah synchronizácie",
      description: "Ktoré údaje sa synchronizujú cez toto pripojenie.",
    },
    credentialWarning:
      "Prihlasovacie údaje idú z prehliadača priamo na vzdialený server. Token uložený na tomto serveri však dáva jeho prevádzkovateľovi úplný prístup k tvojmu vzdialenému účtu. Môže tam vykonať všetko, čo ty. Pripájaj sa iba zo serverov, ktorým úplne dôveruješ.",
    actions: {
      submit: "Pripojiť",
      submitting: "Pripája sa…",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Skontrolujte zadané údaje a skúste to znova.",
      },
      network: {
        title: "Spojenie zlyhalo",
        description:
          "Vzdialený server je nedostupný. Skontroluj adresu a skús to znova.",
      },
      unauthorized: {
        title: "Prihlásenie zlyhalo",
        description: "Nesprávny e-mail alebo heslo pre vzdialený účet",
      },
      forbidden: {
        title: "Vzdialený server neprijíma pripojenia",
        description:
          "Vzdialený server nie je nastavený na prijímanie pripojení. Pripoj sa ku cloudovej inštancii, napríklad unbottled.ai. Iná miestna inštalácia toto pripojenie neprijme.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Na zadanej adrese sa vzdialený server nenašiel.",
      },
      server: {
        title: "Chyba vzdialeného servera",
        description: "Na vzdialenom serveri nastala chyba.",
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
        title: "Už pripojené",
        description: "K vzdialenej inštancii s týmto ID už máš pripojenie.",
      },
      instanceIdConflict: {
        title: "Inštancia s týmto ID je už zaregistrovaná",
        description:
          "Vzdialená strana už eviduje inštanciu s týmto ID. Vyber iné ID.",
      },
      noLeadId: {
        title: "Chyba pripojenia",
        description: "Nepodarilo sa nadviazať reláciu so vzdialeným serverom.",
      },
      invalidUrl: {
        title: "Neplatná adresa vzdialenej inštancie",
        description:
          "Zadaj adresu verejného servera. Miestne a súkromné adresy nie sú povolené.",
      },
    },
    success: {
      title: "Pripojené",
      description: "Tvoj účet je pripojený k vzdialenej inštancii.",
    },
  },
};
