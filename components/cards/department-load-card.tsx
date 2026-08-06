import { departmentLoad } from '@/lib/data/dashboardv2'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function DepartmentLoadCard() {
  const Icon = departmentLoad.icon

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h3>{departmentLoad.label}</h3>
        <Icon className="size-4" />
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold">{departmentLoad.percent}%</div>

        <div className="bg-muted mt-6 h-2 rounded-full">
          <div
            className="bg-primary h-2 rounded-full"
            style={{
              width: `${departmentLoad.percent}%`,
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
