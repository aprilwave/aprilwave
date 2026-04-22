import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <p className="font-brand text-7xl md:text-8xl text-primary/30 mb-2">
          404
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Lost in the mix
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          This page doesn't exist — or maybe it's just waiting for the right
          moment to drop.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
