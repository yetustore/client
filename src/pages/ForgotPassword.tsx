import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { requestPasswordReset, confirmPasswordReset } from '@/lib/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [channel, setChannel] = useState<'email' | 'phone'>('email');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email, channel);
      toast.success('Código enviado com sucesso');
      setStep('confirm');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao enviar código');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmPasswordReset(email, code, newPassword);
      toast.success('Senha atualizada. Faça login.');
      navigate('/auth?mode=login');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao atualizar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-2xl font-bold">Esqueci a senha</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {step === 'request'
            ? 'Escolha onde receber o código de verificação.'
            : 'Digite o código recebido e defina uma nova senha.'}
        </p>

        {step === 'request' ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1.5 text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Receber código via</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    channel === 'email' ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('phone')}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    channel === 'phone' ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  Telemóvel
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar código'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <Label className="mb-1.5 text-sm font-medium">Código</Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
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
            </div>

            <div>
              <Label htmlFor="newPassword" className="mb-1.5 text-sm font-medium">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || code.length < 4}>
              {loading ? 'Atualizando...' : 'Atualizar senha'}
            </Button>
          </form>
        )}

        <button
          onClick={() => navigate('/auth?mode=login')}
          className="mt-6 text-sm font-semibold text-primary hover:underline"
        >
          Voltar ao login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
