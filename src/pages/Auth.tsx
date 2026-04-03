import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { initGoogleButton } from "@/lib/google";

const FIRST_VISIT_KEY = "yetustore-first-visit";

const FirstVisitLoading = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
    {/* Texto */}
    <div className="space-y-1">
      <p className="font-display text-xl sm:text-2xl font-semibold text-foreground">
        Bem-vindo
      </p>

      <p className="text-sm text-muted-foreground">
        Estamos preparando o seu acesso...
      </p>
    </div>

    {/* Loader */}
    <div className="mt-6 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/40 border-t-primary" />
    </div>

  </div>
);

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login",
  );
  const [loading, setLoading] = useState(false);
  const [showFirstVisit, setShowFirstVisit] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement | null>(null);

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "signup" || m === "login") setMode(m);
  }, [searchParams]);

  useEffect(() => {
    if (localStorage.getItem(FIRST_VISIT_KEY)) return;
    setShowFirstVisit(true);
    const timer = window.setTimeout(() => {
      localStorage.setItem(FIRST_VISIT_KEY, "1");
      setShowFirstVisit(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

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
              toast.success("Login com Google realizado!");
              navigate(redirectTo);
            } catch (err: any) {
              toast.error(err?.message || "Erro ao autenticar com Google");
            } finally {
              setLoading(false);
            }
          },
          (msg) => {
            if (!mounted) return;
            toast.error(msg);
          },
        );
        if (mounted) setGoogleReady(true);
      } catch (err: any) {
        if (mounted) {
          setGoogleReady(false);
          toast.error(err?.message || "Erro ao inicializar Google");
        }
      }
    };

    setupGoogle();
    return () => {
      mounted = false;
    };
  }, [loginWithGoogle, navigate, redirectTo]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Bem-vindo de volta!");
        navigate(redirectTo);
      } else {
        await signup(form);
        toast.success("Conta criada! Verifique seu email.");
        navigate("/verify");
      }
    } catch {
      toast.error("Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  if (showFirstVisit) return <FirstVisitLoading />;

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 items-center justify-center gradient-hero lg:flex">
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto mb-6 flex  items-center justify-center rounded-2xl p-2">
            <img
              src="/logoRB.png"
              alt="YetuStore"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
          <p className="text-lg text-primary-foreground/80">
            Sua plataforma de compras com entrega agendada e programa de
            afiliados.
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
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 p-1 shadow-card">
                <img
                  src="/logoRB.png"
                  alt="YetuStore"
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">
                YetuStore
              </span>
            </div>
          </div>

          <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
            {mode === "login" ? "Entrar na conta" : "Criar conta"}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {mode === "login"
              ? "Acesse sua conta para continuar"
              : "Preencha seus dados para começar"}
          </p>

          <div className="mb-4 flex w-full justify-center">
            <div ref={googleBtnRef} />
          </div>
          {!googleReady && (
            <div className="flex items-center justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#BF046B] border-t-transparent"></div>
            </div>
          )}

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="mb-1.5 text-sm font-medium">
                  Nome
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Seu nome completo"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="mb-1.5 text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="digite seu email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="mb-1.5 text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="***************"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <button
                type="button"
                onClick={() => navigate("/forgot")}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Esqueci minha senha
              </button>
            )}

            {mode === "signup" && (
              <div>
                <Label htmlFor="phone" className="mb-1.5 text-sm font-medium">
                  Telefone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+244 923 456 789"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Aguarde..."
                : mode === "login"
                  ? "Entrar"
                  : "Criar conta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "login" ? "Cadastre-se" : "Fazer login"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
