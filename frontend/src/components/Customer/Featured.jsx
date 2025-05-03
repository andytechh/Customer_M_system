import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const apiURL = 'http://localhost/Customer_M_system/backend/api/products.php?action=';

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await axios.get(`${apiURL}recommendations`, {
          params: { user_id: userId }
        });
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {featuredProducts.map(product => (
          <div key={product.id} className="border rounded-lg p-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover mb-2"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">₱{product.price}</p>
            <button className="mt-2 btn-primary w-full">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;