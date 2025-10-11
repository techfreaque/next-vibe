import type { validationErrorsTranslations as EnglishValidationErrorsTranslations } from "../../en/sections/validationErrors";

export const validationErrorsTranslations: typeof EnglishValidationErrorsTranslations =
  {
    common: {
      invalid_type: "Podano nieprawidłowy typ",
      invalid_literal: "Nieprawidłowa wartość literalna",
      unrecognized_keys: "Nierozpoznane klucze w obiekcie",
      invalid_union: "Nieprawidłowa wartość union",
      invalid_union_discriminator: "Nieprawidłowy dyskryminator union",
      invalid_enum_value: "Nieprawidłowa wartość enum",
      invalid_arguments: "Nieprawidłowe argumenty funkcji",
      invalid_return_type: "Nieprawidłowy typ zwracany",
      invalid_date: "Nieprawidłowa data",
      invalid_string: "Nieprawidłowy format ciągu znaków",
      invalid_email: "Nieprawidłowy adres e-mail",
      invalid_url: "Nieprawidłowy format URL",
      invalid_uuid: "Nieprawidłowy format UUID",
      too_small: "Wartość jest za mała",
      string_too_small: "Ciąg znaków jest za krótki",
      number_too_small: "Liczba jest za mała",
      array_too_small: "Tablica ma za mało elementów",
      too_big: "Wartość jest za duża",
      string_too_big: "Ciąg znaków jest za długi",
      number_too_big: "Liczba jest za duża",
      array_too_big: "Tablica ma za dużo elementów",
      invalid_intersection_types: "Nieprawidłowe typy intersection",
      not_multiple_of: "Liczba nie jest wielokrotnością wymaganej wartości",
      not_finite: "Liczba musi być skończona",
      custom_error: "Walidacja nie powiodła się",
      invalid_input: "Nieprawidłowe dane wejściowe",
    },
    user: {
      login: {
        email_invalid: "Proszę wprowadzić prawidłowy adres e-mail",
        password_min_length: "Hasło musi mieć co najmniej 8 znaków",
      },
      signup: {
        first_name_required: "Imię jest wymagane",
        last_name_required: "Nazwisko jest wymagane",
        company_required: "Nazwa firmy jest wymagana",
        email_invalid: "Proszę wprowadzić prawidłowy adres e-mail",
        password_min_length: "Hasło musi mieć co najmniej 8 znaków",
        password_confirmation_required: "Potwierdzenie hasła jest wymagane",
        passwords_do_not_match: "Hasła nie są zgodne",
        accept_terms_required: "Musisz zaakceptować regulamin",
      },
      resetPassword: {
        email_invalid: "Proszę wprowadzić prawidłowy adres e-mail",
        token_required: "Token resetowania hasła jest wymagany",
        new_password_min_length: "Nowe hasło musi mieć co najmniej 8 znaków",
        confirm_password_required: "Potwierdzenie hasła jest wymagane",
        passwords_do_not_match: "Hasła nie są zgodne",
      },
      profile: {
        first_name_required: "Imię jest wymagane",
        last_name_required: "Nazwisko jest wymagane",
        company_required: "Nazwa firmy jest wymagana",
        email_invalid: "Proszę wprowadzić prawidłowy adres e-mail",
        current_password_required: "Aktualne hasło jest wymagane",
        current_password_min_length:
          "Aktualne hasło musi mieć co najmniej 8 znaków",
        new_password_min_length: "Nowe hasło musi mieć co najmniej 8 znaków",
        password_confirmation_required: "Potwierdzenie hasła jest wymagane",
        password_confirmation_min_length:
          "Potwierdzenie hasła musi mieć co najmniej 8 znaków",
        passwords_do_not_match: "Hasła nie są zgodne",
        twitter_url_invalid: "Proszę wprowadzić prawidłowy URL profilu Twitter",
        facebook_url_invalid:
          "Proszę wprowadzić prawidłowy URL profilu Facebook",
        instagram_url_invalid:
          "Proszę wprowadzić prawidłowy URL profilu Instagram",
        linkedin_url_invalid:
          "Proszę wprowadzić prawidłowy URL profilu LinkedIn",
        github_url_invalid: "Proszę wprowadzić prawidłowy URL profilu GitHub",
        website_url_invalid:
          "Proszę wprowadzić prawidłowy URL strony internetowej",
      },
    },
    contact: {
      name_min_length: "Nazwa musi mieć co najmniej 2 znaki",
      email_invalid: "Proszę wprowadzić prawidłowy adres e-mail",
      subject_required: "Temat jest wymagany",
      subject_min_length: "Temat musi mieć co najmniej 2 znaki",
      message_min_length: "Wiadomość musi mieć co najmniej 10 znaków",
      priority_invalid: "Proszę wybrać prawidłowy poziom priorytetu",
      status_invalid: "Proszę wybrać prawidłowy status",
    },
    newsletter: {
      subscribe: {
        email_invalid: "Proszę wprowadzić prawidłowy adres e-mail",
      },
      unsubscribe: {
        email_invalid: "Proszę wprowadzić prawidłowy adres e-mail",
      },
    },
    businessData: {
      user_id_required:
        "ID użytkownika jest wymagane do dostępu do danych biznesowych",
      name_required: "Nazwa firmy jest wymagana i nie może być pusta",
      email_invalid: "Proszę wprowadzić prawidłowy adres e-mail firmy",
      businessInfo: {
        type_required: "Wybór typu działalności jest wymagany",
        business_name_required: "Nazwa firmy jest wymagana",
        size_required: "Proszę wybrać wielkość firmy",
        size_invalid:
          "Proszę wybrać prawidłową wielkość firmy: startup, mała, średnia, duża lub korporacja",
        email_invalid: "Proszę wprowadzić prawidłowy adres e-mail firmy",
        website_invalid:
          "Proszę wprowadzić prawidłowy URL strony internetowej firmy",
      },
      goals: {
        primary_goals_required: "Przynajmniej jeden główny cel jest wymagany",
        business_goal_invalid:
          "Proszę wybrać prawidłowy cel biznesowy: zwiększyć przychody, rozszerzyć bazę klientów, poprawić rozpoznawalność marki, zwiększyć zaangażowanie klientów, rozszerzyć zasięg rynkowy, zoptymalizować operacje, wprowadzić nowe produkty, poprawić utrzymanie klientów, zmniejszyć koszty, transformacja cyfrowa, poprawić obecność online lub generować leady",
      },
      brand: {},
      social: {
        platforms_required:
          "Przynajmniej jedna platforma mediów społecznościowych jest wymagana",
        platform_invalid:
          "Proszę wybrać prawidłową platformę społecznościową: Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest, Snapchat, Discord, Reddit, Telegram, WhatsApp lub Inne",
        priority_invalid:
          "Proszę wybrać prawidłowy poziom priorytetu: wysoki, średni lub niski",
        username_required:
          "Nazwa użytkownika/uchwyt jest wymagana dla każdej platformy",
      },
      profile: {
        first_name_required: "Imię jest wymagane",
        last_name_required: "Nazwisko jest wymagane",
        company_required: "Firma jest wymagana",
      },
      audience: {
        target_audience_required: "Opis grupy docelowej jest wymagany",
        gender_invalid:
          "Proszę wybrać prawidłową opcję płci: wszystkie, mężczyzna, kobieta, niebinarne lub inne",
      },
    },
    template: {
      input_value_required: "Wartość wejściowa jest wymagana",
      url_param_required: "Parametr URL jest wymagany",
      output_value_required: "Wartość wyjściowa jest wymagana",
    },
    phone: {
      number_format:
        "Proszę wprowadzić prawidłowy numer telefonu w formacie E.164 (np. +1234567890)",
    },
    onboarding: {
      name_required: "Pełne imię i nazwisko jest wymagane do onboardingu",
      email_required: "Adres e-mail jest wymagany do konfiguracji konta",
      email_invalid: "Proszę wprowadzić prawidłowy adres e-mail do onboardingu",
      business_type_required:
        "Wybór typu działalności jest wymagany do kontynuacji",
      target_audience_required: "Opis grupy docelowej jest wymagany",
      target_audience_min_length:
        "Opis grupy docelowej musi mieć co najmniej 10 znaków",
      select_at_least_one_goal: "Proszę wybrać co najmniej jeden cel biznesowy",
      social_platforms_required:
        "Należy wybrać co najmniej jedną platformę społecznościową",
      goals_required: "Należy wybrać co najmniej jeden cel biznesowy",
      postal_code_required:
        "Kod pocztowy jest wymagany dla adresu rozliczeniowego",
      country_required: "Wybór kraju jest wymagany do rozliczenia",
      country_invalid: "Proszę wybrać prawidłowy kraj z listy",
      plan_required: "Wybór planu subskrypcji jest wymagany",
      plan_invalid: "Proszę wybrać prawidłowy plan subskrypcji",
      currency_required: "Wybór waluty jest wymagany do rozliczenia",
      currency_invalid: "Proszę wybrać prawidłową walutę",
    },
    consultation: {
      business_type_required:
        "Typ działalności jest wymagany do zaplanowania konsultacji",
      contact_email_invalid:
        "Proszę wprowadzić prawidłowy adres e-mail do kontaktu w sprawie konsultacji",
      name_required: "Imię i nazwisko jest wymagane do konsultacji",
      email_invalid: "Proszę wprowadzić prawidłowy adres e-mail",
      invalid_selection_type:
        "Nieprawidłowy typ wyboru lub brakujące wymagane pola",
      start_date_invalid_datetime:
        "Data rozpoczęcia musi być w prawidłowym formacie ISO datetime",
      end_date_invalid_datetime:
        "Data zakończenia musi być w prawidłowym formacie ISO datetime",
      booking_too_early:
        "Konsultacja musi być zaplanowana co najmniej {{minHours}} godziny wcześniej",
      booking_too_far:
        "Konsultacja nie może być zaplanowana więcej niż {{maxMonths}} miesięcy wcześniej",
      non_working_day:
        "Konsultacje są dostępne tylko od poniedziałku do piątku",
      outside_business_hours:
        "Konsultacje są dostępne tylko między {{startHour}}:00 a {{endHour}}:00",
      invalid_date_time: "Proszę wybrać prawidłową datę i godzinę",
      insufficient_business_days_notice:
        "Konsultacja musi być zaplanowana co najmniej {{minBusinessDays}} dni robocze wcześniej",
      weekends_not_available: "Konsultacje nie są dostępne w weekendy",
    },
    subscription: {},
    payment: {
      amount_must_be_positive:
        "Kwota płatności musi być liczbą dodatnią większą od zera",
      success_url_invalid:
        "URL sukcesu musi być prawidłowym adresem internetowym dla przekierowania po zakończeniu płatności",
      cancel_url_invalid:
        "URL anulowania musi być prawidłowym adresem internetowym dla przekierowania po anulowaniu płatności",
      payment_method_id_required:
        "ID metody płatności jest wymagane i nie może być puste",
      transaction_id_invalid:
        "ID transakcji musi być w prawidłowym formacie UUID",
      refund_amount_must_be_positive:
        "Kwota zwrotu musi być liczbą dodatnią większą od zera",
      return_url_invalid:
        "URL powrotu musi być prawidłowym adresem internetowym dla przekierowania portalu klienta",
      invoice_amount_must_be_positive:
        "Kwota faktury musi być liczbą dodatnią większą od zera",
    },
    time: {
      invalid_time_format:
        "Czas musi być w prawidłowym formacie HH:MM (np. 14:30)",
      invalid_time_range: "Wartość czasu musi być między 00:00 a 23:59",
    },
  };
