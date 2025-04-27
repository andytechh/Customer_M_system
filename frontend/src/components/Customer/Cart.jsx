import { Users, BarChart2, Calendar, MessageCircle, Database, Shield } from 'lucide-react';
import axios  from 'axios';
import { useEffect, useState } from 'react';
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

const apiURL = "http://localhost/Customer_M_system/backend/api/products.php?action=";

const Cart = () => {
  const [product, setProducts] = useState([])
  const [loading, setLoading] = (true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetchCart();
  }, []);

  const fetchCart =  async () =>{
     
    try{
      const response = await axios.get(`${apiURL} viewCart`);
      if (!response.data.error && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        alert(response.data.message || "No products found");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setTimeout(() => setLoading(false), loadingDuration);
    }
  }



  return (
    <div>
      <section id="features" className="py-10 from-blue-100 to-indigo-50 bg-gradient-to-br">
      <div className="container mx-auto px-4">
        <div className="text-start mb-5">
          <p className="text-2xl font-semibold py-2">
            Shopping Cart()
          </p>
          <div className='flex justify-between w-full bg-accent px-10 py-3 card-hover'>
          <div className='flex max-w-50 w-full items-center gap-3'>
            <input type="checkbox" name="products"/> 
            <label htmlFor="products">Products</label>
          </div>
          <div className='flex w-full max-w-180 justify-between gap-10'>
            <p>Unit Price</p>
            <p>Quantity</p>
            <p>Total price</p>
            <p>Actions</p>
          </div>
          </div>
         
        </div>
        <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-6">
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
    </div>
  )
}

export default Cart
