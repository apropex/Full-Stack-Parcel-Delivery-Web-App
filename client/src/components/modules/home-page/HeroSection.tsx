import Logo from "@/assets/icons/logo";
import img from "@/assets/images/a6.jpg";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function HeroSection() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <section className="py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="z-10 mx-auto flex max-w-4xl flex-col items-center gap-14 text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Logo size="64" />
        </motion.div>

        <motion.div
          id="home_hero_section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1
            id="home_hero_section_title"
            className="mb-4 text-3xl font-medium text-balance lg:text-6xl"
          >
            Deliver Smarter, <br className="hidden sm:block" /> Faster, and Better
          </h1>

          <p
            id="home_hero_section_description"
            className="mx-auto max-w-xl text-muted-foreground text-base leading-relaxed"
          >
            Simplify your parcel delivery workflow with real-time tracking, instant pickup
            scheduling, and seamless logistics management — all in one modern platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button asChild size="lg" className="w-full sm:w-fit">
            <Link to={user && user.role ? `/${user.role.toLowerCase()}` : "/login"}>
              <Calendar className="mr-2 h-4" />
              Get Started Today
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.img
        src={img}
        alt="Delivery illustration"
        className="mx-auto mt-24 aspect-video max-h-[700px] w-full max-w-7xl rounded-t-lg object-cover shadow-md"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      />
    </section>
  );
}
