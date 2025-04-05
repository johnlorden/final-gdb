
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ShareTemplate = 'default' | 'minimal' | 'elegant';

interface ShareTemplateSelectorProps {
  currentTemplate: ShareTemplate;
  onTemplateChange: (template: ShareTemplate) => void;
}

export const ShareTemplateSelector: React.FC<ShareTemplateSelectorProps> = ({
  currentTemplate,
  onTemplateChange
}) => {
  const handleTemplateChange = (value: string) => {
    // Validate template value before changing
    if (value === 'default' || value === 'minimal' || value === 'elegant') {
      onTemplateChange(value as ShareTemplate);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-sm text-muted-foreground">Share template:</span>
      <Select
        value={currentTemplate}
        onValueChange={handleTemplateChange}
      >
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="minimal">Minimal</SelectItem>
          <SelectItem value="elegant">Elegant</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
