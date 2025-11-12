import { FormCheckbox } from './FormCheckbox';
import { CaseIntakeFormData } from '@/types/case-intake';

interface SystemVerificationSectionProps {
  formData: CaseIntakeFormData;
  onUpdate: (updates: Partial<CaseIntakeFormData>) => void;
}

export function SystemVerificationSection({
  formData,
  onUpdate,
}: SystemVerificationSectionProps) {
  return (
    <div className="space-y-4">
      <FormCheckbox
        label="Past Budgets - Reviewed"
        id="reviewBudgets"
        checked={formData.reviewDocs.budgets}
        onChange={(checked) =>
          onUpdate({ reviewDocs: { ...formData.reviewDocs, budgets: checked } })
        }
      />

      <FormCheckbox
        label="Narratives - Reviewed"
        id="reviewNarratives"
        checked={formData.reviewDocs.narratives}
        onChange={(checked) =>
          onUpdate({ reviewDocs: { ...formData.reviewDocs, narratives: checked } })
        }
      />

      <FormCheckbox
        label="Verification Requests - Reviewed"
        id="reviewVerification"
        checked={formData.reviewDocs.verification}
        onChange={(checked) =>
          onUpdate({ reviewDocs: { ...formData.reviewDocs, verification: checked } })
        }
      />

      <FormCheckbox
        label="Interfaces - Reviewed"
        id="reviewInterfaces"
        checked={formData.reviewDocs.interfaces}
        onChange={(checked) =>
          onUpdate({ reviewDocs: { ...formData.reviewDocs, interfaces: checked } })
        }
      />
    </div>
  );
}
