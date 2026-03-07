import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resolveAffiliateCode, trackAffiliateClick } from '@/lib/api';

const AffiliateRedirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Carregando link de afiliado...');

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
    <div className="py-20 text-center text-muted-foreground">{message}</div>
  );
};

export default AffiliateRedirect;
