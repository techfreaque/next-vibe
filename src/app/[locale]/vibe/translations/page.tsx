"use client";

import {
  CheckCircle,
  Code,
  FileText,
  FolderTree,
  Globe,
  Languages,
  Shield,
  Zap,
} from "lucide-react";
import type { JSX } from "react";
import { useState } from "react";

const codeExamples = {
  structure: `// Type-safe translations next to usage
// Instead of centralized translation files, keep them with the code

// src/app/api/[locale]/v1/users/i18n/en/api.ts
export default {
  users: {
    create: {
      title: "Create User",
      description: "Add a new user to the system",
      fields: {
        email: {
          label: "Email Address",
          placeholder: "user@example.com",
          description: "User's primary email for login",
          errors: {
            required: "Email is required",
            invalid: "Please enter a valid email address",
            duplicate: "This email is already registered"
          }
        },
        name: {
          label: "Full Name",
          placeholder: "John Doe",
          description: "User's display name"
        },
        role: {
          label: "User Role",
          description: "Access level for this user",
          options: {
            admin: "Administrator",
            user: "Regular User",
            guest: "Guest (read-only)"
          }
        }
      },
      success: {
        title: "User Created Successfully",
        description: "The user has been added to the system"
      },
      errors: {
        general: "Failed to create user",
        unauthorized: "You don't have permission to create users"
      }
    }
  }
} as const; // Important: as const for type inference!`,

  usage: `// Using translations in endpoints
// src/app/api/[locale]/v1/users/definition.ts
import { createEndpoint } from "next-vibe/endpoint";

const { POST } = createEndpoint({
  // Translations are automatically resolved
  title: "users.create.title",
  description: "users.create.description",
  
  fields: objectField({
    email: requestDataField({
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.EMAIL,
      label: "users.create.fields.email.label",
      placeholder: "users.create.fields.email.placeholder",
      description: "users.create.fields.email.description",
    }, z.email()),
  }),
  
  errorTypes: {
    VALIDATION_FAILED: {
      title: "users.create.errors.general",
      description: "users.create.errors.validation"
    }
  },
  
  successTypes: {
    title: "users.create.success.title",
    description: "users.create.success.description"
  }
});

// Using translations in React components
function UserForm() {
  const { t } = useTranslation();
  
  return (
    <form>
      <label>{t('users.create.fields.email.label')}</label>
      <input placeholder={t('users.create.fields.email.placeholder')} />
      {error && <span>{t(error.translationKey)}</span>}
    </form>
  );
}`,

  typeSafety: `// Full type safety for translation keys
// Auto-generated types from translation files

// The type system knows all available keys
type TranslationKey = 
  | "users.create.title"
  | "users.create.fields.email.label"
  | "users.create.fields.email.errors.required"
  // ... all other keys

// Type-safe translation function
const { t } = useTranslation();

// ✅ Valid - autocomplete works
t('users.create.fields.email.label')

// ❌ Type error - wrong key
t('users.create.fields.emial.label')
//                      ^^^^^ Property 'emial' does not exist

// Parameters are type-checked too
t('users.welcome', { name: user.name }) // ✅ Valid
t('users.welcome', { nmae: user.name }) // ❌ Type error

// Nested translations with dot notation
const emailTranslations = t('users.create.fields.email.*');
// Returns typed object with all email translations`,

  multiLocale: `// Support for multiple languages
// src/app/api/[locale]/v1/users/i18n/de/api.ts
export default {
  users: {
    create: {
      title: "Benutzer erstellen",
      description: "Einen neuen Benutzer zum System hinzufügen",
      fields: {
        email: {
          label: "E-Mail-Adresse",
          placeholder: "benutzer@beispiel.de",
          errors: {
            required: "E-Mail ist erforderlich",
            invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein"
          }
        }
      }
    }
  }
} as const;

// src/app/api/[locale]/v1/users/i18n/es/api.ts
export default {
  users: {
    create: {
      title: "Crear Usuario",
      description: "Agregar un nuevo usuario al sistema",
      fields: {
        email: {
          label: "Correo Electrónico",
          placeholder: "usuario@ejemplo.com"
        }
      }
    }
  }
} as const;

// Automatic locale detection and routing
// URLs automatically include locale: /api/en/v1/users, /api/de/v1/users`,

  serverClient: `// Server-side translations
// Pages and API routes
import { simpleT } from "next-vibe/server";

export default async function UserPage({ params }: Props) {
  const { locale } = await params;
  const { t } = simpleT(locale);
  
  return (
    <div>
      <h1>{t('users.create.title')}</h1>
      <p>{t('users.create.description')}</p>
    </div>
  );
}

// Client-side translations
// React components
"use client";
import { useTranslation } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

function UserForm() {
  const { t, locale, setLocale } = useTranslation();
  
  return (
    <div>
      <select value={locale} onChange={e => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="es">Español</option>
      </select>
      
      <h2>{t('users.create.title')}</h2>
    </div>
  );
}

// CLI translations
$ vibe user:create --locale de
Benutzer erstellen
E-Mail-Adresse: _`,

  advanced: `// Advanced i18n features
// Pluralization
export default {
  users: {
    count: {
      zero: "No users",
      one: "1 user",
      other: "{{count}} users"
    }
  }
} as const;

// Usage
t('users.count', { count: 0 })    // "No users"
t('users.count', { count: 1 })    // "1 user"  
t('users.count', { count: 42 })   // "42 users"

// Date and number formatting
export default {
  formats: {
    date: {
      short: "MM/DD/YYYY",
      long: "MMMM Do, YYYY"
    },
    currency: {
      style: "currency",
      currency: "USD"
    }
  }
} as const;

// Rich text with components
t('terms.agree', {
  link: <Link href="/terms">terms of service</Link>
})
// Renders: "By continuing, you agree to our <link>terms of service</link>"

// Lazy loading translations
const { t } = useTranslation({
  // Only load translations for current section
  namespace: 'users.create'
});`,
};

