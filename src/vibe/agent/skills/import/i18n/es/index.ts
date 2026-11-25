import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Herramientas AI",
  tags: {
    skills: "habilidades",
  },
  enums: {
    platform: {
      characterAi: "Character.AI",
      talkie: "Talkie",
      characterCard: "Tarjeta de personaje",
    },
    visibility: {
      private: "Privadas",
      unlisted: "No incluidos en la lista",
      public: "Público",
    },
  },
  post: {
    title: "Importar el carácter desde el enlace",
    titleShort: "Importación desde el enlace",
    description:
      "Importar un personaje de un personaje público. AI (character.ai, c.ai) o Talkie (talkie-ai.com) link. Copias nombre, avatar, saludo, descripción, definición y etiquetas en un nuevo personaje que posee, acredita al creador original y enlaces de vuelta a la fuente. Importar el mismo enlace vuelve a devolver el carácter existente.",
    dynamicTitle: "Importación: {{url}}",
    intro:
      "Pruebe un enlace de carácter público. Copiamos lo que la página muestra públicamente y acreditamos al creador original.",
    supported: "Funciona con el personaje. AI y Talkie.",
    url: {
      label: "Enlace de carácter",
      description: "Enlace público a la página de caracteres",
      placeholder: "https://character.ai/character/...",
      validation: {
        invalid: "Pruebe un enlace completo comenzando con https://",
      },
    },
    visibility: {
      label: "Visibilidad",
      description:
        "Privada: sólo tú. Sin lista: fuera de la lista pública. Público: lista para todos.",
    },
    response: {
      id: { content: "Carácter ID" },
      name: { content: "Nombre" },
      platform: { content: "Fuente" },
      creatorName: { content: "Creador original" },
      sourceUrl: { content: "Enlace de origen" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Ya importados" },
      importedFields: { content: "Importados" },
    },
    fields: {
      name: "Nombre",
      avatar: "avatar",
      greeting: "saludo",
      description: "descripción",
      definition: "definición",
      tags: "tags",
    },
    result: {
      imported: "{{name}} está listo.",
      alreadyImported: "Ya importaste {{name}}. Abriendo su copia.",
      credit: "Originalmente por {{creator}} en {{platform}}",
      creditUnknown: "Importado de {{platform}}",
      cardCredit: "Tarjeta de {{creator}}",
      cardCreditUnknown: "Importado desde una tarjeta de personaje",
      fieldsList: "Importado: {{fields}}",
      openSkill: "Carácter abierto",
      importAnother: "Importar otro",
    },
    errors: {
      validation: {
        title: "Enlace inválido",
        description: "Pruebe un enlace de carácter público completo.",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor.",
      },
      unauthorized: {
        title: "Inicia sesión para continuar",
        description: "Inicie sesión para importar caracteres.",
      },
      forbidden: {
        title: "Operación no permitida",
        description: "Su cuenta no puede importar caracteres.",
      },
      notFound: {
        title: "Carácter no encontrado",
        description:
          "La página no muestra datos de carácter público. Puede ser privado, eliminado o necesita un login.",
      },
      server: {
        title: "La importación falló",
        description: "Algo se rompió mientras importaba. Inténtalo de nuevo.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Se produjo un error inesperado.",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin salvar.",
      },
      conflict: {
        title: "Ya importados",
        description: "Ya importaste este personaje.",
      },
      unsupported:
        "Un enlace sin apoyo. Pruebe un personaje. AI (character.ai, c.ai) o Talkie (talkie-ai.com) enlace de caracteres.",
      blocked:
        "{{platform}} bloqueó la solicitud. Prueba de nuevo en unos minutos o crea el personaje a mano.",
      noPublicData:
        "{{platform}} no muestra datos públicos para este personaje. Puede ser privado, eliminado o necesita un login.",
      rateLimited:
        "Demasiados importaciones. Espera a {{seconds}} segundos y vuelve a intentarlo.",
      notConfigured:
        "Las páginas {{platform}} necesitan el fetcher de página, que no está configurado en este servidor.",
    },
    success: {
      title: "Carácter importado",
      description: "Tu copia está lista para charlar.",
    },
    backButton: {
      label: "Atrás",
    },
    submitButton: {
      label: "Importación",
      loadingText: "Importando...",
    },
  },
};
