'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CallRequest, Status } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Ticket, Filter } from 'lucide-react';
import { AddCallDialog } from '@/components/add-call-dialog';
import { CallsTable } from '@/components/calls-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const initialCallsData: Omit<CallRequest, 'createdAt'>[] = [
  {
    id: '1',
    customer: 'alice@example.com',
    request: 'My computer is making a strange noise and I cannot seem to find the source. It is a high-pitched whine that occurs every few minutes.',
    status: 'Closed',
  },
  {
    id: '2',
    customer: 'bob@example.com',
    request: 'I am unable to connect to the new network printer.',
    status: 'In Progress',
  },
  {
    id: '3',
    customer: 'charlie@example.com',
    request: 'Requesting access to the shared drive for the Q4 marketing campaign. The folder is called "Marketing_Q4_2023".',
    status: 'Open',
  },
  {
    id: '4',
    customer: 'diana@example.com',
    request: 'The CRM software is crashing every time I try to export a report.',
    status: 'On Hold',
  },
];

const initialDates = {
  '1': new Date('2023-10-27T10:00:00Z'),
  '2': new Date('2023-10-28T11:30:00Z'),
  '4': new Date('2023-10-26T09:00:00Z'),
};

export default function Home() {
  const router = useRouter();
  const [calls, setCalls] = useState<CallRequest[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<Record<Status, boolean>>({
    'Open': true,
    'In Progress': true,
    'On Hold': true,
    'Closed': true,
  });

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    if (!isAuthenticated) {
      router.push('/login');
    }

    const callsWithDates: CallRequest[] = initialCallsData.map(call => ({
      ...call,
      createdAt: (initialDates as Record<string,Date>)[call.id] ?? new Date(),
    }));
    setCalls(callsWithDates);
  }, [router]);

  const addCall = (newCall: Omit<CallRequest, 'id' | 'createdAt' | 'status'>) => {
    setCalls(prevCalls => [
      {
        ...newCall,
        id: (prevCalls.length + 1).toString(),
        createdAt: new Date(),
        status: 'Open',
      },
      ...prevCalls,
    ]);
  };

  const deleteCall = (callId: string) => {
    setCalls(prevCalls => prevCalls.filter(call => call.id !== callId));
  };

  const handleStatusChange = (callId: string, newStatus: CallRequest['status']) => {
    setCalls(prevCalls =>
      prevCalls.map(call =>
        call.id === callId ? { ...call, status: newStatus } : call
      )
    );
  };

  const handleFilterChange = (status: Status, checked: boolean) => {
    setStatusFilters(prev => ({...prev, [status]: checked}));
  }

  const filteredCalls = calls.filter(call => statusFilters[call.status]);

  return (
    <div className="min-h-screen w-full">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ticket className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Call Desk</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(statusFilters) as Status[]).map(status => (
                    <DropdownMenuCheckboxItem
                        key={status}
                        checked={statusFilters[status]}
                        onCheckedChange={(checked) => handleFilterChange(status, !!checked)}
                    >
                        {status}
                    </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Call
            </Button>
          </div>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Current Call Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <CallsTable calls={filteredCalls} onStatusChange={handleStatusChange} onDeleteCall={deleteCall} />
          </CardContent>
        </Card>
      </main>

      <AddCallDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddCall={addCall}
      />
    </div>
  );
}
