
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play, Volume } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface TextToSpeechProps {
  text: string;
  reference: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, reference }) => {
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVoicesLoaded, setIsVoicesLoaded] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  // Initialize speech synthesis and load available voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        
        // Try to find and select an English voice by default
        const englishVoice = availableVoices.find(voice => 
          voice.lang.includes('en') && voice.localService
        );
        
        if (englishVoice) {
          setSelectedVoice(englishVoice.name);
        } else {
          setSelectedVoice(availableVoices[0].name);
        }
        
        setIsVoicesLoaded(true);
      }
    };
    
    // Load voices that are already available
    loadVoices();
    
    // Some browsers load voices asynchronously, so listen for the voiceschanged event
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.cancel();
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);
  
  // Handle speaking state changes
  useEffect(() => {
    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    speechSynthesis.addEventListener('end', handleSpeechEnd);
    
    return () => {
      speechSynthesis.removeEventListener('end', handleSpeechEnd);
    };
  }, []);
  
  const speak = () => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Stop any current speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `${text} ${reference}`;
    utterance.rate = rate;
    
    if (selectedVoice) {
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    utterance.addEventListener('error', () => {
      toast({
        title: "Speech Error",
        description: "An error occurred while speaking.",
        variant: "destructive",
        duration: 3000,
      });
      setIsSpeaking(false);
    });
    
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };
  
  const pause = () => {
    speechSynthesis.pause();
    setIsPaused(true);
  };
  
  const resume = () => {
    speechSynthesis.resume();
    setIsPaused(false);
  };
  
  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };
  
  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak();
    }
  };
  
  if (!('speechSynthesis' in window)) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={togglePlayPause}
          disabled={!isVoicesLoaded}
          title={isSpeaking ? (isPaused ? "Resume" : "Pause") : "Listen"}
        >
          {isSpeaking ? (
            isPaused ? (
              <>
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Resume</span>
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" />
                <span className="hidden sm:inline">Pause</span>
              </>
            )
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Listen</span>
            </>
          )}
        </Button>
        
        {isSpeaking && (
          <Button
            variant="ghost"
            size="sm"
            onClick={stop}
            title="Stop"
          >
            <VolumeX className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          title="Voice settings"
        >
          <Volume className="h-4 w-4" />
        </Button>
      </div>
      
      {showSettings && (
        <div className="mt-2 p-4 border rounded-lg w-full max-w-xs">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Voice</label>
              <Select
                value={selectedVoice}
                onValueChange={setSelectedVoice}
                disabled={!isVoicesLoaded}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-muted-foreground">Speed</label>
                <span className="text-xs">{rate}x</span>
              </div>
              <Slider
                value={[rate]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={(values) => setRate(values[0])}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
