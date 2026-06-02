'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  MessageSquare,
  Users,
  MousePointerClick,
  Clock,
  TrendingUp,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Conversations',
    value: '1,284',
    change: '+12.5%',
    icon: MessageSquare,
    color: 'text-blue-600',
  },
  {
    label: 'New Leads',
    value: '156',
    change: '+18.2%',
    icon: Users,
    color: 'text-green-600',
  },
  {
    label: 'Conversion Rate',
    value: '12.1%',
    change: '+4.3%',
    icon: MousePointerClick,
    color: 'text-purple-600',
  },
  {
    label: 'Avg. Response Time',
    value: '1.2s',
    change: '-0.3s',
    icon: Clock,
    color: 'text-orange-600',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your AI assistant today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Conversation Activity</CardTitle>
            <CardDescription>
              Volume of chats handled by AI over the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <TrendingUp size={40} className="opacity-20" />
              <p>Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              The latest customers who shared their contact info.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    JD
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe {i}</p>
                    <p className="text-xs text-muted-foreground">john{i}@example.com</p>
                  </div>
                  <div className="text-xs text-muted-foreground">2h ago</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
