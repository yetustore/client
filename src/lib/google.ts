const GSI_SRC = 'https://accounts.google.com/gsi/client';

type TokenHandler = (idToken: string) => void;

type ErrorHandler = (message: string) => void;

const loadScript = () => new Promise((resolve, reject) => {
  if (document.getElementById('google-gsi')) return resolve(true);
  const script = document.createElement('script');
  script.src = GSI_SRC;
  script.async = true;
  script.defer = true;
  script.id = 'google-gsi';
  script.onload = () => resolve(true);
  script.onerror = () => reject(new Error('Failed to load Google script'));
  document.head.appendChild(script);
});

const initGsi = (clientId: string, onToken: TokenHandler) => {
  window.google?.accounts?.id.initialize({
    client_id: clientId,
    ux_mode: 'popup',
    use_fedcm_for_prompt: true,
    auto_select: false,
    callback: (response) => {
      if (!response?.credential) return;
      onToken(response.credential);
    },
  });
};

export const initGoogleButton = async (
  container: HTMLElement,
  onToken: TokenHandler,
  onError?: ErrorHandler
) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('VITE_GOOGLE_CLIENT_ID não configurado');
  await loadScript();

  if (!window.google?.accounts?.id) {
    throw new Error('Google SDK não disponível');
  }

  initGsi(clientId, onToken);

  container.innerHTML = '';
  window.google.accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large',
    width: 360,
    text: 'continue_with',
    shape: 'pill',
  });

  try {
    window.google.accounts.id.prompt(() => {});
  } catch (err: any) {
    onError?.(err?.message || 'Falha ao iniciar Google');
  }
};

export const getGoogleIdToken = async () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('VITE_GOOGLE_CLIENT_ID não configurado');
  await loadScript();

  return new Promise<string>((resolve, reject) => {
    if (!window.google?.accounts?.id) {
      return reject(new Error('Google SDK não disponível'));
    }

    initGsi(clientId, (token) => resolve(token));

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        const reason = notification.getNotDisplayedReason?.() || 'unknown';
        reject(new Error(`Login Google bloqueado ou cancelado (${reason})`));
      }
    });
  });
};
