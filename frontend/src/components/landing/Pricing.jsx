
import React from 'react';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: "Starter",
    price: "₱129",
    description: "Perfect for small businesses and startups",
    features: [
      "Up to 1,000 contacts",
      "Basic contact management",
      "Email integration",
      "Task management",
      "Mobile app access",
      "Standard support"
    ],
    recommended: false,
    buttonText: "Start Free Trial"
  },
  {
    name: "Professional",
    price: "₱379",
    description: "Ideal for growing teams and businesses",
    features: [
      "Up to 10,000 contacts",
      "Advanced contact management",
      "Multi-channel communication",
      "Custom reporting",
      "Workflow automation",
      "API access",
      "Priority support"
    ],
    recommended: true,
    buttonText: "Start Free Trial"
  },
  {
    name: "Enterprise",
    price: "₱599",
    description: "For large organizations with complex needs",
    features: [
      "Unlimited contacts",
      "Enterprise-grade security",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced analytics",
      "SLA guarantees",
      "24/7 premium support"
    ],
    recommended: false,
    buttonText: "Contact Sales"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 from-blue-100 to-indigo-50 bg-gradient-to-br">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title font-display">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            Choose the plan that fits your business needs. All plans include a 14-day free trial.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                rounded-xl p-8 transition-all duration-300 
                ${plan.recommended 
                  ? 'bg-gradient-to-br from-[#000046] to-[#1CB5E0] text-white shadow-lg transform hover:-translate-y-2' 
                  : 'bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-1'
                }
              `}
            >
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${!plan.recommended && 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mb-4 ${!plan.recommended && 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <div className="flex justify-center items-baseline">
                  <span className={`text-4xl font-extrabold ${!plan.recommended && 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`ml-1 text-xl ${!plan.recommended ? 'text-gray-600' : 'text-gray-100'}`}>
                    /month
                  </span>
                </div>
              </div>
              
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check 
                      size={20} 
                      className={`mr-2 flex-shrink-0 ${!plan.recommended ? 'text-[#1CB5E0]' : ''}`} 
                    />
                    <span className={!plan.recommended ? 'text-gray-700' : ''}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 
                  ${plan.recommended 
                    ? 'bg-white text-primary hover:bg-gray-100' 
                    : 'bg-gradient-to-r from-[#000046] to-[#1CB5E0] text-white hover:shadow-md'}
                `}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
