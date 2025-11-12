import { useCallback } from 'react';

export function usePhoneFormatter() {
  const formatPhoneNumber = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }, []);

  return { formatPhoneNumber };
}
