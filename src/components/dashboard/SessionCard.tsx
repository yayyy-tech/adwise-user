import { Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

interface SessionCardProps {
  advisorName: string;
  credential: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  canJoin?: boolean;
}

export function SessionCard({ advisorName, credential, date, time, duration, type, canJoin }: SessionCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-[16px] bg-dark-surface px-6 py-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10">
        <Calendar className="h-5 w-5 text-teal" />
      </div>
      <div className="flex-1">
        <p className="font-body text-[15px] font-medium text-white">
          Session with {advisorName}, {credential}
        </p>
        <p className="mt-0.5 font-body text-[13px] text-dark-muted">
          {date} &middot; {time} &middot; {duration} &middot; {type}
        </p>
      </div>
      <Button variant="teal" size="sm" disabled={!canJoin} className={!canJoin ? 'opacity-50' : ''}>
        Join
      </Button>
    </div>
  );
}
