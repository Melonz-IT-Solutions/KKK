import DashboardCard from '@/components/cards/dashboard-card';
import Recentmember from '@/components/activelog/recentmember-table';
import { activeLogs } from '@/lib/data/activelog';
import DepartmentLoadCard from '@/components/cards/departmentload-card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Cards */}
      <DashboardCard />

      {/* Bottom Section */}
      <div className="">
        <div className="lg:col-span-3 min-w-0">
          <Recentmember data={activeLogs} />
        </div>

        <div className="lg:col-span-2 min-w-0">
          <DepartmentLoadCard />
        </div>
      </div>
    </div>
  );
}
