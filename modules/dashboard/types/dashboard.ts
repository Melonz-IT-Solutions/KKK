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

export interface DashboardData {
  cards: DashboardCard[]
  recentMembers: RecentMember[]
  chartData: MonthlyMemberData[]
}
