import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import CourseSchema from "@/components/CourseSchema";

interface Subject {
  id: string;
  name: string;
  description: string | null;
  keywords: string[] | null;
}

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from("subjects").select("*").order("name");

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="JC Subjects - POA, MOB, Mathematics & Economics | MI Tuition Singapore"
        description="Expert A-level tuition for POA (9593), MOB (9587), H1/H2 Math (8843/9758), Economics (9570) at Millennia Institute (MI). 专业A水准补习 - 会计、商业、数学、经济。Proven teaching methodologies for academic excellence."
        keywords="A-level tuition, POA tuition, Commerce Stream, MOB tuition, JC math tutor, economics tutor, ask questions online, JC tuition Singapore, accounting tutor, mathematics tuition, Management of Business Tuition, Principle of accounting tuition, Syllabus 9593, syllabus 9570, syllabus 9587, syllabus 8843, H2 Math, H1 Math, H2 POA, H2 MOB, syllabus 7087, MI, Millennia Institute (MI), 补习, 会计, 商业, 数学, 经济, A水准"
        canonicalUrl="/subjects"
      />
      <CourseSchema courses={subjects} />
      <main className="container mx-auto px-4 py-12">
        <Breadcrumbs className="mb-6" />
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Subjects We Teach</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive tuition across key JC subjects with proven teaching methodologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {subjects.map((subject) => (
            <Card key={subject.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">{subject.name}</CardTitle>
                <CardDescription className="text-base mt-2">{subject.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {subject.keywords && subject.keywords.length > 0 && (
                  <p className="text-xs text-muted-foreground italic">Keywords: {subject.keywords.join(", ")}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cross-linking section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Meet our tutors or contact us to arrange a trial lesson
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Link to="/tutors" className="w-full sm:w-auto">
              <Button size="lg" variant="default" className="w-full sm:w-auto">
                Meet Our Tutors
              </Button>
            </Link>
            <a href="https://wa.me/6585116415" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Have questions? Check our{" "}
            <Link to="/questions" className="text-primary hover:underline font-medium">
              FAQ page
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Subjects;
