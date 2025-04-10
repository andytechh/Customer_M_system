// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const apiURL = 'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=view';

// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await axios.get(apiURL);
//         if (!response.data.error) {
//           setCustomers(response.data.users); 
//         } else {
//           alert(response.data.message);
//         }
//       } catch (error) {
//         console.error('Error fetching customers:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   if (loading) return <p className="text-center text-gray-600">Loading customers...</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Customer List</h2>
//       <table className="min-w-full border border-gray-300 text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Username</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Account Status</th>
//             <th className="border p-2">Time Created</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.map((c, i) => (
//             <tr key={i} className="hover:bg-gray-50">
//               <td className="border p-2">{c.uname}</td>
//               <td className="border p-2">{c.username}</td>
//               <td className="border p-2">{c.email}</td> 
//               <td className="border p-2">{c.ustatus}</td>
//               <td className="border p-2">{c.created_at}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Customers;

import React from 'react'

const Customers = () => {
  return (
    <div>
      Customers Page
    </div>
  )
}

export default Customers
