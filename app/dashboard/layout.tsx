
  import {SideBar} from './sidebar'

  export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
    <div className="flex h-screen">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b px-6 py-4">
            <h2 className="text-sm font-medium text-muted-foreground">Welcome back</h2>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    )
  }