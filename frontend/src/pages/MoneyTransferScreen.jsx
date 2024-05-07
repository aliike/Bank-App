import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const MoneyTransferScreen = () => {
    const [balance, setBalance] = useState('');
    const [amount, setAmount] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [comment, setComment] = useState('');
    const [iban, setIban] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [addToAccountList, setAddToAccountList] = useState(false);
    const [savedAccountNames, setSavedAccountNames] = useState([]);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const currencyType = 'TRY';
    const transferType = 'EFT'

    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/account/${id}`)
            .then((response) => {
                setAccountNumber(response.data.accountNumber);
                setIban(response.data.iban);
                setLoading(false);
                setBalance(response.data.balance);
                const registeredIbans = response.data.registeredIbans;
                Promise.all(registeredIbans.map(cusNumber =>
                    axios.get(`http://localhost:5555/user/no/${cusNumber}`)
                        .then((response) => response.data)
                        .catch((error) => {
                            console.error('Error fetching user details:', error);
                            return null;
                        })
                )).then(users => {
                    setSavedAccountNames(users.filter(user => user !== null));
                });
               
            })
            .catch((error) => {
                setLoading(false);
                alert('An error happened. Please check console');
                console.log(error);
            });
    }, [id]);
    
    const isValidIbanString = (ibanString) => {
        const regex = /^TRXX XXXX XXXX XXX /;
        return regex.test(ibanString);
    };
    
    const handleBalance = () => {
        
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            enqueueSnackbar('Please enter a valid amount.', { variant: 'error' });
            return;
        }
        if (!iban || iban.trim() === '' || !isValidIbanString(iban)) {
            enqueueSnackbar('Please enter a valid IBAN format.', { variant: 'error' });
            return;
        }
        setConfirming(true);
    };

    const confirmTransfer = () => {
        const data = {
            amount,
            iban,
            comment,
            currencyType,
            transferType,
            addToAccountList
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


    const handleIbanChange = (selectedAccount) => {
        if (selectedAccount === '') {
            setIban('');
            return;
        }
    
        const selectedUser = savedAccountNames.find(user => user.customerNumber === selectedAccount);
        console.log(selectedUser)
        if (selectedUser) {
            setIban(`TRXX XXXX XXXX XXX ${selectedUser.customerNumber}`);
        }
    };
        
    return (
        <div className='p-4 bg-100 min-h-screen'>

            <div className='text-center'>
                <h1 className='text-3xl my-8'><em>Money Transfer (EFT/HAVALE/FAST)</em></h1>
            </div>

            {loading ? <Spinner /> : null}
            <div className='flex flex-col border border-gray-300 rounded-xl max-w-lg mx-auto p-6 bg-white'>
                <div className='border-2 border-gray-300 rounded-lg px-6 py-4 m-4 relative shadow-lg hover:shadow-2xl'>
                    <div className='text-gray-700 font-semibold'>
                        <div>Sender</div>
                        <div>{accountNumber}</div>
                        <div>Available Balance: {parseFloat(balance).toFixed(2)} ₺</div>
                    </div>
                </div>

                <div className='my-4'>
                    <select
                        id='select'
                        onChange={(e) => handleIbanChange(e.target.value)}
                        className='border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:border-sky-400'
                        placeholder='selectAccount'
                    >
                        <option value=''>Select Registered Account</option>
                        {savedAccountNames.map((user, index) => (
                            <option key={index} value={user.customerNumber}>
                                {user.name } {user.surName}
                            </option>
                        ))}
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
                        placeholder='Amount (₺)'
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

                <button className='p-2 bg-sky-400 text-white rounded-md hover:bg-sky-500 transition-colors duration-300' onClick={handleBalance}>
                    Send
                </button>

                {confirming && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Transfer Details</h2>
            <div className="mb-4">
                <p><span className="font-bold">Sender Account:</span> {accountNumber}</p>
                <p><span className="font-bold">Amount:</span> {amount} ₺</p>
                <p><span className="font-bold">To:</span> {iban}</p>
                <p><span className="font-bold">Fee:</span> {(amount * 0.05).toFixed(2)} {currencyType}</p>
                <p><span className="font-bold">Total:</span> {parseFloat((amount * 0.05).toFixed(2)) + parseFloat(amount)} {currencyType}</p>
            </div>
            <div className="flex items-center">
                <input
                    id="addToAccountList"
                    type="checkbox"
                    checked={addToAccountList}
                    onChange={() => setAddToAccountList(!addToAccountList)}
                    className="mr-2"
                />
                <label htmlFor="addToAccountList" className="text-sm">Add this IBAN to favorites</label>
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    className="mr-2 bg-red-500 text-white px-4 py-2 rounded-md text-sm shadow-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                    onClick={cancelTransfer}
                >
                    Cancel
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm shadow-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
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
};

export default MoneyTransferScreen;
