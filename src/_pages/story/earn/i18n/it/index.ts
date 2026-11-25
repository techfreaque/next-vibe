import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Guadagna con {{appName}}: commissioni ricorrenti sugli inviti",
    category: "Earn",
    description:
      "Condividi {{appName}} e guadagna il {{directPct}} di ogni pagamento dei tuoi invitati, finché pagano. Pubblica una skill e guadagna il {{skillBonusPct}} su chi portano altri.",
    imageAlt: "Guadagna con {{appName}}",
    keywords:
      "{{appName}}, programma di riferimento, affiliazione, commissione ricorrente, AI competenze, reddito passivo",
  },
  hero: {
    eyebrow: "Earn",
    title: "Condividi quello che usi. Guadagna ogni mese.",
    subtitle:
      "Ricevi il {{directPct}} di ogni pagamento delle persone che inviti, ogni mese in cui pagano. Pubblica una skill e guadagna il {{skillBonusPct}} ogni volta che qualcun altro la condivide.",
    ctaPrimary: "Ottieni il tuo link",
    ctaSecondary: "Crea una skill",
  },
  start: {
    label: "Da zero",
    title: "Tre passi. Nessun pubblico richiesto.",
    intro:
      "Non serve avere un pubblico. Ti basta un amico che continua a usare il servizio e pagare per ricevere una commissione ogni mese.",
    step1: {
      title: "Ottieni il tuo link",
      body: "Crea un account gratuito e apri la pagina di riferimento. Il tuo link personale è pronto in pochi secondi.",
    },
    step2: {
      title: "Condividilo o condividi un'abilità",
      body: "Getta il link in una chat, un README, un video. O pubblicare un'abilità: il suo link di condivisione porta automaticamente il tuo referral.",
    },
    step3: {
      title: "Guadagnare su ogni pagamento",
      body: "{{directPct}} di tutto quello che pagano, ricorrente. Quando un altro membro porta qualcuno attraverso la vostra abilità, si ottiene {{skillBonusPct}} di quell'utente troppo.",
    },
  },
  split: {
    label: "La divisione",
    title: "Dove ogni pagamento va",
    perUser: "Per utente su {{examplePrice}} /mo",
  },
  facts: {
    direct: "per rinvio, ricorrente",
    skill: "come creatore di abilità, quando gli altri lo condividono",
    payout: "prelievo minimo cripto",
    hours: "elaborazione di pagamenti cripto",
    hoursValue: "{{cryptoPayoutHours}} h",
  },
  cta: {
    title: "Il tuo link è a un clic di distanza.",
    subtitle:
      "Conto gratuito. Niente spese minime. I guadagni si trasformano in crediti dopo la finestra di rimborso {{holdDays}} -day. Ritirata a BTC o USDC da {{minPayout}}.",
    primary: "Ottieni il tuo link",
    secondary: "Leggi la guida principiante",
    partners: "Per creatori e newsletter",
  },
};
