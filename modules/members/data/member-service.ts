export interface ImportMembersResult {
  importedCount: number
}

export async function importMembers(file: File): Promise<ImportMembersResult> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/members/import', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.message ?? 'Failed to import members.')
  }

  return res.json()
}
