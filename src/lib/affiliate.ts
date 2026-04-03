const STORAGE_KEY = 'yetu_affiliate_ref_code';

const getStorage = () => (typeof window !== 'undefined' ? window.localStorage : null);

export const saveAffiliateRef = (code?: string) => {
  const storage = getStorage();
  if (!storage) return;
  const value = code?.trim();
  if (value) {
    storage.setItem(STORAGE_KEY, value);
  } else {
    storage.removeItem(STORAGE_KEY);
  }
};

export const loadAffiliateRef = () => {
  const storage = getStorage();
  if (!storage) return undefined;
  return storage.getItem(STORAGE_KEY) || undefined;
};

export const clearAffiliateRef = () => saveAffiliateRef();
