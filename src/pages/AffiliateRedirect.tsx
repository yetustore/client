import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resolveAffiliateCode, trackAffiliateClick } from '@/lib/api';

const AffiliateRedirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Carregando link de afiliado...');

  useEffect(() => {
    const run = async () => {
      if (!code) return;
      try {
        const link = await resolveAffiliateCode(code);
        await trackAffiliateClick(code);
        navigate(`/schedule/${link.productId}?ref=${encodeURIComponent(code)}`, { replace: true });
      } catch {
        setMessage('Link de afiliado inválido.');
      }
    };
    run();
  }, [code, navigate]);

  return (
    <div className="py-20 text-center text-muted-foreground">{message}</div>
  );
};

export default AffiliateRedirect;
