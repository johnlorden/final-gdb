
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check, Settings, Plus, Trash, Download } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BibleLanguage, LanguageOption } from '@/types/LanguageTypes';
import { useClickOutside } from '@/hooks/use-click-outside';
import LanguageService from '@/services/LanguageService';
import { Switch } from '@/components/ui/switch';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import OfflineVerseService from '@/services/OfflineVerseService';
import { supabase } from '@/integrations/supabase/client';

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
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [languages, setLanguages] = useState<BibleLanguage[]>([]);
  const [newLanguage, setNewLanguage] = useState({
    language_code: '',
    language_name: '',
    xml_url: '',
    is_active: true
  });
  const [downloadOptions, setDownloadOptions] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<Record<string, boolean>>({});
  const [verseCount, setVerseCount] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  
  // Get the current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        
        // Check if user is admin
        if (data.user.email === 'admin@example.com') {
          setIsAdmin(true);
        }
      }
    };
    
    getUser();
  }, []);
  
  // Load languages from database
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await LanguageService.getAllLanguages();
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
    
    onLanguageChange(languageCode);
    
    toast({
      title: "Language Changed",
      description: `Switched to ${languages.find(l => l.language_code === languageCode)?.language_name || languageCode}`,
      duration: 2000,
    });
  };
  
  const handleAddLanguage = async () => {
    if (!newLanguage.language_code.trim() || !newLanguage.language_name.trim() || !newLanguage.xml_url.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await LanguageService.addLanguage({
        language_code: newLanguage.language_code.trim(),
        language_name: newLanguage.language_name.trim(),
        xml_url: newLanguage.xml_url.trim(),
        is_active: newLanguage.is_active
      });
      
      if (result) {
        setLanguages([...languages, result]);
        
        toast({
          title: "Success",
          description: `Added ${result.language_name} language`
        });
        
        setIsAddOpen(false);
        setNewLanguage({
          language_code: '',
          language_name: '',
          xml_url: '',
          is_active: true
        });
      }
    } catch (error) {
      console.error('Error adding language:', error);
      toast({
        title: "Error",
        description: "Failed to add language",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleActive = async (languageCode: string, isActive: boolean) => {
    const language = languages.find(l => l.language_code === languageCode);
    if (!language) return;
    
    setIsLoading(true);
    
    try {
      const success = await LanguageService.updateLanguage({
        ...language,
        is_active: isActive
      });
      
      if (success) {
        setLanguages(languages.map(l => 
          l.language_code === languageCode ? { ...l, is_active: isActive } : l
        ));
        
        toast({
          title: isActive ? "Language Activated" : "Language Deactivated",
          description: `${language.language_name} has been ${isActive ? 'activated' : 'deactivated'}`
        });
      }
    } catch (error) {
      console.error('Error updating language:', error);
      toast({
        title: "Error",
        description: "Failed to update language status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
          // If user is logged in, save their preference
          if (userId) {
            await LanguageService.saveUserLanguagePreference(
              userId,
              langCode,
              true,
              verseCount
            );
          }
          
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
      
      // If user is logged in, update their preference
      if (userId) {
        LanguageService.saveUserLanguagePreference(
          userId,
          languageCode,
          false,
          0
        );
      }
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
      // In offline mode, only show downloaded languages
      const downloadedLangs = OfflineVerseService.getDownloadedLanguages();
      return downloadedLangs.map(dl => {
        const lang = languages.find(l => l.language_code === dl.code);
        return {
          value: dl.code,
          label: lang?.language_name || dl.code
        };
      });
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
          
          {isAdmin && (
            <DropdownMenuItem onClick={() => setIsManageOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Languages
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Language Management Sheet */}
      <Sheet open={isManageOpen} onOpenChange={setIsManageOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Manage Languages</SheetTitle>
            <SheetDescription>
              Add, edit or remove languages from the application.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-4 space-y-4">
            <Button onClick={() => setIsAddOpen(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add New Language
            </Button>
            
            <div className="space-y-4">
              {languages.map(language => (
                <div key={language.language_code} className="flex flex-col border rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{language.language_name}</span>
                    <div className="flex items-center">
                      <Switch 
                        checked={language.is_active} 
                        onCheckedChange={(checked) => handleToggleActive(language.language_code, checked)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Code: {language.language_code}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 truncate">
                    URL: {language.xml_url}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Add Language Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Language</DialogTitle>
            <DialogDescription>
              Enter the details for the new language.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lang-code" className="text-right">
                Code
              </Label>
              <Input
                id="lang-code"
                placeholder="en"
                value={newLanguage.language_code}
                onChange={(e) => setNewLanguage({...newLanguage, language_code: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lang-name" className="text-right">
                Name
              </Label>
              <Input
                id="lang-name"
                placeholder="English"
                value={newLanguage.language_name}
                onChange={(e) => setNewLanguage({...newLanguage, language_name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lang-url" className="text-right">
                XML URL
              </Label>
              <Input
                id="lang-url"
                placeholder="/data/bible-verses.xml"
                value={newLanguage.xml_url}
                onChange={(e) => setNewLanguage({...newLanguage, xml_url: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lang-active" className="text-right">
                Active
              </Label>
              <div className="col-span-3">
                <Switch
                  id="lang-active"
                  checked={newLanguage.is_active}
                  onCheckedChange={(checked) => setNewLanguage({...newLanguage, is_active: checked})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddLanguage} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Language"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
                        onChange={(e) => handleLanguageSelect(language.language_code, e.target.checked)}
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
                          onClick={() => handleClearLanguageCache(language.language_code)}
                          disabled={isLoading}
                        >
                          <Trash className="h-4 w-4" />
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
            <Button onClick={handleDownloadLanguages} disabled={isLoading}>
              {isLoading ? "Downloading..." : "Download Selected"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdvancedLanguageSwitcher;
