import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAffiliatePayouts, getAffiliateSummary } from '@/lib/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/data/mockData';
import { toast } from 'sonner';
import { AffiliatePayout } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationControls from '@/components/PaginationControls';

const PAGE_SIZE = 5;

const PayoutSkeleton = () => (
  <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-4 w-16" />
  </div>
);

const Profile = () => {
  const { user, updateProfile, setPhone } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhoneValue] = useState(user?.phone || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    available: 0,
    minWithdraw: 0,
    maxWithdraw: 0,
    hasBankDetails: false,
    bank: { accountName: '', bankName: '', iban: '' },
  });
  const [paidPayouts, setPaidPayouts] = useState<AffiliatePayout[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setName(user?.name || '');
    setPhoneValue(user?.phone || '');
  }, [user]);

  const load = async () => {
    const [summaryData, payouts] = await Promise.all([
      getAffiliateSummary(),
      getAffiliatePayouts(),
    ]);
    setSummary(summaryData);
    setPaidPayouts(payouts.filter(p => p.status === 'paid'));
  };

  useEffect(() => {
    const init = async () => {
      try {
        await load();
      } finally {
        setLoadingData(false);
      }
    };
    init();
  }, []);

  const pageCount = Math.max(1, Math.ceil(paidPayouts.length / PAGE_SIZE));
  useEffect(() => {
    setPage(p => Math.min(p, pageCount));
  }, [pageCount]);

  const pagedPayouts = paidPayouts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showSkeleton = loadingData && paidPayouts.length === 0;

  const handleSave = async () => {
    if (!user) return;
    const nameChanged = name.trim() && name.trim() !== user.name;
    const phoneChanged = phone.trim() !== (user.phone || '');

    if (!nameChanged && !phoneChanged) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      if (nameChanged) {
        await updateProfile({ name: name.trim() });
      }
      if (phoneChanged) {
        if (phone.trim().length < 7) {
          toast.error('Telefone inválido');
        } else {
          await setPhone(phone.trim());
          toast.success('Telefone atualizado. Código enviado para verificação.');
        }
      }
      setEditing(false);
      toast.success('Perfil atualizado!');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
        <h1 className="mb-1 font-display text-3xl font-bold text-foreground">Meu Perfil</h1>
        <p className="mb-6 text-muted-foreground">Gerencie suas informações pessoais</p>

        <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <Label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-primary" /> Nome
                </Label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-primary" /> Telefone
                </Label>
                <Input value={phone} onChange={e => setPhoneValue(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
                <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>Cancelar</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Telefone:</span>
                <span className="text-foreground">{user?.phone || ''}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Membro desde:</span>
                <span className="text-foreground">{user?.createdAt && new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <Button variant="outline" onClick={() => setEditing(true)} className="mt-4">
                Editar Perfil
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <DollarSign className="mb-2 h-5 w-5 text-success" />
            <p className="text-xs text-muted-foreground">Saldo Validado</p>
            <p className="font-display text-xl font-bold text-foreground">{formatPrice(summary.totalWithdrawn)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <TrendingUp className="mb-2 h-5 w-5 text-warning" />
            <p className="text-xs text-muted-foreground">Saldo Acumulado</p>
            <p className="font-display text-xl font-bold text-foreground">{formatPrice(summary.totalEarned)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Histórico de Ganhos</h3>
          <div className="space-y-3">
            {showSkeleton ? (
              Array.from({ length: 3 }).map((_, i) => <PayoutSkeleton key={`payout-skeleton-${i}`} />)
            ) : pagedPayouts.length > 0 ? (
              pagedPayouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Saque aprovado</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className="font-display font-bold text-success">+{formatPrice(p.amount)}</span>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
                Nenhum saque aprovado
              </div>
            )}
          </div>
          {!showSkeleton && paidPayouts.length > 0 && (
            <PaginationControls page={page} pageCount={pageCount} onPageChange={setPage} />
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Profile;
