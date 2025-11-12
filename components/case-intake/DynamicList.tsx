import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { ReactNode } from 'react';

interface DynamicListProps<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  addButtonText: string;
  allowEmpty?: boolean;
}

export function DynamicList<T>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addButtonText,
  allowEmpty = false,
}: DynamicListProps<T>) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {renderItem(item, index)}
              {(allowEmpty || items.length > 1) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        {addButtonText}
      </Button>
    </div>
  );
}
