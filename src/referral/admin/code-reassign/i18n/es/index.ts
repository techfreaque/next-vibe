import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Referidos",
  tags: {
    referral: "remisión de referencia",
    admin: "admin",
  },
  post: {
    title: "Código de referencia de la reasignación",
    titleShort: "Código de Reasignación",
    description:
      "Mueva un código de remisión a otra cuenta. Usuarios que ya se refirió a la estancia atribuida al código, por lo que su futura comisión va al nuevo propietario. Los ingresos pasados se quedan con quien los haya ganado. Correr seca por defecto.",
    fields: {
      code: {
        label: "Código de referido",
        description: "El código exacto para mover",
        placeholder: "quelllm",
      },
      targetUser: {
        label: "Nuevo propietario",
        description:
          "Usuario ID o correo electrónico de la cuenta que obtiene el código",
        placeholder: "creator@example.com",
      },
      dryRun: {
        label: "Corrección seca",
        description: "Avance el movimiento sin cambiar nada",
      },
    },
    response: {
      dryRun: "Corrección seca",
      code: "Código",
      fromUserId: "Propietario anterior ID",
      fromEmail: "Propietario anterior",
      toUserId: "Nuevo propietario ID",
      toEmail: "Nuevo propietario",
      referralsMoved: "Usuarios remitidos",
      selfReferralsKept:
        "Auto-referencias mantenidas con el propietario anterior",
      linksMoved: "Enlaces rastreados movidos",
      linksTotal: "Enlaces de campaña utilizando el código",
    },
    widget: {
      back: "Atrás",
      hint: "La Comisión sigue al propietario del código. Ejecutar una carrera seca primero, luego apagarla para mover el código.",
      submit: "Código de reasignación",
      preview: "Correr seca. Nada cambió.",
      done: "Código movido.",
      summary: "{{code}}: {{from}} → {{to}}",
    },
    note: "Código de referencia {{code}} se trasladó de {{from}} a {{to}} por {{admin}} en {{at}}. Los usuarios referidos se movieron: {{referrals}}. Enlaces rastreados movidos: {{links}}. Ganancias pasadas sin cambios.",
  },
  errors: {
    validation: {
      title: "Entrada inválida",
      description: "Compruebe el código y el nuevo propietario",
    },
    unauthorized: {
      title: "No está firmado",
      description: "Inicie sesión como administrador para reasignar códigos",
    },
    forbidden: {
      title: "Admins only",
      description:
        "Sólo los administradores pueden reasignar códigos de remisión",
    },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "Código o usuario no existe",
    },
    conflict: {
      title: "Conflicto",
      description: "El nuevo propietario ya posee este código",
    },
    server: {
      title: "Error del servidor",
      description: "No podía reasignar el código",
    },
    network: {
      title: "Error de red",
      description: "La solicitud no llegó al servidor",
    },
    unknown: {
      title: "Error desconocido",
      description: "Algo inesperado falló",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Guardar o descartar sus cambios primero",
    },
    codeNotFound: "Código de referencia {{code}} no existe",
    userNotFound: "No hay coincidencias de usuario {{target}}",
    alreadyOwner: "{{target}} ya posee código de referencia {{code}}",
  },
  success: {
    title: "Listo",
    description: "Código de referencia reasignado",
  },
};
