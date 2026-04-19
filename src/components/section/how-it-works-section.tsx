"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, LineChart } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Describe the Problem",
    description: "AI analyzes your device symptoms and provides an initial diagnosis with confidence scoring.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Get Matched",
    description: "Our geospatial system finds and dispatches the nearest verified technician to your location.",
    icon: Users,
  },
  {
    number: "03",
    title: "Track the Impact",
    description: "See your CO₂ savings in real-time using EPA WARM methodology. No greenwashing.",
    icon: LineChart,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            How <span className="text-primary">EcoServe</span> Works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to repair your device and save the planet
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step number with icon */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                    <div className="relative w-20 h-20 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number.replace("0", "")}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
