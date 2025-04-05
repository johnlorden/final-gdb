
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { QrCode, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VerseQRCodeProps {
  verse: string;
  reference: string;
}

type QRSize = "small" | "medium" | "large";

const VerseQRCode: React.FC<VerseQRCodeProps> = ({ verse, reference }) => {
  const [qrDataURL, setQrDataURL] = useState<string>('');
  const [size, setSize] = useState<QRSize>("medium");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  // Create URL with verse parameter for sharing
  const createShareURL = () => {
    const currentURL = new URL(window.location.href);
    currentURL.pathname = '/';
    currentURL.search = `?bibleverse=${encodeURIComponent(reference)}`;
    return currentURL.toString();
  };
  
  const generateQRCode = async () => {
    try {
      const url = createShareURL();
      
      // Set QR code size based on selection
      const qrSize = size === "small" ? 200 : size === "medium" ? 300 : 400;
      
      const dataURL = await QRCode.toDataURL(url, {
        width: qrSize,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      
      setQrDataURL(dataURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "QR Code Error",
        description: "Could not generate QR code. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // Generate QR code when dialog opens or size changes
  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, size, reference]);
  
  const downloadQRCode = () => {
    if (!qrDataURL) return;
    
    const link = document.createElement('a');
    link.href = qrDataURL;
    link.download = `bible-verse-qr-${reference.replace(/\s+/g, '-').replace(/:/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "QR code saved to your device",
      duration: 2000,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <QrCode className="h-4 w-4" />
          <span className="hidden sm:inline">QR Code</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for {reference}</DialogTitle>
          <DialogDescription>
            Share this verse by scanning the QR code with a mobile device
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex justify-center w-full">
            {qrDataURL ? (
              <img 
                src={qrDataURL} 
                alt={`QR Code for ${reference}`} 
                className="border rounded-lg p-2"
              />
            ) : (
              <div className="animate-pulse bg-gray-200 rounded-lg w-64 h-64"></div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <label className="text-sm font-medium">QR Code Size</label>
            <Select value={size} onValueChange={(value) => setSize(value as QRSize)}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={downloadQRCode} className="gap-2">
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerseQRCode;
