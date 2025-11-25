import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, MessageSquare, TrendingUp, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
      const { data: tutorsData } = await supabase
        .from("tutors")
        .select("*")
        .order("name")
        .limit(4);

      const tutorsWithSubjects = await Promise.all(
        (tutorsData || []).map(async (tutor) => {
          const { data: subjectsData } = await supabase
            .from("tutor_subjects")
            .select("subjects(name)")
            .eq("tutor_id", tutor.id);

          const subjects = subjectsData?.map((ts: any) => {
            const name = ts.subjects.name;
            if (name === "Principles of Accounting (POA)") return "POA";
            if (name === "Management of Business (MOB)") return "MOB";
            return name;
          }) || [];

          return { id: tutor.id, name: tutor.name, subjects };
        })
      );

      setTutors(tutorsWithSubjects);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Expert Tutors",
      description: "Learn from experienced educators specializing in JC subjects",
    },
    {
      icon: MessageSquare,
      title: "Ask Questions Online",
      description: "Get your academic doubts resolved quickly through our platform",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress tracking",
    },
    {
      icon: Users,
      title: "Small Class Sizes",
      description: "Personalized attention in focused learning environments",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Excel in Your JC Studies with Expert Tuition
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/95 drop-shadow-md">
            Premium tuition for POA, MOB, Mathematics, and Economics. Ask questions online, track your progress, and achieve academic excellence with Singapore's top tutors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Book Trial Lesson
            </Button>
            <Button size="lg" variant="hero">
              Student Login
            </Button>
            <Button size="lg" variant="hero">
              <Phone className="mr-2 h-4 w-4" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose MI Tuition?
          </h2>
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
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors Preview */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Meet Our Tutors
          </h2>
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Subjects We Offer
          </h2>
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
            <Button size="lg" variant="default">
              Book Your Free Trial
            </Button>
            <Button size="lg" variant="hero">
              Contact Us
            </Button>
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
