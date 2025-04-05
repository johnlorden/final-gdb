
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Twitter, Facebook, Mail, Instagram, Linkedin, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import BookmarkVerse from './BookmarkVerse';
import { ShareTemplate, ShareTemplateSelector } from './ShareTemplateSelector';
import TextToSpeech from './TextToSpeech';
import VerseQRCode from './VerseQRCode';
import CustomBackgroundSelector from './CustomBackgroundSelector';
import AddToHomeScreen from './AddToHomeScreen';

interface SocialShareBarProps {
  verse: string;
  reference: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  category?: string;
}

const SocialShareBar: React.FC<SocialShareBarProps> = ({ verse, reference, cardRef, category }) => {
  const { toast } = useToast();
  const [template, setTemplate] = useState<ShareTemplate>('default');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // Don't try to share if no verse is loaded
  if (!verse || !reference) {
    return null;
  }
  
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
        
        // Apply export styles to the clone based on template
        clonedElement.style.padding = '20px';
        clonedElement.style.borderRadius = '8px';
        clonedElement.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        
        // Apply template-specific styling
        if (template === 'minimal') {
          clonedElement.style.padding = '30px';
          const innerElements = clonedElement.querySelectorAll('p');
          innerElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.fontFamily = 'sans-serif';
              el.style.lineHeight = '1.8';
            }
          });
        } else if (template === 'elegant') {
          clonedElement.style.padding = '35px';
          clonedElement.style.backgroundColor = '#f8f5ff';
          const innerElements = clonedElement.querySelectorAll('p');
          innerElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.fontFamily = 'serif';
              el.style.fontStyle = 'italic';
            }
          });
        } else if (template === 'gradient' || template === 'custom') {
          clonedElement.style.padding = '35px';
          
          // Apply custom background
          if (backgroundImage) {
            clonedElement.style.backgroundImage = `url(${backgroundImage})`;
            clonedElement.style.backgroundSize = 'cover';
            clonedElement.style.backgroundPosition = 'center';
            
            // Add text shadow for better legibility
            const textElements = clonedElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
            textElements.forEach(el => {
              if (el instanceof HTMLElement) {
                el.style.textShadow = '1px 1px 3px rgba(0,0,0,0.3)';
              }
            });
          } else {
            // Apply gradient or solid background
            clonedElement.style.background = backgroundColor;
          }
          
          // Set text color based on background brightness
          if (backgroundColor.includes('#171717') || backgroundColor.includes('220, 78%, 29%')) {
            const textElements = clonedElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
            textElements.forEach(el => {
              if (el instanceof HTMLElement) {
                el.style.color = '#ffffff';
              }
            });
          }
        }
        
        // Remove any rounded corners from inner elements
        const innerElements = clonedElement.querySelectorAll('*');
        innerElements.forEach(el => {
          if (el instanceof HTMLElement) {
            const style = window.getComputedStyle(el);
            if (parseInt(style.borderRadius) > 0) {
              el.style.borderRadius = '8px';
            }
          }
        });
        
        // Add watermark
        const watermark = document.createElement('div');
        watermark.style.position = 'absolute';
        watermark.style.bottom = '10px';
        watermark.style.right = '10px';
        watermark.style.fontSize = '10px';
        watermark.style.opacity = '0.7';
        watermark.style.color = template === 'gradient' && backgroundColor.includes('dark') ? '#fff' : '#666';
        watermark.textContent = 'Daily Bible Verse';
        clonedElement.style.position = 'relative';
        clonedElement.appendChild(watermark);
        
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
  
  const shareWithImage = async (platform: 'twitter' | 'facebook' | 'email' | 'instagram' | 'linkedin') => {
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
        case 'instagram':
          // Instagram doesn't have a direct share URL, so we'll just download the image and notify user
          if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `bible-verse-${reference.replace(/\s+/g, '-').replace(/:/g, '-')}.png`;
            link.click();
            
            toast({
              title: "Image Downloaded for Instagram",
              description: "Save this image and share it on Instagram",
              duration: 3000,
            });
          }
          break;
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodeURIComponent(shareText)}`,
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
      
      // Fallback to regular sharing
      const shareText = `${verseText}`;
      const url = platform === 'twitter'
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}&hashtags=Bible,DailyVerse`
        : platform === 'facebook'
          ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}&quote=${encodeURIComponent(shareText)}`
          : platform === 'linkedin'
            ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareURL)}&summary=${encodeURIComponent(shareText)}`
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
    <div className="flex flex-col gap-3 my-4 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <ShareTemplateSelector 
          currentTemplate={template} 
          onTemplateChange={setTemplate}
          currentBackgroundColor={backgroundColor}
          onBackgroundColorChange={setBackgroundColor}
          currentBackgroundImage={backgroundImage}
          onBackgroundImageChange={setBackgroundImage}
        />
        
        <CustomBackgroundSelector
          onSelectBackground={setBackgroundImage}
          currentBackground={backgroundImage}
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-2">
        <BookmarkVerse 
          verse={verse} 
          reference={reference} 
          category={category}
        />
        
        <TextToSpeech 
          text={verse} 
          reference={reference} 
        />
        
        <VerseQRCode 
          verse={verse} 
          reference={reference} 
        />
        
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
          onClick={() => shareWithImage('linkedin')} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Linkedin className="h-4 w-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </Button>
        
        <Button 
          onClick={() => shareWithImage('instagram')} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Instagram className="h-4 w-4" />
          <span className="hidden sm:inline">Instagram</span>
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
      
      <div className="flex justify-center mt-2">
        <AddToHomeScreen />
      </div>
    </div>
  );
};

export default SocialShareBar;
