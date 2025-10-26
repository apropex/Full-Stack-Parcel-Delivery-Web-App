import bgImg from "@/assets/images/a7.jpg";
import PageContainer from "@/components/layouts/PageContainer";
import Loading from "@/components/loader/Loading";
import { UpdateProfileForm } from "@/components/modules/public/UpdateProfileForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { format } from "date-fns";
import { Edit2, Mail, MapPin, Phone, User2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [editing, setEditing] = useState(false);

  if (isLoading) return <Loading />;

  // Safe fallbacks for user fields
  const displayName = user
    ? `${user.name.firstName} ${user.name.lastName}`
    : "Unknown User";
  const joined = user ? format(new Date(user.createdAt), "PPP") : "—";
  const role = user?.role ?? "User";
  const email = user?.email ?? "no-reply@example.com";
  const image = user?.image ?? "";

  return (
    <PageContainer className="py-8">
      {/* HERO */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
        <img
          src={bgImg}
          alt="Profile background"
          className="w-full h-full object-cover grayscale-[10%] brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-6 bottom-6 text-white"
        >
          <h1 className="text-3xl md:text-4xl font-semibold drop-shadow-sm">
            {displayName}
          </h1>
          <p className="mt-1 text-sm text-white/90 max-w-xl">
            Professional profile — manage your personal information, track activity, and
            update settings. Keeping your contact details up to date helps us deliver
            parcels faster.
          </p>
        </motion.div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Profile Card */}
        <motion.aside
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="col-span-1 bg-card rounded-xl p-5 shadow-lg border"
        >
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-muted grid place-content-center border">
              {image ? (
                <img src={image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User2Icon className="w-12 h-12 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{displayName}</h2>
                  <p className="text-sm text-muted-foreground">{role}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="px-3 py-1">Member</Badge>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {`Hi ${user?.name.firstName ?? ""}, keep your profile up to date so recipients can
                easily contact you. Your activity and parcel history help us personalise the
                service.`}
              </p>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setEditing((s) => !s)}
                >
                  <Edit2 className="w-4 h-4" />
                  {editing ? "Close" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div className="mt-6 border-t pt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" />
              <div>
                <div className="text-xs">Email</div>
                <div className="text-sm text-foreground">{email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4" />
              <div>
                <div className="text-xs">Phone</div>
                <div className="text-sm text-foreground">
                  {user?.phone ?? "Not provided"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" />
              <div>
                <div className="text-xs">Address</div>
                <div className="text-sm text-foreground">
                  {user?.address?.city
                    ? `${user.address.city}, ${user.address.street ?? ""}`.trim()
                    : "Not provided"}
                </div>
              </div>
            </div>

            <div className="pt-3 text-xs text-muted-foreground">
              Member since <span className="text-foreground">{joined}</span>
            </div>
          </div>
        </motion.aside>

        {/* MIDDLE: Stats & Activity */}
        <motion.main
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="col-span-2 grid grid-cols-1 gap-6"
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-lg p-4 shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Parcels Sent</h3>
                  <p className="text-2xl font-bold mt-2">—</p>
                </div>
                <div className="text-sm text-muted-foreground">Activity last 30 days</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-lg p-4 shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Parcels Received</h3>
                  <p className="text-2xl font-bold mt-2">—</p>
                </div>
                <div className="text-sm text-muted-foreground">Lifetime</div>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity / Summary */}
          <div className="bg-card rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Recent Activity & Profile Summary</h3>
              <div className="text-sm text-muted-foreground">Updated just now</div>
            </div>

            <div className="text-sm leading-relaxed text-muted-foreground">
              <p className="mb-2">
                <strong className="text-foreground">Professional summary:</strong>{" "}
                {` ${user?.name.firstName ?? "You"} is an active platform user focused on timely parcel sending and receiving. Maintaining an up-to-date profile (phone & address) helps reduce delivery delays and improves communication with couriers.`}
              </p>

              <ul className="list-disc ml-5 space-y-1">
                <li>Keep your preferred contact number updated for SMS notifications.</li>
                <li>
                  Set a default pickup address in your settings for faster checkout.
                </li>
                <li>
                  If you act as a sender for business volumes, verify your account to
                  unlock volume discounts.
                </li>
              </ul>
            </div>
          </div>

          {/* Optional: Other cards like security, preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div className="bg-card rounded-lg p-4 shadow-sm border">
              <h4 className="font-medium mb-2">Account & Security</h4>
              <p className="text-sm text-muted-foreground">
                Last password change: <span className="text-foreground">—</span>
              </p>
              <div className="mt-3 text-sm">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => alert("Change password flow")}
                >
                  Change password
                </Button>
              </div>
            </motion.div>

            <motion.div className="bg-card rounded-lg p-4 shadow-sm border">
              <h4 className="font-medium mb-2">Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Notifications: <span className="text-foreground">Enabled</span>
              </p>
              <div className="mt-3 text-sm">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => alert("Manage notifications")}
                >
                  Manage
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.main>
      </div>

      {/* EDIT FORM (slide down) */}
      <div className="max-w-6xl mx-auto mt-6">
        <AnimatePresence>
          {editing && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden bg-card rounded-lg shadow-sm border p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Profile</h3>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  Close
                </Button>
              </div>

              <UpdateProfileForm onClick={() => setEditing(false)} previewLink={image} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
