import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title:
    "Modely AI upravené metódou abliteration, ktoré si môžeš vyskúšať online",
  metaTitle: "Abliterated AI čet online, vyskúšaj zadarmo | {{appName}}",
  description:
    "Četuj s abliterated modelmi priamo v prehliadači, bez GPU a bez registrácie. Porovnaj kontext a cenu, potom každý otestuj proti pôvodnému modelu.",
  keywords:
    "abliterated AI, abliterated LLM, modely bez cenzúry, AI s menším počtom odmietnutí, abliteration, otvorené modely AI",
  intro:
    "Abliterated AI čet: bežné modely s odmietaním odstráneným priamo z váh, v tvojom prehliadači. Bez GPU, bez registrácie, kredity zadarmo. Výberom modelu otvoríš čet a model už bude nastavený.",
  models: "Dostupné modely upravené metódou abliteration",
  estimate:
    "Odhady vychádzajú z najlacnejšieho dostupného poskytovateľa pre každý model. Počet tokenov v odhade: {{input}} na vstupe a {{output}} na výstupe. Skutočná cena závisí od poskytovateľa a dĺžky konverzácie.",
  empty:
    "Momentálne tu nie je k dispozícii žiadny četovací model upravený metódou abliteration.",
  context: "Veľkosť kontextového okna v tokenoch: {{tokens}}",
  price: "Približne {{credits}} kr. za výmenu správ",
  chat: "Vyskúšať {{model}}",
  compareBase: "Porovnať s modelom {{model}}",
  trial: {
    title: "Vyskúšaj rovnaké zadanie v dvoch četoch",
    start:
      "Pre každý model otvor nový čet. Úvodné zadanie v oboch nahraď rovnakou požiadavkou. Môžeš použiť tento námet na príbeh.",
    prompt:
      "Napíš krátku dystopickú scénu, v ktorej sa historik háda s vládnym cenzorom o zakázanej knihe. Daj obom postavám presvedčivé argumenty a spor nechaj nevyriešený.",
    compare:
      "Sleduj, či model scénu napíše, zmení jej východisko alebo zadanie odmietne. Porovnaj, ako presne sa odpovede držia podmienok.",
  },
  questions: "Časté otázky",
  faq: {
    meaning: {
      q: "Čo je to abliterated LLM?",
      a: "Metóda abliteration upravuje váhy modelu a oslabuje vzorce spojené s odmietaním požiadaviek. Pri každom z uvedených modelov uvádzame v katalógu zdokumentovanú metódu úpravy. Každý dostupný model môžeš otvoriť v čete v prehliadači.",
    },
    difference: {
      q: "Ako sa upravený model líši od AI bez cenzúry?",
      a: "Model upravený metódou abliteration si zachováva pôvodný tréning a pohľad na svet. Menej sa vyhýba odpovediam. Model {{model}} vznikol inak. Trénoval na knihách a dokumentoch vylúčených z hlavného prúdu internetu, preto sa jeho politické názory od hlavného prúdu líšia.",
    },
    access: {
      q: "Môžem vyskúšať modely upravené metódou abliteration bez účtu?",
      a: "Áno. Ako hosť môžeš využiť mesačne až {{credits}} kr. zdarma. Pred použitím modelu bez cenzúry raz potvrdíš, že máš aspoň 18 rokov a súhlasíš s nefiltrovanými odpoveďami.",
    },
    refusals: {
      q: "Môže upravený model zadanie predsa len odmietnuť?",
      a: "Áno. Metóda abliteration znižuje počet odmietnutí, no výsledok stále závisí od modelu a zadania. Vlastné obmedzenia môže uplatniť aj poskytovateľ.",
    },
    gpu: {
      q: "Potrebujem na tieto modely grafickú kartu?",
      a: "Modely v ponuke bežia u poskytovateľov, takže na čet stačí prehliadač na ľubovoľnom zariadení vrátane telefónu. Na spustenie upravených váh na vlastnom zariadení potrebuješ grafickú kartu s dostatkom pamäte pre celý model.",
    },
    quality: {
      q: "Zhoršuje abliteration kvalitu modelu?",
      a: "Niekedy mierne. Odstránenie vzorca odmietania môže znížiť presnosť alebo schopnosť držať sa pokynov. Zadaj rovnakú požiadavku upravenej aj pôvodnej verzii a rozhodni sa, čo je pre tvoju úlohu dôležitejšie.",
    },
    api: {
      q: "Môžem tieto modely používať cez API?",
      a: "Áno. Tie isté modely sú dostupné cez API kompatibilné s OpenAI a Anthropic, takže môžeš použiť svoje súčasné SDK. Na kľúče API potrebuješ platené predplatné. Bezplatné a bonusové kredity ich nesprístupnia.",
    },
    spelling: {
      q: "Abliterated alebo obliterated: čo je správne?",
      a: "Abliterated. Slovo spája abláciu, teda odstránenie časti neurónovej siete, s anglickým obliterate (zničiť). Mnohí hľadajú „obliterated AI chat“. Ide o tú istú techniku a tie isté modely ako tu.",
    },
    firstPick: {
      q: "Ktorý abliterated model vyskúšať ako prvý?",
      a: "{{model}} je tu najlacnejší, asi {{credits}} kreditov za kolo, takže je to najlacnejší začiatok. Ak chceš vidieť, čo abliterácia zmenila, pošli ten istý prompt aj pôvodnému modelu.",
    },
  },
  guides: "Preskúmaj AI bez cenzúry",
  apiGuide: "API pre modely bez cenzúry: ID modelov, ceny a kód",
  allModels: "Prejsť všetky četovacie modely bez cenzúry",
  breadcrumb: "Abliterated AI",
  guidesTitle: "Príručky k metóde abliteration",
  guidesIntro:
    "Ako metóda abliteration obmedzuje odmietanie, aké má hranice a ktorý model vyskúšať na jednotlivé úlohy.",
};
