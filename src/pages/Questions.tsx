import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import FAQSchema from "@/components/FAQSchema";

const faqs = [
  {
    question: "What is the background of MI Tuition tutors?",
    answer:
      "Our tutors are ex-MOE teachers and former MI (Millennia Institute) students who excelled in their respective subjects. With first-hand experience of the JC commerce stream curriculum, we understand exactly what students need to succeed.",
  },
  {
    question: "Why does MI Tuition focus on commerce stream subjects?",
    answer:
      "We specialize in commerce stream subjects (POA, MOB, Mathematics, Economics) because this is our niche expertise. By focusing on what we know best, we can provide excellent, targeted tuition services that truly meet the needs of JC students in these subjects.",
  },
  {
    question: "Do you offer both online and offline tuition?",
    answer:
      "Yes! We offer both online and offline tuition options to suit your preferences and schedule. Whether you prefer face-to-face learning or the convenience of online sessions, we have you covered.",
  },
  {
    question: "What subjects does MI Tuition offer?",
    answer:
      "We offer expert tuition for Principles of Accounting (POA), Management of Business (MOB), Mathematics, and Economics for JC students in Singapore.",
  },
  {
    question: "How can I contact MI Tuition?",
    answer:
      "You can reach us via WhatsApp at +65 8511 6415 or email us at yichenue@gmail.com. We respond to enquiries promptly.",
  },
  {
    question: "Can I arrange a trial lesson? What about pricing?",
    answer:
      "Yes, we can arrange a trial lesson for you. Pricing will be discussed through WhatsApp or call separately.",
  },
];

const Questions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="FAQ | Frequently Asked Questions | MI Tuition"
        description="Find answers to common questions about MI Tuition services. Learn about our tutors, subjects offered, online and offline options, and how to get started."
        keywords="MI Tuition FAQ, tuition questions, POA tuition FAQ, MOB tuition FAQ, JC commerce tuition"
        canonicalUrl="/questions"
      />
      <FAQSchema faqs={faqs} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find answers to common questions about our tuition services</p>
        </div>

        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Cross-linking section */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            Contact us directly or explore more about our tutors and subjects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 px-0">
            <a href="https://wa.me/6585116415" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" variant="default" className="w-full sm:w-auto">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </a>
            <a href="mailto:yichenue@gmail.com" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/tutors" className="text-primary hover:underline font-medium">
              Meet Our Tutors →
            </Link>
            <Link to="/subjects" className="text-primary hover:underline font-medium">
              View Subjects →
            </Link>
            <Link to="/" className="text-primary hover:underline font-medium">
              Back to Home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;