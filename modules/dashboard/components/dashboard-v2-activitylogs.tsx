'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export function ActivityLogs() {
  const router = useRouter();
  const [recentMembers, setRecentMembers] = useState<
    { id: number; name: string; address: string }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setRecentMembers(data.recentMembers ?? []);
    };
    void load();
  }, []);

  return (
    <Card className=' shadow-sm'>
      <CardHeader className='pb-2'>
        <h3 className='text-base font-semibold text-foreground'>
          Activity Logs
        </h3>
        <p className='text-sm text-muted-foreground'>
          {recentMembers.length} new activities for today
        </p>
      </CardHeader>

      <CardContent className='flex flex-col gap-4'>
        {recentMembers.map((member) => (
          <div
            key={member.id}
            className='flex items-center justify-between gap-3'
          >
            <div className='flex items-center gap-3 min-w-0'>
              <Avatar className='h-9 w-9 shrink-0 bg-muted'>
                <AvatarFallback className='bg-muted text-muted-foreground'>
                  <User className='h-4 w-4' />
                </AvatarFallback>
              </Avatar>

              <div className='min-w-0'>
                <p className='text-sm font-medium text-foreground truncate'>
                  {member.name}
                </p>
                <p className='text-sm text-muted-foreground truncate'>
                  Added a new member:{' '}
                  <span className='font-medium text-foreground'>
                    {member.name}
                  </span>
                </p>
              </div>
            </div>

            <Button
              variant='link'
              className='shrink-0 h-auto p-0 text-sm text-muted-foreground hover:text-foreground'
              onClick={() => router.push(`/members/${member.id}`)}
            >
              View Details
            </Button>
          </div>
        ))}

        <div className='flex justify-end'>
          <Button
            asChild
            variant='link'
            className='mx-auto h-auto p-0 text-sm text-muted-foreground hover:text-foreground'
          >
            <Link href='/members'>View All</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
