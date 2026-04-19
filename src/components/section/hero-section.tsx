"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        {/* Circuit pattern overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M10 10h80v80H10z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle cx="10" cy="10" r="3" fill="currentColor" />
              <circle cx="90" cy="10" r="3" fill="currentColor" />
              <circle cx="10" cy="90" r="3" fill="currentColor" />
              <circle cx="90" cy="90" r="3" fill="currentColor" />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              <path
                d="M10 10L50 50M90 10L50 50M10 90L50 50M90 90L50 50"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
        {/* Floating particles - using fixed positions to avoid hydration mismatch */}
        {[
          { left: 5, top: 10, duration: 3.2, delay: 0.1 },
          { left: 15, top: 80, duration: 4.1, delay: 0.5 },
          { left: 25, top: 30, duration: 3.5, delay: 1.2 },
          { left: 35, top: 60, duration: 4.5, delay: 0.8 },
          { left: 45, top: 20, duration: 3.8, delay: 1.5 },
          { left: 55, top: 70, duration: 4.2, delay: 0.3 },
          { left: 65, top: 40, duration: 3.3, delay: 1.8 },
          { left: 75, top: 85, duration: 4.8, delay: 0.6 },
          { left: 85, top: 15, duration: 3.6, delay: 1.1 },
          { left: 95, top: 55, duration: 4.4, delay: 0.9 },
          { left: 10, top: 45, duration: 3.9, delay: 1.4 },
          { left: 20, top: 90, duration: 4.3, delay: 0.2 },
          { left: 30, top: 5, duration: 3.4, delay: 1.7 },
          { left: 40, top: 75, duration: 4.6, delay: 0.4 },
          { left: 50, top: 35, duration: 3.7, delay: 1.0 },
          { left: 60, top: 95, duration: 4.0, delay: 1.6 },
          { left: 70, top: 25, duration: 3.1, delay: 0.7 },
          { left: 80, top: 65, duration: 4.7, delay: 1.3 },
          { left: 90, top: 50, duration: 3.0, delay: 1.9 },
          { left: 8, top: 22, duration: 4.9, delay: 0.0 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">
                {"Indonesia's"} First AI-Powered E-Waste Platform
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight text-balance">
              <span className="text-primary">62 Million Tons</span> of E-Waste.{" "}
              <br className="hidden sm:block" />
              One Platform to Fight Back.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty">
              EcoServe connects you with verified repair technicians, tracks
              your device lifecycle, and measures the real carbon impact of
              every repair — powered by AI.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 text-lg h-14 gap-2 group"
                >
                  Start Repairing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth?role=technician">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-secondary text-foreground rounded-full px-8 text-lg h-14 gap-2"
                >
                  <Wrench className="w-5 h-5" />
                  Join as Technician
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero visual - App mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />

              {/* Phone mockup */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="relative mx-auto w-[280px] h-[560px] bg-card rounded-[3rem] border-4 border-border shadow-2xl overflow-hidden">
                  {/* Phone notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background rounded-b-2xl" />
                  
                  {/* App content */}
                  <div className="pt-10 px-4 h-full bg-background">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-xs font-bold">E</span>
                      </div>
                      <span className="font-semibold text-foreground">EcoServe</span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-card border border-border">
                        <p className="text-xs text-muted-foreground mb-1">CO₂ Saved This Month</p>
                        <p className="text-2xl font-bold text-primary">12.4 kg</p>
                        <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-primary rounded-full" />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border">
                        <p className="text-xs text-muted-foreground mb-2">Active Repair</p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="text-2xl">📱</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">iPhone 14 Pro</p>
                            <p className="text-xs text-muted-foreground">Screen replacement</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">In Progress</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-card border border-border">
                          <p className="text-xs text-muted-foreground">Devices</p>
                          <p className="text-lg font-bold text-foreground">4</p>
                        </div>
                        <div className="p-3 rounded-xl bg-card border border-border">
                          <p className="text-xs text-muted-foreground">Repairs</p>
                          <p className="text-lg font-bold text-foreground">7</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 px-4 py-2 bg-card rounded-xl border border-primary/30 shadow-lg"
              >
                <p className="text-xs text-muted-foreground">Carbon Saved</p>
                <p className="text-lg font-bold text-primary">+2.3 kg</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 bg-card rounded-xl border border-accent/30 shadow-lg"
              >
                <p className="text-xs text-muted-foreground">Technician ETA</p>
                <p className="text-lg font-bold text-accent">12 min</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
