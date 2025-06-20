
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
  
  // Ensure all values are properly converted to strings and filter out any problematic values
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'symbol') return '';
    if (typeof value === 'function') return '';
    if (typeof value === 'object') return '';
    return String(value);
  };

  // Safe array filter to remove any non-string values
  const safeArray = (arr: any[]): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(item => item !== null && item !== undefined && typeof item !== 'symbol' && typeof item !== 'function')
      .map(item => safeString(item))
      .filter(item => item.length > 0);
  };

  // Safe values
  const safeTitle = safeString(title);
  const safeDescription = safeString(description);
  const safeKeywords = safeString(keywords);
  const safeImage = safeString(image);
  const safeUrl = safeString(url);
  const safeAuthor = safeString(author);
  const safeLocale = safeString(locale);
  const safeSiteName = safeString(siteName);
  const safeType = safeString(type);
  const safeTags = safeArray(tags);

  // Generate schema markup for rich snippets
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
        datePublished: safeString(publishedTime),
        dateModified: safeString(modifiedTime || publishedTime),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': safeUrl
        },
        articleSection: safeString(section),
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

  // Safe JSON stringify function that handles potential Symbol values
  const safeJsonStringify = (obj: any) => {
    try {
      return JSON.stringify(obj, (key, value) => {
        // Filter out Symbol values and other non-serializable values
        if (typeof value === 'symbol' || typeof value === 'function' || typeof value === 'undefined') {
          return undefined;
        }
        return value;
      });
    } catch (error) {
      console.warn('Error stringifying schema markup:', error);
      return '{}';
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="keywords" content={safeKeywords} />
      <meta name="author" content={safeAuthor} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="Portuguese" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={safeUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={safeType} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={safeImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={safeTitle} />
      <meta property="og:url" content={safeUrl} />
      <meta property="og:site_name" content={safeSiteName} />
      <meta property="og:locale" content={safeLocale} />
      
      {/* Article specific OG tags */}
      {safeType === 'article' && (
        <>
          <meta property="article:author" content={safeAuthor} />
          {publishedTime && <meta property="article:published_time" content={safeString(publishedTime)} />}
          {modifiedTime && <meta property="article:modified_time" content={safeString(modifiedTime)} />}
          {section && <meta property="article:section" content={safeString(section)} />}
          {safeTags.map((tag, index) => (
            <meta key={`article-tag-${index}`} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vizualiza" />
      <meta name="twitter:creator" content="@vizualiza" />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={safeImage} />
      <meta name="twitter:image:alt" content={safeTitle} />
      
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
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {safeJsonStringify(schemaMarkup)}
      </script>
      
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
