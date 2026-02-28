import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useMemo } from 'react';

const FIRST_VISIT_KEY = 'yetustore-first-visit';

const FirstVisitLoading = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
    <div className="relative">
      <div className="absolute -inset-6 rounded-full bg-primary/10 blur-2xl" />
      <img
        src="/logo.png"
        alt="YetuStore"
        className="relative h-36 w-36 rounded-full border border-primary/20 bg-white object-cover shadow-elevated animate-float"
      />
    </div>
    <div>
      <p className="font-display text-2xl font-bold text-foreground">Bem-vindo á YetuStore</p>
      <p className="mt-1 text-sm text-muted-foreground">Estamos preparando o seu acesso...</p>
    </div>
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const shouldShowFirstVisit = useMemo(() => {
    if (isAuthenticated || isLoading) return false;
    return !localStorage.getItem(FIRST_VISIT_KEY);
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!shouldShowFirstVisit) return;
    const timer = window.setTimeout(() => {
      localStorage.setItem(FIRST_VISIT_KEY, '1');
      navigate('/auth', { replace: true });
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [navigate, shouldShowFirstVisit]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (shouldShowFirstVisit) return <FirstVisitLoading />;
    return <Navigate to="/auth" replace />;
  }

  if (user && (!user.emailVerified || !user.phoneVerified)) {
    return <Navigate to="/verify" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;



