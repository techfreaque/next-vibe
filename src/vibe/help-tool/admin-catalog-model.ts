import type { EndpointMeta } from "../core/definition/endpoints-meta";
import type { CountryLanguage } from "../core/i18n/core/config";
import { getAdminToolRole } from "./admin-classification";
import type {
  AdminGroup,
  CategoryDefinitionSerialized,
} from "./category-types";
import { localizedLabel } from "./localized-label";

export function buildAdminCatalogDestinations(
  webCatalog: readonly EndpointMeta[],
  visibleTools?: ReadonlySet<string>,
): Record<string, { category: string; subCategory?: string; title?: string }> {
  return Object.fromEntries(
    webCatalog.flatMap((tool) => {
      const canonical =
        tool.aliases[0] ?? [...tool.path, tool.method].join("/");
      return [
        tool.toolName,
        ...tool.aliases,
        [...tool.path, tool.method].join("/"),
      ].map((route) => [
        route,
        {
          category: tool.category,
          subCategory: tool.subCategory || undefined,
          // Issue display metadata only for the canonical URL. Hidden tools remain available through authorized deep links.
          title:
            route === canonical &&
            (visibleTools?.has(tool.toolName) ?? !tool.admin?.hidden) &&
            !tool.path.some((segment) => segment.startsWith("["))
              ? tool.titleShort || tool.title
              : undefined,
        },
      ]);
    }),
  );
}

function isUnboundAdminMutation(tool: EndpointMeta): boolean {
  return (
    tool.method === "POST" &&
    tool.category !== "accountSettings" &&
    !tool.path.some((segment) => segment.startsWith("["))
  );
}

function isLandingCreation(tool: EndpointMeta): boolean {
  return isUnboundAdminMutation(tool) && getAdminToolRole(tool) === "create";
}

export function getAdminCategoryLandings(
  categories: readonly CategoryDefinitionSerialized[],
  webCatalog: readonly EndpointMeta[],
  locale: CountryLanguage = "en-US",
): Record<
  string,
  {
    description?: string;
    heading?: string;
    actions: { alias: string; title: string }[];
    contextualActions?: boolean;
    overview?: { alias: string; scope: "platform" | "company" };
    summary?: {
      alias: string;
      scope: "platform" | "company";
      args?: Record<string, string>;
      home?: boolean;
      homeArgs?: Record<string, string>;
      progressive?: boolean;
    };
    destinations: AdminLandingLink[];
    createActions: AdminLandingLink[];
    automations: AdminLandingLink[];
    automationCount: number;
    developerCount: number;
  }
> {
  const workspaceTools = webCatalog.filter(
    (tool) => tool.navigation?.web ?? !tool.admin?.hidden,
  );
  const destinations = new Map(
    workspaceTools.flatMap((tool) =>
      [tool.toolName, ...tool.aliases].map((alias) => [alias, tool] as const),
    ),
  );
  const visibleCategories = new Set(
    workspaceTools.map(({ category }) => category),
  );
  const links = (
    aliases: readonly string[],
    landing?: CategoryDefinitionSerialized["landing"],
  ): AdminLandingLink[] => {
    const seenTools = new Set<EndpointMeta>();
    const seenTitles = new Set<string>();
    return aliases.flatMap((alias) => {
      const tool = destinations.get(alias);
      const title = tool?.titleShort || tool?.title;
      if (!tool || !title || seenTools.has(tool) || seenTitles.has(title)) {
        return [];
      }
      seenTools.add(tool);
      seenTitles.add(title);
      const labels = landing?.destinationDescriptions?.[alias];
      const description = labels && localizedLabel(labels, locale);
      return [description ? { alias, title, description } : { alias, title }];
    });
  };
  const byCategory = new Map(
    categories.map((category) => [category.key, category]),
  );
  function allowedReport<T extends { alias: string }>(
    request: T | undefined,
  ): T | undefined {
    const tool = request && destinations.get(request.alias);
    return tool?.method === "GET" &&
      !tool.path.some((segment) => segment.startsWith("["))
      ? request
      : undefined;
  }
  return Object.fromEntries(
    [...visibleCategories].map((key) => {
      const { landing, descriptions, createActions, defaultEntryAlias } =
        byCategory.get(key) ?? {};
      const categoryTools = workspaceTools.filter(
        ({ category }) => category === key,
      );
      const roleLinks = (role: ReturnType<typeof getAdminToolRole>): string[] =>
        categoryTools
          .filter((tool) => getAdminToolRole(tool) === role)
          .map(({ toolName }) => toolName);
      const overview = allowedReport(landing?.overview);
      const summary = allowedReport(landing?.summary);
      const contextualActions = landing?.contextualActions;
      const ownedCreations = links(
        (createActions ?? []).filter((alias) => {
          const tool = destinations.get(alias);
          return !!tool && tool.category === key && isLandingCreation(tool);
        }),
      );
      const actionLinks = links(
        (landing?.actions ?? []).filter((alias) => {
          const tool = destinations.get(alias);
          return (
            !!tool &&
            (isLandingCreation(tool) ||
              (contextualActions &&
                tool.category === key &&
                isUnboundAdminMutation(tool) &&
                getAdminToolRole(tool) === "record"))
          );
        }),
      );
      const actions = contextualActions
        ? actionLinks
        : actionLinks.length
          ? actionLinks.slice(0, 3)
          : ownedCreations.slice(0, 1);
      const embeddedSummary = summary && destinations.get(summary.alias);
      const description = descriptions && localizedLabel(descriptions, locale);
      const reportLinks =
        summary && overview && summary.alias !== overview.alias
          ? [overview.alias]
          : [];
      const isDestination = (alias: string): boolean => {
        const tool = destinations.get(alias);
        return (
          !!tool &&
          tool !== embeddedSummary &&
          tool.method === "GET" &&
          getAdminToolRole(tool) === "destination"
        );
      };
      const declaredDestinations = [
        ...reportLinks,
        ...(landing?.destinations ?? []),
        ...(landing?.actions ?? []),
      ].filter(isDestination);
      // A curated landing shows exactly its declared shortcuts. Undeclared
      // categories fall back to their first six destination tools.
      const scopedDestinations = landing?.destinations?.length
        ? links(declaredDestinations, landing)
        : links(
            [
              ...declaredDestinations,
              ...(defaultEntryAlias && isDestination(defaultEntryAlias)
                ? [defaultEntryAlias]
                : []),
              ...roleLinks("destination").filter(isDestination),
            ],
            landing,
          ).slice(0, 6);
      const automations = roleLinks("automation");
      return [
        key,
        {
          actions,
          contextualActions,
          overview,
          summary,
          description,
          heading: landing?.heading && localizedLabel(landing.heading, locale),
          destinations: scopedDestinations,
          createActions: ownedCreations,
          automations: links(automations.slice(0, 12)),
          automationCount: automations.length,
          developerCount: roleLinks("developer").length,
        },
      ];
    }),
  );
}

