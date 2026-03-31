// import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
    reset();
  };

  return (
    <>
      {/* Decorative blurred blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent blur-[100px] pointer-events-none -z-10" />

      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto w-full flex-1 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl font-bold mb-6">
              Let's create something <span className="text-gradient">extraordinary</span> together.
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Whether you need an original score for your next film, impactful sound design for a game, or just want to collaborate on a track—I'm ready to listen.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Email</h4>
                  <a href="mailto:hello@aprilwave.com" className="text-muted-foreground hover:text-primary transition-colors">
                    hello@aprilwave.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Location</h4>
                  <p className="text-muted-foreground">
                    Available Worldwide (Remote) <br />
                    Based in the Pacific Northwest
                  </p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-16 pt-8 border-t border-border/50">
              <h4 className="font-bold text-foreground mb-4">Find me elsewhere</h4>
              <div className="flex gap-4">
                {['SoundCloud', 'Spotify', 'Bandcamp', 'Instagram'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors bg-white/50"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden"
          >
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h3 className="font-display text-2xl font-bold">Send a Message</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">Name</label>
                  <input 
                    {...register("name")}
                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="Jane Doe"
                  />
                  {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">Email</label>
                  <input 
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-xs text-destructive ml-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Subject</label>
                <select 
                  {...register("subject")}
                  className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground appearance-none"
                >
                  <option value="">Select a subject...</option>
                  <option value="Game Audio">Game Audio</option>
                  <option value="Film/Media Score">Film/Media Score</option>
                  <option value="Sound Design">Sound Design</option>
                  <option value="Licensing">Licensing</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
                {errors.subject && <p className="text-xs text-destructive ml-1">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Message</label>
                <textarea 
                  {...register("message")}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="Tell me about your project..."
                />
                {errors.message && <p className="text-xs text-destructive ml-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 ease-out flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>

            </form>
          </motion.div>
          
        </div>
      </section>
    </>
  );
}
