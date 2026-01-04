import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
      </div>
    </div>
  );
};

export default Questions;
