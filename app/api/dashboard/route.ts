import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      memberCount,
      staffCount,
      activeStaffCount,
      inactiveStaffCount,
      recentMembers,
      allMembers,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.staff.count(),
      prisma.staff.count({ where: { active: true } }),
      prisma.staff.count({ where: { active: false } }),
      prisma.member.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
      prisma.member.findMany({ select: { createdAt: true } }),
    ])

    // Group members by month client-side, since createdAt timestamps are
    // unique per record and groupBy(['createdAt']) would not actually
    // bucket them by month.
    const monthCounts = new Map<string, number>()
    for (const { createdAt } of allMembers) {
      const key = new Date(createdAt).toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      })
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1)
    }

    const chartData = Array.from(monthCounts.entries())
      .map(([month, members]) => ({ month, members }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    return NextResponse.json({
      cards: [
        {
          label: 'Total Members',
          value: memberCount.toString(),
          icon: 'Users',
          href: '/members',
        },
        {
          label: 'Total Staff',
          value: staffCount.toString(),
          icon: 'Users',
          href: '/staff',
        },
        {
          label: 'Active Staff',
          value: activeStaffCount.toString(),
          icon: 'UserRoundCheck',
          href: '/staff?status=active',
        },
        {
          label: 'Inactive Staff',
          value: inactiveStaffCount.toString(),
          icon: 'UserRoundX',
          href: '/staff?status=inactive',
        },
      ],
      recentMembers: recentMembers.map(member => ({
        id: member.id,
        name: member.name,
        address: member.address,
      })),
      chartData,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to load dashboard data' }, { status: 500 })
  }
}
