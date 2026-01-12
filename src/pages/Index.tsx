import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Headphones, Library, NotebookPen, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import FAQSchema from "@/components/FAQSchema";
import Testimonials from "@/components/Testimonials";
import EducationalOrganizationSchema from "@/components/EducationalOrganizationSchema";
import LazySection from "@/components/LazySection";

const faqs = [
  {
    question: "What is the background of MI Tuition tutors?",
    answer:
      "Our tutors are ex-MOE teachers and former MI (Millennia Institute) students who excelled in their respective subjects. With first-hand experience of the JC commerce stream curriculum, we understand exactly what students need to succeed.",
  },
  {
    question: "Why does MI Tuition focus on commerce stream subjects?",
    answer:
      "We specialize in commerce stream subjects (POA, MOB, Mathematics, Economics) because this is our niche expertise. By focusing on what we know best, we can provide excellent, targeted tuition services that truly meet the needs of JC students in these subjects.",
  },
  {
    question: "Do you offer both online and offline tuition?",
    answer:
      "Yes! We offer both online and offline tuition options to suit your preferences and schedule. Whether you prefer face-to-face learning or the convenience of online sessions, we have you covered.",
  },
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
    question: "Can I arrange a trial lesson? What about pricing?",
    answer:
      "Yes, we can arrange a trial lesson for you. Pricing will be discussed through WhatsApp or call separately.",
  },
  {
    question: "What languages can lessons be conducted in?",
    answer: "Lessons can be conducted in English or Mandarin, depending on your preference and comfort level.",
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
      const { data: tutorsData } = await supabase.from("tutors").select("*").order("name");

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
      icon: GraduationCap,
      title: "Quality and patient Tutors",
      description:
        "Learn from experienced tutor or top students from respective subjects. Tutors are able to teach either in English or 中文",
    },
    {
      icon: Headphones,
      title: "Responsive to questions",
      description: "Tutors are responsive to students question through whatapps, calls or other channels",
    },
    {
      icon: Library,
      title: "Complete Commerce Stream Subjects",
      description: "We are familiar with syllabus in commerce stream across POA, MOB and Econs",
    },
    {
      icon: NotebookPen,
      title: "Customized and quality Note",
      description: "We made our own note to tackle students pain points. We also have complete material from MI",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO canonicalUrl="/" />
      <FAQSchema faqs={faqs} />
      <EducationalOrganizationSchema />
      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Excel in Your JC Commerce Stream with Excellent Tuition Team
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/95 drop-shadow-md">
            Effective Tuition for A-Level commerce stream subjects, including{" "}
            <span className="whitespace-nowrap">POA（会计）</span>,{" "}
            <span className="whitespace-nowrap">MOB（商业）</span>,{" "}
            <span className="whitespace-nowrap">Mathematics（数学）</span>, and{" "}
            <span className="whitespace-nowrap">Economics（经济）</span>. Let's achieve academic excellence with
            dedicated team of tutors!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/6585116415" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-lg">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </a>
            <a href="mailto:yichenue@gmail.com">
              <Button size="lg" variant="hero" className="text-lg">
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8">
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

      {/* Tutors Preview - Lazy Loaded */}
      <LazySection>
        <section className="py-8 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Meet Our Tutors</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our tutors provide best supports for your A-level Journey
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
              {tutors.map((tutor) => (
                <Link key={tutor.id} to="/tutors">
                  <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader className="p-3 pb-2">
                      <CardTitle className="text-sm font-semibold leading-tight">{tutor.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.map((subject, sidx) => (
                          <Badge key={sidx} variant="secondary" className="text-xs px-1.5 py-0">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/tutors">
                <Button variant="default">View All Tutors</Button>
              </Link>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Subjects Section - Lazy Loaded */}
      <LazySection>
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Subjects We Offer</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {["H2 Principles of Accounting", "H2 Management of Business", "H1&2 Mathematics", "H1&2 Economics"].map(
                (subject, idx) => (
                  <Card key={idx} className="shadow-card hover:shadow-elevated transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg text-center">{subject}</CardTitle>
                    </CardHeader>
                  </Card>
                ),
              )}
            </div>
            <div className="text-center mt-8">
              <Link to="/subjects">
                <Button variant="default">Explore Subjects</Button>
              </Link>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Testimonials Section - Lazy Loaded */}
      <LazySection>
        <Testimonials />
      </LazySection>

      {/* FAQ Section - Lazy Loaded */}
      <LazySection>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Find answers to common questions about our tuition services
            </p>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section - Lazy Loaded */}
      <LazySection>
        <section className="gradient-red py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
              Ready to Excel in Your Studies?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-primary-foreground/90">Join us for a fun journey</p>
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
      </LazySection>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} MI Tuition. Expert tuition for POA, MOB, Mathematics, and Economics in
            Singapore.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
