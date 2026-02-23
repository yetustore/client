import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '@/data/mockData';
import { formatPrice } from '@/data/mockData';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const ScheduleDelivery = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === productId);
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!product) {
    return (
      <Layout>
        <p className="py-20 text-center text-muted-foreground">Produto não encontrado</p>
      </Layout>
    );
  }

  const handleConfirm = () => {
    if (!address || !date || !time) {
      toast.error('Preencha todos os campos');
      return;
    }
    setConfirmed(true);
    toast.success('Entrega agendada com sucesso!');
  };

  if (confirmed) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-lg py-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Pedido Agendado!</h2>
          <p className="mb-6 text-muted-foreground">
            Seu pedido de <strong>{product.name}</strong> foi agendado para{' '}
            {date && format(date, "dd 'de' MMMM", { locale: pt })} às {time}.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate('/orders')}>Ver Meus Pedidos</Button>
            <Button variant="outline" onClick={() => navigate('/')}>Continuar Comprando</Button>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="mx-auto max-w-2xl">
          <h1 className="mb-1 font-display text-2xl font-bold text-foreground">Agendar Entrega</h1>
          <p className="mb-6 text-muted-foreground">Escolha o endereço, data e horário para a entrega</p>

          {/* Product summary */}
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Address */}
            <div>
              <Label className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-primary" />
                Endereço de entrega
              </Label>
              <Input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Rua, número, bairro, cidade..."
                className="mt-1"
              />
              <p className="mt-1 text-xs text-muted-foreground">Digite o endereço completo para entrega</p>
            </div>

            {/* Date */}
            <div>
              <Label className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                <CalendarIcon className="h-4 w-4 text-primary" />
                Data da entrega
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'mt-1 w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd 'de' MMMM, yyyy", { locale: pt }) : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={d => d < new Date()}
                    className="pointer-events-auto p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div>
              <Label className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                Horário
              </Label>
              <div className="mt-1 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      time === slot
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:bg-secondary'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleConfirm} className="w-full" size="lg">
              Confirmar Agendamento
            </Button>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ScheduleDelivery;
