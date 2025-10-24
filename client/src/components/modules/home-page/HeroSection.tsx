import Logo from "@/assets/icons/logo";
import img from "@/assets/images/a6.jpg";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Calendar } from "lucide-react";
import { Link } from "react-router";

export default function HeroSection() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <section className="py-16">
      <div className="z-10 mx-auto flex max-w-4xl flex-col items-center gap-14 text-center">
        <Logo size="64" />
        <div id="home_hero_section">
          <h1
            id="home_hero_section_title"
            className="mb-4 text-3xl font-medium text-pretty lg:text-6xl"
          >
            Build Exceptional Online Experiences
          </h1>
          <p
            id="home_hero_section_description"
            className="mx-auto max-w-xl text-muted-foreground"
          >
            Create a website that captures attention, drives engagement, and aligns with
            your goals, all in a matter of days.
          </p>
        </div>

        <div className="flex justify-center">
          <Button asChild size="lg" className="w-full sm:w-fit">
            <Link to={user && user.role ? `/${user.role.toLowerCase()}` : "/login"}>
              <Calendar className="mr-2 h-4" />
              Get Started Today
            </Link>
          </Button>
        </div>
      </div>
      <img
        src={img}
        alt="placeholder"
        className="mx-auto mt-24 aspect-video max-h-[700px] w-full max-w-7xl rounded-t-lg object-cover shadow-md"
      />
    </section>
  );
}
