const EducationalOrganizationSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://micommercestreamtuition.com/#organization",
    "name": "MI Commerce Stream Tuition",
    "alternateName": ["MI Tuition", "MI Commerce Tuition", "MI补习"],
    "description": "Expert JC tuition for A-Level commerce stream subjects including POA (Principles of Accounting), MOB (Management of Business), Mathematics, and Economics in Singapore. 专业A水准补习 - 会计、商业、数学、经济。",
    "url": "https://micommercestreamtuition.com",
    "logo": "https://micommercestreamtuition.com/og-image-v2.png",
    "email": "yichenue@gmail.com",
    "telephone": "+65 8511 6415",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SG",
      "addressLocality": "Singapore"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Singapore"
    },
    "sameAs": [
      "https://wa.me/6585116415"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Certificate",
        "name": "Ex-MOE Teachers"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Certificate",
        "name": "Former MI Top Students"
      }
    ],
    "alumni": {
      "@type": "Person",
      "name": "Former MI Students"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default EducationalOrganizationSchema;
