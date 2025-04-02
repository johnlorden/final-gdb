
import React from 'react';
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
  
  const generateImage = async () => {
    try {
      if (cardRef?.current) {
        // Create a clone of the element for export to avoid modifying the original
        const clonedElement = cardRef.current.cloneNode(true) as HTMLElement;
        document.body.appendChild(clonedElement);
        
        // Apply export styles to the clone
        clonedElement.style.padding = '30px';
        clonedElement.style.borderRadius = '0px';
        clonedElement.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        
        // Generate image from verse card
        const canvas = await html2canvas(clonedElement, { 
          backgroundColor: null,
          scale: 3, // Better quality
          useCORS: true,
          allowTaint: true,
          logging: false
        });
        
        // Remove the clone
        document.body.removeChild(clonedElement);
        
        const imageUrl = canvas.toDataURL('image/png');
        
        // Store image in local storage
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
      // Generate and save the image first
      const imageUrl = await generateImage();
      
      // Share text with URL
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
          // Facebook sharing API
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
        title: `Shared on ${platform === 'email' ? 'Email' : platform === 'twitter' ? 'Twitter' : 'Facebook'}`,
        description: "Your verse has been shared successfully!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      
      // Fallback to regular sharing
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