export default function I18nPage(): JSX.Element {
  const [activeExample, setActiveExample] =
    useState<keyof typeof codeExamples>("structure");

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Globe className="h-12 w-12 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Internationalization (i18n)
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Type-safe translations that live next to your code. No more hunting
          through massive JSON files - translations are co-located with the
          features they describe.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Next-Generation i18n
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FolderTree className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Co-located
              </h3>
              <p className="text-gray-400 text-sm">
                Translations live next to the code they describe
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Type-Safe
              </h3>
              <p className="text-gray-400 text-sm">
                Full TypeScript support with autocomplete
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Performant
              </h3>
              <p className="text-gray-400 text-sm">
                Only load translations you need, when you need them
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Languages className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Multi-Platform
              </h3>
              <p className="text-gray-400 text-sm">
                Works on server, client, CLI, and React Native
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Live Examples</h2>
        <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveExample("structure")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "structure"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                File Structure
              </button>
              <button
                onClick={() => setActiveExample("usage")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "usage"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Basic Usage
              </button>
              <button
                onClick={() => setActiveExample("typeSafety")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "typeSafety"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Type Safety
              </button>
              <button
                onClick={() => setActiveExample("multiLocale")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "multiLocale"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Multi-Language
              </button>
              <button
                onClick={() => setActiveExample("serverClient")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "serverClient"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Server/Client
              </button>
              <button
                onClick={() => setActiveExample("advanced")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeExample === "advanced"
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Advanced
              </button>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-gray-300">
                {codeExamples[activeExample]}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Why Co-located Translations?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Better Organization
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              When translations live next to the code they describe, it's
              impossible to have orphaned translations or missing keys.
              Everything is in one place.
            </p>
            <div className="bg-black/30 rounded-lg p-3 text-sm">
              <div className="text-gray-400">users/</div>
              <div className="text-gray-400 ml-4">├── definition.ts</div>
              <div className="text-gray-400 ml-4">├── repository.ts</div>
              <div className="text-gray-400 ml-4">└── i18n/</div>
              <div className="text-purple-400 ml-8">├── en/api.ts</div>
              <div className="text-purple-400 ml-8">└── de/api.ts</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Code className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Easier Maintenance
              </h3>
            </div>
            <p className="text-gray-300 mb-3">
              When you update a feature, the translations are right there. No
              need to update multiple files across the codebase or worry about
              keeping them in sync.
            </p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✓ Refactor code and translations together</li>
              <li>✓ Delete features without orphaned translations</li>
              <li>✓ Copy entire features with translations</li>
              <li>✓ Review changes in one pull request</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Type Generation
              </h3>
            </div>
            <p className="text-gray-300">The build system automatically:</p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>• Discovers all translation files</li>
              <li>• Generates TypeScript types</li>
              <li>• Validates translation completeness</li>
              <li>• Creates autocomplete definitions</li>
              <li>• Checks for missing keys</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Performance Benefits
              </h3>
            </div>
            <p className="text-gray-300">Load only what you need:</p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>• Code-split translations with features</li>
              <li>• Lazy load language packs</li>
              <li>• Tree-shake unused translations</li>
              <li>• Minimal bundle size</li>
              <li>• Fast initial page loads</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">
            Universal Translation System
          </h2>
          <p className="text-gray-300 mb-6">
            One translation system that works everywhere - server components,
            client components, API routes, CLI commands, and React Native apps.
            Write once, use anywhere.
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl mb-2">🖥️</div>
              <div className="text-white font-medium">Server</div>
              <div className="text-gray-400 text-sm">SSR & API routes</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-white font-medium">Client</div>
              <div className="text-gray-400 text-sm">React components</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-white font-medium">Native</div>
              <div className="text-gray-400 text-sm">iOS & Android</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-2xl mb-2">💻</div>
              <div className="text-white font-medium">CLI</div>
              <div className="text-gray-400 text-sm">Terminal commands</div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Translations That Scale
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          From a single-language prototype to a global application supporting
          dozens of locales, Vibe's i18n system grows with you without
          architectural changes.
        </p>
        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm inline-block">
          <div className="text-green-400">
            // Just add a new language folder
          </div>
          <div className="text-gray-400">
            i18n/ja/api.ts // 🇯🇵 Japanese support added!
          </div>
        </div>
      </section>
    </main>
  );
}
