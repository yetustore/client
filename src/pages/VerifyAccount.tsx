import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Mail, Phone, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

type Step = 'email' | 'phone';

const VerifyAccount = () => {
  const [step, setStep] = useState<Step>('email');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const { user, isAuthenticated, verifyEmail, verifyPhone, resendEmail, resendPhone, setPhone } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
      return;
    }
    if (user?.emailVerified && user?.phoneVerified) {
      navigate('/', { replace: true });
    } else if (user?.emailVerified && !user?.phoneVerified) {
      setStep('phone');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleVerifyEmail = async () => {
    if (emailCode.length !== 6) return;
    setLoading(true);
    try {
      await verifyEmail(emailCode);
      toast.success('Email verificado com sucesso!');
      setStep('phone');
      setResendTimer(60);
      setPhoneCode('');
    } catch (err: any) {
      toast.error(err?.message || 'Código inválido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (phoneCode.length !== 4) return;
    setLoading(true);
    try {
      await verifyPhone(phoneCode);
      toast.success('Bem-vindo ao YetuStore!');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.message || 'Código inválido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      if (step === 'email') {
        await resendEmail();
        toast.success('Novo código enviado para o email!');
      } else {
        await resendPhone();
        toast.success('Novo código enviado por SMS!');
      }
      setResendTimer(60);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao reenviar código');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPhone = async () => {
    if (!phoneInput.trim()) return;
    setLoading(true);
    try {
      await setPhone(phoneInput.trim());
      toast.success('Código enviado por SMS!');
      setResendTimer(60);
      setPhoneCode('');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao enviar código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">YetuStore</span>
        </div>

        <div className="mb-8 flex items-center justify-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
            step === 'email' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
          }`}>
            1
          </div>
          <div className="h-px w-10 bg-border" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
            step === 'phone' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h2 className="mb-2 font-display text-xl font-bold text-foreground">Verifique seu email</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Enviamos um código de 6 dígitos para {' '}  
                <span className="font-medium text-foreground">{user?.email}</span>
              </p>

              <div className="mb-6 flex justify-center">
                <InputOTP maxLength={6} value={emailCode} onChange={setEmailCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleVerifyEmail}
                disabled={loading || emailCode.length !== 6}
                className="mb-4 w-full"
              >
                {loading ? 'Verificando...' : 'Verificar email'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <button
                onClick={handleResend}
                disabled={loading || resendTimer > 0}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              {resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar código'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Phone className="h-7 w-7 text-primary" />
              </div>
              <h2 className="mb-2 font-display text-xl font-bold text-foreground">Verifique seu telefone</h2>
              {user?.phone ? (
                <p className="mb-6 text-sm text-muted-foreground">
                  Enviamos um código de 4 dígitos para{' '}
                  <span className="font-medium text-foreground">{user.phone}</span>
                </p>
              ) : (
                <p className="mb-6 text-sm text-muted-foreground">
                  Informe seu telefone para receber o código por SMS.
                </p>
              )}

              {!user?.phone && (
                <div className="mb-4">
                  <Input
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    placeholder="+244 923 456 789"
                  />
                </div>
              )}

              {user?.phone && (
                <div className="mb-6 flex justify-center">
                  <InputOTP maxLength={4} value={phoneCode} onChange={setPhoneCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}

              {user?.phone ? (
                <Button
                  onClick={handleVerifyPhone}
                  disabled={loading || phoneCode.length !== 4}
                  className="mb-4 w-full"
                >
                  {loading ? 'Verificando...' : 'Verificar telefone'}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              ) : (
                <Button
                  onClick={handleSetPhone}
                  disabled={loading || !phoneInput.trim()}
                  className="mb-4 w-full"
                >
                  {loading ? 'Enviando...' : 'Enviar código'}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              )}

              <button
                onClick={handleResend}
                disabled={loading || resendTimer > 0 || !user?.phone}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar código'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VerifyAccount;
