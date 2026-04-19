"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const impactStats = [
  {
    value: 1247,
    suffix: " kg",
    label: "CO₂ Avoided",
    prefix: "",
  },
  {
    value: 389,
    suffix: "",
    label: "Devices Repaired",
    prefix: "",
  },
  {
    value: 142,
    suffix: "",
    label: "Technicians Active",
    prefix: "",
  },
  {
    value: 284,
    suffix: "M",
    label: "Saved vs Buying New",
    prefix: "Rp ",
  },
];

function ImpactCounter({
  value,
  suffix,
  prefix,
  inView,
}: {
  value: number;
  suffix: string;
  prefix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2500;
    const steps = 80;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tabular-nums drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ImpactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="impact" className="relative py-24 lg:py-32 bg-card overflow-hidden">
      {/* Glowing background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Our Collective <span className="text-primary">Impact</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Updated in real-time as repairs complete
          </p>
        </motion.div>

        <div
          ref={ref}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative p-6 lg:p-8 rounded-2xl bg-background/50 border border-primary/20 backdrop-blur-sm text-center h-full">
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-2xl border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <ImpactCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    inView={isInView}
                  />
                  <p className="mt-3 text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
          <span className="text-sm text-muted-foreground">Live data</span>
        </motion.div>
      </div>
    </section>
  );
}
