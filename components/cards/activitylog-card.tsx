import { Card, CardContent } from '@/components/ui/card';

import ActiveLogHeader from '@/components/headers/page-header';
import ActivityLogItem from '@/modules/activity-log/components/activelog-items';
import Button from '@/components/button';

export default function ActivityLogCard() {
  return (
    <Card>
      <div className="pl-4">
        <ActiveLogHeader title="Activity Logs" />
      </div>
      <CardContent className="space-y-5 pt-5 flex h-full flex-col ">
        <ActivityLogItem />

        <Button
          variant="link"
          className="mt-auto w-full justify-center bg-amber-50 text-[#2E6F40] hover:bg-amber-100 hover:text-[#2E6F40]">
          View all activities
        </Button>
      </CardContent>
    </Card>
  );
}
