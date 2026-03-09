import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { useMatchStore } from '../store/useMatchStore';
import LoginPage from '../pages/LoginPage';
import QuestionnairePage from '../pages/QuestionnairePage';
import FindingAdvisorPage from '../pages/FindingAdvisorPage';
import MatchRevealPage from '../pages/MatchRevealPage';
import DashboardPage from '../pages/DashboardPage';
import BrowseAdvisorsPage from '../pages/BrowseAdvisorsPage';
import AdvisorProfilePage from '../pages/AdvisorProfilePage';
import BookingsPage from '../pages/BookingsPage';
import EngagementsPage from '../pages/EngagementsPage';
import KYCPage from '../pages/KYCPage';
import MessagesPage from '../pages/MessagesPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ requireAuth = true, requireMatch = false }: { requireAuth?: boolean; requireMatch?: boolean }) {
  const { isAuthenticated, userProfile } = useUserStore();
  const { result } = useMatchStore();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  // Check if questionnaire is completed (from DB) or if local match result exists
  if (requireMatch && !result && !userProfile?.questionnaire_completed) {
    return <Navigate to="/questionnaire" replace />;
  }

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function PublicRoute() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/', element: <LoginPage /> },
    ],
  },
  {
    element: <ProtectedRoute requireAuth />,
    children: [
      { path: '/questionnaire', element: <QuestionnairePage /> },
      { path: '/finding-advisor', element: <FindingAdvisorPage /> },
    ],
  },
  {
    element: <ProtectedRoute requireAuth requireMatch />,
    children: [
      { path: '/your-match', element: <MatchRevealPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/browse-advisors', element: <BrowseAdvisorsPage /> },
      { path: '/advisor/:id', element: <AdvisorProfilePage /> },
      { path: '/bookings', element: <BookingsPage /> },
      { path: '/engagements', element: <EngagementsPage /> },
      { path: '/kyc', element: <KYCPage /> },
      { path: '/messages', element: <MessagesPage /> },
    ],
  },
]);
