import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MouseGlow } from "@/components/MouseGlow";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary selection:text-primary-foreground">
      <MouseGlow />
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 w-full flex flex-col"
        >
          {children}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
