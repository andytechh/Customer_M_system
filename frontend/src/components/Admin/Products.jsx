import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiURL = "http://localhost/Customer_M_system/backend/api/products.php?action=";

const Products = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loadingDuration] = useState(2000);
  const [editingProducts, setEditingProducts] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    pname: "",
    pdescription: "",
    price: "",
    pimage: null,
    pcreated: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiURL}viewProducts`);
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
  };

  const validateForm = () => {
    const { pname, pdescription, price, pimage, pcreated } = formData;
    
    if (!pname || !pdescription || !price || !pcreated) {
      alert("Please fill out all fields.");
      return false;
    }
    if (pimage && !['image/jpeg', 'image/png', 'image/gif'].includes(pimage.type)) {
      alert("Invalid file type. Only JPG, PNG, and GIF images are allowed.");
      return false;
    }

    return true;
};

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("pname", formData.pname);
      formDataToSend.append("pdescription", formData.pdescription);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stocks", formData.stocks);
      formDataToSend.append("pimage", formData.pimage);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("pcreated", formData.pcreated);
      
     //console.log("FormData:", formDataToSend);
      for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}: ${value}`);
      }
      const response = await axios.post(
        `${apiURL}addProduct`,
        formDataToSend
      );

      console.log("Backend Response:", response.data); // Debugging line
      alert(response.data.message);
      setOpenModal(false);
      fetchProducts(); 
    } catch (err) {
      console.error("Error:", err.response?.data || err.message); // checkpoint
      alert(err.response?.data?.message || "Failed to add product.");
    }
  };

  const handleUpdate =  async (e) =>{
    e.preventDefault();
  try{
      const formData = new FormData();
      formData.append("product_id", editingProducts.product_id);
      formData.append("pname", editingProducts.pname);
      formData.append("pdescription", editingProducts.pdescription);
      formData.append("price", editingProducts.price);
      formData.append("stocks", editingProducts.stocks);
      formData.append("brand", editingProducts.brand);
      formData.append("pimage", editingProducts.pimage);
      const res = await axios.post("http://localhost/Customer_M_system/backend/api/products.php?action=updateProduct", formData);

      alert(res.data.message);
      if(!res.data.error){
        setEditingProducts(null);
        setEditModal(false);
        fetchProducts();
      }  
  }  catch (err){
    console.error(err);
    alert("Failed to Update product..");
  }
  };

  const del = async(id) =>{
    if(window.confirm('Are you sure you want to delete this product?')){
      if(!id){
        alert('Invalid product Id..');
        return;
      }
      console.log('Deleting product with ID:', id);
      try{
        const formData = new URLSearchParams();
        formData.append('productId', id);
        const res = await axios.post(
          'http://localhost/Customer_M_system/backend/api/products.php?action=deleteProduct',
          formData
        );
        alert(res.data.message);
        if(!res.data.error){
          fetchProducts();
        }
      }catch(err){
        console.error(err);
        alert('Error Deleting Product');
      }
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading Products...</p>;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-100 min-w-300">
      <div className="w-full min-w-100 flex flex-col mb-4 bg-white rounded-lg shadow-lg p-6">
        <div className="w-full flex items-center justify-between bg-gray-300 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold">Products</h2>
          <button onClick={() => setOpenModal(true)} className="btn-secondary shadow-lg">
            Add Products
          </button>
        </div>

          {/* Edit Customer Modal */}
      {editModal && editingProducts && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
            <button onClick={() => setEditModal(false)} className="absolute top-2 right-2 p-3 text-gray-500 hover:text-gray-700">
              X
            </button>
            <h2 className="text-xl font-bold mb-3">Update Product</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="Product Name" className="mb-1 text-sm font-medium text-gray-700">Product name</label>
                  <input
                    id="pname"
                    type="text"
                    value={editingProducts.pname}
                    onChange={(e) => setEditingProducts ({ ...editingProducts, pname: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Price" className="mb-1 text-sm font-medium text-gray-700">Price</label>
                  <input
                    id="price"
                    type="number"
                    value={editingProducts.price}
                    onChange={(e) => setEditingProducts({ ...editingProducts, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Product price"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Stocks" className="mb-1 text-sm font-medium text-gray-700">Stocks</label>
                  <input
                    id="stocks"
                    type="number"
                    value={editingProducts.stocks}
                    onChange={(e) => setEditingProducts({ ...editingProducts, stocks: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Number of stocks"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Brands" className="mb-1 text-sm font-medium text-gray-700">Brands</label>
                  <select
                    id="brand"
                    required
                    value={editingProducts.brand}
                    onChange={(e) => setEditingProducts({ ...editingProducts, brand: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Category</option>
                    <option value="dell"> Dell</option>
                    <option value="hp">HP</option>
                    <option value="lenovo">Lenovo</option>
                    <option value="asus">Asus</option>
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label htmlFor="Product image" className="mb-1 text-sm font-medium text-gray-700">Product Image</label>
                  <input
                    id="pimage"
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditingProducts({ ...editingProducts, pimage: file });
                      }
                    }}
                  />
               </div>
                </div>
                <div className="flex flex-col items-start ">
                <label htmlFor="Description" className="mb-1 text-sm font-medium text-gray-700">Product description</label>
                <input
                  id="pdescription" // Fixed typo here
                  type="text"
                  value={editingProducts.pdescription}
                  onChange={(e) => setEditingProducts({ ...editingProducts, pdescription: e.target.value })}
                  className="w-full h-20 px-4 py-3 border flex flex-wrap min-w-1/2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Description"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">Save</button>
                <button type="button" onClick={() => setEditModal(false)} className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

        {openModal && (
          <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-[#1CB5E0] p-3 mr-2"
              >
                X
              </button>
              <h3 className="text-lg font-semibold mb-4">New Product</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setFormData({ ...formData, pname: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setFormData({ ...formData, pdescription: e.target.value })}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                 <input
                  type="number"
                  placeholder="Stocks"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setFormData({ ...formData, stocks: e.target.value })}
                />

                  <select
                    required
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Category</option>
                    <option value="dell"> Dell</option>
                    <option value="hp">HP</option>
                    <option value="lenovo">Lenovo</option>
                    <option value="asus">Asus</option>
                  </select>
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        //console.log("Selected File:", file); 
                        setFormData({ ...formData, pimage: file });
                    } else {
                        console.error("No file selected.");
                    }
                }}
                  />
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setFormData({ ...formData, pcreated: e.target.value })}
                />
                <button type="submit" className="w-full px-6 py-3 btn-secondary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-gray-300 rounded-lg shadow-md w-full max-h-[600px] mt-10">
          <table className="min-w-full text-sm border-collapse border border-gray-300">
            <caption className="text-lg font-bold text-center p-4">Product List</caption>
            <thead className="bg-[#0E1336] text-white sticky top-0 ">
              <tr className="">
                <th className="p-4  whitespace-nowrap">Product ID</th>
                <th className="p-4  whitespace-nowrap">Product Name</th>
                <th className="p-4  whitespace-nowrap">Product Brand</th>
                <th className="p-4  whitespace-nowrap">Price</th>
                <th className="p-4  whitespace-nowrap">Stocks</th>
                <th className="p-4  whitespace-nowrap">Image</th>
                <th className="p-4  whitespace-nowrap">Created At</th>
                <th className="p-4  whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400">
              {products.map((product) => (
                <tr key={product.product_id} className="border-b bg-white even:bg-gray-100 text-center">
                  <td className="p-2  whitespace-nowrap">{product.product_id}</td>
                  <td className="p-2  whitespace-nowrap">{product.pname}</td>
                  <td className="p-2  whitespace-nowrap">{product.brand}</td>
                  <td className="p-2  whitespace-nowrap">₱{product.price}</td>
                  <td className="p-2  whitespace-nowrap">{product.stocks}</td>
                  <td className="p-2  whitespace-nowrap flex items-center justify-center">
                    <img 
                      src={`http://localhost/Customer_M_system/backend/uploads/${product.p_image}`} 
                      alt={product.pname} 
                      className="w-20 h-20 object-cover whitespace-nowrap" 
                    />
                  </td>
                  <td className="p-2  whitespace-nowrap">{new Date(product.created_at).toLocaleString()}</td>
                  <td className="p-2 space-x-2">
                    <div className="flex flex-row justify-center items-center gap-2">
                    <button onClick={() => {
                            setEditingProducts(product);
                            setEditModal(true);
                          }} className="btn-secondary shadow-lg">Edit</button>
                    <button onClick={() => del(product.product_id)}  className="btn-secondary shadow-lg">Delete</button>
                    </div>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;