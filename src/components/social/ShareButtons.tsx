import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Twitter, Facebook, Mail, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface ShareButtonsProps {
  verse: string;
  reference: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  template: string;
  backgroundColor: string;
  backgroundImage: string | null; // Keep for type compatibility but won't use
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  verse, 
  reference, 
  cardRef,
  template,
  backgroundColor
}) => {
  const { toast } = useToast();
  const verseText = `"${verse}" — ${reference}`;
  
  const currentURL = new URL(window.location.href);
  currentURL.pathname = '/';
  currentURL.search = `?bibleverse=${encodeURIComponent(reference)}`;
  const shareURL = currentURL.toString();
  
  const generateImage = async () => {
    try {
      if (cardRef?.current) {
        const clonedElement = cardRef.current.cloneNode(true) as HTMLElement;
        document.body.appendChild(clonedElement);
        
        // Apply styling based on template
        clonedElement.style.padding = '20px';
        clonedElement.style.borderRadius = '8px';
        clonedElement.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        
        if (template === 'minimal') {
          clonedElement.style.padding = '30px';
          const innerElements = clonedElement.querySelectorAll('p');
          innerElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.fontFamily = 'sans-serif';
              el.style.lineHeight = '1.8';
            }
          });
        }
        
        // Apply background color
        clonedElement.style.backgroundColor = backgroundColor;
        
        // Add watermark
        const watermark = document.createElement('div');
        watermark.style.position = 'absolute';
        watermark.style.bottom = '10px';
        watermark.style.right = '10px';
        watermark.style.fontSize = '10px';
        watermark.style.opacity = '0.7';
        watermark.style.color = backgroundColor.includes('#171717') ? '#fff' : '#666';
        watermark.textContent = 'Daily Bible Verse';
        clonedElement.style.position = 'relative';
        clonedElement.appendChild(watermark);
        
        // Generate canvas
        const canvas = await html2canvas(clonedElement, { 
          backgroundColor: null,
          scale: 3,
          useCORS: true,
          allowTaint: true,
          logging: false
        });
        
        document.body.removeChild(clonedElement);
        
        const imageUrl = canvas.toDataURL('image/png');
        localStorage.setItem('verse_image', imageUrl);
        return imageUrl;
      }
      return null;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };
  
  const shareWithImage = async (platform: 'twitter' | 'facebook' | 'email') => {
    try {
      const imageUrl = await generateImage();
      
      const shareText = `${verseText}`;
      const appUrl = shareURL;
      
      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}&hashtags=Bible,DailyVerse`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        case 'email':
          const subject = `Bible Verse: ${reference}`;
          const body = `${shareText}\n\nRead more: ${appUrl}`;
          const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
          break;
      }
      
      toast({
        title: `Shared on ${platform === 'email' ? 'Email' : platform.charAt(0).toUpperCase() + platform.slice(1)}`,
        description: "Your verse has been shared successfully!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      
      const shareText = `${verseText}`;
      const url = platform === 'twitter'
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}&hashtags=Bible,DailyVerse`
        : platform === 'facebook'
          ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}&quote=${encodeURIComponent(shareText)}`
          : `mailto:?subject=${encodeURIComponent(`Bible Verse: ${reference}`)}&body=${encodeURIComponent(`${shareText}\n\nRead more: ${shareURL}`)}`;
      
      window.open(url, '_blank', 'noopener,noreferrer');
      toast({
        title: "Shared using fallback method",
        description: "We used a simpler sharing method",
        duration: 2000,
      });
    }
  };
  
  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bible Verse: ${reference}`,
          text: verseText,
          url: shareURL,
        });
        
        toast({
          title: "Shared Successfully",
          description: "Your verse has been shared",
          duration: 2000,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast({
            title: "Sharing Failed",
            description: "Please try using the other share buttons",
            variant: "destructive",
            duration: 2000,
          });
        }
      }
    } else {
      toast({
        title: "Web Share Not Supported",
        description: "Please use one of the other share options",
        duration: 2000,
      });
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
    <div className="flex flex-wrap justify-center gap-2">
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
      
      {navigator.share && (
        <Button 
          onClick={shareViaWebShare} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      )}
    </div>
  );
};
