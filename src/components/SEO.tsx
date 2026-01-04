import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const PRODUCTION_URL = "https://micommercestreamtuition.com";

const SEO = ({
  title = "MI Tuition - Quality JC/Alevel Commerce Stream Tuition for POA（会计）, MOB（商业）, Mathematics（数学） & Economics(经济） | Singapore",
  description = "Quality tuition to commerce stream A-level/JC subject including Principle of Accounting (POA) 会计, Management of Business (MOB）商业, Economics 经济 and Mathematics 数学. Online & offline classes. Targeting both private and MI students.",
  keywords = "Singapore tuition,MI, POA tuition, MOB tuition, JC math tutor, economics tutor,  JC tuition Singapore, accounting tutor, mathematics tuition, A level POA, Principle of accounting tuition, Management of Business tuition, Commerce Stream tuition, 补习，",
  canonicalUrl,
  ogImage = "https://micommercestreamtuition.com/og-image-v2.png",
  noIndex = false,
}: SEOProps) => {
  const fullCanonicalUrl = canonicalUrl ? `${PRODUCTION_URL}${canonicalUrl}` : PRODUCTION_URL;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
