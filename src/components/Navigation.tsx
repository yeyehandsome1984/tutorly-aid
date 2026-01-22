import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tutors", label: "Tutors" },
    { to: "/subjects", label: "Subjects" },
    { to: "/blog", label: "Blog" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" },
  ];

  const handleNavClick = (to: string) => {
    setIsOpen(false);
    navigate(to);
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-md" ref={menuRef}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold text-primary-foreground">
            MI Tuition
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                activeClassName="text-primary-foreground font-semibold"
              >
                {link.label}
              </NavLink>
            ))}
            <Button variant="secondary" size="sm" onClick={() => navigate("/auth")}>
              {user ? "My Account" : "Login"}
            </Button>
          </div>

          {/* Mobile Menu Button - Larger touch target */}
          <button
            className="md:hidden flex items-center justify-center w-12 h-12 -mr-2 text-primary-foreground active:bg-primary-foreground/10 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className={cn(
              "transition-transform duration-300 ease-out",
              isOpen ? "rotate-90" : "rotate-0"
            )}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </span>
          </button>
        </div>

        {/* Mobile Navigation - Animated slide down */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-1">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center px-4 py-4 text-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-all duration-200 active:scale-[0.98]",
                  "transform",
                  isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                )}
                style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
                activeClassName="text-primary-foreground font-semibold bg-primary-foreground/5"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div 
              className={cn(
                "px-4 pt-2 transform transition-all duration-200",
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              )}
              style={{ transitionDelay: isOpen ? `${navLinks.length * 50}ms` : "0ms" }}
            >
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full h-12 text-base font-medium active:scale-[0.98] transition-transform" 
                onClick={() => handleNavClick("/auth")}
              >
                {user ? "My Account" : "Login"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 -z-10 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Navigation;
