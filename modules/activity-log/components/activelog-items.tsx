import { activeLogs } from '@/lib/data/activelog'
import { activityConfig } from '@/lib/configs/activity-config'

export default function ActivityLogItem() {
  return (
    <div className="space-y-5">
      {activeLogs.slice(0, 2).map(log => {
        const Icon = activityConfig[log.action].icon

        return (
          <div key={log.id} className="flex items-start gap-3">
            <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
              <Icon className="size-4 text-green-600" />
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-medium">{log.action}</h4>
              <p className="text-muted-foreground text-xs">{log.description}</p>

              <p className="text-muted-foreground mt-1 text-[10px] uppercase">{log.timestamp}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
