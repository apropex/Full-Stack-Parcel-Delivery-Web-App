import vector2 from "@/assets/icons/hero-icons/Vector-1.png";
import vector3 from "@/assets/icons/hero-icons/Vector-2.png";
import vector1 from "@/assets/icons/hero-icons/Vector.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const items = [
  {
    icon: vector1,
    title: "Business Services",
    description:
      "We give you complete reliable delivery for your company.  We will take full responsibility of the deliveries.",
    list: ["Corporate goods", "Shipment", "Accessories"],
    isPopular: false,
  },
  {
    icon: vector2,
    title: "Statewide Services",
    description:
      "Offering home delivery around the city, where your products will be at your doorstep within 48-72 hours.",
    list: ["Personal items", "Parcels", "Documents"],
    isPopular: true,
  },
  {
    icon: vector3,
    title: "Personal Services",
    description:
      "You can trust us to safely deliver your most sensitive documents to the specific area in a short time.",
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
          <div
            className=" relative p-6 md:p-12 rounded-2xl overflow-hidden flex-1 max-w-96"
            key={i}
          >
            <div
              className="absolute inset-0 z-0 bg-neutral-200 dark:bg-neutral-900 opacity-30"
              style={{
                // background: "#000000",
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
                  <div className="size-16 bg-amber-300 rounded-b-full rounded-t-xl absolute -top-8" />
                  <img src={icon} alt="" className="h-14 relative z-10" />
                </div>

                <h3 className="text-2xl font-semibold text-center my-4">{title}</h3>

                <p>{description}</p>

                <ul className="my-4">
                  {list.map((l) => (
                    <li key={l} className="list-disc ml-5">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  asChild
                  variant={isPopular ? "default" : "outline"}
                  className="min-w-48"
                >
                  <Link to="/our-services">Learn more</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
