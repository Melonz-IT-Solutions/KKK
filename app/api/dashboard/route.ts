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
      chartData,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.staff.count(),
      prisma.staff.count({ where: { active: true } }),
      prisma.staff.count({ where: { active: false } }),
      prisma.member.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
      prisma.member.groupBy({
        by: ['createdAt'],
        _count: { id: true },
      }),
    ])

    return NextResponse.json({
      cards: [
        {
          label: 'Total Members',
          value: memberCount.toString(),
          icon: 'Users',
        },
        { label: 'Total Staff', value: staffCount.toString(), icon: 'Users' },
        {
          label: 'Active Staff',
          value: activeStaffCount.toString(),
          icon: 'UserRoundCheck',
        },
        {
          label: 'Inactive Staff',
          value: inactiveStaffCount.toString(),
          icon: 'UserRoundX',
        },
      ],
      recentMembers: recentMembers.map(member => ({
        id: member.id,
        name: member.name,
        address: member.address,
      })),
      chartData: chartData.map(item => ({
        month: new Date(item.createdAt).toLocaleString('en-US', {
          month: 'short',
        }),
        members: item._count.id,
      })),
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to load dashboard data' }, { status: 500 })
  }
}
