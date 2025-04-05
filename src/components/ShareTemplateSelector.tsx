
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

export type ShareTemplate = 'default' | 'minimal' | 'elegant' | 'gradient' | 'custom';

interface ShareTemplateSelectorProps {
  currentTemplate: ShareTemplate;
  onTemplateChange: (template: ShareTemplate) => void;
  currentBackgroundColor?: string;
  onBackgroundColorChange?: (color: string) => void;
  currentBackgroundImage?: string | null;
  onBackgroundImageChange?: (image: string | null) => void;
}

export const ShareTemplateSelector: React.FC<ShareTemplateSelectorProps> = ({
  currentTemplate,
  onTemplateChange,
  currentBackgroundColor = '#ffffff',
  onBackgroundColorChange,
  currentBackgroundImage,
  onBackgroundImageChange
}) => {
  const handleTemplateChange = (value: string) => {
    // Validate template value before changing
    const validTemplates: ShareTemplate[] = ['default', 'minimal', 'elegant', 'gradient', 'custom'];
    if (validTemplates.includes(value as ShareTemplate)) {
      onTemplateChange(value as ShareTemplate);
    }
  };

  // Predefined gradients
  const gradients = [
    { name: "Sunset", value: "linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)" },
    { name: "Ocean", value: "linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)" },
    { name: "Forest", value: "linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)" },
    { name: "Lavender", value: "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)" },
    { name: "Golden", value: "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)" },
    { name: "Mint Leaf", value: "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)" },
    { name: "Cherry", value: "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)" },
    { name: "Night Sky", value: "linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)" }
  ];

  // Solid colors
  const colors = [
    { name: "White", value: "#ffffff" },
    { name: "Light Gray", value: "#f3f3f3" },
    { name: "Soft Blue", value: "#e6f3ff" },
    { name: "Soft Green", value: "#e6fff3" },
    { name: "Soft Yellow", value: "#fffde6" },
    { name: "Soft Pink", value: "#ffe6f0" },
    { name: "Soft Purple", value: "#f0e6ff" },
    { name: "Dark Mode", value: "#171717" }
  ];

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
          <SelectItem value="gradient">Gradient</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      
      {(currentTemplate === 'gradient' || currentTemplate === 'custom') && onBackgroundColorChange && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 flex items-center justify-center">
              <Palette className="h-4 w-4" />
              <span className="sr-only">Pick color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <Tabs defaultValue="gradients" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gradients">Gradients</TabsTrigger>
                <TabsTrigger value="colors">Solid Colors</TabsTrigger>
              </TabsList>
              <TabsContent value="gradients" className="p-1">
                <div className="grid grid-cols-4 gap-1 my-2">
                  {gradients.map((gradient, index) => (
                    <div
                      key={index}
                      style={{ background: gradient.value }}
                      className="w-full aspect-square rounded-md cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      title={gradient.name}
                      onClick={() => onBackgroundColorChange(gradient.value)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="colors" className="p-1">
                <div className="grid grid-cols-4 gap-1 my-2">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      style={{ background: color.value }}
                      className="w-full aspect-square rounded-md cursor-pointer hover:ring-2 hover:ring-primary transition-all border"
                      title={color.name}
                      onClick={() => onBackgroundColorChange(color.value)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
