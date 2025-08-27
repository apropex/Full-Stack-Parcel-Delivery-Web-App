import Logo from "@/assets/icons/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ROLES } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import LoadingText from "../loader/LoadingText";
import { ModeToggle } from "./Mode.Toggler";
import { ProfileMenu } from "./ProfileMenu";

const defaultLinks = [
  { href: "/", label: "Home", role: ROLES.PUBLIC },
  { href: "/our-services", label: "Out Services", role: ROLES.PUBLIC },
  { href: "/about", label: "About Us", role: ROLES.PUBLIC },
  { href: "/whats-new", label: "What's new?", role: ROLES.PUBLIC },
  { href: "/admin", label: "Dashboard", role: ROLES.ADMIN },
  { href: "/sender", label: "Dashboard", role: ROLES.SENDER },
  { href: "/receiver", label: "Dashboard", role: ROLES.RECEIVER },
];

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) return <LoadingText className="grid place-content-center mt-4" />;

  const navLinks = user
    ? defaultLinks.filter(({ role }) => role === "PUBLIC" || role === user.role)
    : defaultLinks.filter(({ role }) => role === "PUBLIC");

  return (
    <header className="py-5  border-b">
      <div className="container sm:px-6 lg:px-6 mx-auto flex justify-between gap-4">
        {/* Left side */}
        <div className="flex gap-2">
          <div className="flex items-center md:hidden">
            {/* Mobile menu trigger */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="group size-8" variant="ghost" size="icon">
                  <Logo />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navLinks.map(({ label, href }, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink asChild className="py-1.5">
                          <NavLink to={href}>{label}</NavLink>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>

          {/* Main nav */}
          <div className="hidden md:block">
            <Link to="/" className="text-primary hover:text-primary/90">
              <Logo />
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Navigation menu */}
          <NavigationMenu className="h-full *:h-full max-md:hidden">
            <NavigationMenuList className="h-full gap-2">
              {navLinks.map(({ label, href }, index) => (
                <NavigationMenuItem key={index} className="h-full">
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!",
                      { "text-primary": href === pathname }
                    )}
                  >
                    <NavLink to={href}>{label}</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/contact">
            <Button size="sm" className="rounded">
              Contact Us
            </Button>
          </Link>

          {/* Theme mode toggle */}
          <ModeToggle />

          {!user ? (
            <Button asChild size="sm" className="text-sm ">
              <Link to="/login">Login</Link>
            </Button>
          ) : (
            <ProfileMenu>
              <Button size="icon" variant="ghost" className="overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt="pi" className="object-cover w-full h-full" />
                ) : (
                  <User2 />
                )}
              </Button>
            </ProfileMenu>
          )}
        </div>
      </div>
    </header>
  );
}
