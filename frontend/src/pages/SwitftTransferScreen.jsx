import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const SwitftTransferScreen = () => {

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [comment, setComment] = useState('');
  const [iban, setIban] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [currencyType, setCurrencyType] = useState('TRY');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const transferType = 'SWIFT';

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/account/${id}`)
      .then((response) => {
        setAccountNumber(response.data.accountNumber);
        setIban(response.data.iban);
        setLoading(false);
        setBalance(response.data.balance);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  }, [id]);

  const handleBalance = () => {
    setConfirming(true);
  };

  const confirmTransfer = () => {
    const data = {
      amount,
      iban,
      comment,
      currencyType,
      transferType,
    };
    setLoading(true);
    axios
      .put(`http://localhost:5555/account/applyTransformation/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Transfer completed successfully.', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.response ? error.response.data.message : 'An error occurred';
        enqueueSnackbar(errorMessage, { variant: 'error' });
        console.log(error);
      });
    setConfirming(false); 
  };

  const cancelTransfer = () => {
    setConfirming(false); 
  };

  const handleCurrencyChange = (event) => {
    setCurrencyType(event.target.value);
  };

  return (
    <div className='p-4 bg-100 min-h-screen'>
     
      <div className='text-center'>
        <h1 className='text-3xl my-8'><em>Money Transfer (SWIFT)</em></h1>
      </div>
      {loading ? <Spinner /> : null}
      <div className='flex flex-col border border-gray-300 rounded-xl max-w-lg mx-auto p-6 bg-white'>
        <div className='border-2 border-gray-300 rounded-lg px-6 py-4 m-4 relative shadow-lg hover:shadow-2xl'>
          <div className='text-gray-700 font-semibold'>
            <div>Sender</div>
            <div>{accountNumber}</div>
            <div>Available Balance: {balance.toFixed(2)} ₺ / {(balance / 32).toFixed(2)} $ / {(balance / 35).toFixed(2)} €</div>
          </div>
        </div>
        <div className='my-4'>
          <select
            value={currencyType}
            onChange={handleCurrencyChange}
            className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-sky-400'
          >
            <option value='TRY'>₺ (Turkish Lira)</option>
            <option value='USD'>$ (US Dollar)</option>
            <option value='EUR'>€ (Euro)</option>
          </select>
        </div>

        <div className='my-4'>
          <input
            id='iban'
            type='text'
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-sky-400'
            placeholder='IBAN'
          />
        </div>

        <div className='my-4'>
          <input
            id='amount'
            type='text'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-sky-400'
            placeholder='Amount'
          />
        </div>

        <div className='my-4'>
          <input
            id='comment'
            type='text'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-sky-400'
            placeholder='Comment'
          />
        </div>
        <div className='my-4'>
          <input
            id='swiftcode'
            type='text'
            value='BANK SWIFT CODE: TGBATRISXXX'
            disabled
            className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-sky-400'
            placeholder='Bank Swift Code'
          />
        </div>

        <button className='p-2 bg-sky-400 text-white rounded-md hover:bg-sky-500 transition-colors duration-300' onClick={handleBalance}>
          Send
        </button>
        {confirming && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg max-w-md">
              <p className="font-bold text-center">Transfer Details</p>
              <br></br>
              <p><span className="font-bold">Sender Account:</span> {accountNumber}</p>
              <p><span className="font-bold">To:</span> {iban}</p>
              <p><span className="font-bold">Amount:</span> {amount} {currencyType}</p>
              <p><span className="font-bold">Fee:</span> {(amount * 0.05).toFixed(2)} {currencyType}</p>
              <p><span className="font-bold">Total:</span> {parseFloat((amount * 0.05).toFixed(2)) + parseFloat(amount)} {currencyType}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="mr-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                  onClick={cancelTransfer}
                >
                  Cancel
                </button>
                <button
                  className="bg-sky-500 text-white px-3 py-1 rounded-md text-sm"
                  onClick={confirmTransfer}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SwitftTransferScreen;