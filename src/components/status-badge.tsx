import type { Status } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyles: Record<Status, string> = {
    Open: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    'In Progress': 'bg-status-progress hover:bg-status-progress/90 text-status-progress-foreground',
    'On Hold': 'bg-muted hover:bg-muted/90 text-muted-foreground',
    Closed: 'bg-status-closed hover:bg-status-closed/90 text-status-closed-foreground',
  };

  return (
    <Badge className={cn(statusStyles[status], 'border-transparent capitalize', className)}>
      {status}
    </Badge>
  );
}
