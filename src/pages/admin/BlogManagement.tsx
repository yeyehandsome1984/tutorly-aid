import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, MapPin, Download, Copy, CheckCircle, Sparkles } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { generateSitemapXml, downloadSitemapXml, copySitemapToClipboard } from "@/lib/sitemap-generator";
import { sanitizeBlogContent } from "@/lib/content-sanitizer";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_chinese: string | null;
  excerpt: string;
  content: string;
  category: string;
  keywords: string[];
  read_time: string;
  published: boolean;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const BlogManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [sitemapDialogOpen, setSitemapDialogOpen] = useState(false);
  const [sitemapXml, setSitemapXml] = useState("");
  const [sitemapCopied, setSitemapCopied] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    title_chinese: "",
    excerpt: "",
    content: "",
    category: "",
    keywords: "",
    read_time: "5 min read",
    published: false,
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const triggerSitemapPrompt = async () => {
    try {
      const { xml } = await generateSitemapXml();
      setSitemapXml(xml);
      setSitemapDialogOpen(true);
    } catch (error) {
      console.error("Error generating sitemap:", error);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: Omit<BlogPost, "id" | "created_at" | "updated_at"> & { wasPublished?: boolean }) => {
      const { wasPublished, ...postData } = data;
      const { error } = await supabase.from("blog_posts").insert({
        ...postData,
        published_at: postData.published ? new Date().toISOString() : null,
      });
      if (error) throw error;
      return { isPublished: postData.published };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post created successfully");
      resetForm();
      if (result.isPublished) {
        triggerSitemapPrompt();
      }
    },
    onError: (error) => toast.error(`Error: ${error.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, wasPublished }: { id: string; data: Partial<BlogPost>; wasPublished?: boolean }) => {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          ...data,
          published_at: data.published ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
      return { isPublished: data.published, wasPublished };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post updated successfully");
      resetForm();
      // Trigger sitemap prompt if post is published (newly or updated while published)
      if (result.isPublished) {
        triggerSitemapPrompt();
      }
    },
    onError: (error) => toast.error(`Error: ${error.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post deleted successfully");
    },
    onError: (error) => toast.error(`Error: ${error.message}`),
  });

  const sanitizeAllMutation = useMutation({
    mutationFn: async () => {
      if (!posts || posts.length === 0) {
        throw new Error("No posts to sanitize");
      }

      let sanitizedCount = 0;
      
      for (const post of posts) {
        const sanitizedContent = sanitizeBlogContent(post.content);
        
        // Only update if content changed
        if (sanitizedContent !== post.content) {
          const { error } = await supabase
            .from("blog_posts")
            .update({ content: sanitizedContent })
            .eq("id", post.id);
          
          if (error) throw error;
          sanitizedCount++;
        }
      }
      
      return sanitizedCount;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      if (count > 0) {
        toast.success(`Sanitized ${count} blog post${count > 1 ? 's' : ''}`);
      } else {
        toast.info("All posts are already clean - no changes needed");
      }
    },
    onError: (error) => toast.error(`Error: ${error.message}`),
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      title_chinese: "",
      excerpt: "",
      content: "",
      category: "",
      keywords: "",
      read_time: "5 min read",
      published: false,
    });
    setEditingPost(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      title_chinese: post.title_chinese || "",
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      keywords: post.keywords?.join(", ") || "",
      read_time: post.read_time,
      published: post.published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-generate slug from title if not provided
    const finalSlug = formData.slug.trim() || generateSlug(formData.title);
    
    // Sanitize content to remove legacy inline styles
    const sanitizedContent = sanitizeBlogContent(formData.content);
    
    const postData = {
      slug: finalSlug,
      title: formData.title,
      title_chinese: formData.title_chinese || null,
      excerpt: formData.excerpt,
      content: sanitizedContent,
      category: formData.category,
      keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      read_time: formData.read_time,
      published: formData.published,
      published_at: formData.published ? new Date().toISOString() : null,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: postData, wasPublished: editingPost.published });
    } else {
      createMutation.mutate(postData);
    }
  };

  const handleCopySitemap = async () => {
    try {
      await copySitemapToClipboard(sitemapXml);
      setSitemapCopied(true);
      toast.success("Sitemap copied to clipboard");
      setTimeout(() => setSitemapCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy sitemap");
    }
  };

  const handleDownloadSitemap = () => {
    downloadSitemapXml(sitemapXml);
    toast.success("Sitemap downloaded");
  };
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (isLoading) {
    return <div className="p-8">Loading blog posts...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts with rich text editing</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("This will clean up inline styles from all blog posts. Continue?")) {
                sanitizeAllMutation.mutate();
              }
            }}
            disabled={sanitizeAllMutation.isPending || !posts?.length}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {sanitizeAllMutation.isPending ? "Sanitizing..." : "Sanitize All"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" /> Add Blog Post
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Edit Blog Post" : "Add New Blog Post"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (!editingPost) {
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                          slug: generateSlug(e.target.value),
                        }));
                      }
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Auto-generated from title if empty"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title_chinese">Chinese Title (optional)</Label>
                <Input
                  id="title_chinese"
                  value={formData.title_chinese}
                  onChange={(e) => setFormData({ ...formData, title_chinese: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., POA, MOB, General"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="e.g., POA tips, accounting, exam prep"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label>Content (Visual Editor) *</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Use the toolbar to format text, add headings, lists, links, and images - no HTML needed!
                </p>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPost ? "Update" : "Create"} Blog Post
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts ({posts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-muted-foreground">/{post.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge className="bg-green-500">
                        <Eye className="h-3 w-3 mr-1" /> Published
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <EyeOff className="h-3 w-3 mr-1" /> Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {post.created_at
                      ? new Date(post.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this post?")) {
                          deleteMutation.mutate(post.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!posts?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No blog posts yet. Create your first post!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sitemap Update Dialog */}
      <Dialog open={sitemapDialogOpen} onOpenChange={setSitemapDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Update Sitemap
            </DialogTitle>
            <DialogDescription>
              Your blog post has been saved. Update your sitemap to reflect the changes for SEO.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy or download the updated sitemap and replace <code className="bg-muted px-1 py-0.5 rounded text-xs">public/sitemap.xml</code> in your project.
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSitemapDialogOpen(false)}>
              Skip
            </Button>
            <Button variant="outline" onClick={handleCopySitemap}>
              {sitemapCopied ? (
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {sitemapCopied ? "Copied!" : "Copy XML"}
            </Button>
            <Button onClick={handleDownloadSitemap}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
