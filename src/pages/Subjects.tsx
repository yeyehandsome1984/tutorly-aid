import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const subjects = [
  {
    id: 1,
    name: "Principles of Accounting (POA)",
    description: "Master accounting fundamentals, financial statements, and business transactions with expert guidance.",
    keywords: "POA tuition Singapore, accounting tutor, JC accounting",
  },
  {
    id: 2,
    name: "Management of Business (MOB)",
    description: "Understand business management concepts, organizational strategies, and entrepreneurship principles.",
    keywords: "MOB tuition, business management tutor Singapore",
  },
  {
    id: 3,
    name: "Mathematics",
    description: "Excel in mathematical concepts from algebra to calculus with personalized coaching and practice.",
    keywords: "JC math tutor Singapore, mathematics tuition",
  },
  {
    id: 4,
    name: "Economics",
    description: "Grasp micro and macroeconomics theories, market dynamics, and economic policies effectively.",
    keywords: "economics tutor Singapore, JC economics tuition",
  },
];

const Subjects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
                <p className="text-xs text-muted-foreground italic">
                  Keywords: {subject.keywords}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Subjects;
