
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Download, Database, Trash } from 'lucide-react';
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OfflineModeProps {
  isOffline: boolean;
  toggleOfflineMode: () => void;
}

const OfflineMode: React.FC<OfflineModeProps> = ({ isOffline, toggleOfflineMode }) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [verseCount, setVerseCount] = useState(500);
  const [cacheSize, setCacheSize] = useState(0);
  
  // Predefined verse count options
  const verseCounts = [
    { value: 100, label: '100 verses (~0.5MB)' },
    { value: 250, label: '250 verses (~1.2MB)' },
    { value: 500, label: '500 verses (~2.5MB)' },
    { value: 1000, label: '1000 verses (~5MB)' },
    { value: 2000, label: '2000 verses (~10MB)' },
  ];
  
  // Get the current cache size on mount
  useEffect(() => {
    if (OfflineVerseService.isOfflineModeAvailable()) {
      setCacheSize(OfflineVerseService.getCacheSize());
    }
  }, [isOffline]);
  
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
        setCacheSize(OfflineVerseService.getCacheSize());
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
  
  const clearCache = () => {
    OfflineVerseService.clearCache();
    setCacheSize(0);
    toast({
      title: "Cache Cleared",
      description: "All cached verses have been removed",
      duration: 3000,
    });
    
    if (isOffline) {
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
                Select how many verses to download:
              </label>
              
              <Select
                value={verseCount.toString()}
                onValueChange={(value) => setVerseCount(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select verse count" />
                </SelectTrigger>
                <SelectContent>
                  {verseCounts.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <p className="text-xs text-muted-foreground">
                More verses will take up more storage space but provide a better offline experience.
              </p>
            </div>
            
            {isDownloading && (
              <div className="flex flex-col gap-2">
                <Progress value={progress} className="w-full h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Downloading verses... {progress}%
                </p>
              </div>
            )}
            
            {cacheSize > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span>Current cache: <strong>{cacheSize} verses</strong></span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={clearCache}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Clear cached verses
                </Button>
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
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Verses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfflineMode;
