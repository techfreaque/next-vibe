import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  get: {
    title: "Exportar mis datos",
    titleShort: "Datos de exportación",
    description:
      "Descargue todo lo que tenemos sobre usted: perfil, chats, recuerdos, habilidades, créditos, referencias, newsletter, direcciones. JSON más un resumen legible.",
    tags: { export: "Exportación de datos" },
    response: {
      json: { title: "Datos completos (JSON)" },
      jsonFilename: { title: "JSON nombre de archivo" },
      markdown: { title: "Resumen (detallado)" },
      markdownFilename: { title: "Nombre del archivo resumido" },
    },
    success: {
      title: "Exportación lista",
      description: "Su archivo de datos fue generado",
    },
    md: {
      heading: "Sus datos exportan",
      generated: "Generado",
      account: "Cuenta",
      email: "Correo electrónico",
      name: "Nombre",
      memberSince: "Miembro desde",
      contents: "Índice",
      records: "registros",
      note: "Los detalles completos están en el archivo JSON. Esta exportación sólo contiene datos vinculados a su cuenta.",
    },
    widget: {
      intro:
        "Obtenga una copia de sus datos. Usted recibe un archivo JSON completo y un resumen de marcado legible. Sólo tus propios datos están incluidos.",
      downloadJson: "Descargar JSON",
      downloadMarkdown: "Descargar resumen",
      generate: "Preparar exportación",
      preparing: "Preparando...",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicie sesión para exportar sus datos",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no puede exportar estos datos",
      },
      notFound: {
        title: "No encontrado",
        description: "Cuenta no encontrada",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      server: {
        title: "La exportación falló",
        description:
          "No podíamos generar su exportación. Inténtalo de nuevo más tarde.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
    },
  },
};
