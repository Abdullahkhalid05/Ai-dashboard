'use client'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { LayoutDashboard, Users, FolderOpen, CheckSquare, LogOut } from 'lucide-react'

export  function SideBar() {
    const navItems = [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Clients', href: '/dashboard/clients', icon: Users },
      { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
      { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    ]
    const handleLogout = ()=>{
        signOut({callbackUrl: '/login'})
    }
  return (
   <div className="flex h-screen">
      <aside className="w-64 border-r flex flex-col p-4 gap-2">
        <h1 className="text-xl font-bold mb-6">AI Dashboard</h1>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm font-medium"
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
        <div className="mt-auto hover:bg-accent" >
          <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm font-medium w-full text-red-500"
            onClick={handleLogout}
          >
            <LogOut size={18}  />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}

