import { BiUserCircle, BiShow } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { MdOutlineNumbers } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaPhone } from "react-icons/fa6";

const UserCard = ({ user }) => {
  return (
    <div className='border-2 border-gray-300 rounded-lg px-6 py-4 m-4 relative shadow-lg hover:shadow-2xl'>
      <h2 className='absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg'>
        {user.name}
      </h2>
      <h4 className='my-3 text-gray-600 font-semibold'>My Info's</h4>
      <div className='flex items-center gap-x-4 mb-2'>
        <BiUserCircle className='text-red-500 text-3xl' />
        <h2 className='text-lg font-medium'>{user.name} {user.surName}</h2>
      </div>
      <div className='flex items-center gap-x-4 mb-2'>
        <MdOutlineNumbers className='text-red-500 text-3xl' />
        <h2 className='text-lg font-medium'>{user.customerNumber}</h2>
      </div>
      <div className='flex items-center gap-x-4 mb-2'>
        <FaPhone className='text-red-500 text-3xl' />
        <h2 className='text-lg font-medium'>{user.phoneNumber}</h2>
      </div>
     
    </div>

    
  );
};

export default UserCard;