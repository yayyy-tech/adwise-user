import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitLayout } from '../components/layout/SplitLayout';
import { LeftPanel } from '../components/layout/LeftPanel';
import { RightPanel } from '../components/layout/RightPanel';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUserStore } from '../store/useUserStore';

const STATS = [
  { value: '\u20b92.3Cr', desc: 'Average corpus built with a good plan by 50' },
  { value: '78%', desc: 'Of Indians have no structured financial plan' },
  { value: '2.1%', desc: 'Average annual return improvement from portfolio restructuring' },
  { value: '\u20b91.4Cr', desc: 'Average tax saved over 10 years with proper structuring' },
];

const TESTIMONIALS = [
  {
    quote: '\u201cThe best financial decision I made was talking to someone who was actually on my side.\u201d',
    name: 'Arjun, 31',
    detail: 'Software Engineer, Bengaluru',
  },
  {
    quote: '\u201cI had SIPs running for 3 years with no actual plan. My advisor restructured everything in one session.\u201d',
    name: 'Meera, 29',
    detail: 'Product Manager, Mumbai',
  },
  {
    quote: '\u201cI was paying \u20b94L in taxes I didn\u2019t need to. Now I\u2019m not.\u201d',
    name: 'Siddharth, 38',
    detail: 'Founder, Hyderabad',
  },
  {
    quote: '\u201cRetirement always felt abstract. Now I have a number and a date. That\u2019s everything.\u201d',
    name: 'Priya, 34',
    detail: 'Doctor, Pune',
  },
];

export default function LoginPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userProfile, signIn, signUp } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      if (userProfile?.questionnaire_completed) {
        navigate('/dashboard');
      } else {
        navigate('/questionnaire');
      }
    }
  }, [isAuthenticated, userProfile, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleContinue = useCallback(async () => {
    if (!email.trim() || !password.trim()) return;
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        if (!fullName.trim()) { setError('Please enter your name'); setLoading(false); return; }
        const result = await signUp(email, password, fullName);
        if (result.error) {
          setError(result.error);
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }, [email, password, isSignUp, fullName, signIn, signUp]);

  const handleSocialLogin = useCallback(async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/questionnaire' },
      });
      if (error) {
        setError(error.message);
      }
    } catch (e: any) {
      setError(e.message || 'Google login failed');
    }
  }, []);

  const handleComingSoon = useCallback(() => {
    setError('This login method is coming soon. Please use Google or email/password.');
  }, []);

  const left = (
    <LeftPanel>
      <Logo />
      <div className="flex flex-1 flex-col justify-center max-w-[380px]">
        <h1 className="font-body text-4xl font-bold leading-tight text-light-text">
          Find your advisor.
          <br />
          Take control.
        </h1>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-light-muted">
          Connect with a SEBI-verified financial advisor matched
          to your exact situation. Takes 4 minutes.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={handleSocialLogin}
            className="flex items-center justify-center gap-2 rounded-[12px] border border-light-border bg-white px-4 py-3 font-body text-sm font-medium text-light-text transition-colors hover:bg-light-base"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Google
          </button>
          <button
            onClick={handleComingSoon}
            className="flex items-center justify-center gap-2 rounded-[12px] border border-light-border bg-white px-4 py-3 font-body text-sm font-medium text-light-muted transition-colors hover:bg-light-base opacity-60 cursor-default"
          >
            <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor"><path d="M13.34 9.48c-.02-2.08 1.7-3.08 1.78-3.13-1-1.42-2.5-1.62-3.04-1.64-1.28-.13-2.52.76-3.18.76-.66 0-1.66-.74-2.74-.72A4.05 4.05 0 002.72 7.2c-1.46 2.52-.37 6.24 1.04 8.28.7 1 1.52 2.12 2.6 2.08 1.06-.04 1.46-.68 2.72-.68 1.28 0 1.64.68 2.74.66 1.12-.02 1.84-1 2.52-2.02.8-1.16 1.12-2.28 1.14-2.34-.02-.02-2.14-.82-2.14-3.26v-.44zm-2-5.98c.56-.7.94-1.66.84-2.62-.82.04-1.82.56-2.4 1.24-.52.6-.98 1.58-.86 2.5.92.08 1.86-.46 2.42-1.12z"/></svg>
            Apple
            <span className="text-[10px] text-light-muted">(soon)</span>
          </button>
          <button
            onClick={handleComingSoon}
            className="flex items-center justify-center gap-2 rounded-[12px] border border-light-border bg-white px-4 py-3 font-body text-sm font-medium text-light-muted transition-colors hover:bg-light-base opacity-60 cursor-default"
          >
            <svg width="18" height="18" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
            Microsoft
            <span className="text-[10px] text-light-muted">(soon)</span>
          </button>
          <button
            onClick={handleComingSoon}
            className="flex items-center justify-center gap-2 rounded-[12px] border border-light-border bg-white px-4 py-3 font-body text-sm font-medium text-light-muted transition-colors hover:bg-light-base opacity-60 cursor-default"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="10" y="1" width="5" height="5" rx="1"/><rect x="1" y="10" width="5" height="5" rx="1"/><rect x="10" y="10" width="5" height="5" rx="1"/></svg>
            SSO
            <span className="text-[10px] text-light-muted">(soon)</span>
          </button>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-light-border" />
          <span className="font-body text-xs text-light-muted">OR</span>
          <div className="h-px flex-1 bg-light-border" />
        </div>

        <div className="space-y-3">
          {isSignUp && (
            <Input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          />
          {error && (
            <p className="font-body text-xs text-red-500">{error}</p>
          )}
        </div>

        <div className="mt-4 space-y-3">
          <Button variant="primary" size="lg" fullWidth onClick={handleContinue} disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'} &rarr;
          </Button>
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="w-full font-body text-[13px] text-light-muted hover:text-light-text transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <p className="mt-6 font-body text-xs text-light-muted">
          By signing up, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </LeftPanel>
  );

  const right = (
    <RightPanel>
      <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-[20px] bg-dark-surface p-8 border border-dark-border"
          >
            <p className="font-mono text-[56px] font-medium text-white leading-none">
              {STATS[activeIndex].value}
            </p>
            <p className="mt-3 font-body text-sm text-dark-muted">
              {STATS[activeIndex].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="font-display italic text-[22px] leading-snug text-white">
              {TESTIMONIALS[activeIndex].quote}
            </p>
            <p className="mt-3 font-body text-[13px] text-dark-muted">
              &mdash; {TESTIMONIALS[activeIndex].name} &middot; {TESTIMONIALS[activeIndex].detail}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === activeIndex ? 'bg-teal' : 'bg-dark-muted-2'
              }`}
            />
          ))}
        </div>
      </div>
    </RightPanel>
  );

  return <SplitLayout left={left} right={right} />;
}
