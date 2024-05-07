import InvestmentSingleModal from '../InvestmentSingleModal';
import { useState } from 'react';
import { BiUserCircle, BiShow } from 'react-icons/bi';
import { AiOutlineUser } from 'react-icons/ai';
import { TbListDetails } from "react-icons/tb";



const InvestmentAccountCard = ({ investmentAccount }) => {
  const [showModal, setShowModal] = useState(new Array(investmentAccount.length).fill(false));

  return (
    <div className='border-2 border-gray-300 rounded-lg px-6 py-4 m-4 relative shadow-lg hover:shadow-2xl w-1/4 mx-auto'>
      <div className="pb-4">My Investment Accounts</div>
      {investmentAccount.length === 0 ? (
        <div className="text-center mt-4">
          <text className="text-black font-bold py-2 px-4 rounded">
            You don't have any investment account.
          </text>
        </div>
      ) : (
        investmentAccount.map((account, index) => (
          <div key={index} className="rounded-lg overflow-hidden border-2 border-gray-300 mb-4 flex items-center pl-4">
            <h4 className='text-gray-600 font-semibold flex-grow'>{account.accountName}</h4>
            <TbListDetails
              className='text-3xl text-blue-800 hover:text-black cursor-pointer'
              onClick={() => {
                const updatedShowModal = [...showModal]; 
                updatedShowModal[index] = true; 
                setShowModal(updatedShowModal); 
              }}
            />
            {showModal[index] && ( 
              <InvestmentSingleModal account={account} onClose={() => {
                const updatedShowModal = [...showModal]; 
                updatedShowModal[index] = false; 
                setShowModal(updatedShowModal); 
              }} />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default InvestmentAccountCard;