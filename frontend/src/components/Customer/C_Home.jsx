import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
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
const apiURL3 = "http://localhost/Customer_M_system/backend/api/recommendations.php?action=";

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
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [carouselProducts, setCarouselProducts] = useState([]);

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError("Authentication required");
        return;
      }

      try {
        // Fetch all products
        const [productsRes, recRes] = await Promise.all([
          axios.get(`${apiURL}viewProducts`),
          axios.get(`${apiURL3}getRecommendations`, {
            params: { user_id: userId }
          })
        ]);

        if (!productsRes.data?.error) {
          setProducts(productsRes.data);
          filterProducts(productsRes.data);
        }

        // Handle recommendations
        let recommendations = [];
        if (recRes.data?.personalized) {
          recommendations = recRes.data.personalized;
        }

        // Handle carousel products
        let carouselItems = [];
        if (location.state?.recommendedProducts) {
          carouselItems = location.state.recommendedProducts;
        } else if (location.state?.selectedCategory) {
          const categoryRes = await axios.get(`${apiURL}fetchByCategory`, {
            params: { category: location.state.selectedCategory }
          });
          carouselItems = categoryRes.data;
        } else {
          carouselItems = recommendations;
        }

        // Fallback to random products if needed
        if (carouselItems.length < 4) {
          const randomRes = await axios.get(`${apiURL}fetchRandom`, {
            params: { limit: 4 - carouselItems.length }
          });
          carouselItems = [...carouselItems, ...randomRes.data];
        }

        setCarouselProducts(carouselItems.slice(0, 4));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  useEffect(() => {
    filterProducts(products);
  }, [searchQuery, products]);

  const filterProducts = (productsArray) => {
    const filtered = productsArray.filter(product => {
      const query = searchQuery.toLowerCase();
      return (
        product.pname.toLowerCase().includes(query) ||
        (product.brand?.toLowerCase().includes(query)) ||
        (product.description?.toLowerCase().includes(query))
      );
    });
    setFilteredProducts(filtered);
  };

  const constructImageUrl = (p_image) => {
    if (!p_image) return '/placeholder-product.jpg';
    if (p_image.startsWith('data:image/')) return p_image;
    if (p_image.includes('http')) return p_image;
    return `http://localhost/Customer_M_system/backend/uploads/${p_image}`;
  };

  const addToCart = async (productId) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("Please log in to add items to cart");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('action', 'addtocart');
      formData.append('product_id', productId);
      formData.append('quantity', 1);
      formData.append('variation', 'standard');
      formData.append('user_id', userId);

      const response = await axios.post(apiURL2, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.error) {
        throw new Error(response.data.message);
      }
      alert('Product added to cart!');
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
      console.error('Cart error:', err);
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-500">
      <p>Error: {error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );

  return (
<div className="flex h-[700px] max-w-7xl mx-auto border shadow-lg bg-white mt-8 font-sans py-10 from-blue-100 to-indigo-50 bg-gradient-to-br rounded-2xl">
 
<section className="py-20 from-blue-100 to-indigo-50 bg-gradient-to-br w-full">
<div className="container mx-auto px-4">
  <div className="mb-16">
    <Carousel className="w-full max-w-400 h-150">
      <CarouselContent>
        {carouselProducts.map((product) => (
          <CarouselItem key={product.product_id}>
            <div className="p-1 h-[500px] flex justify-center items-center">
              <Card className="max-h-full h-[500px] w-full max-w-5xl flex flex-row bg-white shadow-md rounded-lg overflow-hidden">
                <CardContent className="flex flex-col h-full p-6 w-full">
                  <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={constructImageUrl(product.p_image)}
                  alt={product.pname}
                  className="max-w-full max-h-[300px] object-contain p-4"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                    e.target.classList.add('object-contain', 'p-4');}} />
              </div>
              <div className="text-center mt-auto">
                <h4 className="text-xl font-bold truncate">{product.pname}</h4>
                <p className="text-gray-900 font-bold text-lg mt-2">
                  ₱{parseFloat(product.price).toFixed(2)}
                </p>
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
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No products found matching your search.
        </div>
      ) : (
        filteredProducts.map((product) => (
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
                src={constructImageUrl(product.p_image)}
                alt={product.pname} 
                className="w-full h-full rounded-lg object-cover"
              />
            </div>

            <h3 className="text-3xl font-bold mb-2 py-2">{product.pname}</h3>
            <p className="text-gray-600">{product.brand}</p>
            <Rating value={4.0} readOnly precision={0.5} />

            <div className='flex items-center mt-10 justify-between'>
              <p className="text-gray-900 font-bold text-2xl">
                ₱{parseFloat(product.price).toFixed(2)}
              </p>
              <button
                onClick={() => addToCart(product.product_id)}
                className='btn-secondary flex shadow-lg py-2 gap-1'
              >
                <ShoppingCart/> Add
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</section>
</div>
);
};

export default C_Home;