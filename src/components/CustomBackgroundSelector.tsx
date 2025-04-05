
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, X, Upload, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OfflineVerseService from '@/services/OfflineVerseService';

interface CustomBackgroundSelectorProps {
  onSelectBackground: (url: string | null) => void;
  currentBackground: string | null;
}

const CustomBackgroundSelector: React.FC<CustomBackgroundSelectorProps> = ({
  onSelectBackground,
  currentBackground
}) => {
  const { toast } = useToast();
  const [showSelector, setShowSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedBackgrounds, setSavedBackgrounds] = useState<string[]>(() => {
    const prefs = OfflineVerseService.getUserPreferences();
    return prefs?.backgroundImages || [];
  });
  
  // Predefined background gradients
  const predefinedBackgrounds = [
    {
      name: 'Soft Blue Gradient',
      value: 'linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)'
    },
    {
      name: 'Sunset',
      value: 'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)'
    },
    {
      name: 'Peaceful Green',
      value: 'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)'
    },
    {
      name: 'Purple Dreams',
      value: 'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)'
    },
    {
      name: 'Golden Hour',
      value: 'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)'
    }
  ];
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      
      // Save to user preferences
      const updatedBackgrounds = [...savedBackgrounds, imageDataUrl];
      setSavedBackgrounds(updatedBackgrounds);
      OfflineVerseService.saveUserPreferences({
        backgroundImages: updatedBackgrounds
      });
      
      // Select the uploaded background
      onSelectBackground(imageDataUrl);
      
      toast({
        title: "Background Added",
        description: "Your custom background has been added",
        duration: 2000,
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  const removeBackground = (index: number) => {
    const updatedBackgrounds = [...savedBackgrounds];
    updatedBackgrounds.splice(index, 1);
    
    setSavedBackgrounds(updatedBackgrounds);
    OfflineVerseService.saveUserPreferences({
      backgroundImages: updatedBackgrounds
    });
    
    // If the current background is removed, set to null
    if (currentBackground === savedBackgrounds[index]) {
      onSelectBackground(null);
    }
    
    toast({
      title: "Background Removed",
      description: "Custom background has been removed",
      duration: 2000,
    });
  };
  
  const clearBackground = () => {
    onSelectBackground(null);
  };
  
  const selectPredefinedBackground = (backgroundValue: string) => {
    onSelectBackground(backgroundValue);
  };
  
  return (
    <div>
      <Button
        variant="outline" 
        size="sm"
        className="gap-1"
        onClick={() => setShowSelector(!showSelector)}
      >
        <Image className="h-4 w-4" />
        <span className="hidden sm:inline">Background</span>
      </Button>
      
      {showSelector && (
        <div className="absolute z-50 mt-2 p-4 bg-background border rounded-lg shadow-lg w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Select Background</h3>
            <Button
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSelector(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Predefined Backgrounds</h4>
              <div className="grid grid-cols-3 gap-2">
                {predefinedBackgrounds.map((bg, index) => (
                  <div 
                    key={index} 
                    className="w-full aspect-video rounded-md cursor-pointer border hover:ring-2 hover:ring-primary"
                    style={{ background: bg.value }}
                    onClick={() => selectPredefinedBackground(bg.value)}
                    title={bg.name}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Your Backgrounds</h4>
              <div className="grid grid-cols-3 gap-2">
                {savedBackgrounds.map((bg, index) => (
                  <div key={index} className="relative group">
                    <div 
                      className="w-full aspect-video rounded-md cursor-pointer border hover:ring-2 hover:ring-primary bg-center bg-cover"
                      style={{ backgroundImage: `url(${bg})` }}
                      onClick={() => onSelectBackground(bg)}
                    />
                    <button
                      className="absolute top-1 right-1 bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeBackground(index)}
                      title="Remove background"
                    >
                      <Trash className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                ))}
                
                <div 
                  className="w-full aspect-video rounded-md border border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
            
            {currentBackground && (
              <Button
                variant="ghost" 
                size="sm"
                className="w-full mt-2 gap-2"
                onClick={clearBackground}
              >
                <X className="h-4 w-4" /> Clear Background
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomBackgroundSelector;
