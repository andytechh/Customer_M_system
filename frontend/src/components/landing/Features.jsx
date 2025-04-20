
import React from 'react';
import { Users, BarChart2, Calendar, MessageCircle, Database, Shield } from 'lucide-react';

const featureData = [
  {
    icon: <Users size={36} className="text-[#1CB5E0] mb-4 animate-float" />,
    title: "Contact Management",
    description: "Organize and manage all your customer data in one place with powerful filtering and segmentation tools."
  },
  {
    icon: <BarChart2 size={36} className="text-[#1CB5E0] mb-4 animate-float" />,
    title: "Analytics & Reporting",
    description: "Gain valuable insights with customizable dashboards and reports that help you make data-driven decisions."
  },
  {
    icon: <Calendar size={36} className="text-[#1CB5E0] mb-4 animate-float" />,
    title: "Task Management",
    description: "Never miss a follow-up with integrated task management and automated reminders for your team."
  },
  {
    icon: <MessageCircle size={36} className="text-[#1CB5E0] mb-4 animate-float" />,
    title: "Multi-channel Communication",
    description: "Engage with customers across email, SMS, and social media all from a single unified inbox."
  },
  {
    icon: <Database size={36} className="text-[#1CB5E0] mb-4 animate-float" />,
    title: "Data Integration",
    description: "Seamlessly connect with your existing tools and import data from various sources without hassle."
  },
  {
    icon: <Shield size={36} className="text-[#1CB5E0] mb-4 animate-float" />,
    title: "Security & Compliance",
    description: "Rest easy knowing your customer data is protected with enterprise-grade security and compliance tools."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 from-blue-100 to-indigo-50 bg-gradient-to-br">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title font-fraunces">Powerful Features for Modern Teams</h2>
          <p className="section-subtitle">
            Everything you need to attract, engage, and delight customers throughout their journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <div key={index} className="feature-card flex flex-col items-start">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
