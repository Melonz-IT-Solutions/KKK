import { AppSidebar } from '@/components/layout/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import SidebarHeader from '@/components/layout/sidebar/header'
import DashboardCard from '@/components/cards/dashboard-card'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-0">
              <DashboardCard />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
