export function paginate<T>(data: T[], start: number, end: number): T[] {
  return data.slice(start, end)
}
