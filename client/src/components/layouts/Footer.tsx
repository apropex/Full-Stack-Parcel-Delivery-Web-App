import Logo from "@/assets/icons/logo";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-background mx-auto container">
      <div className="px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand Section */}
          <div>
            <div className="flex justify-center items-center gap-2.5 text-foreground sm:justify-start">
              <Logo size="48" />
              <h3 className="text-2xl font-bold">Happy Parcel Picker</h3>
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed text-foreground/80 sm:max-w-xs sm:text-left">
              Providing reliable and seamless travel experiences across Bangladesh. Your
              journey, our priority.
            </p>

            {/* <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              <li>
                <Link
                  to="#"
                  className="text-foreground transition hover:text-foreground/75"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </li>

              <li>
                <Link
                  to="#"
                  className="text-foreground transition hover:text-foreground/75"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </li>
            </ul> */}
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-foreground">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    to="#"
                    className="text-foreground transition hover:text-foreground/75"
                  >
                    Company History
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-foreground transition hover:text-foreground/75"
                  >
                    Meet the Team
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-foreground transition hover:text-foreground/75"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-foreground">Our Services</p>
              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    to="#"
                    className="text-foreground transition hover:text-foreground/75"
                  >
                    Tour Packages
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-foreground transition hover:text-foreground/75"
                  >
                    Custom Tours
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-foreground transition hover:text-foreground/75"
                  >
                    Hotel Booking
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-foreground transition hover:text-foreground/75"
                  >
                    Transportation
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-foreground">Support</p>
              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    to="#"
                    className="text-foreground transition hover:text-foreground/75"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-foreground transition hover:text-foreground/75"
                  >
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center gap-2 text-foreground hover:text-foreground/75"
                  >
                    Live Chat
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex size-2 rounded-full bg-teal-500"></span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-foreground">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link to="#" className="flex items-center gap-2 text-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>support@happytour.com</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center gap-2 text-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>+880 123 456 789</span>
                  </Link>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <address className="not-italic">213 Lane, Dhaka, Bangladesh</address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-100 pt-6 text-center sm:text-left sm:flex sm:justify-between">
          <p className="text-sm text-gray-500">
            &copy; 2025 Happy Parcel Picker. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <Link
              to="#"
              className="text-teal-600 underline transition hover:text-teal-600/75 mr-2"
            >
              Terms & Conditions
            </Link>
            <span className="text-gray-500 mx-1">&middot;</span>
            <Link
              to="#"
              className="text-teal-600 underline transition hover:text-teal-600/75"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
