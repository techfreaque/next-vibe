import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Herramientas AI",
  tags: {
    skills: "habilidades",
  },
  post: {
    selectSkill: "Abre una habilidad de la comunidad para votar.",
    browseSkills: "Explorar habilidades de la comunidad",
    title: "Votar por Habilidad",
    titleShort: "Votar Habilidad",
    description:
      "Votar arriba o abajo en una habilidad comunitaria. Re-sending su dirección actual elimina el voto; enviar lo contrario lo voltea.",
    dynamicTitle: "Voto: {{name}}",
    direction: {
      label: "Dirección",
      description: "Dirección de voto: arriba (ayuda) o abajo (no útil).",
      up: "Subtítulos",
      down: "Downvote",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para votar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No puedes votar por esta habilidad.",
      },
      notFound: {
        title: "No encontrado",
        description: "Habilidad no encontrada",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al procesar su voto",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
    },
    success: {
      title: "Voto grabado",
      description: "Su voto ha sido actualizado",
    },
    response: {
      userVote: { content: "Tu voto" },
      voteCount: { content: "Puntuación" },
      upCount: { content: "Upvotes" },
      downCount: { content: "Downvotes" },
      trustLevel: { content: "Nivel de confianza" },
    },
    backButton: {
      label: "Atrás",
    },
    button: {
      vote: "Subtítulos",
      unvote: "Eliminar el voto",
      loading: "Salvando...",
    },
    badge: {
      verified: "Verificado",
    },
  },
};
