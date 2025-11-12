import { FormField } from './FormField';
import { CaseIntakeFormData } from '@/types/case-intake';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';

interface ContactSectionProps {
  formData: CaseIntakeFormData;
  onUpdate: (updates: Partial<CaseIntakeFormData>) => void;
}

export function ContactSection({ formData, onUpdate }: ContactSectionProps) {
  const { formatPhoneNumber } = usePhoneFormatter();

  return (
    <div className="space-y-4">
      <FormField
        label="Address"
        id="address"
        value={formData.contact.address}
        onChange={(value) =>
          onUpdate({ contact: { ...formData.contact, address: value } })
        }
        placeholder="Street address"
      />

      <FormField
        label="Phone Number"
        id="phone"
        type="tel"
        value={formData.contact.phone}
        onChange={(value) =>
          onUpdate({ contact: { ...formData.contact, phone: formatPhoneNumber(value) } })
        }
        placeholder="(123) 456-7890"
      />

      <FormField
        label="Email"
        id="email"
        type="email"
        value={formData.contact.email}
        onChange={(value) =>
          onUpdate({ contact: { ...formData.contact, email: value } })
        }
        placeholder="email@example.com"
      />
    </div>
  );
}
