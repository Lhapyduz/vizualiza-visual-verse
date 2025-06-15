
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  category?: string;
}

const SEOHead = ({
  title = 'Vizualiza Visual Verse | Design e Identidade Visual Profissional',
  description = 'Estúdio de design especializado em identidade visual, web design e branding. Criamos marcas memoráveis que convertem. Orçamento grátis!',
  keywords = 'design, identidade visual, branding, web design, logo, marca, estúdio criativo, Guaratuba, Paraná',
  image = 'https://vizualiza.com.br/og-image.jpg',
  url = 'https://vizualiza.com.br',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Gregory Vizualiza',
  tags = [],
  category
}: SEOHeadProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? "BlogPosting" : "LocalBusiness",
    "name": title,
    "description": description,
    "url": url,
    "image": image,
    ...(type === 'article' ? {
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Vizualiza Visual Verse",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vizualiza.com.br/logo.png"
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "keywords": tags.join(', '),
      "articleSection": category,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    } : {
      "telephone": "+5541995618116",
      "email": "gregory@vizualiza.com.br",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Guaratuba",
        "addressRegion": "PR",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -25.8826,
        "longitude": -48.5739
      },
      "openingHours": "Mo-Su 00:00-23:59",
      "priceRange": "R$ 400 - R$ 5000",
      "serviceArea": {
        "@type": "State",
        "name": "Paraná"
      },
      "sameAs": [
        "https://instagram.com/vizualiza",
        "https://linkedin.com/company/vizualiza"
      ]
    })
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Vizualiza Visual Verse" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@vizualiza" />

      {/* Article specific tags */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:author" content={author} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Portuguese" />
      <meta name="geo.region" content="BR-PR" />
      <meta name="geo.placename" content="Guaratuba" />
      <meta name="geo.position" content="-25.8826;-48.5739" />
      <meta name="ICBM" content="-25.8826, -48.5739" />
    </Helmet>
  );
};

export default SEOHead;
