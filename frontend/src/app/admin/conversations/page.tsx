'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, User, Bot, ExternalLink } from 'lucide-react';

const mockConversations = [
  {
    id: '1',
    user: 'Guest #4829',
    email: 'guest@example.com',
    status: 'active',
    lastMessage: 'How do I reset my password?',
    time: '2m ago',
    messages: 12,
  },
  {
    id: '2',
    user: 'Sarah Smith',
    email: 'sarah@comp.any',
    status: 'completed',
    lastMessage: 'Thank you for your help!',
    time: '1h ago',
    messages: 8,
  },
  {
    id: '3',
    user: 'Mike Johnson',
    email: 'mike.j@gmail.com',
    status: 'transferred',
    lastMessage: 'Connecting you to a human agent...',
    time: '3h ago',
    messages: 15,
  },
];

export default function ConversationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conversation Center</h1>
          <p className="text-muted-foreground">
            Manage and monitor live and historical chat sessions.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockConversations.map((chat) => (
                <TableRow key={chat.id}>
                  <TableCell>
                    <div className="font-medium">{chat.user}</div>
                    <div className="text-xs text-muted-foreground">{chat.email}</div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {chat.lastMessage}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        chat.status === 'active'
                          ? 'default'
                          : chat.status === 'completed'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {chat.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{chat.messages}</TableCell>
                  <TableCell>{chat.time}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
