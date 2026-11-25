import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    maintenance: "Údržba",
  },
  post: {
    title: "Čistenie médií hostí",
    titleShort: "Čistenie médií hostí",
    description:
      "Odstráni médiá vytvorené v rozhovoroch inkognito a pri samostatnom spustení nástrojov po uplynutí lehoty uchovávania. Platí iba pre hostí, ktorí sa nikdy nezaregistrovali ani neprihlásili. Uložené vlákna a súbory účtov zostávajú bez zmeny.",
    container: {
      title: "Čistenie médií hostí",
      description: "Zobraziť náhľad plánovaného čistenia",
    },
    fields: {
      batchSize: {
        label: "Limit odstránených súborov",
        description:
          "Najvyšší počet súborov odstránených pri jednom spustení. Zvyšné počkajú na ďalšie spustenie.",
      },
      dryRun: {
        label: "Skúšobný beh",
        description:
          "Spočíta všetky súbory a bajty určené na odstránenie bez ich odstránenia",
      },
    },
    response: {
      cutoff: "Hranica uchovávania",
      namespacesScanned: "Skontrolované menné priestory",
      storedThreadNamespaces: "Preskočené uložené vlákna",
      filesScanned: "Skontrolované súbory",
      eligibleFiles: "Súbory na odstránenie",
      eligibleBytes: "Bajty na odstránenie",
      filesDeleted: "Odstránené súbory",
      bytesDeleted: "Odstránené bajty",
      skippedTooNew: "Ponechané: lehota ešte neuplynula",
      skippedUserOwned: "Ponechané: patria účtu",
      skippedUnowned: "Ponechané: bez vlastníka",
      skippedAccountLead: "Ponechané: kontakt prepojený s účtom",
      deferred: "Odložené na ďalšie spustenie",
      failed: "Zlyhalo",
      rowsDeleted: "Odstránené záznamy štúdia",
      scanComplete: "Kontrola dokončená",
      executionTimeMs: "Čas vykonania (ms)",
    },
    success: {
      title: "Čistenie dokončené",
      description: "Kontrola médií hostí je hotová",
    },
  },
  errors: {
    scheduledOnly:
      "Súbory môže odstrániť iba produkčná úloha cron na čistenie médií hostí.",
    failed: "Čistenie médií hostí zlyhalo: {{error}}",
    server: {
      title: "Chyba čistenia",
      description: "Čistenie médií hostí zlyhalo",
    },
  },
  task: {
    name: "Čistenie médií hostí",
    description:
      "Denné odstraňovanie médií hostí z rozhovorov inkognito a samostatných spustení nástrojov po uplynutí lehoty uchovávania",
  },
};
