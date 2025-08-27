import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, SendHorizonal } from "lucide-react";
import { Link } from "react-router";

import img2 from "@/assets/images/a3.jpeg";
import img1 from "@/assets/images/a6.jpg";

export default function OurServices() {
  return (
    <section className="overflow-hidden">
      <div className="relative mx-auto container px-6 py-28 lg:py-20">
        <div className="lg:flex lg:items-center lg:gap-12">
          <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
            <Link
              to="/"
              className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3 lg:ml-0"
            >
              <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">
                New
              </span>
              <span className="text-sm">Happy Parcel Picker</span>
              <span className="bg-(--color-border) block h-4 w-px"></span>

              <ArrowRight className="size-4" />
            </Link>

            <h1 className="mt-10 text-balance text-4xl font-bold md:text-5xl xl:text-5xl">
              Happy Parcel Picker <br />
              Our Services
            </h1>
            <p className="mt-8">
              Error totam sit illum. Voluptas doloribus asperiores quaerat aperiam. Quidem
              harum omnis beatae ipsum soluta!
            </p>

            <div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mx-auto my-10 max-w-sm lg:my-12 lg:ml-0 lg:mr-auto"
              >
                <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                  <Mail className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                  <input
                    placeholder="Your mail address"
                    className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                    type="email"
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

              <ul className="list-inside list-disc space-y-2">
                <li>Faster</li>
                <li>Modern</li>
                <li>100% Customizable</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3">
          <div className="relative">
            <div className="bg-radial-[at_65%_25%] to-background z-1 -inset-17 absolute from-transparent to-40%"></div>
            <img
              className="hidden dark:block w-full h-full object-cover"
              src={img1}
              alt="app illustration"
            />
            <img
              className="dark:hidden w-full h-full object-cover"
              src={img2}
              alt="app illustration"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
