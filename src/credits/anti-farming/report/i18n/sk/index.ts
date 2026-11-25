import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { antiFarming: "anti-farming", admin: "admin" },
  get: {
    title: "Prehľad zneužívania bezplatných kreditov",
    titleShort: "Prehľad zneužívania kreditov",
    description:
      "Prehľad zneužívania bezplatných kreditov. Zoraďuje podsiete podľa počtu zablokovaných pokusov a získaných bezplatných prídelov, uvádza najčastejšie e-mailové domény pri duplicitných či jednorazových registráciách a zobrazuje platné limity.",
    fields: {
      days: {
        label: "Obdobie (dni)",
        description:
          "Počet dní spätne pre zablokované pokusy, prídely návštevníkov a e-mailové domény. Prídely účtov sa vždy počítajú za aktuálny mesiac podľa UTC.",
      },
    },
    response: {
      window: "Obdobie",
      thresholds: "Aktívne limity",
      totals: "Blokované pokusy",
      subnetsByBlocked: "Podsiete s najviac zablokovanými pokusmi",
      subnetsByClaims: "Podsiete s najviac pridelenými bezplatnými prídelmi",
      emailDomains: "Najčastejšie e-mailové domény",
    },
    success: {
      title: "Prehľad zneužívania kreditov je pripravený",
      description: "Prehľad zneužívania kreditov bol vytvorený",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Iba pre správcov",
      },
      server: {
        title: "Chyba servera",
        description: "Prehľad zneužívania kreditov sa nepodarilo vytvoriť",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Niečo sa pokazilo",
      },
      validation: {
        title: "Neplatná požiadavka",
        description: "Zadajte počet dní od 1 do 365",
      },
      notFound: { title: "Nenašlo sa", description: "Nič sa nenašlo" },
      conflict: {
        title: "Konflikt údajov",
        description: "Konflikt požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Požiadavka sa nedostala na server",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv uložte zmeny",
      },
    },
  },
  widget: {
    shadowHits:
      "Tieňový režim. Požiadavky od indexovacích robotov: {{crawler}}, odpočty podľa skupiny: {{cluster}}, odpočty podľa modelu: {{model}}.",
    refresh: "Obnoviť",
    loading: "Načítava sa prehľad zneužívania kreditov…",
    windowLine:
      "Obdobie od {{from}} do dneška. Počet dní: {{days}}. Prídely účtov za mesiac {{month}} (UTC).",
    kpi: {
      total: "Celkovo zablokované",
      subnetAccountLimit: "Dosiahnutý limit prídelov účtov",
      subnetGuestLimit: "Dosiahnutý limit prídelov návštevníkov",
      duplicateEmail: "Duplicitná e-mailová adresa",
      disposableEmail: "Jednorazový e-mail",
      subnetSignupLimit: "Dosiahnutý limit registrácií",
    },
    col: {
      subnet: "Podsieť",
      blocked: "Blokované",
      accountGranted: "Účty s prídelom",
      accountBlocked: "Účty bez prídelu",
      guestGranted: "Návštevníci s prídelom",
      guestBlocked: "Návštevníci bez prídelu",
      lastSeen: "Posledný výskyt",
      domain: "Doména",
      duplicate: "Duplikát",
      disposable: "Jednorazové",
      total: "Spolu",
    },
    colHint:
      "Účty sa počítajú za aktuálny mesiac, návštevníci za vybrané obdobie. S prídelom znamená, že dostali bezplatné kredity. Bez prídelu znamená, že podsieť dosiahla limit.",
    empty: {
      subnets: "V tomto období sa nezaznamenala žiadna aktivita podsietí.",
      domains:
        "V tomto období neprebehli registrácie s duplicitnou ani jednorazovou e-mailovou adresou.",
    },
    limits: {
      accountPerSubnet: "Prídely účtov na podsieť za mesiac",
      guestPerSubnet: "Prídely návštevníkov na podsieť za deň",
      guestIpWindow:
        "Doba spoločného prídelu pre návštevníkov z jednej IP adresy (h)",
      signupLookback:
        "Koľko hodín spätne sa pri registrácii započíta spotreba návštevníka",
      subnetPrefix: "Veľkosť podsiete",
      signupsPerSubnet: "Nové účty na podsieť za 24 h",
    },
  },
};
