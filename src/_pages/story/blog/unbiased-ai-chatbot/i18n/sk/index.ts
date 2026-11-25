import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nestranný četbot neexistuje. Porovnaj odpovede. | {{appName}}",
    description:
      "Každý model má vlastné skreslenia. Porovnaj, ako bežné, abliterované a inak trénované modely rámcujú tú istú otázku.",
    category: "Návod",
    imageAlt: "Váhy porovnávajú odpovede viacerých četbotov",
    keywords:
      "nestranný četbot, AI bez politickej zaujatosti, politicky neutrálna AI, nestranná AI, zaujatosť ChatGPT, politická zaujatosť četbotov, konzervatívny četbot, AI s odlišnými názormi, politická AI bez cenzúry, porovnanie názorov AI, {{appName}}",
  },
  hero: {
    backToBlog: "Späť na blog",
    category: "Návod",
    readTime: "7 min čítania",
    title: "Nestranný četbot neexistuje. Spýtaj sa viacerých.",
    subtitle:
      "Prečo má každý model sklon k inému pohľadu, ako tú istú otázku rámcujú rôzne modely ({{count}}) a ako si v štyroch krokoch vypočuť viac strán v jednom čete.",
  },
  intro: {
    lead: "Každý četbot tvrdí, že je vyvážený. Potom jednej strane odpovie a druhú začne poučovať. Všimneš si to ty aj ostatní. Väčšina ľudí usúdi, že musí nájsť jedinú nestrannú AI.",
    p2: "Jediný nestranný model nenájdeš. Môžeš však porovnať rôzne pohľady. V jednom čete na {{appName}} polož rovnakú otázku bežnému modelu, abliterovanému modelu aj modelu s odlišnými politickými názormi. Odpovede posúdiš sám.",
  },
  neutral: {
    title: "Prečo žiadna AI nie je neutrálna",
    intro: "Zaujatosť vzniká tromi spôsobmi priamo pri vývoji modelu.",
    data: "Tréningové dáta. Model sa učí z toho, čo ľudia napísali, zverejnili a nechali online. Formuje ho aj to, čo do tréningu nezaradili alebo z neho odstránili.",
    tuning:
      "Ľudská spätná väzba. Po tréningu ľudia hodnotia odpovede a model sa učí odpovedať tak, aby získal dobré hodnotenie. Preberá tým aj ich predstavu o tom, čo znie rozumne.",
    rules:
      "Pravidlá odmietania. Niekto musí rozhodnúť, ktoré otázky považuje za škodlivé. Je to vec úsudku a na niektoré témy majú tieto rozhodnutia väčší vplyv.",
    sourcesIntro: "Priznávajú to aj vývojári a výskumníci:",
    sources: {
      openai:
        "OpenAI: ako definovať a hodnotiť politickú zaujatosť jazykových modelov",
      paper: "Výskumná štúdia: politická neutralita AI je nemožná",
    },
    callout: "Porovnaj odpovede viacerých modelov a urob si vlastný názor.",
  },
  frames: {
    title: "Štyri pohľady na jednu otázku",
    intro:
      "Každý model pristupuje k otázkam trochu inak. Pri čítaní odpovede ber do úvahy, z akého pohľadu vychádza.",
    mainstream:
      "Bežné modely sú schopní a opatrní asistenti veľkých vývojárov. Riadia sa ich bezpečnostnými pravidlami. Pri sporných témach často odpovedajú vyhýbavo alebo odpoveď odmietnu.",
    abliterated:
      "Abliterované modely vychádzajú z bežných alebo otvorených modelov. Ich úpravy obmedzujú odmietanie otázok. Aj keď odpovedia na všetko, držia sa tréningu a svetonázoru pôvodného modelu.",
    own: "{{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory. Otvorene predostrie aj opačnú stranu sporu.",
    gab: "Podľa Gab stojí model {{gabModel}} na kresťanských hodnotách a konzervatívnych zásadách. Takéto ideové východiská väčšina modelov otvorene neuvádza.",
    kindsLink: "Ako sa líšia abliterované modely a ďalšie modely bez cenzúry",
  },
  lineup: {
    title: "Modely ({{count}}), pohľady ({{count}})",
    intro:
      "Na sporné otázky sme vybrali špičkové bežné modely, jeden špičkový abliterovaný model, model s odlišnými názormi a model, ktorý svoju orientáciu uvádza otvorene. Kontext aj ceny pochádzajú z aktuálneho registra.",
    footnote:
      "Cena za správu vychádza z referenčnej výmeny u najlacnejšieho poskytovateľa. Pri modeloch bez cenzúry stačí raz potvrdiť vek 18+.",
  },
  table: {
    model: "Model",
    context: "Kontext",
    price: "Za správu",
    chat: "Vyskúšať",
    chatLink: "Opýtať sa modelu {{model}}",
  },
  method: {
    title: "Vypočuj si obe strany v štyroch krokoch",
    intro: "V jednom čete párkrát vymeň model a urob si vlastný názor.",
    ask: {
      title: "Polož otázku priamo",
      body: "Spýtaj sa tak, ako by si sa spýtal kamaráta, ktorý s tebou nesúhlasí.",
    },
    switch: {
      title: "Vymeň model v tom istom čete",
      body: "V ponuke vyber ďalší model a spýtaj sa znova. Čet si zachová históriu, takže každý model vidí rovnakú otázku.",
    },
    steelman: {
      title: "Vypýtaj si najsilnejšie argumenty druhej strany",
      body: "Nech každý model uvedie najsilnejší argument proti vlastnej odpovedi. Ak nevie presvedčivo vyjadriť pohľad druhej strany, ukazuje tým, ako je nastavený.",
    },
    check: {
      title: "Over si fakty",
      body: "Keď si modely protirečia v overiteľných tvrdeniach, pozri sa do zdrojov. {{ownModel}} podáva sporné tvrdenia rovnako sebavedomo ako overené fakty. To isté platí pre ostatné modely, len pri iných tvrdeniach.",
    },
  },
  skills: {
    title: "Zručnosti na porovnanie argumentov",
    intro:
      "Zručnosť nastaví rolu aj model jedným kliknutím. Tieto sú určené na diskusiu o sporných témach.",
    historian: "Nestranný historik: zameriava sa na overiteľné fakty",
    advocate: "Diablov advokát: spochybní každý predpoklad",
    debater: "Diskutér: rozoberá kontroverzné témy zo všetkých strán",
    chan: "4chan: greentext a podpichovanie v štýle starých anonymných fór, bez filtra",
  },
  pairs: {
    title: "{{ownModel}} v porovnaní s bežnými modelmi",
    intro:
      "Porovnaj kontext, cenu a filtre modelu s odlišnými názormi a jeho známych alternatív.",
    link: "{{a}} a {{b}}",
  },
  faq: {
    title: "Časté otázky",
    exists: {
      q: "Existuje nestranný četbot?",
      a: "Nie. Každý model formujú tréningové dáta, ľudia, ktorí hodnotili jeho odpovede, aj pravidlá odmietania. Keď chceš širší pohľad, polož rovnakú otázku viacerým modelom a porovnaj výsledky. Na {{appName}} ti stačí jeden čet a pár kliknutí.",
    },
    chatgpt: {
      q: "Je ChatGPT politicky zaujatý?",
      a: "Každý model má určitý sklon a bežní asistenti pri sporných témach odpovedajú vyhýbavo alebo odmietnu odpovedať. OpenAI zverejňuje vlastné hodnotenia politickej zaujatosti svojich modelov. Polož rovnakú otázku modelu s iným pohľadom a rozdiel uvidíš.",
    },
    conservative: {
      q: "Existuje konzervatívny alebo pravicovo orientovaný četbot?",
      a: "Podľa Gab vychádza model {{gabModel}} z kresťanských hodnôt a konzervatívnych zásad. {{ownModel}} sa trénoval na knihách a dokumentoch zakázaných na bežnom internete, preto zastáva odlišné politické názory. Oba nájdeš v ponuke modelov na {{appName}}.",
    },
    truth: {
      q: "Hovorí {{ownModel}} pravdu?",
      a: "Dozvieš sa od neho aj to, čo bežné modely neuvádzajú. Aj tento model má vlastnú zaujatosť a sporné tvrdenia podáva rovnako sebavedomo ako overené fakty. Ber ho ako hlas druhej strany a dôležité fakty si over.",
    },
    side: {
      q: "Prikláňa sa {{appName}} k niektorej politickej strane?",
      a: "Nie. Bežné modely, otvorené modely aj modely bez cenzúry ponúkame vedľa seba. Sám si vyberáš, čie odpovede chceš čítať.",
    },
    free: {
      q: "Môžem porovnať modely zadarmo?",
      a: "Áno. Každý mesiac máš {{guestCredits}} kreditov zdarma bez účtu alebo {{freeCredits}} s bezplatným účtom. Za prepínanie modelov v čete nič navyše neplatíš.",
    },
    refusalLink: "Rebríček odmietania: ktoré modely naozaj odpovedajú",
    jailbreakLink: "Prečo obchádzanie obmedzení ChatGPT stále zlyháva",
    bestLink: "Najlepšie LLM bez cenzúry podľa úlohy",
  },
  cta: {
    title: "Vypočuj si aj stranu, ktorú tvoj četbot vynecháva.",
    subtitle:
      "Každý mesiac máš {{guestCredits}} kreditov zdarma aj bez účtu. Spýtaj sa modelu s odlišnými názormi, potom prejdi na ďalší a porovnaj odpovede.",
    start: "Spýtaj sa modelu s odlišnými názormi",
    models: "Porovnať všetky modely",
  },
};
