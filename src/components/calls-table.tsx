import { useState } from 'react';
import type { CallRequest, Status } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from './status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type CallsTableProps = {
  calls: CallRequest[];
  onStatusChange: (callId: string, newStatus: Status) => void;
  onDeleteCall: (callId: string) => void;
};

export function CallsTable({ calls, onStatusChange, onDeleteCall }: CallsTableProps) {
  const [callToDelete, setCallToDelete] = useState<CallRequest | null>(null);

  if (calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-12 text-center">
        <h3 className="text-xl font-medium">No calls yet!</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Click "New Call" to add the first request.
        </p>
      </div>
    );
  }
  
  const handleDelete = () => {
    if (callToDelete) {
      onDeleteCall(callToDelete.id);
      setCallToDelete(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Customer</TableHead>
              <TableHead>Request</TableHead>
              <TableHead className="w-[150px]">Opened</TableHead>
              <TableHead className="w-[150px] text-center">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://placehold.co/40x40.png`} alt={call.customer} data-ai-hint="person" />
                      <AvatarFallback>{call.customer.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{call.customer}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <p className="truncate max-w-sm">{call.request}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-md">{call.request}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                    {formatDistanceToNow(call.createdAt, { addSuffix: true })}
                </TableCell>
                <TableCell className="text-center">
                  <Select
                    value={call.status}
                    onValueChange={(newStatus: Status) => onStatusChange(call.id, newStatus)}
                  >
                    <SelectTrigger className="w-[130px] mx-auto focus:ring-0 focus:ring-offset-0 border-0 shadow-none bg-transparent">
                      <SelectValue asChild>
                        <StatusBadge status={call.status} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Open"><StatusBadge status="Open" /></SelectItem>
                        <SelectItem value="In Progress"><StatusBadge status="In Progress" /></SelectItem>
                        <SelectItem value="On Hold"><StatusBadge status="On Hold" /></SelectItem>
                        <SelectItem value="Closed"><StatusBadge status="Closed" /></SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setCallToDelete(call)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Call</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!callToDelete} onOpenChange={() => setCallToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the call request from
              customer "{callToDelete?.customer}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
