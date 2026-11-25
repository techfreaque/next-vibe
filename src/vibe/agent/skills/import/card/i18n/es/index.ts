import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Herramientas AI",
  tags: {
    skills: "habilidades",
  },
  enums: {
    visibility: {
      private: "Privadas",
      unlisted: "No incluidos en la lista",
      public: "Público",
    },
  },
  post: {
    title: "Importar tarjeta de personaje",
    titleShort: "Importar tarjeta",
    description:
      "Importa una tarjeta de personaje (V1, V2 o V3) desde SillyTavern, Chub, RisuAI o cualquier app con formato Tavern. Acepta el archivo .json, una tarjeta .png con los datos incrustados o el JSON de la tarjeta como texto. Nombre, descripción, personalidad, escenario, primer mensaje, diálogo de ejemplo, instrucciones de la tarjeta y etiquetas pasan a un nuevo personaje tuyo. La imagen de una tarjeta PNG se convierte en el avatar. Nada de la tarjeta se ejecuta. Importar la misma tarjeta otra vez devuelve el personaje existente.",
    intro:
      "Trae tus personajes contigo. Sube el archivo de tarjeta que exportaste de SillyTavern, Chub o RisuAI.",
    supported: "Tarjetas V1, V2 y V3. JSON o PNG, hasta 10 MB.",
    mapping: {
      title: "Qué se importa",
      fields:
        "Nombre, descripción, personalidad, escenario, primer mensaje, diálogo de ejemplo, instrucciones de la tarjeta, etiquetas, creador.",
      avatar: "Tarjetas PNG: la imagen se convierte en el avatar.",
      safe: "Los lorebooks y scripts se omiten. Nada de la tarjeta se ejecuta.",
    },
    card: {
      label: "Archivo de tarjeta",
      description: "Tarjeta de personaje en .json o .png",
      validation: {
        required: "Elige un archivo de tarjeta.",
        tooLarge: "El archivo de tarjeta supera los 10 MB.",
      },
    },
    visibility: {
      label: "Visibilidad",
      description:
        "Privado: solo tú. No listado: fuera de la lista pública. Público: visible para todos.",
    },
    response: {
      id: { content: "ID del personaje" },
      name: { content: "Nombre" },
      platform: { content: "Origen" },
      creatorName: { content: "Creador de la tarjeta" },
      sourceUrl: { content: "Enlace de origen" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Ya importado" },
      importedFields: { content: "Importado" },
    },
    fields: {
      name: "nombre",
      avatar: "avatar",
      greeting: "primer mensaje",
      description: "descripción",
      definition: "personalidad y escenario",
      tags: "etiquetas",
    },
    result: {
      imported: "{{name}} está listo.",
      alreadyImported: "Ya importaste a {{name}}. Abriendo tu copia.",
      fieldsList: "Importado: {{fields}}",
      openSkill: "Abrir personaje",
      importAnother: "Importar otra tarjeta",
    },
    errors: {
      validation: {
        title: "Tarjeta no válida",
        description: "Elige un archivo de tarjeta de personaje (.json o .png).",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor.",
      },
      unauthorized: {
        title: "Inicia sesión",
        description: "Inicia sesión para importar personajes.",
      },
      forbidden: {
        title: "No permitido",
        description: "Tu cuenta no puede importar personajes.",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró la tarjeta.",
      },
      server: {
        title: "Error al importar",
        description: "Algo falló durante la importación. Inténtalo de nuevo.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar.",
      },
      conflict: {
        title: "Importación en curso",
        description: "Esta tarjeta ya se está importando.",
      },
      invalidCard:
        "No es una tarjeta de personaje. Usa el archivo .json o .png exportado desde SillyTavern, Chub o RisuAI.",
      noCardInPng:
        "Este PNG no contiene datos de tarjeta. Expórtalo de nuevo como tarjeta de personaje o usa el archivo .json.",
      rateLimited:
        "Demasiadas importaciones. Espera {{seconds}} segundos e inténtalo de nuevo.",
    },
    success: {
      title: "Personaje importado",
      description: "Tu copia está lista para chatear.",
    },
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      label: "Importar tarjeta",
      loadingText: "Importando...",
    },
  },
};
