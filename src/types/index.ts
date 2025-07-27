export type Status = 'Open' | 'In Progress' | 'On Hold' | 'Closed';

export interface CallRequest {
  id: string;
  customer: string;
  request: string;
  status: Status;
  createdAt: Date;
}
