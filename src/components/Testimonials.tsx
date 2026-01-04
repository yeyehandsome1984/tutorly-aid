import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  grade: string;
  subject: string;
  rating: number;
  comment: string;
}

const TestimonialsSchema = ({ testimonials }: { testimonials: Testimonial[] }) => {
  // Calculate actual average rating
  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const averageRating = testimonials.length > 0 
    ? Math.round((totalRating / testimonials.length) * 10) / 10 
    : 5;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://micommercestreamtuition.com/#organization",
    "name": "MI Commerce Stream Tuition",
    "alternateName": ["MI Tuition", "MI Commerce Tuition"],
    "description": "Expert tuition for A-Level POA, MOB, Mathematics, and Economics in Singapore. 专业A水准补习。",
    "url": "https://micommercestreamtuition.com",
    "telephone": "+65 8511 6415",
    "email": "yichenue@gmail.com",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": testimonials.length,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": testimonials.map((t) => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": t.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Person",
        "name": t.name
      },
      "reviewBody": t.comment,
      "itemReviewed": {
        "@type": "Course",
        "name": `${t.subject} Tuition`,
        "provider": {
          "@type": "EducationalOrganization",
          "@id": "https://micommercestreamtuition.com/#organization",
          "name": "MI Commerce Stream Tuition"
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const Testimonials = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-muted">
      <TestimonialsSchema testimonials={testimonials} />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What Our Students Say | 学生反馈
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Real testimonials from our POA and MOB students who achieved excellent results
        </p>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="h-8 w-8 text-primary/30 flex-shrink-0" />
                  <div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-3">
                      "{testimonial.comment}"
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-primary font-medium">{testimonial.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {testimonial.grade}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
