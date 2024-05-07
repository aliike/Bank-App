import { BiShow } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { MdAccountBalance, MdAccountBalanceWallet, MdHistoryEdu  } from "react-icons/md";
import { GiBank } from "react-icons/gi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdLibraryAdd } from "react-icons/md";
import { FaSwift } from "react-icons/fa";
import React, { useState, useEffect } from 'react';


const AccountCard = ({ account }) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false); // Bakiye görünürlüğünü saklayan durum

  return (
    <div className='border-2 border-gray-300 rounded-lg px-6 py-4 m-4 relative shadow-lg hover:shadow-2xl'>
      <h2 className='absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg'>
        {account.customerNumber}
      </h2>
      <h4 className='my-3 text-gray-600 font-semibold'>My Account</h4>
      <div className='flex items-center gap-x-4 mb-2'>
        <MdAccountBalance className='text-red-500 text-3xl' />
        <h2 className='text-lg font-medium'>{account.accountNumber}</h2>
      </div>
      <div className='flex items-center gap-x-4 mb-2'>
        <GiBank className='text-red-500 text-3xl' />
        <h2 className='text-lg font-medium'>{account.ibanNumber}</h2>
      </div>
      <div className='flex items-center gap-x-4 mb-2'>
      <MdAccountBalanceWallet className='text-red-500 text-3xl' />
        <h2 className='text-lg font-medium'>
          {isBalanceVisible ? (account.balance).toFixed(2) + ' ₺' : '******'}
        </h2>
        <button onClick={() => setIsBalanceVisible(!isBalanceVisible)}>
          <BiShow className='text-blue-800 text-3xl hover:text-black cursor-pointer' />
        </button>

      </div>
      
      <div className='flex justify-end space-x-4 mt-4'>
        <Link to={`/swiftTransfer/${account._id}`}>
          <FaSwift className='text-green-800 text-3xl hover:text-black' />
        </Link>
        <Link to={`/history/${account.customerNumber}`}>
          <MdHistoryEdu className='text-yellow-600 text-3xl hover:text-black' />
        </Link>
        <Link to={`/transfer/${account._id}`}>
          <FaMoneyBillTransfer className='text-red-600 text-3xl hover:text-black' />
        </Link>
        <Link to={`/createInvestmentAccount/${account._id}`}>
          <MdLibraryAdd className='text-red-600 text-3xl hover:text-black' />
        </Link>
      </div>
    </div>
  );
};

export default AccountCard;