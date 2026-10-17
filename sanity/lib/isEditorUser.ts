import type { CurrentUser } from '@sanity/types'

/** Simplified Studio for users with the Editor role (not Administrators). */
export function isEditorUser(user: CurrentUser | null | undefined): boolean {
  if (!user?.roles?.length) return false

  const isAdministrator = user.roles.some((role) => role.name === 'administrator')
  if (isAdministrator) return false

  return user.roles.some((role) => role.name === 'editor' || role.name === 'contributor')
}
