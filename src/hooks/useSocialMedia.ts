
import { useState, useEffect } from 'react';

export interface SocialMedia {
  id: string;
  platform: string;
  handle: string;
  url: string;
  icon: string;
  color: string;
  isActive: boolean;
}

const DEFAULT_SOCIAL_MEDIA: SocialMedia[] = [
  {
    id: '1',
    platform: 'Instagram',
    handle: '@vizualizaoficial',
    url: 'https://instagram.com/vizualizaoficial',
    icon: 'instagram',
    color: 'from-purple-600 to-pink-600',
    isActive: true
  }
];

export const useSocialMedia = () => {
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar redes sociais do localStorage
    const saved = localStorage.getItem('vizualiza-social-medias');
    if (saved) {
      try {
        const parsedSocialMedias = JSON.parse(saved);
        // Filtrar LinkedIn se existir
        const filteredSocialMedias = parsedSocialMedias.filter(
          (media: SocialMedia) => media.platform.toLowerCase() !== 'linkedin'
        );
        setSocialMedias(filteredSocialMedias);
      } catch (error) {
        console.error('Error loading social medias:', error);
        setSocialMedias(DEFAULT_SOCIAL_MEDIA);
      }
    } else {
      setSocialMedias(DEFAULT_SOCIAL_MEDIA);
    }
    setIsLoading(false);
  }, []);

  const saveSocialMedias = (medias: SocialMedia[]) => {
    // Garantir que LinkedIn não seja salvo
    const filteredMedias = medias.filter(
      media => media.platform.toLowerCase() !== 'linkedin'
    );
    setSocialMedias(filteredMedias);
    localStorage.setItem('vizualiza-social-medias', JSON.stringify(filteredMedias));
  };

  const addSocialMedia = (media: Omit<SocialMedia, 'id'>) => {
    // Bloquear adição de LinkedIn
    if (media.platform.toLowerCase() === 'linkedin') {
      console.warn('LinkedIn não é mais suportado');
      return;
    }
    
    const newMedia = {
      ...media,
      id: Date.now().toString()
    };
    const updated = [...socialMedias, newMedia];
    saveSocialMedias(updated);
  };

  const updateSocialMedia = (id: string, updates: Partial<SocialMedia>) => {
    // Bloquear atualização para LinkedIn
    if (updates.platform?.toLowerCase() === 'linkedin') {
      console.warn('LinkedIn não é mais suportado');
      return;
    }
    
    const updated = socialMedias.map(media =>
      media.id === id ? { ...media, ...updates } : media
    );
    saveSocialMedias(updated);
  };

  const removeSocialMedia = (id: string) => {
    const updated = socialMedias.filter(media => media.id !== id);
    saveSocialMedias(updated);
  };

  const toggleSocialMedia = (id: string) => {
    updateSocialMedia(id, { isActive: !socialMedias.find(m => m.id === id)?.isActive });
  };

  const getActiveSocialMedias = () => {
    return socialMedias.filter(media => media.isActive);
  };

  return {
    socialMedias,
    isLoading,
    addSocialMedia,
    updateSocialMedia,
    removeSocialMedia,
    toggleSocialMedia,
    getActiveSocialMedias
  };
};
