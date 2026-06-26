import DataTableCards from '@/components/cards/datatable-card';
import ActiveLogTable from '@/components/activelog/recentmember-table';
import { activeLogs } from '@/lib/data/activelog';
import DepartmentLoadCard from '@/components/cards/departmentload-card';
import Button from '@/components/button';

import { Calendar, Download } from 'lucide-react';

const page = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className=" space-y-6 p-6 flex justify-between  ">
        <div>
          <h1 className="text-3xl font-semibold ">Workspace OverView</h1>
          <p className="text-sm text-muted-foreground ">
            Welcome back,super Admin. Here is what is happening across KKK
            Workspace today.
          </p>
        </div>
        <div className="whitespace-break-spaces flex gap-4">
          <Button className="bg-color-white border-black text-black ">
            <Calendar />
            Last 30 days
          </Button>
          <Button>
            <Download />
            Export Report
          </Button>
        </div>
      </div>

      <div className="@container/main  ">
        <div className="">
          <DataTableCards />
        </div>
      </div>
      <div className="p-6 md:grid-cols-[1200px_1fr] grid gap-6 ">
        {/* Left: Table */}
        <div className="w-full lg:flex-1 min-w-0">
          <ActiveLogTable data={activeLogs} />
        </div>

        {/* Right: Card */}
        <div className="md:grid-cols-[300px_1fr] grid ">
          <DepartmentLoadCard />
        </div>
      </div>
    </div>
  );
};

export default page;
