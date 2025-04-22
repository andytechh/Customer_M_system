
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault(); 
    console.log('Navigating to /admin-login'); 
    navigate('/admin-login'); 
  };

  return (
    <section className="py-12 md:py-24 bg-gradient-to-br from-blue-100 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Manage Customers <span className="text-gradient">Smarter</span>, Not Harder
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Streamline your customer relationships, boost engagement, and drive growth with our all-in-one customer management solution.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/customer-access" className="btn-primary text-center">
                Start Free Trial
              </Link>
              <Link to="/pricing" className="btn-secondary flex items-center justify-center">
                Plans <ChevronRight size={18} className="ml-1" />
              </Link>
            </div>
            <div className="mt-8 flex items-center text-gray-500 text-sm">
              <span className="mr-2">🔒</span>
              <p>No credit card required. 14-day free trial.</p>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="bg-white p-4 rounded-xl shadow-2xl animate-float ">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80" 
                alt="Techzio Dashboard" 
                className="rounded-lg"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center text-white text-xs">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">+2,500 companies</p>
                  <p className="text-xs text-gray-500">trust Techzio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
