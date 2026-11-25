import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",
  title: "Over si e-mail",
  titleShort: "Overiť e-mail",
  description:
    "Potvrď e-mailovú adresu odkazom, ktorý sme ti poslali. Ak chceš nový odkaz, zavolaj nástroj bez tokenu.",
  tag: "verify-email",
  token: {
    label: "Overovací token",
    description:
      "Token z odkazu v overovacom e-maile. Ak chceš nový e-mail, nechaj pole prázdne.",
    placeholder: "Token z e-mailu",
  },
  response: {
    verified: "Overené",
    message: "Stav",
    email: "E-mail",
    emailChanged: "E-mailová adresa sa zmenila",
  },
  widget: {
    heroTitle: "Potvrď e-mail",
    heroDescription: "Jediným kliknutím overíš svoju adresu.",
    confirmButton: "Overiť môj e-mail",
    confirming: "Overuje sa…",
    doneTitle: "E-mail overený",
    doneDescription: "E-mailová adresa je potvrdená. Hotovo.",
    resend: "Poslať nový odkaz",
    continue: "Pokračovať",
    changedTitle: "E-mailová adresa sa zmenila",
    changedDescription:
      "Odteraz sa prihlasuj s adresou {{email}}. Pôvodná adresa sa už nepoužíva.",
  },
  accountChallenge: {
    settings: "Nastavenia účtu",
    prompt:
      "Zadaj šesťmiestny kód, ktorý sme poslali na {{email}}. Platí 30 minút. Adresu môžeš potvrdiť aj odkazom z e-mailu a potom sa znova prihlásiť.",
    mail: "Potvrď e-mailovú adresu odkazom nižšie. Pri prihlásení môžeš do 30 minút použiť aj tento kód.",
    notice:
      "Pred ďalším prihlásením potvrď {{email}}. Zatiaľ môžeš účet používať.",
    undeliverable:
      "E-mail na adresu {{email}} sa nepodarilo doručiť. Ak si prihlásený, skontroluj adresu v nastaveniach. Inak kontaktuj podporu.",
    invalid:
      "Kód je nesprávny alebo mu vypršala platnosť. Skontroluj najnovší e-mail alebo si vyžiadaj nový kód.",
    cooldown: "Pred vyžiadaním ďalšieho e-mailu počkaj päť minút.",
    dismiss: "Zavrieť",
  },
  creditsPrompt: {
    title: "Potvrď e-mail a získaj bezplatné kredity",
    description:
      "Klikni na odkaz z e-mailu a každý mesiac získaš {{credits}} kred. zdarma.",
    resend: "Poslať odkaz znova",
    sending: "Odosiela sa…",
    sent: "Odkaz sme poslali na {{email}}. Skontroluj aj priečinok so spamom.",
  },
  email: {
    subject: "Získaj {{credits}} kred. zdarma na {{appName}}",
    title: "Potvrď e-mail",
    previewText:
      "Jediným kliknutím potvrdíš adresu a aktivuješ bezplatné kredity.",
    greeting: "Ahoj, {{name}},",
    body: "Tvoj účet je pripravený. Potvrď túto adresu a každý mesiac získaš {{credits}} kred. zdarma. Platobnú kartu nepotrebuješ.",
    newsletter:
      "Tým istým kliknutím potvrdíš aj odber noviniek. Kým ich odoberáš, každý mesiac získaš ďalších {{credits}} kred. zdarma.",
    button: "Potvrdiť a získať kredity",
    reminder: {
      subject: "Kredity zdarma ({{credits}} kred.) stále čakajú na potvrdenie",
      previewText: "Aktivuješ ich jediným kliknutím na odkaz.",
      body: "Včera si si vytvoril účet {{appName}}, no e-mailová adresa ešte nie je potvrdená. Mesačná dávka {{credits}} kred. zdarma sa aktivuje po potvrdení. Stačí jedno kliknutie.",
    },
    expiry:
      "Počet dní platnosti odkazu: {{days}}. Ak si si účet nevytvoril, tento e-mail môžeš ignorovať.",
    signoff: "Tím {{appName}}",
  },
  emailTemplates: {
    name: "Overenie e-mailovej adresy",
    description:
      "E-mail na overenie adresy účtu sa odosiela po registrácii alebo na požiadanie",
    category: "Účet",
  },
  errors: {
    emailTaken:
      "Adresu už používa iný účet. Tvoja e-mailová adresa sa nezmenila.",
    invalidToken:
      "Overovací odkaz je neplatný alebo mu vypršala platnosť. V nastaveniach si vyžiadaj nový.",
    userNotFound: "Účet sa nenašiel.",
    failed: "E-mail sa nepodarilo overiť.",
    needLogin: "Ak chceš nový overovací e-mail, prihlás sa.",
    validation: {
      title: "Chyba kontroly údajov",
      description: "Skontroluj zadané údaje a skús to znova",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihlás sa a vyžiadaj si nový overovací e-mail",
    },
    server: {
      title: "Chyba servera",
      description: "Overenie zlyhalo pre chybu servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    network: {
      title: "Chyba siete",
      description: "Sieťové pripojenie zlyhalo",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáš na to oprávnenie",
    },
    notFound: {
      title: "Nenájdené",
      description: "Nepodarilo sa nájsť účet",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máš neuložené zmeny",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Vyskytol sa konflikt",
    },
  },
  success: {
    title: "Hotovo",
    description: "Stav overenia e-mailu sa aktualizoval",
    verified: "Tvoj e-mail je overený.",
    alreadyVerified: "Tvoj e-mail už je overený.",
    emailChanged: "Hotovo. Tvoja nová e-mailová adresa je {{email}}.",
    sent: "Overovací e-mail sme poslali. Skontroluj si schránku.",
  },
};
