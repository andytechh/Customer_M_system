import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Rating from '@mui/material/Rating';
import { Heart, ShoppingCart } from 'lucide-react';

const apiURL = "http://localhost/Customer_M_system/backend/api/products.php?action=";
const apiURL2 = "http://localhost/Customer_M_system/backend/api/orders.php?action=";
const WishlistButton = ({ productId, isLiked, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(productId)}
      className="p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
      aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`w-6 h-6 stroke-2 ${
          isLiked 
            ? 'fill-red-600 stroke-red-600 animate-float' 
            : 'stroke-gray-700 fill-transparent hover:stroke-red-600'
        } transition-colors duration-300`}
      />
    </button>
  );
};

const C_Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [user_Id, setUser_Id] = useState(null);

  useEffect(() => {

    fetchProducts();
    const userId = localStorage.getItem('userId');
    setUser_Id(userId);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiURL}viewProducts`);
      if (!response.data.error && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        alert(response.data.message || "No products found");
      }
    } catch(error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };
  const addToCart = async (productId) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("You're not logged in. Please log in first.");
      return;
    }
  
    try {
      const formData = new FormData();
      console.log("working here");
      formData.append('action', 'addtocart');
      console.log("fuck up here");
      formData.append('product_id', productId);
      formData.append('quantity', 1);
      formData.append('variation', 'standard');
      formData.append('user_id', userId);
  
      const response = await axios.post(`${apiURL2}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data.error) {
        alert(`Error: ${response.data.message}`);
      } else {
        alert('Product added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to cart.');
    }
  };
  
  
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  if (loading) return <p className="text-center text-gray-600">Loading Products...</p>;

  return (
    <div>
      <section id="features" className="py-20 from-blue-100 to-indigo-50 bg-gradient-to-br">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-16 w-full justify-center">
            <Carousel className="w-full max-w-300 h-150">
              <CarouselContent>
                {products.slice(0, 5).map((product) => (
                  <CarouselItem key={product.product_id}>
                    <div className="p-1">
                      <Card className='w-300 h-150'>
                        <CardContent className="flex items-center justify-center p-6 ">
                          <div className="max-w-full w-full max-h-full h-120">
                            <img
                              src={`http://localhost/Customer_M_system/backend/uploads/${product.p_image}`} 
                              alt={product.pname} 
                              className="w-full h-full rounded-lg object-cover"
                            />
                            <div className="flex items-center gap-10">  
                              <h4 className="text-2xl font-bold mb-2 py-2">{product.pname}</h4>
                              <p className="text-gray-900 font-bold text-2xl">₱{product.price}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <h3 className="text-2xl font-bold py-10">Featured Products</h3>  
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {products.map((product) => (
              <div key={product.product_id} className="feature-card flex flex-col py-5 px-5">
                <div className="flex w-full items-center py-1 justify-end">
                  <WishlistButton 
                    productId={product.product_id}
                    isLiked={wishlist.includes(product.product_id)}
                    onToggle={toggleWishlist}
                  />
                </div>
                
                <div className="max-w-full w-full max-h-full h-80">
                  <img
                    src={`http://localhost/Customer_M_system/backend/uploads/${product.p_image}`} 
                    alt={product.pname} 
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>

                <h3 className="text-3xl font-bold mb-2 py-2">{product.pname}</h3>
                <p className="text-gray-600">{product.brand}</p>
                <Rating value={4.0} readOnly precision={0.5} />

                <div className='flex flex-row items-center mt-10 w-full justify-between'>
                  <div>
                    <p className="text-gray-900 font-bold text-2xl">₱{product.price}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product.product_id)}
                    className='btn-secondary flex shadow-lg w-1/3 py-2 gap-1'
                  >
                    <ShoppingCart/> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default C_Home;