import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getAffiliatePayouts, getAffiliateSummary, requestAffiliateWithdraw, updateAffiliateBank } from '@/lib/api';
import { AffiliatePayout } from '@/types';
import { Pencil } from 'lucide-react';
import { formatPrice } from '@/data/mockData';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationControls from '@/components/PaginationControls';

const statusLabel: Record<AffiliatePayout['status'], { label: string; className: string }> = {
  requested: { label: 'Solicitado', className: 'text-warning' },
  paid: { label: 'Pago', className: 'text-success' },
  denied: { label: 'Negado', className: 'text-destructive' },
};

const PAGE_SIZE = 8;

const AffiliatePayouts = () => {
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [summary, setSummary] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    available: 0,
    minWithdraw: 0,
    maxWithdraw: 0,
    hasBankDetails: false,
    bank: { accountName: '', bankName: '', iban: '' },
  });
  const [amount, setAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [bank, setBank] = useState({ accountName: '', bankName: '', iban: '' });
  const [editingBank, setEditingBank] = useState(false);
  const [page, setPage] = useState(1);

  const load = async () => {
    const [payoutData, summaryData] = await Promise.all([
      getAffiliatePayouts(),
      getAffiliateSummary(),
    ]);
    setPayouts(payoutData);
    setSummary(summaryData);
    setBank(summaryData.bank || { accountName: '', bankName: '', iban: '' });
    setEditingBank(false);
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

  const pageCount = Math.max(1, Math.ceil(payouts.length / PAGE_SIZE));
  useEffect(() => {
    setPage(p => Math.min(p, pageCount));
  }, [pageCount]);

  const pagedPayouts = payouts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showSkeleton = loadingData && payouts.length === 0;

  const handleWithdraw = async () => {
    const value = Number(amount);
    if (!value || value <= 0) return;
    setWithdrawing(true);
    try {
      await requestAffiliateWithdraw(value);
      toast.success('Saque solicitado');
      setAmount('');
      await load();
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao solicitar saque');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleSaveBank = async () => {
    try {
      await updateAffiliateBank(bank);
      toast.success('Dados bancários salvos');
      setEditingBank(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar dados bancários');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Histórico de Saques</h1>
          <p className="text-sm text-muted-foreground">Acompanhe suas solicitações e pagamentos</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Conta Bancária</p>
            <button
              onClick={() => setEditingBank(true)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          {!editingBank && (
            <div className="mt-3 text-sm">
              {summary.hasBankDetails ? (
                <div className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  Banco: <span className="font-semibold text-foreground">{summary.bank?.bankName}</span> | Conta: {summary.bank?.accountName} | IBAN: {summary.bank?.iban}
                </div>
              ) : (
                <div className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  Nenhuma conta cadastrada
                </div>
              )}
            </div>
          )}

          {editingBank && (
            <div className="mt-3">
              <div className="grid gap-2 sm:grid-cols-3">
                <input
                  value={bank.accountName}
                  onChange={e => setBank(b => ({ ...b, accountName: e.target.value }))}
                  placeholder="Nome da Conta"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={bank.bankName}
                  onChange={e => setBank(b => ({ ...b, bankName: e.target.value }))}
                  placeholder="Banco"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={bank.iban}
                  onChange={e => setBank(b => ({ ...b, iban: e.target.value }))}
                  placeholder="IBAN"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleSaveBank}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setEditingBank(false);
                    setBank(summary.bank || { accountName: '', bankName: '', iban: '' });
                  }}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Disponível</p>
          <p className="text-lg font-bold text-foreground">{formatPrice(summary.available)}</p>
          <p className="mt-2 text-xs text-muted-foreground">Mínimo {formatPrice(summary.minWithdraw)} | Máximo {formatPrice(summary.maxWithdraw)}</p>

          <div className="mt-4 flex gap-2">
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Valor do saque"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={handleWithdraw}
              disabled={withdrawing || !summary.hasBankDetails}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              Solicitar
            </button>
          </div>
          {!summary.hasBankDetails && (
            <p className="mt-2 text-xs text-muted-foreground">Cadastre seus dados bancários para solicitar saque.</p>
          )}
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Solicitações</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="p-3">Data</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {showSkeleton ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`payout-skeleton-${i}`} className="border-t border-border">
                    <td className="p-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                  </tr>
                ))
              ) : (
                pagedPayouts.map(p => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3">{formatPrice(p.amount)}</td>
                    <td className="p-3">
                      <span className={`text-xs font-semibold ${statusLabel[p.status].className}`}>
                        {statusLabel[p.status].label}
                      </span>
                    </td>
                  </tr>
                ))
              )}
              {!showSkeleton && payouts.length === 0 && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={3}>Nenhum saque registrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!showSkeleton && payouts.length > 0 && (
          <PaginationControls page={page} pageCount={pageCount} onPageChange={setPage} />
        )}
      </div>
    </Layout>
  );
};

export default AffiliatePayouts;
