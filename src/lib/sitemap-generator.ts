import { supabase } from "@/integrations/supabase/client";

export interface SitemapResult {
  xml: string;
  urlCount: number;
}

export async function generateSitemapXml(): Promise<SitemapResult> {
  // Fetch all published blog posts
  const { data: blogPosts, error } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  const today = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages = [
    { loc: "https://micommercestreamtuition.com/", priority: "1.0", changefreq: "weekly" },
    { loc: "https://micommercestreamtuition.com/tutors", priority: "0.8", changefreq: "weekly" },
    { loc: "https://micommercestreamtuition.com/subjects", priority: "0.8", changefreq: "weekly" },
    { loc: "https://micommercestreamtuition.com/questions", priority: "0.7", changefreq: "daily" },
    { loc: "https://micommercestreamtuition.com/blog", priority: "0.8", changefreq: "daily" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  // Add blog posts
  for (const post of blogPosts || []) {
    const lastmod = post.updated_at 
      ? new Date(post.updated_at).toISOString().split("T")[0] 
      : today;
    xml += `
  <url>
    <loc>https://micommercestreamtuition.com/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  xml += `
</urlset>
`;

  return {
    xml,
    urlCount: staticPages.length + (blogPosts?.length || 0),
  };
}

export function downloadSitemapXml(xml: string): void {
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sitemap.xml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copySitemapToClipboard(xml: string): Promise<void> {
  await navigator.clipboard.writeText(xml);
}
