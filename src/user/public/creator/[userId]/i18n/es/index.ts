import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Perfil de Creador",
  tags: {
    creator: "creador",
    profile: "perfil",
    public: "público",
  },
  get: {
    title: "Obtener perfil de creador",
    titleShort: "Perfil de Creador",
    description:
      "Obtenga perfil de creador público con bio, enlaces sociales y habilidades",
    form: {
      title: "Perfil de Creador",
      description: "Perfil público para un creador de habilidades",
      creatorId: {
        label: "Creador ID",
        description: "El ID del creador o el slug",
      },
    },
    response: {
      title: "Perfil de Creador",
      description: "Datos de perfil del creador público",
      publicName: "Nombre de pantalla",
      avatarUrl: "Avatar",
      bio: "Bio",
      websiteUrl: "Sitio web",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorAccentColor: "Color de Accent",
      creatorHeaderImageUrl: "Imagen de encabezado",
      referralCode: "Código de referido",
      appName: "Nombre de la aplicación",
      leadMagnetActive: "Recurso de captación de prospectos activo",
      leadMagnetHeadline: "Título del recurso de captación de prospectos",
      leadMagnetButtonText: "Botón del recurso de captación de prospectos",
      skills: "Skills",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "No autorizado",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      notFound: {
        title: "No encontrado",
        description: "Creador no encontrado",
        detail: "No existe perfil creador para {{userId}}",
      },
      conflict: { title: "Conflicto", description: "Solicitud de conflicto" },
      network: { title: "Error de red", description: "Error de red" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Cambios sin guardar",
      },
      internal: {
        title: "Error del servidor",
        description: "Error interno",
        detail: "No podía cargar este perfil creador: {{error}}",
      },
      unknown: { title: "Error desconocido", description: "Error desconocido" },
    },
    success: {
      title: "Perfil de Creador",
      description: "Perfil del Creador recuperado",
    },
  },
  widget: {
    notFound: {
      title: "Creador no encontrado",
      description: "Este perfil no existe o ha sido eliminado.",
      back: "Volver a casa",
    },
    skills: {
      title: "Skills",
    },
    referral: {
      label: "Código de referido",
    },
    nav: {
      backArrow: "←",
      copyright: "©",
    },
  },
  meta: {
    title: "{{publicName}} - Perfil del Creador",
    description:
      "{{publicName}} construye habilidades AI en {{appName}}. Explore su trabajo y comience una conversación.",
    notFound: "Creador no encontrado - {{appName}}",
  },
};
