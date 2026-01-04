import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Tutor {
  id: string;
  name: string;
  introduction: string;
}

interface Subject {
  id: string;
  name: string;
}

interface TutorWithSubjects extends Tutor {
  subjects: Subject[];
}

const Tutors = () => {
  const [tutors, setTutors] = useState<TutorWithSubjects[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const { data: tutorsData, error: tutorsError } = await supabase.from("tutors").select("*").order("name");

      if (tutorsError) throw tutorsError;

      const tutorsWithSubjects = await Promise.all(
        (tutorsData || []).map(async (tutor) => {
          const { data: subjectsData } = await supabase
            .from("tutor_subjects")
            .select("subject_id, subjects(id, name)")
            .eq("tutor_id", tutor.id);

          const subjects =
            subjectsData?.map((ts: any) => ({
              id: ts.subjects.id,
              name: ts.subjects.name,
            })) || [];

          return { ...tutor, subjects };
        }),
      );

      setTutors(tutorsWithSubjects);
    } catch (error) {
      console.error("Error fetching tutors:", error);
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
        title="Expert JC Tutors | POA, MOB, Math & Economics | MI Tuition Singapore"
        description="Meet our experienced JC tutors specializing in Principles of Accounting, Management of Business, Mathematics, and Economics. Dedicated educators committed to your academic success."
        keywords="JC tutors Singapore, POA tutor, MOB tutor, math tutor, economics tutor, experienced educators"
        canonicalUrl="/tutors"
      />
      <main className="container mx-auto px-4 py-12">
        <Breadcrumbs className="mb-6" />
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Tutors</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Meet our dedicated team of experienced educators committed to your academic success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tutors.map((tutor) => {
            // Split name to style parenthetical text differently
            const nameMatch = tutor.name.match(/^(.+?)(\s*\(.+\))$/);
            const mainName = nameMatch ? nameMatch[1] : tutor.name;
            const titlePart = nameMatch ? nameMatch[2] : '';
            
            return (
            <Card key={tutor.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {mainName}
                  {titlePart && <span className="text-base font-normal text-muted-foreground">{titlePart}</span>}
                </CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">{tutor.introduction}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject) => (
                    <Badge key={subject.id} variant="secondary" className="text-sm">
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Cross-linking section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Explore the subjects we offer or contact us to book a trial lesson
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Link to="/subjects" className="w-full sm:w-auto">
              <Button size="lg" variant="default" className="w-full sm:w-auto">
                View Subjects
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
            <Link to="/faq" className="text-primary hover:underline font-medium">
              FAQ page
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Tutors;
