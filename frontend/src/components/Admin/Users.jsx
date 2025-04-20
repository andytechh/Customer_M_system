import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Get user_Id from URL
import { SquarePen, Trash2, Send } from 'lucide-react';


const Users = () => {
  const { user_Id } = useParams(); // Assumes route like /users/:user_Id
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost/Customer_M_system/backend/api/indexLogin.php?action=viewUser&user_id=${user_Id}`
        );

        if (!res.data.error) {
          setUser(res.data.user);
        } else {
          console.error(res.data.message);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user_Id]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await axios.post(
          'http://localhost/Customer_M_system/backend/api/indexLogin.php?action=deleteUser',
          { user_id: userId }
        );

        if (!res.data.error) {
          alert('User deleted successfully!');
          window.location.href = '/users'; // Redirect to users list
        } else {
          alert(res.data.message || 'Failed to delete user');
        }
      } catch (err) {
        alert('Error deleting user: ' + err.message);
        console.error('Error deleting user:', err);
      }
    }
  };
  return (
    <div className='bg-gray-300 min-h-[90vh] flex-col justify-center overflow-hidden max-h-full w-full'>       
      <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg mb-4 gap-10 w-full ">
        <div className='flex items-center gap-4 ' >
        <img className
        ='rounded-full w-20 h-20 ml-10 mr-3' src="/src/assets/solo.jpg" alt="sda" />
      {loading ? (
        <p>Loading...</p>
      ) : !user ? (
        <p>User not found.</p>
      ) : (
        <p className='text-2xl max-w-40 w-full'><strong>{user.uname}</strong> </p>
      )}

        </div>
       <div className='flex gap-3 mr-10'>
       <button className="btn-secondary w-1/1 py-2 rounded-lg"><SquarePen size={20}/></button>
       <button onClick={() => handleDelete(user.user_id)} className="btn-alternative1 w-2/2 py-2 rounded-lg"> <Trash2 size={20}/></button>
       <button className="btn-alternative w-2/2 py-2 rounded-lg"> <Send size={20}/></button>
       </div>
    
      </div>
      <div className="flex flex-row justify-around gap-4 p-4">
      <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Info</h2>
      {loading ? (
        <p>Loading...</p>
      ) : !user ? (
        <p>User not found.</p>
      ) : (
        <div className="flex flex-col gap-6 text-lg d p-5 rounded-lg card-hover h-100 w-90">
          <p><strong className='mr-2'>User ID:</strong> {user.user_id}</p>
          <p><strong className='mr-2'>Username:</strong> {user.username}</p>
          <p><strong className='mr-2'>Email:</strong> {user.email}</p>
          <p><strong className='mr-2'>Contact:</strong> {user.contacts}</p>
          <p><strong className='mr-2'>Status:</strong> {user.ustatus}</p>
          <p><strong className='mr-2'>Role:</strong> {user.roles}</p>
          <p><strong className='mr-2'>Created At:</strong> {user.created_at}</p>
        </div>
      )}
    </div>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : !user ? (
        <p>User not found.</p>
      ) : (
        <div className="flex gap-10 p-2 rounded-lg w-150 card-hover">
          <table className='min-w-full text-sm border-collapse border h-20 border-gray-300'>
            <thead>
              <tr className='bg-gray-200 '>  
                <th className='p-3 whitespace-nowrap mr-10'>Order Id</th>
                <th className='p-2 whitespace-nowrap'>Price</th>
                <th className='p-2 whitespace-nowrap'>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='p-2 text-center whitespace-nowrap'>1</td>
                <td className='p-2 text-center whitespace-nowrap'>2</td>
                <td className=' p-2 text-center whitespace-nowrap'>3</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
      </div>
    </div>
   
  );
};

export default Users;
