import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Partnerský program {{appName}} | Opakovaná provízia {{directPct}} bez stropu",
    category: "Partneri",
    description:
      "Pre tvorcov, odberové zoznamy a katalógy. Získaj {{directPct}} z každého nákupu ľudí, ktorých privedieš na {{appName}}. Provízie sa opakujú bez stropu a sledujú sa podľa odkazu. Čerpaj ich v kreditoch alebo vyber v BTC či USDC.",
    imageAlt: "Partnerský program {{appName}}",
    keywords:
      "{{appName}}, partnerský program, affiliate program AI bez cenzúry, opakovaná provízia, program pre tvorcov, sponzorstvo noviniek",
  },
  hero: {
    eyebrow: "Partnerský program",
    title: "Tvoje publikum chce AI bez poučovania. Zarábaj na odporúčaniach.",
    subtitle:
      "Z každého nákupu získaš {{directPct}}, kým odporúčaní používatelia platia. Bez stropu. Vytvor samostatný odkaz pre každé video, vydanie alebo zápis v katalógu a uvidíš, odkiaľ prichádzajú zákazníci.",
    ctaPrimary: "Získať partnerský odkaz",
    ctaSecondary: "Prečítať podmienky",
  },
  facts: {
    commission: "z každého nákupu, opakovane",
    capValue: "Bez stropu",
    cap: "pre počet odporúčaní aj výšku zárobku",
    holdValue: "{{holdDays}} dní",
    hold: "lehota na vrátenie platby pred potvrdením provízie",
    minPayout: "minimálna suma výberu",
  },
  audience: {
    label: "Pre koho je program",
    title: "Pre ľudí, ktorí už hovoria o AI",
    intro:
      "Ak tvoje publikum naráža na odmietanie, filtre alebo vysoké ceny, máš čo odporučiť. My ti dáme odkaz a údaje o výsledkoch.",
    creators: {
      title: "Tvorcovia",
      body: "YouTube, TikTok a živé prenosy. Do opisu každého videa vlož vlastný odkaz. Uvidíš, ktoré video prináša aj platiacich používateľov.",
    },
    newsletters: {
      title: "Odberové zoznamy a blogy",
      body: "Jeden odkaz na vydanie alebo článok. Čitatelia, ktorí sa cezň zaregistrujú, sa priradia k tebe, takže aj jediná zmienka môže zarábať opakovane.",
    },
    directories: {
      title: "Katalógy a recenzné weby",
      body: "Pridaj nás do svojho katalógu s vlastným odkazom. Každý používateľ, ktorý sa cezň zaregistruje, zostane trvalo priradený k tebe.",
    },
  },
  steps: {
    label: "Ako to funguje",
    title: "Začni za päť minút",
    intro: "Bez žiadosti, schvaľovania a minimálnej veľkosti publika.",
    step1: {
      title: "Vytvor si bezplatný účet",
      body: "Zaregistruj sa. Hneď potom sa otvorí stránka odporúčaní.",
    },
    step2: {
      title: "Vytvor kód a samostatné odkazy",
      body: "Raz si vyber kód odporúčania. Potom vytvor samostatný sledovaný odkaz pre každé video, vydanie alebo zápis v katalógu. Každý odkaz má vlastné počty návštev a registrácií aj vlastný prehľad zárobku.",
    },
    step3: {
      title: "Zdieľaj odkaz",
      body: "Vlož ho do opisu, pripnutého komentára, päty noviniek alebo záznamu v katalógu. Každý, kto sa cezň zaregistruje, sa priradí k tebe.",
    },
    step4: {
      title: "Zarábaj z každého nákupu",
      body: "Získaš {{directPct}} z každej platby za predplatné alebo balík kreditov. Po uplynutí lehoty na vrátenie platby ({{holdDays}} dní) dostaneš kredity, ktoré môžeš minúť alebo vybrať.",
    },
  },
  terms: {
    label: "Podmienky",
    title: "Čo určuje tvoj zárobok",
    intro:
      "Netreba odomykať ďalšie úrovne. Všetky podmienky nájdeš v tejto tabuľke.",
    rows: {
      commission: {
        term: "Provízia",
        value:
          "{{directPct}} z každého nákupu používateľov, ktorých odporučíš. Počíta sa predplatné aj balíky kreditov.",
      },
      duration: {
        term: "Trvanie",
        value:
          "Provízia sa vypláca opakovane, kým odporúčaní používatelia platia. Keď sa niekto zaregistruje cez tvoj odkaz, zostane priradený k tebe.",
      },
      cap: {
        term: "Strop",
        value: "Počet používateľov ani výška zárobku nie sú obmedzené.",
      },
      hold: {
        term: "Lehota na vrátenie platby",
        value:
          "Nový zárobok čaká na potvrdenie. Lehota v dňoch: {{holdDays}}. Ak sa platba dovtedy vráti alebo stornuje cez poskytovateľa platby, provízia sa zruší. Po uplynutí lehoty sa potvrdí.",
      },
      payout: {
        term: "Výplata",
        value:
          "Potvrdený zárobok môžeš minúť ako kredity v pomere 1 : 1 alebo ho vybrať v BTC či USDC.",
      },
      minimum: {
        term: "Minimálna suma výberu",
        value:
          "{{minPayout}}. Výplatu v kryptomene spracujeme po schválení. Lehota spracovania v hodinách: {{cryptoPayoutHours}}.",
      },
      second: {
        term: "Druhá úroveň",
        value:
          "Ak niekto, koho si odporučil, privedie vlastných používateľov, získaš {{level2Pct}} aj z ich platieb.",
      },
      tracking: {
        term: "Sledovanie",
        value:
          "Každý odkaz obsahuje kód odporúčania a značky UTM. Na stránke odporúčaní vidíš priebežne návštevy, registrácie, platiacich používateľov aj zárobok z každého odkazu.",
      },
    },
  },
  product: {
    label: "Čo odporúčaš",
    title: "Platforma AI, ktorú môžeš odporučiť svojmu publiku",
    intro:
      "Odporúča sa ľahko, pretože rieši problémy, na ktoré ľudia narážajú.",
    choice: {
      title: "Bežné, otvorené aj necenzurované modely",
      body: "Známe modely vedľa otvorených a necenzurovaných v jednom čete. Medzi modelmi bez cenzúry nájdeš bežné modely s odstráneným odmietaním aj UncensoredLM trénovaný na knihách a dokumentoch vylúčených z hlavného prúdu internetu. Používatelia môžu model kedykoľvek zmeniť.",
    },
    control: {
      title: "Úroveň filtrov si vyberá používateľ",
      body: "O odmietnutí sa nerozhoduje potichu za používateľa. Každý si vyberie, akú úroveň filtrov chce.",
    },
    free: {
      title: "Začni zdarma",
      body: "Noví používatelia môžu skúsiť čet bez platobnej karty. Publikum sa rozhodne ľahšie a tebe môže pribudnúť viac registrácií. Na API stačí ktorékoľvek predplatné od {{subPrice}} mesačne.",
    },
  },
  press: {
    label: "Napísali o nás",
    title: "Vyskúšané na reálnom projekte",
    intro:
      "Nezávislé redakcie si platformu vyskúšali pri práci a zverejnili svoje zistenia.",
    items: {
      tudoSobreIa: {
        meta: "Brazília · november 2026",
        body: "Pomocou modelov na obrázky, video, hlas a hudbu vytvorili svojho maskota aj 50-sekundový film. Podľa ich recenzie sa platforma tvorcom oplatí.",
        link: "Prečítať recenziu v portugalčine",
      },
    },
  },
  faq: {
    label: "Časté otázky",
    title: "Otázky od partnerov",
    items: {
      audience: {
        q: "Potrebujem určitú veľkosť publika?",
        a: "Nie. Nepodávaš žiadosť a netreba žiadny minimálny počet sledovateľov. Aj jediný čitateľ s predplatným ti prináša províziu každý mesiac, v ktorom zaplatí.",
      },
      counts: {
        q: "Čo sa počíta ako nákup?",
        a: "Každá platba za predplatné a každý dokúpený balík kreditov od odporúčaného používateľa. Počíta sa každé obnovenie predplatného.",
      },
      attribution: {
        q: "Ako dlho trvá priradenie?",
        a: "Natrvalo. Keď sa niekto zaregistruje cez tvoj odkaz, priradí sa k tvojmu účtu. Po registrácii priradenie nezávisí od platnosti súboru cookie.",
      },
      placements: {
        q: "Môžem jednotlivé umiestnenia sledovať samostatne?",
        a: "Áno. Na stránke odporúčaní vytvor samostatný sledovaný odkaz pre každé video, vydanie alebo záznam. Každý má vlastný prehľad návštev, registrácií, platiacich používateľov aj zárobku.",
      },
      refunds: {
        q: "Čo ak sa platba vráti?",
        a: "Zárobok čaká na potvrdenie. Lehota v dňoch: {{holdDays}}. Ak sa platba počas nej vráti alebo stornuje cez poskytovateľa platby, provízia sa zruší. Po uplynutí lehoty je tvoja.",
      },
      payout: {
        q: "Ako dostanem výplatu?",
        a: "Potvrdený zárobok dostaneš ako kredity, ktoré môžeš minúť na platforme. Od {{minPayout}} môžeš požiadať o výber v BTC alebo USDC. Lehota spracovania po schválení v hodinách: {{cryptoPayoutHours}}.",
      },
    },
  },
  cta: {
    title: "O päť minút môžeš mať svoj odkaz.",
    subtitle:
      "Účet zdarma a bez schvaľovania. Opakovaná provízia {{directPct}} z každého nákupu bez stropu.",
    primary: "Získať partnerský odkaz",
    secondary: "Ako fungujú odporúčania",
  },
};
