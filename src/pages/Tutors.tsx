import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tutors = [
  {
    id: 1,
    name: "Ye Yichen",
    subjects: ["Principles of Accounting (POA)", "Management of Business (MOB)"],
    introduction: "Experienced educator specializing in Principles of Accounting and Management of Business with over 8 years of teaching experience. Known for simplifying complex concepts and helping students achieve distinction grades."
  },
  {
    id: 2,
    name: "Denise",
    subjects: ["Mathematics", "Principles of Accounting (POA)"],
    introduction: "Passionate mathematics and accounting tutor dedicated to building strong foundational skills. Focuses on problem-solving techniques and exam strategies to help students excel in their A-Level examinations."
  },
  {
    id: 3,
    name: "Ruvina",
    subjects: ["Economics", "Principles of Accounting (POA)"],
    introduction: "Dynamic tutor with expertise in Economics and Accounting. Emphasizes real-world applications and critical thinking to make learning engaging and relevant for JC students."
  },
  {
    id: 4,
    name: "Jiayi",
    subjects: ["Mathematics"],
    introduction: "Mathematics specialist with a track record of helping students improve from failing grades to consistent A's. Uses innovative teaching methods and personalized attention to address individual learning gaps."
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
                <CardDescription className="text-base mt-2 leading-relaxed">
                  {tutor.introduction}
                </CardDescription>
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
