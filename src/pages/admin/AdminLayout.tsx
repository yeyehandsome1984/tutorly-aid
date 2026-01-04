import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, List, FileText, LogOut, Newspaper, MessageSquare } from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roles) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">MI Tuition Admin</h1>
              <div className="flex gap-4">
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/admin/tutors">
                  <Button variant="ghost" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Tutors
                  </Button>
                </Link>
                <Link to="/admin/subjects">
                  <Button variant="ghost" size="sm">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Subjects
                  </Button>
                </Link>
                <Link to="/admin/topics">
                  <Button variant="ghost" size="sm">
                    <List className="mr-2 h-4 w-4" />
                    Topics
                  </Button>
                </Link>
                <Link to="/admin/content">
                  <Button variant="ghost" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Content
                  </Button>
                </Link>
                <Link to="/admin/blog">
                  <Button variant="ghost" size="sm">
                    <Newspaper className="mr-2 h-4 w-4" />
                    Blog
                  </Button>
                </Link>
                <Link to="/admin/testimonials">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Testimonials
                  </Button>
                </Link>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
