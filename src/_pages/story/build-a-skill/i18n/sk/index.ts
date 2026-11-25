import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Vytvor si vlastnú zručnosť AI",
    description:
      "Premeň pracovný postup na zručnosť AI, ktorú môžeš používať opakovane. Otvor stránku zručností alebo sa v čete obráť na Theu. Bez programovania.",
    category: "Zručnosti",
    imageAlt: "Tvorba vlastnej zručnosti AI v službe {{appName}}",
    keywords:
      "tvorba zručnosti AI, vlastná AI, tvorca zručností, {{appName}}, systémové pokyny, osobnosť AI",
  },
  hero: {
    badge: "Tvorca zručností",
    title: "Vytvor si zručnosť.",
    titleLine2: "Nastav si AI po svojom.",
    subtitle:
      "Osobnosť, model, nástroje aj hlas nastavíš raz a zostanú tvoje. Vytvor si zručnosť na ľubovoľnú úlohu. Zdieľaj ju a zarábaj na nej.",
    ctaPrimary: "Vytvoriť zručnosť",
    ctaSecondary: "Požiadať Theu alebo Hermesa",
  },
  what: {
    title: "Zručnosť je uložené nastavenie AI.",
    subtitle: "Nastav ju raz, použi kdekoľvek a zdieľaj s kýmkoľvek.",
    item0Label: "Systémové pokyny",
    item0Body:
      "Identita a pokyny v rozsahu od 200 do 500 slov. Osobnosť má pôsobiť ako človek, nie ako zoznam častých otázok.",
    item1Label: "Výber modelu",
    item1Body:
      "Filtruj podľa výkonu, úrovne obsahu a ceny alebo nastav konkrétny model napevno.",
    item2Label: "Nástroje",
    item2Body:
      "Presne určíš, čo povolíš: vyhľadávanie, tvorbu obrázkov, pamäť, programovanie, hudbu a video.",
    item3Label: "Hlas",
    item3Body: "Vyber hlasový model pre hovorené odpovede.",
  },
  ways: {
    title: "Dva spôsoby tvorby",
    subtitle: "Vyber si ten, ktorý ti vyhovuje.",
    way1Badge: "Stránka zručností",
    way1Title: "Tlačidlo Vytvoriť v zozname zručností",
    way1Body:
      "Otvor stránku zručností alebo výber modelu v ľubovoľnom čete. Klikni na Vytvoriť. Vyplň názov, systémové pokyny, model a nástroje. Hotovo.",
    way1Detail: "Celé nastavenie je v jednom formulári.",
    way1Cta: "Otvoriť zručnosti",
    way2Badge: "Čet",
    way2Title: "Požiadaj Theu alebo Hermesa",
    way2Body:
      "Otvor čet a napíš: „Vytvor mi zručnosť na výučbu klinického uvažovania pre medikov.“ Podagent Skill Creator položí pár otázok, pripraví pokyny, vyberie model, nastaví nástroje, vytvorí zručnosť a pripne ju na bočný panel.",
    way2Detail:
      "Thea odovzdá úlohu podagentovi Skill Creator, ktorý používa skill-create, favorite-create a tool-help. Ty opíšeš, čo chceš, a on to vytvorí.",
    way2Cta: "Otvoriť čet",
  },
  prompt: {
    title: "Systémové pokyny, ktoré fungujú",
    subtitle:
      "Pokyny sú najdôležitejšie. Dobrý opis osobnosti pôsobí ľudsky a číta sa prirodzene.",
    dos: "Čo funguje",
    donts: "Čo nefunguje",
    do0Title: "Začni identitou",
    do0Body:
      "„Si [meno], [rola], ktorá [robí X].“ Túto vetu daj vždy na prvý riadok.",
    do1Title: "Vyber 3 až 5 konkrétnych čŕt",
    do1Body:
      "„Priamy a vedie sokratovský dialóg“ funguje lepšie ako „ochotný a informatívny“.",
    do2Title: "Urči rozsah odbornosti",
    do2Body:
      "V čom sa vyzná do hĺbky a ktoré otázky má prenechať iným. Povedz to jednoznačne.",
    do3Title: "Urči spôsob komunikácie",
    do3Body: "„Vždy odpovedaj v jednom odseku“ je jasný a použiteľný pokyn.",
    do4Title: "Menej ako 500 slov",
    do4Body:
      "Model pri každej odpovedi číta celé zadanie. Kratšie pokyny fungujú lepšie.",
    dont0Title: "Zoznamy pravidiel ako v zmluve",
    dont0Body:
      "„Vždy pomáhaj a nikdy nebuď nepríjemný.“ Takýto pokyn dostáva každá AI a nič nepridáva.",
    dont1Title: "„Vždy pomáhaj“",
    dont1Body: "Model to už vie. Vynechaj to.",
    dont2Title: "Protichodné požiadavky",
    dont2Body:
      "„Buď tvorivý, ale nikdy sa neodchýľ od témy.“ Model váha medzi dvoma zámermi. Vyber si jeden.",
    dont3Title: "Dlhé zoznamy schopností",
    dont3Body: "Model pozná svoje schopnosti. Dokumentáciu netreba opakovať.",
  },
  examples: {
    title: "Zručnosti, ktoré ľudia naozaj tvoria",
    item0Name: "Klinické uvažovanie",
    item0Category: "Vzdelávanie",
    item0Desc:
      "Pomáha nacvičiť uvažovanie skúseného klinika. Rozoberá prípady, diferenciálnu diagnostiku a rozhodovanie pod tlakom.",
    item1Name: "Kontrola kódu",
    item1Category: "Programovanie",
    item1Desc:
      "Pozná tvoje technológie a dbá na pravidlá tímu. Dokumentáciu si môže vyhľadať.",
    item2Name: "Autor bez cenzúry",
    item2Category: "Tvorba",
    item2Desc:
      "Fikcia, hranie rolí a debata bez obmedzení platformy. Používa modely bez cenzúry.",
    item3Name: "Osobný mentor",
    item3Category: "Spoločník",
    item3Desc:
      "Vedie sokratovský dialóg, hovorí priamo a pomáha s osobným rozvojom. Vychádza zo skutočnej filozofie autora.",
    item4Name: "Výskumný agent",
    item4Category: "Analýza",
    item4Desc:
      "Vyhľadáva cez Brave a Kagi, načítava stránky, spája zistenia a ukladá ich do pamäte.",
    item5Name: "Odborník, na ktorého nemáš rozpočet",
    item5Category: "Špecialista",
    item5Desc:
      "Znalosti konzultanta, právnika či finančného poradcu v jednej zručnosti. Informácie za 400 USD na hodinu máš k dispozícii zdarma.",
  },
  dev: {
    title: "Pre vývojárov: skill.ts",
    body: "Beží ti next-vibe lokálne? Požiadaj agenta o vytvorenie súboru zručnosti. Použije rovnakú štruktúru ako zabudované zručnosti, pripravenú na kompiláciu a uloženie do repozitára.",
    note: "Agent pozná celú schému. Opíš, čo chceš. Vytvorí súbor, zaregistruje zručnosť a tá bude dostupná.",
  },
  cta: {
    title: "Vytvor si vlastnú zručnosť.",
    subtitle: "Opíš, čo potrebuješ. Skill Creator sa postará o zvyšok.",
    primary: "Vytvoriť zručnosť",
    secondary: "Požiadať Theu alebo Hermesa",
  },
};
