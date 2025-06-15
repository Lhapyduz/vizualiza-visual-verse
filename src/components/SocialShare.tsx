
import React from 'react';
import { Share2, Facebook, Twitter, Linkedin, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

const SocialShare = ({ 
  url = window.location.href, 
  title = 'Vizualiza Visual Verse', 
  description = 'Confira este projeto incrível!',
  className = ''
}: SocialShareProps) => {
  const { toast } = useToast();

  const shareData = {
    title,
    text: description,
    url
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
  };

  const openSocialShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {navigator.share && (
        <Button
          onClick={handleNativeShare}
          variant="outline"
          size="sm"
          className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      )}
      
      <Button
        onClick={() => openSocialShare('facebook')}
        variant="outline"
        size="icon"
        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        title="Compartilhar no Facebook"
      >
        <Facebook className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={() => openSocialShare('twitter')}
        variant="outline"
        size="icon"
        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
        title="Compartilhar no Twitter"
      >
        <Twitter className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={() => openSocialShare('linkedin')}
        variant="outline"
        size="icon"
        className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
        title="Compartilhar no LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={() => openSocialShare('whatsapp')}
        variant="outline"
        size="icon"
        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
        title="Compartilhar no WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={copyToClipboard}
        variant="outline"
        size="icon"
        className="border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
        title="Copiar link"
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SocialShare;
