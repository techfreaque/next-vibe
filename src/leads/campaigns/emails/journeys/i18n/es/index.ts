import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "Un usuario de unbottled.ai",
        previewLeadId: "vista previa-lead-id",
        previewEmail: "preview@example.com",
        previewBusinessName: "Acme Corp",
        previewContactName: "Previsualizar usuario",
        previewPhone: "+1234567890",
        previewCampaignId: "vista previa-campaign-id",
      },
      footer: {
        unsubscribeText: "Estás recibiendo esto porque has optado.",
        unsubscribeLink: "Cancelar suscripción",
      },
      journeyInfo: {
        uncensoredConvert: {
          name: "Conversión a modelos sin censura",
          description:
            "Un entusiasta compartiendo su descubrimiento de unbottled.ai",
          longDescription:
            "Enthusiast persona compartiendo un verdadero descubrimiento con transparencia afiliada",
          characteristics: {
            tone: "Tono casual y conspirador",
            story: "Historia personal genuina",
            transparency: "Transparencia de los afiliados",
            angle: "Ángulo de anticensura",
            energy: "Energía entusiasta",
          },
        },
        sideHustle: {
          name: "Hustle lateral",
          description:
            "Un afiliado transparente que comparte casos de uso real",
          longDescription:
            "Transparent affiliate marketer share real semanal use cases",
          characteristics: {
            disclosure: "Publicación completa de afiliados en primera línea",
            updates: "Actualizaciones semanales de casos de uso",
            income: "Historia pasiva de ingresos",
            proof: "Prueba práctica, no hipócrita",
            energy: "Honest bull energy",
          },
        },
        quietRecommendation: {
          name: "Recomendación silenciosa",
          description:
            "Un profesional de bajo rango que pasa por una herramienta probada",
          longDescription:
            "Profesional de bajo rango pasando por una herramienta probada durante semanas",
          characteristics: {
            signal: "Corto, alta señal a ruido",
            specifics: "Sin hype, sólo detalles",
            testing: "3 semanas de pruebas de backstory",
            comparison: "Comparación honesta con ChatGPT",
            affiliate: "Mención de afiliado mínimo",
          },
        },
        signupNurture: {
          name: "Nutrición de registro",
          description: "Secuencia de embarque para usuarios recién firmados",
          longDescription:
            "E-mails de bienvenida y a bordo ayudando a los nuevos usuarios a empezar con la plataforma",
        },
        retention: {
          name: "Retención",
          description: "Reiniciación de los suscriptores existentes",
          longDescription:
            "Correos electrónicos basados en el valor para mantener a los suscriptores activos comprometidos y explorar características",
        },
        winback: {
          name: "Winback",
          description: "Ganar usuarios inactivos o retorcidos",
          longDescription:
            "Campaña de reactivación dirigida a usuarios que se han mantenido en silencio o cancelados",
        },
        newsletterMay2026: {
          name: "Boletín May 2026",
          description:
            "Boletín de noticias único sobre Cortex, Dreamer, Autopilot y generación de medios",
          longDescription:
            "May 2026 boletín de noticias de actualización de productos enviado a todos los usuarios registrados con la admisión honesta de errores y características destacados",
        },
        newsletterNov2026: {
          name: "Boletín de noviembre 2026",
          description:
            "Boletín de reactivación de un solo paso: un compañero a su lado, su filtro y un predeterminado más barato",
          longDescription:
            "Boletín de la conversión de noviembre 2026 para recibir opt-ins, dirigido por el ethos compañero y el modelo predeterminado más barato",
        },
      },
    },
  },
};
