/**
 * Personas Repository
 * Database operations for custom personas
 */

import { and, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { DEFAULT_PERSONAS, type Persona } from "./config";
import { type CustomPersona, customPersonas, type NewCustomPersona } from "./db";

/**
 * Get all personas for a user (default + custom)
 */
export async function getAllPersonas(userId: string): Promise<Persona[]> {
  const customPersonasList = await db
    .select()
    .from(customPersonas)
    .where(eq(customPersonas.userId, userId));

  // CustomPersona now has the same structure as Persona
  const customPersonasFormatted = customPersonasList as Persona[];

  return [...DEFAULT_PERSONAS, ...customPersonasFormatted];
}

/**
 * Get a single persona by ID (checks both default and custom)
 */
export async function getPersonaById(
  personaId: string,
  userId?: string,
): Promise<Persona | null> {
  const defaultPersona = DEFAULT_PERSONAS.find((p) => p.id === personaId);
  if (defaultPersona) {
    return defaultPersona;
  }

  if (!userId) {
    return null;
  }

  const [customPersona] = await db
    .select()
    .from(customPersonas)
    .where(
      and(eq(customPersonas.id, personaId), eq(customPersonas.userId, userId)),
    )
    .limit(1);

  if (!customPersona) {
    return null;
  }

  // CustomPersona now has the same structure as Persona
  return customPersona as Persona;
}

/**
 * Create a new custom persona
 */
export async function createCustomPersona(
  data: Omit<NewCustomPersona, "id" | "createdAt" | "updatedAt">,
): Promise<CustomPersona> {
  const [persona] = await db
    .insert(customPersonas)
    .values(data as typeof customPersonas.$inferInsert)
    .returning();

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

  // CustomPersona now has the same structure as Persona
  return customPersonasList as Persona[];
}
