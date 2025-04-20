import { useNavigate, Link } from 'react-router-dom';
import React from 'react';

const CTA = () => {
  return (
    <section id="contact" className="py-34 bg-gradient-to-br from-[#000046] to-[#1CB5E0] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Customer Relationships?
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Join thousands of businesses that use CatchCRM to grow faster and provide outstanding customer experiences.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/customer-access" 
            className="px-8 py-4 bg-white text-[#1CB5E0] font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
          >
            Start Your Free Trial
          </Link>
          <Link 
              to="/pricing" 
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/50 hover:bg-opacity-10 transition-all duration-200 hover:-translate-y-1"
          >
            Request a Demo
          </Link>
        </div>
        <p className="mt-6 text-white text-opacity-80">
          No credit card required. 14-day free trial.
        </p>
      </div>
    </section>
  );
};

export default CTA;
