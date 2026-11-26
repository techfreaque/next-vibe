import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Solicitud de estadísticas inválidas",
      description: "Compruebe la ventana y las fechas",
    },
    unauthorized: {
      title: "Inicia sesión para continuar",
      description: "Iniciar sesión para ver estadísticas",
    },
    forbidden: {
      title: "Admins only",
      description: "Necesitas el papel de administrador para ver estadísticas",
    },
    notFound: {
      title: "No hay datos",
      description: "No hay nada que reportar para esta ventana",
    },
    server: {
      title: "No podría calcular las estadísticas",
      description: "El servidor no compute estadísticas de usuario",
    },
    network: {
      title: "Error de red",
      description: "No podía llegar al servidor",
    },
    unknown: {
      title: "Error inesperado",
      description: "Algo salió mal las estadísticas de cálculo",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    conflict: {
      title: "Conflicto",
      description: "La solicitud entra en conflicto con los datos actuales",
    },
  },
  title: "Resumen de cuentas",
  description:
    "Consulte las altas de clientes y la verificación de sus correos. Se excluyen las cuentas del personal y de prueba.",
  accounts: "Cuentas de clientes",
  signups: "Altas en 7 días",
  verified: "Correo verificado",
  unverified: "Correo sin verificar",
  reviewUnverified: "Cuentas nuevas por verificar ({{count}})",
  attention: "Pendiente de revisión",
  clear: "Todas las cuentas nuevas tienen un correo verificado.",
  unavailable: "Estado de verificación no disponible.",
  recent: "Actividad reciente",
  loading: "Cargando el resumen de cuentas…",
};
