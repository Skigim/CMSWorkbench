import { useState } from 'react';
import { CaseIntakeFormData, initialFormData } from '@/types/case-intake';

export function useCaseIntakeForm() {
  const [formData, setFormData] = useState<CaseIntakeFormData>(initialFormData);

  return {
    formData,
    setFormData,
  };
}
