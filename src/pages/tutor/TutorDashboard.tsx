import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const TutorDashboard = () => {
  const sections = [
    {
      title: "Student Questions",
      description: "View and answer student questions",
      icon: MessageSquare,
      link: "/tutor/questions",
      color: "text-blue-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tutor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage student questions and provide learning support
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link key={section.title} to={section.link}>
            <Card className="hover:shadow-elevated transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 ${section.color}`}>
                  <section.icon className="h-6 w-6" />
                </div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TutorDashboard;
