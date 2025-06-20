
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  siteName?: string;
}

const SEOHead = ({
  title = 'Vizualiza Visual Verse | Design e Identidade Visual',
  description = 'Estúdio de design especializado em identidade visual, web design e branding. Transformamos sua marca com soluções criativas e impactantes.',
  keywords = 'design, identidade visual, branding, web design, logo, marca, estúdio criativo',
  image = 'https://images.unsplash.com/photo-1586953209889-5ce391d8cd9b?w=1200&h=630&fit=crop',
  url = typeof window !== 'undefined' ? window.location.href : 'https://vizualiza.com.br',
  type = 'website',
  author = 'Gregory Vizualiza',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  locale = 'pt_BR',
  siteName = 'Vizualiza Visual Verse'
}: SEOHeadProps) => {
  
  // Extreme safety function that handles ALL edge cases
  const extremelySafeString = (value: any): string => {
    console.log('Processing value:', typeof value, value);
    
    // Handle null, undefined, and falsy values
    if (value === null || value === undefined || value === '') return '';
    
    // Handle Symbol values - this is the main culprit
    if (typeof value === 'symbol') {
      console.warn('Symbol value detected and filtered out:', value.toString());
      return '';
    }
    
    // Handle functions
    if (typeof value === 'function') {
      console.warn('Function value detected and filtered out');
      return '';
    }
    
    // Handle objects (except arrays and dates)
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        console.warn('Array value detected and filtered out');
        return '';
      }
      if (value instanceof Date) return value.toISOString();
      console.warn('Object value detected and filtered out');
      return '';
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') return value.toString();
    
    // Handle numbers (including NaN and Infinity)
    if (typeof value === 'number') {
      if (isNaN(value) || !isFinite(value)) {
        console.warn('Invalid number detected and filtered out:', value);
        return '';
      }
      return value.toString();
    }
    
    // Convert to string safely
    try {
      const stringValue = String(value);
      // Double-check that conversion didn't fail
      if (stringValue === '[object Object]' || stringValue.includes('Symbol(')) {
        console.warn('Problematic string conversion detected and filtered out:', stringValue);
        return '';
      }
      return stringValue;
    } catch (error) {
      console.error('Error converting value to string:', value, error);
      return '';
    }
  };

  // Process all values with extreme safety
  const safeTitle = extremelySafeString(title);
  const safeDescription = extremelySafeString(description);
  const safeKeywords = extremelySafeString(keywords);
  const safeImage = extremelySafeString(image);
  const safeUrl = extremelySafeString(url);
  const safeAuthor = extremelySafeString(author);
  const safeLocale = extremelySafeString(locale);
  const safeSiteName = extremelySafeString(siteName);
  const safeType = extremelySafeString(type);
  const safePublishedTime = extremelySafeString(publishedTime);
  const safeModifiedTime = extremelySafeString(modifiedTime);
  const safeSection = extremelySafeString(section);

  // Safe array processing with additional validation
  const safeTags = Array.isArray(tags) 
    ? tags
        .filter(tag => {
          if (typeof tag === 'symbol') {
            console.warn('Symbol tag detected and filtered out');
            return false;
          }
          return tag !== null && tag !== undefined;
        })
        .map(tag => extremelySafeString(tag))
        .filter(tag => tag.length > 0)
    : [];

  console.log('Safe values processed:', {
    safeTitle,
    safeDescription,
    safeType,
    safeTags
  });

  // Only render if we have safe values - add more validation
  if (!safeTitle && !safeDescription) {
    console.warn('No safe title or description, not rendering SEOHead');
    return null;
  }

  // Create a completely safe meta tags array
  const metaTags = [];
  
  if (safeTitle) metaTags.push(<title key="title">{safeTitle}</title>);
  if (safeDescription) metaTags.push(<meta key="description" name="description" content={safeDescription} />);
  if (safeKeywords) metaTags.push(<meta key="keywords" name="keywords" content={safeKeywords} />);
  if (safeAuthor) metaTags.push(<meta key="author" name="author" content={safeAuthor} />);
  
  // Static meta tags (no dynamic content)
  metaTags.push(<meta key="robots" name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />);
  metaTags.push(<meta key="language" name="language" content="Portuguese" />);
  metaTags.push(<meta key="revisit" name="revisit-after" content="7 days" />);
  
  // Canonical URL
  if (safeUrl) metaTags.push(<link key="canonical" rel="canonical" href={safeUrl} />);
  
  // Open Graph Tags
  if (safeType) metaTags.push(<meta key="og:type" property="og:type" content={safeType} />);
  if (safeTitle) metaTags.push(<meta key="og:title" property="og:title" content={safeTitle} />);
  if (safeDescription) metaTags.push(<meta key="og:description" property="og:description" content={safeDescription} />);
  if (safeImage) {
    metaTags.push(<meta key="og:image" property="og:image" content={safeImage} />);
    metaTags.push(<meta key="og:image:width" property="og:image:width" content="1200" />);
    metaTags.push(<meta key="og:image:height" property="og:image:height" content="630" />);
    if (safeTitle) metaTags.push(<meta key="og:image:alt" property="og:image:alt" content={safeTitle} />);
  }
  if (safeUrl) metaTags.push(<meta key="og:url" property="og:url" content={safeUrl} />);
  if (safeSiteName) metaTags.push(<meta key="og:site_name" property="og:site_name" content={safeSiteName} />);
  if (safeLocale) metaTags.push(<meta key="og:locale" property="og:locale" content={safeLocale} />);
  
  // Article specific OG tags
  if (safeType === 'article') {
    if (safeAuthor) metaTags.push(<meta key="article:author" property="article:author" content={safeAuthor} />);
    if (safePublishedTime) metaTags.push(<meta key="article:published_time" property="article:published_time" content={safePublishedTime} />);
    if (safeModifiedTime) metaTags.push(<meta key="article:modified_time" property="article:modified_time" content={safeModifiedTime} />);
    if (safeSection) metaTags.push(<meta key="article:section" property="article:section" content={safeSection} />);
    safeTags.forEach((tag, index) => {
      metaTags.push(<meta key={`article:tag:${index}`} property="article:tag" content={tag} />);
    });
  }
  
  // Twitter Card Tags
  metaTags.push(<meta key="twitter:card" name="twitter:card" content="summary_large_image" />);
  metaTags.push(<meta key="twitter:site" name="twitter:site" content="@vizualiza" />);
  metaTags.push(<meta key="twitter:creator" name="twitter:creator" content="@vizualiza" />);
  if (safeTitle) metaTags.push(<meta key="twitter:title" name="twitter:title" content={safeTitle} />);
  if (safeDescription) metaTags.push(<meta key="twitter:description" name="twitter:description" content={safeDescription} />);
  if (safeImage) {
    metaTags.push(<meta key="twitter:image" name="twitter:image" content={safeImage} />);
    if (safeTitle) metaTags.push(<meta key="twitter:image:alt" name="twitter:image:alt" content={safeTitle} />);
  }
  
  // Additional static meta tags
  metaTags.push(<meta key="theme-color" name="theme-color" content="#8B5CF6" />);
  metaTags.push(<meta key="msapplication-tile" name="msapplication-TileColor" content="#8B5CF6" />);
  metaTags.push(<meta key="apple-mobile-capable" name="apple-mobile-web-app-capable" content="yes" />);
  metaTags.push(<meta key="apple-mobile-status" name="apple-mobile-web-app-status-bar-style" content="black-translucent" />);
  metaTags.push(<meta key="format-detection" name="format-detection" content="telephone=no" />);
  
  // Geo Tags
  metaTags.push(<meta key="geo.region" name="geo.region" content="BR-SP" />);
  metaTags.push(<meta key="geo.placename" name="geo.placename" content="São Paulo" />);
  metaTags.push(<meta key="geo.position" name="geo.position" content="-23.5505;-46.6333" />);
  metaTags.push(<meta key="ICBM" name="ICBM" content="-23.5505, -46.6333" />);
  
  // Preconnect links
  metaTags.push(<link key="preconnect-fonts" rel="preconnect" href="https://fonts.googleapis.com" />);
  metaTags.push(<link key="preconnect-fonts-gstatic" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />);
  metaTags.push(<link key="preconnect-images" rel="preconnect" href="https://images.unsplash.com" />);
  
  // DNS Prefetch
  metaTags.push(<link key="dns-prefetch-ga" rel="dns-prefetch" href="//www.google-analytics.com" />);
  metaTags.push(<link key="dns-prefetch-fonts" rel="dns-prefetch" href="//fonts.googleapis.com" />);
  metaTags.push(<link key="dns-prefetch-images" rel="dns-prefetch" href="//images.unsplash.com" />);

  console.log('Rendering SEOHead with', metaTags.length, 'meta tags');

  return (
    <Helmet>
      {metaTags}
    </Helmet>
  );
};

export default SEOHead;
