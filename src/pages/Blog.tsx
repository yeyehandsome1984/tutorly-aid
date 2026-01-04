import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_chinese: string | null;
  excerpt: string;
  category: string;
  published_at: string | null;
  read_time: string;
  keywords: string[];
}

const BlogSchema = ({ posts }: { posts: BlogPost[] }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "MI Tuition Blog",
    "description": "Educational articles for A-Level POA, MOB, Mathematics, and Economics students in Singapore",
    "url": "https://micommercestreamtuition.com/blog",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "MI Tuition",
    },
    "blogPost": posts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.published_at,
      "url": `https://micommercestreamtuition.com/blog/${post.slug}`,
      "keywords": post.keywords?.join(", ") || "",
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const Blog = () => {
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, title_chinese, excerpt, category, published_at, read_time, keywords')
        .eq('published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog - A-Level POA & MOB Study Tips | MI Tuition"
        description="Free educational articles, study guides, and exam tips for A-Level POA (Principles of Accounting) and MOB (Management of Business) students in Singapore."
        keywords="A-Level blog, POA study guide, MOB tips, commerce stream articles, JC tuition blog, accounting tips, business studies"
        canonicalUrl="/blog"
      />
      <BlogSchema posts={blogPosts} />

      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Study Tips & Resources | 学习资源
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/95 drop-shadow-md">
            Free educational content to help you excel in POA, MOB, and other commerce stream subjects
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No articles available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {blogPosts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`}>
                  <Card className="h-full shadow-card hover:shadow-elevated transition-all hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.read_time}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      {post.title_chinese && (
                        <p className="text-sm text-muted-foreground">{post.title_chinese}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.published_at ? new Date(post.published_at).toLocaleDateString("en-SG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }) : "Draft"}
                        </span>
                        <span className="text-primary text-sm font-medium flex items-center gap-1">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need Personalized Help?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Our tutors can provide customized guidance based on your specific learning needs
          </p>
          <a
            href="https://wa.me/6585116415"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Contact Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default Blog;
