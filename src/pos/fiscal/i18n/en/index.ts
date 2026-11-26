export const translations = {
  tags: { pos: "POS", fiscal: "Fiscal receipts" },
  enums: {
    adapter: {
      sandbox: "Sandbox (testing only, not certified)",
    },
    deviceKind: {
      orp: "ORP (cash register with hardware storage)",
      sorp: "SORP (software cash register, storage at the vendor)",
      vrp: "VRP (free virtual cash register of the Finančná správa)",
    },
    receiptStatus: {
      pending: "Waiting to register",
      registered: "Registered",
      offline: "Issued offline",
      failed: "Failed",
    },
  },
  block: {
    ekasaRequired:
      "Slovak law requires every cash and card sale to be registered in eKasa. Connect a certified eKasa cash register under POS fiscal settings before selling.",
  },
  title: "Fiscal receipts",
  description:
    "See whether your country requires online fiscal receipts and which cash register registers your POS sales.",
  saveTitle: "Fiscal cash register",
  saveDescription:
    "Connect the cash register that registers your POS sales with the tax authority.",
  company: "Company",
  adapter: "Provider",
  adapterPlaceholder: "Choose a provider",
  adapterDescription:
    "Only certified providers can register real sales. The sandbox is for testing and never unlocks selling.",
  deviceKind: "Cash register type",
  deviceKindDescription:
    "ORP stores receipts in a hardware CHDÚ. SORP keeps the protected storage on the vendor's servers. VRP is the free service of the Finančná správa.",
  cashRegisterCode: "Cash register code",
  cashRegisterCodeDescription:
    "The code the tax authority assigned to this cash register (kód pokladnice).",
  cashRegisterCodePlaceholder: "e.g. 88812345678900001",
  isEnabled: "Register sales with this provider",
  isEnabledDescription:
    "When on, every completed POS sale is queued for registration.",
  certifiedUntil: "Certificate valid until",
  certifiedUntilDescription:
    "Last day the cash register certificate is valid. Sales are blocked after it expires.",
  credentialRef: "Credential reference",
  credentialRefDescription:
    "Name of the stored key or certificate. Never paste a private key or password here.",
  offlineDeadlineHours: "Offline send deadline (hours)",
  offlineDeadlineHoursDescription:
    "Receipts issued offline must reach the tax authority within this time.",
  response: {
    required: "Fiscal receipts required",
    blocked: "Sales blocked",
    provider: "Cash register",
    counts: "Receipt queue",
    adapters: "Available providers",
    companyName: "Company",
    country: "Country",
    saved: "Saved",
  },
  widget: {
    requiredTitle: "eKasa is mandatory for this company",
    requiredMessage:
      "Every cash and card sale must be registered online in eKasa (zákon 384/2025 Z. z.). Receipts not confirmed within 5 seconds are stored offline and must be sent within 96 hours.",
    notRequiredTitle: "No online fiscal receipts required",
    notRequiredMessage:
      "This company's country has no online fiscal receipt system in our library. POS sales work as usual.",
    blockedTitle: "POS sales are blocked",
    blockedMessage:
      "Connect and enable a certified eKasa cash register. Until then, the till cannot complete sales.",
    readyTitle: "Sales are registered",
    readyMessage:
      "Completed sales are queued and registered with the connected cash register.",
    noCertifiedProvider:
      "No certified eKasa provider is available in this installation yet.",
    noProvider: "No cash register connected",
    configure: "Connect cash register",
    edit: "Change cash register",
    certified: "Certified",
    notCertified: "Not certified",
    enabled: "On",
    disabled: "Off",
    certifiedUntilValue: "Certificate valid until {{date}}",
    pending: "Waiting",
    offline: "Offline",
    failed: "Failed",
    overdue: "Past deadline",
    queueHint: "Receipts not yet confirmed by the tax authority.",
    disclaimer: "We provide tooling, not tax advice.",
    pickCompany: {
      title: "Choose a company",
      message: "Fiscal rules depend on the company's country.",
    },
    savedTitle: "Cash register saved",
    savedBlocked:
      "Sales stay blocked: this provider is not certified for eKasa.",
    savedReady: "Completed sales will be registered with this cash register.",
    back: "Back",
    save: "Save cash register",
    sectionProvider: "Provider",
    sectionDevice: "Cash register",
  },
  errors: {
    validation: {
      title: "Check the cash register details",
      description: "Some values are missing or not valid.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to manage fiscal receipts.",
    },
    forbidden: {
      title: "No access",
      description: "Only company owners and admins can change fiscal settings.",
    },
    notFound: {
      title: "Company not found",
      description: "The company does not exist or you are not a member.",
    },
    conflict: {
      title: "Settings changed",
      description: "Reload the page and try again.",
    },
    server: {
      title: "Fiscal settings unavailable",
      description: "Try again in a moment.",
    },
    network: {
      title: "No connection",
      description: "Check your connection and try again.",
    },
    unknown: {
      title: "Something went wrong",
      description: "Try again in a moment.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first.",
    },
    deviceKindUnsupported:
      "This provider does not support the chosen cash register type.",
    adapterUnknown: "This provider does not exist.",
    sandboxProduction:
      "The sandbox provider cannot be used in production. Choose a certified provider.",
  },
  success: {
    title: "Fiscal settings loaded",
    description: "Fiscal receipt status for the company.",
    savedTitle: "Cash register saved",
    savedDescription: "The fiscal cash register settings are saved.",
  },
};
