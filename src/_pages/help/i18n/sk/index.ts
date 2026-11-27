import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nav: {
    home: "Domov",
  },
  breadcrumb: "Pomoc",
  meta: {
    contact: {
      title: "Centrum pomoci: časté otázky, návody a podpora | {{appName}}",
      description:
        "Odpovede na otázky o kreditoch, platbách, súkromí, necenzurovaných modeloch a API. Návody k {{appName}} a priamy kontakt na podporu cez e-mail a Discord.",
      category: "Podpora",
      imageAlt: "Centrum pomoci {{appName}}",
      keywords:
        "{{appName}} pomoc, {{appName}} časté otázky, podpora četu s AI, pomoc s necenzurovanou AI, kredity AI, prístup k API",
      ogTitle: "Centrum pomoci {{appName}}",
      ogDescription:
        "Odpovede na otázky o kreditoch, platbách, súkromí, necenzurovaných modeloch a prístupe k API.",
      twitterTitle: "Centrum pomoci {{appName}}",
      twitterDescription: "Odpovede, návody a priamy kontakt na podporu.",
    },
  },
  pages: {
    help: {
      title: "S čím potrebuješ pomôcť?",
      subtitle:
        "Tu nájdeš rýchlu odpoveď aj podrobný návod. Ak ti nepomôžu, ozvi sa priamo nám.",
      topics: {
        title: "Vyber si tému",
        models: {
          title: "Modely",
          body: "Porovnaj {{modelCount}} četových modelov podľa ceny, veľkosti kontextu a úrovne filtrovania.",
        },
        uncensored: {
          title: "Necenzurovaný čet s AI",
          body: "Ktoré modely odpovedajú bez bežných filtrov a ako s nimi začať.",
        },
        skills: {
          title: "Zručnosti",
          body: "Vyber si z hotových špecialistov a postáv alebo si vytvor vlastných.",
        },
        studio: {
          title: "Media Studio",
          body: "Obrázky, video, hudba, prevod textu na reč aj prepis na jednom mieste.",
        },
        pricing: {
          title: "Programy a kredity",
          body: "Čo zahŕňa predplatné, ako sa míňajú kredity a ako ich doplniť.",
        },
        api: {
          title: "Dokumentácia API",
          body: "Koncové body kompatibilné s OpenAI a Anthropic aj s príkladmi, ktoré si môžeš skopírovať.",
        },
        selfHost: {
          title: "Vlastná inštalácia",
          body: "Spusti si vlastnú inštanciu z otvoreného zdrojového kódu.",
        },
      },
      info: {
        title: "Potrebuješ ešte pomoc? Napíš nám",
        intro:
          "Pošli nám správu cez formulár nižšie alebo sa nám ozvi priamo. Každú správu si prečítame.",
        supportEmail: "E-mail podpory",
        discord: "Discord",
        discordUrl: "Pridaj sa k nám na Discorde",
      },
      guides: {
        title: "Obľúbené návody",
      },
      faq: {
        title: "Časté otázky",
        more: "Čítať ďalej",
        questions: {
          q1: {
            question: "Čo je {{appName}}?",
            answer:
              "{{appName}} je platforma na čet s AI. Ponúka {{modelCount}} bežných, otvorených a necenzurovaných modelov. Výberom modelu si určíš aj úroveň filtrovania. K dispozícii máš aj zručnosti, priečinky, tvorbu médií a API.",
          },
          q2: {
            question: "Ako môžem zaplatiť?",
            answer:
              "Kartou, cez PayPal, Apple Pay alebo Google Pay prostredníctvom Stripe. Cez NOWPayments prijímame aj kryptomeny vrátane bitcoinu, etheru a stablecoinov. Predplatné stojí od {{subscriptionPrice}} mesačne. Predplatitelia si môžu dokúpiť aj balíky kreditov.",
          },
          q3: {
            question: "Ako fungujú kredity?",
            answer:
              "Za používanie modelov platíš kreditmi. Na začiatok dostaneš kredity zadarmo. Predplatné ti ich doplní každý mesiac: {{subscriptionCredits}} za {{subscriptionPrice}}, {{plusCredits}} za {{plusPrice}}, {{proCredits}} za {{proPrice}} alebo {{ultraCredits}} za {{ultraPrice}}. Ak potrebuješ viac, k predplatnému si môžeš dokúpiť balík {{packCredits}} kreditov za {{packPrice}}. Kredity z balíkov neprepadnú a platia pre všetkých {{modelCount}} modelov AI.",
          },
          q4: {
            question: "Sú moje údaje súkromné a v bezpečí?",
            answer:
              "Súkromné priečinky vidíš iba ty. V režime inkognito na našich serveroch neukladáme históriu četu, vytvorené multimediálne súbory sa tam však ukladajú. V nastaveniach si môžeš vyexportovať všetky údaje alebo odstrániť účet aj s osobnými údajmi. Tvoje údaje nikdy nepredávame.",
          },
          q5: {
            question: "Môžem si platformu vyskúšať bez účtu?",
            answer:
              "Áno. Bez účtu získaš mesačne až {{freeCreditsGuest}} bezplatných kreditov. S overeným bezplatným účtom sa tento počet zvýši na {{freeCreditsSignedIn}} a po potvrdení odberu noviniek na {{freeCreditsMax}}.",
          },
          q6: {
            question:
              "Aký je rozdiel medzi modelmi s odstráneným odmietaním a necenzurovanými modelmi?",
            answer:
              "Pri modeloch označených ako „abliterated“ vývojári v bežnom modeli odstránili mechanizmus odmietania, takže sa otázkam menej vyhýba. Uncensored LM vznikol inak. Trénoval sa aj na knihách a dokumentoch zakázaných v hlavnom prúde internetu, a preto vyjadruje aj protichodné politické názory.",
          },
          q7: {
            question: "Ako získam prístup k API?",
            answer:
              "Kľúče API sa sprístupnia po prvom nákupe predplatného alebo balíka kreditov. Samotné bezplatné kredity na prístup k API nestačia. Potom si v účte vytvor kľúč a v klientovi pre OpenAI alebo Anthropic nastav našu základnú adresu.",
          },
          q8: {
            question: "Môžem prevádzkovať {{appName}} na vlastnom serveri?",
            answer:
              "Áno. Zdrojový kód je otvorený. Naklonuj repozitár, spusti bun i a vibe dev a dokonči nastavenie v prehliadači. Vlastnú inštanciu môžeš prepojiť s účtom na {{appName}}.",
          },
        },
      },
    },
  },
};
