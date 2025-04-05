
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const AddToHomeScreen: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }
    
    // Store the event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Show banner if user hasn't dismissed it before
      const dismissed = localStorage.getItem('a2hs_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      toast({
        title: "Installation Started",
        description: "Thanks for installing our app!",
        duration: 3000,
      });
    } else {
      toast({
        title: "Installation Declined",
        description: "You can install the app later from the menu",
        duration: 3000,
      });
    }
    
    // Reset the installPrompt
    setInstallPrompt(null);
    setIsInstallable(false);
    setShowBanner(false);
  };
  
  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('a2hs_dismissed', 'true');
  };
  
  if (!isInstallable) {
    return null;
  }
  
  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 flex items-center justify-between z-50 shadow-lg">
          <div className="flex-1">
            <p className="font-medium">Install this app on your device</p>
            <p className="text-sm opacity-90">Access Bible verses even faster!</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleInstallClick}
              className="whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-1" /> Add to Home Screen
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={dismissBanner}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleInstallClick}
        className="gap-1"
      >
        <Plus className="h-4 w-4" />
        <span>Install App</span>
      </Button>
    </>
  );
};

export default AddToHomeScreen;
