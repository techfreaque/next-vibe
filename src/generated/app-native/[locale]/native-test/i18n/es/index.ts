import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    welcome: "Bienvenido a {{appName}}",
    description: "Locale:",
    locale: {
      title: "Local actual",
      description: "Esta página muestra soporte local",
    },
    features: {
      title: "Características de la plataforma",
      description: "Esta plataforma soporta múltiples superficies",
      unified: {
        title: "Superficie unificada",
        description: "Una base de código para las herramientas web, nativas, CLI y AI -callable",
      },
      types: {
        title: "Tipo de seguridad",
        description:
          "Soporte completo TypeScript con comprobación de tipo estricto en plataformas",
      },
      async: {
        title: "Async Support",
        description: "Componentes de servidor con carga de datos asinc",
      },
    },
    links: {
      chat: "Ir a Chat",
      help: "Ayuda",
      about: "Sobre nosotros",
      story: "Nuestra historia",
      designTest: "Prueba de diseño",
    },
    status: {
      title: "Situación de la plataforma",
      platform: "Plataforma",
      universal: "Universal",
      routing: "Routing",
      filebased: "Basado en archivos",
      styling: "Styling",
      nativewind: "NativeWind",
    },
  },
};