interface AdminLandingLink {
  alias: string;
  title: string;
  description?: string;
}

export function humanCategoryName(value: string): string {
  const label = value
    .replaceAll(/([a-z\d])([A-Z])/g, "$1 $2")
    .replaceAll(/[-_]+/g, " ")
    .trim();
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function groupVisibleCategories(
  summaries: readonly { name: string; count: number }[],
  registry: ReadonlyMap<string, CategoryDefinitionSerialized>,
  order: readonly AdminGroup[],
  locale: CountryLanguage,
): {
  group: AdminGroup | undefined;
  categories: {
    name: string;
    label: string;
    count: number;
    metadata: CategoryDefinitionSerialized | undefined;
  }[];
}[] {
  const groups = new Map<
    AdminGroup | undefined,
    {
      name: string;
      label: string;
      count: number;
      metadata: CategoryDefinitionSerialized | undefined;
    }[]
  >();
  for (const { name, count } of summaries) {
    if (count <= 0) {
      continue;
    }
    const metadata = registry.get(name);
    const label = metadata
      ? (localizedLabel(metadata.labels, locale) ?? metadata.label)
      : humanCategoryName(name);
    const group =
      metadata?.group === "comms"
        ? "analytics"
        : metadata?.group === "platform"
          ? "system"
          : metadata?.group;
    const categories = groups.get(group) ?? [];
    categories.push({ name, label, count, metadata });
    groups.set(group, categories);
  }
  return [...new Set([...order, ...groups.keys()])].flatMap((group) => {
    const categories = groups.get(group);
    if (!categories?.length) {
      return [];
    }
    return [
      {
        group,
        categories: categories.toSorted(
          (a, b) =>
            (a.metadata?.order ?? Infinity) - (b.metadata?.order ?? Infinity) ||
            a.label.localeCompare(b.label, locale),
        ),
      },
    ];
  });
}

export function recentToolIds(
  current: readonly string[],
  opened: string,
): string[] {
  return [opened, ...current.filter((id) => id !== opened)].slice(0, 8);
}

export function orderSubcategories(
  subcategories: readonly { name: string; count: number }[],
  metadata: CategoryDefinitionSerialized | undefined,
  locale: CountryLanguage,
): { name: string; count: number; label: string }[] {
  return subcategories
    .filter(({ name, count }) => name.trim() && count > 0)
    .map((entry) => {
      const section = metadata?.subcategories?.[entry.name];
      return {
        ...entry,
        label: section
          ? (localizedLabel(section.labels, locale) ?? section.label)
          : humanCategoryName(entry.name),
      };
    })
    .toSorted(
      (a, b) =>
        (metadata?.subcategories?.[a.name]?.order ?? Infinity) -
          (metadata?.subcategories?.[b.name]?.order ?? Infinity) ||
        a.label.localeCompare(b.label, locale),
    );
}
