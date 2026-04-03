'use client';

import React from 'react';
import Button from '../ui/Button';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: 'emerald' | 'teal' | 'cyan';
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  features,
  color,
}) => {
  const colorStyles = {
    emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
    cyan: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
  };

  const bgStyles = {
    emerald: 'bg-emerald-50',
    teal: 'bg-teal-50',
    cyan: 'bg-cyan-50',
  };

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Icon */}
      <div className={`w-16 h-16 bg-gradient-to-br ${colorStyles[color]} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button variant="outline" fullWidth>
        Learn More
      </Button>
    </div>
  );
};

export const ServiceCategories: React.FC = () => {
  return (
    <section id="services" className="py-12 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Our Services
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Professional repair and recycling services for all your electronic devices.
          </p>
        </div>

        {/* Mobile: Horizontal Scroll / Desktop: Grid */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
            {/* Pendingin */}
            <div className="snap-center flex-shrink-0 w-[85vw] max-w-sm">
              <ServiceCard
                title="Pendingin"
                description="Expert repair services for cooling appliances to keep them running efficiently."
                color="emerald"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                features={[
                  'AC Repair & Maintenance',
                  'Refrigerator Repair',
                  'Cooling System Check',
                  'Gas Refill Service',
                ]}
              />
            </div>

            {/* Home Appliances */}
            <div className="snap-center flex-shrink-0 w-[85vw] max-w-sm">
              <ServiceCard
                title="Home Appliances"
                description="Comprehensive repair solutions for all your household appliances."
                color="teal"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
                features={[
                  'Washing Machine Repair',
                  'Microwave Service',
                  'Vacuum Cleaner Fix',
                  'Small Appliance Repair',
                ]}
              />
            </div>

            {/* IT & Gadget */}
            <div className="snap-center flex-shrink-0 w-[85vw] max-w-sm">
              <ServiceCard
                title="IT & Gadget"
                description="Professional diagnostics and repair for your digital devices."
                color="cyan"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                }
                features={[
                  'Smartphone Repair',
                  'Laptop & PC Service',
                  'Tablet Screen Replacement',
                  'Battery Replacement',
                ]}
              />
            </div>
          </div>
          {/* Scroll indicator */}
          <div className="flex justify-center items-center gap-2 mt-2 text-gray-400 text-sm">
            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span>Swipe to see more</span>
            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Pendingin (Cooling Appliances) */}
          <ServiceCard
            title="Pendingin"
            description="Expert repair services for cooling appliances to keep them running efficiently."
            color="emerald"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            features={[
              'AC Repair & Maintenance',
              'Refrigerator Repair',
              'Cooling System Check',
              'Gas Refill Service',
            ]}
          />

          {/* Home Appliances */}
          <ServiceCard
            title="Home Appliances"
            description="Comprehensive repair solutions for all your household appliances."
            color="teal"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            features={[
              'Washing Machine Repair',
              'Microwave Service',
              'Vacuum Cleaner Fix',
              'Small Appliance Repair',
            ]}
          />

          {/* IT & Gadget */}
          <ServiceCard
            title="IT & Gadget"
            description="Professional diagnostics and repair for your digital devices."
            color="cyan"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            features={[
              'Smartphone Repair',
              'Laptop & PC Service',
              'Tablet Screen Replacement',
              'Battery Replacement',
            ]}
          />
        </div>

        {/* CTA Section */}
        <div className="mt-8 md:mt-12 text-center space-y-4">
          <p className="text-gray-600">
            Not sure which service you need?
          </p>
          <Button size="lg">
            Get AI Diagnosis
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
