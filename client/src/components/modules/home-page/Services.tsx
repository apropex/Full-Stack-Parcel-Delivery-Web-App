import vector2 from "@/assets/icons/hero-icons/Vector-1.png";
import vector3 from "@/assets/icons/hero-icons/Vector-2.png";
import vector1 from "@/assets/icons/hero-icons/Vector.png";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Link } from "react-router";

const items = [
  {
    icon: vector1,
    title: "Business Services",
    description:
      "We provide comprehensive delivery solutions tailored for your business. From logistics to shipment tracking, we ensure smooth and reliable operations.",
    list: ["Corporate goods", "Shipment", "Accessories"],
    isPopular: false,
  },
  {
    icon: vector2,
    title: "Statewide Services",
    description:
      "Fast and reliable home delivery across the city — we make sure your packages arrive safely at your doorstep within 48-72 hours.",
    list: ["Personal items", "Parcels", "Documents"],
    isPopular: true,
  },
  {
    icon: vector3,
    title: "Personal Services",
    description:
      "From sensitive documents to personal gifts — trust us for secure, on-time, and careful delivery to any location.",
    list: ["Gifts", "Package", "Documents"],
    isPopular: false,
  },
];

export default function Services() {
  return (
    <div className="">
      <div className="text-center my-12">
        <h2 className="text-4xl font-semibold text-primary">SERVICES</h2>
        <h3 className="text-2xl mt-3">Our services for you</h3>
      </div>

      <div className="flex flex-col md:flex-row justify-center md:items-stretch items-center gap-4 max-w-7xl mx-auto">
        {items.map(({ icon, title, description, list, isPopular }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.2 }}
            viewport={{ once: true, amount: 0.3 }} // ✅ fixes early animation issue
            className="relative p-6 md:p-12 rounded-2xl overflow-hidden flex-1 max-w-96"
          >
            <div
              className="absolute inset-0 z-0 bg-neutral-200 dark:bg-neutral-900 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            <div className="flex flex-col h-full relative z-10">
              <div className="flex-1">
                <div className="w-full flex justify-center relative mt-10">
                  <div className="size-16 bg-amber-300/50 dark:bg-amber-800/30 rounded-b-full rounded-tl-full absolute -top-8" />
                  <motion.img
                    src={icon}
                    alt=""
                    className="h-14 relative z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.2 + 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                  />
                </div>

                <motion.h3
                  className="text-2xl font-semibold text-center my-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.2 + 0.3 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.2 + 0.4 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {description}
                </motion.p>

                <motion.ul
                  className="my-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.2 + 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {list.map((l) => (
                    <li key={l} className="list-disc ml-5">
                      {l}
                    </li>
                  ))}
                </motion.ul>
              </div>

              <div className="flex justify-center mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 + 0.6 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Button
                    asChild
                    variant={isPopular ? "default" : "outline"}
                    className="min-w-48"
                  >
                    <Link to="/our-services">Learn more</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
