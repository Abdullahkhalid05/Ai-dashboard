import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FolderOpen, CheckSquare, UserCircle } from 'lucide-react'

export default async function DashboardPage() {
  const clientCount = await prisma.client.count()
  const userCount = await prisma.user.count()
  const projectCount = await prisma.project.count()
  const taskCount = await prisma.task.count()

  const stats = [
    { 
      label: 'Total Users', 
      value: userCount, 
      icon: UserCircle,
      description: 'Registered accounts',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Total Clients', 
      value: clientCount, 
      icon: Users,
      description: 'Active clients',
      color: 'text-violet-500',
      bg: 'bg-violet-500/10'
    },
    { 
      label: 'Total Projects', 
      value: projectCount, 
      icon: FolderOpen,
      description: 'Ongoing projects',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    { 
      label: 'Total Tasks', 
      value: taskCount, 
      icon: CheckSquare,
      description: 'Tasks created',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome to your dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bg}`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}