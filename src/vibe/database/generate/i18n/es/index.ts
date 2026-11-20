import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operaciones de base de datos",
  tag: "migration",
  post: {
    title: "Generar migraciones",
    titleShort: "Generar migraciones",
    description:
      "Generar archivos de migración de Drizzle desde cambios de esquema",
    form: {
      title: "Generar configuración",
      description: "Configurar las opciones de generación de migración",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos",
      },
      network: {
        title: "Generation Failed",
        description: "drizzle-kit generar fallido",
        detail: "drizzle-kit generar fallido: {{error}}",
        exitCode: "drizzle-kit generan salida con código {{code}}",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Autorizaciones insuficientes",
      },
      notFound: {
        title: "No encontrado",
        description: "Recursos no encontrados",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      conflict: { title: "Conflicto", description: "Conflicto detectado" },
    },
    success: {
      title: "Generación exitosa",
      description: "Archivos de migración generados con éxito",
    },
  },
  fields: {
    success: { title: "Situación de éxito" },
    output: { title: "Producto" },
    duration: { title: "Duración ms)" },
  },
};
