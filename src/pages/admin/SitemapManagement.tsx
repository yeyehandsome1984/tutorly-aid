import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, Copy, Download, CheckCircle } from "lucide-react";

const SitemapManagement = () => {
  const [sitemapContent, setSitemapContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSitemap = async () => {
    setLoading(true);
    try {
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

      setSitemapContent(xml);
      toast.success(`Sitemap generated with ${staticPages.length + (blogPosts?.length || 0)} URLs`);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      toast.error("Failed to generate sitemap");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sitemapContent);
      setCopied(true);
      toast.success("Sitemap copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const downloadSitemap = () => {
    const blob = new Blob([sitemapContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Sitemap downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sitemap Management</h2>
          <p className="text-muted-foreground">
            Generate and update your sitemap.xml for SEO
          </p>
        </div>
        <Button onClick={generateSitemap} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Generating..." : "Generate Sitemap"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Update Your Sitemap</CardTitle>
          <CardDescription>
            Follow these steps to update your sitemap after publishing or updating blog posts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Click "Generate Sitemap" to create an updated sitemap with all published blog posts</li>
            <li>Copy the generated XML content or download it as a file</li>
            <li>Replace the contents of <code className="bg-muted px-1 py-0.5 rounded">public/sitemap.xml</code> with the new content</li>
            <li>Deploy/publish your changes to update the live sitemap</li>
          </ol>
        </CardContent>
      </Card>

      {sitemapContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Sitemap</CardTitle>
                <CardDescription>
                  Copy this content to public/sitemap.xml
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadSitemap}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={sitemapContent}
              readOnly
              className="font-mono text-xs h-96"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SitemapManagement;
