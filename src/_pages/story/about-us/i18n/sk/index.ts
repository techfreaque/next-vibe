import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "O nás | {{appName}}",
    category: "O nás",
    description:
      "Zisti, prečo {{appName}} sprístupňuje rozhovory s AI bez cenzúry.",
    imageAlt: "O službe {{appName}}",
    keywords: "o {{appName}}, AI bez cenzúry, poslanie AI, hodnoty AI",
    ogTitle: "O službe {{appName}} | Platforma AI bez cenzúry",
    ogDescription: "Zisti, ako sprístupňujeme AI bez cenzúry.",
    twitterTitle: "O službe {{appName}}",
    twitterDescription: "Prečo chceme sprístupniť rozhovory s AI bez cenzúry.",
  },
  hero: {
    eyebrow: "O službe {{appName}}",
    title: "AI, ktorá sa riadi tebou.",
    subtitle:
      "Na výber máš {{modelCount}} modelov, {{skillCount}} zručností a približne {{toolCount}} nástrojov. Nechýba SSH, e-mail, automatizácia prehliadača ani plánovanie úloh. Začni zdarma v službe {{appName}} alebo si ju spusti na vlastnom serveri.",
    ctaPrimary: "Začať četovať",
    ctaSecondary: "Čítať denník vývoja",
  },
  stats: {
    models: "modely AI",
    skills: "zručnosti",
    tools: "nástroje",
    founded: "rok založenia",
  },
  backToHome: "Späť na úvod",
  title: "O službe {{appName}}",
  subtitle: "Rozhovory s AI bez cenzúry",
  description:
    "Služba {{appName}} vznikla v roku {{foundedYear}}. Sprístupňuje špičkové modely bez toho, aby niekto určoval, na čo sa smieš opýtať. Model aj filter si vyberáš ty.",
  values: {
    title: "Z čoho nepoľavíme",
    description: "Štyri pravidlá pre každú funkciu v {{appName}}.",
    excellence: {
      title: "Filter vyberáš ty",
      description:
        "Bežné, otvorené aj necenzurované modely. Úroveň filtrov si zvolíš pre každý rozhovor.",
    },
    innovation: {
      title: "Celý zdrojový kód je otvorený",
      description:
        "Služba {{appName}} beží na projekte next-vibe. Zdrojový kód nájdeš na GitHube. Prezri si ho, vytvor si vlastnú kópiu repozitára a spusti ho na vlastnom zariadení.",
    },
    integrity: {
      title: "Súkromie ako základ",
      description:
        "Režim inkognito uchováva konverzácie v tvojom zariadení. Vygenerované médiá dočasne ukladáme z technických dôvodov. Tvoje údaje patria tebe a nepredávame ich.",
    },
    collaboration: {
      title: "Vyvíjame verejne",
      description:
        "Na blogu opisujeme plány, rozhodnutia o architektúre aj slepé uličky. Z tvojich podnetov vznikajú nové funkcie.",
    },
  },
  mission: {
    title: "Tvoja AI. Tvoje pravidlá.",
    subtitle: "AI bez cenzúry prístupná každému",
    description:
      "Veľkí poskytovatelia AI filtrujú otázky podľa pravidiel, ktoré nevidíš. Veríme, že dospelí sa dokážu rozhodnúť sami. Preto v službe {{appName}} nájdeš rôzne modely na jednom mieste a filter si vyberáš ty.",
    vision: {
      title: "Kam smerujeme",
      description:
        "Jedno miesto pre všetky dôležité modely AI, od bežných po otvorené a necenzurované. Hranice si určíš ty.",
    },
    approach: {
      title: "Ako postupujeme",
      description:
        "Najlepšie modely sprístupňujeme čo najskôr, s nástrojmi na vyhľadávanie, pamäť a automatizáciu. Súkromie zostáva predvoleným nastavením.",
    },
    commitment: {
      title: "K čomu sa zaväzujeme",
      description:
        "Jasné ceny a žiadne manipulatívne prvky rozhrania. Ak chceš platformu opustiť, ten istý kód môžeš kedykoľvek spustiť na vlastnom serveri.",
    },
  },
  contact: {
    title: "Máš otázky? Ozvi sa.",
    description:
      "Pošli podnet, navrhni spoluprácu, opýtaj sa za médiá alebo nahlás chybu. Každú správu číta človek.",
    cta: "Kontaktovať nás",
    selfHost: "Spustiť na vlastnom serveri",
  },
  post: {
    title: "O nás",
    description: "Koncový bod stránky O nás",
    form: {
      title: "Nastavenie stránky O nás",
      description: "Nastavte parametre stránky O nás",
    },
    response: {
      title: "Odpoveď",
      description: "Údaje odpovede stránky O nás",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba kontroly údajov",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera",
      },
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
        title: "Nenájdené",
        description: "Zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Došlo ku konfliktu údajov",
      },
    },
    success: {
      title: "Hotovo",
      description: "Operácia sa dokončila",
    },
  },
};
