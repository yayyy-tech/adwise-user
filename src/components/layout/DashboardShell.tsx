import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Calendar, Search, Target, FileText, Settings, MessageSquare, Briefcase, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useUserStore } from '../../store/useUserStore';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: User, label: 'My Advisor', path: '/dashboard' },
  { icon: Calendar, label: 'Sessions', path: '/bookings' },
  { icon: Search, label: 'Find Advisors', path: '/browse-advisors' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Briefcase, label: 'Engagements', path: '/engagements' },
  { icon: ShieldCheck, label: 'KYC & Docs', path: '/kyc' },
  { icon: Target, label: 'My Goals', path: '/dashboard' },
  { icon: FileText, label: 'Documents', path: '/kyc' },
];

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, answers } = useUserStore();
  const firstName = profile?.full_name?.split(' ')[0] || answers.firstName || 'User';
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-dark-base">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-[240px] flex-col border-r border-dark-border bg-dark-base p-6 transition-transform md:relative md:translate-x-0 md:flex',
        mobileOpen ? 'flex translate-x-0' : 'hidden -translate-x-full'
      )}>
        <Logo dark className="mb-8" />
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal font-body text-sm font-semibold text-dark-base">
            {(firstName[0] || 'A').toUpperCase()}
          </div>
          <div>
            <p className="font-body text-sm text-white">{firstName}</p>
            <p className="font-body text-xs text-dark-muted">New Earner plan</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 font-body text-sm transition-colors',
                  active
                    ? 'bg-dark-surface text-white border-l-[3px] border-l-teal'
                    : 'text-dark-muted hover:text-white hover:bg-dark-surface/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button className="flex items-center gap-3 px-3 py-2.5 font-body text-sm text-dark-muted hover:text-white transition-colors">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between border-b border-dark-border bg-dark-base px-4 py-3 md:hidden">
        <button onClick={() => setMobileOpen(true)} className="text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
        <Logo dark />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal font-body text-xs font-semibold text-dark-base">
          {(firstName[0] || 'A').toUpperCase()}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 pt-16 md:pt-10">
        {children}
      </main>
    </div>
  );
}
