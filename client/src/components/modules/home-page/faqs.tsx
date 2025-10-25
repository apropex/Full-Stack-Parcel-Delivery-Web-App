import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Link } from "react-router";

export default function FAQs() {
  const faqItems = [
    {
      id: "item-1",
      question: "How long does standard delivery take?",
      answer:
        "Standard delivery within Dhaka usually takes 1-2 business days, while outside the city it takes 3-5 business days. Express delivery options are available for faster service.",
    },
    {
      id: "item-2",
      question: "Which payment methods are accepted?",
      answer:
        "We accept major credit/debit cards (Visa, Mastercard, Amex), mobile banking apps (bKash, Rocket), and cash on delivery. Corporate clients can request invoicing options.",
    },
    {
      id: "item-3",
      question: "Can I track my parcel in real-time?",
      answer:
        "Yes, each parcel is assigned a unique tracking ID. You can track its status through our website or mobile app in real-time.",
    },
    {
      id: "item-4",
      question: "What if my parcel is lost or damaged?",
      answer:
        "In the rare event of loss or damage, please contact our support team immediately. We have an insurance policy in place for eligible parcels to ensure compensation.",
    },
    {
      id: "item-5",
      question: "Do you offer international shipping?",
      answer:
        "Currently, we provide domestic shipping within Bangladesh. International shipping will be available soon — stay updated via our announcements.",
    },
  ];

  return (
    <div className="w-full relative bg-white dark:bg-black rounded-2xl md:rounded-4xl p-4 md:p-10 mt-24">
      {/* Dark background */}
      <div
        className="absolute inset-0 z-0 opacity-0 dark:opacity-100 rounded-2xl md:rounded-4xl"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
        }}
      />

      {/* Light background */}
      <div
        className="absolute inset-0 z-0 opacity-100 dark:opacity-0 rounded-2xl md:rounded-4xl"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />

      <div className="grid lg:grid-cols-2 relative z-10 gap-12">
        {/* Left section */}
        <motion.div
          className="lg:flex justify-center items-start relative"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center lg:text-left sticky top-8">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Clear answers to common parcel delivery queries.
            </p>
          </div>
        </motion.div>

        {/* Right section */}
        <motion.div
          className="mt-16 lg:mt-0 max-w-xl"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-6 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <AccordionItem value={item.id} className="border-dashed">
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <motion.p
            className="text-muted-foreground mt-6 px-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Can't find what you're looking for? Contact our{" "}
            <Link to="/contact" className="text-primary font-medium hover:underline">
              customer support team
            </Link>
            .
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
