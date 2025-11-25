import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name");

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
      <main className="container mx-auto px-4 py-12">
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
                <CardDescription className="text-base mt-2">
                  {subject.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subject.keywords && subject.keywords.length > 0 && (
                  <p className="text-xs text-muted-foreground italic">
                    Keywords: {subject.keywords.join(", ")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Subjects;
