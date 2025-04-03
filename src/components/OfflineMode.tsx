
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff } from 'lucide-react';
import OfflineVerseService from '@/services/OfflineVerseService';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OfflineModeProps {
  isOffline: boolean;
  toggleOfflineMode: () => void;
}

const OfflineMode: React.FC<OfflineModeProps> = ({ isOffline, toggleOfflineMode }) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [verseCount, setVerseCount] = useState(100);
  
  const cacheVersesForOffline = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setProgress(10);
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          return newProgress < 90 ? newProgress : 90;
        });
      }, 300);
      
      const success = await OfflineVerseService.cacheVerses(verseCount);
      
      clearInterval(interval);
      setProgress(100);
      
      if (success) {
        toast({
          title: "Offline Mode Ready",
          description: `${verseCount} verses cached for offline use`,
          duration: 3000,
        });
        toggleOfflineMode();
      } else {
        toast({
          title: "Offline Mode Setup Failed",
          description: "Could not cache verses. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set up offline mode",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsDownloading(false);
      setProgress(0);
      setShowDialog(false);
    }
  };
  
  const handleToggleOfflineMode = () => {
    if (!isOffline && !OfflineVerseService.isOfflineModeAvailable()) {
      setShowDialog(true);
    } else {
      toggleOfflineMode();
    }
  };
  
  // Check if the app is actually offline
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      if (!navigator.onLine && !isOffline && OfflineVerseService.isOfflineModeAvailable()) {
        toggleOfflineMode();
        toast({
          title: "You're Offline",
          description: "Switched to offline mode automatically",
          duration: 3000,
        });
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    // Initial check
    handleOnlineStatusChange();
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [isOffline, toggleOfflineMode]);
  
  return (
    <>
      <Button
        variant={isOffline ? "default" : "ghost"}
        size="sm"
        className="gap-1"
        onClick={handleToggleOfflineMode}
        title={isOffline ? "Exit Offline Mode" : "Enter Offline Mode"}
      >
        {isOffline ? (
          <>
            <WifiOff className="h-4 w-4" />
            <span className="hidden sm:inline">Offline</span>
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4" />
            <span className="hidden sm:inline">Offline Mode</span>
          </>
        )}
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download verses for offline use</DialogTitle>
            <DialogDescription>
              This will store Bible verses on your device so you can use the app without an internet connection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="verseCount" className="text-sm font-medium">
                Number of verses to download:
              </label>
              <input
                id="verseCount"
                type="range"
                min="20"
                max="500"
                step="10"
                value={verseCount}
                onChange={(e) => setVerseCount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>20</span>
                <span>{verseCount} verses</span>
                <span>500</span>
              </div>
            </div>
            
            {isDownloading && (
              <div className="flex flex-col gap-2">
                <Progress value={progress} className="w-full h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Downloading verses... {progress}%
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isDownloading}
            >
              Cancel
            </Button>
            <Button
              onClick={cacheVersesForOffline}
              disabled={isDownloading}
            >
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfflineMode;
