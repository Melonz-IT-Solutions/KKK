export interface DashboardActivityLog {
  id: number
  type: string
  title: string
  description: string
  subjectName: string
  actorName: string
  actionLabel: string
  createdAt: string
  memberId: number | null
  staffId: number | null
}
