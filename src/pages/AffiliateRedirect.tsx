import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resolveAffiliateCode, trackAffiliateClick } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const AffiliateRedirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const cleanCode = useMemo(() => code?.trim(), [code]);

  useEffect(() => {
    const run = async () => {
      if (!cleanCode) return;
      try {
        const link = await resolveAffiliateCode(cleanCode);
        await trackAffiliateClick(cleanCode);
        navigate(`/products/${link.productId}?ref=${encodeURIComponent(cleanCode)}`, { replace: true });
      } catch {
        setMessage('Link de afiliado inválido.');
      }
    };
    run();
  }, [cleanCode, navigate]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-20">
      {message ? (
        <div className="text-center text-muted-foreground">{message}</div>
      ) : (
        <>
          <Skeleton className="h-6 w-40 self-center" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 self-center" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </>
      )}
    </div>
  );
};

export default AffiliateRedirect;
