import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RefreshCw, Copy, Download, CheckCircle } from "lucide-react";
import { generateSitemapXml, downloadSitemapXml, copySitemapToClipboard } from "@/lib/sitemap-generator";

const SitemapManagement = () => {
  const [sitemapContent, setSitemapContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSitemap = async () => {
    setLoading(true);
    try {
      const { xml, urlCount } = await generateSitemapXml();
      setSitemapContent(xml);
      toast.success(`Sitemap generated with ${urlCount} URLs`);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      toast.error("Failed to generate sitemap");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await copySitemapToClipboard(sitemapContent);
      setCopied(true);
      toast.success("Sitemap copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const downloadSitemap = () => {
    downloadSitemapXml(sitemapContent);
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
