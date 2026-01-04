import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const TutorLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isTutor, setIsTutor] = useState(false);

  useEffect(() => {
    checkTutorAccess();
  }, []);

  const checkTutorAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const hasTutorAccess = roles?.some(r => r.role === "tutor" || r.role === "admin");
    
    if (!hasTutorAccess) {
      navigate("/");
      return;
    }

    setIsTutor(true);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isTutor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/tutor" className="text-xl font-bold">
                Tutor Dashboard
              </Link>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
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

export default TutorLayout;
