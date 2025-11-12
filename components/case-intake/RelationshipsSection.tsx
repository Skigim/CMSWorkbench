import { DynamicList } from './DynamicList';
import { FormField } from './FormField';
import { CaseIntakeFormData, Relationship } from '@/types/case-intake';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';

interface RelationshipsSectionProps {
  formData: CaseIntakeFormData;
  onUpdate: (updates: Partial<CaseIntakeFormData>) => void;
}

export function RelationshipsSection({ formData, onUpdate }: RelationshipsSectionProps) {
  const { formatPhoneNumber } = usePhoneFormatter();

  const addRelationship = () => {
    onUpdate({
      relationships: [...formData.relationships, { name: '', phone: '', relation: '' }],
    });
  };

  const removeRelationship = (index: number) => {
    onUpdate({
      relationships: formData.relationships.filter((_, i) => i !== index),
    });
  };

  const updateRelationship = (index: number, field: keyof Relationship, value: string) => {
    const updatedRelationships = formData.relationships.map((rel, i) =>
      i === index ? { ...rel, [field]: value } : rel
    );
    onUpdate({ relationships: updatedRelationships });
  };

  return (
    <DynamicList
      items={formData.relationships}
      onAdd={addRelationship}
      onRemove={removeRelationship}
      addButtonText="Add Relationship"
      renderItem={(relationship, index) => (
        <div className="space-y-4">
          <FormField
            label="Name"
            id={`relationship-name-${index}`}
            value={relationship.name}
            onChange={(value) => updateRelationship(index, 'name', value)}
            placeholder="Full name"
          />
          <FormField
            label="Phone Number"
            id={`relationship-phone-${index}`}
            type="tel"
            value={relationship.phone}
            onChange={(value) =>
              updateRelationship(index, 'phone', formatPhoneNumber(value))
            }
            placeholder="(123) 456-7890"
          />
          <FormField
            label="Relation"
            id={`relationship-relation-${index}`}
            value={relationship.relation}
            onChange={(value) => updateRelationship(index, 'relation', value)}
            placeholder="e.g., Spouse, Parent, Child"
          />
        </div>
      )}
    />
  );
}
