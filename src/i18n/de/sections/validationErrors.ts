import type { validationErrorsTranslations as EnglishValidationErrorsTranslations } from "../../en/sections/validationErrors";

export const validationErrorsTranslations: typeof EnglishValidationErrorsTranslations =
  {
    common: {
      invalid_type: "Ungültiger Typ angegeben",
      invalid_literal: "Ungültiger Literalwert",
      unrecognized_keys: "Unbekannte Schlüssel im Objekt",
      invalid_union: "Ungültiger Union-Wert",
      invalid_union_discriminator: "Ungültiger Union-Diskriminator",
      invalid_enum_value: "Ungültiger Enum-Wert",
      invalid_arguments: "Ungültige Funktionsargumente",
      invalid_return_type: "Ungültiger Rückgabetyp",
      invalid_date: "Ungültiges Datum",
      invalid_string: "Ungültiges String-Format",
      invalid_email: "Ungültige E-Mail-Adresse",
      invalid_url: "Ungültiges URL-Format",
      invalid_uuid: "Ungültiges UUID-Format",
      too_small: "Wert ist zu klein",
      string_too_small: "String ist zu kurz",
      number_too_small: "Zahl ist zu klein",
      array_too_small: "Array hat zu wenige Elemente",
      too_big: "Wert ist zu groß",
      string_too_big: "String ist zu lang",
      number_too_big: "Zahl ist zu groß",
      array_too_big: "Array hat zu viele Elemente",
      invalid_intersection_types: "Ungültige Intersection-Typen",
      not_multiple_of: "Zahl ist kein Vielfaches des erforderlichen Werts",
      not_finite: "Zahl muss endlich sein",
      custom_error: "Validierung fehlgeschlagen",
      invalid_input: "Ungültige Eingabe",
    },
    user: {
      login: {
        email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        password_min_length: "Passwort muss mindestens 8 Zeichen lang sein",
      },
      signup: {
        first_name_required: "Vorname ist erforderlich",
        last_name_required: "Nachname ist erforderlich",
        company_required: "Firmenname ist erforderlich",
        email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        password_min_length: "Passwort muss mindestens 8 Zeichen lang sein",
        password_confirmation_required: "Passwort-Bestätigung ist erforderlich",
        passwords_do_not_match: "Passwörter stimmen nicht überein",
        accept_terms_required:
          "Sie müssen die Allgemeinen Geschäftsbedingungen akzeptieren",
      },
      resetPassword: {
        email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        token_required: "Token zum Zurücksetzen des Passworts ist erforderlich",
        new_password_min_length:
          "Neues Passwort muss mindestens 8 Zeichen lang sein",
        confirm_password_required: "Passwort-Bestätigung ist erforderlich",
        passwords_do_not_match: "Passwörter stimmen nicht überein",
      },
      profile: {
        first_name_required: "Vorname ist erforderlich",
        last_name_required: "Nachname ist erforderlich",
        company_required: "Firmenname ist erforderlich",
        email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        current_password_required: "Aktuelles Passwort ist erforderlich",
        current_password_min_length:
          "Aktuelles Passwort muss mindestens 8 Zeichen lang sein",
        new_password_min_length:
          "Neues Passwort muss mindestens 8 Zeichen lang sein",
        password_confirmation_required: "Passwort-Bestätigung ist erforderlich",
        password_confirmation_min_length:
          "Passwort-Bestätigung muss mindestens 8 Zeichen lang sein",
        passwords_do_not_match: "Passwörter stimmen nicht überein",
        twitter_url_invalid:
          "Bitte geben Sie eine gültige Twitter-Profil-URL ein",
        facebook_url_invalid:
          "Bitte geben Sie eine gültige Facebook-Profil-URL ein",
        instagram_url_invalid:
          "Bitte geben Sie eine gültige Instagram-Profil-URL ein",
        linkedin_url_invalid:
          "Bitte geben Sie eine gültige LinkedIn-Profil-URL ein",
        github_url_invalid:
          "Bitte geben Sie eine gültige GitHub-Profil-URL ein",
        website_url_invalid: "Bitte geben Sie eine gültige Website-URL ein",
      },
    },
    contact: {
      name_min_length: "Name muss mindestens 2 Zeichen lang sein",
      email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      subject_required: "Betreff ist erforderlich",
      subject_min_length: "Betreff muss mindestens 2 Zeichen lang sein",
      message_min_length: "Nachricht muss mindestens 10 Zeichen lang sein",
      priority_invalid: "Bitte wählen Sie eine gültige Prioritätsstufe",
      status_invalid: "Bitte wählen Sie einen gültigen Status",
    },
    newsletter: {
      subscribe: {
        email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      },
      unsubscribe: {
        email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      },
    },
    businessData: {
      user_id_required:
        "Benutzer-ID ist erforderlich, um auf Geschäftsdaten zuzugreifen",
      name_required: "Firmenname ist erforderlich und darf nicht leer sein",
      email_invalid:
        "Bitte geben Sie eine gültige Geschäfts-E-Mail-Adresse ein",
      businessInfo: {
        type_required: "Auswahl des Geschäftstyps ist erforderlich",
        business_name_required: "Unternehmensname ist erforderlich",
        size_required: "Bitte wählen Sie eine Unternehmensgröße aus",
        size_invalid:
          "Bitte wählen Sie eine gültige Unternehmensgröße: Startup, klein, mittel, groß oder Großunternehmen",
        email_invalid:
          "Bitte geben Sie eine gültige Geschäfts-E-Mail-Adresse ein",
        website_invalid:
          "Bitte geben Sie eine gültige Website-URL für Ihr Unternehmen ein",
      },
      goals: {
        primary_goals_required: "Mindestens ein Hauptziel ist erforderlich",
        business_goal_invalid:
          "Bitte wählen Sie ein gültiges Geschäftsziel: Umsatz steigern, Kundenstamm erweitern, Markenbekanntheit verbessern, Kundenengagement steigern, Marktreichweite ausbauen, Abläufe optimieren, neue Produkte einführen, Kundenbindung verbessern, Kosten reduzieren, digitale Transformation, Online-Präsenz verbessern oder Leads generieren",
      },
      brand: {},
      social: {
        platforms_required:
          "Mindestens eine Social-Media-Plattform ist erforderlich",
        platform_invalid:
          "Bitte wählen Sie eine gültige Social-Media-Plattform: Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest, Snapchat, Discord, Reddit, Telegram, WhatsApp oder Andere",
        priority_invalid:
          "Bitte wählen Sie eine gültige Prioritätsstufe: hoch, mittel oder niedrig",
        username_required:
          "Benutzername/Handle ist für jede Plattform erforderlich",
      },
      profile: {
        first_name_required: "Vorname ist erforderlich",
        last_name_required: "Nachname ist erforderlich",
        company_required: "Unternehmen ist erforderlich",
      },
      audience: {
        target_audience_required:
          "Beschreibung der Zielgruppe ist erforderlich",
        gender_invalid:
          "Bitte wählen Sie eine gültige Geschlechtsoption: alle, männlich, weiblich, nicht-binär oder andere",
      },
    },
    template: {
      input_value_required:
        "Template-Eingabewert ist erforderlich und darf nicht leer sein",
      url_param_required:
        "Template-URL-Parameter ist erforderlich und darf nicht leer sein",
      output_value_required:
        "Template-Ausgabewert ist erforderlich und darf nicht leer sein",
    },
    phone: {
      number_format:
        "Bitte geben Sie eine gültige Telefonnummer im E.164-Format ein (z.B., +1234567890)",
    },
    onboarding: {
      name_required: "Vollständiger Name ist für das Onboarding erforderlich",
      email_required:
        "E-Mail-Adresse ist für die Kontoeinrichtung erforderlich",
      email_invalid:
        "Bitte geben Sie eine gültige E-Mail-Adresse für das Onboarding ein",
      business_type_required:
        "Auswahl des Geschäftstyps ist erforderlich, um fortzufahren",
      target_audience_required: "Beschreibung der Zielgruppe ist erforderlich",
      target_audience_min_length:
        "Beschreibung der Zielgruppe muss mindestens 10 Zeichen lang sein",
      select_at_least_one_goal:
        "Bitte wählen Sie mindestens ein Geschäftsziel aus",
      social_platforms_required:
        "Mindestens eine Social-Media-Plattform muss ausgewählt werden",
      goals_required: "Mindestens ein Geschäftsziel muss ausgewählt werden",
      postal_code_required:
        "Postleitzahl ist für die Rechnungsadresse erforderlich",
      country_required: "Länderauswahl ist für die Abrechnung erforderlich",
      country_invalid: "Bitte wählen Sie ein gültiges Land aus der Liste aus",
      plan_required: "Auswahl des Abonnementplans ist erforderlich",
      plan_invalid: "Bitte wählen Sie einen gültigen Abonnementplan aus",
      currency_required: "Währungsauswahl ist für die Abrechnung erforderlich",
      currency_invalid: "Bitte wählen Sie eine gültige Währung aus",
    },
    consultation: {
      business_type_required:
        "Geschäftstyp ist erforderlich, um eine Beratung zu planen",
      contact_email_invalid:
        "Bitte geben Sie eine gültige E-Mail-Adresse für den Beratungskontakt ein",
      name_required: "Name ist für die Beratung erforderlich",
      email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      invalid_selection_type:
        "Ungültiger Auswahltyp oder fehlende erforderliche Felder",
      start_date_invalid_datetime:
        "Startdatum muss im gültigen ISO-Datetime-Format vorliegen",
      end_date_invalid_datetime:
        "Enddatum muss im gültigen ISO-Datetime-Format vorliegen",
      booking_too_early:
        "Beratung muss mindestens {{minHours}} Stunden im Voraus geplant werden",
      booking_too_far:
        "Beratung kann nicht mehr als {{maxMonths}} Monate im Voraus geplant werden",
      non_working_day: "Beratungen sind nur von Montag bis Freitag verfügbar",
      outside_business_hours:
        "Beratungen sind nur zwischen {{startHour}}:00 und {{endHour}}:00 Uhr verfügbar",
      invalid_date_time:
        "Bitte wählen Sie ein gültiges Datum und eine gültige Uhrzeit",
      insufficient_business_days_notice:
        "Beratung muss mindestens {{minBusinessDays}} Werktage im Voraus geplant werden",
      weekends_not_available: "Beratungen sind an Wochenenden nicht verfügbar",
    },
    subscription: {},
    payment: {
      amount_must_be_positive:
        "Zahlungsbetrag muss eine positive Zahl größer als null sein",
      success_url_invalid:
        "Erfolgs-URL muss eine gültige Webadresse für die Zahlungsabschluss-Weiterleitung sein",
      cancel_url_invalid:
        "Abbruch-URL muss eine gültige Webadresse für die Zahlungsabbruch-Weiterleitung sein",
      payment_method_id_required:
        "Zahlungsmethoden-ID ist erforderlich und darf nicht leer sein",
      transaction_id_invalid:
        "Transaktions-ID muss im gültigen UUID-Format vorliegen",
      refund_amount_must_be_positive:
        "Rückerstattungsbetrag muss eine positive Zahl größer als null sein",
      return_url_invalid:
        "Rückkehr-URL muss eine gültige Webadresse für die Kundenportal-Weiterleitung sein",
      invoice_amount_must_be_positive:
        "Rechnungsbetrag muss eine positive Zahl größer als null sein",
    },
    time: {
      invalid_time_format:
        "Zeit muss im gültigen HH:MM-Format vorliegen (z.B. 14:30)",
      invalid_time_range: "Zeitwert muss zwischen 00:00 und 23:59 liegen",
    },
  };
