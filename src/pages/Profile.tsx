import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAffiliateLinks, formatPrice } from '@/data/mockData';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [editing, setEditing] = useState(false);

  const validatedCommission = mockAffiliateLinks.reduce((a, l) => a + l.validatedCommission, 0);
  const totalCommission = mockAffiliateLinks.reduce((a, l) => a + l.totalCommission, 0);

  const handleSave = () => {
    updateProfile({ name, phone });
    setEditing(false);
    toast.success('Perfil atualizado!');
  };

  const earningsHistory = [
    { date: 'Dez 2024', amount: 9495, type: 'Comissão - Smartphone Galaxy Ultra' },
    { date: 'Nov 2024', amount: 0, type: 'Nenhuma comissão validada' },
    { date: 'Out 2024', amount: 3200, type: 'Comissão - Tênis Running Pro' },
  ];

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
        <h1 className="mb-1 font-display text-3xl font-bold text-foreground">Meu Perfil</h1>
        <p className="mb-6 text-muted-foreground">Gerencie suas informações pessoais</p>

        {/* Profile Card */}
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
                <Input value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave}>Salvar</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
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
                <span className="text-foreground">{user?.phone}</span>
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

        {/* Commission Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <DollarSign className="mb-2 h-5 w-5 text-success" />
            <p className="text-xs text-muted-foreground">Saldo Validado</p>
            <p className="font-display text-xl font-bold text-foreground">{formatPrice(validatedCommission)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <TrendingUp className="mb-2 h-5 w-5 text-warning" />
            <p className="text-xs text-muted-foreground">Total Acumulado</p>
            <p className="font-display text-xl font-bold text-foreground">{formatPrice(totalCommission)}</p>
          </div>
        </div>

        {/* Earnings History */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h3 className="mb-4 font-display text-base font-semibold text-foreground">Histórico de Ganhos</h3>
          <div className="space-y-3">
            {earningsHistory.map((entry, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{entry.type}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <span className={`font-display font-bold ${entry.amount > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                  {entry.amount > 0 ? `+${formatPrice(entry.amount)}` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Profile;
