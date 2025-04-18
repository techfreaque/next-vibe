import type { TranslationSchema } from "./index";

// Spanish translations
const translations: TranslationSchema = {
  common: {
    appName: "OpenEats",
    openSource: "Código Abierto",
    search: "Buscar",
    filter: "Filtrar",
    loading: "Cargando...",
    noResults: "No se encontraron resultados",
    clearFilters: "Limpiar Filtros",
    applyFilters: "Aplicar Filtros",
    error: "Error",
    success: "Éxito",
    cancel: "Cancelar",
    submit: "Enviar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Añadir",
    remove: "Eliminar",
    close: "Cerrar",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    continue: "Continuar",
    goBack: "Volver",
    viewAll: "Ver Todo",
    seeMore: "Ver Más",
    seeLess: "Ver Menos",
    showMore: "Mostrar Más",
    showLess: "Mostrar Menos",
    readMore: "Leer Más",
    readLess: "Leer Menos",
    learnMore: "Saber Más",
    getStarted: "Comenzar",
    signIn: "Iniciar Sesión",
    signOut: "Cerrar Sesión",
    signUp: "Registrarse",
    register: "Registrarse",
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    myAccount: "Mi Cuenta",
    myProfile: "Mi Perfil",
    addAddress: "Añadir Dirección",
    editAddress: "Editar Dirección",
    removeAddress: "Eliminar Dirección",
    address: "Dirección",
    addressLine1: "Línea de Dirección 1",
    addressLine2: "Línea de Dirección 2",
    city: "Ciudad",
    state: "Estado",
    zipCode: "Código Postal",
    country: "País",
    phoneNumber: "Número de Teléfono",
    email: "Correo Electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    forgotPassword: "¿Olvidaste tu Contraseña?",
    resetPassword: "Restablecer Contraseña",
    changePassword: "Cambiar Contraseña",
    currentPassword: "Contraseña Actual",
    newPassword: "Nueva Contraseña",
    confirmNewPassword: "Confirmar Nueva Contraseña",
    rememberMe: "Recuérdame",
    stayLoggedIn: "Mantener Sesión Iniciada",
    dontHaveAccount: "¿No tienes una cuenta?",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    createAccount: "Crear Cuenta",
    createPassword: "Crear Contraseña",
    firstName: "Nombre",
    lastName: "Apellido",
    fullName: "Nombre Completo",
    username: "Nombre de Usuario",
    bio: "Biografía",
    website: "Sitio Web",
    socialMedia: "Redes Sociales",
    facebook: "Facebook",
    twitter: "Twitter",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok",
    snapchat: "Snapchat",
    pinterest: "Pinterest",
    reddit: "Reddit",
    github: "GitHub",
    discord: "Discord",
  },

  // Navigation
  nav: {
    home: "Inicio",
    restaurants: "Restaurantes",
    markets: "Mercados",
    localShops: "Tiendas Locales",
    partners: "Para Socios",
    drivers: "Para Conductores",
    about: "Acerca de",
    profile: "Perfil",
    orders: "Pedidos",
    favorites: "Favoritos",
    cart: "Carrito",
    signIn: "Iniciar Sesión",
    signOut: "Cerrar Sesión",
    backToOpenEats: "Volver a OpenEats",
    searchPlaceholder: "Buscar comida, restaurantes...",
    toggleMenu: "Alternar Menú",
    lightMode: "Modo Claro",
    darkMode: "Modo Oscuro",
    theme: "Tema",
  },

  profile: {
    title: "Mi Perfil",
    personalInfo: "Información Personal",
    name: "Nombre",
    email: "Correo Electrónico",
    phone: "Teléfono",
    addresses: "Direcciones",
    addAddress: "Añadir Dirección",
    editAddress: "Editar Dirección",
    deleteAddress: "Eliminar Dirección",
    defaultAddress: "Dirección Predeterminada",
    makeDefault: "Establecer como Predeterminada",
    paymentMethods: "Métodos de Pago",
    addPaymentMethod: "Añadir Método de Pago",
    editPaymentMethod: "Editar Método de Pago",
    deletePaymentMethod: "Eliminar Método de Pago",
    defaultPaymentMethod: "Método de Pago Predeterminado",
    preferences: "Preferencias",
    language: "Idioma",
    notifications: "Notificaciones",
    emailNotifications: "Notificaciones por Correo Electrónico",
    pushNotifications: "Notificaciones Push",
    smsNotifications: "Notificaciones SMS",
    saveChanges: "Guardar Cambios",
    saving: "Guardando...",
    changesSaved: "Cambios Guardados",
    changesSavedDescription: "Tus cambios han sido guardados con éxito",
    changesFailed: "Cambios Fallidos",
    changesFailedDescription:
      "Hubo un error al guardar tus cambios. Por favor, inténtalo de nuevo.",
  },
  auth: {
    login: {
      title: "Bienvenido de Nuevo",
      subtitle: "Inicia sesión en tu cuenta para continuar",
      emailLabel: "Correo Electrónico",
      emailPlaceholder: "Ingresa tu correo electrónico",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Ingresa tu contraseña",
      rememberMe: "Recuérdame",
      forgotPassword: "¿Olvidaste tu contraseña?",
      loginButton: "Iniciar Sesión",
      noAccount: "¿No tienes una cuenta?",
      createAccount: "Crear una cuenta",
      loginError: "Correo electrónico o contraseña inválidos",
      or: "O",
    },
    signup: {
      title: "Crear una Cuenta",
      subtitle: "Regístrate para comenzar con OpenEats",
      firstNameLabel: "Nombre",
      firstNamePlaceholder: "Ingresa tu nombre",
      lastNameLabel: "Apellido",
      lastNamePlaceholder: "Ingresa tu apellido",
      emailLabel: "Correo Electrónico",
      emailPlaceholder: "Ingresa tu correo electrónico",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Crea una contraseña",
      confirmPasswordLabel: "Confirmar Contraseña",
      confirmPasswordPlaceholder: "Confirma tu contraseña",
      termsAndConditions: "Términos y Condiciones",
      privacyPolicy: "Política de Privacidad",
      agreeToTerms: "Acepto los {0} y la {1}",
      createAccountButton: "Crear Cuenta",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      signIn: "Iniciar sesión",
      signupError: "Hubo un error al crear tu cuenta",
      passwordRequirements: "La contraseña debe tener al menos 8 caracteres",
      passwordsMustMatch: "Las contraseñas deben coincidir",
      or: "O",
    },
    verifyEmail: {
      title: "Verifica tu Correo Electrónico",
      subtitle:
        "Por favor verifica tu dirección de correo electrónico para continuar",
      checkInbox: "Hemos enviado un enlace de verificación a {email}",
      didNotReceiveEmail: "¿No recibiste un correo electrónico?",
      resendEmail: "Reenviar correo de verificación",
      emailResent: "Correo reenviado exitosamente",
    },
    resetPassword: {
      title: "Restablecer Contraseña",
      subtitle:
        "Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña",
      emailLabel: "Correo Electrónico",
      emailPlaceholder: "Ingresa tu correo electrónico",
      submitButton: "Enviar Enlace de Restablecimiento",
      backToLogin: "Volver al inicio de sesión",
      emailSent: "Correo de restablecimiento de contraseña enviado",
      checkInbox:
        "Por favor revisa tu bandeja de entrada para más instrucciones",
    },
  },
  languages: {
    en: "Inglés",
    es: "Español",
    fr: "Francés",
    de: "Alemán",
    zh: "Chino",
  },
};

export default translations;
