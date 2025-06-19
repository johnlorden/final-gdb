
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Twitter, Facebook, Mail, Share2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface ShareButtonsProps {
  verse: string;
  reference: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  template: string;
  backgroundColor: string;
  backgroundImage: string | null;
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
  
  const downloadImage = async () => {
    try {
      if (cardRef?.current) {
        const clonedElement = cardRef.current.cloneNode(true) as HTMLElement;
        document.body.appendChild(clonedElement);
        
        // Style the cloned element for export
        clonedElement.style.position = 'fixed';
        clonedElement.style.top = '-9999px';
        clonedElement.style.left = '-9999px';
        clonedElement.style.padding = '30px';
        clonedElement.style.borderRadius = '12px';
        clonedElement.style.border = 'none';
        clonedElement.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        clonedElement.style.maxWidth = '600px';
        clonedElement.style.width = 'auto';
        
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
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: clonedElement.offsetWidth,
          height: clonedElement.offsetHeight
        });
        
        document.body.removeChild(clonedElement);
        
        // Create download link
        const imageUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `bible-verse-${reference.replace(/\s+/g, '-').replace(/:/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Image Downloaded",
          description: "Verse image has been saved to your device",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };
  
  const shareWithImage = async (platform: 'twitter' | 'facebook' | 'email') => {
    try {
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
      toast({
        title: "Sharing Failed",
        description: "Please try again",
        variant: "destructive",
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
        onClick={downloadImage} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Download</span>
      </Button>
      
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
