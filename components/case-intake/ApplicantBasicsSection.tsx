import { FormField } from './FormField';
import { FormSelect } from './FormSelect';
import { FormCheckbox } from './FormCheckbox';
import { CaseIntakeFormData, ApplicantStatus, VoterRegistration } from '@/types/case-intake';

interface ApplicantBasicsSectionProps {
  formData: CaseIntakeFormData;
  onUpdate: (updates: Partial<CaseIntakeFormData>) => void;
}

export function ApplicantBasicsSection({ formData, onUpdate }: ApplicantBasicsSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        label="Applicant Name"
        id="applicantName"
        value={formData.applicantName}
        onChange={(value) => onUpdate({ applicantName: value })}
        placeholder="Full name"
        required
      />

      <FormSelect
        label="Applicant Status"
        id="applicantStatus"
        value={formData.applicantStatus}
        onChange={(value) => onUpdate({ applicantStatus: value as ApplicantStatus })}
        options={[
          { value: 'individual', label: 'Individual' },
          { value: 'married', label: 'Married' },
          { value: 'other', label: 'Other' },
        ]}
        required
      />

      <FormCheckbox
        label="U.S. Citizen"
        id="citizenship"
        checked={formData.citizenship.status}
        onChange={(checked) =>
          onUpdate({ citizenship: { ...formData.citizenship, status: checked } })
        }
      />

      <FormCheckbox
        label="Verified Disabled"
        id="disability"
        checked={formData.disability.status}
        onChange={(checked) =>
          onUpdate({ disability: { ...formData.disability, status: checked } })
        }
      />

      <FormSelect
        label="Voter Registration"
        id="voterReg"
        value={formData.voterReg}
        onChange={(value) => onUpdate({ voterReg: value as VoterRegistration })}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />

      <FormCheckbox
        label="Application Signed"
        id="applicationSigned"
        checked={formData.applicationSigned}
        onChange={(checked) => onUpdate({ applicationSigned: checked })}
      />
    </div>
  );
}
