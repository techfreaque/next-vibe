import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "NOWPayments CLI",
    titleShort: "NOWPayments",
    description: "Inicio túnel ngrok para el reenvío NOWPayments webhook",
    category: "Pago",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "Webhook",
    },
    form: {
      title: "Tunel NOWPayments",
      description:
        "Comience un túnel ngrok para recibir webhooks NOWPayments localmente",
      fields: {
        port: {
          label: "Port",
          description: "Puerto local a túnel (por defecto: 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      notInstalled: {
        instructions:
          "Para instalar ngrok:\n\n1. Visita https://ngrok.com/download\n2. Descargar ngrok para tu plataforma\n3. Extraiga y muévalo a su PATH\n4. Corre: Ngrok authtoken YOUR_AUTH_TOKEN (obtener su ficha en https://dashboard.ngrok.com/get-started/your-authtoken)\n\nO instalarlo con un gestor de paquetes:\n- macOS: instalación de cerveza ngrok/ngrok/ngrok\n- Linux: instalación rápida ngrok\n- Windows: instalación de choco ngrok",
        title: "no instalado",
        description:
          "Se requiere ngrok para iniciar el túnel. Instala y vuelve a intentarlo.",
      },
      validationFailed: {
        title: "Error de validación",
        description: "Parámetros inválidos",
      },
      networkError: {
        title: "Error de red",
        description: "La conexión de red falló",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso denegado",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      serverError: {
        noTunnelUrl: "No podía leer el túnel ngrok URL",
        title: "Error del servidor",
        description: "Fallado para empezar el túnel",
      },
      unknownError: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de recursos",
      },
    },
    success: {
      title: "Tunel Started",
      description: "El túnel ngrok está corriendo.",
    },
  },
};
