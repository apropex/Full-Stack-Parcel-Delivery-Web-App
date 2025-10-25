import PageContainer from "@/components/layouts/PageContainer";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Rocket, Wrench } from "lucide-react";
import { motion } from "motion/react";

const updates = [
  {
    title: "Role-Based Access Control",
    description:
      "Admin, Sender, and Receiver dashboards added with secure route protection.",
    date: "Oct 20, 2025",
    tag: "New Feature",
    icon: Rocket,
  },
  {
    title: "Parcel Tracking Improvements",
    description:
      "Enhanced live tracking with parcel status history and better map performance.",
    date: "Oct 15, 2025",
    tag: "Improvement",
    icon: Wrench,
  },
  {
    title: "Bug Fixes & Optimizations",
    description:
      "Fixed dashboard reload issue and optimized API response caching with RTK Query.",
    date: "Oct 10, 2025",
    tag: "Update",
    icon: Wrench,
  },
];

export default function WhatsNew() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-10">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">🚀 What’s New</h1>
          <p className="text-muted-foreground text-lg">
            Stay up-to-date with the latest improvements and feature releases in the
            Parcel Delivery System.
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Update List */}
        <div className="space-y-6">
          {updates.map((update, i) => {
            const Icon = update.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="border border-muted hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold">
                        {update.title}
                      </CardTitle>
                      <CardDescription>{update.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{update.tag}</Badge>
                  </CardHeader>
                  <CardContent className="flex items-center text-sm text-muted-foreground gap-2 mt-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>{update.date}</span>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
