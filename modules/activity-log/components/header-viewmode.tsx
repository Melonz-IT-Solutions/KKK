import { Table2, Timeline } from 'lucide-react'
import { ActivityViewMode } from '@/types/activelog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ActivityLogsHeaderProps {
  onViewChange: (view: ActivityViewMode) => void
  tab: ActivityViewMode
  setTab: (tab: 'timeline' | 'table') => void
}

export function ActivityLogsHeader({ tab, setTab }: ActivityLogsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Activity Logs</h1>
        {/* <p className="text-muted-foreground mt-1 text-sm">
          Track all activities of the entire application.
        </p> */}
      </div>

      <div className="flex gap-2">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Tabs
            value={tab}
            onValueChange={value => setTab(value as 'timeline' | 'table')}
            className="p-4"
          >
            <TabsList className="flex w-full justify-center rounded-sm">
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-primary rounded-sm data-[state=active]:text-white"
              >
                Timeline View
                <Timeline className="mr-1.5 size-4" />
              </TabsTrigger>

              <TabsTrigger
                value="table"
                className="data-[state=active]:bg-primary rounded-sm data-[state=active]:text-white"
              >
                Table View
                <Table2 className="mr-1.5 size-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
