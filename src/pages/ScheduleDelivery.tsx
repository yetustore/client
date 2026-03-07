import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getProductById, createOrder } from '@/lib/api';
import { formatPrice } from '@/data/mockData';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Clock, CheckCircle2, ArrowLeft, LocateFixed } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Product, Order } from '@/types';

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const DEFAULT_CENTER = { lat: -8.839, lng: 13.289 }; // Luanda

const loadMapsScript = (apiKey: string) => new Promise<void>((resolve, reject) => {
  if (window.google?.maps?.places) return resolve();
  const existing = document.getElementById('google-maps');
  if (existing) {
    existing.addEventListener('load', () => resolve());
    existing.addEventListener('error', () => reject(new Error('Maps load failed')));
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Maps load failed'));
  document.head.appendChild(script);
});

const ScheduleDelivery = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');

  const [addressQuery, setAddressQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<{ description: string; placeId: string } | null>(null);
  const [addressOptions, setAddressOptions] = useState<{ description: string; placeId: string }[]>([]);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [confirmed, setConfirmed] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const autocompleteRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObjRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const placesSvcRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const previewPlaceIdRef = useRef<string | null>(null);
  const didAutolocateRef = useRef(false);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setMapsError('Chave do Google Maps não configurada');
      return;
    }
    loadMapsScript(key)
      .then(() => {
        setMapsReady(true);
      })
      .catch(() => {
        setMapsError('Falha ao carregar o Google Maps');
      });
  }, []);

  const reverseGeocode = (lat: number, lng: number) => new Promise<string | null>((resolve) => {
    if (!geocoderRef.current || !window.google?.maps) return resolve(null);
    geocoderRef.current.geocode({ location: { lat, lng } }, (results: any[], status: any) => {
      if (status !== window.google.maps.GeocoderStatus.OK || !results?.length) return resolve(null);
      resolve(results[0].formatted_address || null);
    });
  });

  const applyCoords = async (lat: number, lng: number, updateAddress: boolean) => {
    setCoords({ lat, lng });
    if (mapObjRef.current) {
      mapObjRef.current.setCenter({ lat, lng });
      mapObjRef.current.setZoom(15);
    }
    if (markerRef.current) markerRef.current.setPosition({ lat, lng });

    if (updateAddress) {
      const addr = await reverseGeocode(lat, lng);
      if (addr) {
        setAddressQuery(addr);
      }
    }
  };

  useEffect(() => {
    if (!mapsReady || !window.google?.maps || step !== 2 || !mapRef.current) return;
    if (!mapObjRef.current) {
      mapObjRef.current = new window.google.maps.Map(mapRef.current, {
        center: coords ?? DEFAULT_CENTER,
        zoom: coords ? 15 : 12,
        streetViewControl: false,
        mapTypeControl: false,
      });
      markerRef.current = new window.google.maps.Marker({
        map: mapObjRef.current,
        draggable: false,
      });
      mapObjRef.current.addListener('click', (e: any) => {
        if (!e?.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setSelectedPlace(null);
        applyCoords(lat, lng, true);
      });
      placesSvcRef.current = new window.google.maps.places.PlacesService(mapObjRef.current);
      autocompleteRef.current = new window.google.maps.places.AutocompleteService();
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    window.google.maps.event.trigger(mapObjRef.current, 'resize');
    if (coords) {
      mapObjRef.current.setCenter(coords);
      mapObjRef.current.setZoom(15);
      markerRef.current?.setPosition(coords);
    }

    // Auto-pin to user's current location once when step 2 opens.
    if (!didAutolocateRef.current && !coords && navigator.geolocation) {
      didAutolocateRef.current = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          applyCoords(lat, lng, true);
        },
        () => {
          // keep default center if permission denied
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [mapsReady, step, coords]);

  useEffect(() => {
    if (!mapsReady || !autocompleteRef.current) return;
    const input = addressQuery.trim();
    if (input.length < 3) {
      setAddressOptions([]);
      return;
    }
    autocompleteRef.current.getPlacePredictions(
      { input, types: ['address'], componentRestrictions: { country: 'ao' } },
      (predictions: any[], status: any) => {
        if (!predictions || status !== window.google.maps.places.PlacesServiceStatus.OK) {
          setAddressOptions([]);
          return;
        }
        const mapped = predictions.map(p => ({ description: p.description, placeId: p.place_id }));
        setAddressOptions(mapped);

        // Auto-preview first suggestion on the map while typing (does not select it).
        if (!selectedPlace && mapped.length > 0 && placesSvcRef.current) {
          const first = mapped[0];
          if (previewPlaceIdRef.current !== first.placeId) {
            previewPlaceIdRef.current = first.placeId;
            placesSvcRef.current.getDetails(
              { placeId: first.placeId, fields: ['geometry'] },
              (place: any, detailsStatus: any) => {
                if (detailsStatus !== window.google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) return;
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                applyCoords(lat, lng, false);
              }
            );
          }
        }
      }
    );
  }, [addressQuery, mapsReady, selectedPlace]);

  useEffect(() => {
    const load = async () => {
      try {
        if (productId) {
          const prod = await getProductById(productId);
          setProduct(prod);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const handleSelectAddress = (option: { description: string; placeId: string }) => {
    setSelectedPlace(option);
    setAddressQuery(option.description);
    setAddressOptions([]);
    previewPlaceIdRef.current = option.placeId;
    if (!placesSvcRef.current) return;

    placesSvcRef.current.getDetails(
      { placeId: option.placeId, fields: ['geometry', 'formatted_address'] },
      (place: any, status: any) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        applyCoords(lat, lng, true);
        if (place.formatted_address) setAddressQuery(place.formatted_address);
      }
    );
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setSelectedPlace(null);
        applyCoords(lat, lng, true);
      },
      () => toast.error('Não foi possível obter sua localização'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirm = async () => {
    if (!date || !time) {
      toast.error('Selecione data e horário');
      return;
    }
    if (!mapsError && !coords) {
      toast.error('Defina a localização no mapa');
      return;
    }

    let finalAddress = addressQuery.trim();
    if (!finalAddress && coords) {
      finalAddress = (await reverseGeocode(coords.lat, coords.lng)) || '';
      if (finalAddress) setAddressQuery(finalAddress);
    }
    if (!finalAddress) {
      toast.error('Informe o endereço');
      return;
    }

    try {
      const affiliateCode = searchParams.get('ref') || undefined;
      const created = await createOrder({
        productId: product?.id,
        scheduledDate: format(date, 'yyyy-MM-dd'),
        scheduledTime: time,
        address: finalAddress,
        ...(coords ? { latitude: coords.lat, longitude: coords.lng } : {}),
        affiliateCode,
      });
      setOrder(created);
      setConfirmed(true);
      toast.success('Entrega agendada com sucesso!');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao agendar entrega');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-2/3" />
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <p className="py-20 text-center text-muted-foreground">Produto não encontrado</p>
      </Layout>
    );
  }

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
          {order && (
            <p className="mb-6 text-xs text-muted-foreground">Pedido: {order.id}</p>
          )}
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

          <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
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

              <div>
                <Label className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4 text-primary" />
                  Horário (09:00 - 17:00)
                </Label>
                <div className="mt-1 grid grid-cols-3 gap-2 sm:grid-cols-6">
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

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (!date || !time) {
                    toast.error('Selecione data e hor�rio');
                    return;
                  }
                  setStep(2);
                }}
              >
                Pr�xima etapa
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-primary" />
                  Local de entrega
                </Label>
                <div className="mb-2 flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={addressQuery}
                    onChange={e => {
                      setAddressQuery(e.target.value);
                      setSelectedPlace(null);
                    }}
                    placeholder="Digite o endere�o"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleUseCurrentLocation}>
                    <LocateFixed className="mr-2 h-4 w-4" />
                    Usar localiza��o atual
                  </Button>
                </div>
                {mapsError ? (
                  <p className="mt-1 text-xs text-destructive">{mapsError}</p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">Sugest�es apenas de Angola (opcional).</p>
                )}
                {addressOptions.length > 0 && !selectedPlace && (
                  <div className="mt-2 rounded-lg border border-border bg-card shadow">
                    {addressOptions.map(option => (
                      <button
                        key={option.placeId}
                        type="button"
                        onClick={() => handleSelectAddress(option)}
                        className="block w-full border-b border-border px-3 py-2 text-left text-sm hover:bg-secondary last:border-b-0"
                      >
                        {option.description}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div ref={mapRef} className="h-72 w-full" />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button className="w-full" onClick={handleConfirm} disabled={!mapsReady && !mapsError}>
                  Confirmar Agendamento
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default ScheduleDelivery;


