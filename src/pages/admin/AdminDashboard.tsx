import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, List, FileText, MessageSquare, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const sections = [
    {
      title: "Tutors",
      description: "Manage tutor profiles and introductions",
      icon: Users,
      link: "/admin/tutors",
      color: "text-blue-500",
    },
    {
      title: "Subjects",
      description: "Manage subjects and keywords",
      icon: BookOpen,
      link: "/admin/subjects",
      color: "text-green-500",
    },
    {
      title: "Tutor-Subject Assignments",
      description: "Assign subjects to tutors",
      icon: Users,
      link: "/admin/tutor-subjects",
      color: "text-cyan-500",
    },
    {
      title: "Topics",
      description: "Organize topics within subjects",
      icon: List,
      link: "/admin/topics",
      color: "text-purple-500",
    },
    {
      title: "Content",
      description: "Create and manage learning content",
      icon: FileText,
      link: "/admin/content",
      color: "text-orange-500",
    },
    {
      title: "Blog Posts",
      description: "Create and manage blog articles",
      icon: Newspaper,
      link: "/admin/blog",
      color: "text-pink-500",
    },
    {
      title: "Testimonials",
      description: "Manage student testimonials",
      icon: MessageSquare,
      link: "/admin/testimonials",
      color: "text-yellow-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage tutors, subjects, topics, and content for MI Tuition
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

export default AdminDashboard;
