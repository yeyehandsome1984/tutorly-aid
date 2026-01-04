import { useParams, Link, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Phone } from "lucide-react";
import SEO from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";
import { optimizeHtmlImages } from "@/lib/image-optimizer";

interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  title_chinese: string | null;
  excerpt: string;
  content: string;
  category: string;
  published_at: string | null;
  read_time: string;
  keywords: string[];
}

const BlogPostSchema = ({ post }: { post: BlogPostData }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.published_at,
    "dateModified": post.published_at,
    "author": {
      "@type": "Organization",
      "name": "MI Tuition",
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "MI Tuition",
      "url": "https://micommercestreamtuition.com",
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://micommercestreamtuition.com/blog/${post.slug}`,
    },
    "keywords": post.keywords?.join(", ") || "",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as BlogPostData | null;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['related-posts', post?.category, slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, title, category')
        .eq('published', true)
        .eq('category', post!.category)
        .neq('slug', slug)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!post?.category,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  // Memoize optimized content to avoid re-processing on every render
  const optimizedContent = useMemo(() => {
    return optimizeHtmlImages(post.content);
  }, [post.content]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${post.title} | MI Tuition Blog`}
        description={post.excerpt}
        keywords={post.keywords?.join(", ") || ""}
        canonicalUrl={`/blog/${post.slug}`}
      />
      <BlogPostSchema post={post} />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs 
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title }
          ]} 
        />
      </div>

      {/* Header */}
      <section className="gradient-hero py-12">
        <div className="container mx-auto px-4">
          <Link to="/blog">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="text-white/80 text-sm flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.read_time}
              </span>
              <span className="text-white/80 text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.published_at ? new Date(post.published_at).toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "Draft"}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">
              {post.title}
            </h1>
            {post.title_chinese && (
              <p className="text-lg text-white/90">{post.title_chinese}</p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div 
            className="max-w-3xl mx-auto prose prose-lg prose-p:mb-4 prose-p:leading-relaxed prose-headings:mt-8 prose-headings:mb-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1 [&>p]:mb-4 [&>p:empty]:min-h-[1em] [&>p:empty]:mb-2 [&_img]:rounded-lg [&_img]:max-w-full [&_picture]:block [&_picture]:my-4"
            dangerouslySetInnerHTML={{ __html: optimizedContent }}
          />
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-background p-4 rounded-lg shadow-card hover:shadow-elevated transition-shadow"
                >
                  <Badge variant="outline" className="mb-2">
                    {relatedPost.category}
                  </Badge>
                  <h3 className="font-medium text-sm hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with {post.category}?</h2>
          <p className="text-muted-foreground mb-6">
            Our experienced tutors can provide personalized guidance
          </p>
          <a
            href="https://wa.me/6585116415"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Phone className="h-4 w-4" />
            Contact Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
