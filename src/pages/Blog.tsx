import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

export interface BlogPost {
  slug: string;
  title: string;
  titleChinese?: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  keywords: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-score-a-for-poa-alevel",
    title: "How to Score A for POA A-Level: Complete Study Guide",
    titleChinese: "如何在A水准会计考试中拿A：完整学习指南",
    excerpt: "Master the Principles of Accounting with proven strategies, exam techniques, and study tips from experienced tutors. Learn how to tackle financial statements, ratio analysis, and case studies effectively.",
    category: "POA",
    date: "2024-01-15",
    readTime: "8 min read",
    keywords: ["POA A-Level", "accounting tips", "H2 POA", "syllabus 9593"],
  },
  {
    slug: "mob-case-study-analysis-techniques",
    title: "MOB Case Study Analysis: A Step-by-Step Framework",
    titleChinese: "商业管理案例分析：系统化分析框架",
    excerpt: "Learn the PEEL structure and how to analyze MOB case studies effectively. Understand how to apply business concepts to real-world scenarios and score maximum marks.",
    category: "MOB",
    date: "2024-01-10",
    readTime: "10 min read",
    keywords: ["MOB case study", "business analysis", "H2 MOB", "syllabus 9587"],
  },
  {
    slug: "common-poa-mistakes-to-avoid",
    title: "10 Common POA Mistakes Students Make (And How to Avoid Them)",
    titleChinese: "学生常犯的10个会计错误（及如何避免）",
    excerpt: "From incorrect journal entries to misunderstanding depreciation methods, discover the most common errors in POA exams and learn how to avoid them for better grades.",
    category: "POA",
    date: "2024-01-05",
    readTime: "6 min read",
    keywords: ["POA mistakes", "accounting errors", "exam preparation"],
  },
  {
    slug: "understanding-mob-marketing-mix",
    title: "Understanding the Marketing Mix (4Ps) for MOB Exams",
    titleChinese: "理解市场营销组合4P理论",
    excerpt: "A comprehensive guide to Product, Price, Place, and Promotion strategies. Learn how to apply the 4Ps framework in MOB case studies with real Singapore business examples.",
    category: "MOB",
    date: "2023-12-28",
    readTime: "7 min read",
    keywords: ["marketing mix", "4Ps", "MOB marketing", "business strategy"],
  },
  {
    slug: "poa-ratio-analysis-cheat-sheet",
    title: "POA Ratio Analysis Cheat Sheet: All Formulas You Need",
    titleChinese: "会计比率分析速查表：必备公式大全",
    excerpt: "Complete reference guide for all accounting ratios including profitability, liquidity, efficiency, and gearing ratios. Includes formulas, interpretations, and exam tips.",
    category: "POA",
    date: "2023-12-20",
    readTime: "5 min read",
    keywords: ["ratio analysis", "accounting formulas", "POA cheat sheet", "financial ratios"],
  },
  {
    slug: "mob-swot-pestle-analysis-guide",
    title: "SWOT and PESTLE Analysis: Complete MOB Guide",
    titleChinese: "SWOT与PESTLE分析：商业管理完整指南",
    excerpt: "Master these essential business analysis tools for MOB exams. Learn when to use each framework and how to apply them to Singapore business contexts.",
    category: "MOB",
    date: "2023-12-15",
    readTime: "9 min read",
    keywords: ["SWOT analysis", "PESTLE", "business environment", "MOB frameworks"],
  },
  {
    slug: "alevel-commerce-stream-subject-combination",
    title: "Best A-Level Commerce Stream Subject Combinations",
    titleChinese: "A水准商科科目最佳组合建议",
    excerpt: "Choosing the right subject combination for JC commerce stream? Learn about POA, MOB, Economics, and Math combinations that maximize your university admission chances.",
    category: "General",
    date: "2023-12-10",
    readTime: "6 min read",
    keywords: ["subject combination", "commerce stream", "JC subjects", "MI subjects"],
  },
  {
    slug: "time-management-tips-alevel-exams",
    title: "Time Management Tips for A-Level Commerce Exams",
    titleChinese: "A水准商科考试时间管理技巧",
    excerpt: "Learn effective time allocation strategies for POA and MOB papers. Master the art of completing all questions within the exam duration without sacrificing quality.",
    category: "General",
    date: "2023-12-05",
    readTime: "5 min read",
    keywords: ["exam time management", "A-Level tips", "exam strategy"],
  },
];

const BlogSchema = () => {
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
    "blogPost": blogPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "url": `https://micommercestreamtuition.com/blog/${post.slug}`,
      "keywords": post.keywords.join(", "),
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
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog - A-Level POA & MOB Study Tips | MI Tuition"
        description="Free educational articles, study guides, and exam tips for A-Level POA (Principles of Accounting) and MOB (Management of Business) students in Singapore."
        keywords="A-Level blog, POA study guide, MOB tips, commerce stream articles, JC tuition blog, accounting tips, business studies"
        canonicalUrl="/blog"
      />
      <BlogSchema />

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <Card className="h-full shadow-card hover:shadow-elevated transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    {post.titleChinese && (
                      <p className="text-sm text-muted-foreground">{post.titleChinese}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("en-SG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
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
