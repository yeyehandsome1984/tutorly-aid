import { useParams, Link, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Phone } from "lucide-react";
import SEO from "@/components/SEO";
import { blogPosts } from "./Blog";

// Blog post content - in a real app, this would come from a CMS or database
const blogContent: Record<string, React.ReactNode> = {
  "how-to-score-a-for-poa-alevel": (
    <article className="prose prose-lg max-w-none">
      <p className="lead">
        Scoring an A for POA (Principles of Accounting) at A-Level requires a combination of strong conceptual understanding, consistent practice, and effective exam techniques. Here's our comprehensive guide based on years of teaching experience.
      </p>

      <h2>1. Master the Fundamentals First</h2>
      <p>
        Before diving into complex topics, ensure you have a solid grasp of basic accounting concepts:
      </p>
      <ul>
        <li><strong>Double-entry bookkeeping</strong> - Every transaction affects two accounts</li>
        <li><strong>The accounting equation</strong> - Assets = Liabilities + Capital</li>
        <li><strong>Accruals and prepayments</strong> - Understanding timing differences</li>
      </ul>

      <h2>2. Practice Financial Statements Regularly</h2>
      <p>
        Financial statements (Income Statement, Balance Sheet, Cash Flow Statement) form the core of POA. Practice preparing these statements from trial balances at least 2-3 times per week.
      </p>

      <h2>3. Understand, Don't Memorize</h2>
      <p>
        Many students make the mistake of memorizing formats without understanding the logic. Focus on understanding WHY certain items appear where they do.
      </p>

      <h2>4. Common Topics to Focus On</h2>
      <ul>
        <li>Depreciation methods (straight-line, reducing balance)</li>
        <li>Inventory valuation (FIFO, AVCO)</li>
        <li>Ratio analysis and interpretation</li>
        <li>Partnership accounts and appropriation</li>
        <li>Company accounts and dividends</li>
      </ul>

      <h2>5. Exam Techniques</h2>
      <p>
        Time management is crucial in POA exams. Here's a recommended approach:
      </p>
      <ul>
        <li>Spend 1 minute per mark as a general rule</li>
        <li>Show all workings clearly - partial marks are awarded</li>
        <li>Check your figures add up and balance</li>
        <li>Leave time for review at the end</li>
      </ul>

      <div className="bg-muted p-6 rounded-lg my-8">
        <h3 className="text-lg font-semibold mb-2">💡 Pro Tip</h3>
        <p className="mb-0">
          Keep a notebook of common errors you make. Review this before exams to avoid repeating the same mistakes.
        </p>
      </div>
    </article>
  ),
  "mob-case-study-analysis-techniques": (
    <article className="prose prose-lg max-w-none">
      <p className="lead">
        Case study analysis is a critical skill for MOB (Management of Business) exams. This guide will teach you a systematic approach to analyzing business cases and scoring maximum marks.
      </p>

      <h2>The PEEL Structure</h2>
      <p>
        Use the PEEL structure for every paragraph in your case study analysis:
      </p>
      <ul>
        <li><strong>P</strong>oint - State your main argument</li>
        <li><strong>E</strong>vidence - Use data from the case study</li>
        <li><strong>E</strong>xplanation - Explain how the evidence supports your point</li>
        <li><strong>L</strong>ink - Connect back to the question</li>
      </ul>

      <h2>Step-by-Step Analysis Framework</h2>
      <h3>Step 1: Read the Case Carefully</h3>
      <p>
        On your first read, highlight key information: company size, industry, problems faced, financial data, and stakeholders mentioned.
      </p>

      <h3>Step 2: Identify the Business Concepts</h3>
      <p>
        What concepts are being tested? Marketing mix? SWOT analysis? Leadership styles? Identify these before answering.
      </p>

      <h3>Step 3: Apply Context</h3>
      <p>
        Your answer must be specific to the case. Generic answers without case context will not score well.
      </p>

      <h2>Common MOB Frameworks</h2>
      <ul>
        <li>SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)</li>
        <li>PESTLE Analysis (Political, Economic, Social, Technological, Legal, Environmental)</li>
        <li>Marketing Mix (4Ps or 7Ps)</li>
        <li>Porter's Five Forces</li>
        <li>Boston Matrix</li>
      </ul>

      <div className="bg-muted p-6 rounded-lg my-8">
        <h3 className="text-lg font-semibold mb-2">💡 Pro Tip</h3>
        <p className="mb-0">
          Always evaluate your recommendations. Consider the limitations and potential challenges of implementing your suggested strategies.
        </p>
      </div>
    </article>
  ),
};

// Default content for posts without detailed content
const defaultContent = (post: typeof blogPosts[0]) => (
  <article className="prose prose-lg max-w-none">
    <p className="lead">{post.excerpt}</p>
    
    <div className="bg-muted p-6 rounded-lg my-8">
      <h3 className="text-lg font-semibold mb-2">📚 Full Article Coming Soon</h3>
      <p className="mb-4">
        We're currently working on this comprehensive guide. In the meantime, feel free to reach out to our tutors for personalized guidance on this topic.
      </p>
      <a
        href="https://wa.me/6585116415"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity no-underline"
      >
        <Phone className="h-4 w-4" />
        Ask Our Tutors
      </a>
    </div>

    <h2>Related Topics</h2>
    <ul>
      {post.keywords.map((keyword) => (
        <li key={keyword}>{keyword}</li>
      ))}
    </ul>
  </article>
);

const BlogPostSchema = ({ post }: { post: typeof blogPosts[0] }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "dateModified": post.date,
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
    "keywords": post.keywords.join(", "),
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
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const content = blogContent[post.slug] || defaultContent(post);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${post.title} | MI Tuition Blog`}
        description={post.excerpt}
        keywords={post.keywords.join(", ")}
        canonicalUrl={`/blog/${post.slug}`}
      />
      <BlogPostSchema post={post} />

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
                {post.readTime}
              </span>
              <span className="text-white/80 text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.date).toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">
              {post.title}
            </h1>
            {post.titleChinese && (
              <p className="text-lg text-white/90">{post.titleChinese}</p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">{content}</div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {blogPosts
              .filter((p) => p.slug !== post.slug && p.category === post.category)
              .slice(0, 3)
              .map((relatedPost) => (
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
