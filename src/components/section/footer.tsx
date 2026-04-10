"use client";

import { motion } from "framer-motion";
import { Leaf, Globe } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Impact", href: "#impact" },
  { label: "Get Started", href: "/auth" },
];

const contactInfo = [
  { label: "hello@ecoserve.com", href: "mailto:hello@ecoserve.com" },
  { label: "+62 838-7961-3446", href: "tel:+6283879613446" },
  { label: "Jakarta, Indonesia", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative py-12 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">EcoServe</span>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                Empowering communities to embrace circular economy through
                responsible e-waste management and repair services.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Contact</h3>
              <ul className="space-y-3">
                {contactInfo.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border mt-10 mb-6" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © 2026 EcoServe. All rights reserved. Built for I/O Festival 2026.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
