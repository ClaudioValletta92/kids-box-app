/**
 * Formats an age range as a display string.
 * e.g. formatAgeRange(0, 6) → "0–6 months"
 */
export function formatAgeRange(min: number, max: number): string {
  return `${min}–${max} months`
}

/**
 * Returns the best-matching box for the given age in months.
 *
 * Exact match: child's age falls within [age_min_months, age_max_months].
 * When multiple boxes match (shared boundary months), the one with the
 * higher age_min is preferred — i.e. the more developmentally advanced box.
 *
 * No match: returns the box whose nearest boundary is closest to the
 * child's age (handles children younger or older than all boxes).
 */
export function getRecommendedBox<
  T extends { age_min_months: number; age_max_months: number },
>(ageMonths: number, boxes: T[]): T | null {
  if (boxes.length === 0) return null

  const matches = boxes.filter(
    (b) => ageMonths >= b.age_min_months && ageMonths <= b.age_max_months,
  )

  if (matches.length > 0) {
    return matches.reduce((best, b) =>
      b.age_min_months > best.age_min_months ? b : best,
    )
  }

  // Fallback: nearest box by closest range boundary.
  return boxes.reduce((nearest, b) => {
    const dist = (box: T) =>
      Math.min(
        Math.abs(ageMonths - box.age_min_months),
        Math.abs(ageMonths - box.age_max_months),
      )
    return dist(b) < dist(nearest) ? b : nearest
  })
}
