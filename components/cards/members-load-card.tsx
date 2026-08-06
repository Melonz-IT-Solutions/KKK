import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SquareChartGantt, SquareArrowOutUpRight } from 'lucide-react';

const departments = [
  {
    name: 'FINANCE',
    percentage: 42,
  },
  {
    name: 'ENGINEERING',
    percentage: 58,
  },
];

export default function DepartmentLoadCard() {
  return (
    <Card className='w-full h-full p-6 '>
      <CardHeader className='pb-5 '>
        <CardTitle className='text-base font-semibold '>
          Department Load
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4 grid gap-6 py-6 '>
        {departments.map((dept, index) => (
          <div key={index} className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-2xl font-bold text-green-700'>
                  {dept.percentage}%
                </p>

                <p className='text-[11px] font-semibold tracking-wide text-muted-foreground'>
                  {dept.name}
                </p>
              </div>

              <div className='  flex h-6 w-6 items-center justify-center rounded-full '>
                {index === 0 ?
                  <SquareChartGantt className='h-5 w-5 text-primary' />
                : <SquareArrowOutUpRight className='h-5 w-5 text-primary' />}
              </div>
            </div>

            <Progress
              value={dept.percentage}
              className='h-4 [&>div]:bg-primary border  '
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
