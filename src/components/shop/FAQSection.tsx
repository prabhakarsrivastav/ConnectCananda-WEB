import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "How do I access my purchased content?",
      answer: "After completing your purchase, you'll receive instant access. E-books will have a download link available for 48 hours, and courses can be accessed immediately through your dashboard.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods through our secure payment processor Stripe.",
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 7-day money-back guarantee on all courses. E-books are non-refundable once downloaded. Please review our refund policy for more details.",
    },
    {
      question: "Do courses have an expiry date?",
      answer: "No! Once you purchase a course, you have lifetime access. Learn at your own pace without any time restrictions.",
    },
    {
      question: "Will I receive a certificate?",
      answer: "Yes, all courses include a certificate of completion that you can download once you finish all modules.",
    },
    {
      question: "Is there a discount for bulk purchases?",
      answer: "Yes! Contact our support team for special pricing on bulk orders for organizations or teams.",
    },
  ];

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-12">
            Everything you need to know about our products
          </p>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
