import { OrderStatus, StatusEntry } from '@/types';
import { statusLabels } from '@/data/mockData';
import { Check, X, Clock, ShoppingCart, Truck, Phone } from 'lucide-react';

const statusConfig: Record<OrderStatus, { icon: typeof Check; color: string; bg: string }> = {
  agendado: { icon: Clock, color: 'text-info', bg: 'bg-info/10 border-info/30' },
  cancelado: { icon: X, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/30' },
  em_progresso: { icon: ShoppingCart, color: 'text-warning', bg: 'bg-warning/10 border-warning/30' },
  comprado: { icon: Check, color: 'text-success', bg: 'bg-success/10 border-success/30' },
};

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.color}`}>
      <Icon className="h-3 w-3" />
      {statusLabels[status]}
    </span>
  );
};

const OrderTimeline = ({ history }: { history: StatusEntry[] }) => {
  const allStatuses: OrderStatus[] = ['agendado', 'em_progresso', 'comprado'];
  const isCancelled = history.some(h => h.status === 'cancelado');

  const steps = isCancelled
    ? history
    : allStatuses.map(s => {
        const entry = history.find(h => h.status === s);
        return { status: s, timestamp: entry?.timestamp || '', adminName: entry?.adminName, adminPhone: entry?.adminPhone };
      });

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const completed = history.some(h => h.status === step.status);
        const config = statusConfig[step.status];
        const Icon = config.icon;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  completed
                    ? `${config.bg} ${config.color}`
                    : 'border-border bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[2rem] ${completed ? 'bg-primary/30' : 'bg-border'}`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`text-sm font-semibold ${completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                {statusLabels[step.status]}
              </p>
              {step.timestamp && (
                <p className="text-xs text-muted-foreground">
                  {new Date(step.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              {step.status === 'em_progresso' && (step.adminName || step.adminPhone) && (
                <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Entregador:</span>
                  <span>{step.adminName || 'N/D'}</span>
                  {step.adminPhone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {step.adminPhone}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
