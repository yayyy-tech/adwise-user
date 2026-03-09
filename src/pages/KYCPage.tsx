import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, Check, Clock, Download, ExternalLink } from 'lucide-react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { Button } from '../components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';
import { cn } from '../lib/utils';

export default function KYCPage() {
  const navigate = useNavigate();
  const { user, userProfile } = useUserStore();

  const kycStatus = userProfile?.kyc_status || 'not_started';

  const { data: documents, isLoading } = useQuery({
    queryKey: ['user-documents', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*, engagement:engagements!engagement_id(advisor_id, advisor:profiles!advisor_id(full_name))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const docs = documents ?? [];
  const allSigned = docs.length > 0 && docs.every((d: any) => d.status === 'signed');
  const kycVerified = kycStatus === 'verified';
  const currentStepNum = !kycVerified ? 1 : docs.some((d: any) => d.status !== 'signed') ? 2 : 3;

  const steps = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'Sign Documents' },
    { num: 3, label: 'Done' },
  ];

  return (
    <DashboardShell>
      <div className="max-w-[720px]">
        <h1 className="font-display text-[28px] text-dark-text">Complete Your Onboarding</h1>
        <p className="mt-1 font-body text-sm text-dark-muted mb-8">
          Sign the required documents to fully activate your engagement.
        </p>

        {/* Step progress */}
        <div className="mb-10 flex items-center justify-center gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full font-body text-sm font-semibold transition-colors',
                  step.num < currentStepNum ? 'bg-teal text-dark-base' :
                  step.num === currentStepNum ? 'border-2 border-teal text-teal' :
                  'border border-dark-border text-dark-muted'
                )}>
                  {step.num < currentStepNum ? <Check className="h-4 w-4" /> : step.num}
                </div>
                <span className="mt-1.5 font-body text-[11px] text-dark-muted">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('mx-4 h-px w-16', step.num < currentStepNum ? 'bg-teal' : 'bg-dark-border')} />
              )}
            </div>
          ))}
        </div>

        {/* Section 1: Identity / DigiLocker */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] bg-dark-surface p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-surface-2">
              <Shield className="h-5 w-5 text-teal" />
            </div>
            <div className="flex-1">
              <h3 className="font-body text-base font-semibold text-white">Verify with DigiLocker</h3>
              <p className="mt-1 font-body text-sm text-dark-muted">India&apos;s official digital document wallet. Instantly verify your PAN and Aadhaar.</p>
              {kycVerified ? (
                <div className="mt-3 space-y-1">
                  <p className="flex items-center gap-2 font-body text-sm text-teal"><Check className="h-4 w-4" /> Identity Verified</p>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="flex items-center gap-2 font-body text-xs text-amber-500 mb-3"><Clock className="h-3.5 w-3.5" /> DigiLocker integration coming soon</p>
                  <div className="rounded-[12px] border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="font-body text-sm text-amber-400">
                      KYC verification via DigiLocker is pending partner approval. We&apos;ll notify you once it&apos;s available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Section 2: Documents */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal border-t-transparent" />
          </div>
        ) : docs.length > 0 ? (
          <div className="space-y-3 mb-4">
            <h3 className="font-body text-sm font-semibold text-white mt-6 mb-3">Documents</h3>
            {docs.map((doc: any) => (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[16px] bg-dark-surface p-5">
                <div className="flex items-start gap-4">
                  <FileText className={cn('h-5 w-5 flex-shrink-0 mt-0.5', doc.status === 'signed' ? 'text-teal' : 'text-dark-muted')} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-body text-sm font-medium text-white">{doc.name}</p>
                      {doc.status === 'signed' && <span className="text-teal font-body text-xs font-medium">&#10003; SIGNED</span>}
                      {doc.status === 'sent_pending' && <span className="flex items-center gap-1 text-amber-500 font-body text-xs"><Clock className="h-3 w-3" /> Pending</span>}
                      {doc.status === 'overdue' && <span className="flex items-center gap-1 text-red-400 font-body text-xs"><Clock className="h-3 w-3" /> Overdue</span>}
                      {doc.status === 'not_sent' && <span className="flex items-center gap-1 text-dark-muted font-body text-xs">Not Sent</span>}
                    </div>
                    {doc.sent_at && doc.status !== 'signed' && (
                      <p className="mt-1 font-mono text-xs text-dark-muted">Sent: {new Date(doc.sent_at).toLocaleDateString('en-IN')}</p>
                    )}
                  </div>
                  <div>
                    {doc.status === 'signed' && doc.file_url && (
                      <button className="flex items-center gap-1 font-body text-xs text-dark-muted hover:text-teal"><Download className="h-3.5 w-3.5" /> Download</button>
                    )}
                    {(doc.status === 'sent_pending' || doc.status === 'overdue') && (
                      <Button variant="teal" size="sm">
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Review
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] bg-dark-surface p-6 text-center mt-6">
            <p className="font-body text-sm text-dark-muted">No documents yet. Documents will appear here once you have an active engagement.</p>
          </div>
        )}

        {/* Completion */}
        {allSigned && kycVerified && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[20px] bg-dark-surface border border-teal/20 p-8 text-center mt-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ type: 'spring', bounce: 0.5 }} className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal mb-4">
              <Check className="h-7 w-7 text-dark-base" />
            </motion.div>
            <p className="font-body text-lg font-semibold text-white">You&apos;re all set!</p>
            <p className="mt-1 font-body text-sm text-dark-muted">Your sessions are now unlocked. Book your next one below.</p>
            <Button variant="teal" className="mt-4" onClick={() => navigate('/bookings')}>Book Your Next Session &rarr;</Button>
          </motion.div>
        )}
      </div>
    </DashboardShell>
  );
}
