"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Smartphone, Wrench, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export function DualCtaSection() {
  return (
    <section id="cta" className="relative py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Ready to <span className="text-primary">Join</span> the Movement?
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            <div className="relative p-8 lg:p-10 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  Got a Broken Device?
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  Get AI diagnosis + matched with a nearby technician in minutes
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "AI-powered diagnosis",
                    "Verified local technicians",
                    "Track carbon savings",
                    "Digital repair history",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 w-full sm:w-auto gap-2 group/btn"
                  >
                    Start a Repair Request
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Technician Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group"
          >
            <div className="relative p-8 lg:p-10 rounded-3xl bg-card border border-border hover:border-accent/50 transition-all duration-300 h-full overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <Wrench className="w-7 h-7 text-accent" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  Are You a Repair Technician?
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  Join our network, get orders by location, track your earnings
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Location-based job matching",
                    "Transparent earnings tracking",
                    "Build your reputation",
                    "Grow your business",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth?role=technician">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-full px-8 w-full sm:w-auto gap-2 group/btn"
                  >
                    Register as Technician
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
