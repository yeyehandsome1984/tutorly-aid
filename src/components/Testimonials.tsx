import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  name: string;
  subject: string;
  achievement: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Xin Yu W.",
    subject: "POA (Principles of Accounting)",
    achievement: "A- for Financial Management, GPA jumped to Second Upper",
    quote: "Just got my results! Got A- for FM. Overall GPA jumped to second upper. Thank you so much!",
    rating: 5,
  },
  {
    name: "Student (Year 3)",
    subject: "POA (Principles of Accounting)",
    achievement: "From struggling in Year 1 to finding joy in studying",
    quote: "Thank you so much for your guidance and support throughout the past three years! I'm very grateful to have been taught by such a passionate, enthusiastic and funny teacher! I remember how much I used to struggle with accounting in Year 1, but thanks to you, I've found joy in studying POA!",
    rating: 5,
  },
  {
    name: "Neva",
    subject: "POA (Principles of Accounting)",
    achievement: "Significant improvement in exam performance",
    quote: "Good! Improved a lot after the tuition sessions. The exam went much better than expected.",
    rating: 5,
  },
  {
    name: "Student",
    subject: "POA (Principles of Accounting)",
    achievement: "Scored A for Accounting exam",
    quote: "ACCOUNTING GET A! THANK YOU LAOSHI! 谢谢老师的帮助！",
    rating: 5,
  },
  {
    name: "Mik's Parent",
    subject: "POA (Principles of Accounting)",
    achievement: "Student got promoted with tremendous improvement",
    quote: "I spoke to Mik and she was so happy that she got promoted. She was grateful for your guidance and felt you have helped her improve tremendously. Once again, wanna say thanks for being there for her.",
    rating: 5,
  },
  {
    name: "JC2 Student",
    subject: "MOB (Management of Business)",
    achievement: "Improved from C to A in MOB",
    quote: "I'm very grateful to be your student and thank you for being so passionate whenever you're teaching us! It's very rare to find such an enthusiastic teacher nowadays. My MOB grades improved from C to A!",
    rating: 5,
  },
  {
    name: "Sarah L.",
    subject: "MOB (Management of Business)",
    achievement: "Distinction in A-Level MOB",
    quote: "The structured approach to case studies and real-world business examples made MOB concepts so much clearer. Scored distinction in my A-Levels! 非常感谢老师的耐心教导！",
    rating: 5,
  },
  {
    name: "Wei Ling C.",
    subject: "POA (Principles of Accounting)",
    achievement: "92/100 in school exam",
    quote: "Scored 92 marks for my POA paper! The practice questions and clear explanations of accounting concepts really helped. 老师讲解得很清楚，容易理解！",
    rating: 5,
  },
];

const TestimonialsSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "MI Tuition",
    "description": "Expert tuition for A-Level POA, MOB, Mathematics, and Economics in Singapore",
    "url": "https://micommercestreamtuition.com",
    "review": testimonials.map((t) => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": t.rating,
        "bestRating": 5,
      },
      "author": {
        "@type": "Person",
        "name": t.name,
      },
      "reviewBody": t.quote,
      "itemReviewed": {
        "@type": "Course",
        "name": `${t.subject} Tuition`,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "MI Tuition",
        },
      },
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 5,
      "reviewCount": testimonials.length,
      "bestRating": 5,
      "worstRating": 1,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const Testimonials = () => {
  return (
    <section className="py-8 bg-muted">
      <TestimonialsSchema />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What Our Students Say | 学生反馈
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Real testimonials from our POA and MOB students who achieved excellent results
        </p>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="shadow-card hover:shadow-elevated transition-shadow">
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
                      "{testimonial.quote}"
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-primary font-medium">{testimonial.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ✓ {testimonial.achievement}
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
