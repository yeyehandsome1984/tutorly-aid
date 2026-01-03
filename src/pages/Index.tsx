import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, MessageSquare, TrendingUp, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import FAQSchema from "@/components/FAQSchema";

const faqs = [
  {
    question: "What subjects does MI Tuition offer?",
    answer:
      "We offer expert tuition for Principles of Accounting (POA), Management of Business (MOB), Mathematics, and Economics for JC students in Singapore.",
  },
  {
    question: "How can I contact MI Tuition?",
    answer:
      "You can reach us via WhatsApp at +65 8511 6415 or email us at yichenue@gmail.com. We respond to enquiries promptly.",
  },
  {
    question: "Can I ask questions online?",
    answer:
      "Yes! Our platform allows students to ask questions online and receive answers from our expert tutors. Simply log in to your account and post your question.",
  },
  {
    question: "What makes MI Tuition different?",
    answer:
      "We offer small class sizes for personalized attention, experienced tutors specialized in JC subjects, and an online Q&A platform for continuous learning support.",
  },
  {
    question: "How do I sign up as a student?",
    answer:
      "Click the Student Login button on our website and create an account. Once registered, you can ask questions and access our learning resources.",
  },
];

interface TutorPreview {
  id: string;
  name: string;
  subjects: string[];
}

const Index = () => {
  const [tutors, setTutors] = useState<TutorPreview[]>([]);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const { data: tutorsData } = await supabase.from("tutors").select("*").order("name").limit(4);

      const tutorsWithSubjects = await Promise.all(
        (tutorsData || []).map(async (tutor) => {
          const { data: subjectsData } = await supabase
            .from("tutor_subjects")
            .select("subjects(name)")
            .eq("tutor_id", tutor.id);

          const subjects =
            subjectsData?.map((ts: any) => {
              const name = ts.subjects.name;
              if (name === "Principles of Accounting (POA)") return "POA";
              if (name === "Management of Business (MOB)") return "MOB";
              return name;
            }) || [];

          return { id: tutor.id, name: tutor.name, subjects };
        }),
      );

      setTutors(tutorsWithSubjects);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Quality and patient Tutors",
      description: "Learn from experienced tutor or top students from respective subjects",
    },
    {
      icon: MessageSquare,
      title: "Responsive to questions",
      description: "Tutors are responsive to students question through whatapps, calls or other channels",
    },
    {
      icon: TrendingUp,
      title: "complete commerce stream subjects",
      description: "We are familiar with syllabus in commerce stream across POA, MOB and Econs",
    },
    {
      icon: Users,
      title: "Customised Note",
      description: "We made our own note to tackle students pain points, we also have complete material from MI",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO canonicalUrl="/" />
      <FAQSchema faqs={faqs} />
      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Excel in Your JC Studies with Excellent Tuition Team
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/95 drop-shadow-md">
            Effective Tuition for A-Level commerce stream subjects, including POA, MOB, Mathematics, and Economics.
            Let's achieve academic excellence with dedicated team of tutors!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary">
                Student Login
              </Button>
            </Link>
            <a href="https://wa.me/6585116415" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="hero">
                <Phone className="mr-2 h-4 w-4" />
                WhatsApp Us
              </Button>
            </a>
            <a href="mailto:yichenue@gmail.com">
              <Button size="lg" variant="hero">
                <Mail className="mr-2 h-4 w-4" />
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose MI Tuition?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="shadow-card text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors Preview */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Meet Our Tutors</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our experienced educators bring years of teaching expertise and proven results
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {tutors.map((tutor) => (
              <Card key={tutor.id} className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl">{tutor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subject, sidx) => (
                      <Badge key={sidx} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/tutors">
              <Button variant="default">View All Tutors</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Subjects We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {["Principles of Accounting", "Management of Business", "Mathematics", "Economics"].map((subject, idx) => (
              <Card key={idx} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-center">{subject}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/subjects">
              <Button variant="default">Explore Subjects</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-red py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Join hundreds of students who have improved their grades with our expert tuition
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/6585116415" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="default">
                <Phone className="mr-2 h-4 w-4" />
                WhatsApp Us
              </Button>
            </a>
            <a href="mailto:yichenue@gmail.com">
              <Button size="lg" variant="hero">
                <Mail className="mr-2 h-4 w-4" />
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            © 2024 MI Tuition. Expert tuition for POA, MOB, Mathematics, and Economics in Singapore.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
