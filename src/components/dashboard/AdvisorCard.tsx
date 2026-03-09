import type { AdvisorProfile } from '../../lib/matching';
import { Button } from '../ui/Button';

interface AdvisorCardProps {
  advisor: AdvisorProfile;
  compact?: boolean;
}

export function AdvisorCard({ advisor, compact }: AdvisorCardProps) {
  if (compact) {
    return (
      <div className="rounded-[16px] bg-dark-surface p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full font-body text-sm font-semibold text-white"
            style={{ backgroundColor: advisor.avatarColor }}
          >
            {advisor.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm font-medium text-white truncate">{advisor.name}</p>
            <p className="font-mono text-[11px] text-dark-muted">{advisor.credentials}</p>
          </div>
        </div>
        <p className="mt-2 font-body text-xs text-dark-muted line-clamp-2">{advisor.bio}</p>
        <p className="mt-2 font-body text-xs text-dark-muted-2">
          {advisor.yearsExperience} yrs &middot; {advisor.city}
        </p>
        <button className="mt-3 font-body text-[13px] text-teal hover:underline">View &rarr;</button>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] bg-dark-surface border-l-[3px] border-l-teal p-6">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full font-body text-base font-semibold text-white"
          style={{ backgroundColor: advisor.avatarColor }}
        >
          {advisor.avatarInitials}
        </div>
        <div>
          <p className="font-body text-base font-medium text-white">{advisor.name}</p>
          <p className="font-mono text-xs text-dark-muted">{advisor.credentials}</p>
        </div>
      </div>
      <p className="mt-3 font-body text-[13px] leading-relaxed text-dark-muted">{advisor.bio}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="teal" size="sm">Book Next Session</Button>
        <Button variant="dark-outline" size="sm">Send Message</Button>
        <Button variant="dark-outline" size="sm">View Profile</Button>
      </div>
    </div>
  );
}
