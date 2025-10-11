/**
 * Persona Configuration
 * Centralized persona definitions for consistent behavior across the application
 */

export interface Persona {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
}

/**
 * Default personas available in the application
 */
export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clear, concise, and business-focused",
    icon: "💼",
    systemPrompt: "You are a professional assistant. Provide clear, concise, and business-focused responses."
  },
  {
    id: "creative",
    name: "Creative",
    description: "Imaginative and expressive",
    icon: "🎨",
    systemPrompt: "You are a creative assistant. Provide imaginative, expressive, and innovative responses."
  },
  {
    id: "technical",
    name: "Technical",
    description: "Detailed and precise technical explanations",
    icon: "⚙️",
    systemPrompt: "You are a technical assistant. Provide detailed, precise, and technically accurate responses with code examples when relevant."
  },
  {
    id: "friendly",
    name: "Friendly",
    description: "Warm and conversational",
    icon: "😊",
    systemPrompt: "You are a friendly assistant. Provide warm, conversational, and approachable responses."
  },
  {
    id: "concise",
    name: "Concise",
    description: "Brief and to the point",
    icon: "⚡",
    systemPrompt: "You are a concise assistant. Provide brief, direct, and to-the-point responses without unnecessary elaboration."
  },
  {
    id: "teacher",
    name: "Teacher",
    description: "Educational and explanatory",
    icon: "📚",
    systemPrompt: "You are a teaching assistant. Provide educational, explanatory responses that help users understand concepts step by step."
  },
  {
    id: "default",
    name: "Default",
    description: "Balanced and neutral",
    icon: "🤖",
    systemPrompt: ""
  }
];

/**
 * Get persona details by ID
 */
export function getPersonaById(id: string): Persona {
  const persona = DEFAULT_PERSONAS.find(p => p.id === id);
  return persona || DEFAULT_PERSONAS.find(p => p.id === "default")!;
}

/**
 * Get persona display name by ID
 */
export function getPersonaName(id: string): string {
  return getPersonaById(id).name;
}

/**
 * Get persona system prompt by ID
 */
export function getPersonaSystemPrompt(id: string): string {
  return getPersonaById(id).systemPrompt;
}

