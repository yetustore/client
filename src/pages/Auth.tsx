import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { initGoogleButton } from '@/lib/google';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const m = searchParams.get('mode');
    if (m === 'signup' || m === 'login') setMode(m);
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    const setupGoogle = async () => {
      if (!googleBtnRef.current) return;
      try {
        await initGoogleButton(
          googleBtnRef.current,
          async (token) => {
            if (!mounted) return;
            setLoading(true);
            try {
              await loginWithGoogle(token);
              toast.success('Login com Google realizado!');
              navigate('/');
            } catch (err: any) {
              toast.error(err?.message || 'Erro ao autenticar com Google');
            } finally {
              setLoading(false);
            }
          },
          (msg) => {
            if (!mounted) return;
            toast.error(msg);
          }
        );
        if (mounted) setGoogleReady(true);
      } catch (err: any) {
        if (mounted) {
          setGoogleReady(false);
          toast.error(err?.message || 'Erro ao inicializar Google');
        }
      }
    };

    setupGoogle();
    return () => { mounted = false; };
  }, [loginWithGoogle, navigate]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Bem-vindo de volta!');
        navigate('/');
      } else {
        await signup(form);
        toast.success('Conta criada! Verifique seu email.');
        navigate('/verify');
      }
    } catch {
      toast.error('Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 items-center justify-center gradient-hero lg:flex">
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur">
            <Package className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-4 font-display text-4xl font-bold text-primary-foreground">
            YetuStore
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Sua plataforma de compras com entrega agendada e programa de afiliados.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-background px-4 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">YetuStore</span>
            </div>
          </div>

          <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
            {mode === 'login' ? 'Entrar na conta' : 'Criar conta'}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Acesse sua conta para continuar'
              : 'Preencha seus dados para começar'}
          </p>

          <div className="mb-4 flex w-full justify-center">
            <div ref={googleBtnRef} />
          </div>
          {!googleReady && (
            <p className="mb-4 text-xs text-muted-foreground">Google indisponível. Verifique o `VITE_GOOGLE_CLIENT_ID`.</p>
          )}

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="name" className="mb-1.5 text-sm font-medium">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="mb-1.5 text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="mb-1.5 text-sm font-medium">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => navigate('/forgot')}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Esqueci minha senha
              </button>
            )}

            {mode === 'signup' && (
              <div>
                <Label htmlFor="phone" className="mb-1.5 text-sm font-medium">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+244 923 456 789"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-semibold text-primary hover:underline"
            >
              {mode === 'login' ? 'Cadastre-se' : 'Fazer login'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
