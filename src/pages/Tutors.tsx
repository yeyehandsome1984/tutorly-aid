import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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
      const { data: tutorsData, error: tutorsError } = await supabase
        .from("tutors")
        .select("*")
        .order("name");

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
        })
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
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Expert Tutors</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Meet our dedicated team of experienced educators committed to your academic success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">{tutor.name}</CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">
                  {tutor.introduction}
                </CardDescription>
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tutors;
