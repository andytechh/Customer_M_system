import { Users, BarChart2, Calendar, MessageCircle, Database, Shield } from 'lucide-react';
import axios  from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const apiURL = "http://localhost/Customer_M_system/backend/api/products.php?action=";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert("You're not logged in. Please log in first.");
      return;
    }
  
    try {
      const response = await axios.get(`${apiURL}viewcart`, {
        params: { user_id: userId }
      });
  
  
      if (!response.data.error && Array.isArray(response.data)) {
        setCart(response.data);
      } else {
       //alert("No products found");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };
  const removeFromCart = async (cartId) => {
    try {
      const response = await axios.post(`${apiURL}removeFromCart`, {
        cart_id: cartId
      });
  
      if (!response.data.error) {
        alert("Item removed from cart successfully!");
        fetchCart(); // Refresh the cart
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("An error occurred while removing the item.");
    }
  };


const handleQuantityChange = (cartId, newQuantity) => {
  setCart((prevCart) =>
    prevCart.map((item) =>
      item.cart_id === cartId ? { ...item, quantity: parseInt(newQuantity, 10) } : item
    )
  );
};

const buyNow = async (cartId) => {
  try {
    const response = await axios.post(`${apiURL}purchase`, {
      cart_id: cartId
    });

    if (!response.data.error) {
      alert("Purchase successful!");
      navigate('/my-orders');
    } else {
      alert(`Error: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Purchase error:", error);
    alert("An error occurred during purchase.");
  }
};

const saveQuantity = async (cartId, newQuantity) => {
  try {
    const response = await axios.post(`${apiURL}updateQuantity`, {
      cart_id: cartId,
      quantity: newQuantity
    });

    if (!response.data.error) {
      alert('Quantity updated successfully!');
      fetchCart(); // Refresh the cart
    } else {
      alert(`Error: ${response.data.message}`);
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    alert('An error occurred while updating the quantity.');
  }
};

  return (
    <div>
      <section id="features" className="py-10 from-blue-100 to-indigo-50 bg-gradient-to-br rounded-2xl">
        <div className="container mx-auto px-4">
          <div className="text-start mb-5">
            <p className="text-2xl font-semibold py-3 font-sans">Shopping Cart</p>
            <div className="flex justify-between w-full bg-accent px-10 py-3 card-hover">
              <div className="flex max-w-40 w-full items-center gap-3">
                <input type="checkbox" name="products" />
                <label htmlFor="products">Products</label>
              </div>
              <div className="flex w-full max-w-250 justify-between gap-10">
                <p>Unit Price</p>
                <p>Quantity</p>
                <p>Total Price</p>
                <p>Actions</p>
              </div>
            </div>
          </div>
          <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-6">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.cart_id} className="feature-card flex flex-row justify-between items-start p-4 border rounded-lg shadow-md">
                  {/* Product Image */}
                  <div className='flex gap-4'>
                    <input className='ml-5' type="checkbox" />
                  <img
                    src={`http://localhost/Customer_M_system/backend/uploads/${item.p_image}`}
                    alt={item.pname}
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                  {/* Product Name */}
                  <h3 className="text-xl font-semibold my-2">{item.pname}</h3>
                  </div>
                  {/* Unit Price */}
                  <p className="text-gray-600">₱{item.price}</p>
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                  <label htmlFor={`quantity-${item.cart_id}`}>Quantity:</label>
                  <input
                    type="number"
                    id={`quantity-${item.cart_id}`}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.cart_id, e.target.value)}
                    className="border rounded px-2 py-1 w-20"
                  />
                  <button
                    className="btn-secondary"
                    onClick={() => saveQuantity(item.cart_id, item.quantity)}
                  >
                    Save
                  </button>
                </div>
                  {/* Total Price */}
                  <p className="text-green-600 font-bold">Total: ₱{item.price * item.quantity}</p>
                  {/* Actions */}
                  <div className='flex flex-col justify-between h-full'>
                  <button
                    className="btn-secondary mt-2"
                    onClick={() => removeFromCart(item.cart_id)}
                  >
                    Remove
                  </button>
                
                  <button
                    className="btn-secondary mt-2"
                    onClick={() => buyNow(item.cart_id)}
                  >
                    Buy now
                  </button>  
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart
