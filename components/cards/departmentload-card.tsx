import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Progress } from '@/components/ui/progress'
import {
  SquareChartGantt,
  SquareArrowOutUpRight,
} from 'lucide-react'

const departments = [
  {
    name: 'FINANCE',
    percentage: 42,
  },
  {
    name: 'ENGINEERING',
    percentage: 58,
  },
]

export default function DepartmentLoadCard() {
  return (
    <Card className="h-full w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Department Load
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {departments.map((dept, index) => (
          <div key={index} className="space-y-2">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {dept.percentage}%
                </p>

                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  {dept.name}
                </p>
              </div>

              <div className="text-muted-foreground">
                {index === 0 ? (
                  <SquareChartGantt className="h-4 w-4" />
                ) : (
                  <SquareArrowOutUpRight className="h-4 w-4" />
                )}
              </div>
            </div>

            <Progress
              value={dept.percentage}
              className="h-2 [&>div]:bg-green-700"
            />
          </div>
        ))}
      </CardContent>

    </Card>
  )
}