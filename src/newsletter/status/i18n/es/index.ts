import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Estado de la comunicación",
  titleShort: "Estado de la comunicación",
  description:
    "Check newsletter status de suscripción para una dirección de correo electrónico",
  category: "Boletín",
  tags: {
    status: "Situación",
  },
  form: {
    title: "Estado del registro",
    description:
      "Ingrese una dirección de correo electrónico para comprobar su estado de suscripción al boletín",
  },
  email: {
    label: "Dirección de correo electrónico",
    description:
      "La dirección de correo electrónico para comprobar el estado de suscripción",
    placeholder: "user@example.com",
    helpText: "Deja vacío para comprobar tu propia suscripción",
  },
  response: {
    subscribed: "Estado de la suscripción",
    status: "Situación actual",
    confirmed: "Confirmado",
    email: "Dirección de correo electrónico",
  },
  errors: {
    validation: {
      title: "Correo electrónico inválido",
      description:
        "Por favor, proporcione una dirección de correo electrónico válida",
    },
    internal: {
      title: "Error interno",
      description: "Se produjo un error al revisar el estado de la suscripción",
      detail: "El registro de estado de suscripción falló: {{error}}",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description:
        "Usted no está autorizado para comprobar este estado de suscripción",
    },
    notFound: {
      title: "No encontrado",
      description:
        "No se ha encontrado información de suscripción para esta dirección de correo electrónico",
    },
  },
  success: {
    title: "Estado civil",
    description: "Estado de suscripción de newsletters recuperado exitosamente",
  },
};
