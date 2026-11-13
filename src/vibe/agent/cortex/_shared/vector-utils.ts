/**
 * Vector helpers shared by the cortex search paths. PGlite has no pgvector
 * `<=>` operator (the embedding column is plain text there), so local
 * instances score in JS with the same math.
 */

/** Cosine similarity — `1 - cosineDistance`, i.e. exactly what pgvector's `<=>` operator inverts. */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
