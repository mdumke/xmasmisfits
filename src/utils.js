/*
 * Various helper functions
 *
 */

export const allowOpen = doorLabel => {
  const now = new Date()
  const year = now.getFullYear()
  if (year > 2025) return true

  // TODO: disable November doors in production
  const month = now.getMonth() + 1
  if (month === 11) return true

  const maxDay = now.getDate()
  const day = parseInt(doorLabel, 10)

  return !isNaN(day) && day <= maxDay
}
