import { unstable_noStore as noStore } from 'next/cache'

import { prisma } from '@/lib/prisma'

import type { MonthlyMemberData } from '@/modules/dashboard/types/chart'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export async function getMembersChartData(): Promise<MonthlyMemberData[]> {
  // Always get the latest data from the database
  noStore()

  const currentYear = new Date().getFullYear()

  const startOfYear = new Date(currentYear, 0, 1)

  const startOfNextYear = new Date(currentYear + 1, 0, 1)

  const members = await prisma.member.findMany({
    where: {
      createdAt: {
        gte: startOfYear,
        lt: startOfNextYear,
      },
      isDeleted: false,
    },

    select: {
      createdAt: true,
    },
  })

  const monthlyCounts = Array(12).fill(0)

  for (const member of members) {
    const month = member.createdAt.getMonth()

    monthlyCounts[month]++
  }

  return MONTHS.map((month, index) => ({
    month,
    members: monthlyCounts[index],
  }))
}
