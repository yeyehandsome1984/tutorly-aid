import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tutors = [
  {
    id: 1,
    name: "Ye Yichen",
    subjects: ["Principles of Accounting (POA)", "Management of Business (MOB)"],
  },
  {
    id: 2,
    name: "Denise",
    subjects: ["Mathematics", "Principles of Accounting (POA)"],
  },
  {
    id: 3,
    name: "Ruvina",
    subjects: ["Economics", "Principles of Accounting (POA)"],
  },
  {
    id: 4,
    name: "Jiayi",
    subjects: ["Mathematics"],
  },
];

const Tutors = () => {
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
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {subject}
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
