'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqSection() {
  const faqs = [
    {
      question: 'How does the credit-based system work?',
      answer:
        "It's simple—each message you send costs one credit. You purchase credits in packages when you need them, and they never expire. No subscriptions, no recurring fees—just pay for what you use.",
    },
    {
      question: 'Do I get any free credits when I sign up?',
      answer:
        'Yes! Every new user receives 100 free credits upon registration. You can use these to send 100 messages (all at once or gradually) to try out our platform with no risk.',
    },
    {
      question: 'Are there any features that require higher spending?',
      answer:
        'Absolutely not! Every user, regardless of how many credits they purchase, enjoys the same level of service, features, and support. This includes API access, advanced scheduling, message templates, and 24/7 support.',
    },
    {
      question: 'Can I personalize messages for each recipient?',
      answer:
        'Yes, Blastify supports dynamic message personalization. You can include variables such as name, company, custom fields, and more to make each message feel personally crafted for the recipient—at no extra cost.',
    },
    {
      question: 'What happens when I run out of credits?',
      answer:
        "When your credits run low, you'll receive a notification. You can easily top up with more credits at any time through our simple checkout process. Your access to features and analytics remains uninterrupted.",
    },
    {
      question: 'Can I schedule messages to be sent later?',
      answer:
        'Yes, our advanced scheduling feature allows you to prepare campaigns in advance and schedule them for the perfect time. You can set one-time sends or recurring messages—all included for every user.',
    },
    {
      question: 'Are there any hidden fees or charges?',
      answer:
        'None whatsoever. We believe in total transparency. The price you see is the price you pay—no setup fees, no monthly fees, no API fees, and no charges for extra features. Just simple credit-based pricing.',
    },
    {
      question: 'Do credits expire after purchase?',
      answer:
        "No, your purchased credits never expire. Use them whenever you need them, whether that's tomorrow or next year. There's no pressure to 'use them or lose them'.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Get answers to the most common questions about our WhatsApp
            marketing platform
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-border"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
