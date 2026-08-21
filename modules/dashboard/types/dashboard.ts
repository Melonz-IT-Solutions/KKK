// modules/dashboard/types/chart.ts

export interface MonthlyMemberData {
  month: string
  members: number
}

export interface RecentMember {
  id: number
  fullName: string
  address: string
}

export interface DashboardCard {
  label: string
  value: string
  icon: string
  href: string
}

export interface DashboardChartItem {
  month: string
  members: number
}

export interface DashboardData {
  cards: DashboardCard[]
  recentMembers: RecentMember[]
  chartData: DashboardChartItem[]
}
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
