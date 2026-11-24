import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  update: {
    post: {
      title: "Actualizar la base de países de visitantes",
      titleShort: "Actualización Geo IP",
      description:
        "Carga en la base de datos la tabla mensual de países de DB-IP y completa el país de los prospectos que no lo tienen. Búsqueda sin conexión, sin llamada a una API por visita.",
      tag: "Geo IP",
      container: {
        title: "Base Geo IP",
        description: "Datos de IP a país de DB-IP (CC BY 4.0)",
      },
      fields: {
        force: {
          label: "Forzar descarga",
          description: "Descargar la versión actual aunque ya esté guardada",
        },
      },
      response: {
        status: "Estado",
        version: "Versión",
        v4Ranges: "Rangos IPv4",
        v6Ranges: "Rangos IPv6",
        backfilled: "Prospectos completados",
        unresolved: "Prospectos aún sin país",
      },
      errors: {
        unauthorized: {
          title: "Sin sesión",
          description: "Inicia sesión como admin para actualizar la base geo.",
        },
        forbidden: {
          title: "No permitido",
          description: "Solo los admins pueden actualizar la base geo.",
        },
        server: {
          title: "La actualización falló",
          description:
            "No se pudo actualizar la base geo. Revisa los registros.",
        },
        unknown: {
          title: "Error inesperado",
          description: "Algo salió mal al actualizar la base geo.",
        },
        validation: {
          title: "Datos no válidos",
          description: "Revisa los campos de la solicitud.",
        },
        network: {
          title: "Error de red",
          description: "No se pudo contactar la fuente geo.",
        },
      },
      success: {
        title: "Base geo revisada",
        description: "La tabla de países está al día.",
      },
    },
    task: {
      description:
        "Actualiza cada mes los países de DB-IP y completa cada hora el país de los prospectos que aún no lo tienen.",
    },
  },
  enums: {
    updateStatus: {
      updated: "Actualizado",
      current: "Ya actualizado",
      unavailable: "La descarga falló",
    },
  },
};
