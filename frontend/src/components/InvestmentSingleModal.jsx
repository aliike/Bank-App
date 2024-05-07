import React from 'react';
import { IoMdClose } from "react-icons/io";
import { FcInfo } from "react-icons/fc";

const InvestmentSingleModal = ({ account, onClose }) => {
    return (
        <div
          className='fixed bg-opacity-60 bg-gray-200 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center'
          onClick={onClose}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className='w-[600px] max-w-full h-[400px] bg-white rounded-xl p-4 flex flex-col relative'
          >
            <IoMdClose
              className='absolute right-6 top-6 text-3xl text-red-600 cursor-pointer'
              onClick={onClose}
            />
             <div className='flex items-center my-2'>
              <FcInfo className='text-red-300 text-2xl mr-2' />
              <p className='text-gray-700'><strong>Account Name:</strong> {account.accountName}</p>
            </div>
            <div className='flex items-center my-2'>
              <FcInfo className='text-red-300 text-2xl mr-2' />
              <p className='text-gray-700'><strong>Linked Account:</strong> {account.connectedAccount}</p>
            </div>
            <div className='flex items-center my-2'>
              <FcInfo className='text-red-300 text-2xl mr-2' />
              <p className='text-gray-700'><strong>Account Currency Type:</strong> {account.accountCurrencyType}</p>
            </div>
            <div className='flex items-center my-2'>
              <FcInfo className='text-red-300 text-2xl mr-2' />
              <p className='text-gray-700'><strong>Created At: </strong> {account.createdAt}</p>
            </div>
            <p className='my-4 text-gray-700'></p>
            <p className='text-gray-700'>
            Please note that investing in financial markets carries inherent risks. 
            The value of your investments can fluctuate, and you may end up with less than you initially invested. 
            It's important to thoroughly research and understand the investment products you are considering, and to consider 
            seeking advice from a qualified financial advisor before making any investment decisions.
            </p>
          </div>
        </div>
      );
}

export default InvestmentSingleModal;