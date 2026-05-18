import { AppSidebar } from '@/components/layout/sidebar/app-sidebar'
import SidebarHeader from '@/components/layout/sidebar/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
