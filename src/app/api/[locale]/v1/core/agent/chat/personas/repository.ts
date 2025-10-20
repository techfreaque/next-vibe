/**
 * Personas Repository
 * Database operations for custom personas
 */

import { and, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/v1/core/system/db";

import { DEFAULT_PERSONAS, type Persona } from "./config";
import {
  type CustomPersona,
  customPersonas,
  type NewCustomPersona,
} from "./db";

/**
 * Get all personas for a user (default + custom)
 */
export async function getAllPersonas(userId: string): Promise<Persona[]> {
  // Get custom personas from database
  const customPersonasList = await db
    .select()
    .from(customPersonas)
    .where(eq(customPersonas.userId, userId));

  // Convert custom personas to Persona format
  const customPersonasFormatted: Persona[] = customPersonasList.map((cp) => ({
    id: cp.id,
    name: cp.name,
    description: cp.description,
    icon: cp.icon,
    systemPrompt: cp.systemPrompt,
    category: cp.category,
    source: "my" as const,
    preferredModel: cp.preferredModel ?? undefined,
    suggestedPrompts: cp.suggestedPrompts ?? [],
  }));

  // Merge default personas with custom personas
  return [...DEFAULT_PERSONAS, ...customPersonasFormatted];
}

/**
 * Get a single persona by ID (checks both default and custom)
 */
export async function getPersonaById(
  personaId: string,
  userId?: string,
): Promise<Persona | null> {
  // Check if it's a default persona
  const defaultPersona = DEFAULT_PERSONAS.find((p) => p.id === personaId);
  if (defaultPersona) {
    return defaultPersona;
  }

  // Check if it's a custom persona (UUID)
  if (!userId) {
    return null;
  }

  const customPersona = await db.query.customPersonas.findFirst({
    where: and(
      eq(customPersonas.id, personaId),
      eq(customPersonas.userId, userId),
    ),
  });

  if (!customPersona) {
    return null;
  }

  // Convert to Persona format
  return {
    id: customPersona.id,
    name: customPersona.name,
    description: customPersona.description,
    icon: customPersona.icon,
    systemPrompt: customPersona.systemPrompt,
    category: customPersona.category,
    source: "my" as const,
    preferredModel: customPersona.preferredModel ?? undefined,
    suggestedPrompts: customPersona.suggestedPrompts ?? [],
  };
}

/**
 * Create a new custom persona
 */
export async function createCustomPersona(
  data: Omit<NewCustomPersona, "id" | "createdAt" | "updatedAt" | "source">,
): Promise<CustomPersona> {
  // @ts-ignore - Drizzle type inference issue with Omit type
  const [persona] = await db.insert(customPersonas).values(data).returning();

  return persona;
}

/**
 * Update a custom persona
 */
export async function updateCustomPersona(
  personaId: string,
  userId: string,
  data: Partial<
    Omit<NewCustomPersona, "id" | "userId" | "createdAt" | "updatedAt">
  >,
): Promise<CustomPersona | null> {
  // Filter out undefined values
  const updateValues = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );

  const [updated] = await db
    .update(customPersonas)
    .set({
      ...updateValues,
      updatedAt: new Date(),
    })
    .where(
      and(eq(customPersonas.id, personaId), eq(customPersonas.userId, userId)),
    )
    .returning();

  return updated || null;
}

/**
 * Delete a custom persona
 */
export async function deleteCustomPersona(
  personaId: string,
  userId: string,
): Promise<boolean> {
  const result = await db
    .delete(customPersonas)
    .where(
      and(eq(customPersonas.id, personaId), eq(customPersonas.userId, userId)),
    )
    .returning();

  return result.length > 0;
}

/**
 * Get default personas only
 */
export function getDefaultPersonas(): Persona[] {
  return [...DEFAULT_PERSONAS];
}

/**
 * Get custom personas only
 */
export async function getCustomPersonas(userId: string): Promise<Persona[]> {
  const customPersonasList = await db
    .select()
    .from(customPersonas)
    .where(eq(customPersonas.userId, userId));

  return customPersonasList.map((cp) => ({
    id: cp.id,
    name: cp.name,
    description: cp.description,
    icon: cp.icon,
    systemPrompt: cp.systemPrompt,
    category: cp.category,
    source: "my" as const,
    preferredModel: cp.preferredModel ?? undefined,
    suggestedPrompts: cp.suggestedPrompts ?? [],
  }));
}
