import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FormCheckboxProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function FormCheckbox({ label, id, checked, onChange }: FormCheckboxProps) {
  return (
    <div className="flex items-center space-x-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label
        htmlFor={id}
        className="text-sm font-normal cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
}
