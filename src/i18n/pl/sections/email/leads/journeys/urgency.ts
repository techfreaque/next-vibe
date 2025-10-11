import type { urgencyTranslations as EnglishUrgencyTranslations } from "../../../../../en/sections/email/leads/journeys/urgency";

export const urgencyTranslations: typeof EnglishUrgencyTranslations = {
  initial: {
    subject: "🚨 Tylko 5 miejsc pozostało (7 dni pozostało)",
    previewText: "Ograniczone miejsca dostępne - Nie przegap!",
    greeting: "Cześć,",
    intro:
      "Kontaktuję się, ponieważ mamy ograniczoną możliwość, która może przekształcić obecność Twojej firmy w mediach społecznościowych – ale tylko przez następne 7 dni.",
    urgencyAlert: "🚨 TYLKO 5 MIEJSC POZOSTAŁO 🚨",
    program:
      "Otwieramy nasz ekskluzywny program '90-dniowa Transformacja Mediów Społecznościowych' dla zaledwie 10 firm w tym miesiącu. Dlaczego tak mało? Ponieważ zapewniamy praktyczną, spersonalizowaną uwagę, która po prostu nie jest skalowalna do setek klientów.",
    stats: {
      spotsLeft: "5",
      spotsLeftLabel: "Miejsc pozostało",
      daysToApply: "7",
      daysToApplyLabel: "Dni na aplikację",
      daysToTransform: "90",
      daysToTransformLabel: "Dni na transformację",
    },
    socialProof: {
      quote:
        "Prawie się nie zgłosiłem, bo myślałem, że to zbyt piękne, żeby było prawdziwe. Najlepsza decyzja biznesowa, jaką podjąłem od lat. Teraz jesteśmy w pełni zarezerwowani!",
      author: "Rachel Kim",
      company: "Fotografia Kim",
    },
    competition:
      "Oto co czyni to pilnym: Twoi konkurenci już intensywnie inwestują w media społecznościowe. Każdy dzień, który czekasz, to kolejny dzień, w którym budują swoją przewagę.",
    ctaText: "Zabezpiecz swoje miejsce teraz",
    deadline: "⏰ Termin aplikacji: 7 dni od dzisiaj",
  },
  followup1: {
    subject: "3 miejsca zajęte od wczoraj (2 pozostało)",
    previewText: "3 miejsca zajęte od wczoraj",
    greeting: "Cześć,",
    intro:
      "Chciałem dać Ci szybką aktualizację naszego programu 90-dniowa Transformacja Mediów Społecznościowych.",
    update: "AKTUALIZACJA: Tylko 2 miejsca pozostało!",
    progress:
      "Od wczoraj 3 firmy zabezpieczyły swoje miejsca. Odpowiedź była przytłaczająca, a w tym tempie będziemy całkowicie zapełnieni w ciągu następnych 48 godzin.",
    concern:
      "Nie chcę, żeby {{businessName}} przegapił tę możliwość. Oto co otrzymujesz, gdy zabezpieczysz swoje miejsce dzisiaj:",
    benefits: [
      "Kompletny audit i strategia mediów społecznościowych",
      "90 dni tworzenia i zarządzania treścią",
      "Tygodniowe raporty wydajności i optymalizacja",
      "Bezpośredni dostęp do naszego zespołu przez Slack",
      "Gwarantowane wyniki lub zwrot pieniędzy",
    ],
    socialProof: {
      quote:
        "Wahałem się z zobowiązaniem, ale pilność była prawdziwa. Zapełnili się następnego dnia! Tak cieszę się, że nie czekałem – nasze wyniki były niesamowite.",
      author: "Tom Wilson",
      company: "Wilson Hydraulika",
    },
    warning:
      "Nie pozwól tej możliwości umknąć. Twoi konkurenci nie będą czekać, a Ty też nie powinieneś.",
    ctaText: "Zabezpiecz swoje miejsce zanim zniknie",
    stats: {
      spotsLeft: "2",
      spotsLeftLabel: "Miejsc pozostało",
      estimatedToFill: "48godz",
      estimatedToFillLabel: "Szacowany czas zapełnienia",
    },
  },
  followup2: {
    subject: "🚨 Ostatnie 24 godziny dla Twojej firmy",
    previewText: "Ostatnie 24 godziny - Ostatnia szansa",
    greeting: "Cześć,",
    finalCall: "🚨 OSTATNIE 24 GODZINY 🚨\nOstatnia szansa dla Twojej firmy",
    intro:
      "To jest to. Za 24 godziny nasz program 90-dniowa Transformacja Mediów Społecznościowych będzie całkowicie zapełniony, a następne otwarcie nie będzie aż do następnego kwartału.",
    personal:
      "Myślałem o Twojej firmie i potencjale, który widzę. Masz wszystko, czego potrzeba, aby zdominować swój rynek w mediach społecznościowych – potrzebujesz tylko odpowiedniej strategii i wykonania.",
    consequences: "Oto co się stanie, jeśli będziesz czekać:",
    risks: [
      "Twoi konkurenci nadal budują swoją przewagę w mediach społecznościowych",
      "Przegapisz 90 dni potencjalnej akwizycji klientów",
      "Następne otwarcie programu nie będzie aż do Q2 (3+ miesiące)",
      "Algorytmy mediów społecznościowych stają się jeszcze bardziej konkurencyjne",
    ],
    socialProof: {
      quote:
        "Prawie czekałem na 'następną rundę', ale zdałem sobie sprawę, że może jej nie być. Najlepsza decyzja w ogóle – potroiliśmy nasze leady z mediów społecznościowych!",
      author: "Lisa Chen",
      company: "Chen Marketing",
    },
    belief:
      "Wierzę w potencjał Twojej firmy. Nie pozwól tej możliwości Ci umknąć. Twoje przyszłe ja będzie Ci dziękować za podjęcie działania dzisiaj.",
    ctaText: "Zabezpiecz ostatnie miejsce teraz",
    finalDeadline:
      "⏰ Termin: Jutro o północy\nNastępne otwarcie: Dopiero w Q2 2024",
  },
  followup3: {
    subject: "🚨 OSTATNIE WEZWANIE: Ostatnie miejsce dla Twojej firmy",
    previewText: "Ostatnia możliwość - Ostatnia szansa",
    greeting: "Cześć,",
    intro: "To mój ostatni e-mail o ekskluzywnej możliwości dla Twojej firmy.",
    lastChance:
      "Termin minął, ale udało mi się zabezpieczyć jedno ostatnie miejsce dla Ciebie. To naprawdę ostatnia szansa - bez przedłużeń, bez wyjątków.",
    ctaText: "Zabezpiecz swoje ostatnie miejsce",
    urgency: "🚨 OSTATNIE WEZWANIE: Ta możliwość wygasa za 6 godzin",
  },
  nurture: {
    subject: "Darmowe spostrzeżenia dotyczące wzrostu dla Twojej firmy",
    previewText: "Wartościowe spostrzeżenia dla Twojej firmy",
    greeting: "Cześć,",
    intro:
      "Wiem, że byłeś zajęty, a timing nie był odpowiedni dla naszych poprzednich możliwości.",
    value:
      "Chciałem podzielić się wartościowymi spostrzeżeniami, które mogą pomóc Twojej firmie rosnąć, niezależnie od tego, czy współpracujemy. Bez presji, tylko wartość.",
    ctaText: "Otrzymaj darmowe spostrzeżenia dotyczące wzrostu",
    noStrings: "Bez zobowiązań - tylko pomocne zasoby dla Twojej firmy",
  },
  reactivation: {
    subject: "🚨 Pilna możliwość dla Twojej firmy",
    previewText: "Pilna możliwość - Ograniczony czas",
    greeting: "Cześć,",
    intro:
      "Wiem, że minęło trochę czasu od naszej ostatniej rozmowy o Twojej firmie.",
    urgent:
      "Pojawiło się coś pilnego, co myślę, że może być idealne dla Ciebie. Mamy ograniczoną czasowo możliwość, która jest specjalnie zaprojektowana dla firm takich jak Twoja.",
    ctaText: "Zobacz tę pilną możliwość",
    timeLimit: "⚡ Ograniczony czas: Tylko 48 godzin pozostało",
  },
};
