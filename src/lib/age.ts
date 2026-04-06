/**
 * Returns the number of complete months elapsed since the given birth date.
 * Parses the date as a local date (YYYY-MM-DD) to avoid UTC offset issues.
 */
export function ageInMonths(birthDate: string): number {
  const [y, m, d] = birthDate.split('-').map(Number)
  const birth = new Date(y, m - 1, d)
  const now = new Date()

  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())

  if (now.getDate() < birth.getDate()) months -= 1

  return Math.max(0, months)
}

/**
 * Formats a month count as a human-readable age string.
 * e.g. 7 → "7 months", 14 → "1 year 2 months"
 */
export function formatAge(months: number): string {
  if (months < 12) return `${months} month${months === 1 ? '' : 's'}`
  const years = Math.floor(months / 12)
  const rem = months % 12
  const y = `${years} year${years === 1 ? '' : 's'}`
  return rem === 0 ? y : `${y} ${rem} month${rem === 1 ? '' : 's'}`
}

/**
 * Formats a YYYY-MM-DD date string for display without UTC-offset drift.
 */
export function formatBirthDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
