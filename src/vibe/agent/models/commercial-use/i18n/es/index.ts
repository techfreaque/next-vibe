import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    status: {
      allowed: "Uso comercial permitido",
      restricted: "Uso comercial restringido",
      unclear: "Uso comercial sin aclarar",
    },
    reason: {
      openLicense: "Licencia abierta que permite el uso comercial.",
      providerTerms:
        "Las condiciones del proveedor permiten el uso comercial de los resultados.",
      nonCommercialLicense:
        "La licencia del modelo solo permite el uso no comercial.",
      separateLicense:
        "El uso comercial requiere una licencia aparte del creador del modelo.",
      useLimits:
        "El proveedor excluye algunos usos comerciales, como cine, televisión, videojuegos y reventa.",
      communityLicense:
        "Licencia comunitaria con restricciones de uso adicionales. El uso comercial no está confirmado.",
      hostPersonalUse:
        "Las condiciones del proveedor de alojamiento solo cubren el uso personal.",
      vendorApproval:
        "El creador del modelo solo concede el uso comercial previa solicitud.",
      termsUnconfirmed:
        "Aún no hemos podido confirmar las condiciones del proveedor.",
    },
  },
  label: "Uso comercial",
  checkLicense: "Revisa la licencia del modelo para tu caso de uso.",
  termsLink: "Cómo funcionan los derechos sobre resultados de IA",
};
