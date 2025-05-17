
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BibleLanguage, LanguageOption } from '@/types/LanguageTypes';
import LanguageService from '@/services/LanguageService';
import { Badge } from '@/components/ui/badge';
import OfflineVerseService from '@/services/OfflineVerseService';

interface AdvancedLanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  isOfflineMode?: boolean;
}

const AdvancedLanguageSwitcher: React.FC<AdvancedLanguageSwitcherProps> = ({ 
  currentLanguage, 
  onLanguageChange,
  isOfflineMode = false
}) => {
  const { toast } = useToast();
  const [downloadOptions, setDownloadOptions] = useState(false);
  const [languages, setLanguages] = useState<BibleLanguage[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Record<string, boolean>>({});
  const [verseCount, setVerseCount] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  
  // Load languages from database
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await LanguageService.getActiveLanguages();
        setLanguages(langs);
        
        // Set offline flags based on downloaded status
        const downloadedLangs = OfflineVerseService.getDownloadedLanguages();
        const initialSelected = downloadedLangs.reduce((acc, lang) => {
          acc[lang.code] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setSelectedLanguages(initialSelected);
      } catch (error) {
        console.error('Error fetching languages:', error);
        toast({
          title: "Error",
          description: "Could not load available languages",
          variant: "destructive"
        });
      }
    };
    
    fetchLanguages();
  }, []);
  
  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === currentLanguage) return;
    
    // Check if language is available offline when in offline mode
    if (isOfflineMode && !OfflineVerseService.isLanguageDownloaded(languageCode)) {
      toast({
        title: "Language Not Available Offline",
        description: `The ${languageCode} language is not available in offline mode. Please download it first.`,
        variant: "destructive"
      });
      return;
    }
    
    // If language is not English, let's ensure it's active
    if (languageCode !== 'en') {
      const language = languages.find(l => l.language_code === languageCode);
      if (!language || !language.is_active) {
        toast({
          title: "Language Not Available",
          description: `The selected language is not active. Using English instead.`,
          variant: "destructive"
        });
        onLanguageChange('en');
        return;
      }
    }
    
    onLanguageChange(languageCode);
    
    toast({
      title: "Language Changed",
      description: `Switched to ${languages.find(l => l.language_code === languageCode)?.language_name || languageCode}`,
      duration: 2000,
    });
  };
  
  const handleLanguageSelect = (languageCode: string, selected: boolean) => {
    setSelectedLanguages(prev => ({
      ...prev,
      [languageCode]: selected
    }));
  };
  
  const handleDownloadLanguages = async () => {
    // Get languages that are selected for download
    const languagesToDownload = Object.entries(selectedLanguages)
      .filter(([_, selected]) => selected)
      .map(([code]) => code);
      
    if (languagesToDownload.length === 0) {
      toast({
        title: "No Languages Selected",
        description: "Please select at least one language to download",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    for (const langCode of languagesToDownload) {
      const language = languages.find(l => l.language_code === langCode);
      if (!language) continue;
      
      try {
        // Start progress at 10%
        setDownloadProgress(prev => ({ ...prev, [langCode]: 10 }));
        
        // Simulate progress (would be nice to have real progress in the future)
        const progressInterval = setInterval(() => {
          setDownloadProgress(prev => {
            const current = prev[langCode] || 10;
            if (current >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [langCode]: current + Math.floor(Math.random() * 15) };
          });
        }, 500);
        
        // Actually download the verses
        const success = await OfflineVerseService.cacheVerses(verseCount, langCode);
        
        // Set progress to 100%
        setDownloadProgress(prev => ({ ...prev, [langCode]: 100 }));
        
        // Stop the interval
        clearInterval(progressInterval);
        
        if (success) {
          toast({
            title: "Download Complete",
            description: `Successfully downloaded ${verseCount} verses for ${language.language_name}`
          });
        } else {
          toast({
            title: "Download Failed",
            description: `Failed to download verses for ${language.language_name}`,
            variant: "destructive"
          });
        }
        
        // Add a small delay between downloads to avoid overloading
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error downloading ${langCode}:`, error);
        toast({
          title: "Download Error",
          description: `An error occurred while downloading ${language.language_name}`,
          variant: "destructive"
        });
      }
    }
    
    setIsLoading(false);
    setDownloadOptions(false);
    
    // Refresh the page if we're in offline mode to ensure the new languages are loaded
    if (isOfflineMode) {
      toast({
        title: "Refresh Required",
        description: "Please refresh the page to use the newly downloaded languages in offline mode",
        duration: 5000
      });
    }
  };
  
  const handleClearLanguageCache = (languageCode: string) => {
    const language = languages.find(l => l.language_code === languageCode);
    if (!language) return;
    
    try {
      OfflineVerseService.clearCache(languageCode);
      
      // Update selected languages
      setSelectedLanguages(prev => ({
        ...prev,
        [languageCode]: false
      }));
      
      toast({
        title: "Cache Cleared",
        description: `Cleared offline cache for ${language.language_name}`
      });
      
    } catch (error) {
      console.error(`Error clearing cache for ${languageCode}:`, error);
      toast({
        title: "Error",
        description: `Failed to clear cache for ${language.language_name}`,
        variant: "destructive"
      });
    }
  };
  
  // Get list of languages available for the dropdown
  const getLanguageOptions = (): LanguageOption[] => {
    if (isOfflineMode) {
      // In offline mode, only show downloaded languages and ensure English is always available
      const downloadedLangs = OfflineVerseService.getDownloadedLanguages();
      let offlineOptions = downloadedLangs.map(dl => {
        const lang = languages.find(l => l.language_code === dl.code);
        return {
          value: dl.code,
          label: lang?.language_name || dl.code
        };
      });
      
      // Ensure English is always available
      if (!downloadedLangs.some(dl => dl.code === 'en')) {
        offlineOptions.unshift({ 
          value: 'en',
          label: 'English'
        });
      }
      
      return offlineOptions;
    } else {
      // In online mode, show active languages
      return languages
        .filter(l => l.is_active)
        .map(l => ({
          value: l.language_code,
          label: l.language_name
        }));
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">
              {languages.find(l => l.language_code === currentLanguage)?.language_name || 
               (currentLanguage === 'en' ? 'English' : currentLanguage === 'fil' ? 'Filipino' : currentLanguage)}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select Language</DropdownMenuLabel>
          
          {getLanguageOptions().map(option => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => handleLanguageChange(option.value)}
              className={currentLanguage === option.value ? 'bg-secondary' : ''}
            >
              <div className="flex items-center w-full justify-between">
                <span>{option.label}</span>
                {currentLanguage === option.value && (
                  <Check className="h-4 w-4 ml-2" />
                )}
                {OfflineVerseService.isLanguageDownloaded(option.value) && (
                  <Badge variant="outline" className="ml-2 text-xs">Offline</Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setDownloadOptions(true)}>
            <Download className="h-4 w-4 mr-2" />
            Download Languages
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Download Languages Dialog */}
      <Dialog open={downloadOptions} onOpenChange={setDownloadOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download Languages</DialogTitle>
            <DialogDescription>
              Select languages to download for offline use.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="verse-count">Number of verses to download:</Label>
              <Input
                id="verse-count"
                type="number"
                value={verseCount}
                onChange={(e) => setVerseCount(Math.max(50, parseInt(e.target.value) || 500))}
                min={50}
                max={2000}
              />
              <p className="text-xs text-muted-foreground">
                More verses will take up more storage space.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Select languages:</Label>
              
              {/* Only show active languages in the download dialog */}
              {languages.filter(l => l.is_active).map(language => {
                const isDownloaded = OfflineVerseService.isLanguageDownloaded(language.language_code);
                const progress = downloadProgress[language.language_code] || 0;
                
                return (
                  <div key={language.language_code} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`download-${language.language_code}`}
                        checked={!!selectedLanguages[language.language_code]}
                        onChange={(e) => setSelectedLanguages(prev => ({
                          ...prev, 
                          [language.language_code]: e.target.checked
                        }))}
                        className="h-4 w-4 rounded"
                        disabled={isLoading && progress === 0}
                      />
                      <Label htmlFor={`download-${language.language_code}`} className="cursor-pointer">
                        {language.language_name}
                      </Label>
                    </div>
                    
                    <div className="flex items-center">
                      {progress > 0 && progress < 100 ? (
                        <span className="text-sm">{progress}%</span>
                      ) : isDownloaded ? (
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            OfflineVerseService.clearCache(language.language_code);
                            setSelectedLanguages(prev => ({
                              ...prev,
                              [language.language_code]: false
                            }));
                            toast({
                              title: "Cache Cleared",
                              description: `Cleared offline cache for ${language.language_name}`
                            });
                          }}
                          disabled={isLoading}
                        >
                          <span className="text-xs text-red-500">Clear</span>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setDownloadOptions(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                // Get languages that are selected for download
                const languagesToDownload = Object.entries(selectedLanguages)
                  .filter(([_, selected]) => selected)
                  .map(([code]) => code);
                  
                if (languagesToDownload.length === 0) {
                  toast({
                    title: "No Languages Selected",
                    description: "Please select at least one language to download",
                    variant: "destructive"
                  });
                  return;
                }
                
                setIsLoading(true);
                
                for (const langCode of languagesToDownload) {
                  const language = languages.find(l => l.language_code === langCode);
                  if (!language) continue;
                  
                  try {
                    // Update progress while downloading
                    setDownloadProgress(prev => ({ ...prev, [langCode]: 10 }));
                    
                    const success = await OfflineVerseService.cacheVerses(verseCount, langCode);
                    
                    // Set progress to 100%
                    setDownloadProgress(prev => ({ ...prev, [langCode]: 100 }));
                    
                    if (success) {
                      toast({
                        title: "Download Complete",
                        description: `Successfully downloaded ${verseCount} verses for ${language.language_name}`
                      });
                    } else {
                      toast({
                        title: "Download Failed",
                        description: `Failed to download verses for ${language.language_name}`,
                        variant: "destructive"
                      });
                    }
                    
                    // Add a small delay between downloads
                    await new Promise(resolve => setTimeout(resolve, 500));
                  } catch (error) {
                    console.error(`Error downloading ${langCode}:`, error);
                    toast({
                      title: "Download Error",
                      description: `An error occurred while downloading ${language.language_name}`,
                      variant: "destructive"
                    });
                  }
                }
                
                setIsLoading(false);
                setDownloadOptions(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Downloading..." : "Download Selected"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdvancedLanguageSwitcher;
