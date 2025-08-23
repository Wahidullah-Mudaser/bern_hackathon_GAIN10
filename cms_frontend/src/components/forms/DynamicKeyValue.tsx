import React from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface DynamicKeyValueProps {
  control: Control<any>;
  name: string;
  label: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  description?: string;
}

export const DynamicKeyValue: React.FC<DynamicKeyValueProps> = ({
  control,
  name,
  label,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  description
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name
  });

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...control.register(`${name}.${index}.key`)}
              placeholder={keyPlaceholder}
              className="flex-1"
            />
            <Input
              {...control.register(`${name}.${index}.value`)}
              placeholder={valuePlaceholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              className="px-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ key: "", value: "" })}
        className="w-full border-dashed hover:bg-accent/50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label.toLowerCase()}
      </Button>
    </div>
  );
};