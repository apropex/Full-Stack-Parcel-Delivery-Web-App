import img2 from "@/assets/images/a3.jpeg";
import img1 from "@/assets/images/a6.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Clock,
  Mail,
  Package,
  SendHorizonal,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function OurServices() {
  return (
    <section className="overflow-hidden relative">
      <div className="relative mx-auto container px-6 py-28 lg:py-24">
        <div className="lg:flex lg:items-center lg:gap-12">
          {/* Left Section */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left"
          >
            <Link
              to="#"
              className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3 lg:ml-0"
            >
              <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">
                New
              </span>
              <span className="text-sm font-medium">Happy Parcel Picker</span>
              <span className="bg-(--color-border) block h-4 w-px"></span>
              <ArrowRight className="size-4" />
            </Link>

            <h1 className="mt-10 text-balance text-4xl font-bold md:text-5xl xl:text-5xl">
              Smart, Reliable <br /> and Fast Delivery Services
            </h1>
            <p className="mt-8 text-muted-foreground text-base leading-relaxed">
              We provide a fully optimized parcel delivery experience that ensures speed,
              security, and customer satisfaction. From pickup to doorstep delivery —
              everything is managed seamlessly through our modern logistics platform.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto my-10 max-w-sm lg:my-12 lg:ml-0 lg:mr-auto"
            >
              <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                <Mail className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                <input
                  placeholder="Your email address"
                  className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                  type="email"
                  required
                />

                <div className="md:pr-1.5 lg:pr-0">
                  <Button aria-label="submit" className="rounded-(--radius)">
                    <span className="hidden md:block">Get Started</span>
                    <SendHorizonal
                      className="relative mx-auto size-5 md:hidden"
                      strokeWidth={2}
                    />
                  </Button>
                </div>
              </div>
            </form>

            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Real-time parcel tracking and updates</li>
              <li>24/7 dedicated customer support</li>
              <li>Advanced security & delivery insurance</li>
            </ul>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="absolute right-0 top-0 w-full lg:w-1/2 lg:static mt-12 lg:mt-0"
          >
            <div className="relative">
              <div className="bg-radial-[at_65%_25%] to-background z-1 -inset-17 absolute from-transparent to-55%"></div>
              <img
                className="hidden dark:block w-full h-full object-cover rounded-3xl"
                src={img1}
                alt="Parcel delivery illustration"
              />
              <img
                className="dark:hidden w-full h-full object-cover rounded-3xl"
                src={img2}
                alt="Parcel delivery illustration"
              />
            </div>
          </motion.div>
        </div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: Package,
              title: "Fast Parcel Pickup",
              desc: "Schedule a pickup anytime and our riders will collect your parcel right from your doorstep within minutes.",
            },
            {
              icon: Truck,
              title: "Nationwide Delivery",
              desc: "From Dhaka to any corner of Bangladesh — we ensure on-time and reliable parcel delivery services.",
            },
            {
              icon: ShieldCheck,
              title: "Secure & Insured",
              desc: "Your parcel’s safety is our priority. Every package is securely handled and insured for peace of mind.",
            },
            {
              icon: Clock,
              title: "Real-time Tracking",
              desc: "Monitor your parcel’s journey in real-time with live updates and delivery notifications.",
            },
          ].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border border-border/40 bg-background/70 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <service.icon className="size-10 mx-auto text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
