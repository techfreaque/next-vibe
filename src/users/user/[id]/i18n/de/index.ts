import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",
  tag: "Benutzerverwaltung",

  id: {
    roles: {
      post: {
        title: "Benutzerrolle hinzufügen",
        description: "Einem bestimmten Benutzerkonto eine Rolle zuweisen",
        container: {
          title: "Rolle hinzufügen",
          description:
            "Wählen Sie eine Rolle aus, die diesem Benutzer gewährt werden soll",
        },
        id: {
          label: "Benutzer-ID",
          description:
            "Eindeutige Kennung des Benutzers, dem die Rolle zugewiesen werden soll",
          placeholder: "Benutzer-ID eingeben...",
        },
        role: {
          label: "Rolle",
          description: "Die dem Benutzer zu gewährende Rolle",
          placeholder: "Rolle auswählen...",
        },
        submit: {
          label: "Rolle hinzufügen",
        },
        response: {
          roleId: {
            content: "Rollenzuweisungs-ID",
          },
          userId: {
            content: "Benutzer-ID",
          },
          assignedRole: {
            content: "Zugewiesene Rolle",
          },
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Sie müssen angemeldet sein, um Benutzerrollen zu verwalten",
          },
          validation: {
            title: "Validierung fehlgeschlagen",
            description:
              "Bitte geben Sie eine gültige Benutzer-ID und Rolle an",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description: "Nur Administratoren können Benutzerrollen verwalten",
          },
          notFound: {
            title: "Benutzer nicht gefunden",
            description: "Der angegebene Benutzer konnte nicht gefunden werden",
          },
          conflict: {
            title: "Rolle bereits zugewiesen",
            description: "Dieser Benutzer hat die angegebene Rolle bereits",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Verbindung zum Server nicht möglich",
          },
          unsavedChanges: {
            title: "Ungespeicherte Änderungen",
            description:
              "Sie haben ungespeicherte Änderungen, die verloren gehen",
          },
          server: {
            title: "Serverfehler",
            description:
              "Rolle konnte aufgrund eines Serverfehlers nicht hinzugefügt werden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description:
              "Beim Hinzufügen der Rolle ist ein unerwarteter Fehler aufgetreten",
          },
        },
        success: {
          title: "Rolle hinzugefügt",
          description: "Die Rolle wurde dem Benutzer erfolgreich gewährt",
        },
      },
      delete: {
        title: "Benutzerrolle entfernen",
        description: "Eine Rolle von einem bestimmten Benutzerkonto entziehen",
        container: {
          title: "Rolle entfernen",
          description:
            "Wählen Sie eine Rolle aus, die diesem Benutzer entzogen werden soll",
        },
        id: {
          label: "Benutzer-ID",
          description:
            "Eindeutige Kennung des Benutzers, dem die Rolle entzogen werden soll",
          placeholder: "Benutzer-ID eingeben...",
        },
        role: {
          label: "Rolle",
          description: "Die dem Benutzer zu entziehende Rolle",
          placeholder: "Rolle auswählen...",
        },
        submit: {
          label: "Rolle entfernen",
        },
        response: {
          success: {
            content: "Rolle entfernt",
          },
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Sie müssen angemeldet sein, um Benutzerrollen zu verwalten",
          },
          validation: {
            title: "Validierung fehlgeschlagen",
            description:
              "Bitte geben Sie eine gültige Benutzer-ID und Rolle an",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description: "Nur Administratoren können Benutzerrollen verwalten",
          },
          notFound: {
            title: "Benutzer nicht gefunden",
            description: "Der angegebene Benutzer konnte nicht gefunden werden",
          },
          conflict: {
            title: "Konfliktfehler",
            description:
              "Rolle konnte aufgrund bestehender Abhängigkeiten nicht entfernt werden",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Verbindung zum Server nicht möglich",
          },
          unsavedChanges: {
            title: "Ungespeicherte Änderungen",
            description:
              "Sie haben ungespeicherte Änderungen, die verloren gehen",
          },
          server: {
            title: "Serverfehler",
            description:
              "Rolle konnte aufgrund eines Serverfehlers nicht entfernt werden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description:
              "Beim Entfernen der Rolle ist ein unerwarteter Fehler aufgetreten",
          },
        },
        success: {
          title: "Rolle entfernt",
          description: "Die Rolle wurde dem Benutzer erfolgreich entzogen",
        },
      },
    },
    get: {
      title: "Benutzer abrufen",
      titleShort: "Benutzerdetails",
      description:
        "Detaillierte Informationen zu einem bestimmten Benutzer abrufen",
      container: {
        title: "Benutzerdetails",
        description: "Detaillierte Benutzerinformationen anzeigen",
      },
      id: {
        label: "Benutzer-ID",
        description: "Eindeutige Kennung für den Benutzer",
        placeholder: "Benutzer-ID eingeben...",
      },
      response: {
        userProfile: {
          title: "Benutzerprofil",
          description: "Detaillierte Benutzerprofilinformationen",
          basicInfo: {
            title: "Grundinformationen",
            description: "Kernbenutzerinformationen",
            id: {
              content: "Benutzer-ID",
            },
            email: {
              content: "E-Mail-Adresse",
            },
            privateName: {
              content: "Privater Name",
            },
            publicName: {
              content: "Öffentlicher Name",
            },
            firstName: {
              content: "Vorname",
            },
            lastName: {
              content: "Nachname",
            },
            company: {
              content: "Unternehmen",
            },
          },
          contactDetails: {
            title: "Kontaktdaten",
            description: "Benutzer-Kontaktinformationen",
            phone: {
              content: "Telefonnummer",
            },
            preferredContactMethod: {
              content: "Bevorzugte Kontaktmethode",
            },
            website: {
              content: "Website",
            },
          },
        },
        profileDetails: {
          title: "Profildetails",
          description: "Zusätzliche Profilinformationen",
          imageUrl: {
            content: "Profilbild",
          },
          bio: {
            content: "Biografie",
          },
          jobTitle: {
            content: "Berufsbezeichnung",
          },
          leadId: {
            content: "Zugeordnete Lead-ID",
          },
        },
        accountStatus: {
          title: "Kontostatus",
          description: "Informationen zum Benutzerkontostatus",
          isActive: {
            content: "Aktiver Status",
          },
          emailVerified: {
            content: "E-Mail verifiziert",
          },
          stripeCustomerId: {
            content: "Stripe-Kunden-ID",
          },
          userRoles: {
            content: "Benutzerrollen",
          },
        },
        timestamps: {
          title: "Zeitstempel",
          description: "Erstellungs- und Aktualisierungszeitstempel",
          createdAt: {
            content: "Erstellt am",
          },
          updatedAt: {
            content: "Aktualisiert am",
          },
        },
        referralInfo: {
          title: "Empfehlungsinfo",
          description: "Empfehlungskette und Verdienste",
          referredByUserId: {
            content: "Empfohlen von (Benutzer-ID)",
          },
          referredByCode: {
            content: "Verwendeter Empfehlungscode",
          },
          totalReferrals: {
            content: "Geworbene Nutzer",
          },
          totalEarnedCents: {
            content: "Gesamtverdienst (Cent)",
          },
        },
        leadId: {
          content: "Zugehörige Lead-ID",
        },
        email: {
          content: "E-Mail-Adresse",
        },
        privateName: {
          content: "Privater Name",
        },
        publicName: {
          content: "Öffentlicher Name",
        },
        firstName: {
          content: "Vorname",
        },
        lastName: {
          content: "Nachname",
        },
        company: {
          content: "Unternehmen",
        },
        phone: {
          content: "Telefonnummer",
        },
        preferredContactMethod: {
          content: "Bevorzugte Kontaktmethode",
        },
        imageUrl: {
          content: "Profilbild",
        },
        bio: {
          content: "Biografie",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Berufsbezeichnung",
        },
        emailVerified: {
          content: "E-Mail verifiziert",
        },
        isActive: {
          content: "Aktiver Status",
        },
        stripeCustomerId: {
          content: "Stripe-Kunden-ID",
        },
        userRoles: {
          content: "Benutzerrollen",
        },
        createdAt: {
          content: "Erstellt am",
        },
        updatedAt: {
          content: "Aktualisiert am",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisierter Zugriff",
          description:
            "Sie müssen angemeldet sein, um Benutzerdetails anzuzeigen",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Benutzer-ID angegeben",
        },
        forbidden: {
          title: "Zugriff verboten",
          description:
            "Sie haben keine Berechtigung, diesen Benutzer anzuzeigen",
        },
        notFound: {
          title: "Benutzer nicht gefunden",
          description: "Der angeforderte Benutzer konnte nicht gefunden werden",
          detail: "Kein Benutzer mit der ID {{userId}} vorhanden.",
        },
        conflict: {
          title: "Konfliktfehler",
          description:
            "Benutzer kann aufgrund bestehender Konflikte nicht abgerufen werden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server kann nicht hergestellt werden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Sie haben ungespeicherte Änderungen, die verloren gehen",
        },
        server: {
          title: "Serverfehler",
          description:
            "Benutzer kann aufgrund eines Serverfehlers nicht abgerufen werden",
          detail: "Benutzerdaten nicht abrufbar: {{error}}",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unerwarteter Fehler ist beim Abrufen des Benutzers aufgetreten",
        },
      },
      success: {
        title: "Benutzer erfolgreich abgerufen",
        description: "Benutzerinformationen wurden erfolgreich abgerufen",
      },
    },
    put: {
      title: "Benutzer aktualisieren",
      titleShort: "Benutzer aktualisieren",
      description: "Benutzerinformationen und Profildetails aktualisieren",
      container: {
        title: "Benutzer aktualisieren",
        description: "Benutzerinformationen und Einstellungen ändern",
      },
      id: {
        label: "Benutzer-ID",
        description: "Eindeutige Kennung für den zu aktualisierenden Benutzer",
        placeholder: "Benutzer-ID eingeben...",
      },
      sections: {
        basicInfo: {
          title: "Grundinformationen",
          description: "Grundlegende Benutzerinformationen aktualisieren",
        },
        contactInfo: {
          title: "Kontaktinformationen",
          description: "Kontaktdaten aktualisieren",
        },
        profileDetails: {
          title: "Profildetails",
          description: "Zusätzliche Profilinformationen aktualisieren",
        },
        adminSettings: {
          title: "Administrative Einstellungen",
          description: "Administrative Einstellungen aktualisieren",
        },
      },
      email: {
        label: "E-Mail-Adresse",
        description:
          "E-Mail-Adresse des Benutzers für Anmeldung und Kommunikation",
        placeholder: "E-Mail-Adresse eingeben...",
      },
      privateName: {
        label: "Privater Name",
        description:
          "Vollständiger rechtlicher Name des Benutzers (nur für Administratoren sichtbar)",
      },
      publicName: {
        label: "Öffentlicher Name",
        description: "Anzeigename des Benutzers (für alle Benutzer sichtbar)",
      },
      firstName: {
        label: "Vorname",
        description: "Vorname des Benutzers",
        placeholder: "Vorname eingeben...",
      },
      lastName: {
        label: "Nachname",
        description: "Nachname des Benutzers",
        placeholder: "Nachname eingeben...",
      },
      company: {
        label: "Unternehmen",
        description: "Unternehmen oder Organisation des Benutzers",
        placeholder: "Unternehmen eingeben...",
      },
      phone: {
        label: "Telefonnummer",
        description: "Kontakt-Telefonnummer des Benutzers",
        placeholder: "Telefonnummer eingeben...",
      },
      preferredContactMethod: {
        label: "Bevorzugte Kontaktmethode",
        description: "Wie der Benutzer bevorzugt kontaktiert werden möchte",
      },
      bio: {
        label: "Biografie",
        description: "Kurze Beschreibung über den Benutzer",
        placeholder: "Biografie eingeben...",
      },
      website: {
        label: "Website",
        description: "Persönliche oder Unternehmens-Website des Benutzers",
        placeholder: "Website-URL eingeben...",
      },
      jobTitle: {
        label: "Berufsbezeichnung",
        description: "Berufsbezeichnung oder Position des Benutzers",
        placeholder: "Berufsbezeichnung eingeben...",
      },
      emailVerified: {
        label: "E-Mail verifiziert",
        description: "Ob die E-Mail des Benutzers verifiziert ist",
      },
      isActive: {
        label: "Aktiver Status",
        description: "Ob das Benutzerkonto aktiv ist",
      },
      leadId: {
        label: "Lead-ID",
        description: "Zugehörige Lead-Kennung",
        placeholder: "Lead-ID eingeben...",
      },
      isBanned: {
        label: "Gesperrt",
        description: "Ob der Benutzer von der Plattform gesperrt ist",
      },
      bannedReason: {
        label: "Sperrgrund",
        description: "Grund für die Sperrung des Benutzers",
      },
      response: {
        leadId: {
          content: "Zugehörige Lead-ID",
        },
        email: {
          content: "E-Mail-Adresse",
        },
        privateName: {
          content: "Privater Name",
        },
        publicName: {
          content: "Öffentlicher Name",
        },
        firstName: {
          content: "Vorname",
        },
        lastName: {
          content: "Nachname",
        },
        company: {
          content: "Unternehmen",
        },
        phone: {
          content: "Telefonnummer",
        },
        preferredContactMethod: {
          content: "Bevorzugte Kontaktmethode",
        },
        imageUrl: {
          content: "Profilbild",
        },
        bio: {
          content: "Biografie",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Berufsbezeichnung",
        },
        emailVerified: {
          content: "E-Mail verifiziert",
        },
        isActive: {
          content: "Aktiver Status",
        },
        stripeCustomerId: {
          content: "Stripe-Kunden-ID",
        },
        userRoles: {
          content: "Benutzerrollen",
        },
        createdAt: {
          content: "Erstellt am",
        },
        updatedAt: {
          content: "Aktualisiert am",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisierter Zugriff",
          description:
            "Sie müssen angemeldet sein, um Benutzer zu aktualisieren",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description:
            "Bitte überprüfen Sie die Formulardaten und versuchen Sie es erneut",
        },
        forbidden: {
          title: "Zugriff verboten",
          description:
            "Sie haben keine Berechtigung, diesen Benutzer zu aktualisieren",
        },
        notFound: {
          title: "Benutzer nicht gefunden",
          description:
            "Der zu aktualisierende Benutzer konnte nicht gefunden werden",
          detail: "Kein Benutzer mit der ID {{userId}} vorhanden.",
        },
        conflict: {
          title: "Aktualisierungskonflikt",
          description:
            "Die Benutzerdaten stehen im Konflikt mit vorhandenen Datensätzen",
        },
        server: {
          title: "Serverfehler",
          description:
            "Benutzer kann aufgrund eines Serverfehlers nicht aktualisiert werden",
          detail: "Änderungen konnten nicht gespeichert werden: {{error}}",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unerwarteter Fehler ist beim Aktualisieren des Benutzers aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server kann nicht hergestellt werden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Sie haben ungespeicherte Änderungen, die verloren gehen",
        },
      },
      success: {
        title: "Benutzer erfolgreich aktualisiert",
        description: "Benutzerinformationen wurden erfolgreich aktualisiert",
      },
    },
    delete: {
      title: "Benutzer löschen",
      titleShort: "Benutzer löschen",
      description: "Benutzerkonto dauerhaft löschen",
      container: {
        title: "Benutzer löschen",
        description: "Benutzer dauerhaft aus dem System entfernen",
      },
      id: {
        label: "Benutzer-ID",
        description: "Eindeutige Kennung für den zu löschenden Benutzer",
        placeholder: "Benutzer-ID eingeben...",
        helpText: "WARNUNG: Diese Aktion kann nicht rückgängig gemacht werden",
      },
      submitButton: {
        label: "Benutzer löschen",
        loadingText: "Wird gelöscht...",
      },
      response: {
        deletionResult: {
          title: "Löschungsergebnis",
          description: "Ergebnis des Löschvorgangs",
          success: {
            content: "Löschung erfolgreich",
          },
          message: {
            content: "Löschungsnachricht",
          },
          deletedAt: {
            content: "Gelöscht am",
          },
        },
        success: {
          content: "Löschung erfolgreich",
        },
        message: {
          content: "Löschungsnachricht",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisierter Zugriff",
          description: "Sie müssen angemeldet sein, um Benutzer zu löschen",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Benutzer-ID für Löschung angegeben",
        },
        forbidden: {
          title: "Zugriff verboten",
          description: "Sie haben keine Berechtigung, Benutzer zu löschen",
        },
        notFound: {
          title: "Benutzer nicht gefunden",
          description: "Der zu löschende Benutzer konnte nicht gefunden werden",
          detail: "Kein Benutzer mit der ID {{userId}} vorhanden.",
        },
        server: {
          title: "Serverfehler",
          description:
            "Benutzer kann aufgrund eines Serverfehlers nicht gelöscht werden",
          detail: "Benutzer konnte nicht gelöscht werden: {{error}}",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unerwarteter Fehler ist beim Löschen des Benutzers aufgetreten",
        },
        conflict: {
          title: "Konfliktfehler",
          description:
            "Benutzer kann aufgrund bestehender Abhängigkeiten nicht gelöscht werden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server kann nicht hergestellt werden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Sie haben ungespeicherte Änderungen, die verloren gehen",
        },
      },
      success: {
        title: "Benutzer erfolgreich gelöscht",
        description: "Benutzer wurde erfolgreich gelöscht",
      },
    },
    widget: {
      userProfile: "Benutzerprofil",
      active: "Aktiv",
      inactive: "Inaktiv",
      leadId: "Lead-ID:",
      viewLead: "Lead anzeigen",
      created: "Erstellt",
      lastUpdated: "Zuletzt aktualisiert",
      fullProfile: "Vollständiges Profil",
      referrals: "Empfehlungen",
      subscription: "Abonnement",
      creditHistory: "Kreditverlauf",
      deleteUser: "Benutzer löschen",
      userDeletedSuccessfully: "Benutzer erfolgreich gelöscht",
      deletedAt: "Gelöscht am",
      confirmDeletion: "Löschung bestätigen",
      confirmDeletionMessage:
        "Dadurch wird der Benutzer und alle zugehörigen Daten dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
      titleReferralCodes: "Referral-Codes und Statistiken",
      titleSubscription: "Abonnement anzeigen",
      titleCopyUserId: "Benutzer-ID kopieren",
    },
    getCrm: {
      get: {
        title: "CRM-Profil des Benutzers abrufen",
        titleShort: "CRM-Profil",
        description: "Rechnungsfelder und Notizanzahl eines Benutzers abrufen",
        fields: {
          userId: {
            label: "Benutzer-ID",
            description: "Der abzufragende Benutzer",
            placeholder: "Benutzer-UUID",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Benutzer-ID",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Sie müssen angemeldet sein",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description:
              "Sie haben keinen Zugriff auf CRM-Daten dieses Benutzers",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Benutzer nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkanfrage fehlgeschlagen",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Es gibt nicht gespeicherte Änderungen",
          },
          internal: {
            title: "Interner Fehler",
            description: "Serverfehler — erneut versuchen",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
        },
        success: {
          title: "CRM-Profil geladen",
          description: "Benutzer-CRM-Daten abgerufen",
        },
        widget: {
          addNote: "Notiz hinzufügen",
          viewNotes: "Notizen ansehen",
        },
        response: {
          id: "Benutzer-ID",
          email: "E-Mail",
          privateName: "Name",
          companyBillingName: "Unternehmen / Rechnungsname",
          vatNumber: "USt-IdNr.",
          taxId: "Steuer-ID",
          phone: "Telefon",
          addressLine1: "Adresszeile 1",
          addressLine2: "Adresszeile 2",
          city: "Stadt",
          region: "Region",
          postalCode: "Postleitzahl",
          billingCountry: "Land",
          defaultCurrency: "Standardwährung",
          paymentTermsDays: "Zahlungsziel (Tage)",
          notesCount: "Gesamtnotizen",
        },
      },
      tag: "CRM",
    },
    notesCreate: {
      post: {
        title: "Benutzernotiz erstellen",
        titleShort: "Notiz erstellen",
        description:
          "CRM-Notiz, Gesprächsprotokoll, E-Mail, Meeting oder Aufgabe für einen Benutzer hinzufügen",
        fields: {
          userId: {
            label: "Benutzer",
            description: "Der Benutzer, auf den sich diese Notiz bezieht",
            placeholder: "Benutzer auswählen",
          },
          type: {
            label: "Aktivitätstyp",
            description: "Welche Art von Interaktion dies erfasst",
            placeholder: "Typ auswählen",
          },
          content: {
            label: "Inhalt",
            description: "Details der Aktivität",
            placeholder: "Was ist passiert...",
          },
          isPrivate: {
            label: "Privat",
            description: "Private Notizen sind nur für Sie sichtbar",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description:
              "Überprüfen Sie die Felder und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Sie müssen angemeldet sein",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description: "Sie haben keinen Zugriff auf diesen Benutzer",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Benutzer nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkanfrage fehlgeschlagen",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Es gibt nicht gespeicherte Änderungen",
          },
          internal: {
            title: "Interner Fehler",
            description: "Serverfehler — erneut versuchen",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
        },
        success: {
          title: "Notiz erstellt",
          description: "Die Notiz wurde gespeichert",
        },
        widget: {
          created: "Notiz erstellt",
          noteId: "Notiz-ID",
          backToNotes: "Zurück zu Notizen",
        },
        response: {
          id: "Notiz-ID",
          userId: "Benutzer-ID",
          authorUserId: "Autor-ID",
          type: "Typ",
          content: "Inhalt",
          isPrivate: "Privat",
          createdAt: "Erstellt am",
          updatedAt: "Aktualisiert am",
        },
      },
      tag: "CRM",
    },
    notesList: {
      get: {
        title: "Benutzernotizen auflisten",
        titleShort: "Benutzernotizen",
        description:
          "CRM-Notizen für einen Benutzer anzeigen, gefiltert nach Typ und Sichtbarkeit",
        fields: {
          userId: {
            label: "Benutzer-ID",
            description: "Notizen welches Benutzers auflisten",
            placeholder: "Benutzer-UUID",
          },
          type: {
            label: "Typ",
            description: "Nach Aktivitätstyp filtern",
            placeholder: "Alle Typen",
          },
          isPrivate: {
            label: "Nur private",
            description: "Nur eigene private Notizen anzeigen",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description:
              "Überprüfen Sie die Filter und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Sie müssen angemeldet sein",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description: "Sie haben keinen Zugriff auf diese Notizen",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Benutzer nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkanfrage fehlgeschlagen",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Es gibt nicht gespeicherte Änderungen",
          },
          internal: {
            title: "Interner Fehler",
            description: "Serverfehler — erneut versuchen",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
        },
        success: {
          title: "Notizen geladen",
          description: "Notizen erfolgreich abgerufen",
        },
        widget: {
          addNote: "Notiz hinzufügen",
          total: "Gesamt",
          empty: "Noch keine Notizen",
          delete: "Löschen",
          private: "Privat",
          ago: "vor",
        },
        response: {
          notes: "Notizen",
          total: "Gesamt",
          note: {
            id: "Notiz-ID",
            userId: "Benutzer-ID",
            authorUserId: "Autor-ID",
            type: "Typ",
            content: "Inhalt",
            isPrivate: "Privat",
            createdAt: "Erstellt am",
            updatedAt: "Aktualisiert am",
          },
        },
      },
      tag: "CRM",
    },
    noteDelete: {
      post: {
        title: "Benutzernotiz löschen",
        titleShort: "Notiz löschen",
        description:
          "CRM-Notiz löschen — nur der Autor oder ein Administrator kann dies tun",
        fields: {
          noteId: {
            label: "Notiz-ID",
            description: "Die zu löschende Notiz",
            placeholder: "Notiz-UUID",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Notiz-ID",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Sie müssen angemeldet sein",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description:
              "Nur der Autor oder ein Administrator kann diese Notiz löschen",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Notiz nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkanfrage fehlgeschlagen",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Es gibt nicht gespeicherte Änderungen",
          },
          internal: {
            title: "Interner Fehler",
            description: "Serverfehler — erneut versuchen",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
        },
        success: {
          title: "Notiz gelöscht",
          description: "Die Notiz wurde dauerhaft entfernt",
        },
        widget: {
          warning: "Diese Notiz wird unwiderruflich gelöscht.",
          deleted: "Notiz gelöscht.",
          backToNotes: "Zurück zu Notizen",
        },
        response: {
          deleted: "Gelöscht",
        },
      },
      tag: "CRM",
    },
  },
};
