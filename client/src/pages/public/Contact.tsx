import PageContainer from "@/components/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  return (
    <PageContainer>
      <motion.div
        className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Card className="max-w-5xl w-full shadow-xl border border-border/40 backdrop-blur-lg bg-background/70">
          <CardContent className="grid md:grid-cols-2 gap-8 p-8">
            {/* ===== Left Side: Contact Info ===== */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex flex-col justify-center"
            >
              <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
              <p className="text-muted-foreground mb-6">
                Have questions or need support? Fill out the form or reach us using the
                contact details below. We usually reply within 24 hours.
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary" size={18} />
                  <span>support@parcelpro.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-primary" size={18} />
                  <span>+880 1234-567890</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary" size={18} />
                  <span>Banani, Dhaka, Bangladesh</span>
                </div>
              </div>
            </motion.div>

            {/* ===== Right Side: Contact Form ===== */}
            <motion.form
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! ✅");
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <Input placeholder="Your name" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input type="email" placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input placeholder="How can we help?" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea placeholder="Write your message..." rows={5} required />
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </PageContainer>
  );
}
