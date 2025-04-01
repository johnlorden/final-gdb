
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Twitter, Facebook, Mail, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface SocialShareBarProps {
  verse: string;
  reference: string;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const SocialShareBar: React.FC<SocialShareBarProps> = ({ verse, reference, cardRef }) => {
  const { toast } = useToast();
  const verseText = `"${verse}" — ${reference}`;
  
  // Create URL with verse parameter for sharing
  const currentURL = new URL(window.location.href);
  currentURL.pathname = '/';
  currentURL.search = `?bibleverse=${encodeURIComponent(reference)}`;
  const shareURL = currentURL.toString();
  
  const shareWithImage = async (platform: 'twitter' | 'facebook' | 'email') => {
    try {
      let imageUrl = '';
      
      if (cardRef?.current) {
        // Generate image from verse card
        const canvas = await html2canvas(cardRef.current, { 
          backgroundColor: null,
          scale: 2 // Better quality
        });
        imageUrl = canvas.toDataURL('image/png');
        
        // Store image in local storage temporarily
        localStorage.setItem('verse_image', imageUrl);
      }
      
      // Share text with image and URL
      const shareText = `${verseText}\n\n${shareURL}`;
      
      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=Bible,DailyVerse`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        case 'facebook':
          // Facebook doesn't allow direct image sharing via URL parameters
          // We use the Facebook Share Dialog API
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}&quote=${encodeURIComponent(verseText)}`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        case 'email':
          const subject = `Bible Verse: ${reference}`;
          const body = `${verseText}\n\nRead more: ${shareURL}`;
          const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
          break;
      }
    } catch (error) {
      console.error('Error sharing with image:', error);
      
      // Fallback to regular sharing
      const shareText = `${verseText}\n\n${shareURL}`;
      const url = platform === 'twitter'
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=Bible,DailyVerse`
        : platform === 'facebook'
          ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}&quote=${encodeURIComponent(verseText)}`
          : `mailto:?subject=${encodeURIComponent(`Bible Verse: ${reference}`)}&body=${encodeURIComponent(`${verseText}\n\nRead more: ${shareURL}`)}`;
      
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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
        onClick={() => shareWithImage('twitter')} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>
      <Button 
        onClick={() => shareWithImage('facebook')} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
      >
        <Facebook className="h-4 w-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      <Button 
        onClick={() => shareWithImage('email')} 
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
