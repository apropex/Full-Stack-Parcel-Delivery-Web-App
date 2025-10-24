import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router";

export default function FAQs() {
  const faqItems = [
    {
      id: "item-1",
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days, depending on your location. Express shipping options are available at checkout for 1-2 business day delivery.",
    },
    {
      id: "item-2",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. For enterprise customers, we also offer invoicing options.",
    },
    {
      id: "item-3",
      question: "Can I change or cancel my order?",
      answer:
        "You can modify or cancel your order within 1 hour of placing it. After this window, please contact our customer support team who will assist you with any changes.",
    },
    {
      id: "item-4",
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days. Additional customs fees may apply depending on your country's import regulations.",
    },
    {
      id: "item-5",
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some specialty items may have different return terms, which will be noted on the product page.",
    },
  ];

  return (
    <div className="w-full relative bg-white dark:bg-black rounded-2xl md:rounded-4xl p-4 md:p-10 mt-24">
      {/* bg for dark */}
      <div
        className="absolute inset-0 z-0 opacity-0 dark:opacity-100 rounded-2xl md:rounded-4xl"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
        }}
      />

      {/* bg for light */}
      <div
        className="absolute inset-0 z-0 opacity-100 dark:opacity-0 rounded-2xl md:rounded-4xl"
        style={{
          backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)
      `,
          backgroundSize: "100% 100%",
        }}
      />

      <div className="grid lg:grid-cols-2 relative z-10">
        <div className="lg:flex justify-center items-start relative">
          <div className="text-center lg:text-left sticky top-8">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p>Accusantium quisquam. Illo, omnis?</p>
          </div>
        </div>

        {/*  */}

        <div className="mt-16 lg:mt-0 max-w-xl">
          <div className="pb-6">
            <h3 className="font-medium">What is the refund policy?</h3>
            <p className="text-muted-foreground mt-4">
              We offer a 30-day money back guarantee. If you are not satisfied with our
              product, you can request a refund within 30 days of your purchase.
            </p>

            <ol className="list-outside list-decimal space-y-2 pl-4">
              <li className="text-muted-foreground mt-4">
                To request a refund, please contact our support team with your order
                number and reason for the refund.
              </li>
              <li className="text-muted-foreground mt-4">
                Refunds will be processed within 3-5 business days.
              </li>
              <li className="text-muted-foreground mt-4">
                Please note that refunds are only available for new customers and are
                limited to one per customer.
              </li>
            </ol>
          </div>
          <div className="py-6">
            <h3 className="font-medium">How do I cancel my subscription?</h3>
            <p className="text-muted-foreground mt-4">
              You can cancel your subscription at any time by logging into your account
              and clicking on the cancel button.
            </p>
          </div>
          <div className="py-6">
            <h3 className="font-medium">Can I upgrade my plan?</h3>
            <p className="text-muted-foreground my-4">
              Yes, you can upgrade your plan at any time by logging into your account and
              selecting the plan you want to upgrade to.
            </p>
            <ul className="list-outside list-disc space-y-2 pl-4">
              <li className="text-muted-foreground">
                You will be charged the difference in price between your current plan and
                the plan you are upgrading to.
              </li>
              <li className="text-muted-foreground">
                Your new plan will take effect immediately and you will be billed at the
                new rate on your next billing cycle.
              </li>
            </ul>
          </div>
          <div className="py-6">
            <h3 className="font-medium">Do you offer phone support?</h3>
            <p className="text-muted-foreground mt-4">
              We do not offer phone support at this time. However, you can contact us via
              email or live chat for any questions or concerns you may have.
            </p>
          </div>

          {/*  */}

          <div className="mt-12">
            <Accordion
              type="single"
              collapsible
              className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
            >
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-dashed">
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <p className="text-muted-foreground mt-6 px-8">
              Can't find what you're looking for? Contact our{" "}
              <Link to="/contact" className="text-primary font-medium hover:underline">
                customer support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
