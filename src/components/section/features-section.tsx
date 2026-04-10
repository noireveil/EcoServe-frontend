"use client";

import { motion } from "framer-motion";
import { Bot, Shield, Smartphone, Leaf, MapPin, Zap } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Diagnostic Triage",
    description: "Gemini-powered symptom analysis with confidence scoring for accurate initial diagnosis.",
  },
  {
    icon: Shield,
    title: "Anti-Fraud Layer",
    description: "GPS lock + photo proof + dual confirmation ensures transparent and trustworthy repairs.",
  },
  {
    icon: Smartphone,
    title: "Digital Product Passport",
    description: "Complete lifecycle history for every device, from purchase to repair to resale.",
  },
  {
    icon: Leaf,
    title: "Carbon Calculator",
    description: "EPA WARM methodology for accurate carbon impact measurement. No greenwashing.",
  },
  {
    icon: MapPin,
    title: "Geospatial Matching",
    description: "Radius-based technician routing finds the nearest verified repair expert.",
  },
  {
    icon: Zap,
    title: "PWA Native Feel",
    description: "Install directly on your device, works offline. Fast and responsive experience.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-background overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Built <span className="text-primary">Different</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Cutting-edge technology meets environmental responsibility
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
