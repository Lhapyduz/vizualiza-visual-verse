
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
  
  // Ultra-safe string conversion that handles all edge cases
  const ultraSafeString = (value: any): string => {
    // Handle null, undefined, and falsy values
    if (value === null || value === undefined || value === '') return '';
    
    // Handle Symbol values
    if (typeof value === 'symbol') return '';
    
    // Handle functions
    if (typeof value === 'function') return '';
    
    // Handle objects (except arrays and dates)
    if (typeof value === 'object') {
      if (Array.isArray(value)) return '';
      if (value instanceof Date) return value.toISOString();
      return '';
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') return value.toString();
    
    // Handle numbers (including NaN and Infinity)
    if (typeof value === 'number') {
      if (isNaN(value) || !isFinite(value)) return '';
      return value.toString();
    }
    
    // Convert to string safely
    try {
      const stringValue = String(value);
      // Double-check that conversion didn't fail
      if (stringValue === '[object Object]' || stringValue.includes('Symbol(')) return '';
      return stringValue;
    } catch (error) {
      console.warn('Error converting value to string:', value, error);
      return '';
    }
  };

  // Safe array processing with additional validation
  const ultraSafeArray = (arr: any[]): string[] => {
    if (!Array.isArray(arr)) return [];
    
    return arr
      .filter(item => {
        // Filter out problematic values
        if (item === null || item === undefined) return false;
        if (typeof item === 'symbol') return false;
        if (typeof item === 'function') return false;
        if (typeof item === 'object' && !Array.isArray(item) && !(item instanceof Date)) return false;
        return true;
      })
      .map(item => ultraSafeString(item))
      .filter(item => item.length > 0);
  };

  // Process all values with ultra-safe conversion
  const safeTitle = ultraSafeString(title);
  const safeDescription = ultraSafeString(description);
  const safeKeywords = ultraSafeString(keywords);
  const safeImage = ultraSafeString(image);
  const safeUrl = ultraSafeString(url);
  const safeAuthor = ultraSafeString(author);
  const safeLocale = ultraSafeString(locale);
  const safeSiteName = ultraSafeString(siteName);
  const safeType = ultraSafeString(type);
  const safeTags = ultraSafeArray(tags);
  const safePublishedTime = ultraSafeString(publishedTime);
  const safeModifiedTime = ultraSafeString(modifiedTime);
  const safeSection = ultraSafeString(section);

  // Generate schema markup with safe values only
  const generateSchemaMarkup = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': safeType === 'article' ? 'BlogPosting' : 'Organization',
      name: safeSiteName,
      url: safeUrl,
      description: safeDescription,
      image: safeImage
    };

    if (safeType === 'article') {
      return {
        ...baseSchema,
        '@type': 'BlogPosting',
        headline: safeTitle,
        author: {
          '@type': 'Person',
          name: safeAuthor
        },
        publisher: {
          '@type': 'Organization',
          name: safeSiteName,
          logo: {
            '@type': 'ImageObject',
            url: 'https://images.unsplash.com/photo-1586953209889-5ce391d8cd9b?w=200&h=200&fit=crop'
          }
        },
        datePublished: safePublishedTime,
        dateModified: safeModifiedTime || safePublishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': safeUrl
        },
        articleSection: safeSection,
        keywords: safeTags.join(', ')
      };
    }

    if (safeType === 'website') {
      return {
        ...baseSchema,
        '@type': 'Organization',
        sameAs: [
          'https://www.instagram.com/vizualiza',
          'https://www.linkedin.com/company/vizualiza',
          'https://www.behance.net/vizualiza'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+55-11-99999-9999',
          contactType: 'customer service',
          availableLanguage: 'Portuguese'
        }
      };
    }

    return baseSchema;
  };

  const schemaMarkup = generateSchemaMarkup();

  // Ultra-safe JSON stringify with multiple safety layers
  const ultraSafeJsonStringify = (obj: any) => {
    try {
      const cleanObj = JSON.parse(JSON.stringify(obj, (key, value) => {
        // Multiple layers of safety
        if (typeof value === 'symbol') return undefined;
        if (typeof value === 'function') return undefined;
        if (typeof value === 'undefined') return undefined;
        if (value !== value) return undefined; // NaN check
        if (value === Infinity || value === -Infinity) return undefined;
        
        // Additional safety for strings
        if (typeof value === 'string') {
          if (value.includes('Symbol(')) return undefined;
          if (value === '[object Object]') return undefined;
        }
        
        return value;
      }));
      
      return JSON.stringify(cleanObj);
    } catch (error) {
      console.warn('Error stringifying schema markup:', error);
      return '{}';
    }
  };

  // Only render if we have safe values
  if (!safeTitle && !safeDescription) {
    return null;
  }

  return (
    <Helmet>
      {/* Basic Meta Tags - only render if values exist */}
      {safeTitle && <title>{safeTitle}</title>}
      {safeDescription && <meta name="description" content={safeDescription} />}
      {safeKeywords && <meta name="keywords" content={safeKeywords} />}
      {safeAuthor && <meta name="author" content={safeAuthor} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="Portuguese" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      {safeUrl && <link rel="canonical" href={safeUrl} />}
      
      {/* Open Graph Tags - only render if values exist */}
      {safeType && <meta property="og:type" content={safeType} />}
      {safeTitle && <meta property="og:title" content={safeTitle} />}
      {safeDescription && <meta property="og:description" content={safeDescription} />}
      {safeImage && <meta property="og:image" content={safeImage} />}
      {safeImage && <meta property="og:image:width" content="1200" />}
      {safeImage && <meta property="og:image:height" content="630" />}
      {safeTitle && <meta property="og:image:alt" content={safeTitle} />}
      {safeUrl && <meta property="og:url" content={safeUrl} />}
      {safeSiteName && <meta property="og:site_name" content={safeSiteName} />}
      {safeLocale && <meta property="og:locale" content={safeLocale} />}
      
      {/* Article specific OG tags - only render if article type and values exist */}
      {safeType === 'article' && (
        <>
          {safeAuthor && <meta property="article:author" content={safeAuthor} />}
          {safePublishedTime && <meta property="article:published_time" content={safePublishedTime} />}
          {safeModifiedTime && <meta property="article:modified_time" content={safeModifiedTime} />}
          {safeSection && <meta property="article:section" content={safeSection} />}
          {safeTags.map((tag, index) => (
            <meta key={`article-tag-${index}`} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Tags - only render if values exist */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vizualiza" />
      <meta name="twitter:creator" content="@vizualiza" />
      {safeTitle && <meta name="twitter:title" content={safeTitle} />}
      {safeDescription && <meta name="twitter:description" content={safeDescription} />}
      {safeImage && <meta name="twitter:image" content={safeImage} />}
      {safeTitle && <meta name="twitter:image:alt" content={safeTitle} />}
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="São Paulo" />
      <meta name="geo.position" content="-23.5505;-46.6333" />
      <meta name="ICBM" content="-23.5505, -46.6333" />
      
      {/* Schema.org JSON-LD - only render if we have valid schema */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {ultraSafeJsonStringify(schemaMarkup)}
        </script>
      )}
      
      {/* Preconnect to improve performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
    </Helmet>
  );
};

export default SEOHead;
