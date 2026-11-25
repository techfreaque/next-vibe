import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Gana con {{appName}}: comisiones recurrentes por referidos",
    category: "Earn",
    description:
      "Comparte {{appName}} y gana el {{directPct}} de cada pago de tus referidos mientras paguen. Publica una skill y gana el {{skillBonusPct}} de quien traigan otros.",
    imageAlt: "Ganar con {{appName}}",
    keywords:
      "{{appName}}, programa de remisión, afiliado, comisión recurrente, habilidades AI, ingresos pasivos",
  },
  hero: {
    eyebrow: "Earn",
    title: "Comparte lo que usas. Cobra cada mes.",
    subtitle:
      "Recibe el {{directPct}} de cada pago de las personas que invites, cada mes que paguen. Publica una habilidad y gana el {{skillBonusPct}} cada vez que alguien más la comparta.",
    ctaPrimary: "Consigue tu enlace",
    ctaSecondary: "Crea una habilidad",
  },
  start: {
    label: "De cero",
    title: "Tres pasos. No se necesita audiencia.",
    intro:
      "No necesitas seguidores. Con un amigo que siga usando y pagando el servicio, puedes cobrar una comisión cada mes.",
    step1: {
      title: "Consigue tu enlace.",
      body: "Cree una cuenta gratuita y abra la página de referencia. Su enlace personal está listo en segundos.",
    },
    step2: {
      title: "Compártelo o compartir una habilidad",
      body: "Deja el enlace en un chat, un README, un vídeo. O publicar una habilidad: su enlace de acciones lleva su remisión automáticamente.",
    },
    step3: {
      title: "Ganar en cada pago",
      body: "{{directPct}} de todo lo que pagan, recurriendo. Cuando otro miembro trae a alguien a través de su habilidad, usted consigue {{skillBonusPct}} de ese usuario también.",
    },
  },
  split: {
    label: "La división",
    title: "Donde cada pago va",
    perUser: "Por usuario en {{examplePrice}} /mo",
  },
  facts: {
    direct: "por remisión, recurriendo",
    skill: "como creador de habilidades, cuando otros lo comparten",
    payout: "retiro mínimo criptográfico",
    hours: "criptopago procesamiento",
    hoursValue: "{{cryptoPayoutHours}} h",
  },
  cta: {
    title: "Su enlace está a un clic.",
    subtitle:
      "Cuenta libre. Sin gasto mínimo. Las ganancias se convierten en créditos después de la ventana de reembolso {{holdDays}} -día. Retirada a BTC o USDC desde {{minPayout}}.",
    primary: "Consigue tu enlace.",
    secondary: "Lea la guía inicial",
    partners: "Para creadores y boletines informativos",
  },
};
