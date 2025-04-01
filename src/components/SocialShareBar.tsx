
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Twitter, Facebook, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareBarProps {
  verse: string;
  reference: string;
}

const SocialShareBar: React.FC<SocialShareBarProps> = ({ verse, reference }) => {
  const { toast } = useToast();
  const verseText = `"${verse}" — ${reference}`;
  
  // Create URL with verse parameter for sharing
  const currentURL = new URL(window.location.href);
  currentURL.pathname = '/';
  currentURL.search = `?bibleverse=${encodeURIComponent(reference)}`;
  const shareURL = currentURL.toString();
  
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(verseText)}&url=${encodeURIComponent(shareURL)}&hashtags=Bible,DailyVerse`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}&quote=${encodeURIComponent(verseText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const shareByEmail = () => {
    const subject = `Bible Verse: ${reference}`;
    const body = `${verseText}\n\nRead more: ${shareURL}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(verseText + '\n\n' + shareURL).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Verse has been copied to clipboard",
        duration: 2000,
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    });
  };
  
  return (
    <div className="flex justify-center gap-2 my-4 w-full max-w-2xl mx-auto">
      <Button 
        onClick={copyToClipboard} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
      >
        <Copy className="h-4 w-4" />
        <span className="hidden sm:inline">Copy</span>
      </Button>
      <Button 
        onClick={shareToTwitter} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>
      <Button 
        onClick={shareToFacebook} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
      >
        <Facebook className="h-4 w-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      <Button 
        onClick={shareByEmail} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
      >
        <Mail className="h-4 w-4" />
        <span className="hidden sm:inline">Email</span>
      </Button>
    </div>
  );
};

export default SocialShareBar;
